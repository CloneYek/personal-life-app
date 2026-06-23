import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Note } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { createSampleNotes } from '../data/sample';
import { generateId } from '../utils/date';

type NotesAction =
  | { type: 'ADD'; payload: Note }
  | { type: 'UPDATE'; payload: Note }
  | { type: 'DELETE'; payload: string };

function notesReducer(state: Note[], action: NotesAction): Note[] {
  switch (action.type) {
    case 'ADD':
      return [action.payload, ...state];
    case 'UPDATE':
      return state.map((n) => (n.id === action.payload.id ? action.payload : n));
    case 'DELETE':
      return state.filter((n) => n.id !== action.payload);
    default:
      return state;
  }
}

interface NotesContextValue {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
}

const NotesContext = createContext<NotesContextValue | null>(null);

function deserializeNotes(raw: Note[]): Note[] {
  return raw.map((n) => ({
    ...n,
    createdAt: new Date(n.createdAt),
    updatedAt: new Date(n.updatedAt),
  }));
}

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, dispatch] = useReducer(notesReducer, null, () => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (item) return deserializeNotes(JSON.parse(item));
    } catch {
      // ignore
    }
    return createSampleNotes();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  const addNote: NotesContextValue['addNote'] = (note) => {
    const now = new Date();
    dispatch({
      type: 'ADD',
      payload: { ...note, id: generateId(), createdAt: now, updatedAt: now },
    });
  };

  const updateNote: NotesContextValue['updateNote'] = (id, updates) => {
    const existing = notes.find((n) => n.id === id);
    if (existing) {
      dispatch({
        type: 'UPDATE',
        payload: { ...existing, ...updates, id, updatedAt: new Date() },
      });
    }
  };

  const deleteNote = (id: string) => dispatch({ type: 'DELETE', payload: id });

  const getNoteById = (id: string) => notes.find((n) => n.id === id);

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote, getNoteById }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
