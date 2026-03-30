import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';
import Svg, { Circle, Rect, Text as SvgText, Path, G, ClipPath, Defs } from 'react-native-svg';

// Chicken icon from chicken.svg (stroke-based, white)
function IconChicken({ size = 22 }) {
  const scale = size / 20;
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Defs>
        <ClipPath id="clip_chicken">
          <Path d="M0 0H19.9853V19.9853H0Z" fill="white" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip_chicken)">
        <Path
          d="M12.824 13.0155C11.5777 13.4153 10.3413 13.425 9.29682 13.0431C8.25234 12.6612 7.4549 11.9078 7.02188 10.8939C6.58885 9.88005 6.5431 8.65915 6.89137 7.41094C7.23964 6.16272 7.96352 4.95312 8.95649 3.96016C9.94946 2.96719 11.1591 2.2433 12.4073 1.89503C13.6555 1.54677 14.8764 1.59251 15.8903 2.02554C16.9042 2.45857 17.6575 3.256 18.0394 4.30049C18.4214 5.34497 18.4117 6.58133 18.0118 7.82762C17.4332 7.49758 16.6997 7.41548 15.9345 7.59514C15.1694 7.7748 14.4193 8.20525 13.8104 8.8141C13.2016 9.42294 12.7711 10.173 12.5915 10.9382C12.4118 11.7034 12.4939 12.4369 12.824 13.0155Z"
          stroke="white" strokeWidth="1.66545" strokeLinecap="round" strokeLinejoin="round"
        />
        <Path
          d="M6.90331 10.584L4.73823 12.7491C4.47381 12.6034 4.18087 12.517 3.87971 12.4958C3.57856 12.4746 3.27641 12.5192 2.9942 12.6264C2.71199 12.7336 2.45648 12.901 2.24539 13.1168C2.0343 13.3326 1.87267 13.5918 1.77171 13.8763C1.67075 14.1608 1.63288 14.4639 1.66073 14.7645C1.68857 15.0651 1.78147 15.356 1.93297 15.6172C2.08446 15.8783 2.29094 16.1033 2.53809 16.2767C2.78524 16.4501 3.06713 16.5677 3.36424 16.6212C3.42254 16.9145 3.54331 17.1917 3.71835 17.4341C3.89339 17.6765 4.11858 17.8783 4.3786 18.0259C4.63863 18.1734 4.92739 18.2632 5.22523 18.2892C5.52308 18.3152 5.82303 18.2767 6.10467 18.1764C6.38631 18.076 6.64304 17.9162 6.85738 17.7078C7.07173 17.4994 7.23867 17.2472 7.34685 16.9685C7.45502 16.6898 7.50189 16.391 7.48427 16.0926C7.46665 15.7941 7.38494 15.503 7.24472 15.2389L9.40147 13.0822"
          stroke="white" strokeWidth="1.66545" strokeLinecap="round" strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

// Apple icon — pakai Image dari assets
function IconApple({ size = 24 }) {
  return (
    <Image
      source={require('../assets/apple.png')}
      style={{ width: size, height: size, tintColor: '#fff' }}
      resizeMode="contain"
    />
  );
}

// Droplet icon — SVG path
function IconDroplet({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2L7 9C5 12 5 15 7.5 17.5C9 19 10.5 20 12 20C13.5 20 15 19 16.5 17.5C19 15 19 12 17 9L12 2Z"
        fill="white"
      />
    </Svg>
  );
}

// mock data
const TODAY_CALS = 1450;
const TARGET_CALS = 2000;
const REMAINING = TARGET_CALS - TODAY_CALS;
const PROGRESS_PCT = Math.round((TODAY_CALS / TARGET_CALS) * 100);

