import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing, StyleSheet, type DimensionValue } from 'react-native';
import { PALETTE, RADIUS, SHADOW } from '../theme/theme';

interface Props {
  level:         number;
  calmCoins:     number;
  coinsPerLevel: number;
  cardBg:        string;
  cardBorder:    string;
  trackBg:       string;
  midColor:      string;
  softColor:     string;
}

export default function XPBar({ level, calmCoins, coinsPerLevel, cardBg, cardBorder, trackBg, midColor, softColor }: Props) {
  const xpAnim     = useRef(new Animated.Value(0)).current;
  const xpProgress = (calmCoins % coinsPerLevel) / coinsPerLevel;

  useEffect(() => {
    Animated.timing(xpAnim, {
      toValue:         xpProgress,
      duration:        900,
      useNativeDriver: false,
      easing:          Easing.out(Easing.quad),
    }).start();
  }, [xpProgress]);

  const barWidth = xpAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor: cardBorder }]}>
      <View style={styles.row}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Level {level}</Text>
        </View>
        <Text style={[styles.fraction, { color: midColor }]}>
          {calmCoins % coinsPerLevel} / {coinsPerLevel} XP
        </Text>
      </View>

      <View style={[styles.track, { backgroundColor: trackBg }]}>
        <Animated.View style={[styles.fill, { width: barWidth }]} />
        <View style={[styles.glow, { width: `${Math.round(xpProgress * 100)}%` as DimensionValue }]} />
      </View>

      <Text style={[styles.next, { color: softColor }]}>
        ⭐ {coinsPerLevel - (calmCoins % coinsPerLevel)} more XP to reach Level {level + 1}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:      { borderRadius: RADIUS.lg, padding: 18, marginBottom: 18, borderWidth: 1.5, shadowColor: PALETTE.purple, ...SHADOW.sm },
  row:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  badge:     { backgroundColor: PALETTE.purple, borderRadius: RADIUS.sm, paddingHorizontal: 12, paddingVertical: 5 },
  badgeText: { fontSize: 13, fontWeight: '900', color: '#FFF' },
  fraction:  { fontSize: 13, fontWeight: '600' },
  track:     { height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 8, position: 'relative' },
  fill:      { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: PALETTE.purple, borderRadius: 6 },
  glow:      { position: 'absolute', left: 0, top: 3, bottom: 3, backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: 4 },
  next:      { fontSize: 11.5, fontWeight: '600' },
});
