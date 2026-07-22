export type StoryAnimType =
  | 'sleepy-cloud' | 'breathing-garden' | 'brave-star' | 'calm-river' | 'forest-friends'
  | 'wiggle-worm' | 'focus-crystal' | 'balloon-ride' | 'glowing-heart' | 'tummy-boat'
  | 'starry-quilt' | 'wind-chime' | 'lighthouse-beam' | 'stepping-stones' | 'sunrise-hug'
  | 'jar-of-fireflies' | 'growing-plant' | 'kite-flying' | 'weather-mood';

export type StoryGenre = 'Sleep' | 'Breathing' | 'Focus' | 'Anxiety' | 'Kindness' | 'Confidence' | 'Emotions';
export type StoryAgeGroup = 'Toddler (2-4)' | 'Preschool (4-6)' | 'Big Kid (6-9)';

export const STORY_GENRES: StoryGenre[] = ['Sleep', 'Breathing', 'Focus', 'Anxiety', 'Kindness', 'Confidence', 'Emotions'];
export const STORY_AGE_GROUPS: StoryAgeGroup[] = ['Toddler (2-4)', 'Preschool (4-6)', 'Big Kid (6-9)'];

// Only the human-readable fields need a translation — color, anim, audio, etc.
// stay the same regardless of language.
export interface StoryTranslation {
  title: string;
  description: string;
  readTime: string;
  content: string;
}

export interface StoryItem {
  title: string;
  emoji: string;
  description: string;
  readTime: string;
  color: string;
  bg: string;
  content: string;
  anim: StoryAnimType;
  audio: number | null;
  genre: StoryGenre;
  ageGroup: StoryAgeGroup;
  es?: StoryTranslation;
}
