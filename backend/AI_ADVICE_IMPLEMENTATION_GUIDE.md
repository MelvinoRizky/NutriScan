# 🤖 REKOMENDASI AI API UNTUK USER ADVICE/TIPS

## 📌 USECASE
Memberikan saran nutrisi personal kepada user berdasarkan:
- Riwayat makanan yang dikonsumsi
- Target nutrisi (kalori, protein, dll)
- Progress tracking (weight, activity level)
- Kebiasaan makan

---

## 🏆 TOP 3 REKOMENDASI AI API

### 1️⃣ **OpenAI API** (BEST - Recommended ⭐⭐⭐⭐⭐)

**Pros:**
- ✅ GPT-4o Mini (murah, cepat, bahasa Indonesia bagus)
- ✅ API mudah diintegrasikan (Node.js library: `openai`)
- ✅ Bisa streaming response untuk UX lebih baik
- ✅ Context-aware (bisa remember user history)
- ✅ Indonesia language support excellent
- ✅ Production-ready & trusted

**Cons:**
- ❌ Bayar per token (tapi murah untuk MVP)
- ❌ Rate limit (tapi generous untuk hobby tier)

**Contoh Use Case:**
```
Input: User ate: Nasi Goreng (420 cal, 12g protein)
       Daily target: 2000 cal, 60g protein
       Goal: Lose weight

Output AI: "Nasi goreng ini sudah 21% dari target kalori harian. 
           Untuk mencapai target protein 60g, 
           Anda perlu tambah 48g dari makanan lain (seperti: daging ayam 100g, 
           atau tahu 200g, atau telur 3 butir). 
           💡 Tips: Tambahkan lauk tinggi protein & rendah kalori!"
```

**Cost:**
- GPT-4o Mini: ~$0.15 per 1 juta tokens
- ~1000 requests per hari = ~$0.05/hari (Rp 750/hari!)

**Integration:**
```javascript
// backend/api/generateAdvice.js
const OpenAI = require('openai');

app.post('/api/advice', async (req, res) => {
  const { userId, foodLogs, userGoals } = req.body;
  
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = `
    User Profile:
    - Goal: ${userGoals.goal} (${userGoals.target_calories} cal/day)
    - Today's intake: ${foodLogs.today_calories} cal, ${foodLogs.today_protein}g protein
    
    Food history today: ${JSON.stringify(foodLogs)}
    
    Provide personalized nutrition advice in Indonesian (Bahasa Indonesia).
    Focus on: macros balance, meal timing, tips to reach goals.
    Keep response concise (2-3 sentences + 1-2 actionable tips).
  `;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 200,
  });

  res.json({ advice: response.choices[0].message.content });
});
```

---

### 2️⃣ **Claude API (Anthropic)** (Alternative - Great ⭐⭐⭐⭐)

**Pros:**
- ✅ Bahasa Indonesia support sangat bagus
- ✅ Long context window (bisa remember seluruh nutrition history)
- ✅ Better reasoning untuk meal planning
- ✅ Safer API (less prone to hallucination)
- ✅ Fair pricing ($0.80 per 1M input tokens)

**Cons:**
- ❌ Sedikit lebih mahal dari GPT-4o Mini
- ❌ Library lebih baru (less mature)

**Integration:**
```javascript
const Anthropic = require("@anthropic-ai/sdk");

app.post('/api/advice', async (req, res) => {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });

  const message = await client.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [
      { role: "user", content: `
        User nutrition data: ${JSON.stringify(userData)}
        
        Berikan 3 saran untuk meningkatkan asupan nutrisi hari ini.
        Gunakan bahasa Indonesia yang natural.
      `}
    ],
  });

  res.json({ advice: message.content[0].text });
});
```

---

### 3️⃣ **Google Generative AI (Gemini)** (Budget-Friendly ⭐⭐⭐)

**Pros:**
- ✅ FREE tier (60 requests/minute - untuk MVP)
- ✅ Gemini 2.0 Flash sangat cepat
- ✅ Google API quality
- ✅ Indonesian support decent

**Cons:**
- ❌ Free tier sangat limited
- ❌ Quality sedikit di bawah GPT-4o
- ❌ Production tier lebih mahal dari OpenAI

**Integration:**
```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");

app.post('/api/advice', async (req, res) => {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(`
    Nutrition data: ${JSON.stringify(userData)}
    Berikan saran nutrisi yang dipersonalisasi.
  `);

  res.json({ advice: result.response.text() });
});
```

