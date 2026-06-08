import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import ErrorAlert from '../components/ErrorAlert';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../components/theme';
import { useFocusEffect } from '@react-navigation/native';

export default function ScanScreen({ navigation }) {
  const [scanning, setScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [errorAlert, setErrorAlert] = useState({ visible: false, title: '', message: '' });

  // Matiin kamera pas screen unfocus (pindah ke ScannedScreen), nyalain lagi pas balik
  useFocusEffect(
    useCallback(() => {
      setIsCameraActive(true);
      return () => {
        setIsCameraActive(false);
      };
    }, [])
  );

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(lineAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(lineAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [lineAnim]);

  // Fungsi handle upload ke backend
  const uploadToBackend = async (localUri) => {
    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/scan`;
      console.log('[SCAN] Uploading to:', apiUrl);
      console.log('[SCAN] Image URI:', localUri);

      const formData = new FormData();

      // Handle file differently for web vs native
      if (Platform.OS === 'web') {
        // For web, need to fetch the image as a Blob first
        const response = await fetch(localUri);
        const blob = await response.blob();
        console.log('[SCAN] Blob size:', blob.size);
        formData.append('photo', blob, 'photo.jpg');
      } else {
        // For native, use the URI directly
        console.log('[SCAN] Native platform, using URI directly');
        formData.append('photo', {
          uri: localUri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
      }

      console.log('[SCAN] Sending request...');
      const uploadResponse = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type - fetch will set it with boundary
      });

      console.log('[SCAN] Response status:', uploadResponse.status);
      const json = await uploadResponse.json();
      console.log('[SCAN] Response JSON:', JSON.stringify(json, null, 2));

      if (uploadResponse.ok && json.success) {
        console.log('[SCAN] Success! Food detected:', json.result.name);
        setScanning(false);
        // Navigate away immediately to close camera
        navigation.navigate('Scanned', {
          imageUrl: json.imageUrl || localUri,
          scanResult: json.result,
        });
      } else {
        console.error('[SCAN] Backend error - Status:', uploadResponse.status);
        console.error('[SCAN] Backend error - Message:', json.message);
        console.error('[SCAN] Full response:', JSON.stringify(json, null, 2));
        setErrorAlert({
          visible: true,
          title: '❌ Scan Gagal',
          message: json.message || 'Ada error saat scan. Coba lagi ya!',
        });
        setScanning(false);
      }
    } catch (err) {
      console.error('[SCAN] Upload error:', err.message);
      console.error('[SCAN] Full error:', err);
      setErrorAlert({
        visible: true,
        title: '❌ Koneksi Error',
        message: 'Tidak bisa terhubung ke backend di ' + (process.env.EXPO_PUBLIC_API_URL || 'undefined'),
      });
      setScanning(false);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    setScanning(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      await uploadToBackend(photo.uri);
    } catch (err) {
      console.error('[SCAN] Capture error:', err);
      setErrorAlert({
        visible: true,
        title: '❌ Camera Error',
        message: 'Gagal capture foto. Coba lagi ya!',
      });
      setScanning(false);
    }
  };

  const handlePickGallery = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
      });
      if (!result.canceled) {
        setScanning(true);
        await uploadToBackend(result.assets[0].uri);
      }
    } catch (err) {
      console.error('[SCAN] Gallery error:', err);
      setErrorAlert({
        visible: true,
        title: '❌ Gallery Error',
        message: 'Gagal membuka galeri. Coba lagi ya!',
      });
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>NutriScan butuh akses kamera ya!</Text>
        <TouchableOpacity style={styles.captureBtn} onPress={requestPermission}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Izinkan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const translateY = lineAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 220] });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>AI Food Scanner</Text>
          <Text style={styles.headerSub}>Scan makananmu sekarang</Text>
        </View>
        <View style={styles.sparkleWrap}>
          <Ionicons name="sparkles" size={20} color={Colors.white} />
        </View>
      </View>

      {isCameraActive ? (
        <CameraView style={styles.cameraArea} ref={cameraRef} facing={facing}>
          <View style={styles.statusBadge}>
            <Ionicons name="scan-outline" size={14} color={Colors.primary} />
            <Text style={styles.statusText}>Arahkan ke makanan</Text>
          </View>

          <View style={styles.viewfinder}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />

            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />

            {scanning && (
              <View style={styles.scanOverlay}>
                <Text style={styles.scanText}>Memproses...</Text>
              </View>
            )}
          </View>

          <View style={styles.controls}>
            <TouchableOpacity style={styles.galleryBtn} onPress={handlePickGallery} disabled={scanning}>
              <Ionicons name="images-outline" size={22} color={Colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureBtn} onPress={handleCapture} disabled={scanning}>
              <View style={styles.captureInner}>
                {scanning ? (
                  <Ionicons name="hourglass" size={28} color={Colors.white} />
                ) : (
                  <Ionicons name="camera" size={28} color={Colors.white} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.galleryBtn} onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')} disabled={scanning}>
              <Ionicons name="refresh-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.uploadBtn} onPress={handlePickGallery} disabled={scanning}>
            <Ionicons name="cloud-upload-outline" size={18} color={Colors.accent} />
            <Text style={styles.uploadText}>Upload dari Galeri</Text>
          </TouchableOpacity>
        </CameraView>
      ) : (
        <View style={[styles.cameraArea, { backgroundColor: '#1F2937' }]} />
      )}
      
      <ErrorAlert
        visible={errorAlert.visible}
        title={errorAlert.title}
        message={errorAlert.message}
        onClose={() => setErrorAlert({ ...errorAlert, visible: false })}
      />
    </SafeAreaView>
  );
}

const CORNER_SIZE = 30;
const CORNER_WIDTH = 4;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1F2937' },

  header: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: {},
  headerTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.white },
  headerSub: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  sparkleWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },

  cameraArea: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1F2937', paddingBottom: Spacing.xxl },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.white, borderRadius: Radius.full,
    paddingHorizontal: Spacing.md, paddingVertical: 8,
    marginBottom: Spacing.lg, ...Shadow.sm,
  },
  statusText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textPrimary },

  viewfinder: { width: 260, height: 260, position: 'relative', marginBottom: Spacing.xl },
  corner: { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE },
  tl: { top: 0, left: 0, borderTopWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH, borderColor: Colors.accent, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderTopWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, borderColor: Colors.accent, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderBottomWidth: CORNER_WIDTH, borderLeftWidth: CORNER_WIDTH, borderColor: Colors.accent, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderBottomWidth: CORNER_WIDTH, borderRightWidth: CORNER_WIDTH, borderColor: Colors.accent, borderBottomRightRadius: 12 },
  scanLine: { position: 'absolute', left: 10, right: 10, height: 2, backgroundColor: Colors.accent, borderRadius: 1 },
  scanOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  scanText: { color: Colors.white, fontWeight: '700', fontSize: FontSize.md },

  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '70%', marginBottom: Spacing.lg },
  galleryBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  captureBtn: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: Colors.accent, padding: 4, justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: '100%', height: '100%', borderRadius: 30, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center' },

  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.white, borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg, paddingVertical: 10,
    ...Shadow.sm,
  },
  uploadText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.accent },
});
