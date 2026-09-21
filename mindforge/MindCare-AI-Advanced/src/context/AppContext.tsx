import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AppState, GameResult, Memory, Reminder, Notification, CaregiverNote, User } from '../types';
import { loadState, saveState } from '../utils/storage';
import { DEMO_APP_STATE } from '../data/demoData';

interface AppContextType {
  state: AppState;
  updateUser: (u: Partial<User>) => void;
  addGameResult: (r: GameResult) => void;
  addMemory: (m: Memory) => void;
  updateMemory: (m: Memory) => void;
  deleteMemory: (id: string) => void;
  addReminder: (r: Reminder) => void;
  updateReminder: (r: Reminder) => void;
  deleteReminder: (id: string) => void;
  markReminderDone: (id: string) => void;
  addCaregiverNote: (n: CaregiverNote) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (n: Notification) => void;
  resetToDemo: () => void;
  isLoggedIn: boolean;
  login: (role: 'patient' | 'caregiver' | 'demo') => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState());
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('mindcare_logged_in'));

  useEffect(() => {
    saveState(state);
  }, [state]);

  const updateUser = useCallback((u: Partial<User>) => {
    setState(s => ({ ...s, user: { ...s.user, ...u } }));
  }, []);

  const addGameResult = useCallback((r: GameResult) => {
    setState(s => ({ ...s, gameResults: [r, ...s.gameResults] }));
  }, []);

  const addMemory = useCallback((m: Memory) => {
    setState(s => ({ ...s, memories: [m, ...s.memories] }));
  }, []);

  const updateMemory = useCallback((m: Memory) => {
    setState(s => ({ ...s, memories: s.memories.map(x => x.id === m.id ? m : x) }));
  }, []);

  const deleteMemory = useCallback((id: string) => {
    setState(s => ({ ...s, memories: s.memories.filter(x => x.id !== id) }));
  }, []);

  const addReminder = useCallback((r: Reminder) => {
    setState(s => ({ ...s, reminders: [r, ...s.reminders] }));
  }, []);

  const updateReminder = useCallback((r: Reminder) => {
    setState(s => ({ ...s, reminders: s.reminders.map(x => x.id === r.id ? r : x) }));
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setState(s => ({ ...s, reminders: s.reminders.filter(x => x.id !== id) }));
  }, []);

  const markReminderDone = useCallback((id: string) => {
    setState(s => ({ ...s, reminders: s.reminders.map(x => x.id === id ? { ...x, completed: true } : x) }));
  }, []);

  const addCaregiverNote = useCallback((n: CaregiverNote) => {
    setState(s => ({ ...s, caregiverNotes: [n, ...s.caregiverNotes] }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(s => ({ ...s, notifications: s.notifications.map(x => x.id === id ? { ...x, read: true } : x) }));
  }, []);

  const addNotification = useCallback((n: Notification) => {
    setState(s => ({ ...s, notifications: [n, ...s.notifications] }));
  }, []);

  const resetToDemo = useCallback(() => {
    setState({ ...DEMO_APP_STATE });
  }, []);

  const login = useCallback((role: 'patient' | 'caregiver' | 'demo') => {
    localStorage.setItem('mindcare_logged_in', role);
    setState(s => ({ ...s, user: { ...s.user, role } }));
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mindcare_logged_in');
    setIsLoggedIn(false);
  }, []);

  return (
    <AppContext.Provider value={{
      state, updateUser, addGameResult, addMemory, updateMemory, deleteMemory,
      addReminder, updateReminder, deleteReminder, markReminderDone,
      addCaregiverNote, markNotificationRead, addNotification,
      resetToDemo, isLoggedIn, login, logout,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
