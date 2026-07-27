export interface StreakReward {
  /** Streak length (in days) this reward unlocks at. */
  day: number;
  coins: number;
  /** Shop item id to grant (an `exclusive: true` cosmetic), if any. */
  itemId?: string;
  /** Display name shown in the reward celebration. */
  itemName?: string;
}

// Escalating rewards for showing up — coins alone at first, then exclusive cosmetics
// layered in, then bigger coin bonuses for the long-haul milestones.
export const STREAK_REWARDS: StreakReward[] = [
  { day: 3,   coins: 20 },
  { day: 7,   coins: 30,  itemId: 'hat_streakflame', itemName: 'Streak Flame' },
  { day: 14,  coins: 50,  itemId: 'outfit_champion',  itemName: 'Champion Cape' },
  { day: 30,  coins: 100, itemId: 'bg_streak_gold',   itemName: 'Streak Gold' },
  { day: 60,  coins: 150 },
  { day: 100, coins: 250 },
];
