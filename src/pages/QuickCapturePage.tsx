import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StatusBarSpacer } from '../components/layout/StatusBarSpacer';
import { Chip } from '../components/shared/Chip';
import { useNotes } from '../contexts/NotesContext';
import { NOTE_TAGS } from '../utils/constants';
import { formatDateTime } from '../utils/date';
import styles from './QuickCapturePage.module.css';

export function QuickCapturePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNote, updateNote, getNoteById } = useNotes();

  const isEditMode = Boolean(id);
  const existingNote = id ? getNoteById(id) : undefined;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [timestamp] = useState(new Date());

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setTags(existingNote.tags);
    }
  }, [existingNote]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const canSave = title.trim().length > 0 || content.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (isEditMode && existingNote) {
      updateNote(existingNote.id, { title: title.trim(), content: content.trim(), tags });
    } else {
      addNote({ title: title.trim(), content: content.trim(), tags });
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
        <span className={styles.navTitle}>{isEditMode ? '编辑笔记' : '新笔记'}</span>
      </div>

      {/* 时间戳 */}
      <p className={styles.timestamp}>{formatDateTime(timestamp)}</p>

      {/* 标题输入 */}
      <input
        className={styles.titleInput}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="标题……"
        autoFocus={!isEditMode}
      />

      {/* 内容输入 */}
      <div className={styles.contentCard}>
        <textarea
          className={styles.contentInput}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天有什么想法想记下来? 可以是一段心情、一个灵感或者待办事项……"
          rows={6}
        />
      </div>

      {/* 标签选择 */}
      <div className={styles.tagSection}>
        <div className={styles.tagList}>
          {NOTE_TAGS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              selected={tags.includes(tag)}
              onClick={() => toggleTag(tag)}
            />
          ))}
        </div>
      </div>

      {/* 保存按钮 */}
      <div className={styles.saveSection}>
        <button
          className={`${styles.saveBtn} ${!canSave ? styles.saveBtnDisabled : ''}`}
          onClick={handleSave}
          disabled={!canSave}
        >
          保存笔记
        </button>
      </div>
    </div>
  );
}
