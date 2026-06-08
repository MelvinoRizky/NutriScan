import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, FontSize, Gradients, Shadow } from './theme';

export default function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'solid', // 'solid' | 'outline' | 'ghost'
  icon,
  gradient = Gradients.primary,
  style,
}) {
  const isSolid = variant === 'solid';
  const inner = (
    <>
      {loading ? (
        <ActivityIndicator color={isSolid ? Colors.white : Colors.primary} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && (
            <Ionicons
              name={icon}
              size={18}
              color={isSolid ? Colors.white : Colors.primary}
            />
          )}
          <Text style={[styles.text, isSolid ? styles.textSolid : styles.textOutline]}>
            {title}
          </Text>
        </View>
      )}
    </>
  );

  if (isSolid) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[styles.shadow, (disabled || loading) && styles.disabled, style]}
      >
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          {inner}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'ghost' ? styles.ghost : styles.outline,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {inner}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: { borderRadius: Radius.full, ...Shadow.md },
  button: {
    height: 54,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  outline: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: { backgroundColor: Colors.primarySoft },
  disabled: { opacity: 0.5 },
  text: { fontSize: FontSize.md, fontWeight: '700' },
  textSolid: { color: Colors.white },
  textOutline: { color: Colors.primary },
});
