import React from 'react';
import Svg, { Circle, Ellipse, Path, Polygon, Rect, G } from 'react-native-svg';

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

function Ears({ species, bodyColor, accentColor }: { species: string; bodyColor: string; accentColor: string }) {
  switch (species) {
    case 'Cat':
    case 'Red Panda':
      return (
        <G>
          <Polygon points="32,52 44,52 36,30" fill={bodyColor} />
          <Polygon points="35,49 41,49 37,38" fill={accentColor} />
          <Polygon points="76,52 88,52 84,30" fill={bodyColor} />
          <Polygon points="79,49 85,49 83,38" fill={accentColor} />
        </G>
      );
    case 'Fox':
      return (
        <G>
          <Polygon points="30,50 46,50 35,24" fill={accentColor} />
          <Polygon points="34,46 41,46 36,32" fill="#FFCCBC" />
          <Polygon points="74,50 90,50 85,24" fill={accentColor} />
          <Polygon points="79,46 86,46 84,32" fill="#FFCCBC" />
        </G>
      );
    case 'Owl':
      return (
        <G>
          <Path d="M30,50 Q28,36 36,28 Q42,34 38,50 Z" fill={bodyColor} />
          <Path d="M90,50 Q92,36 84,28 Q78,34 82,50 Z" fill={bodyColor} />
        </G>
      );
    case 'Koala':
      return (
        <G>
          <Circle cx={28} cy={48} r={14} fill={bodyColor} />
          <Circle cx={28} cy={48} r={7} fill={accentColor} />
          <Circle cx={92} cy={48} r={14} fill={bodyColor} />
          <Circle cx={92} cy={48} r={7} fill={accentColor} />
        </G>
      );
    case 'Elephant':
      return (
        <G>
          <Ellipse cx={22} cy={56} rx={13} ry={17} fill={bodyColor} stroke={accentColor} strokeWidth={2} />
          <Ellipse cx={98} cy={56} rx={13} ry={17} fill={bodyColor} stroke={accentColor} strokeWidth={2} />
        </G>
      );
    case 'Hippo':
      return (
        <G>
          <Circle cx={30} cy={50} r={9} fill={bodyColor} />
          <Circle cx={90} cy={50} r={9} fill={bodyColor} />
        </G>
      );
    case 'Lion':
      return (
        <G>
          <Circle cx={28} cy={50} r={12} fill={bodyColor} stroke="#D4AA30" strokeWidth={3} />
          <Circle cx={92} cy={50} r={12} fill={bodyColor} stroke="#D4AA30" strokeWidth={3} />
        </G>
      );
    case 'Zebra':
      return (
        <G>
          <Path d="M30,52 Q28,36 38,32 Q44,40 40,52 Z" fill={bodyColor} />
          <Rect x={32} y={40} width={4} height={10} rx={2} fill="#2C2C2C" />
          <Path d="M90,52 Q92,36 82,32 Q76,40 80,52 Z" fill={bodyColor} />
          <Rect x={84} y={40} width={4} height={10} rx={2} fill="#2C2C2C" />
        </G>
      );
    default: // Bear
      return (
        <G>
          <Circle cx={30} cy={50} r={13} fill={bodyColor} />
          <Circle cx={30} cy={50} r={6.5} fill={accentColor} />
          <Circle cx={90} cy={50} r={13} fill={bodyColor} />
          <Circle cx={90} cy={50} r={6.5} fill={accentColor} />
        </G>
      );
  }
}

