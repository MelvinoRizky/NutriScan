import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';
import { supabase } from '../lib/supabase';

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

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Sarapan',     icon: '🍳' },
  { key: 'lunch',     label: 'Makan Siang', icon: '☀️' },
  { key: 'snack',     label: 'Snack',        icon: '🍪' },
  { key: 'dinner',    label: 'Makan Malam', icon: '🌙' },
];

function buildMacros(result) {
  if (Array.isArray(result?.macros)) return result.macros;

  return [
    { label: 'Protein', value: `${result?.macros?.protein ?? 0}g`, color: Colors.accent, bg: '#FFF3E0' },
    { label: 'Carbs', value: `${result?.macros?.carbs ?? 0}g`, color: Colors.primary, bg: '#E8F5E9' },
    { label: 'Fat', value: `${result?.macros?.fat ?? 0}g`, color: Colors.accent, bg: '#FFF3E0' },
  ];
}

export default function ScannedScreen({ navigation, route }) {
  const [saved, setSaved] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const imageUrl = route.params?.imageUrl;
  const scanResult = route.params?.scanResult;
  const result = {
    ...MOCK_RESULT,
    ...(scanResult || {}),
    macros: buildMacros(scanResult || MOCK_RESULT),
  };

  const handleSave = async () => {
    if (!selectedMeal) {
      Alert.alert('Pilih Waktu Makan', 'Pilih dulu ini sarapan, makan siang, snack, atau makan malam ya!');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'Kamu belum login, silakan login ulang!');
      return;
    }

    const parseG = str => parseFloat(String(str).replace('g', '')) || 0;
    const { error } = await supabase.from('food_logs').insert({
      user_id: user.id,
      food_name: result.name,
      calories: result.calories,
      protein: parseG(result.macros.find(m => m.label === 'Protein')?.value),
      carbs: parseG(result.macros.find(m => m.label === 'Carbs')?.value),
      fat: parseG(result.macros.find(m => m.label === 'Fat')?.value),
      meal_type: selectedMeal,
      ai_confidence: Number(result.accuracy) || 0,
      logged_at: new Date().toISOString(),
      image_url: imageUrl,
      top_predictions: scanResult?.topPredictions || [],
      components: scanResult?.components || [],
    });

    if (error) {
      console.error('[SAVE] Gagal simpan food_log:', error);
      Alert.alert('Gagal Simpan', `Error: ${error.message}`);
      return;
    }

    setSaved(true);
    Alert.alert(
      'Tersimpan! ✅',
      `${result.name} (${result.calories} kcal) berhasil ditambahkan ke log harian.`,
      [{ text: 'OK', onPress: () => navigation.navigate('MainTabs', { screen: 'History' }) }]
    );
  };


  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.orangeHeader}>
          <View>
            <Text style={styles.orangeTitle}>AI Food Scanner</Text>
            <Text style={styles.orangeSub}>Scan makananmu sekarang</Text>
          </View>
          <View style={styles.sparkleWrap}>
            <Ionicons name="sparkles" size={22} color={Colors.white} />
          </View>
        </View>

        <View style={styles.imageArea}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.foodImageWrap}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 20 }} resizeMode="cover" />
            ) : (
              <Text style={styles.foodImagePlaceholder}>[FOOD IMAGE]</Text>
            )}
          </View>
        </View>

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

          {scanResult?.components && scanResult.components.length > 1 ? (
            <View style={styles.componentsWrapper}>
              <Text style={styles.sectionTitle}>Rincian Nutrisi Per Makanan</Text>
              {scanResult.components.map((comp, idx) => (
                <View key={idx} style={styles.componentCard}>
                  <Text style={styles.compTitle}>{comp.name.replace(/_/g, ' ').toUpperCase()}</Text>
                  
                  <View style={styles.compCalRow}>
                    <Text style={styles.compCalNum}>{comp.calories}</Text>
                    <Text style={styles.compCalUnit}>kalori</Text>
                  </View>

                  <View style={styles.macroRow}>
                    <View style={[styles.macroChip, { backgroundColor: '#FFF3E0' }]}>
                      <Text style={[styles.macroVal, { color: Colors.accent }]}>{comp.macros.protein}g</Text>
                      <Text style={styles.macroLabel}>Protein</Text>
                    </View>
                    <View style={[styles.macroChip, { backgroundColor: '#E8F5E9' }]}>
                      <Text style={[styles.macroVal, { color: Colors.primary }]}>{comp.macros.carbs}g</Text>
                      <Text style={styles.macroLabel}>Carbs</Text>
                    </View>
                    <View style={[styles.macroChip, { backgroundColor: '#FFF3E0' }]}>
                      <Text style={[styles.macroVal, { color: Colors.accent }]}>{comp.macros.fat}g</Text>
                      <Text style={styles.macroLabel}>Fat</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.macroRow}>
              {result.macros.map(m => (
                <View key={m.label} style={[styles.macroChip, { backgroundColor: m.bg }]}>
                  <Text style={[styles.macroVal, { color: m.color }]}>{m.value}</Text>
                  <Text style={styles.macroLabel}>{m.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Show Top Predictions for debugging */}
          {scanResult?.topPredictions && scanResult.topPredictions.length > 0 && (
            <View style={styles.topPredictionsSection}>
              <Text style={styles.topPredictionsTitle}>🔍 Model Alternatives</Text>
              {scanResult.topPredictions.map((pred, idx) => (
                <View key={idx} style={styles.predictionRow}>
                  <Text style={styles.predictionLabel}>{pred.label}</Text>
                  <View style={styles.predictionBar}>
                    <View 
                      style={[
                        styles.predictionFill, 
                        { 
                          width: `${Math.round(pred.confidence * 100)}%`,
                          backgroundColor: idx === 0 ? '#FF6B6B' : idx === 1 ? '#FFA500' : '#FFD700'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.predictionScore}>{Math.round(pred.confidence * 100)}%</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.mealSection}>
            <Text style={styles.mealSectionTitle}>Waktu Makan</Text>
            <View style={styles.mealRow}>
              {MEAL_TYPES.map(m => {
                const isActive = selectedMeal === m.key;
                return (
                  <TouchableOpacity
                    key={m.key}
                    style={[styles.mealChip, isActive && styles.mealChipActive]}
                    onPress={() => setSelectedMeal(m.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.mealChipIcon}>{m.icon}</Text>
                    <Text style={[styles.mealChipLabel, isActive && styles.mealChipLabelActive]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.detailBtn} 
              onPress={() => navigation.navigate('ScanDetail', { imageUrl, scanResult })}
            >
              <Ionicons name="search" size={16} color={Colors.primary} />
              <Text style={styles.detailText}>Scan Details</Text>
            </TouchableOpacity>
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

  componentsWrapper: { marginTop: Spacing.sm, marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  componentCard: { 
    backgroundColor: '#F9FAFB', 
    borderRadius: Radius.lg, 
    padding: Spacing.md, 
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  compTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  compCalRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: Spacing.md, gap: 4 },
  compCalNum: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  compCalUnit: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: 4 },

  mealSection: { marginBottom: Spacing.lg },
  mealSectionTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  mealRow: { flexDirection: 'row', gap: 8 },
  mealChip: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  mealChipActive: { borderColor: Colors.primary, backgroundColor: '#E8F5E9' },
  mealChipIcon: { fontSize: 18, marginBottom: 4 },
  mealChipLabel: { fontSize: 10, fontWeight: '600', color: Colors.textMuted, textAlign: 'center' },
  mealChipLabelActive: { color: Colors.primary },

  topPredictionsSection: {
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    backgroundColor: '#F3F4F6',
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
  },
  topPredictionsTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  predictionLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textPrimary,
    width: 80,
  },
  predictionBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  predictionFill: {
    height: '100%',
    borderRadius: 3,
  },
  predictionScore: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.textPrimary,
    width: 40,
    textAlign: 'right',
  },

  actions: { flexDirection: 'row', gap: 12 },
  detailBtn: { 
    flex: 1, 
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF2FF', 
    borderWidth: 1.5, 
    borderColor: Colors.primary, 
    borderRadius: Radius.full, 
    height: 48 
  },
  detailText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
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
