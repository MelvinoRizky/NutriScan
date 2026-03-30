import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';

// Mock credentials
const MOCK_USER = { email: 'admin@nutriscan.id', password: 'admin123' };

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Ups!', 'Email dan password harus diisi dulu ya.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email === MOCK_USER.email && password === MOCK_USER.password) {
        navigation.replace('MainTabs');
      } else {
        Alert.alert('Login Gagal', 'Email atau password salah. Coba lagi ya!\n\nHint: admin@nutriscan.id / admin123');
      }
    }, 1000);
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
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🥗</Text>
            </View>
            <Text style={styles.appName}>NutriScan</Text>
            <Text style={styles.tagline}>Asisten Nutrisi Cerdas</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Selamat Datang! 👋</Text>
            <Text style={styles.cardSubtitle}>Masuk untuk melanjutkan</Text>

            <CustomInput
              label="Email"
              icon="mail-outline"
              placeholder="email@kamu.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <CustomInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="Password kamu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Lupa password?</Text>
            </TouchableOpacity>

            <PrimaryButton title="Masuk" onPress={handleLogin} loading={loading} style={styles.loginBtn} />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau masuk dengan</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.googleBtn}>
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={styles.googleText}>Lanjutkan dengan Google</Text>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Daftar sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },

  logoSection: { alignItems: 'center', paddingTop: Spacing.xl, paddingBottom: Spacing.lg },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.primaryDark, letterSpacing: -0.5 },
  tagline: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadow.md,
  },
  cardTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.lg },

  forgotRow: { alignItems: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.md },
  forgotText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  loginBtn: { marginTop: Spacing.xs },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: FontSize.xs, color: Colors.textMuted, marginHorizontal: Spacing.sm },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 52, borderRadius: Radius.full,
    borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.white, gap: 10,
  },
  googleText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },

  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
  registerPrompt: { fontSize: FontSize.sm, color: Colors.textSecondary },
  registerLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
});