---

## 🎯 REKOMENDASI FINAL: Implementasi Terbaik

Untuk aplikasi NutriScan, saya rekomendasikan:

### **PILIHAN 1: OpenAI GPT-4o Mini** (RECOMMENDED)

**Alasan:**
```
├─ Cost: Rp 750/hari (TERMURAH untuk production)
├─ Quality: Terbaik bahasa Indonesia
├─ Speed: Sangat cepat (~1 detik per request)
├─ Reliability: 99.9% uptime
└─ Integration: Paling mudah & documented
```

**Setup:**
```bash
# 1. Install
npm install openai

# 2. Set environment variable
OPENAI_API_KEY=sk-proj-xxx...

# 3. Add to backend/.env
OPENAI_API_KEY=sk-proj-xxx...
OPENAI_MODEL=gpt-4o-mini
```

**Budget:**
- Free tier: $5 credit (first 3 bulan)
- Setelah itu: ~Rp 2500/hari (very affordable)
- Payoff: User engagement naik 40%+ dengan AI tips

---

## 📋 IMPLEMENTASI STEP-BY-STEP

### Step 1: Pilih dan Setup API Key

**OpenAI:**
1. Pergi ke https://platform.openai.com/
2. Sign up / Login
3. Buka **API Keys** di sidebar
4. Create → **New secret key**
5. Copy & paste ke `backend/.env`

```
# backend/.env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```

### Step 2: Install Library

```bash
cd backend
npm install openai
```

### Step 3: Buat Endpoint `/api/generate-advice`

File: `backend/routes/advice.js`

```javascript
const express = require('express');
const { OpenAI } = require('openai');
const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/generate-advice', async (req, res) => {
  try {
    const { userId, foodLogs, userProfile } = req.body;

    // Siapkan data untuk AI
    const todayStats = {
      totalCalories: foodLogs.reduce((sum, log) => sum + log.calories, 0),
      totalProtein: foodLogs.reduce((sum, log) => sum + log.protein, 0),
      totalCarbs: foodLogs.reduce((sum, log) => sum + log.carbs, 0),
      totalFat: foodLogs.reduce((sum, log) => sum + log.fat, 0),
      mealCount: foodLogs.length
    };

    // Siapkan prompt untuk AI
    const prompt = `
Anda adalah ahli gizi digital yang memberikan saran personal.

Profil User:
- Nama: ${userProfile.full_name}
- Tujuan: ${userProfile.goal_type} (${userProfile.goal_type === 'lose' ? 'Turun Berat Badan' : userProfile.goal_type === 'gain' ? 'Naik Berat Badan' : 'Jaga Berat Badan'})
- Target Kalori: ${userProfile.target_calories || 2000} kcal/hari
- Target Protein: ${userProfile.target_protein || 60}g/hari

Asupan Hari Ini:
- Total Kalori: ${todayStats.totalCalories} kcal (${Math.round(todayStats.totalCalories / (userProfile.target_calories || 2000) * 100)}% dari target)
- Protein: ${todayStats.totalProtein}g (${Math.round(todayStats.totalProtein / (userProfile.target_protein || 60) * 100)}% dari target)
- Karbohidrat: ${todayStats.totalCarbs}g
- Lemak: ${todayStats.totalFat}g
- Jumlah Makanan: ${todayStats.mealCount} item

Makanan yang dikonsumsi:
${foodLogs.map(log => `- ${log.food_name}: ${log.calories}kcal, ${log.protein}g protein`).join('\n')}

INSTRUKSI:
1. Berikan 2-3 saran SPESIFIK dan ACTIONABLE
2. Sesuaikan dengan tujuan user (lose/gain/maintain)
3. Gunakan BAHASA INDONESIA yang natural dan ramah
4. Fokus pada: macro balance, meal timing, nutrient gaps
5. Jika asupan sudah bagus, berikan motivasi positif
6. Jika ada kekurangan, saran 1-2 makanan konkret untuk dikonsum
7. Format: Paragraph natural (tidak bullet point)

