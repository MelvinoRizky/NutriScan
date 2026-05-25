import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';
import Svg, { Circle } from 'react-native-svg';
import { supabase } from '../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

const MEAL_CONFIG = [
  { key: 'breakfast', label: 'Sarapan',     icon: '🍳', ratio: 0.25, time: '07:00 - 09:00' },
  { key: 'lunch',     label: 'Makan Siang', icon: '☀️', ratio: 0.35, time: '12:00 - 14:00' },
  { key: 'snack',     label: 'Snack',       icon: '🍪', ratio: 0.15, time: 'Kapan saja' },
  { key: 'dinner',    label: 'Makan Malam', icon: '🌙', ratio: 0.25, time: '18:00 - 20:00' },
];

function getDateLabel() {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = new Date();
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function CalGauge({ current, target }) {
  const size = 190;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = target > 0 ? Math.min(current / target, 1) : 0;
  return (
    <View style={{ alignItems: 'center', marginVertical: Spacing.lg }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#E8F5E9" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={Colors.primary} strokeWidth={stroke} fill="none"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.gaugeCenter}>
        <Ionicons name="flame" size={20} color={Colors.accent} />
        <Text style={styles.gaugeNum}>{current.toLocaleString()}</Text>
        <Text style={styles.gaugeUnit}>/ {target.toLocaleString()} kcal</Text>
        <Text style={styles.gaugePct}>{Math.round(pct * 100)}% tercapai</Text>
      </View>
    </View>
  );
}

export default function TargetScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [targetCal, setTargetCal] = useState(2000);
  const [mealData, setMealData] = useState({ breakfast: 0, lunch: 0, snack: 0, dinner: 0 });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: profile } = await supabase
          .from('users')
          .select('target_calories')
          .eq('id', user.id)
          .single();
        if (profile?.target_calories) setTargetCal(profile.target_calories);

        const today = new Date().toISOString().split('T')[0];
        const { data: logs } = await supabase
          .from('food_logs')
          .select('calories, meal_type')
          .eq('user_id', user.id)
          .gte('logged_at', `${today}T00:00:00`)
          .lte('logged_at', `${today}T23:59:59`);

        if (logs) {
          const meals = { breakfast: 0, lunch: 0, snack: 0, dinner: 0 };
          logs.forEach(log => {
            if (meals[log.meal_type] !== undefined) {
              meals[log.meal_type] += (log.calories || 0);
            }
          });
          setMealData(meals);
        }
        setLoading(false);
      })();
    }, [])
  );

  const totalConsumed = Object.values(mealData).reduce((s, v) => s + v, 0);
  const remaining = Math.max(targetCal - totalConsumed, 0);

  const mealsWithData = MEAL_CONFIG.map(m => ({
    ...m,
    consumed: mealData[m.key],
    target: Math.round(targetCal * m.ratio),
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Target Hari Ini</Text>
          <Text style={styles.headerSub}>{getDateLabel()}</Text>
        </View>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Memuat data...</Text>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <CalGauge current={totalConsumed} target={targetCal} />
                <View style={styles.summaryRow}>
                  <View style={[styles.summaryBox, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={[styles.summaryNum, { color: Colors.primary }]}>{remaining}</Text>
                    <Text style={styles.summaryLabel}>Sisa Kalori</Text>
                  </View>
                  <View style={[styles.summaryBox, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={[styles.summaryNum, { color: Colors.accent }]}>{totalConsumed.toLocaleString()}</Text>
                    <Text style={styles.summaryLabel}>Terkonsumsi</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Rincian Waktu Makan</Text>

              {mealsWithData.map(meal => {
                const pct = meal.target > 0 ? Math.min((meal.consumed / meal.target) * 100, 100) : 0;
                const isOver = meal.consumed > meal.target && meal.target > 0;
                return (
                  <View key={meal.key} style={styles.mealCard}>
                    <View style={styles.mealTop}>
                      <Text style={styles.mealIcon}>{meal.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.mealLabel}>{meal.label}</Text>
                        <Text style={styles.mealTime}>{meal.time}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.mealCal, isOver && { color: Colors.accent }]}>
                          {meal.consumed}
                        </Text>
                        <Text style={styles.mealCalUnit}>kcal</Text>
                      </View>
                    </View>
                    <View style={styles.mealTrack}>
                      <View style={[styles.mealFill, {
                        width: `${pct}%`,
                        backgroundColor: isOver ? Colors.accent : Colors.primary,
                      }]} />
                    </View>
                    <Text style={styles.mealPctText}>
                      {Math.round(pct)}% dari target {meal.target} kcal
                    </Text>
                  </View>
                );
              })}

              <View style={styles.tipCard}>
                <Text style={styles.tipTitle}>📊 Tips Hari Ini</Text>
                <Text style={styles.tipBody}>
                  {remaining > 0
                    ? `Kamu masih punya ${remaining} kcal tersisa. Pilih makanan kaya protein dan sayuran untuk hasil optimal!`
                    : `Kamu sudah mencapai target kalori hari ini. Jaga konsistensi dan tetap aktif bergerak!`}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: '#16A34A',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  backText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '600' },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  content: { padding: Spacing.lg, marginTop: -Spacing.md },

  loadingWrap: { alignItems: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 12, fontSize: FontSize.sm, color: Colors.textMuted },

  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.md, marginBottom: Spacing.md },
  gaugeCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  gaugeNum: { fontSize: 40, fontWeight: '900', color: Colors.primary, marginTop: 2 },
  gaugeUnit: { fontSize: FontSize.sm, color: Colors.textMuted },
  gaugePct: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },

  summaryRow: { flexDirection: 'row', gap: 12, marginTop: Spacing.sm },
  summaryBox: { flex: 1, borderRadius: Radius.lg, paddingVertical: Spacing.md, alignItems: 'center' },
  summaryNum: { fontSize: FontSize.xl, fontWeight: '800' },
  summaryLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },

  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.sm },

  mealCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.sm },
  mealTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  mealIcon: { fontSize: 28 },
  mealLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  mealTime: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  mealCal: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  mealCalUnit: { fontSize: FontSize.xs, color: Colors.textMuted },
  mealTrack: { height: 6, backgroundColor: '#F3F4F6', borderRadius: Radius.full, overflow: 'hidden', marginBottom: 6 },
  mealFill: { height: '100%', borderRadius: Radius.full },
  mealPctText: { fontSize: FontSize.xs, color: Colors.textMuted },

  tipCard: {
    backgroundColor: Colors.accent, borderRadius: Radius.xl,
    padding: Spacing.lg, marginTop: Spacing.sm,
  },
  tipTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white, marginBottom: 8 },
  tipBody: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.9)', lineHeight: 22 },
});
