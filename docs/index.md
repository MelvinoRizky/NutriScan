# Orak Arik Jamur SamiAsih Hitam

## Anggota Kelompok
* **Melvino Rizky Putra Wahyudi** (23/515981/TK/56770) - *Software Engineer, Project Manager (PM)*
* **Moses Saidasdo Purba** (23/523274/TK/57854) - *UIUX Designer, AI Engineer*
* **Davana Nico Fadla** (23/522338/TK/57649) - *Cloud Engineer (CE), AI Engineer*

**Project Senior Project TI** *Departemen Teknologi Elektro dan Teknologi Informasi, Fakultas Teknik, Universitas Gadjah Mada*

----

## Jawaban Modul 1: Pembentukan Kelompok & Perumusan Masalah

### A. Nama dan Jenis Produk
* **Nama Produk:** NutriScan
* **Jenis Produk:** Aplikasi Mobile (React Native) / Web App sebagai asisten nutrisi cerdas.

### B. Latar Belakang & Permasalahan
Gaya hidup modern telah mengubah pola konsumsi masyarakat menjadi lebih praktis namun seringkali tidak sehat. Masalah utamanya bukan sekadar karena "makan banyak", melainkan kurangnya kesadaran (awareness) terhadap jumlah kalori yang masuk ke tubuh.

Kebanyakan orang merasa kesulitan jika harus mencatat kalori secara manual menggunakan buku atau mencari satu per satu kalori makanan di internet. Proses manual ini memakan waktu dan membosankan, sehingga banyak orang berhenti melakukan pemantauan diet sebelum mencapai target kesehatan mereka. Di sinilah teknologi Artificial Intelligence dapat memangkas hambatan tersebut dengan memberikan informasi instan melalui foto.

**Rumusan Permasalahan:**
1. Bagaimana cara mempermudah masyarakat dalam menghitung asupan kalori harian tanpa harus melakukan input data secara manual yang rumit?
2. Bagaimana mengintegrasikan teknologi Image Classification (AI) ke dalam platform berbasis Cloud agar data kesehatan pengguna dapat diakses secara real-time dan aman?
3. Sejauh mana akurasi model kecerdasan buatan dalam mengenali berbagai jenis makanan lokal (Indonesia) untuk memberikan estimasi nutrisi yang tepat?

### C. Ide Solusi
Mengembangkan sebuah aplikasi (berbasis mobile/web) bernama NutriScan yang berfungsi sebagai asisten nutrisi cerdas. Solusi ini mengintegrasikan Machine Learning untuk identifikasi makanan secara otomatis, Cloud Computing (Azure) sebagai infrastruktur penyimpanan dan pengolahan data yang skalabel, serta Jaringan Komputer untuk sinkronisasi data antar perangkat secara real-time.

**Rancangan Fitur Solusi:**
* **AI Instant Recognition:** Fitur utama untuk mendeteksi jenis makanan melalui unggahan foto atau kamera secara langsung.
* **Cloud Nutrition Database:** Sinkronisasi hasil deteksi dengan database nutrisi untuk menampilkan kalori, protein, lemak, dan karbohidrat.
* **Personal Daily Dashboard:** Panel visualisasi yang menunjukkan grafik asupan nutrisi harian dan sisa kuota kalori berdasarkan target user.
* **Smart History Log:** Pencatatan riwayat makan otomatis yang dilengkapi dengan stempel waktu dan lokasi (opsional).
* **Nutri-Advice AI:** Memberikan saran singkat (misal: "Asupan lemakmu hari ini sudah tinggi, kurangi gorengan") berdasarkan histori makan.

### D. Analisis Kompetitor

| Nama Kompetitor | Jenis Kompetitor | Kelebihan | Kekurangan |
| :--- | :--- | :--- | :--- |
| **MyFitnessPal** | Direct Competitor | Database makanan sangat besar; Tracking kalori dan makronutrien lengkap; Brand sudah dikenal global. | Analisis kesehatan terbatas; Tidak fokus pada AI personal health insights; Banyak fitur premium berbayar. |
| **FatSecret Indonesia** | Direct Competitor | Database makanan Indonesia sangat lengkap; Fitur komunitas/forum sangat aktif; Hampir semua fitur dasar gratis. | UI/UX terasa jadul dan kaku; Input data masih didominasi cara manual; Belum mengoptimalkan teknologi AI visual. |
| **Google Fit / Apple Health** | Tertiary Competitors | Terintegrasi dengan banyak perangkat; Gratis & mudah digunakan; Ekosistem besar. | Tidak fokus nutrisi; Tidak ada AI analisis makanan; Insight kesehatan terbatas. |

