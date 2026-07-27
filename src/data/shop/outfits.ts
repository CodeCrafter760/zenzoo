import { ShopItem } from './types';

// Each id is `outfit_<style>`, where `<style>` must be a member of `OutfitStyle` in
// `src/components/sprites/PetAvatar.tsx` (see `outfitStyleFromId`).
export const OUTFITS: ShopItem[] = [
  { id: 'outfit_ninja',     name: 'Ninja Gi',        cost: 40,  category: 'Outfits' },
  { id: 'outfit_comfy',     name: 'Comfy Sweater',   cost: 20,  category: 'Outfits' },
  { id: 'outfit_zen',       name: 'Zen Robe',        cost: 55,  category: 'Outfits' },
  { id: 'outfit_star',      name: 'Stargazer Cape',  cost: 90,  category: 'Outfits' },
  { id: 'outfit_astronaut', name: 'Astronaut Suit',  cost: 110, category: 'Outfits' },
  { id: 'outfit_superhero', name: 'Superhero Cape',  cost: 85,  category: 'Outfits' },
  { id: 'outfit_wizard',    name: "Wizard's Robe",   cost: 95,  category: 'Outfits' },
  { id: 'outfit_royal',     name: 'Royal Robe',      cost: 130, category: 'Outfits' },
  { id: 'outfit_explorer',  name: "Explorer's Vest", cost: 45,  category: 'Outfits' },
  { id: 'outfit_rainbow',   name: 'Rainbow Outfit',  cost: 65,  category: 'Outfits' },
  { id: 'outfit_artist',    name: "Artist's Smock",  cost: 35,  category: 'Outfits' },
  { id: 'outfit_sporty',    name: 'Sporty Jersey',   cost: 30,  category: 'Outfits' },
  { id: 'outfit_pajama',    name: 'Cozy Pajamas',    cost: 25,  category: 'Outfits' },
  { id: 'outfit_flower',    name: 'Flower Dress',    cost: 50,  category: 'Outfits' },

  // Earned only — granted by the 14-day streak reward, never purchasable.
  { id: 'outfit_champion',  name: 'Champion Cape',   cost: 0,   category: 'Outfits', exclusive: true },
];
