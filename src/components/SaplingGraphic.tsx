import React from 'react';
import { View, StyleSheet } from 'react-native';

export type SaplingStage = 'seed' | 'sprout' | 'bush' | 'smallTree' | 'bigTree' | 'fullTree';

export function getSaplingStage(level: number): SaplingStage {
  if (level >= 16) return 'fullTree';
  if (level >= 11) return 'bigTree';
  if (level >= 7)  return 'smallTree';
  if (level >= 4)  return 'bush';
  if (level >= 2)  return 'sprout';
  return 'seed';
}

export default function SaplingGraphic({ level }: { level: number }) {
  const stage = getSaplingStage(level);
  const trunkH = Math.min(10 + level * 4, 70);
  const leafColor  = '#2ECC71';
  const leafDark   = '#27AE60';
  const leafBright = '#52D68A';

  if (stage === 'seed') {
    return (
      <View style={styles.graphic}>
        <View style={{ width: 4, height: 12, backgroundColor: '#A0522D', borderRadius: 2 }}>
          <View style={{ position: 'absolute', top: 0, left: -5, width: 6, height: 5, borderRadius: 3, backgroundColor: leafBright }} />
        </View>
      </View>
    );
  }

  if (stage === 'sprout') {
    return (
      <View style={styles.graphic}>
        <View style={{ width: 5, height: 22, backgroundColor: '#8B6914', borderRadius: 3 }}>
          <View style={{ position: 'absolute', top: 4, left: -9, width: 10, height: 7, borderRadius: 5, backgroundColor: leafColor, transform: [{ rotate: '-30deg' }] }} />
          <View style={{ position: 'absolute', top: 10, right: -9, width: 10, height: 7, borderRadius: 5, backgroundColor: leafDark, transform: [{ rotate: '30deg' }] }} />
        </View>
      </View>
    );
  }

  if (stage === 'bush') {
    return (
      <View style={styles.graphic}>
        <View style={{ width: 6, height: 34, backgroundColor: '#8B6914', borderRadius: 3, position: 'relative' }}>
          {[{t:4,l:-12,r:-999,rot:'-35deg',w:12,h:8},{t:14,l:-999,r:-12,rot:'35deg',w:12,h:8},{t:6,l:-14,r:-999,rot:'-20deg',w:10,h:7},{t:20,l:-999,r:-14,rot:'20deg',w:10,h:7}].map((lf, i) => (
            <View key={i} style={{ position: 'absolute', top: lf.t, left: lf.l === -999 ? undefined : lf.l, right: lf.r === -999 ? undefined : lf.r, width: lf.w, height: lf.h, borderRadius: 5, backgroundColor: i%2===0?leafColor:leafDark, transform: [{ rotate: lf.rot }] }} />
          ))}
        </View>
      </View>
    );
  }

  if (stage === 'smallTree') {
    return (
      <View style={styles.graphic}>
        <View style={{ position: 'absolute', top: 8, left: -16, width: 20, height: 4, backgroundColor: '#8B6914', borderRadius: 2, transform: [{ rotate: '-30deg' }] }} />
        <View style={{ position: 'absolute', top: 8, right: -16, width: 20, height: 4, backgroundColor: '#8B6914', borderRadius: 2, transform: [{ rotate: '30deg' }] }} />
        <View style={{ position: 'absolute', top: 0, left: -22, width: 18, height: 14, borderRadius: 9, backgroundColor: leafColor, opacity: 0.95 }} />
        <View style={{ position: 'absolute', top: 0, right: -22, width: 18, height: 14, borderRadius: 9, backgroundColor: leafDark, opacity: 0.95 }} />
        <View style={{ width: 7, height: trunkH, backgroundColor: '#8B6914', borderRadius: 4, position: 'relative' }}>
          {[{t:4,l:-10 as number|undefined,r:undefined as number|undefined,rot:'-30deg'},{t:14,l:undefined,r:-10,rot:'30deg'},{t:24,l:-12,r:undefined,rot:'-20deg'}].map((lf, i) => (
            <View key={i} style={{ position: 'absolute', top: lf.t, left: lf.l, right: lf.r, width: 13, height: 9, borderRadius: 5, backgroundColor: i%2===0?leafColor:leafBright, transform: [{ rotate: lf.rot }] }} />
          ))}
        </View>
        <View style={{ position: 'absolute', top: -16, width: 30, height: 24, borderRadius: 15, backgroundColor: leafColor, borderWidth: 2, borderColor: leafDark }} />
      </View>
    );
  }

  if (stage === 'bigTree') {
    return (
      <View style={styles.graphic}>
        <View style={{ position: 'absolute', top: 14, left: -20, width: 26, height: 5, backgroundColor: '#6B4226', borderRadius: 2, transform: [{ rotate: '-25deg' }] }} />
        <View style={{ position: 'absolute', top: 14, right: -20, width: 26, height: 5, backgroundColor: '#6B4226', borderRadius: 2, transform: [{ rotate: '25deg' }] }} />
        <View style={{ position: 'absolute', top: 2, left: -28, width: 22, height: 18, borderRadius: 11, backgroundColor: leafDark }} />
        <View style={{ position: 'absolute', top: 2, right: -28, width: 22, height: 18, borderRadius: 11, backgroundColor: leafColor }} />
        <View style={{ width: 9, height: trunkH, backgroundColor: '#6B4226', borderRadius: 5 }}>
          {[{t:6,l:-14 as number|undefined,r:undefined as number|undefined},{t:20,l:undefined,r:-14},{t:34,l:-14,r:undefined}].map((lf, i) => (
            <View key={i} style={{ position: 'absolute', top: lf.t, left: lf.l, right: lf.r, width: 15, height: 10, borderRadius: 6, backgroundColor: i%2===0?leafColor:leafBright }} />
          ))}
        </View>
        <View style={{ position: 'absolute', top: -28, width: 44, height: 36, borderRadius: 22, backgroundColor: leafColor, borderWidth: 2, borderColor: leafDark }} />
        <View style={{ position: 'absolute', top: -20, left: -8, width: 30, height: 24, borderRadius: 15, backgroundColor: leafBright, opacity: 0.7 }} />
      </View>
    );
  }

  // fullTree
  return (
    <View style={styles.graphic}>
      <View style={{ position: 'absolute', top: 20, left: -28, width: 34, height: 6, backgroundColor: '#4A2E0E', borderRadius: 3, transform: [{ rotate: '-20deg' }] }} />
      <View style={{ position: 'absolute', top: 20, right: -28, width: 34, height: 6, backgroundColor: '#4A2E0E', borderRadius: 3, transform: [{ rotate: '20deg' }] }} />
      <View style={{ position: 'absolute', top: 38, left: -22, width: 26, height: 5, backgroundColor: '#4A2E0E', borderRadius: 3, transform: [{ rotate: '-30deg' }] }} />
      <View style={{ position: 'absolute', top: 38, right: -22, width: 26, height: 5, backgroundColor: '#4A2E0E', borderRadius: 3, transform: [{ rotate: '30deg' }] }} />
      <View style={{ position: 'absolute', top: 4, left: -36, width: 28, height: 22, borderRadius: 14, backgroundColor: leafDark }} />
      <View style={{ position: 'absolute', top: 4, right: -36, width: 28, height: 22, borderRadius: 14, backgroundColor: leafColor }} />
      <View style={{ position: 'absolute', top: 30, left: -28, width: 20, height: 16, borderRadius: 10, backgroundColor: leafBright }} />
      <View style={{ position: 'absolute', top: 30, right: -28, width: 20, height: 16, borderRadius: 10, backgroundColor: leafDark }} />
      <View style={{ width: 12, height: trunkH, backgroundColor: '#4A2E0E', borderRadius: 6 }} />
      <View style={{ position: 'absolute', top: -42, width: 60, height: 50, borderRadius: 30, backgroundColor: leafColor, borderWidth: 2, borderColor: leafDark }} />
      <View style={{ position: 'absolute', top: -34, left: -6, width: 42, height: 36, borderRadius: 21, backgroundColor: leafBright, opacity: 0.75 }} />
      <View style={{ position: 'absolute', top: -24, right: -4, width: 28, height: 24, borderRadius: 14, backgroundColor: leafDark, opacity: 0.6 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  graphic: { alignItems: 'center', justifyContent: 'flex-end', width: 80, height: 80 },
});