----

## Tabel Test Case

| Operations | Test condition | Action | Input Specification | Output Specification (Expected results) | Notes |
| --- | --- | --- | --- | --- | --- |
| OP-01 Login / Registrasi akun (Autentikasi) | Login positif | User login dengan kredensial valid | Email terdaftar, password benar | Login sukses, token tersimpan, masuk Home | Status 200, session aktif |
| OP-01 Login / Registrasi akun (Autentikasi) | Login negatif | User login dengan password salah | Email terdaftar, password salah | Login gagal, tampil pesan error | Tidak ada token tersimpan |
| OP-01 Login / Registrasi akun (Autentikasi) | Registrasi positif | User mendaftar akun baru | Email unik, password valid, data profil lengkap | Registrasi sukses, akun tercipta | Auto-login atau diarahkan ke login |
| OP-01 Login / Registrasi akun (Autentikasi) | Registrasi negatif | Email sudah terdaftar | Email sudah ada di sistem | Registrasi gagal, tampil pesan error | Validasi sisi client dan server |
| OP-02 Mengakses kamera dan mengambil gambar (Memindai) | Permission granted | User membuka ScanScreen | Izin kamera diberikan | Kamera terbuka, preview tampil | Tidak crash |
| OP-02 Mengakses kamera dan mengambil gambar (Memindai) | Permission denied | User membuka ScanScreen | Izin kamera ditolak | Tampil pesan izin dan CTA aktifkan | Tidak lanjut ke proses scan |
| OP-02 Mengakses kamera dan mengambil gambar (Memindai) | Capture sukses | User menekan tombol capture | Kamera aktif | Foto tersimpan sementara, lanjut ke proses | Format JPG/PNG |
| OP-03 Memproses gambar melalui model AI (AI Inference) | Inference positif | Sistem mengirim gambar valid | File gambar valid, ukuran wajar | Hasil prediksi diterima beserta confidence | Response sukses dari model |
| OP-03 Memproses gambar melalui model AI (AI Inference) | Inference negatif | Sistem mengirim gambar rusak | File corrupt/empty | Proses gagal, tampil error | Tidak simpan hasil |
| OP-04 Menyimpan hasil deteksi dan nilai nutrisi ke database | Simpan positif | Sistem menyimpan hasil scan | Data hasil lengkap (nama, nutrisi, user id) | Data tersimpan, record dibuat | Relasi ke user benar |
| OP-04 Menyimpan hasil deteksi dan nilai nutrisi ke database | Simpan negatif | DB error saat simpan | Data hasil lengkap | Simpan gagal, tampil error | Tidak crash, bisa retry |
| OP-05 Menampilkan hasil scan dan saran nutrisi kepada pengguna | Hasil tersedia | User membuka hasil scan | ID scan valid | Detail makanan, nutrisi, saran tampil | Format angka dan satuan benar |
| OP-05 Menampilkan hasil scan dan saran nutrisi kepada pengguna | Hasil tidak ada | User membuka hasil scan | ID scan tidak valid | Tampil state kosong/error | Tidak crash |
| OP-06 Memuat dan menampilkan halaman Riwayat (HistoryScreen) | Riwayat ada | User membuka HistoryScreen | User login | List riwayat tampil urut terbaru | Pagination jika ada |
| OP-06 Memuat dan menampilkan halaman Riwayat (HistoryScreen) | Riwayat kosong | User baru | User login | Tampil empty state | Pesan informatif |
| OP-07 Memuat dan mengedit halaman Profil (ProfileScreen) | Load profil | User membuka ProfileScreen | User login | Data profil tampil | Sesuai data di DB |
| OP-07 Memuat dan mengedit halaman Profil (ProfileScreen) | Update profil | User edit dan simpan | Field valid | Update sukses, data ter-refresh | Tampil notifikasi sukses |
| OP-07 Memuat dan mengedit halaman Profil (ProfileScreen) | Update invalid | User simpan data tidak valid | Field wajib kosong | Update gagal, tampil validasi | Validasi client dan server |
| OP-08 Logout dari sistem | Logout normal | User menekan Logout | Session aktif | Token dihapus, kembali ke login | Protected route terkunci |
| OP-08 Logout dari sistem | Logout offline | User menekan Logout | Tidak ada koneksi | Session lokal dibersihkan | Optional: revoke token server |

