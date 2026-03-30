# NutriScan

Aplikasi scan nutrisi makanan - React Native (Expo) + Express backend.

## Struktur Folder

```
NutriScan/
├── frontend/          # 📱 Mobile app (React Native + Expo)
│   ├── App.js         # Komponen utama
│   ├── index.js       # Entry point
│   ├── assets/        # Icons, splash, dll
│   ├── global.css     # Styling (Tailwind/NativeWind)
│   └── ...
│
├── backend/           # 🖥️ Server API (Express.js)
│   ├── server.js      # Server utama
│   ├── photos/        # Foto yang di-upload
│   └── ...
│
└── docs/              # Dokumentasi
```

### Frontend (`frontend/`)
- React Native + Expo
- NativeWind (Tailwind untuk RN)
- Camera, upload foto ke backend

### Backend (`backend/`)
- Express.js
- Endpoint `/upload` untuk terima foto
- CORS enabled untuk mobile

## Cara Jalanin

```bash
# Install semua dependency
npm run install:all

# Jalanin frontend (Expo)
npm run start:frontend
# atau: npm start

# Jalanin backend (di terminal lain)
npm run start:backend

# Platform spesifik
npm run android
npm run ios
npm run web
```

**Note:** Ganti IP di `frontend/App.js` (line ~107) sesuai IP laptop/PC kamu biar mobile bisa connect ke backend.

---

## Ketua Kelompok:
- Melvino Rizky Putra Wahyudi - 23/515981/TK/56770

## Anggota:
1. Moses Saidasdo Purba
2. Davana Nico Fadla
3.
4.
