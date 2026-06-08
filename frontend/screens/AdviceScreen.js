import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow, Gradients } from '../components/theme';
import { supabase } from '../lib/supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Map kategori saran dari AI ke gaya kartu yang dipakai layar ini.
const CATEGORY_STYLE = {
  positif:   { badge: '✓ Bagus',     badgeColor: Colors.primary, badgeBg: '#E8F5E9', iconBg: '#E8F5E9', iconColor: Colors.primary, icon: 'checkmark-circle' },
  perhatian: { badge: '⚠ Perhatian', badgeColor: Colors.accent,  badgeBg: '#FFF3E0', iconBg: '#FFF3E0', iconColor: Colors.accent,  icon: 'alert-circle' },
  tips:      { badge: '💡 Tips',      badgeColor: Colors.primary, badgeBg: '#E8F5E9', iconBg: '#E8F5E9', iconColor: Colors.primary, icon: 'bulb' },
};

function mapAiAdvice(list) {
  return list.map((a) => {
    const s = CATEGORY_STYLE[a.category] || CATEGORY_STYLE.tips;
    return { title: a.title, body: a.body, time: 'Hari ini', ...s };
  });
}

function generateAdvice(todayCal, targetCal, todayProtein, targetProtein, todayCarbs, targetCarbs, todayFat, targetFat, hour) {
  const advice = [];

  // Kalori check
  if (todayCal > targetCal * 1.1) {
    advice.push({
      title: 'Kalori Berlebih Hari Ini',
      body: `Asupan kalori kamu (${todayCal} kcal) melebihi target (${targetCal} kcal). Coba imbangi dengan aktivitas fisik!`,
      badge: '⚠ Perhatian', badgeColor: Colors.accent, badgeBg: '#FFF3E0',
      iconBg: '#FFF3E0', iconColor: Colors.accent, icon: 'alert-circle', time: 'Hari ini',
    });
  } else if (todayCal < targetCal * 0.5 && hour >= 15) {
    advice.push({
      title: 'Asupan Kalori Kurang',
      body: `Asupan kamu baru ${todayCal} kcal dari target ${targetCal} kcal. Jangan skip makan ya!`,
      badge: '⚠ Perhatian', badgeColor: Colors.accent, badgeBg: '#FFF3E0',
      iconBg: '#FFF3E0', iconColor: Colors.accent, icon: 'alert-circle', time: 'Hari ini',
    });
  } else if (todayCal >= targetCal * 0.8 && todayCal <= targetCal * 1.1 && todayCal > 0) {
    advice.push({
      title: 'Target Kalori On Track! 🎯',
      body: `Kamu sudah makan ${todayCal} kcal (${Math.round(todayCal / targetCal * 100)}% dari target). Pertahankan!`,
      badge: '✓ Bagus', badgeColor: Colors.primary, badgeBg: '#E8F5E9',
      iconBg: '#E8F5E9', iconColor: Colors.primary, icon: 'checkmark-circle', time: 'Hari ini',
    });
  }

  // Protein check
  if (todayProtein < targetProtein * 0.5 && todayCal > 0) {
    advice.push({
      title: 'Protein Masih Kurang',
      body: `Asupan protein kamu baru ${Math.round(todayProtein)}g dari target ${targetProtein}g. Tambahkan telur, ayam, atau tahu tempe!`,
      badge: '⚠ Perhatian', badgeColor: Colors.accent, badgeBg: '#FFF3E0',
      iconBg: '#FFF3E0', iconColor: Colors.accent, icon: 'alert-circle', time: 'Hari ini',
    });
  } else if (todayProtein >= targetProtein * 0.8) {
    advice.push({
      title: 'Asupan Protein Bagus!',
      body: `Protein kamu sudah ${Math.round(todayProtein)}g dari target ${targetProtein}g. Keep it up!`,
      badge: '✓ Bagus', badgeColor: Colors.primary, badgeBg: '#E8F5E9',
      iconBg: '#E8F5E9', iconColor: Colors.primary, icon: 'checkmark-circle', time: 'Hari ini',
    });
  }

  // Lemak check
  if (todayFat > targetFat * 1.2) {
    advice.push({
      title: 'Lemak Terlalu Tinggi',
      body: `Asupan lemak kamu (${Math.round(todayFat)}g) melebihi target (${targetFat}g). Kurangi makanan berminyak atau gorengan!`,
      badge: '⚠ Perhatian', badgeColor: Colors.accent, badgeBg: '#FFF3E0',
      iconBg: '#FFF3E0', iconColor: Colors.accent, icon: 'alert-circle', time: 'Hari ini',
    });
  }

  // Carbs check
  if (todayCarbs > targetCarbs * 1.2) {
    advice.push({
      title: 'Karbohidrat Berlebih',
      body: `Karbohidrat kamu (${Math.round(todayCarbs)}g) melebihi target (${targetCarbs}g). Coba ganti nasi putih dengan nasi merah atau shirataki!`,
      badge: '⚠ Perhatian', badgeColor: Colors.accent, badgeBg: '#FFF3E0',
      iconBg: '#FFF3E0', iconColor: Colors.accent, icon: 'alert-circle', time: 'Hari ini',
    });
  }

  // Tips umum
  advice.push({
    title: 'Jaga Hidrasi Kamu',
    body: 'Minum air putih minimal 8 gelas per hari untuk membantu metabolisme dan menjaga energi!',
    badge: '💡 Tips', badgeColor: Colors.primary, badgeBg: '#E8F5E9',
    iconBg: '#E8F5E9', iconColor: Colors.primary, icon: 'water', time: 'Hari ini',
  });

  if (todayCal === 0) {
    advice.push({
      title: 'Mulai Catat Makananmu!',
      body: 'Scan makanan kamu sekarang untuk mendapatkan saran nutrisi yang lebih personal dari AI NutriScan!',
      badge: '💡 Tips', badgeColor: Colors.primary, badgeBg: '#E8F5E9',
      iconBg: '#E8F5E9', iconColor: Colors.primary, icon: 'scan', time: 'Hari ini',
    });
  }

  return advice;
}