function CalGauge({ current, target }) {
  const size = 180;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(current / target, 1);
  const progress = circ * (1 - pct);

  return (
    <View style={{ alignItems: 'center', marginVertical: Spacing.md }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#E8F5E9" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={Colors.primary} strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circ} ${circ}`}
          strokeDashoffset={progress}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.gaugeCenter} pointerEvents="none">
        <Text style={styles.gaugeCalNum}>{current.toLocaleString()}</Text>
        <Text style={styles.gaugeCalSub}>/ {target.toLocaleString()} kcal</Text>
      </View>
    </View>
  );
}

function MiniBarChart() {
  const data = [
    { day: 'Sen', val: 1820 },
    { day: 'Sel', val: 1650 },
    { day: 'Rab', val: 2100 },
    { day: 'Kam', val: 1900 },
    { day: 'Jum', val: 1750 },
    { day: 'Sab', val: 1610 },
    { day: 'Min', val: 1450 },
  ];
  const maxVal = 2200;
  const barW = 22;
  const chartH = 80;
  const chartW = 300;
  const gap = (chartW - barW * data.length) / (data.length + 1);

  return (
    <Svg width={chartW} height={chartH + 22}>
      {data.map((d, i) => {
        const x = gap + i * (barW + gap);
        const barH = (d.val / maxVal) * chartH;
        const y = chartH - barH;
        return (
          <React.Fragment key={d.day}>
            <Rect x={x} y={y} width={barW} height={barH} rx={4} fill={d.val > 2000 ? Colors.accent : Colors.primary} opacity={0.85} />
            <SvgText x={x + barW / 2} y={chartH + 14} textAnchor="middle" fontSize={10} fill={Colors.textMuted} fontWeight="500">{d.day}</SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function getDate() {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = new Date();
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Green header – NutriScan branding */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandName}>NutriScan</Text>
              <Text style={styles.brandEmoji}>🥗</Text>
            </View>
            <Text style={styles.greeting}>Hai, User! 👋</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Ionicons name="person" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Quick stats pills */}
        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: '#1B8A3E' }]}>
            <Text style={styles.statValue}>1,450</Text>
            <Text style={styles.statLabel}>Kalori</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: '#1B8A3E' }]}>
            <Text style={styles.statValue}>65g</Text>
            <Text style={styles.statLabel}>Protein</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: '#1B8A3E' }]}>
            <Text style={styles.statValue}>72%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Target Hari Ini */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Target Hari Ini</Text>
                <Text style={styles.cardDate}>{getDate()}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Target')}>
                <Ionicons name="trending-up" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <CalGauge current={TODAY_CALS} target={TARGET_CALS} />
            {/* Sisa Kalori bar */}
            <View style={styles.sisaRow}>
              <Text style={styles.sisaLabel}>Sisa Kalori</Text>
              <Text style={styles.sisaValue}>{REMAINING} kcal</Text>
            </View>
            <View style={styles.sisaTrack}>
              <View style={[styles.sisaFill, { width: `${PROGRESS_PCT}%` }]} />
            </View>
          </View>

          {/* Nutrisi Hari Ini */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Nutrisi Hari Ini</Text>
            <View style={styles.macroSection}>

              {/* Protein */}
              <View style={styles.macroItem}>
                <View style={styles.macroTop}>
                  <View style={[styles.macroIconBox, { backgroundColor: Colors.accent }]}>
                    <IconChicken size={22} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.macroHeader}>
                      <View>
                        <Text style={styles.macroLabel}>Protein</Text>
                        <Text style={styles.macroValues}>65g / 80g</Text>
                      </View>
                      <Text style={[styles.macroPct, { color: Colors.accent }]}>81%</Text>
                    </View>
                    <View style={styles.macroTrack}>
                      <View style={[styles.macroFill, { width: '81%', backgroundColor: Colors.accent }]} />
                    </View>
                  </View>
                </View>
              </View>

              {/* Karbohidrat */}
              <View style={styles.macroItem}>
                <View style={styles.macroTop}>
                  <View style={[styles.macroIconBox, { backgroundColor: Colors.primary }]}>
                    <IconApple size={24} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.macroHeader}>
                      <View>
                        <Text style={styles.macroLabel}>Karbohidrat</Text>
                        <Text style={styles.macroValues}>180g / 250g</Text>
                      </View>
                      <Text style={[styles.macroPct, { color: Colors.accent }]}>72%</Text>
                    </View>
                    <View style={styles.macroTrack}>
                      <View style={[styles.macroFill, { width: '72%', backgroundColor: Colors.accent }]} />
                    </View>
                  </View>
                </View>
              </View>

              {/* Lemak */}
              <View style={[styles.macroItem, { marginBottom: 0 }]}>
                <View style={styles.macroTop}>
                  <View style={[styles.macroIconBox, { backgroundColor: Colors.accent }]}>
                    <IconDroplet size={24} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.macroHeader}>
                      <View>
                        <Text style={styles.macroLabel}>Lemak</Text>
                        <Text style={styles.macroValues}>48g / 65g</Text>
                      </View>
                      <Text style={[styles.macroPct, { color: Colors.accent }]}>74%</Text>
                    </View>
                    <View style={styles.macroTrack}>
                      <View style={[styles.macroFill, { width: '74%', backgroundColor: Colors.accent }]} />
                    </View>
                  </View>
                </View>
              </View>

            </View>
          </View>

          {/* Saran AI */}
          <TouchableOpacity style={styles.adviceCard} onPress={() => navigation.navigate('Advice')}>
            <View style={styles.adviceIconWrap}>
              <Ionicons name="bulb" size={22} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.adviceTitle}>Saran AI Untukmu</Text>
              <Text style={styles.adviceBody}>
                "Asupan lemakmu hari ini sudah tinggi, kurangi gorengan untuk makan malam ya!"
              </Text>
            </View>
          </TouchableOpacity>

          {/* Tren Mingguan */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Tren Mingguan</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Weekly')}>
                <Text style={styles.seeAll}>Lihat Detail</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <MiniBarChart />
            </ScrollView>
          </View>
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
    paddingTop: Spacing.sm,
    paddingBottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandEmoji: { fontSize: 22 },
  brandName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  greeting: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
  avatarBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginTop: -28,
    gap: 10,
    marginBottom: Spacing.md,
  },
  statPill: {
    flex: 1, borderRadius: Radius.lg,
    paddingVertical: 12, alignItems: 'center',
  },
  statValue: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  statLabel: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  content: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  cardDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  seeAll: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: '600' },

  gaugeCenter: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  gaugeCalNum: { fontSize: 38, fontWeight: '900', color: Colors.primary },
  gaugeCalSub: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },

  sisaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.sm },
  sisaLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  sisaValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary },
  sisaTrack: { height: 10, backgroundColor: '#E8F5E9', borderRadius: Radius.full, overflow: 'hidden', marginTop: 6 },
  sisaFill: { height: '100%', borderRadius: Radius.full, backgroundColor: Colors.primary },

  macroSection: { marginTop: Spacing.md },
  macroItem: { marginBottom: Spacing.md },
  macroTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md },
  macroIconBox: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  macroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  macroLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  macroValues: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  macroPct: { fontSize: FontSize.lg, fontWeight: '800' },
  macroTrack: { height: 8, backgroundColor: '#F3F4F6', borderRadius: Radius.full, overflow: 'hidden' },
  macroFill: { height: '100%', borderRadius: Radius.full },

  adviceCard: {
    backgroundColor: Colors.accent, borderRadius: Radius.xl,
    padding: Spacing.lg, flexDirection: 'row', alignItems: 'flex-start',
    gap: Spacing.md, marginBottom: Spacing.md,
  },
  adviceIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)', justifyContent: 'center', alignItems: 'center',
  },
  adviceTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  adviceBody: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.9)', lineHeight: 18, fontStyle: 'italic' },
});