function Eyes({ style }: { style: EyeStyle }) {
  const ex = [50, 70];
  if (style === 'Calm') {
    return (
      <G stroke="#2D3436" strokeWidth={2.5} strokeLinecap="round" fill="none">
        <Path d={`M${ex[0] - 6},70 Q${ex[0]},66 ${ex[0] + 6},70`} />
        <Path d={`M${ex[1] - 6},70 Q${ex[1]},66 ${ex[1] + 6},70`} />
      </G>
    );
  }
  if (style === 'Sleepy') {
    return (
      <G fill="#2D3436">
        <Rect x={ex[0] - 6} y={68} width={12} height={4} rx={2} />
        <Rect x={ex[1] - 6} y={68} width={12} height={4} rx={2} />
      </G>
    );
  }
  if (style === 'Sparkle') {
    return (
      <G>
        <Circle cx={ex[0]} cy={70} r={5.5} fill="#2D3436" stroke="#A29BFE" strokeWidth={1} />
        <Circle cx={ex[0] - 1.5} cy={68.5} r={1.4} fill="#FFD700" />
        <Circle cx={ex[1]} cy={70} r={5.5} fill="#2D3436" stroke="#A29BFE" strokeWidth={1} />
        <Circle cx={ex[1] - 1.5} cy={68.5} r={1.4} fill="#FFD700" />
      </G>
    );
  }
  // Wonder (default)
  return (
    <G>
      <Circle cx={ex[0]} cy={70} r={5.5} fill="#2D3436" />
      <Circle cx={ex[0] + 1.5} cy={68.5} r={1.6} fill="#FFFFFF" />
      <Circle cx={ex[1]} cy={70} r={5.5} fill="#2D3436" />
      <Circle cx={ex[1] + 1.5} cy={68.5} r={1.6} fill="#FFFFFF" />
    </G>
  );
}

function Hair({ style }: { style: HairStyle }) {
  switch (style) {
    case 'Bangs':
      return <Path d="M40,46 Q60,36 80,46 L80,54 Q60,46 40,54 Z" fill="#4A3728" />;
    case 'Mohawk':
      return <Path d="M55,18 L65,18 L62,42 L58,42 Z" fill="#FF4757" />;
    case 'Double Buns':
      return (
        <G fill="#2F3542">
          <Circle cx={38} cy={32} r={8} />
          <Circle cx={82} cy={32} r={8} />
        </G>
      );
    case 'Wavy':
      return (
        <G fill="#4A3728">
          <Ellipse cx={36} cy={44} rx={9} ry={7} />
          <Ellipse cx={50} cy={38} rx={9} ry={6} />
          <Ellipse cx={64} cy={42} rx={9} ry={7} />
        </G>
      );
    default:
      return null;
  }
}

