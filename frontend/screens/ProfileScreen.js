import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow, Gradients } from '../components/theme';
import { supabase } from '../lib/supabase';

export default function ProfileScreen({ navigation }) {
  const [notif, setNotif] = useState(true);
  const [userName, setUserName] = useState('User Name');
  const [userEmail, setUserEmail] = useState('user@email.com');
  const [targetCal, setTargetCal] = useState(2000);
  const [targetProtein, setTargetProtein] = useState(80);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('full_name, email, target_calories, target_protein')
        .eq('id', user.id)
        .single();
      if (data) {
        setUserName(data.full_name || 'User');
        setUserEmail(data.email || user.email || '');
        if (data.target_calories) setTargetCal(data.target_calories);
        if (data.target_protein) setTargetProtein(data.target_protein);
      }
    })();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Yakin mau keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await supabase.auth.signOut();
        navigation.replace('Login');
      }},
    ]);
  };

  return (
    <View style={styles.safe}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={Gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <SafeAreaView edges={['top']}>
            <Text style={styles.headerTitle}>Profil Saya</Text>
            <Text style={styles.headerSub}>Kelola akun & preferensi</Text>

            <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={28} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.userEmail}>{userEmail}</Text>
            </View>
              <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.cardIcon, { backgroundColor: '#FFF3E0' }]}>
                  <Ionicons name="fitness" size={18} color={Colors.accent} />
                </View>
                <Text style={styles.cardTitle}>Target Harian</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('EditTarget')}>
                <Text style={styles.editLink}>Ubah</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.targetRow}>
              <View style={[styles.targetBox, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.targetNum, { color: Colors.primary }]}>{targetCal.toLocaleString()}</Text>
                <Text style={styles.targetLabel}>Kalori</Text>
              </View>
              <View style={[styles.targetBox, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.targetNum, { color: Colors.accent }]}>{targetProtein}g</Text>
                <Text style={styles.targetLabel}>Protein</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ringkasan Saran AI</Text>
            <View style={styles.adviceList}>
              <View style={styles.adviceItem}>
                <View style={[styles.adviceDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.adviceText}>Pola makanmu sudah cukup baik minggu ini</Text>
              </View>
              <View style={styles.adviceItem}>
                <View style={[styles.adviceDot, { backgroundColor: Colors.accent }]} />
                <Text style={styles.adviceText}>Tingkatkan asupan protein di pagi hari</Text>
              </View>
              <View style={styles.adviceItem}>
                <View style={[styles.adviceDot, { backgroundColor: Colors.accent }]} />
                <Text style={styles.adviceText}>Kurangi makanan berminyak saat malam</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('Advice')}>
              <Text style={styles.seeAllText}>Lihat Semua Saran</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="notifications-outline" size={18} color={Colors.accent} />
              </View>
              <Text style={styles.menuLabel}>Notifikasi</Text>
              <Switch
                value={notif}
                onValueChange={setNotif}
                trackColor={{ true: Colors.primary, false: Colors.border }}
                thumbColor={Colors.white}
              />
            </View>
            <TouchableOpacity style={[styles.menuItem, styles.menuSep]} onPress={() => navigation.navigate('Help')}>
              <View style={[styles.menuIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="help-circle-outline" size={18} color={Colors.accent} />
              </View>
              <Text style={styles.menuLabel}>Bantuan</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuSep]} onPress={() => navigation.navigate('EditTarget')}>
              <View style={[styles.menuIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="cog-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.menuLabel}>Pengaturan</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.menuSep]} onPress={handleLogout}>
              <View style={[styles.menuIcon, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="log-out-outline" size={18} color={Colors.error} />
              </View>
              <Text style={[styles.menuLabel, { color: Colors.error }]}>Keluar</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerVersion}>NutriScan v1.0.0</Text>
            <Text style={styles.footerPowered}>Powered by Azure ML & Cloud Computing</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.white, textAlign: 'center' },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 2, marginBottom: Spacing.md },

  userCard: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.accent,
    justifyContent: 'center', alignItems: 'center',
  },
  userName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },
  userEmail: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  editBtn: {
    backgroundColor: Colors.white, borderRadius: Radius.full,
    paddingHorizontal: 16, paddingVertical: 6,
  },
  editBtnText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textPrimary },

  content: { padding: Spacing.lg },

  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  cardIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  editLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  targetRow: { flexDirection: 'row', gap: 12 },
  targetBox: { flex: 1, borderRadius: Radius.lg, paddingVertical: Spacing.md, alignItems: 'center' },
  targetNum: { fontSize: FontSize.xl, fontWeight: '800' },
  targetLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 4 },

  adviceList: { marginBottom: Spacing.md },
  adviceItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm, backgroundColor: '#F9FBF9', borderRadius: Radius.md, padding: Spacing.sm },
  adviceDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  adviceText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  seeAllBtn: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: Radius.full, paddingVertical: 10, alignItems: 'center' },
  seeAllText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },

  menuCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, ...Shadow.sm, overflow: 'hidden', marginBottom: Spacing.md },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md },
  menuSep: { borderTopWidth: 1, borderTopColor: Colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },

  footer: { alignItems: 'center', paddingVertical: Spacing.lg },
  footerVersion: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },
  footerPowered: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 4 },
});
