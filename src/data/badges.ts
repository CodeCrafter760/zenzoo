export interface BadgeStats {
  breathingSessions: number;
  focusSessionsCompleted: number;
  storiesFinished: number;
  longestStreak: number;
  totalCoinsEarned: number;
  level: number;
  ownedItemsCount: number;
  journalEntriesCount: number;
  moodEntriesCount: number;
}

export interface BadgeDef {
  id: string;
  name: string;
  emoji: string;
  description: string;
  isEarned: (stats: BadgeStats) => boolean;
}

// Every badge is derived from a stat the app already tracks — no separate "unlock" state
// to maintain beyond the `unlockedBadges` id list (which just records *that* it fired once).
export const BADGES: BadgeDef[] = [
  { id: 'first-breath',  name: 'First Breath',   emoji: '🌬️', description: 'Complete your first breathing session', isEarned: s => s.breathingSessions >= 1 },
  { id: 'breath-master', name: 'Breath Master',  emoji: '🌊', description: 'Complete 25 breathing sessions',        isEarned: s => s.breathingSessions >= 25 },
  { id: 'focused-mind',  name: 'Focused Mind',   emoji: '🎯', description: 'Complete 10 focus sessions',            isEarned: s => s.focusSessionsCompleted >= 10 },
  { id: 'bookworm',      name: 'Bookworm',       emoji: '📖', description: 'Finish 5 stories',                      isEarned: s => s.storiesFinished >= 5 },
  { id: 'week-streak',   name: 'Week Streak',    emoji: '🔥', description: 'Reach a 7-day streak',                  isEarned: s => s.longestStreak >= 7 },
  { id: 'month-streak',  name: 'Month Streak',   emoji: '🏆', description: 'Reach a 30-day streak',                 isEarned: s => s.longestStreak >= 30 },
  { id: 'century-club',  name: 'Century Club',   emoji: '💯', description: 'Reach a 100-day streak',                isEarned: s => s.longestStreak >= 100 },
  { id: 'coin-collector',name: 'Coin Collector', emoji: '💎', description: 'Earn 200 Calm Coins in total',          isEarned: s => s.totalCoinsEarned >= 200 },
  { id: 'zookeeper',     name: 'Zookeeper',      emoji: '🦁', description: 'Unlock every animal species',           isEarned: s => s.level >= 25 },
  { id: 'fashionista',   name: 'Fashionista',    emoji: '🎨', description: 'Own 10 shop items',                     isEarned: s => s.ownedItemsCount >= 10 },
  { id: 'grateful-heart',name: 'Grateful Heart', emoji: '📝', description: 'Write 5 gratitude journal entries',     isEarned: s => s.journalEntriesCount >= 5 },
  { id: 'mood-tracker',  name: 'Mood Tracker',   emoji: '😊', description: 'Log your mood 7 times',                 isEarned: s => s.moodEntriesCount >= 7 },
];
