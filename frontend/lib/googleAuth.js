import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from './supabase';

// Required so the auth popup/redirect can dismiss itself correctly.
WebBrowser.maybeCompleteAuthSession();

// Extract params from both the query string (?a=b) and the hash fragment (#a=b)
// so we support either the PKCE (`code`) or implicit (`access_token`) callback.
function extractParams(url) {
  const out = {};
  if (!url) return out;
  const grab = (str) => {
    str.split('&').forEach((pair) => {
      const [k, v] = pair.split('=');
      if (k) out[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
  };
  const qIdx = url.indexOf('?');
  const hIdx = url.indexOf('#');
  if (qIdx !== -1) grab(url.substring(qIdx + 1, hIdx === -1 ? undefined : hIdx));
  if (hIdx !== -1) grab(url.substring(hIdx + 1));
  return out;
}

/**
 * Starts the Google OAuth flow.
 * Returns: { success } | { cancelled } and throws on real errors.
 * Requires the Google provider to be enabled in the Supabase dashboard.
 */
export async function signInWithGoogle() {
  // On web, let Supabase perform the full-page redirect; the session is picked
  // up automatically on return (detectSessionInUrl is enabled for web).
  if (Platform.OS === 'web') {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
    return { pending: true };
  }

  const redirectTo = AuthSession.makeRedirectUri({
    scheme: 'nutriscan',
    path: 'auth-callback',
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data?.url) throw new Error('Gagal memulai login Google.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type === 'cancel' || result.type === 'dismiss') {
    return { cancelled: true };
  }
  if (result.type !== 'success' || !result.url) {
    throw new Error('Login Google tidak selesai.');
  }

  const params = extractParams(result.url);

  if (params.error_description || params.error) {
    throw new Error(params.error_description || params.error);
  }

  // PKCE flow: exchange the authorization code for a session.
  if (params.code) {
    const { error: exErr } = await supabase.auth.exchangeCodeForSession(params.code);
    if (exErr) throw exErr;
    return { success: true };
  }

  // Implicit flow fallback: tokens arrive directly in the URL.
  if (params.access_token && params.refresh_token) {
    const { error: setErr } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
    if (setErr) throw setErr;
    return { success: true };
  }

  throw new Error('Tidak menerima kredensial dari Google.');
}
