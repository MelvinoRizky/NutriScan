import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';
import Svg, { Path, G, ClipPath, Defs } from 'react-native-svg';

function IconChicken({ size = 22 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Defs>
        <ClipPath id="clip_fd_chicken">
          <Path d="M0 0H19.9853V19.9853H0Z" fill="white" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#clip_fd_chicken)">
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

function IconApple({ size = 24 }) {
  return (
    <Image
      source={require('../assets/apple.png')}
      style={{ width: size, height: size, tintColor: '#fff' }}
      resizeMode="contain"
    />
  );
}

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

const MEAL_LABEL = { breakfast: 'Sarapan', lunch: 'Makan Siang', snack: 'Snack', dinner: 'Makan Malam' };

export default function FoodDetailScreen({ navigation, route }) {
  const log = route?.params?.log || {
    food_name: 'Nasi Goreng', meal_type: 'lunch', calories: 450,
    protein: 12, carbs: 58, fat: 18, ai_confidence: 94,
    logged_at: new Date().toISOString(), location: 'Kantin Kampus',
  };
  const timeStr = log.logged_at
    ? new Date(log.logged_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : '-';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageArea}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
          {log.image_url ? (
            <Image
              source={{ uri: log.image_url }}
              style={{ width: '100%', height: '100%', position: 'absolute' }}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.foodImagePlaceholder}>[FOOD IMAGE]</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{log.food_name}</Text>
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.metaText}>{timeStr}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                <Text style={styles.metaText}>{log.location || '-'}</Text>
              </View>
            </View>
            <View style={styles.calBadge}>
              <Text style={styles.calNum}>{log.calories || 0}</Text>
              <Text style={styles.calUnit}>kalori</Text>
            </View>
          </View>

          {/* Badges */}
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.badgeText, { color: Colors.primary }]}>AI Detected: {log.ai_confidence || 0}%</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.badgeText, { color: Colors.accent }]}>{MEAL_LABEL[log.meal_type] || 'Lainnya'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informasi Nutrisi</Text>

            <View style={styles.nutriRow}>
              <View style={[styles.nutriIconBox, { backgroundColor: Colors.accent }]}>
                <IconChicken size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nutriTop}>
                  <Text style={styles.nutriLabel}>Protein</Text>
                  <Text style={[styles.nutriVal, { color: Colors.accent }]}>{log.protein || 0}g</Text>
                </View>
                <View style={styles.nutriTrack}>
                  <View style={[styles.nutriFill, { width: `${Math.min((log.protein || 0) / 100 * 100, 100)}%`, backgroundColor: Colors.accent }]} />
                </View>
                <Text style={styles.nutriSub}>15% dari kebutuhan harian (80g)</Text>
              </View>
            </View>

            <View style={styles.nutriRow}>
              <View style={[styles.nutriIconBox, { backgroundColor: Colors.primary }]}>
                <IconApple size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nutriTop}>
                  <Text style={styles.nutriLabel}>Karbohidrat</Text>
                  <Text style={[styles.nutriVal, { color: Colors.primary }]}>{log.carbs || 0}g</Text>
                </View>
                <View style={styles.nutriTrack}>
                  <View style={[styles.nutriFill, { width: `${Math.min((log.carbs || 0) / 250 * 100, 100)}%`, backgroundColor: Colors.accent }]} />
                </View>
                <Text style={styles.nutriSub}>{Math.round((log.carbs || 0) / 250 * 100)}% dari kebutuhan harian (250g)</Text>
              </View>
            </View>

            <View style={[styles.nutriRow, { marginBottom: 0 }]}>
              <View style={[styles.nutriIconBox, { backgroundColor: Colors.accent }]}>
                <IconDroplet size={22} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nutriTop}>
                  <Text style={styles.nutriLabel}>Lemak</Text>
                  <Text style={[styles.nutriVal, { color: Colors.accent }]}>{log.fat || 0}g</Text>
                </View>
                <View style={styles.nutriTrack}>
                  <View style={[styles.nutriFill, { width: `${Math.min((log.fat || 0) / 65 * 100, 100)}%`, backgroundColor: Colors.accent }]} />
                </View>
                <Text style={styles.nutriSub}>{Math.round((log.fat || 0) / 65 * 100)}% dari kebutuhan harian (65g)</Text>
              </View>
            </View>

          </View>

          {/* Show Top Predictions from Log */}
          {log.top_predictions && log.top_predictions.length > 0 && (
            <View style={styles.topPredictionsSection}>
              <Text style={styles.topPredictionsTitle}>🔍 Model Alternatives</Text>
              {log.top_predictions.map((pred, idx) => (
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

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Info Tambahan</Text>
            <View style={styles.infoGrid}>
              {[
                { label: 'Serat', val: '3.5g', color: Colors.primary, bg: '#E8F5E9' },
                { label: 'Sodium', val: '680mg', color: Colors.accent, bg: '#FFF3E0' },
                { label: 'Gula', val: '5g', color: Colors.primary, bg: '#E8F5E9' },
                { label: 'Kolesterol', val: '45mg', color: Colors.accent, bg: '#FFF3E0' },
              ].map(i => (
                <View key={i.label} style={[styles.infoGridItem, { backgroundColor: i.bg }]}>
                  <Text style={styles.infoGridLabel}>{i.label}</Text>
                  <Text style={[styles.infoGridVal, { color: i.color }]}>{i.val}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.aiNote}>
            <View style={styles.aiNoteIconWrap}>
              <Ionicons name="bulb" size={20} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiNoteTitle}>Catatan AI</Text>
              <Text style={styles.aiNoteBody}>
                Nasi goreng ini cukup tinggi lemak. Untuk makan malam, disarankan pilih menu yang lebih ringan dengan sayuran lebih banyak.
              </Text>
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.deleteText}>Hapus Log</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.editActionBtn}>
              <Text style={styles.editActionText}>Edit Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  imageArea: { height: 240, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' },
  topBar: { position: 'absolute', top: Spacing.md, left: Spacing.md, right: Spacing.md, flexDirection: 'row', justifyContent: 'space-between' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  foodImagePlaceholder: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.4)' },

  infoCard: { backgroundColor: Colors.white, marginHorizontal: Spacing.lg, marginTop: -Spacing.xl, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.md },
  infoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  foodName: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaText: { fontSize: FontSize.xs, color: Colors.textMuted },
  calBadge: { backgroundColor: Colors.accent, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, alignItems: 'center' },
  calNum: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
  calUnit: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },
  badges: { flexDirection: 'row', gap: 8, marginTop: Spacing.md },
  badge: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: FontSize.xs, fontWeight: '700' },

  content: { padding: Spacing.lg },
  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },

  nutriRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  nutriIconBox: {
    width: 48, height: 48, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  nutriTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  nutriLabel: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  nutriVal: { fontSize: FontSize.md, fontWeight: '800' },
  nutriTrack: { height: 6, backgroundColor: '#F3F4F6', borderRadius: Radius.full, overflow: 'hidden', marginBottom: 4 },
  nutriFill: { height: '100%', borderRadius: Radius.full },
  nutriSub: { fontSize: FontSize.xs, color: Colors.textMuted },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoGridItem: { width: '47%', borderRadius: Radius.lg, padding: Spacing.md },
  infoGridLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: 4 },
  infoGridVal: { fontSize: FontSize.lg, fontWeight: '800' },

  topPredictionsSection: {
    marginVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: '#F3F4F6',
    paddingVertical: Spacing.md,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
  },
  topPredictionsTitle: {
    fontSize: FontSize.md,
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

  aiNote: {
    backgroundColor: Colors.primary, borderRadius: Radius.xl,
    padding: Spacing.lg, flexDirection: 'row', gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  aiNoteIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  aiNoteTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white, marginBottom: 4 },
  aiNoteBody: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.9)', lineHeight: 18 },

  actions: { flexDirection: 'row', gap: Spacing.md },
  deleteBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.error, borderRadius: Radius.full, height: 48 },
  deleteText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.error },
  editActionBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary, borderRadius: Radius.full, height: 48 },
  editActionText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },
});
