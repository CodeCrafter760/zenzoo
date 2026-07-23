import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Animated, Easing, StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import PetAvatar, { EyeStyle, HairStyle, hatStyleFromId, outfitStyleFromId } from './sprites/PetAvatar';
import { tapHaptic } from '../utils/haptics';

interface Heart {
  id: number;
  tx: Animated.Value;
  ty: Animated.Value;
  op: Animated.Value;
}

interface Props {
  species:     string;
  bodyColor:   string;
  accentColor: string;
  muzzleColor: string;
  eyes:        EyeStyle;
  hair?:       HairStyle;
  hatId:       string | null;
  outfitId:    string | null;
  hintColor:   string;
}

export default function PetCircle({ species, bodyColor, accentColor, muzzleColor, eyes, hair = 'None', hatId, outfitId, hintColor }: Props) {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const floatAnim  = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
        Animated.timing(floatAnim, { toValue: 0,   duration: 2000, useNativeDriver: true, easing: Easing.inOut(Easing.sin) }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1.06, duration: 2600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(breathAnim, { toValue: 1,    duration: 2600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, []);

  const triggerHearts = () => {
    const batch: Heart[] = [-30, 0, 30].map((x, i) => {
      const h: Heart = {
        id: Date.now() + i,
        tx: new Animated.Value(x),
        ty: new Animated.Value(0),
        op: new Animated.Value(1),
      };
      Animated.parallel([
        Animated.timing(h.ty, { toValue: -90,                              duration: 1100, useNativeDriver: true }),
        Animated.timing(h.tx, { toValue: x + (Math.random() - 0.5) * 50, duration: 1100, useNativeDriver: true }),
        Animated.timing(h.op, { toValue: 0,                                duration: 1100, useNativeDriver: true }),
      ]).start(() => setHearts(p => p.filter(hh => hh.id !== h.id)));
      return h;
    });
    setHearts(p => [...p, ...batch]);
  };

  const tapScale = useRef(new Animated.Value(1)).current;
  const spring   = (to: number) =>
    Animated.spring(tapScale, { toValue: to, friction: 4, tension: 300, useNativeDriver: true });

  return (
    <TouchableOpacity
      onPress={triggerHearts}
      onPressIn={() => { tapHaptic(); spring(0.93).start(); }}
      onPressOut={() => spring(1).start()}
      activeOpacity={1}
      style={styles.tapArea}
    >
      <View style={styles.heartsLayer} pointerEvents="none">
        {hearts.map(h => (
          <Animated.View
            key={h.id}
            style={[styles.heartFloat, {
              transform: [{ translateX: h.tx }, { translateY: h.ty }],
              opacity: h.op,
            }]}
          >
            <Feather name="heart" size={20} color="#FFD93D" />
          </Animated.View>
        ))}
      </View>

      <Animated.View style={{ transform: [{ translateY: floatAnim }, { scale: tapScale }] }}>
        <Animated.View style={{ transform: [{ scale: breathAnim }] }}>
          <PetAvatar
            species={species}
            bodyColor={bodyColor}
            accentColor={accentColor}
            muzzleColor={muzzleColor}
            eyes={eyes}
            hair={hair}
            hat={hatStyleFromId(hatId)}
            outfit={outfitStyleFromId(outfitId)}
            size={170}
          />
        </Animated.View>
      </Animated.View>

      <Text style={[styles.hint, { color: hintColor }]}>Tap me for love! 💕</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tapArea:     { alignItems: 'center', marginBottom: 12 },
  heartsLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  heartFloat:  { position: 'absolute' },
  hint:        { fontSize: 12, marginTop: 8, fontWeight: '600' },
});
