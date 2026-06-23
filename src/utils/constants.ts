import type { QACategory, TodoCategory } from '../types';

export const STORAGE_KEYS = {
  NOTES: 'pl-app:notes',
  TODOS: 'pl-app:todos',
  SCHEDULES: 'pl-app:schedules',
  QA_ITEMS: 'pl-app:qa-items',
} as const;

export const NOTE_TAGS = ['生活', '灵感', '待办'] as const;

export const TODO_CATEGORIES: { value: TodoCategory; label: string; color: string }[] = [
  { value: 'study', label: '学习', color: '#D97706' },
  { value: 'work', label: '工作', color: '#3B82F6' },
  { value: 'life', label: '生活', color: '#22C55E' },
  { value: 'entertainment', label: '娱乐', color: '#A855F7' },
  { value: 'exercise', label: '运动', color: '#EC4899' },
  { value: 'social', label: '社交', color: '#F59E0B' },
  { value: 'other', label: '其他', color: '#78716C' },
];

export const QA_CATEGORIES: { value: QACategory; label: string }[] = [
  { value: 'java-basic', label: 'Java基础' },
  { value: 'java-collection', label: 'Java集合' },
  { value: 'java-concurrent', label: 'Java并发' },
  { value: 'spring', label: 'Spring' },
  { value: 'springboot', label: 'SpringBoot' },
  { value: 'jvm', label: 'JVM虚拟机' },
  { value: 'mybatis', label: 'MyBatis' },
  { value: 'springcloud', label: 'SpringCloud' },
  { value: 'mysql', label: 'MYSQL' },
  { value: 'redis', label: 'Redis' },
  { value: 'design-pattern', label: '设计模式' },
  { value: 'network', label: '计算机网络' },
  { value: 'os', label: '操作系统' },
  { value: 'backend-scene', label: '后端场景' },
  { value: 'hr', label: 'HR题库' },
];

export const TAB_CONFIG = [
  { path: '/', prefix: '/', label: '今日', icon: 'home' },
  { path: '/capture', prefix: '/capture', label: '随手记', icon: 'edit' },
  { path: '/week-plan', prefix: '/week-plan', label: '计划', icon: 'calendar' },
  { path: '/interview-prep', prefix: '/interview-prep', label: '八股', icon: 'book' },
] as const;
