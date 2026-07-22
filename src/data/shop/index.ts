import { BACKGROUNDS } from './backgrounds';
import { HATS } from './hats';
import { OUTFITS } from './outfits';

export * from './types';
export { BACKGROUNDS, HATS, OUTFITS };

export const SHOP_CATALOG = [...BACKGROUNDS, ...HATS, ...OUTFITS];
