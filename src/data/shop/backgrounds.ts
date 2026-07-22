import { ShopItem } from './types';

// Each `type` here must have a matching render branch in `src/components/PetBackground.tsx`.
export const BACKGROUNDS: ShopItem[] = [
  { id: 'bg_meadow',      name: 'Sunny Meadow',      cost: 10,  category: 'Backgrounds', type: 'meadow' },
  { id: 'bg_treehouse',   name: 'Zen Treehouse',     cost: 50,  category: 'Backgrounds', type: 'treehouse' },
  { id: 'bg_space',       name: 'Cosmic Nebula',     cost: 100, category: 'Backgrounds', type: 'space' },
  { id: 'bg_forest',      name: 'Enchanted Forest',  cost: 75,  category: 'Backgrounds', type: 'forest' },
  { id: 'bg_beach',       name: 'Sunset Beach',      cost: 60,  category: 'Backgrounds', type: 'beach' },
  { id: 'bg_mountain',    name: 'Snowy Peaks',       cost: 65,  category: 'Backgrounds', type: 'mountain' },
  { id: 'bg_desert',      name: 'Golden Dunes',      cost: 45,  category: 'Backgrounds', type: 'desert' },
  { id: 'bg_underwater',  name: 'Coral Reef',        cost: 90,  category: 'Backgrounds', type: 'underwater' },
  { id: 'bg_cherry',      name: 'Cherry Blossoms',   cost: 55,  category: 'Backgrounds', type: 'cherry' },
  { id: 'bg_aurora',      name: 'Northern Lights',   cost: 140, category: 'Backgrounds', type: 'aurora' },
  { id: 'bg_candyland',   name: 'Candyland',         cost: 70,  category: 'Backgrounds', type: 'candyland' },
  { id: 'bg_library',     name: 'Cozy Library',      cost: 40,  category: 'Backgrounds', type: 'library' },
  { id: 'bg_waterfall',   name: 'Jungle Waterfall',  cost: 100, category: 'Backgrounds', type: 'waterfall' },
  { id: 'bg_carnival',    name: 'Starlight Carnival',cost: 85,  category: 'Backgrounds', type: 'carnival' },
  { id: 'bg_cloudscape',  name: 'Sky Islands',       cost: 120, category: 'Backgrounds', type: 'cloudscape' },
];
