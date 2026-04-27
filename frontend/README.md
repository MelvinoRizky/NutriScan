# NutriScan Frontend

React Native Expo app for food scanning and nutrition tracking.

## Structure

```
frontend/
├── screens/                      # App screens
│   ├── LoginScreen.js           # Authentication
│   ├── RegisterScreen.js        # User signup
│   ├── HomeScreen.js            # Dashboard & nutrition summary
│   ├── ScanScreen.js            # Camera & food detection
│   ├── ScannedScreen.js         # Results display
│   ├── HistoryScreen.js         # Meal history
│   ├── ProfileScreen.js         # User profile
│   ├── EditProfileScreen.js     # Profile editing
│   ├── EditTargetScreen.js      # Nutrition target editing
│   ├── TargetScreen.js          # View targets
│   ├── WeeklyScreen.js          # Weekly analytics
│   ├── FoodDetailScreen.js      # Meal details
│   ├── AdviceScreen.js          # Nutrition tips
│   └── HelpScreen.js            # Help & FAQ
├── components/                  # Reusable components
│   ├── CustomInput.js           # Styled input field
│   ├── PrimaryButton.js         # CTA button
│   ├── MacroProgressBar.js      # Progress visualization
│   └── theme.js                 # Design system
├── lib/
│   └── supabase.js              # Supabase client config
├── assets/                      # Images, fonts
├── App.js                       # App entry & navigation
├── app.json                     # Expo config
├── .env                         # Local environment (not tracked)
├── .env.example                 # Environment template
├── package.json                 # Dependencies
├── metro.config.js              # Metro bundler config
├── babel.config.js              # Babel config
├── tailwind.config.js           # Tailwind CSS config
├── global.css                   # Global styles
└── index.js                     # Entry point (web)
```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

**Required Variables:**
- `EXPO_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3000`)
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase public key

### 3. Start Development Server
```bash
npm start
```

This launches Expo Go with local QR code.

**Access Options:**
- **iOS/Android with Expo Go**: Scan the QR code
- **Web**: Open `http://localhost:8081` in browser
- **Physical Device**: Scan QR on same network

### Key Features

1. **Authentication**
   - Email/password registration
   - Auto-confirmed accounts
   - Session persistence

2. **Food Scanning**
   - Camera capture or gallery upload
   - AI food recognition (MobileNetV2)
   - Real-time confidence scores
   - Top 3 predictions display

3. **Nutrition Tracking**
   - Automatic macro calculations (protein, carbs, fat)
   - Calorie estimation
   - Meal time categorization
   - Photo storage in Supabase

4. **Profile Management**
   - User preferences
   - Height/weight tracking
   - Nutrition goals
   - Goal type (lose/gain/maintain)

5. **Analytics**
   - Daily intake summary
   - Weekly trends
   - Progress visualization
   - Nutrition advice

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (bottom tabs + native stack)
- **Backend**: Supabase (Auth + Database + Storage)
- **Styling**: NativeWind (Tailwind for React Native)
- **Camera**: expo-camera, expo-image-picker
- **HTTP**: Native fetch API

## Environment Variables

Create `.env` from `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

**Note:** Variables starting with `EXPO_PUBLIC_` are embedded in the bundle and visible to users.

## Development

### Running Tests
```bash
npm test
```

### Web Development
```bash
npm start
# Press 'w' to open web
```

### Build for Production
```bash
eas build
```

## Troubleshooting

**White screen on load**
- Check `.env` file exists with correct Supabase keys
- Clear Metro cache: `npm start -- --reset-cache`
- Refresh browser (Ctrl+R for web)

**"supabaseUrl is required"**
- Verify `EXPO_PUBLIC_SUPABASE_URL` in `.env`
- Restart dev server after changing `.env`

**Camera not working**
- On web: Uses simulated camera
- Physical device: Grant camera permissions
- Check permissions in `app.json`

**Image upload fails**
- Verify backend running on `EXPO_PUBLIC_API_URL`
- Check network connectivity
- Verify image file size < 10MB

## File Organization

- `screens/` - Each app screen as separate component
- `components/` - Shared UI components across screens
- `lib/` - External service configurations
- `assets/` - Static resources (images, icons, fonts)
- Root `.js` files - Entry points and navigation
