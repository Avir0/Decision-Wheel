import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../utils/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme()
  const [open, setOpen] = useState(false)
  const current = themes.find(t => t.id === theme)

  return (
    <div className="relative z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="glass flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-white/10"
        style={{ color: 'var(--text)' }}
      >
        <span className="text-base">{current?.emoji}</span>
        <span className="font-display font-semibold hidden sm:block" style={{ color: 'var(--accent)' }}>
          {current?.name}
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--text-muted)' }}>
          <path d={open ? "M2 8l4-4 4 4" : "M2 4l4 4 4-4"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 glass rounded-2xl p-2 min-w-[200px] border border-white/10"
            style={{ background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(30px)' }}
          >
            {themes.map(t => (
              <motion.button
                key={t.id}
                whileHover={{ x: 4 }}
                onClick={() => { setTheme(t.id); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                style={{
                  background: theme === t.id ? 'var(--glass)' : 'transparent',
                  color: theme === t.id ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                <span>{t.emoji}</span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: theme === t.id ? 'var(--accent)' : 'var(--text)' }}>{t.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</div>
                </div>
                {theme === t.id && (
                  <div className="ml-auto w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
