import React from 'react';
import Svg, { Circle, Ellipse, Path, Polygon, Rect, G, Image as SvgImage, Defs, LinearGradient, Stop } from 'react-native-svg';
import type { ImageSourcePropType } from 'react-native';

// Real character art (assets/Species) — key matches SpeciesDef.type in src/data/species.ts.
const SPECIES_IMAGES: Record<string, ImageSourcePropType> = {
  Bear:       require('../../../assets/Species/bear.png'),
  Fox:        require('../../../assets/Species/fox.png'),
  Cat:        require('../../../assets/Species/cat.png'),
  Owl:        require('../../../assets/Species/owl.png'),
  Koala:      require('../../../assets/Species/koala.png'),
  Elephant:   require('../../../assets/Species/elephant.png'),
  Hippo:      require('../../../assets/Species/hippo.png'),
  'Red Panda':require('../../../assets/Species/red_panda.png'),
  Lion:       require('../../../assets/Species/lion.png'),
};

// width/height of the source art — the head is drawn at a fixed height with width scaled to
// match, so every species reads as the same size regardless of its image's own proportions.
const SPECIES_ASPECT: Record<string, number> = {
  Bear: 1, Fox: 564 / 543, Cat: 1, Owl: 818 / 980, Koala: 704 / 436,
  Elephant: 1385 / 980, Hippo: 1, 'Red Panda': 1, Lion: 450 / 360,
};

export type EyeStyle = 'Wonder' | 'Calm' | 'Sparkle' | 'Sleepy';
export type HairStyle = 'None' | 'Bangs' | 'Mohawk' | 'Double Buns' | 'Wavy';
export type HatStyle =
  | 'top' | 'crown' | 'beanie' | 'halo'
  | 'wizard' | 'flower' | 'pirate' | 'party' | 'bow' | 'cap' | 'headphones' | 'antlers' | 'graduation' | 'propeller';
export type OutfitStyle =
  | 'ninja' | 'comfy' | 'zen' | 'star'
  | 'astronaut' | 'superhero' | 'wizard' | 'royal' | 'explorer' | 'rainbow' | 'artist' | 'sporty' | 'pajama' | 'flower';

const HAT_STYLES: HatStyle[] = [
  'top', 'crown', 'beanie', 'halo',
  'wizard', 'flower', 'pirate', 'party', 'bow', 'cap', 'headphones', 'antlers', 'graduation', 'propeller',
];
const OUTFIT_STYLES: OutfitStyle[] = [
  'ninja', 'comfy', 'zen', 'star',
  'astronaut', 'superhero', 'wizard', 'royal', 'explorer', 'rainbow', 'artist', 'sporty', 'pajama', 'flower',
];

// Shop item ids follow `hat_<style>` / `outfit_<style>` — the style suffix must be a HatStyle/OutfitStyle member.
export function hatStyleFromId(id: string | null | undefined): HatStyle | null {
  if (!id) return null;
  const style = id.replace(/^hat_/, '');
  return (HAT_STYLES as string[]).includes(style) ? (style as HatStyle) : null;
}

export function outfitStyleFromId(id: string | null | undefined): OutfitStyle | null {
  if (!id) return null;
  const style = id.replace(/^outfit_/, '');
  return (OUTFIT_STYLES as string[]).includes(style) ? (style as OutfitStyle) : null;
}

const EYE_STYLES: EyeStyle[] = ['Wonder', 'Calm', 'Sparkle', 'Sleepy'];
const HAIR_STYLES: HairStyle[] = ['None', 'Bangs', 'Mohawk', 'Double Buns', 'Wavy'];

export function asEyeStyle(s: string): EyeStyle {
  return EYE_STYLES.includes(s as EyeStyle) ? (s as EyeStyle) : 'Wonder';
}
export function asHairStyle(s: string): HairStyle {
  return HAIR_STYLES.includes(s as HairStyle) ? (s as HairStyle) : 'None';
}

