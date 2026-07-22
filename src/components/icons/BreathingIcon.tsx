import React from 'react';
import Svg, { Circle, Ellipse, Path, G } from 'react-native-svg';

type Phase = 'Ready' | 'Inhale' | 'Hold' | 'Exhale';

interface Props {
  phase: Phase;
  color?: string;
  size?: number;
}

export default function BreathingIcon({ phase, color = '#FFFFFF', size = 44 }: Props) {
  const light = color + 'BB';

  if (phase === 'Ready') {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <G key={i} transform={`rotate(${angle}, 50, 50)`}>
            <Ellipse cx={50} cy={22} rx={11} ry={22} fill={color} opacity={0.8} />
          </G>
        ))}
        <Circle cx={50} cy={50} r={20} fill={color} />
        <Circle cx={50} cy={50} r={13} fill="rgba(255,255,255,0.45)" />
        <Circle cx={50} cy={50} r={7} fill={color} />
      </Svg>
    );
  }

  if (phase === 'Inhale') {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Ellipse cx={46} cy={66} rx={34} ry={22} fill={color} />
        <Ellipse cx={42} cy={70} rx={22} ry={14} fill="rgba(255,255,255,0.22)" />
        <Path d="M80 58 L96 42 L96 62 Z" fill={color} />
        <Path d="M80 72 L96 74 L96 90 Z" fill={color} />
        <Circle cx={22} cy={62} r={5} fill="rgba(255,255,255,0.9)" />
        <Circle cx={23} cy={61} r={2.5} fill="rgba(0,0,0,0.45)" />
        <Circle cx={24} cy={60} r={1} fill="rgba(255,255,255,0.9)" />
        <Path d="M34 46 Q26 28 22 14" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        <Path d="M34 46 Q34 22 32 10" stroke={light} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Path d="M34 46 Q44 26 48 12" stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Circle cx={22} cy={14} r={4} fill={color} opacity={0.65} />
        <Circle cx={32} cy={10} r={3} fill={light} opacity={0.65} />
        <Circle cx={48} cy={12} r={3.5} fill={color} opacity={0.65} />
      </Svg>
    );
  }

  if (phase === 'Hold') {
    return (
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M50 8 L60 36 L90 37 L66 55 L75 84 L50 67 L25 84 L34 55 L10 37 L40 36 Z"
          fill={color}
        />
        <Path
          d="M50 20 L57 41 L79 41 L62 54 L68 75 L50 62 L32 75 L38 54 L21 41 L43 41 Z"
          fill={light}
        />
        <Circle cx={50} cy={50} r={11} fill="rgba(255,255,255,0.45)" />
      </Svg>
    );
  }

  // Exhale — butterfly
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Ellipse cx={34} cy={40} rx={28} ry={20} fill={color} transform="rotate(-18, 34, 40)" />
      <Ellipse cx={66} cy={40} rx={28} ry={20} fill={color} transform="rotate(18, 66, 40)" />
      <Ellipse cx={37} cy={64} rx={18} ry={13} fill={color} opacity={0.78} transform="rotate(12, 37, 64)" />
      <Ellipse cx={63} cy={64} rx={18} ry={13} fill={color} opacity={0.78} transform="rotate(-12, 63, 64)" />
      <Ellipse cx={50} cy={55} rx={5} ry={26} fill="rgba(0,0,0,0.3)" />
      <Circle cx={50} cy={28} r={4} fill="rgba(0,0,0,0.3)" />
      <Path d="M47 29 Q40 16 34 8" stroke="rgba(0,0,0,0.3)" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Path d="M53 29 Q60 16 66 8" stroke="rgba(0,0,0,0.3)" strokeWidth={2} fill="none" strokeLinecap="round" />
      <Circle cx={34} cy={8} r={3.5} fill={color} />
      <Circle cx={66} cy={8} r={3.5} fill={color} />
      <Circle cx={44} cy={40} r={7} fill="rgba(255,255,255,0.35)" />
      <Circle cx={56} cy={40} r={7} fill="rgba(255,255,255,0.35)" />
    </Svg>
  );
}
