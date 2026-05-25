# 🐳 NutriScan — Panduan Kontainerisasi Docker

## Struktur File yang Ditambahkan

```
NutriScan/
├── docker-compose.yml          ← Orchestration semua service
├── .env.example                ← Template environment variables
├── backend/
│   └── Dockerfile              ← Build image Node.js + Python
└── frontend/
    ├── Dockerfile              ← Build Expo Web → nginx
    └── nginx.conf              ← Konfigurasi nginx untuk SPA routing
```

---

## Arsitektur Container

```
┌─────────────────────────────────────────┐
│  Browser / Mobile App                   │
└────────────┬────────────────────────────┘
             │ HTTP :8080
             ▼
┌─────────────────────────┐
│  frontend (nginx)       │  port 8080 → 80
│  Expo Web (static SPA)  │
└────────────┬────────────┘
             │ HTTP :3000 (internal network)
             ▼
┌─────────────────────────┐      ┌──────────────────┐
│  backend (Node.js)      │─────▶│  Supabase (cloud) │
│  + Python AI scripts    │      │  (tidak di-Docker) │
└─────────────────────────┘      └──────────────────┘
```

---

## Cara Menjalankan

### 1. Persiapan Environment Variables

```bash
cp .env.example .env
# Edit .env dan isi SUPABASE_URL, SUPABASE_ANON_KEY, dll.
```

### 2. Build & Jalankan

```bash
# Build semua image dan jalankan
docker compose up --build

# Atau jalankan di background (detached mode)
docker compose up --build -d
```

### 3. Akses Aplikasi

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:8080  |
| Backend  | http://localhost:3000  |

### 4. Perintah Berguna

```bash
# Lihat log semua service
docker compose logs -f

# Lihat log service tertentu
docker compose logs -f backend
docker compose logs -f frontend

# Stop semua container
docker compose down

# Stop dan hapus volumes
docker compose down -v

# Rebuild hanya satu service
docker compose up --build backend
```

---

## Catatan Penting

### ⚠️ Expo Web vs Mobile
- Container ini menjalankan **Expo dalam mode Web** (berjalan di browser).
- Untuk build APK (Android) atau IPA (iOS), gunakan **EAS Build**:
  ```bash
  npx eas build --platform android
  ```
  EAS Build tidak memerlukan Docker.

### 🔐 Supabase
- Supabase berjalan sebagai **layanan cloud** — tidak perlu container lokal.
- Pastikan `.env` sudah berisi credentials yang benar sebelum menjalankan Docker.

### 🐍 Python Scripts
- Backend Node.js sudah include Python 3 di dalam imagenya.
- Script Python di folder `backend/` bisa dijalankan via Node.js child_process atau langsung.
- Jika ada `requirements.txt` di folder `backend/`, dependencies Python akan otomatis terinstall.
