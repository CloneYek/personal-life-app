import type { Todo, Schedule, Note } from '../types';
import { generateId } from '../utils/date';

export function createSampleTodos(): Todo[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOffset = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d;
  };

  return [
    // 今天
    {
      id: generateId(),
      title: '复习 Spring 自动装配原理',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: new Date(today),
      category: 'study',
    },
    {
      id: generateId(),
      title: '完成项目周报',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: new Date(today),
      category: 'work',
    },
    {
      id: generateId(),
      title: '买周末露营的食材',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: new Date(today),
      category: 'life',
    },
    {
      id: generateId(),
      title: '跑步 30 分钟',
      isCompleted: true,
      createdAt: new Date(),
      dueDate: new Date(today),
      category: 'exercise',
    },
    // 昨天
    {
      id: generateId(),
      title: '整理 Redis 笔记',
      isCompleted: true,
      createdAt: dayOffset(-1),
      dueDate: dayOffset(-1),
      category: 'study',
    },
    {
      id: generateId(),
      title: '给妈妈打电话',
      isCompleted: true,
      createdAt: dayOffset(-1),
      dueDate: dayOffset(-1),
      category: 'social',
    },
    // 前天
    {
      id: generateId(),
      title: '看《深入理解 JVM》第 3 章',
      isCompleted: true,
      createdAt: dayOffset(-2),
      dueDate: dayOffset(-2),
      category: 'study',
    },
    {
      id: generateId(),
      title: '打两把游戏放松',
      isCompleted: true,
      createdAt: dayOffset(-2),
      dueDate: dayOffset(-2),
      category: 'entertainment',
    },
    // 明天
    {
      id: generateId(),
      title: '和朋友吃饭',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: dayOffset(1),
      category: 'social',
    },
    {
      id: generateId(),
      title: '准备面试模拟题',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: dayOffset(1),
      category: 'study',
    },
    // 后天
    {
      id: generateId(),
      title: '游泳 1 小时',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: dayOffset(2),
      category: 'exercise',
    },
    {
      id: generateId(),
      title: '提交项目 PR',
      isCompleted: false,
      createdAt: new Date(),
      dueDate: dayOffset(2),
      category: 'work',
    },
  ];
}

export function createSampleSchedules(): Schedule[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [
    {
      id: generateId(),
      title: '晨间规划',
      date: new Date(today),
      startTime: '09:00',
    },
    {
      id: generateId(),
      title: '超市采购食材',
      date: new Date(today),
      startTime: '10:00',
    },
    {
      id: generateId(),
      title: '读书 1 小时',
      date: new Date(today),
      startTime: '14:00',
    },
    {
      id: generateId(),
      title: '整理笔记',
      date: new Date(today),
      startTime: '16:00',
    },
    {
      id: generateId(),
      title: '和朋友吃饭',
      date: new Date(today),
      startTime: '19:00',
    },
    // 待安排
    {
      id: generateId(),
      title: '车保养',
      date: new Date(today),
      startTime: '',
      isUnscheduled: true,
    },
    {
      id: generateId(),
      title: '更新简历',
      date: new Date(today),
      startTime: '',
      isUnscheduled: true,
    },
  ];
}

export function createSampleNotes(): Note[] {
  return [
    {
      id: generateId(),
      title: '周末露营计划',
      content: '周六去大鹏海边，需要准备帐篷、睡袋和烧烤食材。预计早上8点出发，开车大约1.5小时。记得带上防晒霜和驱蚊水。',
      tags: ['生活'],
      createdAt: new Date(Date.now() - 86400000 - 3600000), // 昨天晚上
      updatedAt: new Date(Date.now() - 86400000 - 3600000),
    },
    {
      id: generateId(),
      title: '产品设计灵感收集',
      content: '收集了一些有趣的交互设计和色彩搭配参考，包括流体动画、圆角卡片层次感、暖色调背景搭配。可以应用到下一个项目中。',
      tags: ['灵感'],
      createdAt: new Date(Date.now() - 3 * 86400000),
      updatedAt: new Date(Date.now() - 3 * 86400000),
    },
  ];
}
