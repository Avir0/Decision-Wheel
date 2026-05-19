import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './utils/ThemeContext'
import ParticleBackground from './components/ParticleBackground'
import Header from './components/Header'
import LandingPage from './pages/LandingPage'
import WheelPage from './pages/WheelPage'
import HistoryPage from './pages/HistoryPage'
import FlipPage from './pages/FlipPage'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

export default function App() {
  const [page, setPage] = useState('landing')
  const [history, setHistory] = useState([])

  return (
    <ThemeProvider>
      <div style={{ minHeight: '100vh', position: 'relative', background: 'var(--bg-primary)' }}>
        <ParticleBackground />

        {/* Background mesh gradient */}
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: `
              radial-gradient(ellipse 60% 40% at 20% 20%, var(--glow) 0%, transparent 60%),
              radial-gradient(ellipse 40% 30% at 80% 80%, color-mix(in srgb, var(--accent2) 20%, transparent) 0%, transparent 60%)
            `,
            opacity: 0.5,
          }}
        />

        <Header currentPage={page} setPage={setPage} />

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            style={{ position: 'relative', zIndex: 1 }}
          >
            {page === 'landing' && (
              <LandingPage onStart={() => setPage('wheel')} />
            )}
            {(page === 'wheel' || page === 'spin') && (
              <WheelPage history={history} setHistory={setHistory} setPage={setPage} />
            )}
            {page === 'flip' && (
              <FlipPage setHistory={setHistory} />
            )}
            {page === 'history' && (
              <HistoryPage history={history} setHistory={setHistory} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div
          className="fixed bottom-0 left-0 right-0 text-center py-2 text-xs z-10"
          style={{ color: 'var(--text-muted)', background: 'transparent' }}
        >
          🎡 Decision Wheel — blame the universe, not us
        </div>
      </div>
    </ThemeProvider>
  )
}
