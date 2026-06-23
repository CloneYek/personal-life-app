import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { QAItem, QACategory } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { qaItems as builtinItems } from '../data/qa-items';
import { generateId } from '../utils/date';

type QAAction =
  | { type: 'ADD'; payload: QAItem }
  | { type: 'UPDATE'; payload: QAItem }
  | { type: 'DELETE'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string };

function qaReducer(state: QAItem[], action: QAAction): QAItem[] {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    case 'DELETE':
      return state.filter((item) => item.id !== action.payload);
    case 'TOGGLE_FAVORITE':
      return state.map((item) =>
        item.id === action.payload ? { ...item, isFavorite: !item.isFavorite } : item
      );
    default:
      return state;
  }
}

interface QAContextValue {
  qaItems: QAItem[];
  addQA: (item: Omit<QAItem, 'id'>) => void;
  updateQA: (item: QAItem) => void;
  deleteQA: (id: string) => void;
  toggleFavorite: (id: string) => void;
  itemsByCategory: (category: QACategory | 'all') => QAItem[];
  getQAById: (id: string) => QAItem | undefined;
}

const QAContext = createContext<QAContextValue | null>(null);

export function QAProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(qaReducer, null, () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QA_ITEMS);
      if (stored) return JSON.parse(stored) as QAItem[];
    } catch {
      // ignore
    }
    // Seed with built-in items on first load
    return [...builtinItems];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QA_ITEMS, JSON.stringify(items));
  }, [items]);

  const addQA: QAContextValue['addQA'] = (item) => {
    dispatch({ type: 'ADD', payload: { ...item, id: generateId() } });
  };

  const updateQA = (item: QAItem) => dispatch({ type: 'UPDATE', payload: item });

  const deleteQA = (id: string) => dispatch({ type: 'DELETE', payload: id });

  const toggleFavorite = (id: string) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id });

  const itemsByCategory = (category: QACategory | 'all') =>
    category === 'all' ? items : items.filter((item) => item.category === category);

  const getQAById = (id: string) => items.find((item) => item.id === id);

  return (
    <QAContext.Provider value={{ qaItems: items, addQA, updateQA, deleteQA, toggleFavorite, itemsByCategory, getQAById }}>
      {children}
    </QAContext.Provider>
  );
}

export function useQA() {
  const ctx = useContext(QAContext);
  if (!ctx) throw new Error('useQA must be used within QAProvider');
  return ctx;
}
