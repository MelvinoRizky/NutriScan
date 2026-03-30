import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors, Spacing, Radius, FontSize } from './theme';

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'solid', // 'solid' | 'outline'
  style,
}) {
  const isSolid = variant === 'solid';
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSolid ? styles.solid : styles.outline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={isSolid ? Colors.white : Colors.primary} size="small" />
      ) : (
        <Text style={[styles.text, isSolid ? styles.textSolid : styles.textOutline]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solid: { backgroundColor: Colors.primary },
  outline: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  disabled: { opacity: 0.5 },
  text: { fontSize: FontSize.md, fontWeight: '700' },
  textSolid: { color: Colors.white },
  textOutline: { color: Colors.primary },
});
