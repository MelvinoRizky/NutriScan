import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing, Shadow } from './theme';

// Generic elevated surface. `flat` removes the shadow, `tight` reduces padding.
export default function Card({ children, style, flat = false, tight = false }) {
  return (
    <View
      style={[
        styles.card,
        tight && styles.tight,
        !flat && Shadow.card,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tight: { padding: Spacing.sm },
});
