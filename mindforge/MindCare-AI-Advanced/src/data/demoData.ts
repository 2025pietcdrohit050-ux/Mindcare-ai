import type { AppState, GameResult, Memory, Reminder, Notification, CaregiverNote } from '../types';

const now = new Date();
const dayMs = 86400000;

function daysAgo(n: number): string {
  return new Date(now.getTime() - n * dayMs).toISOString();
}

function daysFromNow(n: number): string {
  return new Date(now.getTime() + n * dayMs).toISOString();
}

export const DEMO_GAME_RESULTS: GameResult[] = [
  // Day 7 ago
  { id: 'gr1', gameType: 'memory-match', score: 720, accuracy: 72, duration: 145, difficulty: 'easy', date: daysAgo(7) },
  { id: 'gr2', gameType: 'sequence-recall', score: 580, accuracy: 58, duration: 90, difficulty: 'easy', date: daysAgo(7) },
  // Day 6 ago
  { id: 'gr3', gameType: 'attention-challenge', score: 810, accuracy: 81, duration: 60, difficulty: 'easy', date: daysAgo(6) },
  { id: 'gr4', gameType: 'word-recall', score: 600, accuracy: 60, duration: 75, difficulty: 'easy', date: daysAgo(6) },
  // Day 5 ago
  { id: 'gr5', gameType: 'memory-match', score: 760, accuracy: 76, duration: 130, difficulty: 'medium', date: daysAgo(5) },
  { id: 'gr6', gameType: 'pattern-match', score: 690, accuracy: 69, duration: 85, difficulty: 'easy', date: daysAgo(5) },
  // Day 4 ago
  { id: 'gr7', gameType: 'sequence-recall', score: 640, accuracy: 64, duration: 95, difficulty: 'medium', date: daysAgo(4) },
  { id: 'gr8', gameType: 'daily-challenge', score: 750, accuracy: 75, duration: 200, difficulty: 'medium', date: daysAgo(4) },
  // Day 3 ago
  { id: 'gr9', gameType: 'memory-match', score: 800, accuracy: 80, duration: 120, difficulty: 'medium', date: daysAgo(3) },
  { id: 'gr10', gameType: 'word-recall', score: 660, accuracy: 66, duration: 70, difficulty: 'medium', date: daysAgo(3) },
  // Day 2 ago
  { id: 'gr11', gameType: 'attention-challenge', score: 870, accuracy: 87, duration: 55, difficulty: 'medium', date: daysAgo(2) },
  { id: 'gr12', gameType: 'pattern-match', score: 730, accuracy: 73, duration: 80, difficulty: 'medium', date: daysAgo(2) },
  // Yesterday
  { id: 'gr13', gameType: 'memory-match', score: 850, accuracy: 85, duration: 115, difficulty: 'hard', date: daysAgo(1) },
  { id: 'gr14', gameType: 'sequence-recall', score: 700, accuracy: 70, duration: 100, difficulty: 'medium', date: daysAgo(1) },
  { id: 'gr15', gameType: 'daily-challenge', score: 820, accuracy: 82, duration: 195, difficulty: 'medium', date: daysAgo(1) },
];

export const DEMO_MEMORIES: Memory[] = [
  { id: 'm1', category: 'people', title: 'Sunita Sharma', relationship: 'Wife', description: 'My wife of 38 years. Her birthday is March 14th. She loves gardening and makes the best rajma.', date: daysAgo(10) },
  { id: 'm2', category: 'people', title: 'Priya Sharma', relationship: 'Daughter', description: 'Our daughter, lives in Pune. Works as a software engineer. Calls every Sunday evening.', date: daysAgo(10) },
  { id: 'm3', category: 'people', title: 'Dr. Anil Kapoor', relationship: 'Doctor', description: 'My neurologist at AIIMS Delhi. Appointment every 3 months. Room 204, OPD block.', date: daysAgo(5), reminder: daysFromNow(14) },
  { id: 'm4', category: 'places', title: 'Home Address', description: '42-B Shastri Nagar, New Delhi – 110052. Near Rajiv Chowk metro station.', date: daysAgo(10) },
  { id: 'm5', category: 'places', title: 'Morning Walk Route', description: 'Lodi Garden, Gate 2 entrance, walk the inner path twice (about 4 km). Go with neighbor Suresh ji at 6:30 AM.', date: daysAgo(8) },
  { id: 'm6', category: 'events', title: 'Retirement Anniversary', description: 'Retired from Indian Railways on 15 August 2018 after 32 years of service. Held a small celebration with colleagues.', date: daysAgo(30) },
  { id: 'm7', category: 'events', title: 'Granddaughter\'s Birth', description: 'Ananya was born on 4 April 2023. She is 3 years old now. Lives in Pune with Priya.', date: daysAgo(20) },
  { id: 'm8', category: 'notes', title: 'Daily Medicine Routine', description: 'Morning: Amlodipine 5mg (blood pressure) with breakfast. Evening: Metformin 500mg with dinner. Keep tablets in the blue box on the kitchen shelf.', date: daysAgo(3) },
  { id: 'm9', category: 'routines', title: 'Morning Routine', description: '6:00 AM – Wake up. 6:30 AM – Walk with Suresh ji. 8:00 AM – Breakfast + medicines. 9:00 AM – Newspaper. 10:00 AM – MindCare exercises.', date: daysAgo(7) },
  { id: 'm10', category: 'favorites', title: 'Favorite Things', description: 'Favorite food: Rajma chawal. Favorite music: Old Hindi film songs (1960s-70s). Favorite show: Kaun Banega Crorepati. Hobby: Chess.', date: daysAgo(15) },
];

