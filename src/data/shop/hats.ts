import { ShopItem } from './types';

// Each id is `hat_<style>`, where `<style>` must be a member of `HatStyle` in
// `src/components/sprites/PetAvatar.tsx` (see `hatStyleFromId`).
export const HATS: ShopItem[] = [
  { id: 'hat_top',         name: 'Fancy Top Hat',   cost: 25,  category: 'Hats' },
  { id: 'hat_crown',       name: 'Golden Crown',    cost: 80,  category: 'Hats' },
  { id: 'hat_beanie',      name: 'Cozy Beanie',     cost: 30,  category: 'Hats' },
  { id: 'hat_halo',        name: 'Angelic Halo',    cost: 120, category: 'Hats' },
  { id: 'hat_wizard',      name: "Wizard's Cap",    cost: 95,  category: 'Hats' },
  { id: 'hat_flower',      name: 'Flower Crown',    cost: 35,  category: 'Hats' },
  { id: 'hat_pirate',      name: "Pirate's Hat",    cost: 70,  category: 'Hats' },
  { id: 'hat_party',       name: 'Party Hat',       cost: 20,  category: 'Hats' },
  { id: 'hat_bow',         name: 'Cute Bow',        cost: 15,  category: 'Hats' },
  { id: 'hat_cap',         name: 'Baseball Cap',    cost: 25,  category: 'Hats' },
  { id: 'hat_headphones',  name: 'Cozy Headphones', cost: 45,  category: 'Hats' },
  { id: 'hat_antlers',     name: 'Reindeer Antlers',cost: 55,  category: 'Hats' },
  { id: 'hat_graduation',  name: 'Graduation Cap',  cost: 60,  category: 'Hats' },
  { id: 'hat_propeller',   name: 'Propeller Beanie',cost: 40,  category: 'Hats' },
];
