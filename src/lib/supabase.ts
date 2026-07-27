import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase config. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in .env (see .env.example).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    // Deliberately not persisted — every fresh app launch should prompt for
    // sign-in again, rather than silently restoring a previous session.
    persistSession: false,
    detectSessionInUrl: false,
    // Google sign-in exchanges a `?code=` via exchangeCodeForSession(), which
    // only exists under PKCE — the default 'implicit' flow returns tokens in
    // a URL fragment instead and has no code to exchange.
    flowType: 'pkce',
  },
});
