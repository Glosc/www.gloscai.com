import { i18n, SUPPORTED_LOCALES, type LocaleCode } from '@/i18n'

const STORAGE_KEY = 'locale'
const SUPPORTED_CODES = SUPPORTED_LOCALES.map((l) => l.code)

function detectInitialLocale(): LocaleCode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED_CODES.includes(stored as LocaleCode)) {
    return stored as LocaleCode
  }

  const browserLang = navigator.language.slice(0, 2)
  if (SUPPORTED_CODES.includes(browserLang as LocaleCode)) {
    return browserLang as LocaleCode
  }

  return 'zh'
}

function applyLocale(code: LocaleCode) {
  const locale = SUPPORTED_LOCALES.find((l) => l.code === code)
  i18n.global.locale.value = code
  document.documentElement.lang = code
  document.documentElement.dir = locale?.dir ?? 'ltr'
  localStorage.setItem(STORAGE_KEY, code)
}

applyLocale(detectInitialLocale())

export function useLocale() {
  function setLocale(code: LocaleCode) {
    applyLocale(code)
  }

  return { locale: i18n.global.locale, setLocale, locales: SUPPORTED_LOCALES }
}
