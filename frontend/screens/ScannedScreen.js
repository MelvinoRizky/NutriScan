import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';

// Mock scan result
const MOCK_RESULT = {
  name: 'Nasi Goreng',
  calories: 450,
  accuracy: 94,
  macros: [
    { label: 'Protein', value: '12g', color: Colors.accent, bg: '#FFF3E0' },
    { label: 'Carbs', value: '58g', color: Colors.primary, bg: '#E8F5E9' },
    { label: 'Fat', value: '18g', color: Colors.accent, bg: '#FFF3E0' },
  ],
};

export default function ScannedScreen({ navigation, route }) {
  const [saved, setSaved] = useState(false);
  const result = MOCK_RESULT;

  const handleSave = () => {
    setSaved(true);
    Alert.alert('Tersimpan! ✅', `${result.name} (${result.calories} kcal) berhasil ditambahkan ke log harian.`, [
      { text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'History' }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Orange header */}
        <View style={styles.orangeHeader}>
          <View>
            <Text style={styles.orangeTitle}>AI Food Scanner</Text>
            <Text style={styles.orangeSub}>Scan makananmu sekarang</Text>
          </View>
          <View style={styles.sparkleWrap}>
            <Ionicons name="sparkles" size={22} color={Colors.white} />
          </View>
        </View>

        {/* Dark food image area */}
        <View style={styles.imageArea}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.foodImageWrap}>
            <Text style={styles.foodImagePlaceholder}>[FOOD IMAGE]</Text>
          </View>
        </View>

        {/* Result card */}
        <View style={styles.resultCard}>
          <View style={styles.resultTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{result.name}</Text>
              <Text style={styles.deteksi}>Deteksi akurat</Text>
            </View>
            <View style={styles.accuracyBadge}>
              <Text style={styles.accuracyNum}>{result.accuracy}%</Text>
            </View>
            <View style={styles.calBadge}>
              <Text style={styles.calNum}>{result.calories}</Text>
              <Text style={styles.calUnit}>kalori</Text>
            </View>
          </View>

          {/* Macro chips */}
          <View style={styles.macroRow}>
            {result.macros.map(m => (
              <View key={m.label} style={[styles.macroChip, { backgroundColor: m.bg }]}>
                <Text style={[styles.macroVal, { color: m.color }]}>{m.value}</Text>
                <Text style={styles.macroLabel}>{m.label}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.rescanBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.rescanText}>Scan Ulang</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saved && { opacity: 0.5 }]}
              onPress={handleSave}
              disabled={saved}
            >
              <Text style={styles.saveText}>{saved ? '✅ Tersimpan' : 'Simpan ke Log'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom tab bar */}
      <View style={styles.fakeTabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })}>
          <Ionicons name="home-outline" size={20} color={Colors.textMuted} />
          <Text style={styles.tabLabel}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.scanTabBtn}>
            <Ionicons name="camera" size={22} color={Colors.white} />
          </View>
          <Text style={[styles.tabLabel, { color: Colors.accent }]}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MainTabs', { screen: 'History' })}>
          <Ionicons name="time-outline" size={20} color={Colors.textMuted} />
          <Text style={styles.tabLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}>
          <Ionicons name="person-outline" size={20} color={Colors.textMuted} />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.white },

  orangeHeader: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollContent: { flexGrow: 1, backgroundColor: Colors.white },
  orangeTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  orangeSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sparkleWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },

  imageArea: { height: 260, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  closeBtn: {
    position: 'absolute', top: Spacing.md, right: Spacing.md,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', zIndex: 2,
  },
  foodImageWrap: {
    width: 240, height: 220, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center', alignItems: 'center',
  },
  foodImagePlaceholder: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.3)' },

  resultCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    marginTop: -Spacing.lg,
    flex: 1,
  },
  resultTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.lg },
  foodName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  deteksi: { fontSize: FontSize.xs, color: Colors.primary, marginTop: 2, fontWeight: '600' },
  accuracyBadge: { backgroundColor: '#E8F5E9', borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  accuracyNum: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.primary },
  calBadge: { alignItems: 'flex-end' },
  calNum: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.textPrimary },
  calUnit: { fontSize: FontSize.xs, color: Colors.textMuted },

  macroRow: { flexDirection: 'row', gap: 10, marginBottom: Spacing.lg },
  macroChip: { flex: 1, borderRadius: Radius.lg, paddingVertical: Spacing.md, alignItems: 'center' },
  macroVal: { fontSize: FontSize.lg, fontWeight: '800' },
  macroLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4, fontWeight: '600' },

  actions: { flexDirection: 'row', gap: 12 },
  rescanBtn: { flex: 1, borderWidth: 1.5, borderColor: Colors.accent, borderRadius: Radius.full, height: 48, justifyContent: 'center', alignItems: 'center' },
  rescanText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.accent },
  saveBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: Radius.full, height: 48, justifyContent: 'center', alignItems: 'center' },
  saveText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },

  fakeTabBar: {
    flexDirection: 'row', backgroundColor: Colors.white, paddingBottom: 20, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  tabLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
  scanTabBtn: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center', marginTop: -20,
    borderWidth: 3, borderColor: Colors.white,
  },
});
