import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import PrimaryButton from '../components/PrimaryButton';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';

const GENDERS = ['Laki-laki', 'Perempuan'];

export default function EditProfileScreen({ navigation }) {
  const [nama, setNama] = useState('Budi Santoso');
  const [email, setEmail] = useState('admin@nutriscan.id');
  const [usia, setUsia] = useState('25');
  const [gender, setGender] = useState('Laki-laki');
  const [tinggi, setTinggi] = useState('173');
  const [berat, setBerat] = useState('68');
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Tersimpan! ✅', 'Profil kamu berhasil diperbarui.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 800);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{nama[0]}</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Ionicons name="camera-outline" size={14} color={Colors.white} />
            <Text style={styles.changePhotoText}>Ganti Foto</Text>
          </TouchableOpacity>
        </View>

        {/* Account Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informasi Akun</Text>
          <CustomInput label="Nama Lengkap" icon="person-outline" placeholder="Nama" value={nama} onChangeText={setNama} autoCapitalize="words" />
          <CustomInput label="Email" icon="mail-outline" placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>

        {/* Personal Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Informasi Personal</Text>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <CustomInput label="Usia" icon="calendar-outline" placeholder="Tahun" value={usia} onChangeText={setUsia} keyboardType="numeric" />
            </View>
            <View style={styles.halfInput}>
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {GENDERS.map(g => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.genderChip, gender === g && styles.genderActive]}
                    onPress={() => setGender(g)}
                  >
                    <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>{g === 'Laki-laki' ? '♂' : '♀'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <CustomInput label="Tinggi (cm)" icon="body-outline" placeholder="cm" value={tinggi} onChangeText={setTinggi} keyboardType="numeric" />
            </View>
            <View style={styles.halfInput}>
              <CustomInput label="Berat (kg)" icon="barbell-outline" placeholder="kg" value={berat} onChangeText={setBerat} keyboardType="numeric" />
            </View>
          </View>
        </View>

        <PrimaryButton title="Simpan Perubahan" onPress={handleSave} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primaryDark, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },

  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

  avatarSection: { alignItems: 'center', marginBottom: Spacing.lg },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', ...Shadow.md, marginBottom: Spacing.sm },
  avatarInitial: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
  changePhotoBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: Spacing.md, paddingVertical: 6 },
  changePhotoText: { fontSize: FontSize.xs, color: Colors.white, fontWeight: '600' },

  card: { backgroundColor: Colors.white, borderRadius: Radius.xl, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  row: { flexDirection: 'row', gap: Spacing.md },
  halfInput: { flex: 1 },
  inputLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderChip: { flex: 1, height: 52, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  genderActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  genderText: { fontSize: FontSize.lg, color: Colors.textSecondary },
  genderTextActive: { color: Colors.white },
});
