import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gradients } from './theme';

// Subtle full-screen tinted backdrop that all screens sit on.
export default function GradientBackground({ colors = Gradients.screen, style, children }) {
  return (
    <LinearGradient colors={colors} style={[styles.fill, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
