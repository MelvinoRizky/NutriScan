import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';

const SUMMARY = { total: 7, positif: 3, peringatan: 3, tips: 1 };

const ADVICE_DATA = [
  {
    title: 'Pola Makan Baik',
    body: 'Pola makanmu sudah cukup baik minggu ini. Pertahankan konsistensimu!',
    badge: '✓ Bagus',
    badgeColor: Colors.primary,
    badgeBg: '#E8F5E9',
    iconBg: '#E8F5E9',
    iconColor: Colors.primary,
    icon: 'checkmark-circle',
    time: 'Hari ini',
  },
  {
    title: 'Protein Pagi Hari',
    body: 'Tingkatkan asupan protein di pagi hari untuk metabolisme lebih baik.',
    badge: '⚠ Perhatian',
    badgeColor: Colors.accent,
    badgeBg: '#FFF3E0',
    iconBg: '#FFF3E0',
    iconColor: Colors.accent,
    icon: 'alert-circle',
    time: 'Hari ini',
  },
  {
    title: 'Makanan Berminyak',
    body: 'Kurangi makanan berminyak saat malam untuk pencernaan lebih baik.',
    badge: '⚠ Perhatian',
    badgeColor: Colors.accent,
    badgeBg: '#FFF3E0',
    iconBg: '#FFF3E0',
    iconColor: Colors.accent,
    icon: 'alert-circle',
    time: 'Kemarin',
  },
  {
    title: 'Hidrasi',
    body: 'Jangan lupa minum air putih minimal 8 gelas per hari.',
    badge: '💡 Tips',
    badgeColor: Colors.primary,
    badgeBg: '#E8F5E9',
    iconBg: '#E8F5E9',
    iconColor: Colors.primary,
    icon: 'water',
    time: 'Kemarin',
  },
  {
    title: 'Target Tercapai',
    body: 'Selamat! Kamu mencapai target kalori 6 dari 7 hari minggu ini.',
    badge: '✓ Bagus',
    badgeColor: Colors.primary,
    badgeBg: '#E8F5E9',
    iconBg: '#E8F5E9',
    iconColor: Colors.primary,
    icon: 'checkmark-circle',
    time: '2 hari lalu',
  },
  {
    title: 'Karbohidrat Tinggi',
    body: 'Asupan karbohidrat kamu melebihi target. Coba kurangi nasi putih.',
    badge: '⚠ Perhatian',
    badgeColor: Colors.accent,
    badgeBg: '#FFF3E0',
    iconBg: '#FFF3E0',
    iconColor: Colors.accent,
    icon: 'alert-circle',
    time: '3 hari lalu',
  },
  {
    title: 'Variasi Makanan',
    body: 'Tambah variasi sayuran untuk mendapat nutrisi lebih lengkap.',
    badge: '💡 Tips',
    badgeColor: Colors.primary,
    badgeBg: '#E8F5E9',
    iconBg: '#E8F5E9',
    iconColor: Colors.primary,
    icon: 'leaf',
    time: '4 hari lalu',
  },
];

export default function AdviceScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={Colors.white} />
          <Text style={styles.backText}>Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Semua Saran AI</Text>
        <Text style={styles.headerSub}>Rekomendasi untuk hidup lebih sehat</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.ringkasCard}>
          <View style={styles.ringkasTop}>
            <View style={styles.ringkasIconWrap}>
              <Ionicons name="bulb" size={22} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.ringkasTitle}>Ringkasan Minggu Ini</Text>
              <Text style={styles.ringkasSub}>{SUMMARY.total} saran untuk kamu</Text>
            </View>
          </View>
          <View style={styles.ringkasRow}>
            <View style={[styles.ringkasPill, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.ringkasPillNum, { color: Colors.primary }]}>{SUMMARY.positif}</Text>
              <Text style={styles.ringkasPillLabel}>Positif</Text>
            </View>
            <View style={[styles.ringkasPill, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.ringkasPillNum, { color: Colors.accent }]}>{SUMMARY.peringatan}</Text>
              <Text style={styles.ringkasPillLabel}>Peringatan</Text>
            </View>
            <View style={[styles.ringkasPill, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.ringkasPillNum, { color: Colors.primary }]}>{SUMMARY.tips}</Text>
              <Text style={styles.ringkasPillLabel}>Tips</Text>
            </View>
          </View>
        </View>

        {ADVICE_DATA.map((item, i) => (
          <View key={i} style={styles.adviceCard}>
            <View style={styles.adviceTop}>
              <View style={[styles.adviceIcon, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.icon} size={22} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.adviceTitle}>{item.title}</Text>
                <Text style={styles.adviceBody}>{item.body}</Text>
                <View style={[styles.adviceBadge, { backgroundColor: item.badgeBg }]}>
                  <Text style={[styles.adviceBadgeText, { color: item.badgeColor }]}>{item.badge}</Text>
                </View>
              </View>
              <Text style={styles.adviceTime}>{item.time}</Text>
            </View>
          </View>
        ))}

        {/* Muat Saran Lama */}
        <TouchableOpacity style={styles.loadMore}>
          <Text style={styles.loadMoreText}>Muat Saran Lama</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm },
  backText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '600' },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

  ringkasCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.lg, ...Shadow.md, marginBottom: Spacing.md,
    marginTop: -Spacing.md,
  },
  ringkasTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  ringkasIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  ringkasTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  ringkasSub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  ringkasRow: { flexDirection: 'row', gap: 8 },
  ringkasPill: { flex: 1, borderRadius: Radius.lg, paddingVertical: Spacing.md, alignItems: 'center' },
  ringkasPillNum: { fontSize: FontSize.xl, fontWeight: '800' },
  ringkasPillLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },

  adviceCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.sm,
  },
  adviceTop: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start' },
  adviceIcon: { width: 44, height: 44, borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center' },
  adviceTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  adviceBody: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  adviceBadge: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  adviceBadgeText: { fontSize: FontSize.xs, fontWeight: '700' },
  adviceTime: { fontSize: FontSize.xs, color: Colors.textMuted },

  loadMore: {
    backgroundColor: Colors.accent, borderRadius: Radius.full,
    paddingVertical: Spacing.md, alignItems: 'center', marginTop: Spacing.sm,
  },
  loadMoreText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },
});
