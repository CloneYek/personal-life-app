import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight, Trash2, Pencil, X } from 'lucide-react';
import { StatusBarSpacer } from '../components/layout/StatusBarSpacer';
import { Checkbox } from '../components/shared/Checkbox';
import { ProgressRing } from '../components/shared/ProgressRing';
import { EmptyState } from '../components/shared/EmptyState';
import { useNotes } from '../contexts/NotesContext';
import { useTodos } from '../contexts/TodosContext';
import { formatDate, formatRelativeTime, getGreeting } from '../utils/date';
import { TODO_CATEGORIES } from '../utils/constants';
import type { TodoCategory } from '../types';
import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const { notes, deleteNote } = useNotes();
  const { todayTodos, toggleTodo, addTodo, updateTodo, deleteTodo, todayPendingCount } = useTodos();

  const completedCount = todayTodos.filter((t) => t.isCompleted).length;

  // 笔记懒加载：初始显示 4 条，滚动到边缘时加载更多
  const NOTES_PAGE_SIZE = 4;
  const [visibleNoteCount, setVisibleNoteCount] = useState(NOTES_PAGE_SIZE);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const recentNotes = notes.slice(0, visibleNoteCount);
  const hasMoreNotes = notes.length > visibleNoteCount;

  // 水平滚动懒加载：接近右边缘时加载更多
  const handleNoteScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasMoreNotes) return;
    const scrollRight = el.scrollWidth - el.scrollLeft - el.clientWidth;
    if (scrollRight < 80) {
      setVisibleNoteCount((prev) => Math.min(prev + NOTES_PAGE_SIZE, notes.length));
    }
  }, [hasMoreNotes, notes.length]);

  const handleConfirmDelete = (id: string) => {
    deleteNote(id);
    setDeletingNoteId(null);
  };

  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<TodoCategory>('study');

  const resetForm = () => {
    setFormTitle('');
    setFormCategory('study');
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;
    if (editingId) {
      updateTodo(editingId, { title: formTitle.trim(), category: formCategory });
    } else {
      addTodo(formTitle.trim(), formCategory);
    }
    resetForm();
  };

  const handleStartEdit = (todoId: string) => {
    const todo = todayTodos.find((t) => t.id === todoId);
    if (!todo) return;
    setEditingId(todoId);
    setFormTitle(todo.title);
    setFormCategory(todo.category ?? 'study');
    setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.page}>
      <StatusBarSpacer />

      {/* 问候区 */}
      <div className={styles.greetingSection}>
        <h1 className={styles.greeting}>{getGreeting()}，Cy</h1>
        <p className={styles.date}>{formatDate(new Date())}</p>
      </div>

      {/* 快速记录入口 */}
      <button
        className={styles.pillBar}
        onClick={() => navigate('/capture')}
        aria-label="创建新笔记"
      >
        <Plus size={16} color="var(--color-primary)" strokeWidth={2.5} />
        <span className={styles.pillPlaceholder}>今天有什么想记的?</span>
      </button>

      {/* 今日待办区块 */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>今日待办</h2>
          {todayPendingCount > 0 && (
            <span className={styles.badge}>{todayPendingCount}</span>
          )}
        </div>

        {/* 新增/编辑表单 */}
        {(showAddForm || editingId) && (
          <div className={styles.formCard}>
            <input
              className={styles.formInput}
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="输入待办内容……"
              autoFocus
            />
            <div className={styles.categoryRow}>
              {TODO_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  className={`${styles.catChip} ${formCategory === cat.value ? styles.catChipActive : ''}`}
                  onClick={() => setFormCategory(cat.value)}
                  type="button"
                  style={formCategory === cat.value ? { background: cat.color, color: '#fff' } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className={styles.formActions}>
              <button className={styles.cancelBtn} onClick={resetForm}>取消</button>
              <button
                className={`${styles.saveBtn} ${!formTitle.trim() ? styles.saveBtnDisabled : ''}`}
                onClick={handleSave}
                disabled={!formTitle.trim()}
              >
                {editingId ? '修改' : '添加'}
              </button>
            </div>
          </div>
        )}

        {/* 待办列表 */}
        {todayTodos.length === 0 && !showAddForm && !editingId ? (
          <EmptyState message="今天还没有待办，点击 + 添加吧" />
        ) : (
          <div className={styles.todoList}>
            {todayTodos.map((todo, idx) => {
              const cat = TODO_CATEGORIES.find((c) => c.value === todo.category);
              return (
                <div
                  key={todo.id}
                  className={`${styles.todoCard} ${todo.isCompleted ? styles.todoCompleted : ''}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                  onClick={() => toggleExpand(todo.id)}
                >
                  <div className={styles.checkboxWrap} onClick={(e) => e.stopPropagation()}>
                    <Checkbox checked={todo.isCompleted} onClick={() => toggleTodo(todo.id)} />
                  </div>
                  <div className={styles.todoContent}>
                    <span className={`${styles.todoText} ${todo.isCompleted ? styles.todoDone : ''}`}>
                      {todo.title}
                    </span>
                    {cat && (
                      <span className={styles.catTag} style={{ background: cat.color + '20', color: cat.color }}>
                        {cat.label}
                      </span>
                    )}
                  </div>

                  {/* 展开操作 */}
                  {expandedId === todo.id && (
                    <div className={styles.actionRow} onClick={(e) => e.stopPropagation()}>
                      <button className={styles.editBtn} onClick={() => handleStartEdit(todo.id)}>
                        <Pencil size={13} color="var(--color-primary)" strokeWidth={2} />
                        <span>编辑</span>
                      </button>
                      <button className={styles.deleteBtn} onClick={() => { deleteTodo(todo.id); setExpandedId(null); }}>
                        <Trash2 size={13} color="var(--color-danger)" strokeWidth={2} />
                        <span>删除</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 最近笔记区块 — 水平滚动 */}
      {notes.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>最近的笔记</h2>
            <span className={styles.noteCount}>{notes.length}</span>
          </div>
          <div
            className={styles.noteScrollContainer}
            ref={scrollRef}
            onScroll={handleNoteScroll}
          >
            {recentNotes.map((note, idx) => (
              <div
                key={note.id}
                className={styles.noteCardH}
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* 删除确认遮罩 */}
                {deletingNoteId === note.id ? (
                  <div className={styles.noteDeleteOverlay}>
                    <p className={styles.deleteConfirmText}>删除这条笔记？</p>
                    <div className={styles.deleteConfirmActions}>
                      <button
                        className={styles.deleteCancelBtn}
                        onClick={(e) => { e.stopPropagation(); setDeletingNoteId(null); }}
                      >
                        取消
                      </button>
                      <button
                        className={styles.deleteConfirmBtn}
                        onClick={(e) => { e.stopPropagation(); handleConfirmDelete(note.id); }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 删除按钮 */}
                    <button
                      className={styles.noteDeleteBtn}
                      onClick={(e) => { e.stopPropagation(); setDeletingNoteId(note.id); }}
                      aria-label="删除笔记"
                    >
                      <Trash2 size={14} color="var(--color-text-muted)" strokeWidth={2} />
                    </button>
                    {/* 卡片内容 */}
                    <div
                      onClick={() => navigate(`/capture/${note.id}`)}
                      role="button"
                      style={{ flex: 1, cursor: 'pointer' }}
                    >
                      <div className={styles.noteContentH}>
                        <h3 className={styles.noteTitleH}>{note.title}</h3>
                        <p className={styles.notePreviewH}>{note.content}</p>
                      </div>
                      <div className={styles.noteFooterH}>
                        <span className={styles.noteTimeH}>
                          {formatRelativeTime(note.updatedAt)}
                        </span>
                        {note.tags.length > 0 && (
                          <span className={styles.noteTagH}>{note.tags[0]}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            {/* 加载更多占位 */}
            {hasMoreNotes && (
              <div className={styles.noteLoadingCard}>
                <span className={styles.loadingDots}>···</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 今日进度 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>今日</h2>
        <div className={styles.progressCard}>
          <ProgressRing completed={completedCount} total={todayTodos.length} />
          <div className={styles.progressInfo}>
            <p className={styles.progressLabel}>今日待办进度</p>
            <p className={styles.progressDesc}>
              已完成 {completedCount} 项，共 {todayTodos.length} 项
            </p>
          </div>
        </div>
      </div>

      {/* FAB */}
      {!showAddForm && !editingId && (
        <button
          className={styles.fab}
          onClick={() => { resetForm(); setShowAddForm(true); }}
          aria-label="添加待办"
        >
          <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
