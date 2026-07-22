import ES from './es';

export type Language = 'en' | 'es';

// t() looks up the exact English string in the active language's dictionary.
// English is the identity language, so no "en" dictionary is needed — the
// JSX strings themselves are the English text and the translation keys.
export function translate(language: Language, s: string): string {
  if (language === 'en') return s;
  return ES[s] ?? s;
}
