export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';
export type Role = 'patient' | 'caregiver' | 'demo';

export interface User {
  id: string;
  name: string;
  age: number;
  role: Role;
  language: Language;
  dailyGoal: number; // minutes
  accessibilityPrefs: AccessibilityPrefs;
  notificationPrefs: NotificationPrefs;
}

export interface AccessibilityPrefs {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface NotificationPrefs {
  reminders: boolean;
  dailyChallenge: boolean;
  caregiverAlerts: boolean;
}

export interface GameResult {
  id: string;
  gameType: GameType;
  score: number;
  accuracy: number; // 0-100
  duration: number; // seconds
  difficulty: Difficulty;
  date: string; // ISO
}

export type GameType = 'memory-match' | 'sequence-recall' | 'pattern-match' | 'word-recall' | 'attention-challenge' | 'daily-challenge';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface CognitiveScores {
  memoryScore: number;
  attentionScore: number;
  recallScore: number;
  reactionScore: number;
}

export interface Memory {
  id: string;
  category: MemoryCategory;
  title: string;
  relationship?: string;
  description: string;
  date: string;
  reminder?: string;
  tags?: string[];
}

export type MemoryCategory = 'people' | 'places' | 'events' | 'notes' | 'routines' | 'favorites';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dateTime: string; // ISO
  category: ReminderCategory;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  recurring?: 'daily' | 'weekly' | 'monthly' | null;
}

export type ReminderCategory = 'medicine' | 'doctor' | 'family' | 'exercise' | 'personal' | 'other';

export interface Notification {
  id: string;
  type: 'reminder' | 'missed' | 'challenge' | 'caregiver' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface CaregiverNote {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

export interface AppState {
  user: User;
  gameResults: GameResult[];
  memories: Memory[];
  reminders: Reminder[];
  notifications: Notification[];
  caregiverNotes: CaregiverNote[];
  currentStreak: number;
  lastActiveDate: string;
}
