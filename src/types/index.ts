export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
}

export type TodoCategory =
  | 'study'
  | 'work'
  | 'life'
  | 'entertainment'
  | 'exercise'
  | 'social'
  | 'other';

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  dueDate?: Date;
  createdAt: Date;
  category?: TodoCategory;
}

export interface Schedule {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime?: string;
  isUnscheduled?: boolean;
  isCompleted?: boolean;
}

export type QACategory =
  | 'java-basic'
  | 'java-collection'
  | 'java-concurrent'
  | 'spring'
  | 'springboot'
  | 'jvm'
  | 'mybatis'
  | 'springcloud'
  | 'mysql'
  | 'redis'
  | 'design-pattern'
  | 'network'
  | 'os'
  | 'backend-scene'
  | 'hr';

export interface QAItem {
  id: string;
  category: QACategory;
  question: string;
  answerBrief: string;
  answerDetail: string[];
  isFavorite?: boolean;
}
