# Setup Saran AI (Google Gemini — GRATIS)

Fitur **Saran AI** memakai **Google Gemini** (model `gemini-2.0-flash`) lewat **free tier**
Google AI Studio — **gratis, tanpa kartu kredit**. Saran dibuat berdasarkan profil + target +
makanan hari ini milik user, jadi **selalu sesuai kondisinya**.

> Sebelumnya sempat dirancang pakai Claude/OpenAI, tapi keduanya butuh top-up berbayar.
> Gemini free tier dipilih karena benar-benar gratis untuk skala aplikasi ini.

## 1. Ambil API key (gratis, tanpa kartu kredit)

1. Buka **<https://aistudio.google.com/apikey>** → login dengan akun Google.
2. Klik **Create API key** → salin key-nya (diawali `AIza...`).
3. Selesai. Tidak perlu billing/kartu kredit untuk free tier.

**Batas free tier** (cukup untuk app ini): umumnya ~15 permintaan/menit dan ratusan–ribuan
permintaan/hari per model. Lebih dari cukup untuk penggunaan normal NutriScan.

## 2. Konfigurasi backend

Tambahkan ke `backend/.env`:

```
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxx
GEMINI_MODEL=gemini-2.0-flash
```

Lalu jalankan ulang backend:

```powershell
cd backend; npm start
```

## 3. Cara kerja

- Endpoint: **`POST /advice`** — body `{ "userId": "<id user>" }`.
- Backend mengambil **profil, target, dan log makanan hari ini** langsung dari Supabase
  (service role), menyusun prompt, lalu memanggil **Gemini REST API** dengan **structured
  output** (`responseSchema`) sehingga hasilnya rapi berupa array `{ category, title, body }`
  (kategori: `positif` / `perhatian` / `tips`) yang dipetakan ke kartu di layar Saran.
- Frontend (`AdviceScreen`) memanggil endpoint ini. Jika API gagal / key kosong / offline,
  layar otomatis **fallback** ke saran berbasis aturan lama (tidak error). Saat AI aktif,
  subjudul header menampilkan "✨ Dibuat oleh AI sesuai kondisimu".
- Implementasi pakai `fetch` langsung ke REST Gemini (tanpa SDK) supaya tahan perubahan versi.

## 4. Uji cepat

```powershell
curl.exe -X POST http://localhost:3000/advice -H "Content-Type: application/json" -d "{\"userId\":\"<USER_ID>\"}"
```

Respon sukses:

```json
{
  "success": true,
  "source": "ai",
  "advice": [
    { "category": "perhatian", "title": "Protein masih kurang", "body": "Asupan protein baru 28 g dari target 80 g. Tambah telur atau ayam saat makan malam." }
  ],
  "summary": { "total": 4, "positif": 1, "perhatian": 2, "tips": 1 },
  "stats": { "calories": 1200, "protein": 28, "carbs": 150, "fat": 40, "mealCount": 2 }
}
```

Kalau `GEMINI_API_KEY` kosong, endpoint balas `503` dan app tetap menampilkan saran berbasis aturan.

## 5. Mengganti model (semua di free tier)

Ubah `GEMINI_MODEL` di `.env`:
- `gemini-2.0-flash` — cepat & gratis (default, direkomendasikan)
- `gemini-2.5-flash` — lebih pintar, tetap di free tier (kuota lebih ketat)
- `gemini-2.0-flash-lite` — paling ringan/hemat kuota
