import type { AICompanionMessage, UserProfile, MemoryItem, GameSession } from '../types';

export interface AIQueryContext {
  user: UserProfile;
  memories: MemoryItem[];
  recentSessions: GameSession[];
}

export interface AIServiceResponse {
  message: string;
  suggestions: string[];
  actionLink?: {
    label: string;
    path: string;
  };
}

class AICompanionService {
  /**
   * Generates response locally with intelligent contextual matching.
   * This interface is architected so an external API (e.g. Gemini, Anthropic, or OpenAI backend proxy)
   * can be plugged in by swapping this method with a fetch() call.
   */
  async sendMessage(query: string, context: AIQueryContext): Promise<AIServiceResponse> {
    // Simulate natural AI thinking time (400ms)
    await new Promise(res => setTimeout(res, 400));

    const q = query.toLowerCase().trim();
    const { user, memories, recentSessions } = context;

    // 1. Game Recommendation
    if (q.includes('recommend') || q.includes('play') || q.includes('game') || q.includes('exercise') || q.includes('start')) {
      const lastSession = recentSessions[recentSessions.length - 1];
      const recommendedGame = lastSession?.gameId === 'memory-match' ? 'Sequence Memory' : 'Memory Match';
      return {
        message: `Hello ${user.name}! Based on your recent activity and ${user.streakDays}-day streak, I recommend warming up today with ${recommendedGame}. It gently exercises working memory and spatial focus without causing visual fatigue.`,
        suggestions: ['Start Memory Match', 'How does Sequence Memory work?', 'Show my progress'],
        actionLink: {
          label: `Play ${recommendedGame}`,
          path: lastSession?.gameId === 'memory-match' ? '/games/sequence-memory' : '/games/memory-match',
        },
      };
    }

    // 2. Score and Progress Explanation
    if (q.includes('score') || q.includes('progress') || q.includes('how am i doing') || q.includes('stats') || q.includes('analytics')) {
      const avgAcc = recentSessions.length > 0 
        ? Math.round(recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length)
        : 88;
      return {
        message: `Your current Cognitive Wellness Score is ${user.cognitiveScore} / 1000, with an outstanding average accuracy of ${avgAcc}%. Your attention and visual recognition are trending strongly upward over the last week.`,
        suggestions: ['View full progress charts', 'Recommend a game', 'How is difficulty adjusted?'],
        actionLink: {
          label: 'View Detailed Analytics',
          path: '/progress',
        },
      };
    }

    // 3. Memory Vault & Family Questions
    if (q.includes('memory') || q.includes('family') || q.includes('diwali') || q.includes('rhea') || q.includes('photo') || q.includes('vault') || q.includes('shimla')) {
      const memoryCount = memories.length;
      const diwaliMem = memories.find(m => m.title.toLowerCase().includes('diwali'));
      const rheaMem = memories.find(m => m.title.toLowerCase().includes('rhea'));

      let recallSnippet = '';
      if (q.includes('diwali') && diwaliMem) {
        recallSnippet = ` You celebrated Diwali lighting earthen lamps in the courtyard, and granddaughter Rhea made a colorful floral rangoli.`;
      } else if (q.includes('rhea') && rheaMem) {
        recallSnippet = ` Rhea graduated with honors in Environmental Architecture and dedicated her thesis to your terrace garden!`;
      }

      return {
        message: `You have ${memoryCount} treasured moments safely stored in your Memory Vault.${recallSnippet} Would you like to do a gentle Memory Review quiz to recall special details?`,
        suggestions: ['Start Memory Review Quiz', 'Add a new memory', 'Who is Vikram?'],
        actionLink: {
          label: 'Open Memory Vault',
          path: '/vault',
        },
      };
    }

    // 4. Friend / Person Specific
    if (q.includes('vikram') || q.includes('friend') || q.includes('engineering')) {
      return {
        message: `Vikram is your lifelong friend and engineering partner since 1978. You have a standing phone call with him every Sunday at 10:00 AM.`,
        suggestions: ['View Vikram in Memory Vault', 'Set a reminder for Sunday', 'Recommend a game'],
        actionLink: {
          label: 'See Memory Details',
          path: '/vault',
        },
      };
    }

    // 5. Encouraging thoughts
    if (q.includes('encourage') || q.includes('motivat') || q.includes('positive') || q.includes('feel') || q.includes('tired')) {
      const quotes = [
        `"Every gentle puzzle solved builds neural connections, like water nurturing a growing tree." You are doing wonderful work for your brain wellness, ${user.name}!`,
        `"Patience and daily rhythm create lasting clarity." Take deep, steady breaths—today is a brand-new day full of bright moments.`,
        `Celebrate how far you've come: ${user.streakDays} consecutive days of mindful practice is a remarkable accomplishment!`,
      ];
      return {
        message: quotes[Math.floor(Math.random() * quotes.length)],
        suggestions: ['Play a relaxing game', 'Review favorite memories', 'Show daily plan'],
      };
    }

    // 6. Navigation / Help
    if (q.includes('help') || q.includes('how to') || q.includes('settings') || q.includes('caregiver')) {
      return {
        message: `I'm here to help! You can navigate anytime using the menu:
• Play Games: 4 interactive cognitive exercises
• Memory Vault: Your personal photo album & journal
• Caregiver Portal: Share progress updates with family
• Accessibility: Adjust text sizes & high contrast mode.`,
        suggestions: ['Adjust Accessibility', 'Open Caregiver Portal', 'Go to Dashboard'],
        actionLink: {
          label: 'Accessibility Settings',
          path: '/settings',
        },
      };
    }

    // Default polite wellness response
    return {
      message: `I'm right here with you, ${user.name}. I can help you pick an enjoyable cognitive game, recall details from your Memory Vault, or explain how your daily wellness streak is progressing. What would you like to explore?`,
      suggestions: [
        'Recommend a game for today',
        'How does my cognitive score look?',
        'Help me review family memories',
        'Share an encouraging thought',
      ],
    };
  }
}

export const aiCompanionService = new AICompanionService();
