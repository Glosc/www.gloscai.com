import { createI18n } from 'vue-i18n'

import ar from '@/locales/ar.json'
import de from '@/locales/de.json'
import en from '@/locales/en.json'
import es from '@/locales/es.json'
import fr from '@/locales/fr.json'
import ja from '@/locales/ja.json'
import ko from '@/locales/ko.json'
import pt from '@/locales/pt.json'
import ru from '@/locales/ru.json'
import zh from '@/locales/zh.json'

export const SUPPORTED_LOCALES = [
  { code: 'zh', name: '简体中文', dir: 'ltr' },
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ja', name: '日本語', dir: 'ltr' },
  { code: 'ko', name: '한국어', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
  { code: 'ru', name: 'Русский', dir: 'ltr' },
  { code: 'pt', name: 'Português', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
] as const

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]['code']

export const messages = { zh, en, ja, ko, fr, de, es, ru, pt, ar }

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages,
})