export default function AdviceScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [adviceList, setAdviceList] = useState([]);
  const [aiPowered, setAiPowered] = useState(false);
  const [summary, setSummary] = useState({ total: 0, positif: 0, peringatan: 0, tips: 0 });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      // 1) Coba saran dari AI (selalu sesuai kondisi user terkini)
      try {
        const resp = await fetch(`${API_URL}/advice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });
        const json = await resp.json();
        if (resp.ok && json.success && Array.isArray(json.advice) && json.advice.length) {
          setAdviceList(mapAiAdvice(json.advice));
          setSummary({
            total: json.summary?.total ?? json.advice.length,
            positif: json.summary?.positif ?? 0,
            peringatan: json.summary?.perhatian ?? 0,
            tips: json.summary?.tips ?? 0,
          });
          setAiPowered(true);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.log('[ADVICE] AI tidak tersedia, pakai aturan lokal:', e.message);
      }

      // 2) Fallback: saran berbasis aturan (offline / API belum dikonfigurasi)
      const { data: profile } = await supabase
        .from('users')
        .select('target_calories, target_protein, target_carbs, target_fat')
        .eq('id', user.id)
        .single();

      const targetCal = profile?.target_calories || 2000;
      const targetProtein = profile?.target_protein || 80;
      const targetCarbs = profile?.target_carbs || 250;
      const targetFat = profile?.target_fat || 65;

      const today = new Date().toISOString().split('T')[0];
      const { data: todayLogs } = await supabase
        .from('food_logs')
        .select('calories, protein, carbs, fat')
        .eq('user_id', user.id)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`);

      const todayCal = (todayLogs || []).reduce((s, l) => s + (l.calories || 0), 0);
      const todayProtein = (todayLogs || []).reduce((s, l) => s + (l.protein || 0), 0);
      const todayCarbs = (todayLogs || []).reduce((s, l) => s + (l.carbs || 0), 0);
      const todayFat = (todayLogs || []).reduce((s, l) => s + (l.fat || 0), 0);

      const hour = new Date().getHours();
      const generated = generateAdvice(todayCal, targetCal, todayProtein, targetProtein, todayCarbs, targetCarbs, todayFat, targetFat, hour);

      const positif = generated.filter(a => a.badge.includes('Bagus')).length;
      const peringatan = generated.filter(a => a.badge.includes('Perhatian')).length;
      const tips = generated.filter(a => a.badge.includes('Tips')).length;

      setSummary({ total: generated.length, positif, peringatan, tips });
      setAdviceList(generated);
      setAiPowered(false);
      setLoading(false);
    })();
  }, []);

  return (
    <View style={styles.safe}>
      <StatusBar style="light" />
      <LinearGradient colors={Gradients.accent} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <SafeAreaView edges={['top']}>
          <TouchableOpacity style={styles.backRow} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color={Colors.white} />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Semua Saran AI</Text>
          <Text style={styles.headerSub}>
            {aiPowered ? '✨ Dibuat oleh AI sesuai kondisimu' : 'Rekomendasi berdasarkan data nutrisimu'}
          </Text>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={Colors.accent} />
            <Text style={styles.loadingText}>Menganalisis data nutrisimu...</Text>
          </View>
        ) : (
          <>
            <View style={styles.ringkasCard}>
              <View style={styles.ringkasTop}>
                <View style={styles.ringkasIconWrap}>
                  <Ionicons name="bulb" size={22} color={Colors.white} />
                </View>
                <View>
                  <Text style={styles.ringkasTitle}>Ringkasan Hari Ini</Text>
                  <Text style={styles.ringkasSub}>{summary.total} saran untuk kamu</Text>
                </View>
              </View>
              <View style={styles.ringkasRow}>
                <View style={[styles.ringkasPill, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.ringkasPillNum, { color: Colors.primary }]}>{summary.positif}</Text>
                  <Text style={styles.ringkasPillLabel}>Positif</Text>
                </View>
                <View style={[styles.ringkasPill, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={[styles.ringkasPillNum, { color: Colors.accent }]}>{summary.peringatan}</Text>
                  <Text style={styles.ringkasPillLabel}>Perhatian</Text>
                </View>
                <View style={[styles.ringkasPill, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.ringkasPillNum, { color: Colors.primary }]}>{summary.tips}</Text>
                  <Text style={styles.ringkasPillLabel}>Tips</Text>
                </View>
              </View>
            </View>

            {adviceList.map((item, i) => (
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
          </>
        )}
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

  loadingWrap: { alignItems: 'center', paddingVertical: 60 },
  loadingText: { marginTop: 12, fontSize: FontSize.sm, color: Colors.textMuted },

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
});
