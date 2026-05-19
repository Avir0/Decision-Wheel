import { createContext, useContext, useState, useEffect } from 'react'

export const themes = [
  {
    id: 'space',
    name: 'Space Galaxy',
    emoji: '🌌',
    desc: 'Cosmic vibes',
    colors: ['#a855f7', '#60a5fa', '#06041a'],
  },
  {
    id: 'zen',
    name: 'Zen Forest',
    emoji: '🌿',
    desc: 'Calm nature',
    colors: ['#4ade80', '#86efac', '#0d1a0f'],
  },
  {
    id: 'neon',
    name: 'Neon Cyber',
    emoji: '⚡',
    desc: 'Electric dark',
    colors: ['#00ffe5', '#ff00aa', '#040408'],
  },
  {
    id: 'anime',
    name: 'Anime Tokyo',
    emoji: '🌸',
    desc: 'Night city rain',
    colors: ['#ff4d88', '#ffb347', '#050a18'],
  },
  {
    id: 'sunset',
    name: 'Sunset Chill',
    emoji: '🌅',
    desc: 'Golden hour',
    colors: ['#ff7e35', '#c855f7', '#1a0a00'],
  },
  {
    id: 'dream',
    name: 'Dream Cloud',
    emoji: '☁️',
    desc: 'Pastel float',
    colors: ['#f472b6', '#a78bfa', '#0e0a1a'],
  },
]

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('space')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
