# NutriScan Backend

AI-powered food recognition API using PyTorch MobileNetV2 model.

## Structure

```
backend/
├── model/                          # AI Model files
│   ├── food_model_final (1).pth   # MobileNetV2 trained on 101 food classes
│   ├── inference.py               # Model inference script
│   └── requirements.txt            # Python dependencies for inference
├── server.js                       # Express.js API server
├── package.json                    # Node.js dependencies
├── .env                            # Environment variables (not tracked)
├── .env.example                    # Environment variables template
└── photos/                         # Test images (not tracked)
```

## Setup

### 1. Install Node Dependencies
```bash
npm install
```

### 2. Install Python Dependencies
```bash
pip install -r model/requirements.txt
```

### 3. Configure Environment
Copy `.env.example` to `.env` and fill in your Supabase credentials:
```bash
cp .env.example .env
```

**Required Variables:**
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (for admin operations)

**Optional Variables:**
- `MODEL_PATH` - Path to model file (default: `./model/food_model_final (1).pth`)
- `PYTHON_EXECUTABLE` - Python executable path (default: `python`)
- `FOOD_LABELS` - Comma-separated food class names

### 4. Start Server
```bash
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### POST /scan
Upload a food photo for AI recognition.

**Request:**
```
Content-Type: multipart/form-data
Body: {
  photo: <image file>
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://...",
  "result": {
    "name": "pizza",
    "accuracy": 95,
    "calories": 285,
    "macros": {
      "protein": 12,
      "carbs": 36,
      "fat": 9
    },
    "topPredictions": [
      {"label": "pizza", "confidence": 0.95},
      {"label": "focaccia", "confidence": 0.03},
      {"label": "flatbread", "confidence": 0.02}
    ]
  }
}
```

### POST /register
User registration with auto-confirmation.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nama": "John Doe",
  "usia": 25,
  "gender": "male",
  "tinggi": 180,
  "berat": 75,
  "target": "Jaga Berat Badan"
}
```

### Details

- **Model**: MobileNetV2 pre-trained backbone
- **Classes**: 101 food types from Food-101 dataset
- **Architecture**: Features extraction → 2-layer classifier (1280 → 512 → 101)
- **Inference Mode**: Deterministic (eval mode, no dropout randomness)

## Model Details

- **Input**: 224×224 RGB image
- **Output**: Softmax probabilities over 101 food classes
- **Preprocessing**: Normalization with ImageNet means/stds
- **Confidence Score**: Model's max softmax probability

## Debugging

Debug scripts (not tracked in git):
- `inspect_model.py` - Model architecture inspection
- `inspect_state_dict.py` - State dict key analysis
- `photos/` - Test images for development

Run debug manually:
```bash
python inspect_model.py
```

## Troubleshooting

**"Model loading failed"**
- Ensure `food_model_final (1).pth` exists
- Check Python dependencies: `pip install -r model/requirements.txt`

**"Supabase connection error"**
- Verify `.env` file has correct Supabase credentials
- Check network connectivity

**"Inconsistent predictions"**
- Ensure model is in eval mode (no randomness)
- Check for Dropout layers being disabled properly
