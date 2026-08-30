import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  ScrollView, Animated, Easing,
} from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useZenZoo } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME } from '../theme/theme';
import { Feather } from '@expo/vector-icons';
import { tapHaptic, successHaptic } from '../utils/haptics';
import { showAlert } from '../utils/alert';
import { StoryAnimType, StoryItem } from '../data/stories/types';

export type { StoryAnimType, StoryItem };

// ─────────────────────────────────────────────────────────────────────────────
// 1. SLEEPY CLOUD — drifting cloud, twinkling dusk sky
// ─────────────────────────────────────────────────────────────────────────────
function AnimSleepyCloud({ color }: { color: string }) {
  const bob = useRef(new Animated.Value(0)).current;
  const s1  = useRef(new Animated.Value(0.2)).current;
  const s2  = useRef(new Animated.Value(0.2)).current;
  const s3  = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const bobLoop = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 2400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const twinkle = (v: Animated.Value, delay: number) => Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1,   duration: 750, useNativeDriver: true }),
      Animated.timing(v, { toValue: 0.2, duration: 750, useNativeDriver: true }),
    ]));
    const loops = [bobLoop, twinkle(s1, 0), twinkle(s2, 420), twinkle(s3, 840)];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
  const stars = [{ x: -72, y: -74, v: s1 }, { x: 76, y: -56, v: s2 }, { x: 58, y: 62, v: s3 }];

  return (
    <View style={S.canvas}>
      {stars.map((st, i) => (
        <Animated.View key={i} style={{ position: 'absolute', opacity: st.v, transform: [{ translateX: st.x }, { translateY: st.y }] }}>
          <Feather name="star" size={13} color={color} />
        </Animated.View>
      ))}
      <Animated.View style={{ transform: [{ translateY }], alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={[cloudPuff(56), { marginRight: -18 }]} />
          <View style={[cloudPuff(84), { marginTop: -14 }]} />
          <View style={[cloudPuff(56), { marginLeft: -18 }]} />
        </View>
        <View style={[cloudPuff(0), { width: 140, height: 42, borderRadius: 21, marginTop: -20 }]} />
      </Animated.View>
    </View>
  );
}
const cloudPuff = (size: number) => ({
  width: size, height: size, borderRadius: size / 2, backgroundColor: '#FFFFFF',
  shadowColor: '#5BB8E4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4,
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. BREATHING GARDEN — flowers opening and closing together
// ─────────────────────────────────────────────────────────────────────────────
function AnimBreathingGarden({ color }: { color: string }) {
  const { t } = useZenZoo();
  const breath = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(breath, { toValue: 1,   duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(breath, { toValue: 0.7, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const flowers = [{ x: -62, y: 34, size: 46 }, { x: 62, y: 34, size: 46 }, { x: 0, y: -38, size: 62 }];

  return (
    <View style={S.canvas}>
      {flowers.map((f, i) => (
        <View key={i} style={{ position: 'absolute', transform: [{ translateX: f.x }, { translateY: f.y }], alignItems: 'center', justifyContent: 'center' }}>
          {Array.from({ length: 6 }).map((_, p) => {
            const angle = (p * 60) * (Math.PI / 180);
            return (
              <Animated.View key={p} style={{
                position: 'absolute',
                width: f.size * 0.42, height: f.size * 0.62, borderRadius: f.size * 0.2,
                backgroundColor: color,
                opacity: 0.9,
                transform: [
                  { translateX: Math.sin(angle) * (f.size * 0.32) },
                  { translateY: -Math.cos(angle) * (f.size * 0.32) },
                  { rotate: `${p * 60}deg` },
                  { scale: breath },
                ],
              }} />
            );
          })}
          <View style={{ width: f.size * 0.34, height: f.size * 0.34, borderRadius: f.size * 0.17, backgroundColor: '#FFD966' }} />
        </View>
      ))}
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Breathe with the flowers')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. BRAVE LITTLE STAR — a small light growing brighter
// ─────────────────────────────────────────────────────────────────────────────
function AnimBraveStar({ color }: { color: string }) {
  const { t } = useZenZoo();
  const glow = useRef(new Animated.Value(0)).current;
  const t1   = useRef(new Animated.Value(0.15)).current;
  const t2   = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 2600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.delay(500),
      Animated.timing(glow, { toValue: 0, duration: 1000, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.delay(300),
    ]));
    const twinkle = (v: Animated.Value, delay: number) => Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 0.8, duration: 600, useNativeDriver: true }),
      Animated.timing(v, { toValue: 0.15, duration: 600, useNativeDriver: true }),
    ]));
    const loops = [loop, twinkle(t1, 200), twinkle(t2, 700)];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  const scale   = glow.interpolate({ inputRange: [0, 1], outputRange: [0.65, 1.25] });
  const opacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });
  const rayOp   = glow.interpolate({ inputRange: [0, 1], outputRange: [0, 0.7] });

  return (
    <View style={S.canvas}>
      <Animated.View style={{ position: 'absolute', opacity: t1, transform: [{ translateX: -68 }, { translateY: -40 }] }}>
        <Feather name="star" size={11} color={color} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', opacity: t2, transform: [{ translateX: 70 }, { translateY: 46 }] }}>
        <Feather name="star" size={11} color={color} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', width: 200, height: 200 }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <Animated.View key={i} style={{
            position: 'absolute', top: 96, left: 99, width: 2, height: 84, borderRadius: 1,
            backgroundColor: color, opacity: rayOp,
            transform: [{ rotate: `${i * 45}deg` }, { translateY: -46 }],
          }} />
        ))}
      </Animated.View>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Feather name="star" size={70} color={color} />
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Shine on')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CALM RIVER — flowing water and sinking stones
// ─────────────────────────────────────────────────────────────────────────────
function AnimCalmRiver({ color }: { color: string }) {
  const { t } = useZenZoo();
  const flow  = useRef(new Animated.Value(0)).current;
  const stone = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const flowLoop = Animated.loop(
      Animated.timing(flow, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: true })
    );
    const stoneLoop = Animated.loop(Animated.sequence([
      Animated.timing(stone, { toValue: 1, duration: 1500, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(ripple, { toValue: 1, duration: 700, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.timing(ripple, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.timing(stone,  { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.delay(500),
    ]));
    flowLoop.start(); stoneLoop.start();
    return () => { flowLoop.stop(); stoneLoop.stop(); };
  }, []);

  const waveX = flow.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  const stoneY = stone.interpolate({ inputRange: [0, 1], outputRange: [-70, 40] });
  const stoneOp = stone.interpolate({ inputRange: [0, 0.85, 1], outputRange: [1, 1, 0] });
  const rippleScale = ripple.interpolate({ inputRange: [0, 1], outputRange: [0.3, 2.2] });
  const rippleOp    = ripple.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });

  return (
    <View style={S.canvas}>
      <Animated.View style={{ position: 'absolute', bottom: 46, width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: color, transform: [{ scale: rippleScale }], opacity: rippleOp }} />
      <Animated.View style={{ transform: [{ translateY: stoneY }], opacity: stoneOp }}>
        <View style={{ width: 22, height: 18, borderRadius: 10, backgroundColor: color }} />
      </Animated.View>
      <View style={{ position: 'absolute', bottom: 20, width: '100%', gap: 8 }}>
        {[0, 1, 2].map(i => (
          <Animated.View key={i} style={{
            height: 10, borderRadius: 5, backgroundColor: color, opacity: 0.7 - i * 0.18,
            transform: [{ translateX: waveX }],
          }} />
        ))}
      </View>
      <Text style={{ position: 'absolute', bottom: -6, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Let it drift away')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FOREST FRIENDS — swaying trees and gentle fireflies
// ─────────────────────────────────────────────────────────────────────────────
function AnimForestFriends({ color }: { color: string }) {
  const { t } = useZenZoo();
  const sway  = useRef(new Animated.Value(0)).current;
  const f1 = useRef(new Animated.Value(0)).current;
  const f2 = useRef(new Animated.Value(0)).current;
  const f3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const swayLoop = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1,  duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: -1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const flicker = (v: Animated.Value, delay: number) => Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const loops = [swayLoop, flicker(f1, 0), flicker(f2, 500), flicker(f3, 1000)];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  const rotate = sway.interpolate({ inputRange: [-1, 1], outputRange: ['-4deg', '4deg'] });
  const fireflies = [{ x: -66, y: 10 }, { x: 60, y: -30 }, { x: 30, y: 50 }];
  const fAnims = [f1, f2, f3];

  return (
    <View style={S.canvas}>
      <View style={{ position: 'absolute', top: -78, right: -60, width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF8E0' }} />
      <View style={{ flexDirection: 'row', gap: 26, alignItems: 'flex-end' }}>
        {[0.8, 1, 0.85].map((scale, i) => (
          <Animated.View key={i} style={{ alignItems: 'center', transform: [{ rotate }, { scale }], transformOrigin: ['50%', '100%'] }}>
            <View style={{
              width: 0, height: 0, borderLeftWidth: 26, borderRightWidth: 26, borderBottomWidth: 54,
              borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color,
            }} />
            <View style={{ width: 10, height: 20, backgroundColor: '#8B5E3C', marginTop: -2 }} />
          </Animated.View>
        ))}
      </View>
      {fireflies.map((f, i) => (
        <Animated.View key={i} style={{
          position: 'absolute',
          opacity: fAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }),
          transform: [
            { translateX: f.x }, { translateY: f.y },
          ],
        }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFD966' }} />
        </Animated.View>
      ))}
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('One breath at a time')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. WIGGLE WORM — a wiggly line of segments curling into a peaceful spiral
// ─────────────────────────────────────────────────────────────────────────────
function AnimWiggleWorm({ color }: { color: string }) {
  const { t } = useZenZoo();
  const settle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.delay(600),
      Animated.timing(settle, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(settle, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const segments = Array.from({ length: 6 }).map((_, i) => {
    const wiggleX = (i - 2.5) * 30;
    const wiggleY = i % 2 === 0 ? -12 : 12;
    const angle = (i * 65 * Math.PI) / 180;
    const radius = 44 - i * 6;
    const spiralX = Math.cos(angle) * radius;
    const spiralY = Math.sin(angle) * radius;
    return {
      size: 34 - i * 2,
      x: settle.interpolate({ inputRange: [0, 1], outputRange: [wiggleX, spiralX] }),
      y: settle.interpolate({ inputRange: [0, 1], outputRange: [wiggleY, spiralY] }),
    };
  });

  const zOpacity = settle.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 0, 1] });

  return (
    <View style={S.canvas}>
      <Animated.View style={{ position: 'absolute', opacity: zOpacity, transform: [{ translateX: 50 }, { translateY: -56 }] }}>
        <Feather name="moon" size={16} color={color} />
      </Animated.View>
      {segments.map((seg, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', width: seg.size, height: seg.size, borderRadius: seg.size / 2,
          backgroundColor: color, opacity: i === 0 ? 1 : 0.85,
          transform: [{ translateX: seg.x }, { translateY: seg.y }],
        }} />
      ))}
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Curling up cozy')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. FOCUS CRYSTAL — a glowing crystal pulsing with a chime, in a quiet cave
// ─────────────────────────────────────────────────────────────────────────────
function AnimFocusCrystal({ color }: { color: string }) {
  const { t } = useZenZoo();
  const glow = useRef(new Animated.Value(0)).current;
  const ripple = useRef(new Animated.Value(0)).current;
  const drip = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const glowLoop = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.4, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const rippleLoop = Animated.loop(Animated.sequence([
      Animated.timing(ripple, { toValue: 1, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(ripple, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.delay(1400),
    ]));
    const dripLoop = Animated.loop(Animated.sequence([
      Animated.timing(drip, { toValue: 1, duration: 2200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.timing(drip, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.delay(600),
    ]));
    const loops = [glowLoop, rippleLoop, dripLoop];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  const scale = glow.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1.1] });
  const rippleScale = ripple.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2] });
  const rippleOp = ripple.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] });
  const dripY = drip.interpolate({ inputRange: [0, 1], outputRange: [-50, 40] });
  const dripOp = drip.interpolate({ inputRange: [0, 0.8, 1], outputRange: [0.6, 0.3, 0] });

  return (
    <View style={S.canvas}>
      <View style={{ position: 'absolute', bottom: 22, flexDirection: 'row', gap: 20 }}>
        {[0, 1].map(i => (
          <View key={i} style={{ width: 34, height: 16, borderRadius: 8, backgroundColor: '#5A6570' }} />
        ))}
      </View>
      <Animated.View style={{ position: 'absolute', opacity: dripOp, transform: [{ translateX: -50 }, { translateY: dripY }] }}>
        <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: color }} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: color, transform: [{ scale: rippleScale }], opacity: rippleOp }} />
      <Animated.View style={{ transform: [{ rotate: '45deg' }, { scale }] }}>
        <View style={{ width: 46, height: 46, backgroundColor: color, opacity: 0.9, borderRadius: 6 }} />
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Listen for the crystal')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. BALLOON RIDE — a hot air balloon rising as a feeling-cloud shrinks away
// ─────────────────────────────────────────────────────────────────────────────
function AnimBalloonRide({ color }: { color: string }) {
  const { t } = useZenZoo();
  const rise = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const riseLoop = Animated.loop(Animated.sequence([
      Animated.timing(rise, { toValue: 1, duration: 6000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    const driftLoop = Animated.loop(
      Animated.timing(drift, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true })
    );
    riseLoop.start(); driftLoop.start();
    return () => { riseLoop.stop(); driftLoop.stop(); };
  }, []);

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [40, -50] });
  const cloudScale = rise.interpolate({ inputRange: [0, 1], outputRange: [1, 0.15] });
  const cloudOp = rise.interpolate({ inputRange: [0, 0.85, 1], outputRange: [0.9, 0.3, 0] });
  const driftX = drift.interpolate({ inputRange: [0, 1], outputRange: [-30, 30] });

  return (
    <View style={S.canvas}>
      <Animated.View style={[cloudPuff(30), { position: 'absolute', top: 6, left: -70, opacity: 0.7, transform: [{ translateX: driftX }] }]} />
      <Animated.View style={[cloudPuff(24), { position: 'absolute', top: 40, right: -66, opacity: 0.6, transform: [{ translateX: Animated.multiply(driftX, -1) }] }]} />
      <Animated.View style={{ alignItems: 'center', transform: [{ translateY }] }}>
        <View style={{ width: 78, height: 92, borderRadius: 40, backgroundColor: color }} />
        <View style={{ width: 2, height: 26, backgroundColor: color, opacity: 0.6 }} />
        <View style={{ width: 38, height: 26, borderRadius: 6, backgroundColor: '#E8A23D', alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={{ width: 16, height: 12, borderRadius: 6, backgroundColor: '#5A6570', opacity: cloudOp, transform: [{ scale: cloudScale }] }} />
        </View>
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Rising higher, feeling lighter')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. GLOWING HEART — a warm heart pulsing with rippling rings of kindness
// ─────────────────────────────────────────────────────────────────────────────
function AnimGlowingHeart({ color }: { color: string }) {
  const { t } = useZenZoo();
  const pulse = useRef(new Animated.Value(0.85)).current;
  const r1 = useRef(new Animated.Value(0)).current;
  const r2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.05, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.85, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const rippleLoop = (v: Animated.Value, delay: number) => Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    const loops = [pulseLoop, rippleLoop(r1, 0), rippleLoop(r2, 1000)];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  const ring = (v: Animated.Value) => ({
    scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.4, 2.4] }),
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
  });
  const ring1 = ring(r1);
  const ring2 = ring(r2);

  return (
    <View style={S.canvas}>
      <Animated.View style={{ position: 'absolute', width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: color, transform: [{ scale: ring1.scale }], opacity: ring1.opacity }} />
      <Animated.View style={{ position: 'absolute', width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: color, transform: [{ scale: ring2.scale }], opacity: ring2.opacity }} />
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Feather name="heart" size={64} color={color} />
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Sending warmth to others')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. TUMMY BOAT — a little boat bobbing on waves in time with the breath
// ─────────────────────────────────────────────────────────────────────────────
function AnimTummyBoat({ color }: { color: string }) {
  const { t } = useZenZoo();
  const breath = useRef(new Animated.Value(0)).current;
  const flow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const breathLoop = Animated.loop(Animated.sequence([
      Animated.timing(breath, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(breath, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const flowLoop = Animated.loop(
      Animated.timing(flow, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    );
    breathLoop.start(); flowLoop.start();
    return () => { breathLoop.stop(); flowLoop.stop(); };
  }, []);

  const boatY = breath.interpolate({ inputRange: [0, 1], outputRange: [14, -14] });
  const waveX = flow.interpolate({ inputRange: [0, 1], outputRange: [0, -34] });

  return (
    <View style={S.canvas}>
      <Animated.View style={{ alignItems: 'center', transform: [{ translateY: boatY }] }}>
        <View style={{ width: 10, height: 22, borderRadius: 5, backgroundColor: color, opacity: 0.8, marginBottom: -4 }} />
        <View style={{
          width: 72, height: 30, borderBottomLeftRadius: 36, borderBottomRightRadius: 36,
          backgroundColor: '#E8A23D',
        }} />
      </Animated.View>
      <View style={{ position: 'absolute', bottom: 30, width: '100%', gap: 8 }}>
        {[0, 1, 2].map(i => (
          <Animated.View key={i} style={{
            height: 9, borderRadius: 4.5, backgroundColor: color, opacity: 0.65 - i * 0.16,
            transform: [{ translateX: waveX }],
          }} />
        ))}
      </View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('In-breath up, out-breath down')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. STARRY QUILT — a soft blanket tucking in a sleepy shape under twinkling stars
// ─────────────────────────────────────────────────────────────────────────────
function AnimStarryQuilt({ color }: { color: string }) {
  const { t } = useZenZoo();
  const tuck = useRef(new Animated.Value(0)).current;
  const s1 = useRef(new Animated.Value(0.2)).current;
  const s2 = useRef(new Animated.Value(0.2)).current;
  const s3 = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const tuckLoop = Animated.loop(Animated.sequence([
      Animated.timing(tuck, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(tuck, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.delay(600),
    ]));
    const twinkle = (v: Animated.Value, delay: number) => Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1,   duration: 800, useNativeDriver: true }),
      Animated.timing(v, { toValue: 0.2, duration: 800, useNativeDriver: true }),
    ]));
    const loops = [tuckLoop, twinkle(s1, 0), twinkle(s2, 380), twinkle(s3, 760)];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  const quiltY = tuck.interpolate({ inputRange: [0, 1], outputRange: [46, 6] });
  const stars = [{ x: -70, y: -80, v: s1 }, { x: 66, y: -70, v: s2 }, { x: 0, y: -92, v: s3 }];

  return (
    <View style={S.canvas}>
      {stars.map((st, i) => (
        <Animated.View key={i} style={{ position: 'absolute', opacity: st.v, transform: [{ translateX: st.x }, { translateY: st.y }] }}>
          <Feather name="star" size={12} color={color} />
        </Animated.View>
      ))}
      <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: '#FFD9B0' }} />
      <View style={{ position: 'absolute', top: 34, width: 52, height: 10, borderRadius: 5, backgroundColor: '#3A2E2A' }} />
      <Animated.View style={{
        position: 'absolute', bottom: 0, width: 190, height: 120,
        backgroundColor: color, borderTopLeftRadius: 90, borderTopRightRadius: 90,
        transform: [{ translateY: quiltY }],
      }}>
        <View style={{ position: 'absolute', top: 14, width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
          {[0, 1, 2].map(i => <View key={i} style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFFFFF55' }} />)}
        </View>
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Tucked in, safe and warm')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. WIND CHIME — hanging chimes swaying gently, glowing softly with each breath
// ─────────────────────────────────────────────────────────────────────────────
function AnimWindChime({ color }: { color: string }) {
  const { t } = useZenZoo();
  const sway = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const swayLoop = Animated.loop(Animated.sequence([
      Animated.timing(sway, { toValue: 1,  duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(sway, { toValue: -1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const glowLoop = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1,   duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.6, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    swayLoop.start(); glowLoop.start();
    return () => { swayLoop.stop(); glowLoop.stop(); };
  }, []);

  const tubes = [0, 1, 2, 3].map(i => {
    const rotate = sway.interpolate({ inputRange: [-1, 1], outputRange: [`${-6 - i}deg`, `${6 + i}deg`] });
    return { rotate, height: 60 - i * 8 };
  });

  return (
    <View style={S.canvas}>
      <View style={{ width: 120, height: 8, borderRadius: 4, backgroundColor: color, opacity: 0.7 }} />
      <View style={{ flexDirection: 'row', gap: 14, marginTop: 2 }}>
        {tubes.map((t, i) => (
          <Animated.View key={i} style={{ alignItems: 'center', transform: [{ rotate: t.rotate }], transformOrigin: ['50%', '0%'] }}>
            <View style={{ width: 2, height: 14, backgroundColor: color, opacity: 0.5 }} />
            <Animated.View style={{ width: 8, height: t.height, borderRadius: 4, backgroundColor: color, opacity: glow }} />
          </Animated.View>
        ))}
      </View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Soft breeze, soft breath')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. LIGHTHOUSE BEAM — a steady rotating beam guiding a little boat safely home
// ─────────────────────────────────────────────────────────────────────────────
function AnimLighthouseBeam({ color }: { color: string }) {
  const { t } = useZenZoo();
  const sweep = useRef(new Animated.Value(0)).current;
  const bob   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sweepLoop = Animated.loop(
      Animated.timing(sweep, { toValue: 1, duration: 3200, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
    );
    const bobLoop = Animated.loop(Animated.sequence([
      Animated.timing(bob, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(bob, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    sweepLoop.start(); bobLoop.start();
    return () => { sweepLoop.stop(); bobLoop.stop(); };
  }, []);

  const rotate = sweep.interpolate({ inputRange: [0, 1], outputRange: ['-35deg', '35deg'] });
  const boatY  = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  return (
    <View style={S.canvas}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ position: 'absolute', top: -6, width: 0, height: 0, borderLeftWidth: 90, borderRightWidth: 90, borderBottomWidth: 4, borderLeftColor: 'transparent', borderRightColor: 'transparent' }} />
        <Animated.View style={{ position: 'absolute', top: 6, transform: [{ rotate }], transformOrigin: ['50%', '0%'] }}>
          <View style={{ width: 0, height: 0, borderLeftWidth: 60, borderRightWidth: 60, borderBottomWidth: 90, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color, opacity: 0.22 }} />
        </Animated.View>
        <View style={{ width: 20, height: 46, backgroundColor: color, borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
        <View style={{ width: 28, height: 12, backgroundColor: '#FFD966', borderRadius: 3 }} />
        <View style={{ width: 40, height: 24, backgroundColor: color, opacity: 0.85 }} />
      </View>
      <Animated.View style={{ position: 'absolute', bottom: 24, right: -50, alignItems: 'center', transform: [{ translateY: boatY }] }}>
        <View style={{ width: 6, height: 14, backgroundColor: color, opacity: 0.7, marginBottom: -3 }} />
        <View style={{ width: 40, height: 16, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, backgroundColor: '#E8A23D' }} />
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('One steady light to follow')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. STEPPING STONES — stones appearing one by one as little footsteps cross them
// ─────────────────────────────────────────────────────────────────────────────
function AnimSteppingStones({ color }: { color: string }) {
  const { t } = useZenZoo();
  const step = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(step, { toValue: 1, duration: 3600, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(900),
      Animated.timing(step, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.delay(400),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const stoneCount = 5;
  const stones = Array.from({ length: stoneCount }).map((_, i) => {
    const start = i / stoneCount;
    const end = start + 0.14;
    return step.interpolate({ inputRange: [0, start, end, 1], outputRange: [0, 0, 1, 1], extrapolate: 'clamp' });
  });
  const footX = step.interpolate({ inputRange: [0, 1], outputRange: [-88, 88] });
  const footY = step.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -10, 0] });

  return (
    <View style={S.canvas}>
      <View style={{ position: 'absolute', bottom: 18, width: '100%', height: 14, borderRadius: 7, backgroundColor: color, opacity: 0.18 }} />
      <View style={{ position: 'absolute', bottom: 20, flexDirection: 'row', gap: 20 }}>
        {stones.map((op, i) => (
          <Animated.View key={i} style={{ width: 26, height: 16, borderRadius: 13, backgroundColor: color, opacity: op }} />
        ))}
      </View>
      <Animated.View style={{ position: 'absolute', bottom: 34, transform: [{ translateX: footX }, { translateY: footY }] }}>
        <Feather name="circle" size={14} color={color} />
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Just one small step at a time')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. SUNRISE HUG — two gentle shapes coming together as warm hearts float up
// ─────────────────────────────────────────────────────────────────────────────
function AnimSunriseHug({ color }: { color: string }) {
  const { t } = useZenZoo();
  const come = useRef(new Animated.Value(0)).current;
  const h1 = useRef(new Animated.Value(0)).current;
  const h2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const comeLoop = Animated.loop(Animated.sequence([
      Animated.timing(come, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(come, { toValue: 0, duration: 1200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.delay(400),
    ]));
    const floatHeart = (v: Animated.Value, delay: number) => Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1, duration: 1800, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));
    const loops = [comeLoop, floatHeart(h1, 600), floatHeart(h2, 1400)];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  const leftX  = come.interpolate({ inputRange: [0, 1], outputRange: [-46, -14] });
  const rightX = come.interpolate({ inputRange: [0, 1], outputRange: [46, 14] });
  const heartY = (v: Animated.Value) => v.interpolate({ inputRange: [0, 1], outputRange: [10, -70] });
  const heartOp = (v: Animated.Value) => v.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.9, 0] });

  return (
    <View style={S.canvas}>
      <View style={{ position: 'absolute', top: -80, width: 70, height: 70, borderRadius: 35, backgroundColor: '#FFD9B0', opacity: 0.8 }} />
      <Animated.View style={{ position: 'absolute', opacity: heartOp(h1), transform: [{ translateY: heartY(h1) }] }}>
        <Feather name="heart" size={16} color={color} />
      </Animated.View>
      <Animated.View style={{ position: 'absolute', opacity: heartOp(h2), transform: [{ translateX: 16 }, { translateY: heartY(h2) }] }}>
        <Feather name="heart" size={13} color={color} />
      </Animated.View>
      <View style={{ flexDirection: 'row' }}>
        <Animated.View style={{ transform: [{ translateX: leftX }] }}>
          <View style={{ width: 56, height: 72, borderRadius: 28, backgroundColor: color, opacity: 0.9 }} />
        </Animated.View>
        <Animated.View style={{ transform: [{ translateX: rightX }] }}>
          <View style={{ width: 56, height: 72, borderRadius: 28, backgroundColor: color, opacity: 0.65 }} />
        </Animated.View>
      </View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('A little kindness goes a long way')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. JAR OF FIREFLIES — warm little lights filling a jar, one gentle deed at a time
// ─────────────────────────────────────────────────────────────────────────────
function AnimJarOfFireflies({ color }: { color: string }) {
  const { t } = useZenZoo();
  const fill = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(fill, { toValue: 1, duration: 3400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(fill, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.delay(300),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const flies = [
    { x: -20, y: 20 }, { x: 14, y: 8 }, { x: -6, y: -14 },
    { x: 22, y: -28 }, { x: -24, y: -36 }, { x: 4, y: -50 },
  ].map((pos, i) => {
    const start = i / 6;
    const end = start + 0.12;
    return { ...pos, op: fill.interpolate({ inputRange: [0, start, end, 1], outputRange: [0, 0, 1, 1], extrapolate: 'clamp' }) };
  });

  return (
    <View style={S.canvas}>
      <View style={{ width: 100, height: 118, borderWidth: 3, borderColor: color, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTopLeftRadius: 6, borderTopRightRadius: 6, opacity: 0.5, overflow: 'hidden', alignItems: 'center' }}>
        {flies.map((f, i) => (
          <Animated.View key={i} style={{ position: 'absolute', top: 60 + f.y, left: 46 + f.x, opacity: f.op }}>
            <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#FFD966' }} />
          </Animated.View>
        ))}
      </View>
      <View style={{ position: 'absolute', top: -6, width: 60, height: 14, borderRadius: 6, backgroundColor: color }} />
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Every kind act lights the jar')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 17. GROWING PLANT — a small seed growing tall and blooming in the warm sun
// ─────────────────────────────────────────────────────────────────────────────
function AnimGrowingPlant({ color }: { color: string }) {
  const { t } = useZenZoo();
  const grow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(grow, { toValue: 1, duration: 3200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(grow, { toValue: 0, duration: 0, useNativeDriver: true }),
      Animated.delay(400),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  // The stem's layout box stays a fixed 92px tall (so this never touches the JS-thread
  // layout animator) — it just visually stretches from the ground via scaleY, and the
  // bloom above it is nudged down by the un-grown remainder so it still tracks the tip.
  const FULL_STEM = 92;
  const MIN_STEM = 4;
  const stemScaleY   = grow.interpolate({ inputRange: [0, 1], outputRange: [MIN_STEM / FULL_STEM, 1] });
  const bloomShiftY  = grow.interpolate({ inputRange: [0, 1], outputRange: [FULL_STEM - MIN_STEM, 0] });
  const bloomScale = grow.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 0.2, 1] });
  const leafOp     = grow.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0.2, 1] });

  return (
    <View style={S.canvas}>
      <View style={{ position: 'absolute', top: -70, right: -50, width: 46, height: 46, borderRadius: 23, backgroundColor: '#FFD966', opacity: 0.85 }} />
      <View style={{ position: 'absolute', bottom: 18, width: 110, height: 10, borderRadius: 5, backgroundColor: '#8B5E3C', opacity: 0.5 }} />
      <View style={{ alignItems: 'center', justifyContent: 'flex-end', height: 110 }}>
        <Animated.View style={{ transform: [{ translateY: bloomShiftY }, { scale: bloomScale }], marginBottom: -6 }}>
          <View style={{ flexDirection: 'row' }}>
            {[0, 1, 2, 3, 4].map(p => (
              <View key={p} style={{
                position: 'absolute', width: 16, height: 24, borderRadius: 10, backgroundColor: color,
                transform: [{ rotate: `${p * 72}deg` }, { translateY: -12 }],
              }} />
            ))}
            <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFD966' }} />
          </View>
        </Animated.View>
        <Animated.View style={{
          width: 8, height: FULL_STEM, backgroundColor: '#4C8C4A', borderRadius: 4,
          transform: [{ scaleY: stemScaleY }], transformOrigin: ['50%', '100%'],
        }} />
        <Animated.View style={{ position: 'absolute', bottom: 26, left: '50%', marginLeft: 4, opacity: leafOp, transform: [{ rotate: '30deg' }] }}>
          <View style={{ width: 22, height: 12, borderRadius: 10, backgroundColor: '#4C8C4A' }} />
        </Animated.View>
        <Animated.View style={{ position: 'absolute', bottom: 44, right: '50%', marginRight: 4, opacity: leafOp, transform: [{ rotate: '-30deg' }] }}>
          <View style={{ width: 22, height: 12, borderRadius: 10, backgroundColor: '#4C8C4A' }} />
        </Animated.View>
      </View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('A little braver every day')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 18. KITE FLYING — a kite rising and dipping playfully, steady on its string
// ─────────────────────────────────────────────────────────────────────────────
function AnimKiteFlying({ color }: { color: string }) {
  const { t } = useZenZoo();
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(drift, { toValue: 1,  duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(drift, { toValue: -1, duration: 2200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const translateX = drift.interpolate({ inputRange: [-1, 1], outputRange: [-24, 24] });
  const translateY = drift.interpolate({ inputRange: [-1, 1], outputRange: [10, -22] });
  const rotate = drift.interpolate({ inputRange: [-1, 1], outputRange: ['-8deg', '8deg'] });

  return (
    <View style={S.canvas}>
      <Animated.View style={{ alignItems: 'center', transform: [{ translateX }, { translateY }, { rotate }] }}>
        <View style={{
          width: 64, height: 64, backgroundColor: color, transform: [{ rotate: '45deg' }],
          borderRadius: 8,
        }} />
        <View style={{ width: 2, height: 60, backgroundColor: color, opacity: 0.4, marginTop: 2 }} />
        {[0, 1, 2].map(i => (
          <View key={i} style={{ width: 14, height: 8, borderRadius: 4, backgroundColor: color, opacity: 0.6, marginTop: 4 }} />
        ))}
      </Animated.View>
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('Steady string, soaring high')}
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 19. WEATHER MOOD — sun, cloud, rain, and rainbow taking turns — all feelings pass
// ─────────────────────────────────────────────────────────────────────────────
function AnimWeatherMood({ color }: { color: string }) {
  const { t } = useZenZoo();
  const cycle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(cycle, { toValue: 4, duration: 8000, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacityFor = (stage: number) => cycle.interpolate({
    inputRange: [stage - 1, stage - 0.7, stage - 0.3, stage],
    outputRange: [0, 1, 1, 0],
    extrapolate: 'clamp',
  });

  const stages: { icon: React.ComponentProps<typeof Feather>['name']; label: string }[] = [
    { icon: 'sun',    label: 'Sunny' },
    { icon: 'cloud',  label: 'Cloudy' },
    { icon: 'cloud-rain', label: 'Rainy' },
    { icon: 'wind',   label: 'Breezy' },
  ];

  return (
    <View style={S.canvas}>
      {stages.map((st, i) => (
        <Animated.View key={i} style={{ position: 'absolute', opacity: opacityFor(i + 1), alignItems: 'center' }}>
          <Feather name={st.icon} size={64} color={color} />
        </Animated.View>
      ))}
      <Text style={{ position: 'absolute', bottom: 4, color: color + '90', fontSize: 12, fontWeight: '700' }}>
        {t('All feelings pass like weather')}
      </Text>
    </View>
  );
}

// ── Dispatcher ────────────────────────────────────────────────────────────────
// Memoized: StoryPlayer re-renders every ~500ms while audio plays (useAudioPlayerStatus's
// polling interval), but `anim`/`color` never change during that time. Without this, every
// tick tears down and rebuilds every Animated.interpolate() in the active animation — the
// main source of the "choppy" jank, since it happens continuously during playback.
const StoryAnimation = React.memo(function StoryAnimation({ anim, color }: { anim: StoryAnimType; color: string }) {
  switch (anim) {
    case 'sleepy-cloud':     return <AnimSleepyCloud     color={color} />;
    case 'breathing-garden': return <AnimBreathingGarden color={color} />;
    case 'brave-star':       return <AnimBraveStar       color={color} />;
    case 'calm-river':       return <AnimCalmRiver       color={color} />;
    case 'forest-friends':   return <AnimForestFriends   color={color} />;
    case 'wiggle-worm':      return <AnimWiggleWorm      color={color} />;
    case 'focus-crystal':    return <AnimFocusCrystal    color={color} />;
    case 'balloon-ride':     return <AnimBalloonRide     color={color} />;
    case 'glowing-heart':    return <AnimGlowingHeart    color={color} />;
    case 'tummy-boat':       return <AnimTummyBoat       color={color} />;
    case 'starry-quilt':     return <AnimStarryQuilt     color={color} />;
    case 'wind-chime':       return <AnimWindChime       color={color} />;
    case 'lighthouse-beam':  return <AnimLighthouseBeam  color={color} />;
    case 'stepping-stones':  return <AnimSteppingStones  color={color} />;
    case 'sunrise-hug':      return <AnimSunriseHug      color={color} />;
    case 'jar-of-fireflies': return <AnimJarOfFireflies  color={color} />;
    case 'growing-plant':    return <AnimGrowingPlant    color={color} />;
    case 'kite-flying':      return <AnimKiteFlying      color={color} />;
    case 'weather-mood':     return <AnimWeatherMood     color={color} />;
  }
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Longer stories pay out more — 5 Calm Coins per minute of readTime (e.g. "6 min" → 30 coins).
// Falls back to a flat 10 if readTime doesn't parse as "<number> min".
function coinsForStory(readTime: string): number {
  const minutes = parseInt(readTime, 10);
  return isFinite(minutes) && minutes > 0 ? minutes * 5 : 10;
}

// A minimum dwell time before a story with no narration audio counts as "finished" —
// just enough to stop the reward from being farmed by opening and instantly closing.
const MIN_READ_DWELL_MS = 15000;

// ── Player ────────────────────────────────────────────────────────────────────

interface Props {
  story: StoryItem;
  onClose: () => void;
}

export default function StoryPlayer({ story, onClose }: Props) {
  const { isDark, ageGroup, language, t, finishStory } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  const [showLyrics, setShowLyrics] = useState(false);
  // Toddlers can't read yet, so there's no point offering a lyrics view.
  const isToddler = ageGroup === 'Toddler (2-4)';
  const tr = language === 'es' ? story.es : undefined;

  const player = useAudioPlayer(story.audio ?? null);
  const status = useAudioPlayerStatus(player);
  const hasAudio = story.audio !== null;

  const mountTimeRef = useRef(Date.now());
  const awardedRef = useRef(false);
  const storyCoins = coinsForStory(tr?.readTime ?? story.readTime);

  const awardIfEarned = () => {
    if (awardedRef.current) return;
    awardedRef.current = true;
    finishStory(storyCoins);
    successHaptic();
    showAlert(t('📖 Story finished!'), t('You earned {n} Calm Coins!').replace('{n}', String(storyCoins)));
  };

  useEffect(() => {
    if (hasAudio) player.play();
  }, []);

  // Narrated stories pay out the moment the audio finishes; text-only stories pay out
  // when the child backs out after reading for at least MIN_READ_DWELL_MS.
  useEffect(() => {
    if (hasAudio && status.didJustFinish) awardIfEarned();
  }, [status.didJustFinish]);

  const handleClose = () => {
    if (!hasAudio && Date.now() - mountTimeRef.current >= MIN_READ_DWELL_MS) awardIfEarned();
    onClose();
  };

  const togglePlay = () => {
    tapHaptic();
    if (status.playing) player.pause();
    else player.play();
  };

  const toggleLyrics = () => {
    tapHaptic();
    setShowLyrics(v => !v);
  };

  const progress = status.duration > 0 ? status.currentTime / status.duration : 0;

  return (
    <SafeAreaView style={[S.safe, { backgroundColor: isDark ? T.bg : story.bg }]}>

      {/* ── Top bar ── */}
      <View style={S.topBar}>
        <TouchableOpacity onPress={handleClose} style={S.backBtn} activeOpacity={0.7}>
          <Text style={[S.backText, { color: story.color }]}>← {t('Back')}</Text>
        </TouchableOpacity>
        <Text style={[S.topTitle, { color: T.text }]} numberOfLines={1}>
          {story.emoji}  {tr?.title ?? story.title}
        </Text>
        <View style={S.backBtn} />
      </View>

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Animation / Lyrics card ── */}
        <View style={[S.stageCard, { backgroundColor: isDark ? T.card : '#FFFFFFCC', borderColor: story.color + '33' }]}>
          {showLyrics ? (
            <View style={S.lyricsWrap}>
              <Text style={[S.lyricsText, { color: T.text }]}>{tr?.content ?? story.content}</Text>
            </View>
          ) : (
            <StoryAnimation anim={story.anim} color={story.color} />
          )}
        </View>

        {/* ── Lyrics toggle — hidden for Toddler, who can't read yet ── */}
        {!isToddler && (
          <TouchableOpacity
            style={[S.lyricsBtn, { backgroundColor: isDark ? story.color + '22' : story.bg, borderColor: story.color + '44' }]}
            onPress={toggleLyrics}
            activeOpacity={0.8}
          >
            <Feather name={showLyrics ? 'image' : 'file-text'} size={16} color={story.color} />
            <Text style={[S.lyricsBtnText, { color: story.color }]}>
              {showLyrics ? t('Back to animation') : t('View lyrics')}
            </Text>
          </TouchableOpacity>
        )}

        {/* ── Audio player ── */}
        <View style={[S.audioCard, { backgroundColor: T.card, borderColor: T.edge }]}>
          <TouchableOpacity
            style={[S.playBtn, { backgroundColor: story.color }]}
            onPress={togglePlay}
            activeOpacity={0.85}
          >
            <Feather name={status.playing ? 'pause' : 'play'} size={22} color="#FFF" />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <View style={[S.trackBg, { backgroundColor: isDark ? T.edge : '#EDE9F5' }]}>
              <View style={[S.trackFill, { backgroundColor: story.color, width: `${Math.min(progress, 1) * 100}%` }]} />
            </View>
            <View style={S.timeRow}>
              <Text style={[S.timeText, { color: T.mid }]}>
                {hasAudio ? formatTime(status.currentTime) : '--:--'}
              </Text>
              <Text style={[S.timeText, { color: T.mid }]}>
                {hasAudio ? formatTime(status.duration) : '--:--'}
              </Text>
            </View>
          </View>
        </View>

        {!hasAudio && (
          <Text style={[S.hintText, { color: T.mid }]}>
            {t('🎵 Narration audio coming soon — read along with the lyrics for now')}
          </Text>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  safe:   { flex: 1 },
  scroll: { padding: 18, paddingTop: 8, paddingBottom: 30 },

  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 18, paddingVertical: 14,
  },
  backBtn:  { minWidth: 62 },
  backText: { fontSize: 14, fontWeight: '700' },
  topTitle: { flex: 1, fontSize: 15, fontWeight: '800', textAlign: 'center' },

  stageCard: {
    borderRadius: 28, borderWidth: 2, padding: 12,
    alignItems: 'center', justifyContent: 'center',
    minHeight: 260, marginBottom: 14,
  },
  canvas: { width: 220, height: 220, alignItems: 'center', justifyContent: 'center' },

  lyricsWrap: { paddingVertical: 10, paddingHorizontal: 6 },
  lyricsText: { fontSize: 15, lineHeight: 27, fontWeight: '400' },

  lyricsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderRadius: 16, borderWidth: 1.5, paddingVertical: 12, marginBottom: 14,
  },
  lyricsBtnText: { fontSize: 13, fontWeight: '800' },

  audioCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 22, borderWidth: 1.5, padding: 14,
  },
  playBtn: {
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  trackBg:   { height: 6, borderRadius: 3, overflow: 'hidden' },
  trackFill: { height: 6, borderRadius: 3 },
  timeRow:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  timeText:  { fontSize: 11, fontWeight: '700' },

  hintText: { fontSize: 12, fontWeight: '600', textAlign: 'center', marginTop: 12, lineHeight: 18 },
});