export const DEMO_REMINDERS: Reminder[] = [
  { id: 'r1', title: 'Morning Medicines', description: 'Amlodipine 5mg with breakfast', dateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0).toISOString(), category: 'medicine', priority: 'high', completed: false, recurring: 'daily' },
  { id: 'r2', title: 'Evening Medicines', description: 'Metformin 500mg with dinner', dateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0).toISOString(), category: 'medicine', priority: 'high', completed: false, recurring: 'daily' },
  { id: 'r3', title: 'Morning Walk', description: 'Walk with Suresh ji at Lodi Garden', dateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 30).toISOString(), category: 'exercise', priority: 'medium', completed: true, recurring: 'daily' },
  { id: 'r4', title: 'MindCare Brain Exercises', description: 'Complete today\'s cognitive wellness session', dateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0).toISOString(), category: 'exercise', priority: 'medium', completed: false, recurring: 'daily' },
  { id: 'r5', title: 'Call Priya', description: 'Weekly call with daughter in Pune', dateTime: daysFromNow(1), category: 'family', priority: 'medium', completed: false, recurring: 'weekly' },
  { id: 'r6', title: 'Dr. Kapoor Appointment', description: 'Neurology OPD, AIIMS Delhi, Room 204', dateTime: daysFromNow(14), category: 'doctor', priority: 'high', completed: false, recurring: null },
  { id: 'r7', title: 'Blood Pressure Check', description: 'Home BP monitoring — both arms', dateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0).toISOString(), category: 'medicine', priority: 'medium', completed: true, recurring: 'daily' },
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'reminder', title: 'Medicine Reminder', message: 'Time for your morning Amlodipine 5mg with breakfast.', timestamp: daysAgo(0), read: false },
  { id: 'n2', type: 'challenge', title: 'Daily Challenge Ready', message: 'Your Daily Challenge is ready! Complete it to maintain your streak.', timestamp: daysAgo(0), read: false },
  { id: 'n3', type: 'system', title: 'Wellness Streak: 7 Days!', message: 'Great job Ramesh! You have completed cognitive exercises for 7 days in a row.', timestamp: daysAgo(1), read: true },
  { id: 'n4', type: 'caregiver', title: 'Caregiver Note', message: 'Priya added a note: Remember to drink water regularly today.', timestamp: daysAgo(1), read: true },
  { id: 'n5', type: 'missed', title: 'Missed Activity', message: 'You missed the Sequence Recall session scheduled for yesterday evening.', timestamp: daysAgo(1), read: true },
];

export const DEMO_CAREGIVER_NOTES: CaregiverNote[] = [
  { id: 'cn1', content: 'Papa had a great week — completed 5 out of 7 sessions. Mood seems good. Keep encouraging him.', timestamp: daysAgo(2), author: 'Priya Sharma' },
  { id: 'cn2', content: 'Remember to remind Papa about the doctor\'s appointment on the 30th. He sometimes forgets to check the calendar.', timestamp: daysAgo(5), author: 'Priya Sharma' },
  { id: 'cn3', content: 'Started tracking his morning walk routine. He walks regularly with Suresh ji — this is very good for overall wellness.', timestamp: daysAgo(8), author: 'Priya Sharma' },
];

export const DEMO_APP_STATE: AppState = {
  user: {
    id: 'user-ramesh-01',
    name: 'Ramesh Sharma',
    age: 68,
    role: 'demo',
    language: 'en',
    dailyGoal: 30,
    accessibilityPrefs: { largeText: false, highContrast: false, reducedMotion: false },
    notificationPrefs: { reminders: true, dailyChallenge: true, caregiverAlerts: true },
  },
  gameResults: DEMO_GAME_RESULTS,
  memories: DEMO_MEMORIES,
  reminders: DEMO_REMINDERS,
  notifications: DEMO_NOTIFICATIONS,
  caregiverNotes: DEMO_CAREGIVER_NOTES,
  currentStreak: 7,
  lastActiveDate: daysAgo(0),
};
