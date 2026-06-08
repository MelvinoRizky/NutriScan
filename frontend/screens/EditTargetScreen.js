import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, Spacing, Radius, FontSize, Shadow, Gradients } from '../components/theme';
import { supabase } from '../lib/supabase';

const GOALS = [
  { key: 'lose', label: 'Menurunkan Berat Badan', sub: 'Defisit kalori 500 kcal/hari', icon: 'trending-down', iconColor: Colors.accent, iconBg: '#FFF3E0' },
  { key: 'maintain', label: 'Menjaga Berat Badan', sub: 'Kalori seimbang', icon: 'remove', iconColor: Colors.primary, iconBg: '#E8F5E9' },
  { key: 'gain', label: 'Menaikkan Berat Badan', sub: 'Surplus kalori 500 kcal/hari', icon: 'trending-up', iconColor: Colors.accent, iconBg: '#FFF3E0' },
];

export default function EditTargetScreen({ navigation }) {
  const [targetCal, setTargetCal] = useState(2000);
  const [goal, setGoal] = useState('lose');
  const [protein, setProtein] = useState(80);
  const [carbs, setCarbs] = useState(250);
  const [fat, setFat] = useState(65);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('target_calories, target_protein, target_carbs, target_fat, goal_type')
        .eq('id', user.id)
        .single();
      if (data) {
        if (data.target_calories) setTargetCal(data.target_calories);
        if (data.target_protein) setProtein(data.target_protein);
        if (data.target_carbs) setCarbs(data.target_carbs);
        if (data.target_fat) setFat(data.target_fat);
        if (data.goal_type) setGoal(data.goal_type);
      }
    })();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('users').upsert({
        id: user.id,
        target_calories: targetCal,
        target_protein: protein,
        target_carbs: carbs,
        target_fat: fat,
        goal_type: goal,
      });
      if (error) {
        setLoading(false);
        Alert.alert('Gagal Simpan', 'Terjadi kesalahan saat menyimpan target. Coba lagi ya!');
        return;
      }
    }
    setLoading(false);
    Alert.alert('Disimpan! ✅', 'Target harian berhasil diperbarui.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <View style={styles.safe}>
      <StatusBar style="light" />
      <LinearGradient colors={Gradients.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color={Colors.white} />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ubah Target Harian</Text>
          <Text style={styles.headerSub}>Sesuaikan dengan kebutuhanmu</Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tujuan</Text>
          {GOALS.map(g => (
            <TouchableOpacity
              key={g.key}
              style={[styles.goalOption, goal === g.key && styles.goalActive]}
              onPress={() => setGoal(g.key)}
            >
              <View style={[styles.goalIcon, { backgroundColor: g.iconBg }]}>
                <Ionicons name={g.icon} size={20} color={g.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.goalLabel, goal === g.key && styles.goalLabelActive]}>{g.label}</Text>
                <Text style={styles.goalSub}>{g.sub}</Text>
              </View>
              {goal === g.key && <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.sliderHeader}>
            <View style={styles.sliderHeaderLeft}>
              <Ionicons name="flame" size={18} color={Colors.accent} />
              <Text style={styles.sectionTitle}>Target Kalori</Text>
            </View>
            <Text style={styles.sliderValue}>{targetCal}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1200}
            maximumValue={3500}
            step={50}
            value={targetCal}
            onValueChange={setTargetCal}
            minimumTrackTintColor={Colors.accent}
            maximumTrackTintColor="#E5E7EB"
            thumbTintColor={Colors.accent}
          />
          <View style={styles.sliderRange}>
            <Text style={styles.rangeText}>1,200 kcal</Text>
            <Text style={styles.rangeText}>3,500 kcal</Text>
          </View>
          <View style={styles.recommendBox}>
            <Text style={styles.recommendText}>
              Berdasarkan profil kamu, rekomendasi kalori harian adalah <Text style={{ fontWeight: '700' }}>1,850 kcal</Text>
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Target Makronutrien</Text>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={[styles.macroVal, { color: Colors.accent }]}>{protein}g</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={50}
              maximumValue={150}
              step={5}
              value={protein}
              onValueChange={setProtein}
              minimumTrackTintColor={Colors.accent}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={Colors.accent}
            />
            <View style={styles.sliderRange}>
              <Text style={styles.rangeText}>50g</Text>
              <Text style={styles.rangeText}>150g</Text>
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>Karbohidrat</Text>
              <Text style={[styles.macroVal, { color: Colors.primary }]}>{carbs}g</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={400}
              step={5}
              value={carbs}
              onValueChange={setCarbs}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={Colors.primary}
            />
            <View style={styles.sliderRange}>
              <Text style={styles.rangeText}>100g</Text>
              <Text style={styles.rangeText}>400g</Text>
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>Lemak</Text>
              <Text style={[styles.macroVal, { color: Colors.accent }]}>{fat}g</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={30}
              maximumValue={100}
              step={5}
              value={fat}
              onValueChange={setFat}
              minimumTrackTintColor={Colors.accent}
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor={Colors.accent}
            />
            <View style={styles.sliderRange}>
              <Text style={styles.rangeText}>30g</Text>
              <Text style={styles.rangeText}>100g</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Ringkasan Target</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillVal}>{targetCal}</Text>
              <Text style={styles.summaryPillLabel}>Kalori</Text>
            </View>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillVal}>{protein}g</Text>
              <Text style={styles.summaryPillLabel}>Protein</Text>
            </View>
            <View style={styles.summaryPill}>
              <Text style={styles.summaryPillVal}>{carbs + fat}g</Text>
              <Text style={styles.summaryPillLabel}>Carbs+Fat</Text>
            </View>
          </View>
        </View>

        <PrimaryButton title="Simpan Target" onPress={handleSave} loading={loading} />
        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  backText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '600' },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },

  goalOption: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: Radius.xl,
    padding: Spacing.md, marginBottom: 8, gap: Spacing.md,
  },
  goalActive: { borderColor: Colors.primary, backgroundColor: '#E8F5E9' },
  goalIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  goalLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  goalLabelActive: { color: Colors.primary },
  goalSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sliderHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sliderValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.accent },
  slider: { width: '100%', height: 40 },
  sliderRange: { flexDirection: 'row', justifyContent: 'space-between' },
  rangeText: { fontSize: FontSize.xs, color: Colors.textMuted },

  recommendBox: {
    backgroundColor: '#FFF3E0', borderRadius: Radius.lg,
    padding: Spacing.md, marginTop: Spacing.md,
  },
  recommendText: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },

  macroItem: { marginBottom: Spacing.lg },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  macroLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  macroVal: { fontSize: FontSize.lg, fontWeight: '800' },

  summaryCard: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl,
    padding: Spacing.lg, marginBottom: Spacing.md,
  },
  summaryTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white, marginBottom: Spacing.md },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryPill: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: Radius.lg, paddingVertical: Spacing.md, alignItems: 'center',
  },
  summaryPillVal: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  summaryPillLabel: { fontSize: 10, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
});
