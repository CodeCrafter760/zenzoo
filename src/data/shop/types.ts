export type ShopCategory = 'Backgrounds' | 'Hats' | 'Outfits';
export type ColorRarity = 'Starter' | 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  category: ShopCategory;
  /** Hex color consumed by `PetBackground`'s `bgColor` prop. Only set for Backgrounds. */
  type?: string;
  /** Only set for Backgrounds — drives cost tiering and the rarity badge in the shop. */
  rarity?: ColorRarity;
  /** Earned only (streak rewards, etc.) — never shown in the purchasable shop grid. */
  exclusive?: boolean;
  /** Restricts the item to a single age tier's shop grid (e.g. teen-only neon backgrounds).
   *  Omitted (the vast majority of items) means visible to every age group. */
  ageGroup?: import('../stories/types').StoryAgeGroup;
}
