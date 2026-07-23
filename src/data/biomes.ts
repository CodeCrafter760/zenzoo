export type BiomeKey = 'Forest' | 'Savanna' | 'Wetlands' | 'Eucalyptus Grove' | 'Meadow';

export interface BiomeDef {
  key: BiomeKey;
  icon: string;
  color: string;
}

export const BIOMES: BiomeDef[] = [
  { key: 'Forest',            icon: '🌲', color: '#2E7D32' },
  { key: 'Savanna',           icon: '🌾', color: '#D4AA30' },
  { key: 'Wetlands',          icon: '💧', color: '#0288D1' },
  { key: 'Eucalyptus Grove',  icon: '🌿', color: '#55B87A' },
  { key: 'Meadow',            icon: '🌸', color: '#FF6FA5' },
];
