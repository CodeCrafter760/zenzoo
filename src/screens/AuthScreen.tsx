import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView,
  Platform, TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { useZenZoo } from '../context/ZenZooContext';
import { LIGHT_THEME, DARK_THEME, PALETTE, RADIUS, SHADOW } from '../theme/theme';
import { tapHaptic, successHaptic, errorHaptic } from '../utils/haptics';
import { showAlert } from '../utils/alert';
import { Feather } from '@expo/vector-icons';

const ACCENT = PALETTE.indigo;

type Mode = 'signIn' | 'signUp';

export default function AuthScreen() {
  const { signUp, signIn, signInWithGoogle, resetPasswordForEmail, isDark, t } = useZenZoo();
  const T = isDark ? DARK_THEME : LIGHT_THEME;

  const [mode, setMode] = useState<Mode>('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const canSubmit = email.trim().length > 3 && password.length >= 6 && (mode === 'signIn' || name.trim().length > 0);

  const submit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    setInfo(null);
    const result = mode === 'signIn'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password, name.trim());
    setLoading(false);
    if (result.error) {
      errorHaptic();
      setError(result.error);
      return;
    }
    successHaptic();
    if (mode === 'signUp') {
      setInfo(t('Account created! Check your email if confirmation is required, then sign in.'));
    }
  };

  const submitGoogle = async () => {
    if (googleLoading) return;
    tapHaptic();
    setGoogleLoading(true);
    setError(null);
    setInfo(null);
    const result = await signInWithGoogle();
    setGoogleLoading(false);
    if (result.error) {
      errorHaptic();
      setError(result.error);
      return;
    }
    successHaptic();
  };

  const handleForgotPassword = async () => {
    if (email.trim().length < 4) {
      setError(t('Enter your email above first, then tap "Forgot password?"'));
      return;
    }
    setLoading(true);
    const result = await resetPasswordForEmail(email.trim());
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    showAlert(t('Check your email'), t("We've sent a link to reset your password."));
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: isDark ? T.bg : '#F0F3FF' }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={[styles.heroCircle, { backgroundColor: isDark ? '#1B1F3A' : '#E4E9FF' }]}>
            <Feather name="shield" size={30} color={ACCENT} />
          </View>
          <Text style={[styles.title, { color: T.text }]}>ZenZoo</Text>
          <Text style={[styles.subtitle, { color: T.mid }]}>
            {mode === 'signIn' ? t('Sign in to your family account') : t('Create your family account')}
          </Text>

          <TouchableOpacity
            style={[styles.googleBtn, { backgroundColor: T.card, borderColor: T.edge }]}
            onPress={submitGoogle}
            disabled={googleLoading}
            activeOpacity={0.85}
          >
            {googleLoading ? (
              <ActivityIndicator color={ACCENT} />
            ) : (
              <>
                <Text style={styles.googleG}>G</Text>
                <Text style={[styles.googleBtnText, { color: T.text }]}>{t('Continue with Google')}</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: T.edge }]} />
            <Text style={[styles.dividerText, { color: T.soft }]}>{t('or')}</Text>
            <View style={[styles.dividerLine, { backgroundColor: T.edge }]} />
          </View>

          {mode === 'signUp' && (
            <TextInput
              style={[styles.input, { backgroundColor: T.card, borderColor: T.edge, color: T.text }]}
              placeholder={t('Your name')}
              placeholderTextColor={T.soft}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}
          <TextInput
            style={[styles.input, { backgroundColor: T.card, borderColor: T.edge, color: T.text }]}
            placeholder={t('Email')}
            placeholderTextColor={T.soft}
            value={email}
            onChangeText={(v) => { setEmail(v); setError(null); }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            style={[styles.input, { backgroundColor: T.card, borderColor: T.edge, color: T.text }]}
            placeholder={t('Password')}
            placeholderTextColor={T.soft}
            value={password}
            onChangeText={(v) => { setPassword(v); setError(null); }}
            secureTextEntry
            autoCapitalize="none"
          />
          {mode === 'signUp' && (
            <Text style={[styles.hint, { color: T.soft }]}>{t('At least 6 characters')}</Text>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}
          {info && <Text style={[styles.infoText, { color: PALETTE.mint }]}>{info}</Text>}

          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: ACCENT, opacity: canSubmit ? 1 : 0.5 }]}
            onPress={submit}
            disabled={!canSubmit || loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.primaryBtnText}>{mode === 'signIn' ? t('Sign In') : t('Create Account')}</Text>
            )}
          </TouchableOpacity>

          {mode === 'signIn' && (
            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
              <Text style={[styles.linkText, { color: T.mid }]}>{t('Forgot password?')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => { tapHaptic(); setMode(m => (m === 'signIn' ? 'signUp' : 'signIn')); setError(null); setInfo(null); }}
            activeOpacity={0.7}
            style={{ marginTop: 20 }}
          >
            <Text style={[styles.switchText, { color: T.mid }]}>
              {mode === 'signIn' ? t("Don't have an account?") : t('Already have an account?')}{' '}
              <Text style={{ color: ACCENT, fontWeight: '800' }}>{mode === 'signIn' ? t('Sign Up') : t('Sign In')}</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 32 },

  heroCircle: { width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title:    { fontSize: 30, fontWeight: '900', letterSpacing: -0.4, marginBottom: 6 },
  subtitle: { fontSize: 14, fontWeight: '600', textAlign: 'center', marginBottom: 28 },

  googleBtn: {
    width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderRadius: RADIUS.lg, borderWidth: 1.5, paddingVertical: 14, marginBottom: 18, minHeight: 52,
  },
  googleG: { fontSize: 18, fontWeight: '900', color: '#4285F4' },
  googleBtnText: { fontSize: 14.5, fontWeight: '800' },

  dividerRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 18, gap: 10 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 12, fontWeight: '700' },

  input: { width: '100%', borderRadius: RADIUS.md, borderWidth: 1.5, paddingVertical: 14, paddingHorizontal: 16, fontSize: 14, fontWeight: '600', marginBottom: 10 },
  hint:  { fontSize: 11.5, fontWeight: '600', alignSelf: 'flex-start', marginTop: -4, marginBottom: 8 },

  errorText: { color: PALETTE.coral, fontSize: 12.5, fontWeight: '700', marginTop: 6, marginBottom: 4, textAlign: 'center' },
  infoText:  { fontSize: 12.5, fontWeight: '700', marginTop: 6, marginBottom: 4, textAlign: 'center' },

  primaryBtn:     { width: '100%', borderRadius: RADIUS.lg, paddingVertical: 16, alignItems: 'center', marginTop: 14, ...SHADOW.sm },
  primaryBtnText: { color: '#FFF', fontSize: 15, fontWeight: '900' },

  linkText:   { fontSize: 13, fontWeight: '700', marginTop: 18, textAlign: 'center' },
  switchText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