function Hat({ style }: { style: HatStyle }) {
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

function Outfit({ style, bodyColor }: { style: OutfitStyle; bodyColor: string }) {
  switch (style) {
    case 'ninja':
      return <Path d={`M${CX - BODY_R},${CY + 6} Q${CX},${CY + 26} ${CX + BODY_R},${CY + 6} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#2D3436" />;
    case 'comfy':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 8} Q${CX},${CY + 24} ${CX + BODY_R},${CY + 8} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#FAB1A0" />
          <Path d={`M${CX - 8},${CY + 8} L${CX},${CY + 16} L${CX + 8},${CY + 8}`} stroke="#E17B6F" strokeWidth={2} fill="none" />
        </G>
      );
    case 'zen':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 4} Q${CX},${CY + 22} ${CX + BODY_R},${CY + 4} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#6C5CE7" />
          <Path d={`M${CX - 10},${CY + 6} L${CX + 6},${CY + BODY_R}`} stroke="#5849C4" strokeWidth={2} />
          <Path d={`M${CX + 10},${CY + 6} L${CX - 6},${CY + BODY_R}`} stroke="#5849C4" strokeWidth={2} />
        </G>
      );
    case 'star':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY} Q${CX},${CY + 30} ${CX + BODY_R},${CY} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#1E1B4B" />
          <Polygon points="60,92 62,97 67,97 63,100 65,105 60,102 55,105 57,100 53,97 58,97" fill="#FFD700" />
        </G>
      );
    case 'astronaut':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 6} Q${CX},${CY + 24} ${CX + BODY_R},${CY + 6} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#ECF0F1" />
          <Rect x={CX - BODY_R} y={CY + 6} width={BODY_R * 2} height={8} fill="#B2BEC3" />
          <Circle cx={CX} cy={CY + 20} r={5} fill="#FF4757" />
        </G>
      );
    case 'superhero':
      return (
        <G>
          <Path d={`M${CX - BODY_R - 4},${CY} Q${CX},${CY + 40} ${CX + BODY_R + 4},${CY} L${CX + BODY_R + 2},${CY + BODY_R + 6} L${CX - BODY_R - 2},${CY + BODY_R + 6} Z`} fill="#D63031" />
          <Path d={`M${CX - BODY_R},${CY + 6} Q${CX},${CY + 22} ${CX + BODY_R},${CY + 6} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#0984E3" />
          <Polygon points={`${CX},${CY + 10} ${CX - 5},${CY + 18} ${CX + 5},${CY + 18}`} fill="#FFD700" />
        </G>
      );
    case 'wizard':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 2} Q${CX},${CY + 20} ${CX + BODY_R},${CY + 2} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#4B2E83" />
          <Circle cx={CX - 10} cy={CY + 16} r={1.6} fill="#FFD700" />
          <Circle cx={CX + 8} cy={CY + 22} r={1.6} fill="#FFD700" />
          <Circle cx={CX} cy={CY + 28} r={1.6} fill="#FFD700" />
        </G>
      );
    case 'royal':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 4} Q${CX},${CY + 22} ${CX + BODY_R},${CY + 4} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#6C1B45" />
          <Path d={`M${CX - BODY_R},${CY + 4} Q${CX},${CY + 16} ${CX + BODY_R},${CY + 4} L${CX + BODY_R},${CY + 10} Q${CX},${CY + 22} ${CX - BODY_R},${CY + 10} Z`} fill="#FDFEFE" />
          <Circle cx={CX - 20} cy={CY + 7} r={1.4} fill="#2D3436" />
          <Circle cx={CX} cy={CY + 9} r={1.4} fill="#2D3436" />
          <Circle cx={CX + 20} cy={CY + 7} r={1.4} fill="#2D3436" />
          <Circle cx={CX} cy={CY + 6} r={3} fill="#F1C40F" />
        </G>
      );
    case 'explorer':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 8} Q${CX},${CY + 22} ${CX + BODY_R},${CY + 8} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#C8A165" />
          <Rect x={CX - 20} y={CY + 18} width={12} height={10} rx={2} fill="#A9825A" />
          <Rect x={CX + 8} y={CY + 18} width={12} height={10} rx={2} fill="#A9825A" />
        </G>
      );
    case 'rainbow':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 6} Q${CX},${CY + 24} ${CX + BODY_R},${CY + 6} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#FFFFFF" />
          {['#FF4757', '#FFA502', '#FFD700', '#2ED573', '#1E90FF', '#A55EEA'].map((c, i) => (
            <Rect key={i} x={CX - BODY_R} y={CY + 8 + i * 4.2} width={BODY_R * 2} height={4.2} fill={c} opacity={0.85} />
          ))}
        </G>
      );
    case 'artist':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 6} Q${CX},${CY + 24} ${CX + BODY_R},${CY + 6} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#F5F3EE" />
          <Circle cx={CX - 14} cy={CY + 18} r={4} fill="#FF4757" opacity={0.8} />
          <Circle cx={CX + 10} cy={CY + 24} r={5} fill="#1E90FF" opacity={0.8} />
          <Circle cx={CX + 2} cy={CY + 12} r={3} fill="#FFD700" opacity={0.8} />
          <Circle cx={CX - 6} cy={CY + 30} r={3.5} fill="#2ED573" opacity={0.8} />
        </G>
      );
    case 'sporty':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 6} Q${CX},${CY + 24} ${CX + BODY_R},${CY + 6} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#2ED573" />
          <Path d={`M${CX - 10},${CY + 6} L${CX - 10},${CY + BODY_R}`} stroke="#FFFFFF" strokeWidth={3} />
          <Path d={`M${CX + 10},${CY + 6} L${CX + 10},${CY + BODY_R}`} stroke="#FFFFFF" strokeWidth={3} />
        </G>
      );
    case 'pajama':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 6} Q${CX},${CY + 24} ${CX + BODY_R},${CY + 6} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#A29BFE" />
          <Circle cx={CX - 12} cy={CY + 18} r={2} fill="#FFFFFF" opacity={0.8} />
          <Circle cx={CX + 8} cy={CY + 26} r={2} fill="#FFFFFF" opacity={0.8} />
          <Circle cx={CX + 2} cy={CY + 14} r={2} fill="#FFFFFF" opacity={0.8} />
          <Path d={`M${CX - 8},${CY + 6} L${CX},${CY + 14} L${CX + 8},${CY + 6}`} stroke="#FFFFFF" strokeWidth={2} fill="none" />
        </G>
      );
    case 'flower':
      return (
        <G>
          <Path d={`M${CX - BODY_R},${CY + 6} Q${CX},${CY + 24} ${CX + BODY_R},${CY + 6} L${CX + BODY_R},${CY + BODY_R} L${CX - BODY_R},${CY + BODY_R} Z`} fill="#FFEAA7" />
          {[[CX - 14, CY + 16], [CX + 10, CY + 20], [CX, CY + 28]].map(([fx, fy], i) => (
            <G key={i}>
              <Circle cx={fx} cy={fy} r={4} fill="#FF6FA5" />
              <Circle cx={fx} cy={fy} r={1.6} fill="#FFD700" />
            </G>
          ))}
        </G>
      );
  }
}

