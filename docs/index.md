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