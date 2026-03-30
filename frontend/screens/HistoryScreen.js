import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';

const FILTERS = ['Semua', 'Hari Ini', 'Minggu Ini'];

const HISTORY_DATA = [
  { id: '1', name: 'Nasi Goreng', emoji: '🍳', calories: 450, time: 'Hari ini, 12:30', place: 'Kantin Kampus' },
  { id: '2', name: 'Roti Bakar + Telur', emoji: '🍞', calories: 320, time: 'Hari ini, 08:15', place: '' },
  { id: '3', name: 'Ayam Geprek', emoji: '🍗', calories: 580, time: 'Kemarin, 19:45', place: 'Rumah Makan Sederhana' },
  { id: '4', name: 'Gado-gado', emoji: '🥗', calories: 380, time: 'Kemarin, 13:00', place: '' },
  { id: '5', name: 'Bubur Ayam', emoji: '🥣', calories: 290, time: 'Kemarin, 07:30', place: 'Warung Bu Siti' },
];

export default function HistoryScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('Semua');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Green header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Riwayat Makan</Text>
            <Text style={styles.headerSub}>Lihat semua aktivitasmu</Text>
          </View>
          <TouchableOpacity style={styles.calendarBtn}>
            <Ionicons name="calendar-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary stats */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrap, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="trending-up" size={20} color={Colors.accent} />
            </View>
            <Text style={[styles.summaryVal, { color: Colors.accent }]}>2,020</Text>
            <Text style={styles.summaryLabel}>Total Kalori</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="restaurant" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.summaryVal, { color: Colors.primary }]}>5</Text>
            <Text style={styles.summaryLabel}>Makanan Tercatat</Text>
          </View>
        </View>
      </View>

      {/* Food list */}
      <FlatList
        data={HISTORY_DATA}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.foodItem}
            onPress={() => navigation.navigate('FoodDetail', { meal: item })}
          >
            <View style={styles.foodIconWrap}>
              <Ionicons name="restaurant" size={20} color={Colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodMeta}>{item.time}</Text>
              {item.place ? <Text style={styles.foodPlace}>📍 {item.place}</Text> : null}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.foodCal}>{item.calories}</Text>
              <Text style={styles.foodCalUnit}>kcal</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.loadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        }
      />
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
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  calendarBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: 'rgba(255,255,255,0.18)' },
  filterChipActive: { backgroundColor: Colors.white },
  filterText: { fontSize: FontSize.sm, fontWeight: '600', color: 'rgba(255,255,255,0.7)' },
  filterTextActive: { color: '#16A34A' },

  summaryRow: { flexDirection: 'row', gap: 10 },
  summaryCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center',
  },
  summaryIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  summaryVal: { fontSize: FontSize.xl, fontWeight: '800' },
  summaryLabel: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  list: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  foodItem: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.sm, marginBottom: 10, ...Shadow.sm,
  },
  foodIconWrap: {
    width: 48, height: 48, borderRadius: Radius.lg,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center', alignItems: 'center',
  },
  foodName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  foodMeta: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  foodPlace: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  foodCal: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.accent },
  foodCalUnit: { fontSize: FontSize.xs, color: Colors.textMuted },

  loadMore: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    borderWidth: 1.5, borderColor: Colors.primary,
    padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm,
  },
  loadMoreText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
});
