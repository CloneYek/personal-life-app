import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Todo, TodoCategory } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { createSampleTodos } from '../data/sample';
import { generateId, isToday, isSameDay, getWeekRange } from '../utils/date';

type TodosAction =
  | { type: 'ADD'; payload: Todo }
  | { type: 'UPDATE'; payload: Todo }
  | { type: 'TOGGLE'; payload: string }
  | { type: 'DELETE'; payload: string };

function todosReducer(state: Todo[], action: TodosAction): Todo[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map((t) => (t.id === action.payload.id ? action.payload : t));
    case 'TOGGLE':
      return state.map((t) =>
        t.id === action.payload ? { ...t, isCompleted: !t.isCompleted } : t
      );
    case 'DELETE':
      return state.filter((t) => t.id !== action.payload);
    default:
      return state;
  }
}

interface TodosContextValue {
  todos: Todo[];
  addTodo: (title: string, category?: TodoCategory, dueDate?: Date) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  todayTodos: Todo[];
  todayPendingCount: number;
  weekTodos: Todo[];
  todosByDate: (date: Date) => Todo[];
}

const TodosContext = createContext<TodosContextValue | null>(null);

function deserializeTodos(raw: Todo[]): Todo[] {
  return raw.map((t) => ({
    ...t,
    createdAt: new Date(t.createdAt),
    dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
  }));
}

export function TodosProvider({ children }: { children: ReactNode }) {
  const [todos, dispatch] = useReducer(todosReducer, null, () => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.TODOS);
      if (item) return deserializeTodos(JSON.parse(item));
    } catch {
      // ignore
    }
    return createSampleTodos();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos));
  }, [todos]);

  const addTodo: TodosContextValue['addTodo'] = (title, category = 'other', dueDate) => {
    dispatch({
      type: 'ADD',
      payload: {
        id: generateId(),
        title,
        isCompleted: false,
        createdAt: new Date(),
        category,
        dueDate: dueDate ?? new Date(),
      },
    });
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    const existing = todos.find((t) => t.id === id);
    if (existing) {
      dispatch({ type: 'UPDATE', payload: { ...existing, ...updates, id } });
    }
  };

  const toggleTodo = (id: string) => dispatch({ type: 'TOGGLE', payload: id });
  const deleteTodo = (id: string) => dispatch({ type: 'DELETE', payload: id });

  const todayTodos = todos.filter((t) => !t.dueDate || isToday(t.dueDate));
  const todayPendingCount = todayTodos.filter((t) => !t.isCompleted).length;

  const { start, end } = getWeekRange(new Date());
  const weekTodos = todos.filter((t) => {
    const d = t.dueDate ?? t.createdAt;
    return d >= start && d <= end;
  });

  const todosByDate = (date: Date) =>
    todos
      .filter((t) => {
        const d = t.dueDate ?? t.createdAt;
        return isSameDay(d, date);
      })
      .sort((a, b) => {
        if (a.isCompleted !== b.isCompleted) return a.isCompleted ? 1 : -1;
        return 0;
      });

  return (
    <TodosContext.Provider
      value={{ todos, addTodo, updateTodo, toggleTodo, deleteTodo, todayTodos, todayPendingCount, weekTodos, todosByDate }}
    >
      {children}
    </TodosContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error('useTodos must be used within TodosProvider');
  return ctx;
}