interface Props {
  species: string;
  bodyColor: string;
  accentColor: string;
  muzzleColor: string;
  eyes: EyeStyle;
  hair?: HairStyle;
  hat?: HatStyle | null;
  outfit?: OutfitStyle | null;
  size?: number;
}

// ── Shared geometry ──────────────────────────────────────────────────────────
const CX = 60, CY = 78, BODY_R = 34;

export function Hat({ style }: { style: HatStyle }) {
  switch (style) {
    case 'top':
      return (
        <G>
          <Rect x={36} y={36} width={48} height={6} rx={3} fill="#2D3436" />
          <Rect x={44} y={10} width={32} height={28} rx={3} fill="#2D3436" />
          <Rect x={44} y={30} width={32} height={5} fill="#6C5CE7" />
        </G>
      );
    case 'crown':
      return (
        <G fill="#F1C40F">
          <Polygon points="38,38 38,22 48,32 60,16 72,32 82,22 82,38" />
          <Circle cx={60} cy={26} r={3} fill="#E74C3C" />
        </G>
      );
    case 'beanie':
      return (
        <G>
          <Path d="M38,38 Q38,12 60,12 Q82,12 82,38 Z" fill="#E74C3C" />
          <Rect x={36} y={34} width={48} height={7} rx={3} fill="#C0392B" />
          <Circle cx={60} cy={10} r={5} fill="#FFFFFF" />
        </G>
      );
    case 'halo':
      return <Ellipse cx={60} cy={20} rx={20} ry={6} fill="none" stroke="#F5E642" strokeWidth={3} />;
    case 'wizard':
      return (
        <G>
          <Polygon points="60,4 44,40 76,40" fill="#4B2E83" />
          <Rect x={40} y={36} width={40} height={6} rx={3} fill="#3A2266" />
          <Circle cx={60} cy={18} r={2} fill="#FFD700" />
          <Circle cx={52} cy={27} r={1.5} fill="#FFD700" />
          <Circle cx={68} cy={24} r={1.5} fill="#FFD700" />
        </G>
      );
    case 'flower':
      return (
        <G>
          {[[36, 36], [48, 27], [60, 24], [72, 27], [84, 36]].map(([fx, fy], i) => (
            <G key={i}>
              <Circle cx={fx} cy={fy} r={5} fill="#FF6FA5" />
              <Circle cx={fx} cy={fy} r={2} fill="#FFD700" />
            </G>
          ))}
        </G>
      );
    case 'pirate':
      return (
        <G>
          <Path d="M34,40 Q60,10 86,40 Q60,26 34,40 Z" fill="#2D2D2D" />
          <Rect x={44} y={34} width={32} height={6} rx={3} fill="#B71C1C" />
          <Circle cx={60} cy={22} r={3} fill="#F5F5F5" />
        </G>
      );
    case 'party':
      return (
        <G>
          <Polygon points="60,6 46,40 74,40" fill="#FF4757" />
          <Polygon points="60,6 52,40 68,40" fill="#FFD700" opacity={0.5} />
          <Circle cx={60} cy={6} r={5} fill="#FFFFFF" />
        </G>
      );
    case 'bow':
      return (
        <G fill="#FF6FA5">
          <Polygon points="60,26 40,14 40,38" />
          <Polygon points="60,26 80,14 80,38" />
          <Circle cx={60} cy={26} r={6} fill="#E84393" />
        </G>
      );
    case 'cap':
      return (
        <G>
          <Path d="M38,34 Q38,14 60,14 Q82,14 82,34 Z" fill="#3B82F6" />
          <Rect x={36} y={30} width={48} height={7} rx={3} fill="#2563EB" />
          <Path d="M78,32 Q98,32 98,40 L78,38 Z" fill="#2563EB" />
        </G>
      );
    case 'headphones':
      return (
        <G>
          <Path d="M34,44 Q34,10 60,10 Q86,10 86,44" stroke="#2D3436" strokeWidth={5} fill="none" />
          <Circle cx={34} cy={48} r={10} fill="#636E72" />
          <Circle cx={86} cy={48} r={10} fill="#636E72" />
          <Circle cx={34} cy={48} r={5} fill="#B2BEC3" />
          <Circle cx={86} cy={48} r={5} fill="#B2BEC3" />
        </G>
      );
    case 'antlers':
      return (
        <G stroke="#8D6E63" strokeWidth={4} strokeLinecap="round" fill="none">
          <Path d="M42,40 L36,14 M36,14 L28,18 M36,14 L40,22" />
          <Path d="M78,40 L84,14 M84,14 L92,18 M84,14 L80,22" />
        </G>
      );
    case 'graduation':
      return (
        <G>
          <Polygon points="60,16 30,30 60,44 90,30" fill="#1E1E2E" />
          <Rect x={54} y={30} width={12} height={12} fill="#1E1E2E" />
          <Circle cx={60} cy={44} r={3} fill="#F1C40F" />
          <Path d="M60,44 L74,52" stroke="#F1C40F" strokeWidth={2} />
        </G>
      );
    case 'propeller':
      return (
        <G>
          <Path d="M38,38 Q38,16 60,16 Q82,16 82,38 Z" fill="#00B894" />
          <Rect x={36} y={34} width={48} height={7} rx={3} fill="#00997A" />
          <Rect x={57} y={4} width={6} height={14} fill="#636E72" />
          <Ellipse cx={60} cy={4} rx={14} ry={3} fill="#FDCB6E" />
          <Ellipse cx={60} cy={4} rx={3} ry={14} fill="#FDCB6E" opacity={0.7} />
        </G>
      );
    default:
      return null;
  }
}

