export type Difficulty = 'easy' | 'medium' | 'hard' | 'adaptive';

export type GameType = 'memory-match' | 'sequence-memory' | 'pattern-recognition' | 'recall-challenge';

export interface GameMetadata {
  id: GameType;
  titleKey: string;
  descriptionKey: string;
  category: 'Memory' | 'Attention' | 'Logic' | 'Recall';
  icon: string;
  color: string;
  accentBg: string;
  defaultDifficulty: Difficulty;
  estimatedMinutes: number;
}

export interface GameSession {
  id: string;
  userId: string;
  gameId: GameType;
  difficulty: Difficulty;
  score: number;
  accuracy: number; // 0 - 100
  mistakes: number;
  completionTimeSeconds: number;
  timestamp: string; // ISO string
  adaptiveFeedback?: {
    recommendation: 'increase' | 'maintain' | 'decrease';
    reason: string;
    nextSuggestedDifficulty: Difficulty;
  };
}

export type MemoryCategory = 'family' | 'friends' | 'people' | 'places' | 'events' | 'notes';

export interface MemoryItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: MemoryCategory;
  date: string;
  imageUrl?: string;
  tags: string[];
  isCaregiverShared: boolean;
  recallPrompts?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ReminderCategory = 'exercise' | 'memory-review' | 'event' | 'personal';

export interface ReminderItem {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: ReminderCategory;
  time: string; // e.g. "09:30 AM"
  date?: string;
  isCompleted: boolean;
  recurrence?: 'daily' | 'weekly' | 'none';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
  category: 'games' | 'streak' | 'accuracy' | 'memory';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'patient' | 'caregiver';
  baselineDifficulty: Difficulty;
  preferredLanguage: 'en' | 'hi';
  caregiverId?: string;
  caregiverName?: string;
  caregiverConnected: boolean;
  streakDays: number;
  cognitiveScore: number;
  joinedDate: string;
}

export interface AICompanionMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionLink?: {
    label: string;
    path: string;
  };
}

export interface DailyPlanItem {
  id: string;
  title: string;
  category: 'game' | 'vault' | 'reminder';
  duration: string;
  completed: boolean;
  gameId?: GameType;
  link: string;
}
