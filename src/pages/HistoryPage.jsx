import { motion, AnimatePresence } from 'framer-motion'

const modeEmoji = {
  funny: '😂',
  serious: '🧘',
  roast: '🔥',
  relationship: '💕',
  study: '📚',
  flip: '🪙',
}

export default function HistoryPage({ history, setHistory }) {
  const clearHistory = () => {
    if (window.confirm('Clear all decision history?')) setHistory([])
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative z-10">
      <div className="max-w-3xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1
              className="text-3xl font-black"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}
            >
              Decision <span style={{ color: 'var(--accent)' }}>History</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Every questionable choice you've made
            </p>
          </div>
          {history.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearHistory}
              className="text-xs px-4 py-2 rounded-xl"
              style={{ background: 'var(--glass)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}
            >
              Clear All
            </motion.button>
          )}
        </motion.div>

        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-16 text-center"
            style={{ border: '1px solid var(--glass-border)' }}
          >
            <div className="text-6xl mb-4">🎱</div>
            <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
              No decisions yet
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              You've been suspiciously decisive today. Suspicious.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {history.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 4 }}
                  className="glass rounded-2xl p-5"
                  style={{ border: '1px solid var(--glass-border)' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{modeEmoji[entry.mode] || '🎡'}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'var(--glass)', color: 'var(--accent)', border: '1px solid var(--glass-border)' }}
                        >
                          {entry.mode}
                        </span>
                        {entry.mood && (
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{entry.mood}</span>
                        )}
                      </div>
                      <p className="text-xs mb-2 truncate" style={{ color: 'var(--text-muted)' }}>
                        "{entry.dilemma}"
                      </p>
                      <p
                        className="text-sm font-bold"
                        style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}
                      >
                        → {entry.result}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {entry.timestamp}
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setHistory(prev => prev.filter(e => e.id !== entry.id))}
                        className="mt-1 text-xs"
                        style={{ color: 'var(--text-muted)', opacity: 0.5 }}
                      >
                        ✕
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-5 mt-6"
              style={{ border: '1px solid var(--glass-border)' }}
            >
              <h3 className="text-sm font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent)' }}>
                📊 Your Stats
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>
                    {history.length}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Total spins</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>
                    {[...new Set(history.map(h => h.mode))].length}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Modes tried</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>
                    {Math.floor(Math.random() * 40 + 10)}%
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Good decisions</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
