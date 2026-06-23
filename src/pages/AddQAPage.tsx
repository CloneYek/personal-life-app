import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { StatusBarSpacer } from '../components/layout/StatusBarSpacer';
import { useQA } from '../contexts/QAContext';
import { QA_CATEGORIES } from '../utils/constants';
import type { QACategory } from '../types';
import styles from './AddQAPage.module.css';

export function AddQAPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const { addQA, updateQA, getQAById } = useQA();

  const isEditMode = !!id;
  const existingItem = id ? getQAById(id) : undefined;

  const [category, setCategory] = useState<QACategory>('java-basic');
  const [question, setQuestion] = useState('');
  const [answerBrief, setAnswerBrief] = useState('');
  const [details, setDetails] = useState<string[]>(['']);

  // Edit mode: pre-fill form with existing data
  useEffect(() => {
    if (isEditMode && existingItem) {
      setCategory(existingItem.category);
      setQuestion(existingItem.question);
      setAnswerBrief(existingItem.answerBrief);
      setDetails(
        existingItem.answerDetail.length > 0
          ? [...existingItem.answerDetail]
          : ['']
      );
    }
  }, [isEditMode, existingItem]);

  const canSave = question.trim().length > 0 && answerBrief.trim().length > 0;

  const handleAddDetail = () => {
    setDetails((prev) => [...prev, '']);
  };

  const handleRemoveDetail = (idx: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDetailChange = (idx: number, value: string) => {
    setDetails((prev) => prev.map((d, i) => (i === idx ? value : d)));
  };

  const handleSave = () => {
    if (!canSave) return;
    const filteredDetails = details.map((d) => d.trim()).filter((d) => d.length > 0);
    const payload = {
      category,
      question: question.trim(),
      answerBrief: answerBrief.trim(),
      answerDetail: filteredDetails.length > 0 ? filteredDetails : [answerBrief.trim()],
    };

    if (isEditMode && existingItem) {
      updateQA({ ...existingItem, ...payload });
    } else {
      addQA(payload);
    }
    navigate(-1);
  };

  return (
    <div className={styles.page}>
      <StatusBarSpacer />

      {/* 顶部导航 */}
      <div className={styles.topNav}>
        <button className={styles.backBtn} onClick={() => navigate(-1)} aria-label="返回">
          <span className={styles.backArrow}>←</span>
        </button>
        <span className={styles.navTitle}>
          {isEditMode ? '编辑知识点' : '新增知识点'}
        </span>
      </div>

      {/* 分类选择 */}
      <div className={styles.section}>
        <label className={styles.label}>分类</label>
        <div className={styles.categoryList}>
          {QA_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`${styles.categoryChip} ${
                category === cat.value ? styles.categoryActive : ''
              }`}
              onClick={() => setCategory(cat.value)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 问题输入 */}
      <div className={styles.section}>
        <label className={styles.label}>问题</label>
        <input
          className={styles.textInput}
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="输入面试题或知识点……"
          autoFocus
        />
      </div>

      {/* 简要答案 */}
      <div className={styles.section}>
        <label className={styles.label}>简要答案</label>
        <input
          className={styles.textInput}
          type="text"
          value={answerBrief}
          onChange={(e) => setAnswerBrief(e.target.value)}
          placeholder="一句话概括答案……"
        />
      </div>

      {/* 详细要点 */}
      <div className={styles.section}>
        <label className={styles.label}>详细要点</label>
        <div className={styles.detailList}>
          {details.map((detail, idx) => (
            <div key={idx} className={styles.detailRow}>
              <span className={styles.bulletDot}>{idx + 1}</span>
              <input
                className={styles.detailInput}
                type="text"
                value={detail}
                onChange={(e) => handleDetailChange(idx, e.target.value)}
                placeholder={`要点 ${idx + 1}……`}
              />
              {details.length > 1 && (
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveDetail(idx)}
                  aria-label="删除要点"
                  type="button"
                >
                  <X size={14} color="var(--color-text-muted)" strokeWidth={2} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button className={styles.addDetailBtn} onClick={handleAddDetail} type="button">
          <Plus size={14} color="var(--color-primary)" strokeWidth={2.5} />
          <span>添加要点</span>
        </button>
      </div>

      {/* 保存按钮 */}
      <div className={styles.saveSection}>
        <button
          className={`${styles.saveBtn} ${!canSave ? styles.saveBtnDisabled : ''}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          {isEditMode ? '保存修改' : '保存知识点'}
        </button>
      </div>
    </div>
  );
}
