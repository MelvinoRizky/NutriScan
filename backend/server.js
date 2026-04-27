require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json()); // Penting buat baca req.body JSON

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client biasa buat upload foto
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin (service role) buat auto-confirm user pas register
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const GOAL_TYPE_MAP = {
  'Turun Berat Badan': 'lose',
  'Naik Berat Badan': 'gain',
  'Jaga Berat Badan': 'maintain',
};

// =====================
// POST /register
// Daftarin user baru & auto-confirm email (no email verification needed!)
// =====================
app.post('/register', async (req, res) => {
  try {
    const { email, password, nama, usia, gender, tinggi, berat, target } = req.body;

    if (!email || !password || !nama) {
      return res.status(400).json({ success: false, message: 'Email, password, dan nama wajib diisi.' });
    }

    // Bikin user pake admin client → email_confirm: true = langsung aktif, gak perlu klik email
    const { data, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (signUpError) {
      console.error('Register error:', signUpError);
      if (signUpError.message.includes('already been registered') || signUpError.message.includes('already exists')) {
        return res.status(400).json({ success: false, message: 'Email ini sudah terdaftar. Coba login ya!' });
      }
      return res.status(400).json({ success: false, message: signUpError.message });
    }

    const userId = data.user?.id;
    if (!userId) {
      return res.status(500).json({ success: false, message: 'Gagal mendapatkan ID user.' });
    }

    // Insert profil ke tabel users
    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      full_name: nama,
      email: email,
      age: usia ? parseInt(usia) : null,
      gender: gender || null,
      height: tinggi ? parseFloat(tinggi) : null,
      weight: berat ? parseFloat(berat) : null,
      goal_type: target ? GOAL_TYPE_MAP[target] : null,
    });

    if (insertError) {
      console.error('Insert profil error:', insertError);
      // Akun berhasil dibuat, tapi profil gagal → tetap sukses tapi kasih info
      return res.json({ success: true, profileSaved: false });
    }

    console.log('✅ User baru terdaftar:', email);
    return res.json({ success: true, profileSaved: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
});

// =====================
// POST /upload
// Upload foto scan ke Supabase Storage
// =====================
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload' });
    }

    const filename = `photo_${Date.now()}.jpg`;

    const { data, error } = await supabaseAdmin.storage
      .from('scan_photos')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype || 'image/jpeg',
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ success: false, message: 'Gagal upload ke Supabase' });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('scan_photos')
      .getPublicUrl(filename);

    console.log('✅ Foto terupload:', publicUrl);
    res.json({ success: true, url: publicUrl, filename: filename });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Backend berjalan! Terkoneksi dengan Supabase Storage');
});