// `r` is the half-width of the shoulders — PetAvatar scales this per species so a wide-headed
// koala gets broader shoulders than a narrow owl (see bodyHalfW in the main render below).
// Shop/wardrobe thumbnails (OutfitIcon) have no species context, so `r` defaults to BODY_R.
export function Outfit({ style, bodyColor, r = BODY_R }: { style: OutfitStyle; bodyColor: string; r?: number }) {
  // Nudged down from CY so more of the species' face stays visible above the neckline —
  // capped so the widest shoulders (r=46) still land exactly on the viewBox's bottom edge.
  const cy = CY + 6;
  switch (style) {
    case 'ninja':
      return (
        <G>
          <Defs>
            <LinearGradient id="ninjaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#4A4A4A" />
              <Stop offset="1" stopColor="#1A1A1A" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 26} ${CX + r},${cy + 6} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#ninjaGrad)" />
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 22} ${CX + r},${cy + 6}`} stroke="#000000" strokeWidth={1} opacity={0.4} fill="none" />
          <Path d={`M${CX - r + 6},${cy + 12} L${CX + r - 6},${cy + 28}`} stroke="#B71C1C" strokeWidth={7} strokeLinecap="round" />
          <Path d={`M${CX - r + 6},${cy + 12} L${CX + r - 6},${cy + 28}`} stroke="#E53935" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
          <Circle cx={CX} cy={cy + 20} r={6} fill="#2D2D2D" stroke="#B71C1C" strokeWidth={1.5} />
          <Polygon points={`${CX},${cy + 16} ${CX + 1.2},${cy + 19.2} ${CX + 4.5},${cy + 19.2} ${CX + 1.9},${cy + 21.2} ${CX + 2.8},${cy + 24.5} ${CX},${cy + 22.4} ${CX - 2.8},${cy + 24.5} ${CX - 1.9},${cy + 21.2} ${CX - 4.5},${cy + 19.2} ${CX - 1.2},${cy + 19.2}`} fill="#FFD700" />
        </G>
      );
    case 'comfy':
      return (
        <G>
          <Defs>
            <LinearGradient id="comfyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFC6BC" />
              <Stop offset="1" stopColor="#F79E8E" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 8} Q${CX},${cy + 24} ${CX + r},${cy + 8} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#comfyGrad)" />
          <G stroke="#E17B6F" strokeWidth={1.5} opacity={0.7}>
            <Path d={`M${CX - (r - 12)},${cy + 10} L${CX - (r - 12)},${cy + 16}`} />
            <Path d={`M${CX - (r - 18)},${cy + 12} L${CX - (r - 18)},${cy + 18}`} />
            <Path d={`M${CX + (r - 18)},${cy + 12} L${CX + (r - 18)},${cy + 18}`} />
            <Path d={`M${CX + (r - 12)},${cy + 10} L${CX + (r - 12)},${cy + 16}`} />
          </G>
          <Path d={`M${CX - 8},${cy + 12} Q${CX - 4},${cy + 8} ${CX},${cy + 12} Q${CX + 4},${cy + 8} ${CX + 8},${cy + 12} Q${CX + 8},${cy + 18} ${CX},${cy + 22} Q${CX - 8},${cy + 18} ${CX - 8},${cy + 12} Z`} fill="#E8847A" />
          <Path d={`M${CX - r},${cy + 8} Q${CX},${cy + 24} ${CX + r},${cy + 8}`} stroke="#FFFFFF" strokeWidth={1} opacity={0.5} fill="none" />
        </G>
      );
    case 'zen':
      return (
        <G>
          <Defs>
            <LinearGradient id="zenGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#8875F0" />
              <Stop offset="1" stopColor="#5849C4" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 4} Q${CX},${cy + 22} ${CX + r},${cy + 4} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#zenGrad)" />
          <Path d={`M${CX - r + 16},${cy + 6} L${CX + r - 10},${cy + r}`} stroke="#4A3BAA" strokeWidth={3} />
          <Path d={`M${CX + r - 16},${cy + 6} L${CX - r + 10},${cy + r}`} stroke="#4A3BAA" strokeWidth={3} />
          <Path d={`M${CX - r + 16},${cy + 6} L${CX + r - 10},${cy + r}`} stroke="#A395FF" strokeWidth={1} opacity={0.6} />
          <Path d={`M${CX + r - 16},${cy + 6} L${CX - r + 10},${cy + r}`} stroke="#A395FF" strokeWidth={1} opacity={0.6} />
          <Circle cx={CX} cy={cy + 20} r={7} fill="#FFFFFF" opacity={0.9} />
          <Path d={`M${CX},${cy + 14} Q${CX + 4},${cy + 20} ${CX},${cy + 26} Q${CX - 4},${cy + 20} ${CX},${cy + 14} Z`} fill="#4A3BAA" />
        </G>
      );
    case 'star':
      return (
        <G>
          <Defs>
            <LinearGradient id="starGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#2E2A6B" />
              <Stop offset="1" stopColor="#12103A" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy} Q${CX},${cy + 30} ${CX + r},${cy} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#starGrad)" />
          <Circle cx={CX - 20} cy={cy + 10} r={1.4} fill="#FFFFFF" />
          <Circle cx={CX + 20} cy={cy + 8} r={1.2} fill="#FFFFFF" />
          <Circle cx={CX + 10} cy={cy + 22} r={1} fill="#FFFFFF" />
          <Circle cx={CX - 12} cy={cy + 24} r={1} fill="#FFFFFF" />
          <Polygon points={`${CX},${cy + 8} ${CX + 4},${cy + 14} ${CX + 10},${cy + 14} ${CX + 5},${cy + 18} ${CX + 6},${cy + 24} ${CX},${cy + 20} ${CX - 6},${cy + 24} ${CX - 5},${cy + 18} ${CX - 10},${cy + 14} ${CX - 4},${cy + 14}`} fill="#FFD700" />
          <Polygon points={`${CX},${cy + 4} ${CX + 5},${cy + 12} ${CX + 14},${cy + 12} ${CX + 6},${cy + 17} ${CX + 8},${cy + 26} ${CX},${cy + 21} ${CX - 8},${cy + 26} ${CX - 6},${cy + 17} ${CX - 14},${cy + 12} ${CX - 5},${cy + 12}`} fill="none" stroke="#FFEE99" strokeWidth={0.6} opacity={0.7} />
        </G>
      );
    case 'astronaut':
      return (
        <G>
          <Defs>
            <LinearGradient id="astroGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" />
              <Stop offset="1" stopColor="#D4DADC" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 24} ${CX + r},${cy + 6} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#astroGrad)" />
          <Path d={`M${CX - r + 6},${cy + 14} L${CX - r + 6},${cy + r + 4} M${CX + r - 6},${cy + 14} L${CX + r - 6},${cy + r + 4}`} stroke="#8FA3AA" strokeWidth={2} />
          <Rect x={CX - r} y={cy + 6} width={r * 2} height={9} fill="#B2BEC3" />
          <Circle cx={CX - 15} cy={cy + 10.5} r={2} fill="#78909C" />
          <Circle cx={CX} cy={cy + 10.5} r={2} fill="#78909C" />
          <Circle cx={CX + 15} cy={cy + 10.5} r={2} fill="#78909C" />
          <Circle cx={CX} cy={cy + 24} r={6} fill="#FF4757" />
          <Circle cx={CX} cy={cy + 24} r={6} fill="none" stroke="#B2BEC3" strokeWidth={1.5} />
          <Path d={`M${CX - 4},${cy + 24} A4,4 0 0 1 ${CX + 4},${cy + 24}`} stroke="#FFFFFF" strokeWidth={1} fill="none" opacity={0.7} />
        </G>
      );
    case 'superhero':
      return (
        <G>
          <Defs>
            <LinearGradient id="heroCapeGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#EF5350" />
              <Stop offset="1" stopColor="#B71C1C" />
            </LinearGradient>
            <LinearGradient id="heroSuitGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#42A5F5" />
              <Stop offset="1" stopColor="#0D5DAB" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r - 4},${cy} Q${CX},${cy + 40} ${CX + r + 4},${cy} L${CX + r + 2},${cy + r + 6} L${CX - r - 2},${cy + r + 6} Z`} fill="url(#heroCapeGrad)" />
          <Path d={`M${CX - r + 6},${cy + 4} Q${CX},${cy + 30} ${CX + r - 6},${cy + 4}`} stroke="#8B0000" strokeWidth={1} opacity={0.5} fill="none" />
          <Path d={`M${CX},${cy} L${CX},${cy + r + 4}`} stroke="#8B0000" strokeWidth={1} opacity={0.35} />
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 22} ${CX + r},${cy + 6} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#heroSuitGrad)" />
          <Polygon points={`${CX},${cy + 10} ${CX - 6},${cy + 20} ${CX},${cy + 18} ${CX + 6},${cy + 20}`} fill="#FFD700" stroke="#E8A800" strokeWidth={0.5} />
          <Circle cx={CX} cy={cy + 15} r={1.5} fill="#FFD700" />
          <Rect x={CX - 10} y={cy + r} width={20} height={4} rx={2} fill="#2D3436" />
          <Circle cx={CX} cy={cy + r + 2} r={2.5} fill="#FFD700" />
        </G>
      );
    case 'wizard':
      return (
        <G>
          <Defs>
            <LinearGradient id="wizOutfitGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#6A4CB8" />
              <Stop offset="1" stopColor="#3A2266" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 2} Q${CX},${cy + 20} ${CX + r},${cy + 2} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#wizOutfitGrad)" />
          <Path d={`M${CX - r},${cy + 2} Q${CX},${cy + 20} ${CX + r},${cy + 2}`} stroke="#FFD700" strokeWidth={2} fill="none" opacity={0.85} />
          <Circle cx={CX - 14} cy={cy + 12} r={1.4} fill="#FFD700" />
          <Circle cx={CX} cy={cy + 18} r={1.4} fill="#FFD700" />
          <Circle cx={CX + 14} cy={cy + 12} r={1.4} fill="#FFD700" />
          <Path d={`M${CX},${cy + 22} Q${CX + 4},${cy + 26} ${CX},${cy + 32} Q${CX - 4},${cy + 26} ${CX},${cy + 22} Z`} fill="#FFD700" opacity={0.85} />
        </G>
      );
    case 'royal':
      return (
        <G>
          <Defs>
            <LinearGradient id="royalGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#8E2A63" />
              <Stop offset="1" stopColor="#5C1638" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 4} Q${CX},${cy + 16} ${CX + r},${cy + 4} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#royalGrad)" />
          <Path d={`M${CX - r},${cy + 4} Q${CX},${cy + 16} ${CX + r},${cy + 4} L${CX + r},${cy + 10} Q${CX},${cy + 22} ${CX - r},${cy + 10} Z`} fill="#FDFEFE" />
          <Circle cx={CX - r + 6} cy={cy + 6} r={1.3} fill="#2D3436" />
          <Circle cx={CX - r / 2} cy={cy + 9} r={1.3} fill="#2D3436" />
          <Circle cx={CX} cy={cy + 10} r={1.3} fill="#2D3436" />
          <Circle cx={CX + r / 2} cy={cy + 9} r={1.3} fill="#2D3436" />
          <Circle cx={CX + r - 6} cy={cy + 6} r={1.3} fill="#2D3436" />
          <Path d={`M${CX - r},${cy + 4} Q${CX},${cy + 16} ${CX + r},${cy + 4}`} stroke="#F1C40F" strokeWidth={1.5} fill="none" opacity={0.8} />
          <Path d={`M${CX},${cy + 12} L${CX + 3},${cy + 18} L${CX},${cy + 24} L${CX - 3},${cy + 18} Z`} fill="#E040FB" stroke="#F1C40F" strokeWidth={1} />
        </G>
      );
    case 'explorer':
      return (
        <G>
          <Defs>
            <LinearGradient id="explorerGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#D8B889" />
              <Stop offset="1" stopColor="#A9825A" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 8} Q${CX},${cy + 22} ${CX + r},${cy + 8} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#explorerGrad)" />
          <Rect x={CX - r + 12} y={cy + 18} width={12} height={10} rx={1.5} fill="#9C7A50" stroke="#7A5F3E" strokeWidth={1} />
          <Rect x={CX + r - 24} y={cy + 18} width={12} height={10} rx={1.5} fill="#9C7A50" stroke="#7A5F3E" strokeWidth={1} />
          <Circle cx={CX - r + 18} cy={cy + 18} r={1} fill="#5C4A30" />
          <Circle cx={CX + r - 18} cy={cy + 18} r={1} fill="#5C4A30" />
          <Circle cx={CX} cy={cy + 14} r={6} fill="#EFE7D6" stroke="#7A5F3E" strokeWidth={1} />
          <Path d={`M${CX},${cy + 10} L${CX},${cy + 14} L${CX + 3},${cy + 16}`} stroke="#B71C1C" strokeWidth={1} fill="none" />
          <Path d={`M${CX - r + 6},${cy + 10} L${CX - r + 6},${cy + r}`} stroke="#7A5F3E" strokeWidth={2} />
        </G>
      );
    case 'rainbow':
      return (
        <G>
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 24} ${CX + r},${cy + 6} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="#FFFFFF" />
          {['#FF4757', '#FFA502', '#FFD700', '#2ED573', '#1E90FF', '#A55EEA'].map((c, i) => (
            <G key={i}>
              <Rect x={CX - r} y={cy + 8 + i * 4.2} width={r * 2} height={4.2} fill={c} opacity={0.85} />
              <Rect x={CX - r} y={cy + 8 + i * 4.2} width={r * 2} height={1.4} fill="#FFFFFF" opacity={0.4} />
            </G>
          ))}
          <Circle cx={CX} cy={cy - 2} r={2} fill="#FFD700" />
          <Circle cx={CX - 6} cy={cy} r={1.2} fill="#FFD700" />
          <Circle cx={CX + 6} cy={cy} r={1.2} fill="#FFD700" />
        </G>
      );
    case 'artist':
      return (
        <G>
          <Defs>
            <LinearGradient id="artistGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFFEFA" />
              <Stop offset="1" stopColor="#E8E2D0" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 24} ${CX + r},${cy + 6} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#artistGrad)" />
          <Circle cx={CX - 14} cy={cy + 16} r={4} fill="#FF4757" opacity={0.85} />
          <Circle cx={CX + 10} cy={cy + 22} r={5} fill="#1E90FF" opacity={0.85} />
          <Circle cx={CX + 2} cy={cy + 12} r={3} fill="#FFD700" opacity={0.85} />
          <Circle cx={CX - 6} cy={cy + 28} r={3.5} fill="#2ED573" opacity={0.85} />
          <Circle cx={CX + 20} cy={cy + 12} r={2.5} fill="#A55EEA" opacity={0.85} />
          <Path d={`M${CX - 25},${cy + 27} L${CX - 18},${cy + 18}`} stroke="#8D6E63" strokeWidth={2.5} strokeLinecap="round" />
          <Path d={`M${CX - 20},${cy + 20} L${CX - 16},${cy + 16} L${CX - 13},${cy + 19} L${CX - 17},${cy + 23} Z`} fill="#4A3728" />
        </G>
      );
    case 'sporty':
      return (
        <G>
          <Defs>
            <LinearGradient id="sportyGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#3EDC7F" />
              <Stop offset="1" stopColor="#1FA05C" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 24} ${CX + r},${cy + 6} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#sportyGrad)" />
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 24} ${CX + r},${cy + 6}`} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.5} fill="none" />
          <Path d={`M${CX - r + 10},${cy + 8} L${CX - r + 10},${cy + r}`} stroke="#FFFFFF" strokeWidth={3} />
          <Path d={`M${CX + r - 10},${cy + 8} L${CX + r - 10},${cy + r}`} stroke="#FFFFFF" strokeWidth={3} />
          <Path d={`M${CX - 3},${cy + 16} L${CX - 3},${cy + 28} M${CX - 3},${cy + 16} L${CX + 3},${cy + 16} Q${CX + 6},${cy + 16} ${CX + 6},${cy + 20} Q${CX + 6},${cy + 22} ${CX + 3},${cy + 22} L${CX - 3},${cy + 22}`} stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </G>
      );
    case 'pajama':
      return (
        <G>
          <Defs>
            <LinearGradient id="pajamaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#BCB4FF" />
              <Stop offset="1" stopColor="#8B7EE8" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 24} ${CX + r},${cy + 6} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#pajamaGrad)" />
          <Circle cx={CX - 18} cy={cy + 16} r={1.6} fill="#FFFFFF" opacity={0.9} />
          <Circle cx={CX - 2} cy={cy + 12} r={1.6} fill="#FFFFFF" opacity={0.9} />
          <Circle cx={CX + 16} cy={cy + 18} r={1.6} fill="#FFFFFF" opacity={0.9} />
          <Circle cx={CX + 6} cy={cy + 26} r={1.4} fill="#FFFFFF" opacity={0.8} />
          <Circle cx={CX - 10} cy={cy + 28} r={1.4} fill="#FFFFFF" opacity={0.8} />
          <Path d={`M${CX - 12},${cy + 10} Q${CX - 8},${cy + 6} ${CX - 4},${cy + 10} Q${CX},${cy + 6} ${CX + 4},${cy + 10}`} stroke="#FFFFFF" strokeWidth={1.5} fill="none" opacity={0.85} />
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 24} ${CX + r},${cy + 6}`} stroke="#FFFFFF" strokeWidth={1} opacity={0.5} fill="none" />
        </G>
      );
    case 'flower':
      return (
        <G>
          <Defs>
            <LinearGradient id="flowerOutfitGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#FFF3C4" />
              <Stop offset="1" stopColor="#FFE082" />
            </LinearGradient>
          </Defs>
          <Path d={`M${CX - r},${cy + 6} Q${CX},${cy + 24} ${CX + r},${cy + 6} L${CX + r},${cy + r} L${CX - r},${cy + r} Z`} fill="url(#flowerOutfitGrad)" />
          <Path d={`M${CX - 20},${cy + 22} Q${CX - 15},${cy + 12} ${CX - 10},${cy + 22}`} stroke="#7CB342" strokeWidth={1.5} fill="none" />
          <Path d={`M${CX + 5},${cy + 24} Q${CX + 8},${cy + 18} ${CX + 12},${cy + 24}`} stroke="#7CB342" strokeWidth={1.5} fill="none" />
          <G><Circle cx={CX - 14} cy={cy + 16} r={4} fill="#FF6FA5" /><Circle cx={CX - 14} cy={cy + 16} r={1.6} fill="#FFD700" /></G>
          <G><Circle cx={CX + 10} cy={cy + 20} r={4.5} fill="#FF8FAB" /><Circle cx={CX + 10} cy={cy + 20} r={1.8} fill="#FFD700" /></G>
          <G><Circle cx={CX} cy={cy + 28} r={3.5} fill="#FFB3C7" /><Circle cx={CX} cy={cy + 28} r={1.4} fill="#FFD700" /></G>
          <G><Circle cx={CX + 22} cy={cy + 14} r={3} fill="#F06292" /><Circle cx={CX + 22} cy={cy + 14} r={1.2} fill="#FFD700" /></G>
        </G>
      );
  }
}

