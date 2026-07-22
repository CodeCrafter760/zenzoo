import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Easing,
} from 'react-native';
import { useZenZoo } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME } from '../theme/theme';
import { Feather } from '@expo/vector-icons';
import AffIcon from '../components/icons/AffIcon';

export type AffAnimType =
  | 'pulse-ring' | 'float-hearts' | 'rise-up' | 'spin-petals'
  | 'grow-plant' | 'wave' | 'star-burst' | 'rainbow'
  | 'come-together' | 'float-dream' | 'expand-rings' | 'color-dots';

export interface AffirmationItem {
  text: string;
  color: string;
  bg: string;
  anim: AffAnimType;
  es?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. PULSE RING — brave & strong
// ─────────────────────────────────────────────────────────────────────────────
function AnimPulseRing({ color }: { color: string }) {
  const r1 = useRef(new Animated.Value(0)).current;
  const r2 = useRef(new Animated.Value(0)).current;
  const r3 = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const ring = (v: Animated.Value, delay: number) =>
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));

  useEffect(() => {
    const loops = [ring(r1, 0), ring(r2, 370), ring(r3, 740)];
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(scale, { toValue: 1.22, duration: 320, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1,    duration: 320, useNativeDriver: true }),
      Animated.delay(900),
    ]));
    loops.forEach(l => l.start());
    pulse.start();
    return () => { loops.forEach(l => l.stop()); pulse.stop(); };
  }, []);

  return (
    <View style={S.canvas}>
      {[r1, r2, r3].map((r, i) => (
        <Animated.View key={i} style={[S.ring, { borderColor: color,
          transform: [{ scale: r.interpolate({ inputRange: [0,1], outputRange: [0.3,1.4] }) }],
          opacity:          r.interpolate({ inputRange: [0,0.15,1], outputRange: [0,0.65,0] }),
        }]} />
      ))}
      <Animated.View style={{ transform: [{ scale }] }}>
        <AffIcon type="pulse-ring" color={color} size={80} />
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FLOAT HEARTS — loved exactly as I am
// ─────────────────────────────────────────────────────────────────────────────
function AnimFloatHearts({ color }: { color: string }) {
  const h0 = useRef(new Animated.Value(1)).current;
  const h1 = useRef(new Animated.Value(1)).current;
  const h2 = useRef(new Animated.Value(1)).current;
  const h3 = useRef(new Animated.Value(1)).current;
  const h4 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const start = (v: Animated.Value) =>
      Animated.loop(Animated.sequence([
        Animated.timing(v, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(v, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.delay(300),
      ]));
    const loops = [h0, h1, h2, h3, h4].map((v, i) => {
      const l = start(v);
      setTimeout(() => l.start(), i * 400);
      return l;
    });
    return () => loops.forEach(l => l.stop());
  }, []);

  const hearts = [
    { v: h0, dx: -38, size: 24 }, { v: h1, dx: 12, size: 18 },
    { v: h2, dx: -10, size: 30 }, { v: h3, dx: 40, size: 16 },
    { v: h4, dx: -22, size: 22 },
  ];

  return (
    <View style={S.canvas}>
      <View style={{ marginBottom: 20 }}>
        <AffIcon type="float-hearts" color={color} size={70} />
      </View>
      {hearts.map((h, i) => (
        <Animated.View key={i} style={{
          position: 'absolute', bottom: 20,
          transform: [
            { translateX: h.dx },
            { translateY: h.v.interpolate({ inputRange: [0,1], outputRange: [-160, 0] }) },
          ],
          opacity: h.v.interpolate({ inputRange: [0,0.2,0.8,1], outputRange: [0,1,1,0] }),
        }}>
          <Feather name="heart" size={h.size} color={color} />
        </Animated.View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. RISE UP — I can do hard things
// ─────────────────────────────────────────────────────────────────────────────
function AnimRiseUp({ color }: { color: string }) {
  const pos  = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.parallel([
        Animated.timing(pos,  { toValue: -130, duration: 1100, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(fade, { toValue: 0,    duration: 1100, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(pos,  { toValue: 0, duration: 0, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(250),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const arrows = [0, -44, -88];

  return (
    <View style={S.canvas}>
      <Animated.View style={{ transform: [{ translateY: pos }], opacity: fade, alignItems: 'center', gap: 8 }}>
        <AffIcon type="rise-up" color={color} size={70} />
        {arrows.map((_, i) => (
          <View key={i} style={{ width: 0, height: 0,
            borderLeftWidth: 18, borderRightWidth: 18, borderBottomWidth: 26,
            borderLeftColor: 'transparent', borderRightColor: 'transparent',
            borderBottomColor: color,
            opacity: 1 - i * 0.28,
          }} />
        ))}
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. SPIN PETALS — kind and caring
// ─────────────────────────────────────────────────────────────────────────────
function AnimSpinPetals({ color }: { color: string }) {
  const spin = useRef(new Animated.Value(0)).current;
  const puls = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 5000, easing: Easing.linear, useNativeDriver: true }));
    const pulse = Animated.loop(Animated.sequence([
      Animated.timing(puls, { toValue: 1.08, duration: 900, useNativeDriver: true }),
      Animated.timing(puls, { toValue: 0.85, duration: 900, useNativeDriver: true }),
    ]));
    loop.start(); pulse.start();
    return () => { loop.stop(); pulse.stop(); };
  }, []);

  const rotate = spin.interpolate({ inputRange: [0,1], outputRange: ['0deg','360deg'] });
  const PETAL_COLORS = [color, color + 'BB', color + '88', color, color + 'BB', color + '88'];

  return (
    <View style={S.canvas}>
      <Animated.View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center', transform: [{ rotate }] }}>
        {PETAL_COLORS.map((c, i) => {
          const angle = (i * 60) * (Math.PI / 180);
          const tx = Math.sin(angle) * 58;
          const ty = -Math.cos(angle) * 58;
          return (
            <View key={i} style={{
              position: 'absolute',
              width: 34, height: 56, borderRadius: 17,
              backgroundColor: c,
              transform: [
                { translateX: tx },
                { translateY: ty },
                { rotate: `${i * 60}deg` },
              ],
            }} />
          );
        })}
        <Animated.View style={{ position: 'absolute', transform: [{ scale: puls }, { rotate: spin.interpolate({ inputRange:[0,1], outputRange:['0deg','-360deg'] }) }] }}>
          <AffIcon type="spin-petals" color={color} size={38} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. GROW PLANT — every day I am growing
// ─────────────────────────────────────────────────────────────────────────────
function AnimGrowPlant({ color }: { color: string }) {
  const stemH  = useRef(new Animated.Value(0)).current;
  const leafL  = useRef(new Animated.Value(0)).current;
  const leafR  = useRef(new Animated.Value(0)).current;
  const top    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const grow = Animated.sequence([
      Animated.timing(stemH, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: false }),
      Animated.parallel([
        Animated.timing(leafL, { toValue: 1, duration: 400, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
        Animated.timing(leafR, { toValue: 1, duration: 400, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
      ]),
      Animated.timing(top,   { toValue: 1, duration: 350, easing: Easing.out(Easing.back(2)), useNativeDriver: true }),
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(stemH, { toValue: 0, duration: 400, useNativeDriver: false }),
        Animated.timing(leafL, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(leafR, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(top,   { toValue: 0, duration: 250, useNativeDriver: true }),
      ]),
      Animated.delay(300),
    ]);
    const loop = Animated.loop(grow);
    loop.start();
    return () => loop.stop();
  }, []);

  const stemHeight = stemH.interpolate({ inputRange: [0,1], outputRange: [0, 120] });

  return (
    <View style={[S.canvas, { justifyContent: 'flex-end', paddingBottom: 30 }]}>
      <View style={{ alignItems: 'center' }}>
        <Animated.View style={{ marginBottom: -8, opacity: top, transform: [{ scale: top.interpolate({ inputRange:[0,1], outputRange:[0.3,1] }) }] }}>
          <AffIcon type="grow-plant" color={color} size={52} />
        </Animated.View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: -4 }}>
          <Animated.View style={{ width: 28, height: 20, borderRadius: 10, backgroundColor: color, marginRight: -10, transform: [{ scaleX: leafL }, { rotate: '-30deg' }] }} />
          <Animated.View style={{ width: 28, height: 20, borderRadius: 10, backgroundColor: color, marginLeft: -10,  transform: [{ scaleX: leafR }, { rotate: '30deg'  }] }} />
        </View>
        <Animated.View style={{ width: 8, borderRadius: 4, backgroundColor: color, height: stemHeight }} />
        <View style={{ width: 40, height: 12, borderRadius: 6, backgroundColor: color + '40', marginTop: 2 }} />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. WAVE — my feelings are valid
// ─────────────────────────────────────────────────────────────────────────────
function AnimWave({ color }: { color: string }) {
  const w0 = useRef(new Animated.Value(0)).current;
  const w1 = useRef(new Animated.Value(0)).current;
  const w2 = useRef(new Animated.Value(0)).current;
  const w3 = useRef(new Animated.Value(0)).current;

  const makeWave = (v: Animated.Value, delay: number) =>
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1,  duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: -1, duration: 700, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0,  duration: 350, useNativeDriver: true }),
    ]));

  useEffect(() => {
    const loops = [makeWave(w0,0), makeWave(w1,180), makeWave(w2,360), makeWave(w3,540)];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  const waves = [
    { v: w0, size: 80, op: 1.0 },
    { v: w1, size: 60, op: 0.75 },
    { v: w2, size: 44, op: 0.55 },
    { v: w3, size: 30, op: 0.35 },
  ];

  return (
    <View style={S.canvas}>
      <View style={{ marginBottom: 18 }}>
        <AffIcon type="wave" color={color} size={64} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        {waves.map((w, i) => (
          <Animated.View key={i} style={{
            width: w.size, height: w.size * 0.5, borderRadius: w.size * 0.25,
            backgroundColor: color, opacity: w.op,
            transform: [{ translateY: w.v.interpolate({ inputRange:[-1,0,1], outputRange:[-18,0,18] }) }],
          }} />
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. STAR BURST — I am enough just as I am
// ─────────────────────────────────────────────────────────────────────────────
function AnimStarBurst({ color }: { color: string }) {
  const spin  = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.9)).current;
  const rays  = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true }));
    const p = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.15, duration: 800, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.9,  duration: 800, useNativeDriver: true }),
    ]));
    const r = Animated.loop(Animated.sequence([
      Animated.timing(rays, { toValue: 1,   duration: 900, useNativeDriver: true }),
      Animated.timing(rays, { toValue: 0.6, duration: 900, useNativeDriver: true }),
    ]));
    loop.start(); p.start(); r.start();
    return () => { loop.stop(); p.stop(); r.stop(); };
  }, []);

  const rotate = spin.interpolate({ inputRange: [0,1], outputRange: ['0deg','360deg'] });
  const RAY_COUNT = 8;

  return (
    <View style={S.canvas}>
      <Animated.View style={{ position: 'absolute', width: 200, height: 200, transform: [{ rotate }] }}>
        {Array.from({ length: RAY_COUNT }).map((_, i) => (
          <Animated.View key={i} style={{
            position: 'absolute',
            top: 92, left: 99,
            width: 2, height: 90,
            borderRadius: 1,
            backgroundColor: color,
            opacity: rays,
            transform: [
              { rotate: `${i * 45}deg` },
              { translateY: -50 },
            ],
          }} />
        ))}
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <AffIcon type="star-burst" color={color} size={72} />
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. RAINBOW — I choose joy today
// ─────────────────────────────────────────────────────────────────────────────
const RAINBOW = ['#FF6B6B','#FF9F43','#FFD93D','#6BCB77','#4D96FF','#9B5DE5'];

function AnimRainbow({ color }: { color: string }) {
  const a0 = useRef(new Animated.Value(0)).current;
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const a3 = useRef(new Animated.Value(0)).current;
  const a4 = useRef(new Animated.Value(0)).current;
  const a5 = useRef(new Animated.Value(0)).current;
  const all = [a0, a1, a2, a3, a4, a5];

  useEffect(() => {
    const make = (v: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: 500, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
        Animated.delay(900),
        Animated.timing(v, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.delay(100),
      ]));
    const loops = all.map((v, i) => make(v, i * 100));
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  return (
    <View style={S.canvas}>
      <View style={{ marginBottom: 22 }}>
        <AffIcon type="rainbow" color={color} size={60} />
      </View>
      {all.map((v, i) => (
        <Animated.View key={i} style={{
          width: 180 - i * 20, height: 14, borderRadius: 7,
          backgroundColor: RAINBOW[i], marginBottom: 5,
          transform: [{ scaleX: v }],
        }} />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. COME TOGETHER — I am a wonderful friend
// ─────────────────────────────────────────────────────────────────────────────
function AnimComeTogether({ color }: { color: string }) {
  const pos = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pos, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(600),
      Animated.timing(pos, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      Animated.delay(300),
    ]));
    loop.start();
    return () => loop.stop();
  }, []);

  const lx = pos.interpolate({ inputRange: [0,1], outputRange: [-10, -70] });
  const rx = pos.interpolate({ inputRange: [0,1], outputRange: [10,  70] });
  const op = pos.interpolate({ inputRange: [0,1], outputRange: [0.35, 1] });

  return (
    <View style={S.canvas}>
      <View style={{ marginBottom: 24 }}>
        <AffIcon type="come-together" color={color} size={48} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={{
          width: 70, height: 70, borderRadius: 35,
          backgroundColor: color, opacity: op,
          transform: [{ translateX: lx }],
          justifyContent: 'center', alignItems: 'center',
        }}>
          <Feather name="users" size={28} color="#FFF" />
        </Animated.View>
        <Animated.View style={{
          width: 70, height: 70, borderRadius: 35,
          backgroundColor: color + '88', opacity: op,
          transform: [{ translateX: rx }],
          justifyContent: 'center', alignItems: 'center',
        }}>
          <Feather name="heart" size={28} color="#FFF" />
        </Animated.View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. FLOAT DREAM — my dreams are worth chasing
// ─────────────────────────────────────────────────────────────────────────────
function AnimFloatDream({ color }: { color: string }) {
  const floatY = useRef(new Animated.Value(0)).current;
  const s0 = useRef(new Animated.Value(1)).current;
  const s1 = useRef(new Animated.Value(0)).current;
  const s2 = useRef(new Animated.Value(1)).current;
  const s3 = useRef(new Animated.Value(0)).current;
  const s4 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const float = Animated.loop(Animated.sequence([
      Animated.timing(floatY, { toValue: -20, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      Animated.timing(floatY, { toValue: 0,   duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
    ]));
    const twinkle = (v: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 0, duration: 400, useNativeDriver: true }),
        Animated.timing(v, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]));
    const stars = [s0,s1,s2,s3,s4].map((v,i) => twinkle(v, i*220));
    float.start(); stars.forEach(s => s.start());
    return () => { float.stop(); stars.forEach(s => s.stop()); };
  }, []);

  const starPos = [
    { x: -70, y: -50 }, { x: 65, y: -30 }, { x: -50, y: 30 },
    { x: 70,  y: 40  }, { x: 10, y: -70 },
  ];
  const starAnims = [s0, s1, s2, s3, s4];

  return (
    <View style={S.canvas}>
      {starPos.map((p, i) => (
        <Animated.View key={i} style={{
          position: 'absolute',
          opacity: starAnims[i],
          transform: [{ translateX: p.x }, { translateY: p.y }],
        }}>
          <Feather name="star" size={12} color={color} />
        </Animated.View>
      ))}
      <Animated.View style={{ transform: [{ translateY: floatY }] }}>
        <AffIcon type="float-dream" color={color} size={90} />
      </Animated.View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. EXPAND RINGS — I believe in myself
// ─────────────────────────────────────────────────────────────────────────────
function AnimExpandRings({ color }: { color: string }) {
  const e1 = useRef(new Animated.Value(0)).current;
  const e2 = useRef(new Animated.Value(0)).current;
  const e3 = useRef(new Animated.Value(0)).current;

  const ring = (v: Animated.Value, delay: number) =>
    Animated.loop(Animated.sequence([
      Animated.delay(delay),
      Animated.timing(v, { toValue: 1, duration: 1400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
    ]));

  useEffect(() => {
    const loops = [ring(e1,0), ring(e2,480), ring(e3,960)];
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  return (
    <View style={S.canvas}>
      {[e1,e2,e3].map((v, i) => (
        <Animated.View key={i} style={[S.ring, { borderColor: color,
          transform: [{ scale: v.interpolate({ inputRange:[0,1], outputRange:[0.2,1.6] }) }],
          opacity:          v.interpolate({ inputRange:[0,0.1,1], outputRange:[0,0.6,0] }),
        }]} />
      ))}
      <AffIcon type="expand-rings" color={color} size={76} />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. COLOR DOTS — creative and full of ideas
// ─────────────────────────────────────────────────────────────────────────────
const DOT_COLORS = ['#FF6B6B','#FFB830','#3DD6C0','#7C6EF0','#FF85A2','#5BB8E4'];
const DOT_POS    = [{ x:-65,y:-30 },{ x:55,y:-55 },{ x:-40,y:40 },{ x:65,y:35 },{ x:10,y:-70 },{ x:-20,y:55 }];

function AnimColorDots({ color }: { color: string }) {
  const d0 = useRef(new Animated.Value(0)).current;
  const d1 = useRef(new Animated.Value(0)).current;
  const d2 = useRef(new Animated.Value(0)).current;
  const d3 = useRef(new Animated.Value(0)).current;
  const d4 = useRef(new Animated.Value(0)).current;
  const d5 = useRef(new Animated.Value(0)).current;
  const dots = [d0,d1,d2,d3,d4,d5];

  useEffect(() => {
    const make = (v: Animated.Value, delay: number) =>
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(v, { toValue: 1, duration: 350, easing: Easing.out(Easing.back(2.5)), useNativeDriver: true }),
        Animated.timing(v, { toValue: 0.85, duration: 300, useNativeDriver: true }),
        Animated.timing(v, { toValue: 1,    duration: 300, useNativeDriver: true }),
        Animated.delay(600),
        Animated.timing(v, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.delay(200),
      ]));
    const loops = dots.map((v, i) => make(v, i * 140));
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, []);

  return (
    <View style={S.canvas}>
      <AffIcon type="color-dots" color={color} size={70} />
      {dots.map((v, i) => (
        <Animated.View key={i} style={{
          position: 'absolute',
          width: 28, height: 28, borderRadius: 14,
          backgroundColor: DOT_COLORS[i],
          transform: [
            { translateX: DOT_POS[i].x },
            { translateY: DOT_POS[i].y },
            { scale: v },
          ],
        }} />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dispatcher
// ─────────────────────────────────────────────────────────────────────────────
function AffAnimation({ anim, color }: { anim: AffAnimType; color: string }) {
  switch (anim) {
    case 'pulse-ring':    return <AnimPulseRing    color={color} />;
    case 'float-hearts':  return <AnimFloatHearts  color={color} />;
    case 'rise-up':       return <AnimRiseUp        color={color} />;
    case 'spin-petals':   return <AnimSpinPetals   color={color} />;
    case 'grow-plant':    return <AnimGrowPlant    color={color} />;
    case 'wave':          return <AnimWave          color={color} />;
    case 'star-burst':    return <AnimStarBurst    color={color} />;
    case 'rainbow':       return <AnimRainbow       color={color} />;
    case 'come-together': return <AnimComeTogether color={color} />;
    case 'float-dream':   return <AnimFloatDream   color={color} />;
    case 'expand-rings':  return <AnimExpandRings  color={color} />;
    case 'color-dots':    return <AnimColorDots    color={color} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Player
// ─────────────────────────────────────────────────────────────────────────────
interface Props {
  item: AffirmationItem;
  onClose: () => void;
}

export default function AffirmationPlayer({ item, onClose }: Props) {
  const { isDark, language, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;

  return (
    <SafeAreaView style={[S.safe, { backgroundColor: isDark ? T.bg : item.bg }]}>
      <TouchableOpacity style={S.closeBtn} onPress={onClose} activeOpacity={0.7}>
        <Text style={[S.closeText, { color: item.color }]}>← {t('Back')}</Text>
      </TouchableOpacity>

      <View style={S.animArea}>
        <AffAnimation key={item.text} anim={item.anim} color={item.color} />
      </View>

      <View style={[S.textCard, { backgroundColor: isDark ? T.card : '#FFFFFFCC', borderColor: item.color + '33' }]}>
        <Text style={[S.affText, { color: isDark ? T.text : item.color }]}>{language === 'es' ? (item.es ?? item.text) : item.text}</Text>
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  safe:     { flex: 1 },
  closeBtn: { paddingHorizontal: 22, paddingVertical: 16 },
  closeText:{ fontSize: 15, fontWeight: '700' },

  animArea: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
  },
  canvas: {
    width: 220, height: 220, alignItems: 'center', justifyContent: 'center',
  },
  ring: {
    position: 'absolute', width: 190, height: 190, borderRadius: 95, borderWidth: 3,
  },

  textCard: {
    margin: 20, borderRadius: 28, borderWidth: 2, padding: 28,
    alignItems: 'center',
  },
  affText: {
    fontSize: 26, fontWeight: '900', textAlign: 'center', letterSpacing: -0.3, lineHeight: 36,
  },
});
