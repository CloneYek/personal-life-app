import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { StatusBarSpacer } from '../components/layout/StatusBarSpacer';
import { SearchBar } from '../components/shared/SearchBar';
import { QACard } from '../components/shared/QACard';
import { EmptyState } from '../components/shared/EmptyState';
import { useQA } from '../contexts/QAContext';
import { QA_CATEGORIES } from '../utils/constants';
import type { QACategory } from '../types';
import styles from './InterviewPrepPage.module.css';

export function InterviewPrepPage() {
  const navigate = useNavigate();
  const { qaItems, deleteQA } = useQA();
  const [activeCategory, setActiveCategory] = useState<QACategory>('java-basic');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    let result = qaItems.filter((item) => item.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.question.toLowerCase().includes(q) ||
          item.answerBrief.toLowerCase().includes(q)
      );
    }
    return result;
  }, [qaItems, activeCategory, searchQuery]);

  return (
    <div className={styles.page}>
      <StatusBarSpacer />

      {/* 顶部标题 */}
      <div className={styles.header}>
        <h1 className={styles.title}>八股笔记</h1>
        <p className={styles.subtitle}>计算机基础 · 面试必备</p>
      </div>

      {/* 分类标签栏 */}
      <div className={styles.categoryBar}>
        {QA_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={`${styles.categoryChip} ${
              activeCategory === cat.value ? styles.categoryActive : ''
            }`}
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 搜索栏 */}
      <div className={styles.searchContainer}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* Q&A 列表 */}
      <div className={styles.qaList}>
        {filteredItems.length > 0 ? (
          filteredItems.map((item, idx) => (
            <div
              key={item.id}
              style={{ animationDelay: `${idx * 50}ms` }}
              className={styles.qaItem}
            >
              <QACard item={item} onDelete={deleteQA} onEdit={(qaId) => navigate(`/edit-qa/${qaId}`)} />
            </div>
          ))
        ) : (
          <EmptyState message="没有找到相关知识点" />
        )}
      </div>

      {/* 新增按钮 */}
      <button
        className={styles.fab}
        onClick={() => navigate('/add-qa')}
        aria-label="新增知识点"
      >
        <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
      </button>
    </div>
  );
}
