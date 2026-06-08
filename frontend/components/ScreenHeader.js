import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Radius, Gradients, Shadow } from './theme';

// Rounded gradient header used across screens.
// Pass `onBack` to show a back chevron; `rightIcon`/`onRight` for an action.
export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRight,
  colors = Gradients.header,
  children,
}) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.wrap}
    >
      <SafeAreaView edges={['top']}>
        <View style={styles.row}>
          {onBack ? (
            <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={22} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconBtn} />
          )}

          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
          </View>

          {rightIcon ? (
            <TouchableOpacity onPress={onRight} style={styles.iconBtn} activeOpacity={0.7}>
              <Ionicons name={rightIcon} size={20} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <View style={styles.iconBtn} />
          )}
        </View>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    paddingBottom: Spacing.lg,
    ...Shadow.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrap: { flex: 1, alignItems: 'center', paddingHorizontal: Spacing.sm },
  title: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, letterSpacing: -0.3 },
  subtitle: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
});
