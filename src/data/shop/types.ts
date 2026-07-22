export type ShopCategory = 'Backgrounds' | 'Hats' | 'Outfits';

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  category: ShopCategory;
  /** Background variant key consumed by `PetBackground`'s `bgType` prop. Only set for Backgrounds. */
  type?: string;
}
