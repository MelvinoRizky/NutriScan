import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';

const GENDER_OPTIONS = ['Laki-laki', 'Perempuan'];
const TARGET_OPTIONS = ['Turun Berat Badan', 'Naik Berat Badan', 'Jaga Berat Badan'];

// IP backend sekarang diatur secara global di file frontend/.env
const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function RegisterScreen({ navigation }) {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [konfirmasi, setKonfirmasi] = useState('');
  const [usia, setUsia] = useState('');
  const [gender, setGender] = useState('');
  const [tinggi, setTinggi] = useState('');
  const [berat, setBerat] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validasi dasar
    if (!nama || !email || !password) {
      Alert.alert('Ups!', 'Nama, email, dan password wajib diisi ya.');
      return;
    }
    if (password !== konfirmasi) {
      Alert.alert('Ups!', 'Password dan konfirmasi password tidak sama.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Ups!', 'Password minimal 6 karakter ya.');
      return;
    }

    setLoading(true);

    try {
      // Panggil backend kita sendiri — backend yang urus Supabase + auto-confirm email
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nama, usia, gender, tinggi, berat, target }),
      });

      const result = await response.json();

      setLoading(false);

      if (!result.success) {
        Alert.alert('Pendaftaran Gagal', result.message || 'Coba lagi ya.');
        return;
      }

      if (!result.profileSaved) {
        Alert.alert(
          'Akun Dibuat ✅',
          'Akun berhasil dibuat, tapi gagal simpan profil. Lengkapi profil setelah login ya!',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
        return;
      }

      Alert.alert('Yeay! 🎉', 'Akun berhasil dibuat! Silakan login.', [
        { text: 'OK', onPress: () => navigation.replace('Login') },
      ]);

    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Tidak bisa terhubung ke server. Pastikan backend lo lagi jalan ya!');
    }
  };


  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.backLabel}>Kembali</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={{ fontSize: 28 }}>🥗</Text>
            </View>
            <Text style={styles.brandName}>Buat Akun Baru</Text>
            <Text style={styles.brandSub}>Mulai hidup sehat hari ini</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informasi Akun</Text>
            <CustomInput label="Nama Lengkap" icon="person-outline" placeholder="Nama kamu" value={nama} onChangeText={setNama} autoCapitalize="words" />
            <CustomInput label="Email" icon="mail-outline" placeholder="email@kamu.com" value={email} onChangeText={setEmail} keyboardType="email-address" />
            <CustomInput label="Password" icon="lock-closed-outline" placeholder="Min. 6 karakter" value={password} onChangeText={setPassword} secureTextEntry />
            <CustomInput label="Konfirmasi Password" icon="lock-closed-outline" placeholder="Ulangi password kamu" value={konfirmasi} onChangeText={setKonfirmasi} secureTextEntry />
          </View>

          <View style={styles.optionalCard}>
            <View style={styles.optionalHeader}>
              <View style={styles.orangeDot}>
                <Ionicons name="information-circle" size={18} color={Colors.accent} />
              </View>
              <Text style={styles.optionalTitle}>Informasi Personal (Opsional)</Text>
            </View>
            <Text style={styles.optionalSub}>Digunakan untuk menghitung target kalori kamu secara otomatis</Text>

            <View style={styles.rowInputs}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <CustomInput label="Usia" icon="calendar-outline" placeholder="Tahun" value={usia} onChangeText={setUsia} keyboardType="numeric" style={{ marginBottom: 0 }} />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  {GENDER_OPTIONS.map(g => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderChip, gender === g && styles.genderChipActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.genderChipText, gender === g && styles.genderChipTextActive]}>
                        {g === 'Laki-laki' ? '♂ L' : '♀ P'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.rowInputs}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <CustomInput label="Tinggi (cm)" icon="body-outline" placeholder="cm" value={tinggi} onChangeText={setTinggi} keyboardType="numeric" />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <CustomInput label="Berat (kg)" icon="barbell-outline" placeholder="kg" value={berat} onChangeText={setBerat} keyboardType="numeric" />
              </View>
            </View>

            <Text style={styles.inputLabel}>Target</Text>
            <View style={styles.targetWrap}>
              {TARGET_OPTIONS.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.targetChip, target === t && styles.targetChipActive]}
                  onPress={() => setTarget(t)}
                >
                  <Text style={[styles.targetChipText, target === t && styles.targetChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <PrimaryButton title="Daftar Sekarang" onPress={handleRegister} loading={loading} style={styles.registerBtn} />

          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>Masuk</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxl },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', ...Shadow.sm },
  backLabel: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '600' },

  logoSection: { alignItems: 'center', marginBottom: Spacing.lg },
  logoCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', ...Shadow.md, marginBottom: Spacing.sm },
  brandName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primaryDark },
  brandSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },

  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },

  optionalCard: { backgroundColor: Colors.accentLight, borderRadius: Radius.xl, padding: Spacing.lg, marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.orangeLight },
  optionalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  orangeDot: { marginRight: 6 },
  optionalTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.accent },
  optionalSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginBottom: Spacing.md },

  rowInputs: { flexDirection: 'row', marginBottom: 0 },
  inputLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },

  genderRow: { flexDirection: 'row', gap: 6, marginBottom: Spacing.md },
  genderChip: { flex: 1, height: 52, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  genderChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  genderChipText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  genderChipTextActive: { color: Colors.white },

  targetWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm },
  targetChip: { paddingHorizontal: Spacing.md, paddingVertical: 8, borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white },
  targetChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  targetChipText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  targetChipTextActive: { color: Colors.white },

  registerBtn: { marginBottom: Spacing.md },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginPrompt: { fontSize: FontSize.sm, color: Colors.textSecondary },
  loginLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
});
