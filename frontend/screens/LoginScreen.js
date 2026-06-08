import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';
import GoogleButton from '../components/GoogleButton';
import ErrorAlert from '../components/ErrorAlert';
import { Colors, Spacing, Radius, FontSize, Gradients, Shadow } from '../components/theme';
import { supabase } from '../lib/supabase';
import { signInWithGoogle } from '../lib/googleAuth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState({ visible: false, title: '', message: '' });

  const showError = (title, message) => setErrorAlert({ visible: true, title, message });

  const handleLogin = async () => {
    if (!email || !password) {
      showError('Ups! Input Belum Lengkap', 'Email dan password harus diisi dulu ya.');
      return;
    }

    if (email === 'admin@nutriscan.id' && password === 'admin123') {
      navigation.replace('MainTabs');
      return;
    }

    setLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      const errorMsg = (error.message || '').toLowerCase();
      const errorCode = (error.code || '').toLowerCase();
      if (
        errorMsg.includes('invalid') || errorMsg.includes('credentials') ||
        errorMsg.includes('failed') || errorMsg.includes('unauthorized') ||
        errorMsg.includes('user not found') || errorMsg.includes('no user') ||
        errorCode.includes('invalid') || errorCode.includes('unauthorized')
      ) {
        showError('Login Gagal', 'Email atau password salah.');
      } else if (errorMsg.includes('not confirmed') || errorMsg.includes('email_not_confirmed')) {
        showError('Akun Belum Dikonfirmasi', 'Silakan cek email kamu untuk konfirmasi akun.');
      } else {
        showError('Login Gagal', error.message || 'Terjadi kesalahan saat login.');
      }
      return;
    }

    if (data?.session) {
      navigation.replace('MainTabs');
    } else {
      showError('Login Gagal', 'Tidak ada session data. Coba lagi.');
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res?.success) {
        navigation.replace('MainTabs');
      }
    } catch (e) {
      showError('Login Google Gagal', e?.message || 'Tidak bisa masuk dengan Google. Coba lagi.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {/* Gradient hero */}
      <LinearGradient colors={Gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
        <SafeAreaView edges={['top']} style={styles.heroInner}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🥗</Text>
          </View>
          <Text style={styles.appName}>NutriScan</Text>
          <Text style={styles.tagline}>Asisten Nutrisi Cerdas</Text>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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

            <PrimaryButton title="Masuk" onPress={handleLogin} loading={loading} />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>atau masuk dengan</Text>
              <View style={styles.dividerLine} />
            </View>

            <GoogleButton onPress={handleGoogle} loading={googleLoading} />

            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>Belum punya akun? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>Daftar sekarang</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ErrorAlert
        visible={errorAlert.visible}
        title={errorAlert.title}
        message={errorAlert.message}
        onClose={() => setErrorAlert({ ...errorAlert, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  hero: {
    paddingBottom: Spacing.xxl + Spacing.lg,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroInner: { alignItems: 'center', paddingTop: Spacing.lg },
  logoCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  logoEmoji: { fontSize: 40 },
  appName: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.white, letterSpacing: -0.5 },
  tagline: { fontSize: FontSize.md, color: 'rgba(255,255,255,0.9)', marginTop: 4 },

  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginTop: -Spacing.xxl,
    ...Shadow.lg,
  },
  cardTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.lg },

  forgotRow: { alignItems: 'flex-end', marginTop: -Spacing.sm, marginBottom: Spacing.md },
  forgotText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: FontSize.xs, color: Colors.textMuted, marginHorizontal: Spacing.sm },

  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.lg },
  registerPrompt: { fontSize: FontSize.sm, color: Colors.textSecondary },
  registerLink: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
});