Contoh response yang baik:
"Bagus banget! Kalori hari ini sudah mencapai 85% dari target. 
Protein Anda baru 45g, masih kurang 15g untuk optimal. 
Coba tambah 1 telur rebus (6g protein) + segelas susu (8g protein) 
sebelum tidur untuk mencapai target. Semakin konsisten, semakin cepat 
progress Anda! 💪"
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 250,
    });

    const advice = response.choices[0].message.content;

    // Save advice to database (optional)
    if (userId) {
      await supabase
        .from('ai_advice_log')
        .insert({
          user_id: userId,
          advice_text: advice,
          stats: todayStats,
          created_at: new Date().toISOString()
        });
    }

    res.json({ 
      success: true, 
      advice: advice,
      stats: todayStats
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal generate advice: ' + error.message 
    });
  }
});

module.exports = router;
```

### Step 4: Integrate ke Frontend

File: `frontend/screens/HomeScreen.js` atau `frontend/screens/AdviceScreen.js`

```javascript
const [aiAdvice, setAiAdvice] = useState(null);
const [loadingAdvice, setLoadingAdvice] = useState(false);

const generateAdvice = async () => {
  try {
    setLoadingAdvice(true);
    
    // Fetch food logs dari hari ini
    const { data: foodLogs } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('logged_at', new Date().toISOString().split('T')[0]);

    // Fetch user profile
    const { data: userProfile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    // Call backend API
    const response = await fetch(`${API_URL}/api/generate-advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        foodLogs: foodLogs || [],
        userProfile: userProfile
      })
    });

    const result = await response.json();
    setAiAdvice(result.advice);
    
  } catch (error) {
    console.error('Error generating advice:', error);
    Alert.alert('Error', 'Gagal generate advice');
  } finally {
    setLoadingAdvice(false);
  }
};

// UI Component
<TouchableOpacity 
  style={styles.generateAdviceBtn}
  onPress={generateAdvice}
  disabled={loadingAdvice}
>
  <Ionicons name="sparkles" size={18} color={Colors.white} />
  <Text style={styles.btnText}>
    {loadingAdvice ? 'Loading...' : 'Dapatkan Saran AI 🤖'}
  </Text>
</TouchableOpacity>

{aiAdvice && (
  <View style={styles.adviceBox}>
    <View style={styles.adviceHeader}>
      <Ionicons name="bulb" size={24} color={Colors.primary} />
      <Text style={styles.adviceTitle}>Saran Nutrisi AI</Text>
    </View>
    <Text style={styles.adviceText}>{aiAdvice}</Text>
  </View>
)}
```

### Step 5: Update Backend Routes

File: `backend/server.js`

```javascript
const adviceRoutes = require('./routes/advice');
app.use('/api', adviceRoutes);
```

---

## 🧪 TEST API

```bash
curl -X POST http://localhost:3000/api/generate-advice \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "foodLogs": [
      {"food_name": "nasi_goreng", "calories": 420, "protein": 12, "carbs": 52, "fat": 16},
      {"food_name": "jus_jeruk", "calories": 120, "protein": 2, "carbs": 28, "fat": 0.5}
    ],
    "userProfile": {
      "full_name": "Saida",
      "goal_type": "lose",
      "target_calories": 2000,
      "target_protein": 60
    }
  }'
```

Expected Response:
```json
{
  "success": true,
  "advice": "Bagus banget! Kalori hari ini sudah mencapai 27% dari target. Protein Anda baru 14g, masih kurang jauh dari target 60g. Untuk mencapai target, coba tambah: ...",
  "stats": {
    "totalCalories": 540,
    "totalProtein": 14,
    "totalCarbs": 80,
    "totalFat": 16.5,
    "mealCount": 2
  }
}
```

---

## 💰 PRICING COMPARISON

| Service | Free Tier | Paid Tier | Monthly Cost (MVP) |
|---------|-----------|-----------|-------------------|
| **OpenAI (GPT-4o Mini)** | $5 credit | $0.15/1M tokens | Rp 2,500-10,000 |
| **Claude (Anthropic)** | No | $0.80/1M tokens | Rp 15,000-25,000 |
| **Google Gemini** | 60 req/min | $0.075/1M tokens | Rp 5,000-15,000 |

**💡 Rekomendasi: OpenAI GPT-4o Mini** - Tercheap + Terbaik

---

## 🚀 NEXT STEPS

1. ✅ Daftar OpenAI → Get API Key
2. ✅ Install library: `npm install openai`
3. ✅ Buat endpoint `/api/generate-advice`
4. ✅ Connect ke frontend
5. ✅ Test dengan food logs
6. ✅ Deploy ke production

---

**Status**: Ready to implement
**Estimated Time**: 2-3 hours
**Cost**: ~Rp 750/hari (MVP stage)
