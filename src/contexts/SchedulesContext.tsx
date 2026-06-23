import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Schedule } from '../types';
import { STORAGE_KEYS } from '../utils/constants';
import { createSampleSchedules } from '../data/sample';
import { generateId, isSameDay } from '../utils/date';

type SchedulesAction =
  | { type: 'ADD'; payload: Schedule }
  | { type: 'UPDATE'; payload: Schedule }
  | { type: 'DELETE'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: string };

function schedulesReducer(state: Schedule[], action: SchedulesAction): Schedule[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'UPDATE':
      return state.map((s) => (s.id === action.payload.id ? action.payload : s));
    case 'DELETE':
      return state.filter((s) => s.id !== action.payload);
    case 'TOGGLE_COMPLETE':
      return state.map((s) =>
        s.id === action.payload ? { ...s, isCompleted: !s.isCompleted } : s
      );
    default:
      return state;
  }
}

interface SchedulesContextValue {
  schedules: Schedule[];
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  toggleComplete: (id: string) => void;
  schedulesByDate: (date: Date) => Schedule[];
}

const SchedulesContext = createContext<SchedulesContextValue | null>(null);

function deserializeSchedules(raw: Schedule[]): Schedule[] {
  return raw.map((s) => ({ ...s, date: new Date(s.date) }));
}

export function SchedulesProvider({ children }: { children: ReactNode }) {
  const [schedules, dispatch] = useReducer(schedulesReducer, null, () => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      if (item) return deserializeSchedules(JSON.parse(item));
    } catch {
      // ignore
    }
    return createSampleSchedules();
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  const addSchedule: SchedulesContextValue['addSchedule'] = (schedule) => {
    dispatch({ type: 'ADD', payload: { ...schedule, id: generateId() } });
  };

  const updateSchedule: SchedulesContextValue['updateSchedule'] = (id, updates) => {
    const existing = schedules.find((s) => s.id === id);
    if (existing) {
      dispatch({ type: 'UPDATE', payload: { ...existing, ...updates, id } });
    }
  };

  const deleteSchedule = (id: string) => dispatch({ type: 'DELETE', payload: id });

  const toggleComplete = (id: string) => dispatch({ type: 'TOGGLE_COMPLETE', payload: id });

  const schedulesByDate = (date: Date) =>
    schedules
      .filter((s) => !s.isUnscheduled && isSameDay(s.date, date))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <SchedulesContext.Provider
      value={{ schedules, addSchedule, updateSchedule, deleteSchedule, toggleComplete, schedulesByDate }}
    >
      {children}
    </SchedulesContext.Provider>
  );
}

export function useSchedules() {
  const ctx = useContext(SchedulesContext);
  if (!ctx) throw new Error('useSchedules must be used within SchedulesProvider');
  return ctx;
}