----

## Rencana Pengujian

| Mode Uji (Manual/Otomatis) | Tools yang Digunakan | Requirement dan Spesifikasi Test Environment |
| --- | --- | --- |
| Otomatis (API Backend) | Mocha + Chai + Supertest | Node 18+, backend aktif di `http://localhost:3000`, Supabase test project, file gambar uji (JPG/PNG < 10MB) |
| Otomatis (Auth + DB) | supabase-js (service role) | `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`, tabel `users` dan `food_logs` siap, data uji terisolasi |
| Otomatis (E2E Mobile) | Detox (Android) | Emulator Android, build dev-client Expo/React Native, izin kamera dimock, akun uji tersedia |
| Otomatis (E2E Web) | Playwright | Expo web aktif di `http://localhost:8081`, akun uji tersedia, kamera disimulasi |

### Catatan Keterbatasan Endpoint

Saat ini backend hanya menyediakan endpoint `POST /register`, `POST /upload`, dan `POST /scan`. Login, logout, history, dan profile dilakukan langsung lewat Supabase di frontend. Otomasi untuk OP-01 (login), OP-06 (history), OP-07 (profile), dan OP-08 (logout) memakai `supabase-js` atau E2E UI.

### Kode Snippet/Pseudocode (Otomatis)

#### Prerequisite

```js
const request = require('supertest');
const { createClient } = require('@supabase/supabase-js');

const apiUrl = process.env.API_URL || 'http://localhost:3000';
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
```

#### Hook

```js
let testEmail;
let testPassword = 'Passw0rd!';
let userId;

before(async () => {
	testEmail = `qa_${Date.now()}@example.com`;
});
```

#### Bundle Pengujian 1 - Autentikasi (OP-01, OP-08)

```js
it('OP-01 registrasi via backend', async () => {
	const res = await request(apiUrl)
		.post('/register')
		.send({
			email: testEmail,
			password: testPassword,
			nama: 'QA User',
			usia: 21,
			gender: 'Laki-laki',
			tinggi: 170,
			berat: 60,
			target: 'Jaga Berat Badan',
		});
	if (!res.body.success) throw new Error('Register gagal');
});

it('OP-01 login via Supabase', async () => {
	const { data, error } = await supabaseAdmin.auth.admin.getUserByEmail(testEmail);
	if (error || !data?.user) throw new Error('User tidak ditemukan');
	userId = data.user.id;
});

it('OP-08 logout via Supabase', async () => {
	const { error } = await supabaseAdmin.auth.admin.signOut(userId);
	if (error) throw new Error('Logout gagal');
});
```

#### Bundle Pengujian 2 - Kamera + Inference (OP-02, OP-03)

```js
it('OP-02/03 scan gambar via API', async () => {
	const res = await request(apiUrl)
		.post('/scan')
		.attach('photo', 'tests/fixtures/test_food.jpg');
	if (!res.body.success) throw new Error('Scan gagal');
	if (!res.body.result?.name) throw new Error('Nama makanan kosong');
});
```

#### Bundle Pengujian 3 - Simpan & Riwayat (OP-04, OP-05, OP-06)

```js
it('OP-04 simpan hasil ke food_logs', async () => {
	const { error } = await supabaseAdmin.from('food_logs').insert({
		user_id: userId,
		food_name: 'Nasi Goreng',
		calories: 450,
		protein: 12,
		carbs: 58,
		fat: 18,
		meal_type: 'lunch',
		ai_confidence: 90,
		logged_at: new Date().toISOString(),
	});
	if (error) throw new Error('Insert food_logs gagal');
});

it('OP-06 load history via Supabase', async () => {
	const { data, error } = await supabaseAdmin
		.from('food_logs')
		.select('*')
		.eq('user_id', userId);
	if (error || !Array.isArray(data)) throw new Error('History gagal');
});
```

#### Bundle Pengujian 4 - Profile (OP-07)

