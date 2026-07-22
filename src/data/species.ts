import type { EyeStyle } from '../components/sprites/PetAvatar';

export interface SpeciesDef {
  type: string;
  color: string;
  eyes: EyeStyle;
  unlockLevel: number;
  muzzle: string;
  accent: string;
}

export const SPECIES_LIST: SpeciesDef[] = [
  { type: 'Bear',      color: '#FFD3B6', eyes: 'Wonder',  unlockLevel: 1,  muzzle: '#FFE8D6', accent: '#E8A87C' },
  { type: 'Fox',       color: '#FFAAA5', eyes: 'Sleepy',  unlockLevel: 1,  muzzle: '#FFD6C0', accent: '#FF7675' },
  { type: 'Cat',       color: '#DED2F9', eyes: 'Calm',    unlockLevel: 1,  muzzle: '#EDE5FF', accent: '#A29BFE' },
  { type: 'Owl',       color: '#A8E6CF', eyes: 'Sparkle', unlockLevel: 1,  muzzle: '#F5F5DC', accent: '#55B87A' },
  { type: 'Koala',     color: '#B5C4C1', eyes: 'Calm',    unlockLevel: 5,  muzzle: '#D3DDD9', accent: '#7F9993' },
  { type: 'Elephant',  color: '#C5B4E3', eyes: 'Wonder',  unlockLevel: 10, muzzle: '#D8C8F0', accent: '#9B84CC' },
  { type: 'Hippo',     color: '#D4A5A5', eyes: 'Sleepy',  unlockLevel: 15, muzzle: '#E8C4C4', accent: '#B87070' },
  { type: 'Red Panda', color: '#E8956D', eyes: 'Sparkle', unlockLevel: 20, muzzle: '#F5C9A0', accent: '#C4623A' },
  { type: 'Lion',      color: '#F4D03F', eyes: 'Wonder',  unlockLevel: 25, muzzle: '#FAE5A0', accent: '#D4AA30' },
  { type: 'Zebra',     color: '#EAECEE', eyes: 'Calm',    unlockLevel: 30, muzzle: '#F5F6F7', accent: '#95A5A6' },
];

export function findSpecies(type: string): SpeciesDef {
  return SPECIES_LIST.find(s => s.type === type) ?? SPECIES_LIST[0];
}
