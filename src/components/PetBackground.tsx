import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
  bgColor?: string;
}

export default function PetBackground({ bgColor }: Props) {
  return <View style={[styles.canvas, { backgroundColor: bgColor ?? '#4FC3F7' }]} />;
}

const styles = StyleSheet.create({
  canvas: { position: 'absolute', width: '100%', height: '100%' },
});
