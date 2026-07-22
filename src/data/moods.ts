import { PALETTE } from '../theme/theme';

export interface MoodOption {
  key: string;
  emoji: string;
  color: string;
}

export const MOODS: MoodOption[] = [
  { key: 'Happy',   emoji: '😄', color: PALETTE.gold },
  { key: 'Calm',    emoji: '😌', color: PALETTE.mint },
  { key: 'Excited', emoji: '🤩', color: PALETTE.pink },
  { key: 'Tired',   emoji: '😴', color: PALETTE.indigo },
  { key: 'Sad',     emoji: '😢', color: PALETTE.sky },
  { key: 'Anxious', emoji: '😰', color: PALETTE.purple },
  { key: 'Angry',   emoji: '😠', color: PALETTE.coral },
];

export const MOOD_TAGS = ['School', 'Family', 'Friends', 'Sleep', 'Screen Time', 'Health', 'Something Else'];

export function findMood(key: string): MoodOption {
  return MOODS.find(m => m.key === key) ?? MOODS[0];
}
