import type { AppState } from '../types';
import { DEMO_APP_STATE } from '../data/demoData';

const STORAGE_KEY = 'mindcare_ai_v2';

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEMO_APP_STATE };
    const parsed = JSON.parse(raw) as AppState;
    return parsed;
  } catch {
    return { ...DEMO_APP_STATE };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('Failed to save state to localStorage');
  }
}

export function resetToDemo(): void {
  localStorage.removeItem(STORAGE_KEY);
}
