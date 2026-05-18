import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';
import { supabase } from '../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

const FILTERS = ['Semua', 'Hari Ini', 'Minggu Ini'];

const MEAL_EMOJI = { breakfast: '🍳', lunch: '☀️', snack: '🍪', dinner: '🌙' };

const MOCK_DATA = [
  { id: '1', food_name: 'Nasi Goreng', meal_type: 'lunch', calories: 450, logged_at: new Date().toISOString(), location: 'Kantin Kampus' },
  { id: '2', food_name: 'Roti Bakar + Telur', meal_type: 'breakfast', calories: 320, logged_at: new Date().toISOString(), location: '' },
  { id: '3', food_name: 'Ayam Geprek', meal_type: 'dinner', calories: 580, logged_at: new Date(Date.now() - 86400000).toISOString(), location: 'Rumah Makan Sederhana' },
  { id: '4', food_name: 'Gado-gado', meal_type: 'lunch', calories: 380, logged_at: new Date(Date.now() - 86400000).toISOString(), location: '' },
  { id: '5', food_name: 'Bubur Ayam', meal_type: 'breakfast', calories: 290, logged_at: new Date(Date.now() - 86400000).toISOString(), location: 'Warung Bu Siti' },
];

export default function HistoryScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [historyData, setHistoryData] = useState([]);
  const [allData, setAllData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('food_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('logged_at', { ascending: false });
        const logs = data || [];
        setAllData(logs);
        setHistoryData(logs);
      })();
    }, [])
  );

  const applyFilter = (filter) => {
    setActiveFilter(filter);
    const now = new Date();
    if (filter === 'Hari Ini') {
      const today = now.toISOString().split('T')[0];
      setHistoryData(allData.filter(i => i.logged_at?.startsWith(today)));
    } else if (filter === 'Minggu Ini') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      setHistoryData(allData.filter(i => i.logged_at >= weekAgo));
    } else {
      setHistoryData(allData);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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

        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => applyFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrap, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="trending-up" size={20} color={Colors.accent} />
            </View>
            <Text style={[styles.summaryVal, { color: Colors.accent }]}>
              {historyData.reduce((s, i) => s + (i.calories || 0), 0).toLocaleString()}
            </Text>
            <Text style={styles.summaryLabel}>Total Kalori</Text>
          </View>
          <View style={styles.summaryCard}>
            <View style={[styles.summaryIconWrap, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="restaurant" size={20} color={Colors.primary} />
            </View>
            <Text style={[styles.summaryVal, { color: Colors.primary }]}>{historyData.length}</Text>
            <Text style={styles.summaryLabel}>Makanan Tercatat</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyTitle}>Belum ada riwayat makan</Text>
            <Text style={styles.emptyDesc}>Mulai scan makanan kamu untuk mencatat nutrisi harian!</Text>
          </View>
        }
        renderItem={({ item }) => {
          const emoji = MEAL_EMOJI[item.meal_type] || '🍽️';
          const timeStr = item.logged_at
            ? new Date(item.logged_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
            : '-';
          return (
            <TouchableOpacity
              style={styles.foodItem}
              onPress={() => navigation.navigate('FoodDetail', { log: item })}
            >
              <View style={styles.foodIconWrap}>
                <Text style={{ fontSize: 20 }}>{emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.foodName}>{item.food_name}</Text>
                <Text style={styles.foodMeta}>{timeStr}</Text>
                {item.location ? <Text style={styles.foodPlace}>📍 {item.location}</Text> : null}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.foodCal}>{item.calories}</Text>
                <Text style={styles.foodCalUnit}>kcal</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          );
        }}
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

  emptyWrap: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptyDesc: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 32 },
});
