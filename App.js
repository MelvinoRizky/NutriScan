import { useState, useRef } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, Alert, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import './global.css';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isRequesting, setIsRequesting] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  // loads permission
  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  // iznnn kamera
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', paddingHorizontal: 24 }}>
        <Text style={{ textAlign: 'center', marginBottom: 24, fontSize: 18, fontWeight: '600', color: '#1f2937' }}>
          NutriScan butuh izin akses kamera kamu nih buat nge-scan makanan!
        </Text>
        <TouchableOpacity
          disabled={isRequesting}
          style={{
            backgroundColor: isRequesting ? '#9ca3af' : '#16a34a',
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderRadius: 9999
          }}
          onPress={async () => {
            setIsRequesting(true);
            try {
              const result = await requestPermission();
              if (!result.granted) {
                Alert.alert('error', 'izin kamera ditolak.');
              }
            } catch (error) {
              Alert.alert('error', 'ada masalah saat minta izin kamera');
            } finally {
              setIsRequesting(false);
            }
          }}
          activeOpacity={0.7}
        >
          {isRequesting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Kasih Izin Dulu</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // preview
  if (photoUri) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <Image
          source={{ uri: photoUri }}
          style={{ flex: 1 }}
          resizeMode="contain"
        />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingVertical: 32,
          backgroundColor: 'black'
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 9999
            }}
            onPress={() => setPhotoUri(null)}
            activeOpacity={0.7}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Ulang</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#22c55e',
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 9999
            }}
            onPress={async () => {
              try {
                const formData = new FormData();
                formData.append('photo', {
                  uri: photoUri,
                  type: 'image/jpeg',
                  name: 'photo.jpg'
                });

                const response = await fetch('http://192.168.1.11:3000/upload', { // ip laptop gw
                  method: 'POST',
                  body: formData,
                  headers: { 'Content-Type': 'multipart/form-data' }
                });

                const result = await response.json();
                if (result.success) {
                  Alert.alert('Sip!', `Foto tersimpan: ${result.filename}`);
                  setPhotoUri(null); // balik ke kamera
                }
              } catch (e) {
                Alert.alert('error', 'gagal kirim foto ke server');
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}> Pakai Foto</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // kamera utama mpruy
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <CameraView style={{ flex: 1 }} facing={facing} ref={cameraRef}>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: 48
        }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingHorizontal: 24,
              paddingVertical: 16,
              borderRadius: 9999,
              marginHorizontal: 16
            }}
            onPress={toggleCameraFacing}
            activeOpacity={0.7}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Flip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#22c55e',
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 4,
              borderColor: 'white',
              marginHorizontal: 16
            }}
            onPress={async () => {
              if (!cameraRef.current) return;
              try {
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
                setPhotoUri(photo.uri);
              } catch (e) {
                Alert.alert('error', 'gagal ngejepret foto');
              }
            }}
            activeOpacity={0.7}
          />
        </View>
      </CameraView>
    </View>
  );
}