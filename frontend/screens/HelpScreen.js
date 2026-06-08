import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, FontSize, Shadow, Gradients } from '../components/theme';

const FAQ = [
  { q: 'Cara kerja AI scan makanan?', a: 'NutriScan menggunakan model AI yang terlatih dengan jutaan gambar makanan untuk mengenali jenis makanan dan memperkirakan kandungan nutrisinya secara otomatis.' },
  { q: 'Apakah data saya aman?', a: 'Data makanan kamu disimpan secara lokal dan terenkripsi. Kami tidak menjual data kepada pihak ketiga.' },
  { q: 'Bagaimana cara mengubah target kalori?', a: 'Buka tab Profil > Edit Target Kalori. Kamu bisa sesuaikan total kalori dan target makro hariannya.' },
  { q: 'Kenapa hasil scan tidak akurat?', a: 'Pastikan pencahayaan cukup dan makanan terlihat jelas di viewfinder. Jarak ideal adalah 20-30 cm dari makanan.' },
  { q: 'Bagaimana cara hapus riwayat makan?', a: 'Buka riwayat, klik item makanan, lalu pilih "Hapus dari Log" di bagian bawah halaman.' },
];

const CONTACT_OPTIONS = [
  { icon: 'chatbubble-outline', label: 'Live Chat', desc: 'Chat langsung dengan tim kami', color: Colors.primary, bg: Colors.primaryLight },
  { icon: 'mail-outline', label: 'Email', desc: 'support@nutriscan.id', color: Colors.blue, bg: Colors.blueLight },
  { icon: 'call-outline', label: 'Telepon', desc: '+62 812-3456-7890', color: Colors.accent, bg: Colors.accentLight },
];

export default function HelpScreen({ navigation }) {
  return (
    <View style={styles.safe}>
      <StatusBar style="light" />
      <LinearGradient colors={Gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <SafeAreaView edges={['top']} style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bantuan</Text>
          <View style={{ width: 40 }} />
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Contact options */}
        <Text style={styles.sectionTitle}>Hubungi Kami</Text>
        {CONTACT_OPTIONS.map(c => (
          <TouchableOpacity key={c.label} style={styles.contactCard}>
            <View style={[styles.contactIcon, { backgroundColor: c.bg }]}>
              <Ionicons name={c.icon} size={22} color={c.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactDesc}>{c.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        {/* FAQ */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>Pertanyaan Umum (FAQ)</Text>
        <View style={styles.faqCard}>
          {FAQ.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} isLast={i === FAQ.length - 1} />
          ))}
        </View>

        {/* Video Tutorial card */}
        <TouchableOpacity style={styles.videoCard}>
          <View style={styles.videoPlayIcon}>
            <Ionicons name="play" size={20} color={Colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.videoTitle}>Video Tutorial</Text>
            <Text style={styles.videoDesc}>Pelajari cara menggunakan NutriScan dalam 3 menit</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.accent} />
        </TouchableOpacity>

        {/* Version */}
        <View style={styles.versionSection}>
          <View style={styles.logoMini}>
            <Text style={{ fontSize: 20 }}>🥗</Text>
          </View>
          <Text style={styles.versionApp}>NutriScan</Text>
          <Text style={styles.versionNum}>Versi 1.0.0 • Expo Go</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function FAQItem({ q, a, isLast }) {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={[styles.faqItem, !isLast && { borderBottomWidth: 1, borderBottomColor: Colors.border }]}>
      <TouchableOpacity style={styles.faqQ} onPress={() => setOpen(v => !v)}>
        <Text style={styles.faqQText}>{q}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
      </TouchableOpacity>
      {open && <Text style={styles.faqA}>{a}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingBottom: Spacing.md, borderBottomLeftRadius: Radius.xl, borderBottomRightRadius: Radius.xl },
  headerRow: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },

  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },

  contactCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.md, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, ...Shadow.sm, marginBottom: Spacing.sm,
  },
  contactIcon: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  contactDesc: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  faqCard: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.md },
  faqItem: { paddingVertical: Spacing.sm },
  faqQ: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: Spacing.sm },
  faqQText: { flex: 1, fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary },
  faqA: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22, marginTop: 8 },

  videoCard: {
    backgroundColor: Colors.accentLight, borderRadius: Radius.xl,
    padding: Spacing.lg, flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, borderWidth: 1, borderColor: Colors.orangeLight, marginBottom: Spacing.md,
  },
  videoPlayIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center' },
  videoTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.accent, marginBottom: 4 },
  videoDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },

  versionSection: { alignItems: 'center', gap: 6, paddingVertical: Spacing.lg },
  logoMini: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  versionApp: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
  versionNum: { fontSize: FontSize.sm, color: Colors.textMuted },
});
