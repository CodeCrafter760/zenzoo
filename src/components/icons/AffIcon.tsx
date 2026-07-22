import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { AffAnimType } from '../../screens/AffirmationPlayer';

interface Props {
  type: AffAnimType;
  color: string;
  size?: number;
}

export default function AffIcon({ type, color, size = 80 }: Props) {
  const light = color + 'BB';
  const shine = 'rgba(255,255,255,0.5)';

  switch (type) {
    // 1. pulse-ring — brave & strong — Shield with star
    case 'pulse-ring':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M50 6 L86 22 L86 52 Q86 76 50 94 Q14 76 14 52 L14 22 Z" fill={color} />
          <Path d="M50 14 L80 28 L80 52 Q80 70 50 84" stroke={shine} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M50 26 L54.5 40 L69 40 L57.7 48.8 L62.2 62.8 L50 54 L37.8 62.8 L42.3 48.8 L31 40 L45.5 40 Z" fill="rgba(255,255,255,0.9)" />
        </Svg>
      );

    // 2. float-hearts — loved exactly as I am — Heart
    case 'float-hearts':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M50 84 C28 68 6 54 6 34 C6 18 18 8 32 8 C40 8 47 12 50 18 C53 12 60 8 68 8 C82 8 94 18 94 34 C94 54 72 68 50 84 Z" fill={color} />
          <Path d="M26 20 Q20 30 20 38" stroke={shine} strokeWidth={5} fill="none" strokeLinecap="round" />
          <Circle cx={50} cy={54} r={8} fill={color + '44'} />
        </Svg>
      );

    // 3. rise-up — I can do hard things — Rocket
    case 'rise-up':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M50 8 Q64 28 64 58 L50 65 L36 58 Q36 28 50 8 Z" fill={color} />
          <Path d="M50 8 Q58 22 58 40 L50 44 L42 40 Q42 22 50 8 Z" fill={light} />
          <Path d="M36 56 L20 76 L38 62 Z" fill={color} />
          <Path d="M64 56 L80 76 L62 62 Z" fill={color} />
          <Circle cx={50} cy={44} r={9} fill="rgba(135,206,235,0.85)" />
          <Circle cx={50} cy={44} r={6} fill="rgba(200,240,255,0.7)" />
          <Path d="M43 65 Q39 82 50 90 Q61 82 57 65 Z" fill="#FFD700" />
          <Path d="M46 65 Q43 78 50 85 Q57 78 54 65 Z" fill="#FF8C00" />
        </Svg>
      );

    // 4. spin-petals — kind and caring — Flower center disc
    case 'spin-petals':
      return (
        <Svg width={size} height={size} viewBox="0 0 60 60">
          <Circle cx={30} cy={30} r={28} fill={color} />
          <Circle cx={30} cy={30} r={20} fill={light} />
          <Circle cx={30} cy={30} r={12} fill="rgba(255,255,255,0.85)" />
          {([0, 60, 120, 180, 240, 300] as number[]).map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <Circle
                key={i}
                cx={30 + Math.cos(rad) * 9}
                cy={30 + Math.sin(rad) * 9}
                r={2.5}
                fill={color}
              />
            );
          })}
        </Svg>
      );

    // 5. grow-plant — every day I am growing — Leaf
    case 'grow-plant':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M50 90 L50 52" stroke={color} strokeWidth={5} strokeLinecap="round" />
          <Path d="M50 52 C72 46 82 26 66 14 C54 22 48 44 50 52 Z" fill={color} />
          <Path d="M50 66 C28 60 18 40 32 28 C44 36 50 60 50 66 Z" fill={light} />
          <Path d="M50 52 C44 34 47 16 50 8 C53 16 56 34 50 52 Z" fill={color} opacity={0.9} />
          <Path d="M50 52 C47 36 49 22 50 8 C51 22 53 36 50 52 Z" fill={shine} />
        </Svg>
      );

    // 6. wave — my feelings are valid — Ocean wave
    case 'wave':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M6 50 Q18 34 32 50 Q46 66 60 50 Q74 34 94 50 L94 94 L6 94 Z" fill={color + '44'} />
          <Path d="M6 42 Q18 26 32 42 Q46 58 60 42 Q74 26 94 42 L94 94 L6 94 Z" fill={light} />
          <Path d="M6 34 Q18 18 32 34 Q46 50 60 34 Q74 18 94 34 L94 94 L6 94 Z" fill={color} />
          <Circle cx={20} cy={22} r={5} fill={light} opacity={0.75} />
          <Circle cx={58} cy={16} r={7} fill={light} opacity={0.55} />
          <Circle cx={82} cy={24} r={4} fill={light} opacity={0.65} />
        </Svg>
      );

    // 7. star-burst — I am enough just as I am — 8-pointed star
    case 'star-burst':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M50 8 L57 34 L80 20 L66 44 L92 50 L66 56 L80 80 L57 66 L50 92 L43 66 L20 80 L34 56 L8 50 L34 44 L20 20 L43 34 Z" fill={color} />
          <Path d="M50 24 L55 42 L70 34 L61 48 L78 52 L61 56 L70 70 L55 62 L50 78 L45 62 L30 70 L39 56 L22 52 L39 48 L30 34 L45 42 Z" fill={light} />
          <Circle cx={50} cy={52} r={11} fill={shine} />
        </Svg>
      );

    // 8. rainbow — I choose joy today — Rainbow arc
    case 'rainbow':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M10 80 Q10 26 50 26 Q90 26 90 80" stroke="#FF6B6B" strokeWidth={9} fill="none" strokeLinecap="round" />
          <Path d="M16 80 Q16 34 50 34 Q84 34 84 80" stroke="#FFB347" strokeWidth={9} fill="none" strokeLinecap="round" />
          <Path d="M22 80 Q22 40 50 40 Q78 40 78 80" stroke="#FFE347" strokeWidth={9} fill="none" strokeLinecap="round" />
          <Path d="M28 80 Q28 46 50 46 Q72 46 72 80" stroke="#7ED321" strokeWidth={9} fill="none" strokeLinecap="round" />
          <Path d="M34 80 Q34 52 50 52 Q66 52 66 80" stroke="#4ECDC4" strokeWidth={9} fill="none" strokeLinecap="round" />
          <Path d="M40 80 Q40 58 50 58 Q60 58 60 80" stroke="#8B5CF6" strokeWidth={9} fill="none" strokeLinecap="round" />
          <Circle cx={14} cy={80} r={11} fill="white" />
          <Circle cx={24} cy={76} r={9} fill="white" />
          <Circle cx={86} cy={80} r={11} fill="white" />
          <Circle cx={76} cy={76} r={9} fill="white" />
        </Svg>
      );

    // 9. come-together — I am a wonderful friend — Two overlapping hearts
    case 'come-together':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M36 76 C20 62 4 50 4 32 C4 18 14 10 26 10 C32 10 37 14 38 18 C39 14 44 10 50 10 C62 10 72 18 72 32 C72 50 54 62 36 76 Z" fill={color} opacity={0.88} />
          <Path d="M64 76 C48 62 32 50 32 32 C32 18 42 10 50 10 C56 10 61 14 62 18 C63 14 68 10 74 10 C86 10 96 18 96 32 C96 50 80 62 64 76 Z" fill={light} opacity={0.88} />
        </Svg>
      );

    // 10. float-dream — my dreams are worth chasing — Crescent moon + stars
    case 'float-dream':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M79 28 A36 36 0 1 0 79 72 A30 30 0 0 1 79 28 Z" fill={color} />
          <Circle cx={40} cy={38} r={7} fill="rgba(0,0,0,0.08)" />
          <Circle cx={30} cy={58} r={5} fill="rgba(0,0,0,0.06)" />
          <Circle cx={84} cy={14} r={3.5} fill={color} />
          <Circle cx={89} cy={48} r={2.5} fill={color} opacity={0.75} />
          <Circle cx={84} cy={82} r={3} fill={color} opacity={0.85} />
          <Path d="M88 8 L89 4 L90 8 L94 8 L91 11 L92 15 L89 12 L86 15 L87 11 L84 8 Z" fill={color} opacity={0.8} />
          <Path d="M88 58 L89 54 L90 58 L94 58 L91 61 L92 65 L89 62 L86 65 L87 61 L84 58 Z" fill={color} opacity={0.7} />
        </Svg>
      );

    // 11. expand-rings — I believe in myself — Sun with rays
    case 'expand-rings':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Circle cx={50} cy={50} r={22} fill={color} />
          <Circle cx={50} cy={50} r={15} fill={light} />
          <Circle cx={50} cy={50} r={9} fill={shine} />
          {([0, 45, 90, 135, 180, 225, 270, 315] as number[]).map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const x1 = 50 + Math.cos(rad) * 26;
            const y1 = 50 + Math.sin(rad) * 26;
            const x2 = 50 + Math.cos(rad) * 44;
            const y2 = 50 + Math.sin(rad) * 44;
            return (
              <Path
                key={i}
                d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`}
                stroke={color}
                strokeWidth={i % 2 === 0 ? 5.5 : 3.5}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>
      );

    // 12. color-dots — creative and full of ideas — Artist palette
    case 'color-dots':
      return (
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Path d="M16 72 Q6 58 6 42 Q6 14 34 6 Q50 2 66 6 Q88 14 90 38 Q94 64 74 76 Q64 88 50 88 Q36 88 28 80 Z" fill={light} />
          <Circle cx={66} cy={72} r={11} fill="rgba(255,255,255,0.7)" />
          <Circle cx={26} cy={26} r={10} fill="#FF6B6B" />
          <Circle cx={50} cy={16} r={10} fill="#FFE347" />
          <Circle cx={74} cy={26} r={10} fill="#4ECDC4" />
          <Circle cx={80} cy={50} r={10} fill={color} />
          <Circle cx={26} cy={52} r={10} fill="#7ED321" />
          <Rect x={61} y={58} width={7} height={26} rx={3} fill="#8B6914" />
          <Ellipse cx={64.5} cy={58} rx={9} ry={5} fill={color} />
        </Svg>
      );
  }
}
