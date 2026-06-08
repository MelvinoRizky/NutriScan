import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const isWeb = Platform.OS === 'web';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // On native we persist via AsyncStorage; on web the SDK uses localStorage.
    storage: isWeb ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // PKCE is the recommended OAuth flow for mobile deep-link callbacks.
    flowType: 'pkce',
    // Let the SDK auto-parse the OAuth callback in the browser; do it manually on native.
    detectSessionInUrl: isWeb,
  },
});
