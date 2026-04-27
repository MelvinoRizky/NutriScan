import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';
import Svg, { Rect, Line, Text as SvgText, Circle } from 'react-native-svg';

const WEEKLY_DATA = [
  { day: 'Senin', short: 'Sen', date: '10 Mar', val: 1850, target: 2000, protein: '77g', carbs: '210g', fat: '55g' },
  { day: 'Selasa', short: 'Sel', date: '11 Mar', val: 1650, target: 2000, protein: '65g', carbs: '185g', fat: '48g' },
  { day: 'Rabu', short: 'Rab', date: '12 Mar', val: 2100, target: 2000, protein: '85g', carbs: '245g', fat: '62g' },
  { day: 'Kamis', short: 'Kam', date: '13 Mar', val: 1900, target: 2000, protein: '75g', carbs: '220g', fat: '52g' },
  { day: 'Jumat', short: 'Jum', date: '14 Mar', val: 1700, target: 2000, protein: '68g', carbs: '195g', fat: '50g' },
  { day: 'Sabtu', short: 'Sab', date: '15 Mar', val: 2050, target: 2000, protein: '80g', carbs: '235g', fat: '60g' },
  { day: 'Minggu', short: 'Min', date: '16 Mar', val: 2200, target: 2000, protein: '88g', carbs: '255g', fat: '65g' },
];

const AVG_CAL = Math.round(WEEKLY_DATA.reduce((a, d) => a + d.val, 0) / WEEKLY_DATA.length);
const DAYS_ACTIVE = WEEKLY_DATA.filter(d => d.val > 0).length;
const CONSISTENCY = Math.round((WEEKLY_DATA.filter(d => d.val >= d.target * 0.8).length / 7) * 100);

function WeeklyBarChart() {
  const maxVal = 2500;
  const barW = 26;
  const chartH = 140;
  const chartW = 310;
  const gap = (chartW - barW * WEEKLY_DATA.length) / (WEEKLY_DATA.length + 1);
  const targetY = chartH - (2000 / maxVal) * chartH;

  return (
    <View>
      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Aktual</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.textMuted }]} />
          <Text style={styles.legendText}>Target</Text>
        </View>
      </View>

      <Svg width={chartW} height={chartH + 28}>
        {/* Target line */}
        <Line x1={0} y1={targetY} x2={chartW} y2={targetY} stroke="#D1D5DB" strokeWidth={1} strokeDasharray="5,5" />

        {WEEKLY_DATA.map((d, i) => {
          const x = gap + i * (barW + gap);
          const barH = (d.val / maxVal) * chartH;
          const y = chartH - barH;
          return (
            <React.Fragment key={d.short}>
              <Rect x={x} y={y} width={barW} height={barH} rx={5}
                fill={d.val > d.target ? Colors.primary : Colors.primary}
                opacity={0.85}
              />
              <SvgText x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize={9} fill={Colors.textMuted}>{d.short}</SvgText>
              <SvgText x={x + barW / 2} y={chartH + 24} textAnchor="middle" fontSize={8} fill={Colors.textMuted}>{d.val > 999 ? (d.val / 1000).toFixed(1) + 'k' : d.val}</SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

export default function WeeklyScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
            <Text style={styles.backLinkText}>Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tren Mingguan</Text>
          <Text style={styles.headerSub}>10 - 16 Maret 2026</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryVal}>{AVG_CAL.toLocaleString()}</Text>
              <Text style={styles.summaryLabel}>Rata-rata</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryVal}>{DAYS_ACTIVE}/7</Text>
              <Text style={styles.summaryLabel}>Hari Aktif</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryVal}>{CONSISTENCY}%</Text>
              <Text style={styles.summaryLabel}>Konsisten</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Grafik Kalori</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <WeeklyBarChart />
            </ScrollView>
          </View>

          <Text style={styles.sectionTitle}>Detail Harian</Text>
          {WEEKLY_DATA.map(d => {
            const exceeded = d.val > d.target;
            const diff = d.val - d.target;
            return (
              <View key={d.day} style={[styles.dayCard, exceeded && styles.dayCardExceeded]}>
                <View style={styles.dayTop}>
                  <View>
                    <Text style={styles.dayName}>{d.day}</Text>
                    <Text style={styles.dayDate}>{d.date}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.dayVal, exceeded && { color: Colors.accent }]}>{d.val.toLocaleString()}</Text>
                    <Text style={styles.dayTarget}>/ {d.target.toLocaleString()} kcal</Text>
                  </View>
                </View>
                <View style={styles.macroRow}>
                  <View style={[styles.macroPill, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={[styles.macroPillVal, { color: Colors.accent }]}>{d.protein}</Text>
                    <Text style={styles.macroPillLabel}>Protein</Text>
                  </View>
                  <View style={[styles.macroPill, { backgroundColor: '#E8F5E9' }]}>
                    <Text style={[styles.macroPillVal, { color: Colors.primary }]}>{d.carbs}</Text>
                    <Text style={styles.macroPillLabel}>Carbs</Text>
                  </View>
                  <View style={[styles.macroPill, { backgroundColor: '#FFF3E0' }]}>
                    <Text style={[styles.macroPillVal, { color: Colors.accent }]}>{d.fat}</Text>
                    <Text style={styles.macroPillLabel}>Fat</Text>
                  </View>
                </View>
                {exceeded && (
                  <Text style={styles.exceededText}>🔥 Melebihi target {diff} kcal</Text>
                )}
              </View>
            );
          })}
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
    paddingBottom: Spacing.lg,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  backLinkText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '600' },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4, marginBottom: Spacing.md },

  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: Radius.lg,
    paddingVertical: Spacing.md, alignItems: 'center',
  },
  summaryVal: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  summaryLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4 },

  content: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.md },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },

  legendRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: Spacing.md, marginBottom: Spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: FontSize.xs, color: Colors.textMuted },

  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },

  dayCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.sm,
  },
  dayCardExceeded: { backgroundColor: '#FFF8F0' },
  dayTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  dayName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  dayDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  dayVal: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.textPrimary },
  dayTarget: { fontSize: FontSize.xs, color: Colors.textMuted },

  macroRow: { flexDirection: 'row', gap: 8 },
  macroPill: { flex: 1, borderRadius: Radius.md, paddingVertical: 8, alignItems: 'center' },
  macroPillVal: { fontSize: FontSize.sm, fontWeight: '700' },
  macroPillLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },

  exceededText: { fontSize: FontSize.xs, color: Colors.accent, marginTop: Spacing.sm, fontWeight: '600' },
});