// Head art sits at a fixed height (HEAD_H) with its own width scaled to match each image's
// aspect ratio, centered on CX — this keeps every species reading as the same size even
// though the source images range from square to wide (koala) to tall (owl). The vertical
// placement (HEAD_Y) and the Hat/Outfit geometry below were tuned together so a hat sits on
// top of the head and an outfit's collar peeks out beneath the chin, matching where they sat
// on the old hand-drawn body.
const HEAD_H = 84, HEAD_Y = 34;

export default function PetAvatar({
  species, bodyColor, hat = null, outfit = null, size = 120,
}: Props) {
  const source = SPECIES_IMAGES[species] ?? SPECIES_IMAGES.Bear;
  const aspect = SPECIES_ASPECT[species] ?? 1;
  const headW = HEAD_H * aspect;
  const headX = CX - headW / 2;
  // Shoulders track the head's own width (clamped) so a wide-headed koala gets broader
  // shoulders than a narrow owl, instead of every species sharing one fixed torso width.
  const bodyHalfW = Math.max(26, Math.min(46, headW * 0.45));

  return (
    <Svg width={size} height={size * (130 / 120)} viewBox="0 0 120 130">
      <SvgImage href={source} x={headX} y={HEAD_Y} width={headW} height={HEAD_H} preserveAspectRatio="xMidYMid meet" />
      {outfit ? (
        <Outfit style={outfit} bodyColor={bodyColor} r={bodyHalfW} />
      ) : (
        <Path d={`M${CX - bodyHalfW},124 Q${CX - bodyHalfW},90 ${CX},90 Q${CX + bodyHalfW},90 ${CX + bodyHalfW},124 Z`} fill={bodyColor} />
      )}
      {hat && <Hat style={hat} />}
    </Svg>
  );
}

// Cropped views of just the Hat/Outfit graphic, for shop & wardrobe thumbnails —
// the crop boxes are hand-tuned to frame each item family within the shared 120x130 geometry.
export function HatIcon({ style, size = 44 }: { style: HatStyle; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="10 0 100 66">
      <Hat style={style} />
    </Svg>
  );
}

export function OutfitIcon({ style, size = 44 }: { style: OutfitStyle; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="16 70 88 50">
      <Outfit style={style} bodyColor="#FFFFFF" />
    </Svg>
  );
}
