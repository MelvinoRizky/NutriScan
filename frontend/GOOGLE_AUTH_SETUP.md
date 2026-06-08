# Setup Login Google (Supabase + Google Cloud)

Kode klien sudah selesai (`lib/googleAuth.js`, tombol di `LoginScreen`, `scheme: "nutriscan"`
di `app.json`). Agar tombol **"Lanjutkan dengan Google"** berfungsi, lakukan konfigurasi
berikut di dashboard — ini **tidak bisa** dilakukan dari kode.

## 1. Google Cloud Console — buat OAuth Client

1. Buka <https://console.cloud.google.com> → buat / pilih project.
2. **APIs & Services → OAuth consent screen**: pilih *External*, isi nama app & email, simpan.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
4. Application type: **Web application**.
5. Di **Authorized redirect URIs**, tambahkan callback Supabase:
   ```
   https://<PROJECT-REF>.supabase.co/auth/v1/callback
   ```
   (`<PROJECT-REF>` = subdomain project Supabase kamu, lihat di URL dashboard Supabase.)
6. Simpan, lalu salin **Client ID** dan **Client Secret**.

## 2. Supabase — aktifkan provider Google

1. Dashboard Supabase → **Authentication → Providers → Google**.
2. Toggle **Enable**, tempel **Client ID** & **Client Secret** dari langkah 1, simpan.

## 3. Supabase — daftarkan Redirect URL aplikasi

Dashboard Supabase → **Authentication → URL Configuration → Redirect URLs**, tambahkan:

```
nutriscan://auth-callback      # build native / development build
exp://localhost:8081           # Expo Go (sesuaikan host/port yang muncul saat `expo start`)
http://localhost:8081          # Expo Web (dev)
```

> Saat menjalankan `expo start`, perhatikan URL `exp://...` yang ditampilkan dan pastikan
> ada di daftar Redirect URLs (host/port bisa berbeda di tiap jaringan).
> Untuk web yang sudah dideploy, tambahkan juga origin produksinya (mis. `https://app-kamu.com`).

## 4. Catatan teknis

- **Expo Go vs Development Build**: deep link `nutriscan://` hanya jalan penuh di
  *development build* / app hasil EAS Build. Di **Expo Go**, `makeRedirectUri` otomatis
  memakai skema `exp://` (sudah ditangani oleh `expo-auth-session`), jadi pastikan URL
  `exp://...` terdaftar di Supabase.
- Flow yang dipakai: **PKCE** (`flowType: 'pkce'` di `lib/supabase.js`). Callback berisi
  `code` lalu ditukar via `exchangeCodeForSession`. Fallback ke implicit flow juga ditangani.
- **Web**: memakai redirect penuh `signInWithOAuth` + `detectSessionInUrl`, session
  otomatis terbaca saat kembali ke origin.

## 5. Uji coba

1. Jalankan `npm start` di `frontend/`.
2. Buka layar Login → tap **Lanjutkan dengan Google**.
3. Browser auth terbuka → pilih akun Google → kembali ke app dan masuk ke `MainTabs`.

Jika gagal, cek:
- Redirect URL persis sama (termasuk skema & port) antara yang muncul di app dan yang
  terdaftar di Supabase.
- Provider Google sudah *enabled* dan Client ID/Secret benar.
- Tabel `users` punya baris untuk user baru bila layar lain mengandalkannya (user dari
  Google mungkin belum punya profil — pertimbangkan membuat profil default saat pertama login).
