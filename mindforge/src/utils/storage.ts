import type { UserProfile, MemoryItem, ReminderItem, GameSession, Achievement } from '../types';
import { initialUserProfile, initialMemories, initialReminders, initialAchievements, initialSessions } from '../data/demoData';

const KEYS = {
  USER_PROFILE: 'mindmate_user_profile',
  MEMORIES: 'mindmate_memories',
  REMINDERS: 'mindmate_reminders',
  SESSIONS: 'mindmate_sessions',
  ACHIEVEMENTS: 'mindmate_achievements',
  CARE_CODE: 'mindmate_caregiver_code',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving to localStorage for key: ${key}`, err);
  }
}

export const storageService = {
  getUserProfile(): UserProfile {
    return safeGet<UserProfile>(KEYS.USER_PROFILE, initialUserProfile);
  },

  saveUserProfile(profile: UserProfile): void {
    safeSet(KEYS.USER_PROFILE, profile);
  },

  getMemories(): MemoryItem[] {
    return safeGet<MemoryItem[]>(KEYS.MEMORIES, initialMemories);
  },

  addMemory(memory: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>): MemoryItem {
    const memories = this.getMemories();
    const newMemory: MemoryItem = {
      ...memory,
      id: 'mem_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memories.unshift(newMemory);
    safeSet(KEYS.MEMORIES, memories);
    return newMemory;
  },

  updateMemory(updated: MemoryItem): void {
    const memories = this.getMemories().map(m => m.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : m);
    safeSet(KEYS.MEMORIES, memories);
  },

  deleteMemory(id: string): void {
    const memories = this.getMemories().filter(m => m.id !== id);
    safeSet(KEYS.MEMORIES, memories);
  },

  getReminders(): ReminderItem[] {
    return safeGet<ReminderItem[]>(KEYS.REMINDERS, initialReminders);
  },

  addReminder(reminder: Omit<ReminderItem, 'id'>): ReminderItem {
    const reminders = this.getReminders();
    const newReminder: ReminderItem = {
      ...reminder,
      id: 'rem_' + Date.now(),
    };
    reminders.push(newReminder);
    safeSet(KEYS.REMINDERS, reminders);
    return newReminder;
  },

  toggleReminder(id: string): void {
    const reminders = this.getReminders().map(r => r.id === id ? { ...r, isCompleted: !r.isCompleted } : r);
    safeSet(KEYS.REMINDERS, reminders);
  },

  deleteReminder(id: string): void {
    const reminders = this.getReminders().filter(r => r.id !== id);
    safeSet(KEYS.REMINDERS, reminders);
  },

  getSessions(): GameSession[] {
    return safeGet<GameSession[]>(KEYS.SESSIONS, initialSessions);
  },

  recordSession(sessionData: Omit<GameSession, 'id' | 'timestamp'>): GameSession {
    const sessions = this.getSessions();
    const newSession: GameSession = {
      ...sessionData,
      id: 'ses_' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    sessions.push(newSession);
    safeSet(KEYS.SESSIONS, sessions);

    // Update user stats
    const profile = this.getUserProfile();
    const totalSessions = sessions.length;
    const avgAcc = Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / totalSessions);
    profile.cognitiveScore = Math.min(1000, 700 + Math.round(avgAcc * 2.5) + (profile.streakDays * 5));
    this.saveUserProfile(profile);

    return newSession;
  },

  getAchievements(): Achievement[] {
    return safeGet<Achievement[]>(KEYS.ACHIEVEMENTS, initialAchievements);
  },

  updateAchievementProgress(id: string, progress: number, unlocked = false): void {
    const achievements = this.getAchievements().map(a => {
      if (a.id === id) {
        return {
          ...a,
          progress: Math.min(100, Math.max(a.progress, progress)),
          unlockedAt: unlocked && !a.unlockedAt ? new Date().toISOString().split('T')[0] : a.unlockedAt,
        };
      }
      return a;
    });
    safeSet(KEYS.ACHIEVEMENTS, achievements);
  },

  resetToDemoData(): void {
    safeSet(KEYS.USER_PROFILE, initialUserProfile);
    safeSet(KEYS.MEMORIES, initialMemories);
    safeSet(KEYS.REMINDERS, initialReminders);
    safeSet(KEYS.ACHIEVEMENTS, initialAchievements);
    safeSet(KEYS.SESSIONS, initialSessions);
  },
};
