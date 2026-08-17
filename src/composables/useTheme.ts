import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getInitialTheme())

function applyTheme(value: Theme) {
  document.documentElement.classList.toggle('dark', value === 'dark')
  localStorage.setItem(STORAGE_KEY, value)
}

applyTheme(theme.value)

export function useTheme() {
  function setTheme(value: Theme) {
    theme.value = value
    applyTheme(value)
  }

  function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, toggleTheme }
}
