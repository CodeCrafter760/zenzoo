import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer, type AudioSource } from 'expo-audio';
import { useZenZoo } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS, SHADOW } from '../theme/theme';
import { tapHaptic } from '../utils/haptics';
import GlassCard from '../components/GlassCard';
import { Feather } from '@expo/vector-icons';

interface Track {
  title: string;
  mood: string;
  emoji: string;
  color: string;
  // No bundled lo-fi audio ships with the app yet — drop files into
  // assets/Vibe_audio and point this at `require(...)` (see that folder's README).
  audio: AudioSource | null;
}

const TRACKS: Track[] = [
  { title: 'Rainy Window',    mood: 'Study',  emoji: '🌧️', color: PALETTE.sky,        audio: null },
  { title: 'Late Night Desk', mood: 'Focus',  emoji: '🌙', color: PALETTE.neonViolet, audio: null },
  { title: 'Slow Drive',      mood: 'Chill',  emoji: '🚗', color: PALETTE.neonTeal,   audio: null },
  { title: 'Empty Hallway',   mood: 'Unwind', emoji: '🏫', color: PALETTE.coral,      audio: null },
];

function EqualizerBars({ color, active }: { color: string; active: boolean }) {
  const bars = useRef([0, 1, 2, 3].map(() => new Animated.Value(0.3))).current;

  useEffect(() => {
    if (!active) { bars.forEach(b => b.setValue(0.3)); return; }
    const loops = bars.map((b, i) =>
      Animated.loop(Animated.sequence([
        Animated.delay(i * 110),
        Animated.timing(b, { toValue: 1,   duration: 340, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        Animated.timing(b, { toValue: 0.25, duration: 340, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
      ]))
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [active]);

  return (
    <View style={S.eq}>
      {bars.map((b, i) => (
        <Animated.View
          key={i}
          style={[S.eqBar, { backgroundColor: color, height: b.interpolate({ inputRange: [0, 1], outputRange: [6, 22] }) }]}
        />
      ))}
    </View>
  );
}

export default function AudioLoungeScreen() {
  const { isDark, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);

  useEffect(() => () => { playerRef.current?.remove(); }, []);

  const stop = () => {
    playerRef.current?.pause();
    playerRef.current?.remove();
    playerRef.current = null;
    setPlayingIdx(null);
  };

  const toggleTrack = async (index: number) => {
    tapHaptic();
    const track = TRACKS[index];

    if (playingIdx === index) { stop(); return; }
    if (playerRef.current) stop();

    if (!track.audio) return; // "Coming soon" tracks — nothing to play yet.

    await setAudioModeAsync({ playsInSilentMode: true, shouldPlayInBackground: true });
    const player = createAudioPlayer(track.audio);
    player.loop = true;
    player.play();
    playerRef.current = player;
    setPlayingIdx(index);
  };

  return (
    <SafeAreaView style={[S.safe, { backgroundColor: T.bg }]}>
      <View style={S.header}>
        <Text style={[S.title, { color: T.text }]}>{t('Vibe')} 🎧</Text>
        <Text style={[S.sub, { color: T.mid }]}>{t('Lo-fi loops for studying, chilling, or resetting')}</Text>
      </View>

      <ScrollView contentContainerStyle={S.scroll} showsVerticalScrollIndicator={false}>
        {TRACKS.map((track, i) => {
          const active = playingIdx === i;
          const disabled = !track.audio;
          return (
            <TouchableOpacity
              key={track.title}
              activeOpacity={0.85}
              disabled={disabled}
              onPress={() => toggleTrack(i)}
              style={S.cardWrap}
            >
              <GlassCard isDark={isDark} tint={active ? track.color + '33' : undefined} style={S.card}>
                <View style={S.cardRow}>
                  <View style={[S.emojiCircle, { backgroundColor: track.color + '33' }]}>
                    <Text style={S.emoji}>{track.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[S.trackTitle, { color: T.text }]}>{t(track.title)}</Text>
                    <Text style={[S.trackMood, { color: track.color }]}>{t(track.mood)}</Text>
                  </View>
                  {disabled ? (
                    <Text style={[S.comingSoon, { color: T.soft }]}>{t('Coming soon')}</Text>
                  ) : active ? (
                    <EqualizerBars color={track.color} active={active} />
                  ) : (
                    <View style={[S.playBtn, { backgroundColor: track.color }]}>
                      <Feather name="play" size={16} color="#FFF" />
                    </View>
                  )}
                </View>
              </GlassCard>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  title: { fontSize: 24, fontWeight: '900', letterSpacing: -0.3, marginBottom: 4 },
  sub:   { fontSize: 13, fontWeight: '600' },

  scroll: { padding: 16, paddingTop: 8, gap: 12 },
  cardWrap: { ...SHADOW.sm },
  card: { padding: 14 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  emojiCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 22 },

  trackTitle: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  trackMood:  { fontSize: 12, fontWeight: '700' },
  comingSoon: { fontSize: 11, fontWeight: '700' },

  playBtn: { width: 36, height: 36, borderRadius: RADIUS.pill, justifyContent: 'center', alignItems: 'center' },
  eq: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 22 },
  eqBar: { width: 4, borderRadius: 2 },
});
