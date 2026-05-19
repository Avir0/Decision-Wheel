import { motion } from 'framer-motion'
import ThemeSwitcher from './ThemeSwitcher'

export default function Header({ currentPage, setPage }) {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="fixed top-0 left-0 right-0 z-40 px-4 py-3"
    >
      <div
        className="max-w-5xl mx-auto flex items-center justify-between rounded-2xl px-5 py-3"
        style={{
          background: 'rgba(10,10,20,0.8)',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          onClick={() => setPage('landing')}
          className="flex items-center gap-2"
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent2))' }}
          >
            🎡
          </div>
          <span className="font-display font-bold text-sm hidden sm:block" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>
            Decision<span style={{ color: 'var(--accent)' }}>Wheel</span>
          </span>
        </motion.button>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {[
            { id: 'landing', label: 'Home' },
            { id: 'wheel', label: 'Spin' },
            { id: 'flip', label: 'Flip' },
            { id: 'history', label: 'History' },
          ].map(item => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage(item.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: currentPage === item.id ? 'var(--glass)' : 'transparent',
                color: currentPage === item.id ? 'var(--accent)' : 'var(--text-muted)',
                border: currentPage === item.id ? '1px solid var(--glass-border)' : '1px solid transparent',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {item.label}
            </motion.button>
          ))}
        </nav>

        <ThemeSwitcher />
      </div>
    </motion.header>
  )
}
