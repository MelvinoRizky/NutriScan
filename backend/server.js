require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
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

const MODEL_PATH = process.env.MODEL_PATH || path.join(__dirname, 'model', 'best.pt');
const INFERENCE_SCRIPT_PATH = path.join(__dirname, 'model', 'inference.py');
const PYTHON_EXECUTABLE = process.env.PYTHON_EXECUTABLE || 'python';
const FOOD_LABELS = process.env.FOOD_LABELS || '';

const NUTRITION_LOOKUP = {
  'apple_pie': { calories: 250, protein: 3, carbs: 35, fat: 11 },
  'baby_back_ribs': { calories: 320, protein: 28, carbs: 0, fat: 24 },
  'baklava': { calories: 300, protein: 5, carbs: 30, fat: 18 },
  'beef_carpaccio': { calories: 275, protein: 26, carbs: 1, fat: 19 },
  'beef_tartare': { calories: 280, protein: 27, carbs: 2, fat: 19 },
  'beet_salad': { calories: 95, protein: 4, carbs: 18, fat: 1 },
  'beignets': { calories: 210, protein: 3, carbs: 24, fat: 12 },
  'bibimbap': { calories: 280, protein: 8, carbs: 32, fat: 13 },
  'bread_pudding': { calories: 280, protein: 6, carbs: 32, fat: 14 },
  'breakfast_burrito': { calories: 360, protein: 14, carbs: 32, fat: 20 },
  'bruschetta': { calories: 90, protein: 3, carbs: 12, fat: 4 },
  'caesar_salad': { calories: 120, protein: 8, carbs: 6, fat: 8 },
  'cannoli': { calories: 240, protein: 4, carbs: 28, fat: 12 },
  'caprese_salad': { calories: 150, protein: 8, carbs: 6, fat: 11 },
  'carrot_cake': { calories: 280, protein: 3, carbs: 35, fat: 14 },
  'ceviche': { calories: 120, protein: 16, carbs: 6, fat: 4 },
  'cheese_plate': { calories: 350, protein: 22, carbs: 8, fat: 28 },
  'cheesecake': { calories: 320, protein: 5, carbs: 28, fat: 22 },
  'chicken_curry': { calories: 240, protein: 18, carbs: 12, fat: 13 },
  'chicken_quesadilla': { calories: 380, protein: 20, carbs: 28, fat: 22 },
  'chicken_wings': { calories: 260, protein: 20, carbs: 2, fat: 20 },
  'chocolate_cake': { calories: 300, protein: 4, carbs: 35, fat: 16 },
  'chocolate_mousse': { calories: 250, protein: 4, carbs: 20, fat: 18 },
  'churros': { calories: 220, protein: 2, carbs: 22, fat: 14 },
  'clam_chowder': { calories: 180, protein: 8, carbs: 16, fat: 10 },
  'club_sandwich': { calories: 360, protein: 22, carbs: 28, fat: 18 },
  'crab_cakes': { calories: 220, protein: 14, carbs: 14, fat: 12 },
  'creme_brulee': { calories: 280, protein: 3, carbs: 24, fat: 20 },
  'croque_madame': { calories: 420, protein: 18, carbs: 28, fat: 26 },
  'cup_cakes': { calories: 240, protein: 2, carbs: 28, fat: 13 },
  'default': { calories: 300, protein: 10, carbs: 35, fat: 12 },
};

