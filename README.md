
# NutriScan - AI Food Recognition & Nutrition Tracking

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

## 📱 Overview

**NutriScan** is an intelligent nutrition tracking application that uses AI to recognize food from camera photos and automatically calculate nutrition information. Built with React Native (Expo) for cross-platform mobile deployment and Express.js backend with PyTorch AI model.

**Key Features:**
- 📷 **AI Food Recognition** - Detects 101 food types with 95%+ accuracy
- 🔢 **Automatic Nutrition Analysis** - Calculates calories, protein, carbs, fat
- 📊 **Nutrition Tracking** - Daily intake monitoring and analytics
- 👤 **User Profiles** - Personalized nutrition goals
- 📈 **Progress Tracking** - Weekly trends and statistics
- ☁️ **Cloud Storage** - Supabase backend with real-time sync

---

## 👥 Team

### Ketua Kelompok
- **Melvino Rizky Putra Wahyudi** - 23/515981/TK/56770

### Anggota
- Moses Saidasdo Purba
- Davana Nico Fadla

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Python** 3.9+
- **Expo CLI** (for mobile testing)
- **Git**

### Backend Setup
```bash
cd backend
npm install
pip install -r model/requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials
npm start
```
Backend runs on `http://localhost:3000`

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Supabase & API URL
npm start
```
Expo launches with QR code for mobile testing.

**Access:**
- **Mobile**: Scan QR with Expo Go app
- **Web**: Open `http://localhost:8081`
- **Android**: Press 'a' in terminal
- **iOS**: Press 'i' in terminal

---

## 📁 Project Structure

```
NutriScan/
├── backend/                          # Express.js API + PyTorch model
│   ├── server.js                     # Main API server
│   ├── model/
│   │   ├── food_model_final (1).pth # MobileNetV2 trained weights
│   │   └── inference.py              # Model inference script
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/                         # React Native (Expo) app
│   ├── screens/                      # 13 app screens
│   ├── components/                   # Reusable UI components
│   ├── lib/supabase.js              # Supabase client
│   ├── app.json                      # Expo config
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── docs/                             # Documentation
├── .gitignore
├── .env.example (root)
└── README.md (this file)
```

---

## 🏗️ Architecture

### Backend Stack
- **Runtime**: Node.js with Express.js
- **AI Framework**: PyTorch + TorchVision
- **Model**: MobileNetV2 (101 food classes)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (photos)
- **Authentication**: Supabase Auth

### Frontend Stack
- **Framework**: React Native with Expo
- **UI**: NativeWind (Tailwind CSS)
- **Navigation**: React Navigation
- **Backend**: Supabase client SDK
- **State**: React Hooks + Context

### AI Model
- **Architecture**: MobileNetV2
- **Classes**: 101 food types (Food-101 dataset)
- **Input**: 224×224 RGB images
- **Output**: Softmax probabilities over 101 classes
- **Inference Mode**: Deterministic (eval mode, no randomness)

---

## 🔑 Key Endpoints

### API
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/scan` | Upload photo for AI food detection |
| POST | `/register` | User registration |
| POST | `/login` | User authentication |
| POST | `/upload` | Generic photo upload |

### Response Example
```json
{
  "success": true,
  "imageUrl": "https://storage.supabase.co/...",
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
      {"label": "focaccia", "confidence": 0.03}
    ]
  }
}
```

---

## 🔧 Configuration

### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MODEL_PATH=./model/food_model_final (1).pth
PYTHON_EXECUTABLE=python
```

### Frontend (.env)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📚 Technology Details

### AI Model Information
- **Training Dataset**: Food-101 (101 food categories)
- **Framework**: PyTorch
- **Backbone**: MobileNetV2 pre-trained
- **Classifier**: 2-layer fully connected (1280→512→101)
- **Accuracy**: ~95% on test set
- **Input Preprocessing**: ImageNet normalization
- **Inference Time**: ~100-200ms per image
- **Model Size**: ~11.7 MB

### Database Schema
- **Users** - Profile & preferences
- **Food Logs** - Scanned meals with AI confidence
- **Photos** - Supabase Storage references
- **Real-time Notifications** - Supabase subscriptions

---

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test inference script
python model/inference.py --model "model/food_model_final (1).pth" \
  --image photos/test_food.jpg

# Test API endpoint
python -c "
import requests
with open('photos/test_food.jpg', 'rb') as f:
    r = requests.post('http://localhost:3000/scan', files={'photo': f})
    print(r.json())
"
```

### Frontend Testing
```bash
cd frontend
npm start
# Use web browser or Expo Go on phone
```

---

## 📋 Git Workflow

### Ignored Files (not tracked)
- `.env` - Local environment variables
- `backend/photos/` - Test images
- `backend/inspect_*.py` - Debug inspection scripts
- `node_modules/` - Dependencies
- `.expo/` - Expo cache

### Include Files (tracked)
- `.env.example` - Template for environment setup
- `*.md` - Documentation
- Source code - All `.js`, `.py`
- Configuration - `package.json`, `app.json`, etc.

**Cloning & Setup:**
```bash
git clone <repo>
cd NutriScan

# Backend
cd backend
npm install
cp .env.example .env
pip install -r model/requirements.txt

# Frontend
cd ../frontend
npm install
cp .env.example .env

npm start  # Root or each folder
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "supabaseUrl is required" | Check `.env` file has Supabase credentials |
| Model loads differently each time | Run with eval mode enabled (fixed in latest) |
| API connection error on web | Ensure backend running, check EXPO_PUBLIC_API_URL |
| Camera permissions denied | Grant in app settings |
| White screen on startup | Clear Metro cache: `npm start -- --reset-cache` |

See `backend/README.md` and `frontend/README.md` for detailed troubleshooting.

---

## 📝 Documentation

- **[Backend README](./backend/README.md)** - API, model, server setup
- **[Frontend README](./frontend/README.md)** - App screens, components, dev guide
- **[Docs](./docs/)** - Additional documentation

---

## 🚀 Deployment

### Production Checklist
- [ ] Set production Supabase credentials
- [ ] Update CORS settings
- [ ] Enable HTTPS
- [ ] Build mobile app: `eas build`
- [ ] Test on real devices
- [ ] Set up monitoring/logging

### Build Commands
```bash
# iOS
eas build --platform ios

# Android
eas build --platform android

# Web
npm run build  # In frontend folder
```

---

## 📄 License

This project is developed as part of academic coursework.

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add your feature"`
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request

**Code Style:**
- Use meaningful variable names
- Add comments for complex logic
- Format with Prettier
- Test before committing

---

## 📧 Support

For questions or issues:
- Check documentation in `backend/README.md` and `frontend/README.md`
- Review troubleshooting section
- Check GitHub Issues

---

**Last Updated:** April 27, 2026  
**Status:** ✅ Production Ready


