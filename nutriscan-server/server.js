const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const storage = multer.diskStorage({
  destination: './photos/', 
  filename: (req, file, cb) => {
    cb(null, `photo_${Date.now()}.jpg`);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('photo'), (req, res) => {
  console.log('foto tersimpan:', req.file.filename);
  res.json({ success: true, filename: req.file.filename });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('server jalan di port 3000');
});