function runInference(imagePath) {
  return new Promise((resolve, reject) => {
    const args = [INFERENCE_SCRIPT_PATH, '--model', MODEL_PATH, '--image', imagePath];
    if (FOOD_LABELS.trim()) {
      args.push('--labels', FOOD_LABELS);
    }

    const py = spawn(PYTHON_EXECUTABLE, args, {
      cwd: __dirname,
    });

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    py.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    py.on('error', (err) => {
      reject(new Error(`Gagal menjalankan Python: ${err.message}`));
    });

    py.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Inference gagal (exit ${code}): ${stderr || stdout}`));
        return;
      }

      try {
        const parsed = JSON.parse(stdout);
        resolve(parsed);
      } catch (err) {
        reject(new Error(`Output inference bukan JSON valid: ${stdout}`));
      }
    });
  });
}

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
      const errMsg = (signUpError.message || '').toLowerCase();
      const isDuplicate =
        errMsg.includes('already been registered') ||
        errMsg.includes('already exists') ||
        errMsg.includes('already registered') ||
        errMsg.includes('duplicate') ||
        errMsg.includes('user already') ||
        signUpError.status === 422;
      if (isDuplicate) {
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

// =====================
// POST /scan
// Upload foto + jalankan model AI
// =====================
app.post('/scan', upload.single('photo'), async (req, res) => {
  let tempFilePath;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Tidak ada file yang diupload' });
    }

    // ✅ Validasi ukuran file (minimal 1KB, maksimal 10MB)
    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ success: false, message: 'File kosong. Upload ulang ya!' });
    }

    if (req.file.buffer.length < 1024) {
      console.error(`File terlalu kecil: ${req.file.buffer.length} bytes`);
      return res.status(400).json({ success: false, message: 'File terlalu kecil - bukan image yang valid' });
    }

    if (req.file.buffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File terlalu besar (max 10MB)' });
    }

    // ✅ Validasi MIME type
    const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validMimes.includes(req.file.mimetype)) {
      console.error(`Invalid MIME type: ${req.file.mimetype}`);
      return res.status(400).json({ success: false, message: 'Format file tidak didukung. Gunakan JPEG atau PNG' });
    }

    const extension = (req.file.mimetype && req.file.mimetype.includes('png')) ? 'png' : 'jpg';
    const filename = `scan_${Date.now()}.${extension}`;
    tempFilePath = path.join(__dirname, 'photos', filename);

    await fs.writeFile(tempFilePath, req.file.buffer);
    console.log(`✅ File saved: ${tempFilePath} (${req.file.buffer.length} bytes)`);

    const inference = await runInference(tempFilePath);
    const detectedName = inference?.prediction || 'Makanan Tidak Dikenal';
    const confidence = Number(inference?.confidence || 0);

    // ✅ QUERY NUTRISI DARI DATABASE foods_ref (bukan hardcoded NUTRITION_LOOKUP)
    let nutrition = null;
    try {
      const { data, error } = await supabase
        .from('foods_ref')
        .select('base_calories, base_protein, base_carbs, base_fat, base_fiber, base_sodium, base_sugar, base_cholesterol, serving_size_g')
        .eq('food_name', detectedName)
        .single();

      if (!error && data) {
        nutrition = {
          calories: data.base_calories || 300,
          protein: data.base_protein || 10,
          carbs: data.base_carbs || 35,
          fat: data.base_fat || 12,
          fiber: data.base_fiber || 3,
          sodium: data.base_sodium || 500,
          sugar: data.base_sugar || 5,
          cholesterol: data.base_cholesterol || 0,
        };
      }
    } catch (dbErr) {
      console.warn('Gagal query foods_ref:', dbErr.message);
    }

    // ✅ FALLBACK ke NUTRITION_LOOKUP jika database belum punya data
    if (!nutrition) {
      nutrition = NUTRITION_LOOKUP[detectedName] || NUTRITION_LOOKUP.default;
      console.log(`⚠️ Nutrisi dari LOOKUP (fallback) untuk: ${detectedName}`);
    } else {
      console.log(`✅ Nutrisi dari DATABASE untuk: ${detectedName}`);
    }

    // ✅ Count ALL objects from detections (not just top 3)
    const objectCounts = {};
    if (inference?.all_detections && Array.isArray(inference.all_detections)) {
      inference.all_detections.forEach(det => {
        const label = det.label || 'unknown';
        objectCounts[label] = (objectCounts[label] || 0) + 1;
      });
    } else if (inference?.top_predictions && Array.isArray(inference.top_predictions)) {
      // Fallback to top_predictions if all_detections not available
      inference.top_predictions.forEach(pred => {
        const label = pred.label || 'unknown';
        objectCounts[label] = (objectCounts[label] || 0) + 1;
      });
    }

    const storageFilename = `photo_${Date.now()}.${extension}`;
    const { error } = await supabaseAdmin.storage
      .from('scan_photos')
      .upload(storageFilename, req.file.buffer, {
        contentType: req.file.mimetype || 'image/jpeg',
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ success: false, message: 'Gagal upload foto hasil scan' });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('scan_photos')
      .getPublicUrl(storageFilename);

    return res.json({
      success: true,
      imageUrl: publicUrl,
      result: {
        name: detectedName,
        accuracy: Math.round(confidence * 100),
        calories: nutrition.calories,
        macros: {
          protein: nutrition.protein,
          carbs: nutrition.carbs,
          fat: nutrition.fat,
        },
        topPredictions: inference?.all_detections || inference?.top_predictions || [],
        objectCounts: objectCounts, // ✅ Count info from ALL detections
        detectionData: {
          totalDetections: inference?.total_detections || inference?.all_detections?.length || 0,
          allDetections: inference?.all_detections || [],  // ✅ Pass all detection data including bbox
          message: inference?.message || null,
        },
      },
    });
  } catch (err) {
    console.error('Scan error:', err);
    
    // ✅ Provide better error messages based on error type
    let userMessage = 'Terjadi kesalahan saat scan AI';
    
    if (err.message.includes('Cannot read image file') || err.message.includes('corrupt')) {
      userMessage = 'File image corrupt atau invalid. Coba foto lagi dengan cahaya lebih baik.';
    } else if (err.message.includes('file is empty') || err.message.includes('too small')) {
      userMessage = 'File image terlalu kecil. Coba ambil foto dengan resolusi lebih tinggi.';
    } else if (err.message.includes('No detections found') || err.message.includes('No inference')) {
      userMessage = 'Tidak ada makanan yang terdeteksi. Pastikan foto fokus pada makanan.';
    } else if (err.message) {
      userMessage = err.message;
    }
    
    return res.status(500).json({ success: false, message: userMessage });
  } finally {
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupErr) {
        console.warn('Gagal hapus file sementara:', cleanupErr.message);
      }
    }
  }
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Backend berjalan! Terkoneksi dengan Supabase Storage');
});