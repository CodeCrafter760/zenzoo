import { ShopItem } from './types';

// Backgrounds are solid colors, not scenes. Every kid starts owning the 2 Starter colors for
// free; the other 25 are cheap, priced by rarity tier (Common cheapest, Legendary priciest).
// `type` holds the hex color consumed by PetBackground's `bgColor` prop.
export const BACKGROUNDS: ShopItem[] = [
  // Starter — free, owned from the very first profile
  { id: 'bg_sky_blue',       name: 'Sky Blue',         cost: 0,   category: 'Backgrounds', type: '#4FC3F7', rarity: 'Starter' },
  { id: 'bg_sunny_yellow',   name: 'Sunny Yellow',     cost: 0,   category: 'Backgrounds', type: '#FFD54F', rarity: 'Starter' },

  // Common
  { id: 'bg_bubblegum_pink', name: 'Bubblegum Pink',   cost: 6,   category: 'Backgrounds', type: '#FF8FAB', rarity: 'Common' },
  { id: 'bg_grass_green',    name: 'Grass Green',      cost: 6,   category: 'Backgrounds', type: '#66BB6A', rarity: 'Common' },
  { id: 'bg_snow_white',     name: 'Snow White',       cost: 6,   category: 'Backgrounds', type: '#FAFAFA', rarity: 'Common' },
  { id: 'bg_tangerine',      name: 'Tangerine',        cost: 8,   category: 'Backgrounds', type: '#FFA726', rarity: 'Common' },
  { id: 'bg_slate_gray',     name: 'Slate Gray',       cost: 8,   category: 'Backgrounds', type: '#78909C', rarity: 'Common' },
  { id: 'bg_sky_lavender',   name: 'Sky Lavender',     cost: 10,  category: 'Backgrounds', type: '#B39DDB', rarity: 'Common' },
  { id: 'bg_coral_blush',    name: 'Coral Blush',      cost: 10,  category: 'Backgrounds', type: '#FF7043', rarity: 'Common' },
  { id: 'bg_mint_fresh',     name: 'Mint Fresh',       cost: 10,  category: 'Backgrounds', type: '#4DD0E1', rarity: 'Common' },

  // Uncommon
  { id: 'bg_lemon_zest',     name: 'Lemon Zest',       cost: 15,  category: 'Backgrounds', type: '#FFEE58', rarity: 'Uncommon' },
  { id: 'bg_peach_fizz',     name: 'Peach Fizz',       cost: 15,  category: 'Backgrounds', type: '#FFAB91', rarity: 'Uncommon' },
  { id: 'bg_ocean_teal',     name: 'Ocean Teal',       cost: 18,  category: 'Backgrounds', type: '#26A69A', rarity: 'Uncommon' },
  { id: 'bg_berry_purple',   name: 'Berry Purple',     cost: 18,  category: 'Backgrounds', type: '#8E24AA', rarity: 'Uncommon' },
  { id: 'bg_sunset_red',     name: 'Sunset Red',       cost: 18,  category: 'Backgrounds', type: '#FF5252', rarity: 'Uncommon' },
  { id: 'bg_sakura_pink',    name: 'Sakura Pink',      cost: 20,  category: 'Backgrounds', type: '#F48FB1', rarity: 'Uncommon' },
  { id: 'bg_forest_emerald', name: 'Forest Emerald',   cost: 20,  category: 'Backgrounds', type: '#2E7D32', rarity: 'Uncommon' },
  { id: 'bg_royal_indigo',   name: 'Royal Indigo',     cost: 22,  category: 'Backgrounds', type: '#3F51B5', rarity: 'Uncommon' },

  // Rare
  { id: 'bg_amethyst_dream', name: 'Amethyst Dream',   cost: 35,  category: 'Backgrounds', type: '#7C4DFF', rarity: 'Rare' },
  { id: 'bg_golden_hour',    name: 'Golden Hour',      cost: 40,  category: 'Backgrounds', type: '#FFC107', rarity: 'Rare' },
  { id: 'bg_ruby_blaze',     name: 'Ruby Blaze',       cost: 40,  category: 'Backgrounds', type: '#D32F2F', rarity: 'Rare' },
  { id: 'bg_deep_sea_navy',  name: 'Deep Sea Navy',    cost: 45,  category: 'Backgrounds', type: '#1A237E', rarity: 'Rare' },
  { id: 'bg_aurora_green',   name: 'Aurora Green',     cost: 45,  category: 'Backgrounds', type: '#00E676', rarity: 'Rare' },

  // Epic
  { id: 'bg_cosmic_violet',  name: 'Cosmic Violet',    cost: 70,  category: 'Backgrounds', type: '#6A1B9A', rarity: 'Epic' },
  { id: 'bg_midnight_galaxy',name: 'Midnight Galaxy',  cost: 80,  category: 'Backgrounds', type: '#0D1321', rarity: 'Epic' },
  { id: 'bg_molten_gold',    name: 'Molten Gold',      cost: 90,  category: 'Backgrounds', type: '#FFB300', rarity: 'Epic' },

  // Legendary
  { id: 'bg_diamond_sparkle',name: 'Diamond Sparkle',  cost: 150, category: 'Backgrounds', type: '#B3E5FC', rarity: 'Legendary' },

  // Earned only — granted by the 30-day streak reward, never purchasable.
  { id: 'bg_streak_gold',    name: 'Streak Gold',      cost: 0,   category: 'Backgrounds', type: '#FFD700', exclusive: true },

  // Teen-only — LED/neon room colors for the "Drip" shop, priced like Rare/Epic tiers.
  { id: 'bg_neon_violet',    name: 'Neon Violet',      cost: 35,  category: 'Backgrounds', type: '#BB86FC', rarity: 'Rare', ageGroup: 'Teen (13-17)' },
  { id: 'bg_neon_teal',      name: 'Neon Teal',        cost: 35,  category: 'Backgrounds', type: '#03DAC6', rarity: 'Rare', ageGroup: 'Teen (13-17)' },
  { id: 'bg_hot_magenta',    name: 'Hot Magenta',      cost: 40,  category: 'Backgrounds', type: '#FF2E92', rarity: 'Rare', ageGroup: 'Teen (13-17)' },
  { id: 'bg_matte_charcoal', name: 'Matte Charcoal',   cost: 70,  category: 'Backgrounds', type: '#1A1A1A', rarity: 'Epic', ageGroup: 'Teen (13-17)' },
];