```js
it('OP-07 update profile via Supabase', async () => {
	const { error } = await supabaseAdmin.from('users').upsert({
		id: userId,
		full_name: 'QA User Updated',
		height: 172,
		weight: 61,
	});
	if (error) throw new Error('Update profil gagal');
});
```

### Snapshot/Screenshot (Jika Masih Manual)

Jika ada langkah manual, lampirkan screenshot saat login, permission kamera, hasil scan, riwayat, edit profil, dan logout.

----

## Setup Otomasi

### Struktur Folder (Disarankan)

```
NutriScan/
	tests/
		api/
			auth.spec.js
			scan.spec.js
			history.spec.js
			profile.spec.js
		fixtures/
			test_food.jpg
		helpers/
			supabaseAdmin.js
```

### Instalasi Dependency (Backend)

```
cd backend
npm install --save-dev mocha chai supertest
```

### Konfigurasi Environment

Buat file `.env.test` (atau pakai `.env`) dengan:

```
API_URL=http://localhost:3000
SUPABASE_URL=... 
SUPABASE_SERVICE_ROLE_KEY=...
```

### Contoh Script Package.json (Backend)

Tambahkan script berikut pada `backend/package.json`:

```
"scripts": {
	"test": "mocha \"tests/api/**/*.spec.js\" --timeout 20000"
}
```

### Menjalankan Otomasi

```
cd backend
npm start
```

Di terminal lain:

```
cd backend
npm test
```

----

## Snapshot & Artifact yang Diperlukan

### 1. Pseudocode & Dokumentasi

| Bagian | Artifact | Deskripsi |
| --- | --- | --- |
| Prerequisite | `.env` template | File konfigurasi dengan semua variabel yang diperlukan |
| Prerequisite | `package.json` snippet | Dependencies versi yang digunakan (mocha, chai, supertest, supabase-js) |
| Prerequisite | DB Schema | Screenshot atau SQL dari tabel `users`, `food_logs` di Supabase |
| Hooks | Initialization log | Output saat setup test environment (contoh: database cleanup, test user creation) |
| Bundles | Pseudocode per OP | Kode atau pseudocode terstruktur untuk masing-masing OP (sudah ada di docs) |

### 2. Test Environment Specification

#### Setup Verification Checklist

Sebelum menjalankan otomasi, verifikasi:

```
✓ Node.js 18+ terinstall
  └─ Command: node --version
  
✓ Backend aktif di http://localhost:3000
  └─ Command: npm start (di backend/)
  └─ Cek: curl http://localhost:3000 (atau buka di browser)
  
✓ Supabase project aktif
  └─ Verifikasi: masuk ke dashboard Supabase
  └─ Cek tabel: users, food_logs tersedia
  
✓ .env file terisi dengan benar
  └─ SUPABASE_URL ≠ empty
  └─ SUPABASE_SERVICE_ROLE_KEY ≠ empty
  └─ API_URL = http://localhost:3000
  
✓ Test image siap
  └─ File: backend/tests/fixtures/test_food.jpg (< 10MB)
  
✓ Dependencies terinstall
  └─ Command: npm list (di backend/)
```

#### Environment Snapshot

Kumpulkan sebelum test run:

| Item | How to Capture | Format |
| --- | --- | --- |
| Node & NPM version | `node --version && npm --version` | Screenshot/log |
| .env (sanitized) | `cat .env` (hapus rahasia) | Screenshot |
| Backend readiness | `curl -i http://localhost:3000` | Log/screenshot |
| Supabase table check | SELECT COUNT(*) FROM users/food_logs | Screenshot query result |
| Test fixture check | `ls -lh tests/fixtures/` | Screenshot |
| Package.json devDependencies | Extract mocha/chai/supertest versions | Screenshot |

### 3. Test Execution Artifacts

#### Per Bundle Pengujian

| OP | What to Capture | File/Format | Timing |
| --- | --- | --- | --- |
| OP-01 Auth | Register response JSON, userId generated, Supabase user record | `stdout.log`, screenshot DB | After bundle 1 |
| OP-02 Scan | Test image path, API response (name, calories, confidence) | `scan-response.json` | After bundle 2 |
| OP-03 Inference | Model prediction output, top 3 predictions, detection confidence | `inference-output.json` | After bundle 2 |
| OP-04 Save | food_logs insert success, record ID, user_id match | `food-logs-record.json` | After bundle 3 |
| OP-05 Display | Query result dari food_logs, format nutrition macros | `history-query.json` | After bundle 3 |
| OP-06 History | List of all food_logs untuk user, sorting (newest first) | `history-list.json` | After bundle 3 |
| OP-07 Profile | users table update result, new height/weight values | `profile-update.json` | After bundle 4 |
| OP-08 Logout | Supabase signOut success, session revoked | `logout-status.log` | After bundle 1 |

