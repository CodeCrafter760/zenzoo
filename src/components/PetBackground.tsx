import React from 'react';
import { View, StyleSheet, type DimensionValue } from 'react-native';

interface Props {
  bgType?: string;
}

export default function PetBackground({ bgType }: Props) {
  if (bgType === 'treehouse') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#4A7C59' }]}>
        <View style={{ position: 'absolute', top: 0, width: '100%', height: '55%', backgroundColor: '#87CEEB' }} />
        <View style={{ position: 'absolute', top: 18, right: 28, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFD700' }} />
        <View style={{ position: 'absolute', top: 22, left: 20, width: 55, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF', opacity: 0.85 }} />
        <View style={{ position: 'absolute', top: 16, left: 36, width: 35, height: 16, borderRadius: 8, backgroundColor: '#FFFFFF', opacity: 0.85 }} />
        <View style={{ position: 'absolute', left: 14, top: 50, width: 16, height: '60%', backgroundColor: '#5C3317' }} />
        <View style={{ position: 'absolute', right: 14, top: 50, width: 16, height: '60%', backgroundColor: '#5C3317' }} />
        <View style={{ position: 'absolute', bottom: 80, left: 10, right: 10, height: 12, backgroundColor: '#8B6914', borderRadius: 4 }} />
        <View style={{ position: 'absolute', bottom: 92, left: 28, right: 28, height: 50, backgroundColor: '#A0522D', borderRadius: 4 }} />
        <View style={{ position: 'absolute', bottom: 138, left: 18, right: 18, height: 0, borderLeftWidth: 30, borderRightWidth: 30, borderBottomWidth: 24, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#5C3317' }} />
        <View style={{ position: 'absolute', bottom: 110, alignSelf: 'center', width: 16, height: 16, borderRadius: 2, backgroundColor: '#87CEEB', borderWidth: 2, borderColor: '#5C3317' }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 45, backgroundColor: '#2E7D32' }} />
        <View style={{ position: 'absolute', bottom: 40, width: '100%', height: 12, backgroundColor: '#388E3C', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
      </View>
    );
  }

  if (bgType === 'space') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#0A0A1E' }]}>
        {[{x:8,y:12},{x:22,y:5},{x:45,y:18},{x:68,y:8},{x:82,y:22},{x:15,y:35},{x:55,y:30},{x:75,y:14},{x:35,y:45},{x:90,y:40}].map((s, i) => (
          <View key={i} style={{ position: 'absolute', left: `${s.x}%` as DimensionValue, top: `${s.y}%` as DimensionValue, width: 2+i%3, height: 2+i%3, borderRadius: 2, backgroundColor: '#FFFFFF', opacity: 0.7 + (i%3)*0.1 }} />
        ))}
        <View style={{ position: 'absolute', top: 20, right: 24, width: 54, height: 54, borderRadius: 27, backgroundColor: '#FF7043' }}>
          <View style={{ position: 'absolute', top: 12, left: 6, width: 42, height: 8, borderRadius: 4, backgroundColor: '#FF5722', opacity: 0.6 }} />
          <View style={{ position: 'absolute', top: 28, left: 10, width: 30, height: 6, borderRadius: 3, backgroundColor: '#BF360C', opacity: 0.5 }} />
        </View>
        <View style={{ position: 'absolute', top: 42, right: 12, width: 78, height: 10, borderRadius: 5, borderWidth: 3, borderColor: '#FFE082', transform: [{ rotate: '-20deg' }] }} />
        <View style={{ position: 'absolute', top: 85, left: 20, width: 22, height: 22, borderRadius: 11, backgroundColor: '#90A4AE' }}>
          <View style={{ position: 'absolute', top: 5, left: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: '#78909C' }} />
        </View>
        <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, height: 60, backgroundColor: '#1A237E', opacity: 0.4, borderTopLeftRadius: 50, borderTopRightRadius: 50 }} />
        <View style={{ position: 'absolute', top: 55, left: 10, width: 40, height: 3, backgroundColor: '#E0E0E0', borderRadius: 2, opacity: 0.6, transform: [{ rotate: '-30deg' }] }} />
      </View>
    );
  }

  if (bgType === 'forest') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#1B5E20' }]}>
        <View style={{ position: 'absolute', top: 0, width: '100%', height: '40%', backgroundColor: '#2E7D32' }} />
        {[10, 70, 130, 200, 260].map((x, i) => (
          <View key={i} style={{ position: 'absolute', left: x, bottom: 30 }}>
            <View style={{ width: 0, height: 0, borderLeftWidth: 18+i*3, borderRightWidth: 18+i*3, borderBottomWidth: 50+i*8, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: ['#1B5E20','#2E7D32','#388E3C','#43A047','#1B5E20'][i] }} />
            <View style={{ width: 8, height: 18, backgroundColor: '#5D4037', alignSelf: 'center' }} />
          </View>
        ))}
        {[{x:40,y:60},{x:100,y:80},{x:180,y:50},{x:240,y:90}].map((f, i) => (
          <View key={i} style={{ position: 'absolute', left: f.x, top: f.y, width: 5, height: 5, borderRadius: 3, backgroundColor: '#F9A825', opacity: 0.8 }} />
        ))}
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 32, backgroundColor: '#33691E' }} />
      </View>
    );
  }

  if (bgType === 'beach') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#29B6F6' }]}>
        <View style={{ position: 'absolute', top: 0, width: '100%', height: '50%', backgroundColor: '#FF7043', opacity: 0.35 }} />
        <View style={{ position: 'absolute', top: 16, right: 30, width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFB300' }} />
        <View style={{ position: 'absolute', bottom: 40, width: '100%', height: 80, backgroundColor: '#0288D1', opacity: 0.7, borderTopLeftRadius: 20, borderTopRightRadius: 20 }} />
        <View style={{ position: 'absolute', bottom: 75, width: '100%', height: 10, backgroundColor: '#4FC3F7', borderTopLeftRadius: 12, borderTopRightRadius: 12, opacity: 0.6 }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 42, backgroundColor: '#FFD54F' }} />
        <View style={{ position: 'absolute', left: 20, bottom: 40, width: 8, height: 60, backgroundColor: '#795548', borderTopLeftRadius: 4, borderTopRightRadius: 4 }} />
        <View style={{ position: 'absolute', left: 4, bottom: 94, width: 0, height: 0, borderLeftWidth: 20, borderRightWidth: 8, borderBottomWidth: 18, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#388E3C' }} />
        <View style={{ position: 'absolute', left: 10, bottom: 94, width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 20, borderBottomWidth: 18, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#2E7D32' }} />
      </View>
    );
  }

  if (bgType === 'mountain') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#B3E5FC' }]}>
        <View style={{ position: 'absolute', top: 20, right: 30, width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF9C4' }} />
        <View style={{ position: 'absolute', bottom: 60, left: -20, width: 0, height: 0, borderLeftWidth: 90, borderRightWidth: 90, borderBottomWidth: 130, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#78909C' }} />
        <View style={{ position: 'absolute', bottom: 148, left: 48, width: 0, height: 0, borderLeftWidth: 24, borderRightWidth: 24, borderBottomWidth: 34, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FFFFFF' }} />
        <View style={{ position: 'absolute', bottom: 50, left: 90, width: 0, height: 0, borderLeftWidth: 70, borderRightWidth: 70, borderBottomWidth: 105, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#90A4AE' }} />
        <View style={{ position: 'absolute', bottom: 128, left: 128, width: 0, height: 0, borderLeftWidth: 20, borderRightWidth: 20, borderBottomWidth: 28, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#FFFFFF' }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 46, backgroundColor: '#ECEFF1' }} />
      </View>
    );
  }

  if (bgType === 'desert') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#FFE0B2' }]}>
        <View style={{ position: 'absolute', top: 22, right: 26, width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFB74D' }} />
        <View style={{ position: 'absolute', bottom: 34, width: '100%', height: 70, backgroundColor: '#E0A85C', borderTopLeftRadius: 90, borderTopRightRadius: 40 }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 46, backgroundColor: '#D2924A' }} />
        <View style={{ position: 'absolute', left: 40, bottom: 46, width: 10, height: 40, borderRadius: 5, backgroundColor: '#2E7D32' }} />
        <View style={{ position: 'absolute', left: 26, bottom: 70, width: 10, height: 20, borderRadius: 5, backgroundColor: '#2E7D32', transform: [{ rotate: '-30deg' }] }} />
        <View style={{ position: 'absolute', left: 50, bottom: 74, width: 10, height: 20, borderRadius: 5, backgroundColor: '#2E7D32', transform: [{ rotate: '30deg' }] }} />
      </View>
    );
  }

  if (bgType === 'underwater') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#0288D1' }]}>
        <View style={{ position: 'absolute', top: 0, width: '100%', height: '45%', backgroundColor: '#4FC3F7', opacity: 0.6 }} />
        {[{x:20,y:100,s:8},{x:70,y:60,s:5},{x:110,y:140,s:6},{x:160,y:80,s:9},{x:200,y:130,s:5}].map((b, i) => (
          <View key={i} style={{ position: 'absolute', left: b.x, top: b.y, width: b.s, height: b.s, borderRadius: b.s / 2, borderWidth: 1.5, borderColor: '#E1F5FE', opacity: 0.7 }} />
        ))}
        <View style={{ position: 'absolute', bottom: 40, right: 40, width: 30, height: 18, borderRadius: 12, backgroundColor: '#FF8A65' }} />
        <View style={{ position: 'absolute', bottom: 44, right: 26, width: 0, height: 0, borderTopWidth: 8, borderBottomWidth: 8, borderLeftWidth: 12, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#FF8A65' }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 34, backgroundColor: '#EFEBD8' }} />
        {[16, 60, 240].map((x, i) => (
          <View key={i} style={{ position: 'absolute', left: x, bottom: 30, width: 8, height: 30, borderRadius: 4, backgroundColor: '#00897B' }} />
        ))}
      </View>
    );
  }

  if (bgType === 'cherry') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#FDE7EF' }]}>
        <View style={{ position: 'absolute', top: 0, width: '100%', height: '55%', backgroundColor: '#FBC4D8' }} />
        <View style={{ position: 'absolute', top: 18, left: 24, width: 30, height: 30, borderRadius: 15, backgroundColor: '#FFFFFF', opacity: 0.85 }} />
        <View style={{ position: 'absolute', left: 4, bottom: 40, width: 14, height: 90, backgroundColor: '#6D4C41' }} />
        <View style={{ position: 'absolute', left: -30, bottom: 100, width: 120, height: 70, borderRadius: 60, backgroundColor: '#FF8FAB' }} />
        <View style={{ position: 'absolute', right: 6, bottom: 40, width: 14, height: 70, backgroundColor: '#6D4C41' }} />
        <View style={{ position: 'absolute', right: -30, bottom: 88, width: 100, height: 60, borderRadius: 50, backgroundColor: '#FFB3C7' }} />
        {[{x:60,y:30},{x:140,y:60},{x:220,y:40}].map((p, i) => (
          <View key={i} style={{ position: 'absolute', left: p.x, top: p.y, width: 6, height: 6, borderRadius: 3, backgroundColor: '#FF8FAB', opacity: 0.8 }} />
        ))}
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 40, backgroundColor: '#F8BBD0' }} />
      </View>
    );
  }

  if (bgType === 'aurora') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#0B1226' }]}>
        {[{x:12,y:10},{x:40,y:22},{x:70,y:8},{x:95,y:20},{x:15,y:34},{x:80,y:36}].map((s, i) => (
          <View key={i} style={{ position: 'absolute', left: `${s.x}%` as DimensionValue, top: `${s.y}%` as DimensionValue, width: 2, height: 2, borderRadius: 1, backgroundColor: '#FFFFFF', opacity: 0.8 }} />
        ))}
        <View style={{ position: 'absolute', top: 30, left: -20, width: '140%', height: 34, backgroundColor: '#00E5B0', opacity: 0.35, borderRadius: 40, transform: [{ rotate: '-6deg' }] }} />
        <View style={{ position: 'absolute', top: 52, left: -20, width: '140%', height: 28, backgroundColor: '#7C4DFF', opacity: 0.35, borderRadius: 40, transform: [{ rotate: '4deg' }] }} />
        <View style={{ position: 'absolute', top: 70, left: -20, width: '140%', height: 22, backgroundColor: '#00B0FF', opacity: 0.3, borderRadius: 40, transform: [{ rotate: '-3deg' }] }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 40, backgroundColor: '#E8EAF6' }} />
      </View>
    );
  }

  if (bgType === 'candyland') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#FFF0F6' }]}>
        <View style={{ position: 'absolute', top: 0, width: '100%', height: '55%', backgroundColor: '#FCE4EC' }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 46, backgroundColor: '#F8BBD0' }} />
        {[30, 110, 200].map((x, i) => (
          <View key={i} style={{ position: 'absolute', left: x, bottom: 40, alignItems: 'center' }}>
            <View style={{ width: 10, height: 46, borderRadius: 5, backgroundColor: i % 2 === 0 ? '#FF5C8A' : '#42A5F5' }} />
            <View style={{ position: 'absolute', top: 0, width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF', opacity: 0.6 }} />
          </View>
        ))}
        {[70, 160, 235].map((x, i) => (
          <View key={i} style={{ position: 'absolute', left: x, bottom: 44, alignItems: 'center' }}>
            <View style={{ width: 4, height: 30, backgroundColor: '#D6A26B' }} />
            <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: ['#FFD93D', '#6BCB77', '#4D96FF'][i], marginTop: -50 }} />
          </View>
        ))}
      </View>
    );
  }

  if (bgType === 'library') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#5D4037' }]}>
        <View style={{ position: 'absolute', top: 0, width: '100%', height: '62%', backgroundColor: '#6D4C41' }} />
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={{ position: 'absolute', top: 10 + i * 4, left: 14 + i * 58, width: 46, height: 96, backgroundColor: '#4E342E' }}>
            {[0, 1, 2, 3, 4].map(j => (
              <View key={j} style={{ position: 'absolute', top: 6 + j * 17, left: 4, width: 5, height: 15, backgroundColor: ['#E57373', '#64B5F6', '#FFD54F', '#81C784', '#BA68C8'][(i + j) % 5] }} />
            ))}
          </View>
        ))}
        <View style={{ position: 'absolute', top: 30, right: 20, width: 26, height: 26, borderRadius: 13, backgroundColor: '#FFECB3', opacity: 0.9 }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 44, backgroundColor: '#3E2723' }} />
      </View>
    );
  }

  if (bgType === 'waterfall') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#1B5E20' }]}>
        <View style={{ position: 'absolute', top: 0, width: '100%', height: '40%', backgroundColor: '#2E7D32' }} />
        {[8, 230].map((x, i) => (
          <View key={i} style={{ position: 'absolute', left: x, bottom: 20 }}>
            <View style={{ width: 0, height: 0, borderLeftWidth: 26, borderRightWidth: 26, borderBottomWidth: 70, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#1B5E20' }} />
          </View>
        ))}
        <View style={{ position: 'absolute', top: 10, left: '38%' as DimensionValue, width: 46, height: '75%', backgroundColor: '#81D4FA', opacity: 0.85, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }} />
        <View style={{ position: 'absolute', bottom: 30, left: '30%' as DimensionValue, width: 62, height: 30, borderRadius: 20, backgroundColor: '#E1F5FE', opacity: 0.9 }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 34, backgroundColor: '#0277BD' }} />
      </View>
    );
  }

  if (bgType === 'carnival') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#1A1A3D' }]}>
        <View style={{ position: 'absolute', top: 30, alignSelf: 'center', width: 90, height: 90, borderRadius: 45, borderWidth: 4, borderColor: '#FFD54F', opacity: 0.9 }} />
        <View style={{ position: 'absolute', top: 75, alignSelf: 'center', width: 4, height: 60, backgroundColor: '#FFD54F' }} />
        {[{x:16,y:14},{x:60,y:6},{x:180,y:8},{x:230,y:16},{x:100,y:4},{x:150,y:10}].map((b, i) => (
          <View key={i} style={{ position: 'absolute', left: b.x, top: b.y, width: 7, height: 7, borderRadius: 3.5, backgroundColor: ['#FF5252', '#FFD740', '#69F0AE', '#40C4FF'][i % 4] }} />
        ))}
        <View style={{ position: 'absolute', bottom: 34, left: 20, width: 0, height: 0, borderLeftWidth: 26, borderRightWidth: 26, borderBottomWidth: 44, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#E53935' }} />
        <View style={{ position: 'absolute', bottom: 34, right: 20, width: 0, height: 0, borderLeftWidth: 26, borderRightWidth: 26, borderBottomWidth: 44, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#1E88E5' }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 34, backgroundColor: '#2B2B55' }} />
      </View>
    );
  }

  if (bgType === 'cloudscape') {
    return (
      <View style={[styles.canvas, { backgroundColor: '#8EC5FC' }]}>
        <View style={{ position: 'absolute', top: 20, right: 26, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF9C4' }} />
        <View style={{ position: 'absolute', top: 60, left: -10, width: 90, height: 26, borderRadius: 13, backgroundColor: '#FFFFFF', opacity: 0.95 }} />
        <View style={{ position: 'absolute', top: 46, left: 60, width: 30, height: 30, borderRadius: 15, backgroundColor: '#7CB9E8', opacity: 0.5 }}>
          <View style={{ position: 'absolute', bottom: -8, left: -10, width: 50, height: 14, borderRadius: 7, backgroundColor: '#F5F5F5', opacity: 0.9 }} />
        </View>
        <View style={{ position: 'absolute', bottom: 90, right: 10, width: 34, height: 34, borderRadius: 17, backgroundColor: '#A9C9E8', opacity: 0.55 }}>
          <View style={{ position: 'absolute', bottom: -8, left: -10, width: 56, height: 14, borderRadius: 7, backgroundColor: '#F5F5F5', opacity: 0.9 }} />
        </View>
        <View style={{ position: 'absolute', bottom: 34, left: 40, right: 40, height: 8, borderRadius: 4, backgroundColor: '#EF5350', opacity: 0.75 }} />
        <View style={{ position: 'absolute', bottom: 44, left: 46, right: 46, height: 8, borderRadius: 4, backgroundColor: '#FFCA28', opacity: 0.75 }} />
        <View style={{ position: 'absolute', bottom: 54, left: 52, right: 52, height: 8, borderRadius: 4, backgroundColor: '#66BB6A', opacity: 0.75 }} />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 34, backgroundColor: '#DCEDFB' }} />
      </View>
    );
  }

  // Default: meadow
  return (
    <View style={[styles.canvas, { backgroundColor: '#E0F4FF' }]}>
      <View style={{ position: 'absolute', top: 0, width: '100%', height: '60%', backgroundColor: '#87CEEB' }} />
      <View style={{ position: 'absolute', top: 18, right: 30, width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFD700' }} />
      <View style={{ position: 'absolute', top: 20, left: 16, width: 60, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF', opacity: 0.9 }} />
      <View style={{ position: 'absolute', top: 14, left: 34, width: 38, height: 18, borderRadius: 9, backgroundColor: '#FFFFFF', opacity: 0.9 }} />
      <View style={{ position: 'absolute', top: 28, right: 68, width: 44, height: 16, borderRadius: 8, backgroundColor: '#FFFFFF', opacity: 0.8 }} />
      <View style={{ position: 'absolute', bottom: 36, left: -20, width: 160, height: 60, borderTopLeftRadius: 80, borderTopRightRadius: 80, backgroundColor: '#8BC34A' }} />
      <View style={{ position: 'absolute', bottom: 36, right: -20, width: 160, height: 50, borderTopLeftRadius: 80, borderTopRightRadius: 80, backgroundColor: '#7CB342' }} />
      <View style={{ position: 'absolute', bottom: 0, width: '100%', height: 40, backgroundColor: '#9CCC65' }} />
      {[{x:18,c:'#FF7043'},{x:50,c:'#FFD600'},{x:88,c:'#E040FB'},{x:130,c:'#FF7043'},{x:200,c:'#FFD600'},{x:240,c:'#E040FB'}].map((f, i) => (
        <View key={i} style={{ position: 'absolute', left: f.x, bottom: 36, alignItems: 'center' }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: f.c }} />
          <View style={{ width: 2, height: 10, backgroundColor: '#558B2F' }} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { position: 'absolute', width: '100%', height: '100%' },
});
