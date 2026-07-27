import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { RADIUS } from '../theme/theme';

// Teen-tier "frosted" card — a BlurView tinted toward the surrounding theme
// color, used instead of a flat T.card background wherever ageGroup is Teen.
interface Props {
  isDark: boolean;
  tint?: string;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export default function GlassCard({ isDark, tint, style, children }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <BlurView
        intensity={isDark ? 40 : 60}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.overlay, { backgroundColor: tint ?? (isDark ? '#FFFFFF0D' : '#FFFFFF33') }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderRadius: RADIUS.lg, overflow: 'hidden' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  content: { flex: 1 },
});