export default function PetAvatar({
  species, bodyColor, accentColor, muzzleColor, eyes, hair = 'None', hat = null, outfit = null, size = 120,
}: Props) {
  return (
    <Svg width={size} height={size * (130 / 120)} viewBox="0 0 120 130">
      {outfit && <Outfit style={outfit} bodyColor={bodyColor} />}
      <Ears species={species} bodyColor={bodyColor} accentColor={accentColor} />
      {hair !== 'None' && <Hair style={hair} />}
      <Circle cx={CX} cy={CY} r={BODY_R} fill={bodyColor} />
      {species === 'Zebra' && (
        <G stroke="#2C2C2C" strokeWidth={2.5} strokeLinecap="round" opacity={0.55}>
          <Path d={`M${CX - 18},${CY - 14} Q${CX},${CY - 18} ${CX + 18},${CY - 14}`} />
          <Path d={`M${CX - 20},${CY - 2} Q${CX},${CY - 6} ${CX + 20},${CY - 2}`} />
          <Path d={`M${CX - 18},${CY + 10} Q${CX},${CY + 6} ${CX + 18},${CY + 10}`} />
        </G>
      )}
      <Eyes style={eyes} />
      <Ellipse cx={CX - 20} cy={CY + 2} rx={7} ry={4} fill={accentColor} opacity={0.35} />
      <Ellipse cx={CX + 20} cy={CY + 2} rx={7} ry={4} fill={accentColor} opacity={0.35} />
      <Ellipse cx={CX} cy={CY + 10} rx={16} ry={10} fill={muzzleColor} />
      <Ellipse cx={CX} cy={CY + 7} rx={4} ry={2.5} fill="#8B4513" />
      {(species === 'Cat' || species === 'Fox' || species === 'Red Panda') && (
        <G stroke="#7F8C8D" strokeWidth={1.2} strokeLinecap="round">
          <Path d={`M${CX - 16},${CY + 12} L${CX - 28},${CY + 9}`} />
          <Path d={`M${CX + 16},${CY + 12} L${CX + 28},${CY + 9}`} />
        </G>
      )}
      {hat && <Hat style={hat} />}
    </Svg>
  );
}
