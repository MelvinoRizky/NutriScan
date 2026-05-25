import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { supabase } from '../lib/supabase';

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const SHORT_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function buildLast7Days(targetCal) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      day: DAY_NAMES[d.getDay()],
      short: SHORT_NAMES[d.getDay()],
      displayDate: `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`,
      target: targetCal,
      val: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
  }
  return days;
}

function WeeklyBarChart({ data, targetCal }) {
  const maxVal = Math.max(...data.map(d => d.val), targetCal * 1.2, 100);
  const barW = 26;
  const chartH = 140;
  const chartW = 310;
  const gap = (chartW - barW * data.length) / (data.length + 1);
  const targetY = chartH - (targetCal / maxVal) * chartH;

  return (
    <View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Aktual</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.accent }]} />
          <Text style={styles.legendText}>Over target</Text>
        </View>
      </View>

      <Svg width={chartW} height={chartH + 28}>
        {/* Target line */}
        <Line x1={0} y1={targetY} x2={chartW} y2={targetY} stroke="#D1D5DB" strokeWidth={1} strokeDasharray="5,5" />

        {data.map((d, i) => {
          const x = gap + i * (barW + gap);
          const barH = d.val > 0 ? Math.max((d.val / maxVal) * chartH, 4) : 0;
          const y = chartH - barH;
          const isOver = d.val > d.target && d.val > 0;
          return (
            <React.Fragment key={d.short}>
              <Rect
                x={x} y={y} width={barW} height={barH} rx={5}
                fill={isOver ? Colors.accent : Colors.primary}
                opacity={d.val > 0 ? 0.85 : 0.2}
              />
              <SvgText x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize={9} fill={Colors.textMuted}>{d.short}</SvgText>
              {d.val > 0 && (
                <SvgText x={x + barW / 2} y={chartH + 24} textAnchor="middle" fontSize={8} fill={Colors.textMuted}>
                  {d.val > 999 ? (d.val / 1000).toFixed(1) + 'k' : d.val}
                </SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

export default function WeeklyScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [weeklyData, setWeeklyData] = useState([]);
  const [targetCal, setTargetCal] = useState(2000);
  const [dateRangeLabel, setDateRangeLabel] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from('users')
        .select('target_calories')
        .eq('id', user.id)
        .single();
      const cal = profile?.target_calories || 2000;
      setTargetCal(cal);

      const days = buildLast7Days(cal);

      // Build date range label
      const first = days[0];
      const last = days[days.length - 1];
      setDateRangeLabel(`${first.displayDate} - ${last.displayDate} ${new Date().getFullYear()}`);

      const startDate = days[0].date;
      const { data: logs } = await supabase
        .from('food_logs')
        .select('calories, protein, carbs, fat, logged_at')
        .eq('user_id', user.id)
        .gte('logged_at', `${startDate}T00:00:00`)
        .order('logged_at');

      if (logs) {
        logs.forEach(log => {
          const logDate = log.logged_at?.split('T')[0];
          const dayData = days.find(d => d.date === logDate);
          if (dayData) {
            dayData.val += (log.calories || 0);
            dayData.protein += (log.protein || 0);
            dayData.carbs += (log.carbs || 0);
            dayData.fat += (log.fat || 0);
          }
        });
      }

      setWeeklyData(days);
      setLoading(false);
    })();
  }, []);

  const activeDays = weeklyData.filter(d => d.val > 0).length;
  const avgCal = activeDays > 0
    ? Math.round(weeklyData.reduce((s, d) => s + d.val, 0) / activeDays)
    : 0;
  const consistency = weeklyData.length > 0
    ? Math.round((weeklyData.filter(d => d.val >= d.target * 0.8 && d.val > 0).length / 7) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
            <Text style={styles.backLinkText}>Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tren Mingguan</Text>
          <Text style={styles.headerSub}>{dateRangeLabel}</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryVal}>{avgCal > 0 ? avgCal.toLocaleString() : '-'}</Text>
              <Text style={styles.summaryLabel}>Rata-rata</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryVal}>{activeDays}/7</Text>
              <Text style={styles.summaryLabel}>Hari Aktif</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryVal}>{consistency}%</Text>
              <Text style={styles.summaryLabel}>Konsisten</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Memuat data minggu ini...</Text>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Grafik Kalori</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <WeeklyBarChart data={weeklyData} targetCal={targetCal} />
                </ScrollView>
              </View>

              <Text style={styles.sectionTitle}>Detail Harian</Text>
              {weeklyData.map(d => {
                const exceeded = d.val > d.target && d.val > 0;
                const diff = d.val - d.target;
                return (
                  <View key={d.day} style={[styles.dayCard, exceeded && styles.dayCardExceeded]}>
                    <View style={styles.dayTop}>
                      <View>
                        <Text style={styles.dayName}>{d.day}</Text>
                        <Text style={styles.dayDate}>{d.displayDate}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[styles.dayVal, exceeded && { color: Colors.accent }]}>
                          {d.val > 0 ? d.val.toLocaleString() : '-'}
                        </Text>
                        <Text style={styles.dayTarget}>/ {d.target.toLocaleString()} kcal</Text>
                      </View>
                    </View>
                    {d.val > 0 && (
                      <View style={styles.macroRow}>
                        <View style={[styles.macroPill, { backgroundColor: '#FFF3E0' }]}>
                          <Text style={[styles.macroPillVal, { color: Colors.accent }]}>{Math.round(d.protein)}g</Text>
                          <Text style={styles.macroPillLabel}>Protein</Text>
                        </View>
                        <View style={[styles.macroPill, { backgroundColor: '#E8F5E9' }]}>
                          <Text style={[styles.macroPillVal, { color: Colors.primary }]}>{Math.round(d.carbs)}g</Text>
                          <Text style={styles.macroPillLabel}>Carbs</Text>
                        </View>
                        <View style={[styles.macroPill, { backgroundColor: '#FFF3E0' }]}>
                          <Text style={[styles.macroPillVal, { color: Colors.accent }]}>{Math.round(d.fat)}g</Text>
                          <Text style={styles.macroPillLabel}>Fat</Text>
                        </View>
                      </View>
                    )}
                    {d.val === 0 && (
                      <Text style={styles.noDataText}>Tidak ada data makan hari ini</Text>
                    )}
                    {exceeded && (
                      <Text style={styles.exceededText}>🔥 Melebihi target {diff} kcal</Text>
                    )}
                  </View>
                );
              })}
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
  loadingWrap: { alignItems: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 12, fontSize: FontSize.sm, color: Colors.textMuted },

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

  noDataText: { fontSize: FontSize.xs, color: Colors.textMuted, fontStyle: 'italic' },
  exceededText: { fontSize: FontSize.xs, color: Colors.accent, marginTop: Spacing.sm, fontWeight: '600' },
});
