import { useState, useMemo } from 'react';
import { Check, Clock } from 'lucide-react';
import { StatusBarSpacer } from '../components/layout/StatusBarSpacer';
import { EmptyState } from '../components/shared/EmptyState';
import { useTodos } from '../contexts/TodosContext';
import { getWeekdays, formatWeekRange, isToday, isSameDay, getDayLabel } from '../utils/date';
import { TODO_CATEGORIES } from '../utils/constants';
import type { TodoCategory } from '../types';
import styles from './WeekPlanPage.module.css';

export function WeekPlanPage() {
  const { weekTodos, todosByDate } = useTodos();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekdays = getWeekdays(new Date());

  // Week stats
  const totalTasks = weekTodos.length;
  const completedTasks = weekTodos.filter((t) => t.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Category breakdown
  const categoryStats = useMemo(() => {
    return TODO_CATEGORIES.map((cat) => {
      const items = weekTodos.filter((t) => t.category === cat.value);
      const done = items.filter((t) => t.isCompleted).length;
      return {
        ...cat,
        total: items.length,
        completed: done,
        rate: items.length > 0 ? Math.round((done / items.length) * 100) : 0,
      };
    }).filter((c) => c.total > 0);
  }, [weekTodos]);

  // Daily breakdown
  const dailyStats = weekdays.slice(0, 7).map((date) => {
    const items = todosByDate(date);
    const done = items.filter((t) => t.isCompleted).length;
    return {
      date,
      total: items.length,
      completed: done,
    };
  });

  const selectedDayTodos = todosByDate(selectedDate);
  const ringSize = 120;
  const ringStroke = 12;
  const ringRadius = (ringSize - ringStroke) / 2;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringDashoffset = ringCircumference * (1 - completionRate / 100);

  return (
    <div className={styles.page}>
      <StatusBarSpacer />

      {/* 顶部标题 */}
      <div className={styles.header}>
        <h1 className={styles.title}>本周概览</h1>
        <p className={styles.weekRange}>{formatWeekRange(new Date())}</p>
      </div>

      {/* 大进度环 + 统计 */}
      <div className={styles.dashboardCard}>
        <div className={styles.ringContainer} style={{ width: ringSize, height: ringSize }}>
          <svg width={ringSize} height={ringSize} viewBox={`0 0 ${ringSize} ${ringSize}`}>
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringRadius}
              fill="none"
              stroke="var(--color-primary-light)"
              strokeWidth={ringStroke}
            />
            <circle
              cx={ringSize / 2}
              cy={ringSize / 2}
              r={ringRadius}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={ringStroke}
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringDashoffset}
              transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
              style={{ transition: 'stroke-dashoffset 600ms ease' }}
            />
          </svg>
          <div className={styles.ringCenter}>
            <span className={styles.ringPercent}>{completionRate}%</span>
            <span className={styles.ringLabel}>完成率</span>
          </div>
        </div>

        <div className={styles.statRow}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{totalTasks}</span>
            <span className={styles.statLabel}>总任务</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber} style={{ color: 'var(--color-success)' }}>{completedTasks}</span>
            <span className={styles.statLabel}>已完成</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber} style={{ color: 'var(--color-primary)' }}>{pendingTasks}</span>
            <span className={styles.statLabel}>待完成</span>
          </div>
        </div>
      </div>

      {/* 每日概览条 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>每日分布</h2>
        <div className={styles.dailyBar}>
          {dailyStats.map(({ date, total, completed }) => {
            const isSelected = isSameDay(date, selectedDate);
            const today = isToday(date);
            const rate = total > 0 ? completed / total : 0;
            return (
              <button
                key={date.toISOString()}
                className={`${styles.dailyItem} ${isSelected ? styles.dailySelected : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <span className={styles.dailyLabel}>{getDayLabel(date)}</span>
                <div className={styles.dailyProgress}>
                  <div
                    className={styles.dailyFill}
                    style={{
                      height: `${Math.max(rate * 100, total > 0 ? 8 : 0)}%`,
                      background: today ? 'var(--color-primary)' : 'var(--color-primary-light)',
                    }}
                  />
                </div>
                <span className={styles.dailyCount}>{total > 0 ? `${completed}/${total}` : '-'}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 分类时间分配 */}
      {categoryStats.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>分类分布</h2>
          <div className={styles.categoryList}>
            {categoryStats.map((cat) => (
              <div key={cat.value} className={styles.categoryRow}>
                <div className={styles.categoryHeader}>
                  <span className={styles.categoryDot} style={{ background: cat.color }} />
                  <span className={styles.categoryName}>{cat.label}</span>
                  <span className={styles.categoryCount}>
                    {cat.completed}/{cat.total}
                  </span>
                </div>
                <div className={styles.categoryBar}>
                  <div
                    className={styles.categoryFill}
                    style={{
                      width: `${cat.rate}%`,
                      background: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 选中日的任务列表 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {isToday(selectedDate) ? '今日任务' : `${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日任务`}
        </h2>
        {selectedDayTodos.length > 0 ? (
          <div className={styles.taskList}>
            {selectedDayTodos.map((todo) => {
              const cat = TODO_CATEGORIES.find((c) => c.value === todo.category);
              return (
                <div key={todo.id} className={`${styles.taskItem} ${todo.isCompleted ? styles.taskDone : ''}`}>
                  <div className={styles.taskCheck}>
                    {todo.isCompleted && <Check size={14} color="var(--color-success)" strokeWidth={3} />}
                  </div>
                  <span className={styles.taskTitle}>{todo.title}</span>
                  {cat && (
                    <span className={styles.taskCat} style={{ background: cat.color + '20', color: cat.color }}>
                      {cat.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState message="这一天没有任务" />
        )}
      </div>
    </div>
  );
}
