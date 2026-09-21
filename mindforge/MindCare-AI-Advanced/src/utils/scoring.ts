import type { GameResult, CognitiveScores } from '../types';

export function computeCognitiveScores(results: GameResult[]): CognitiveScores {
  const recent = results.filter(r => {
    const d = new Date(r.date);
    const cutoff = new Date(Date.now() - 7 * 86400000);
    return d >= cutoff;
  });

  function avg(arr: number[]): number {
    if (!arr.length) return 50;
    return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  }

  const memoryAcc = recent.filter(r => r.gameType === 'memory-match').map(r => r.accuracy);
  const attentionAcc = recent.filter(r => r.gameType === 'attention-challenge').map(r => r.accuracy);
  const recallAcc = recent.filter(r => r.gameType === 'sequence-recall' || r.gameType === 'word-recall').map(r => r.accuracy);
  const patternAcc = recent.filter(r => r.gameType === 'pattern-match').map(r => r.accuracy);

  return {
    memoryScore: avg(memoryAcc),
    attentionScore: avg(attentionAcc),
    recallScore: avg([...recallAcc, ...patternAcc]),
    reactionScore: avg(attentionAcc),
  };
}

export function getWeakestArea(scores: CognitiveScores): keyof CognitiveScores {
  const entries = Object.entries(scores) as [keyof CognitiveScores, number][];
  return entries.reduce((a, b) => (a[1] < b[1] ? a : b))[0];
}

export function generateRecommendation(scores: CognitiveScores): { gameType: string; reason: string } {
  const weakest = getWeakestArea(scores);
  const map: Record<keyof CognitiveScores, { gameType: string; reason: string }> = {
    memoryScore: { gameType: 'memory-match', reason: 'Your memory-match performance has room to grow. Playing Memory Match will help strengthen short-term memory recall.' },
    attentionScore: { gameType: 'attention-challenge', reason: 'Sustained attention is your current focus area. The Attention Challenge will help sharpen your focus.' },
    recallScore: { gameType: 'sequence-recall', reason: 'Your recent recall accuracy is lower than other areas. Sequence Recall is recommended to build recall skills.' },
    reactionScore: { gameType: 'attention-challenge', reason: 'Reaction time can be improved with regular practice. Today\'s recommended activity is the Attention Challenge.' },
  };
  return map[weakest];
}

export function getWeeklyData(results: GameResult[]) {
  const days: string[] = [];
  const data: { day: string; memory: number; attention: number; recall: number; reaction: number; games: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const label = d.toLocaleDateString('en-IN', { weekday: 'short' });
    days.push(label);
    const dayResults = results.filter(r => {
      const rd = new Date(r.date);
      return rd.toDateString() === d.toDateString();
    });
    const memR = dayResults.filter(r => r.gameType === 'memory-match');
    const attR = dayResults.filter(r => r.gameType === 'attention-challenge');
    const recR = dayResults.filter(r => r.gameType === 'sequence-recall' || r.gameType === 'word-recall');
    function avg(arr: GameResult[]) { return arr.length ? Math.round(arr.reduce((s, r) => s + r.accuracy, 0) / arr.length) : 0; }
    data.push({ day: label, memory: avg(memR), attention: avg(attR), recall: avg(recR), reaction: avg(attR), games: dayResults.length });
  }
  return data;
}
