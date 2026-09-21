import type { Difficulty, GameType, GameSession } from '../types';

export interface PerformanceEvaluation {
  recommendation: 'increase' | 'maintain' | 'decrease';
  nextSuggestedDifficulty: Difficulty;
  explanation: string;
  trendConfidence: number; // 0 to 100%
  metrics: {
    accuracy: number;
    completionTimeSeconds: number;
    mistakes: number;
    speedRating: 'brisk' | 'balanced' | 'leisurely';
  };
}

export const adaptiveDifficultyService = {
  /**
   * Evaluates a completed session and recent history to calculate transparent, gentle difficulty adjustments.
   */
  evaluateSession(
    gameId: GameType,
    currentDifficulty: Difficulty,
    currentSession: {
      accuracy: number;
      completionTimeSeconds: number;
      mistakes: number;
    },
    historicalSessions: GameSession[] = []
  ): PerformanceEvaluation {
    const { accuracy, completionTimeSeconds, mistakes } = currentSession;

    // Filter recent sessions for this specific game
    const gameHistory = historicalSessions
      .filter(s => s.gameId === gameId)
      .slice(-4); // last 4 sessions

    // Determine speed rating based on time thresholds
    let speedRating: 'brisk' | 'balanced' | 'leisurely' = 'balanced';
    if (completionTimeSeconds < 40) {
      speedRating = 'brisk';
    } else if (completionTimeSeconds > 90) {
      speedRating = 'leisurely';
    }

    // Baseline calculation from current session
    let scoreWeight = accuracy;
    if (mistakes === 0) scoreWeight += 5;
    if (speedRating === 'brisk' && accuracy >= 80) scoreWeight += 5;
    if (speedRating === 'leisurely' && accuracy < 70) scoreWeight -= 5;

    // Historical trend influence
    if (gameHistory.length > 0) {
      const avgPastAcc = gameHistory.reduce((acc, s) => acc + s.accuracy, 0) / gameHistory.length;
      // Weighted 60% current session, 40% history
      scoreWeight = Math.round(scoreWeight * 0.6 + avgPastAcc * 0.4);
    }

    const difficultyLadder: Difficulty[] = ['easy', 'medium', 'hard'];
    let currentIndex = difficultyLadder.indexOf(currentDifficulty === 'adaptive' ? 'medium' : currentDifficulty);
    if (currentIndex === -1) currentIndex = 1;

    let recommendation: 'increase' | 'maintain' | 'decrease' = 'maintain';
    let nextIndex = currentIndex;
    let explanation = '';

    // High performance criteria: Accuracy >= 88% and low mistakes
    if (scoreWeight >= 88 && mistakes <= 2) {
      if (currentIndex < difficultyLadder.length - 1) {
        recommendation = 'increase';
        nextIndex = currentIndex + 1;
        explanation = `Outstanding focus! With ${accuracy}% accuracy and smooth timing, stepping up to ${difficultyLadder[nextIndex].toUpperCase()} will keep your brain delightfully engaged.`;
      } else {
        recommendation = 'maintain';
        explanation = `You're mastering this activity at the highest level (${currentDifficulty.toUpperCase()}) with ${accuracy}% accuracy! Maintaining current difficulty.`;
      }
    } 
    // Low performance criteria: Accuracy < 65% or high mistakes
    else if (scoreWeight < 65 || mistakes >= 6) {
      if (currentIndex > 0) {
        recommendation = 'decrease';
        nextIndex = currentIndex - 1;
        explanation = `To ensure an enjoyable and comfortable experience without fatigue, we recommend easing to ${difficultyLadder[nextIndex].toUpperCase()}.`;
      } else {
        recommendation = 'maintain';
        explanation = `Gentle practice is the best way to strengthen neural pathways. Let's stay at ${difficultyLadder[currentIndex].toUpperCase()} for a relaxed rhythm.`;
      }
    } 
    // Average/Balanced performance
    else {
      recommendation = 'maintain';
      explanation = `Balanced and consistent effort! Your score of ${accuracy}% fits your current pace at ${difficultyLadder[currentIndex].toUpperCase()} perfectly.`;
    }

    const trendConfidence = Math.min(95, 60 + gameHistory.length * 10);

    return {
      recommendation,
      nextSuggestedDifficulty: difficultyLadder[nextIndex],
      explanation,
      trendConfidence,
      metrics: {
        accuracy,
        completionTimeSeconds,
        mistakes,
        speedRating,
      },
    };
  },

  /**
   * Get the current recommended starting difficulty for a game based on user profile and game history
   */
  getRecommendedDifficulty(
    gameId: GameType,
    userBaseline: Difficulty,
    historicalSessions: GameSession[]
  ): Difficulty {
    const recent = historicalSessions
      .filter(s => s.gameId === gameId)
      .slice(-1)[0];

    if (!recent) return userBaseline === 'adaptive' ? 'medium' : userBaseline;
    if (recent.adaptiveFeedback?.nextSuggestedDifficulty) {
      return recent.adaptiveFeedback.nextSuggestedDifficulty;
    }
    return userBaseline === 'adaptive' ? 'medium' : userBaseline;
  },
};