#### Test Run Log

```
Jalankan:
  npm test 2>&1 | tee test-run-$(date +%Y%m%d_%H%M%S).log

Capture:
  1. Full console output (STDOUT + STDERR)
  2. Test summary (passed/failed count)
  3. Error messages (jika ada)
  4. Timing per test
```

#### API Response Examples

Simpan response body dari setiap endpoint:

**POST /register success:**
```json
{
  "success": true,
  "profileSaved": true
}
```

**POST /scan success:**
```json
{
  "success": true,
  "imageUrl": "https://...",
  "result": {
    "name": "Nasi Goreng",
    "accuracy": 94,
    "calories": 450,
    "macros": {
      "protein": 12,
      "carbs": 58,
      "fat": 18
    }
  }
}
```

**Supabase food_logs insert:**
```json
{
  "data": [{
    "id": "uuid-here",
    "user_id": "user-uuid",
    "food_name": "Nasi Goreng",
    "calories": 450,
    "logged_at": "2026-05-19T10:30:00Z"
  }],
  "error": null
}
```

### 4. Requirement Checklist

#### Pre-Requisites (Sebelum Test)

- [ ] Backend server aktif & listening di port 3000
- [ ] Supabase project aktif & accessible
- [ ] .env file terkonfigurasi lengkap
- [ ] Python + dependencies terinstall (untuk model inference)
- [ ] Model file (`best.pt`) tersedia di `backend/model/`
- [ ] Test image (`test_food.jpg`) tersedia di `backend/tests/fixtures/`
- [ ] Mocha, Chai, Supertest terinstall di backend
- [ ] Database connection stable
- [ ] Network connectivity baik (backend ↔ Supabase)

#### Test Environment Specification

```
OS: Windows/Mac/Linux
Node: 18.x LTS minimum
NPM: 9.x minimum
Python: 3.8+

Backend Stack:
  - Express 5.2.1
  - Supabase JS SDK 2.103.3
  - Multer 2.1.1
  
Test Stack:
  - Mocha 11.7.1
  - Chai 5.3.3
  - Supertest 7.1.3
  
Database:
  - Supabase Postgres
  - Tables: users, food_logs
  - Storage: scan_photos bucket
  
Network:
  - Backend: http://localhost:3000
  - Supabase: Online API
  - Firewall: Port 3000 accessible
```

#### Post-Test Artifacts (Setelah Test)

- [ ] `test-run-TIMESTAMP.log` (full console output)
- [ ] `test-results.json` (Mocha JSON reporter output)
- [ ] Screenshots/screenshots dari:
  - Supabase auth users list (verify users created)
  - Supabase food_logs data (verify records inserted)
  - Backend console output (verify scan success)
- [ ] Error logs (jika ada failure)
- [ ] Performance metrics (test execution time per bundle)

### 5. Dokumentasi Test Report Template

```
# Test Report - NutriScan v1.0

**Date:** [YYYY-MM-DD]
**Environment:** [dev/test/prod]
**Tester:** [nama]

## Summary
- Total Tests: 8
- Passed: X
- Failed: X
- Skipped: X
- Duration: X seconds

## Per-Bundle Results

### Bundle 1: Auth (OP-01, OP-08)
- ✓/✗ OP-01 Registrasi
- ✓/✗ OP-01 Login
- ✓/✗ OP-08 Logout

### Bundle 2: Scan (OP-02, OP-03)
- ✓/✗ OP-02 Camera access
- ✓/✗ OP-03 Inference result

### Bundle 3: History (OP-04, OP-06)
- ✓/✗ OP-04 Save to DB
- ✓/✗ OP-06 Load history

### Bundle 4: Profile (OP-07)
- ✓/✗ OP-07 Update profile

## Error Log
[Paste any errors encountered]

## Artifacts Attached
- [ ] test-run.log
- [ ] test-results.json
- [ ] Screenshots (auth, scan, history, profile)
```