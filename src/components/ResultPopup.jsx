import { motion, AnimatePresence } from 'framer-motion'
import { getAIExplanation, getResultPrefix } from '../utils/aiChoices'
import { useState } from 'react'

export default function ResultPopup({ result, mode, onClose, onSpin, onPlayFlip }) {
  const explanation = getAIExplanation(result, mode)
  const prefix = getResultPrefix(mode)
  const [copied, setCopied] = useState(false)

  const shareText = `The universe told me to: "${result}"\n\nDecision made by Decision Wheel 🎡\ndecisionwheel.app`

  const copyResult = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
  }

  const hasFlipAction = typeof result === 'string' && /coin|flip/i.test(result)

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, y: 60, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="glass rounded-3xl p-8 max-w-md w-full text-center relative overflow-hidden"
            style={{
              background: 'rgba(10,10,20,0.9)',
              border: '1px solid var(--accent)',
              boxShadow: '0 0 80px var(--glow), 0 40px 80px rgba(0,0,0,0.6)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Glow pulse */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', opacity: 0.15 }}
            />

            {/* Emoji burst */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, delay: 0.1 }}
              className="text-6xl mb-4"
            >
              🎯
            </motion.div>

            {/* Prefix */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm uppercase tracking-widest mb-2"
              style={{ color: 'var(--accent)', fontFamily: 'Syne, sans-serif' }}
            >
              {prefix}
            </motion.p>

            {/* Main result */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="text-3xl font-display font-bold mb-4 leading-tight"
              style={{
                color: 'var(--text)',
                fontFamily: 'Syne, sans-serif',
                textShadow: '0 0 30px var(--glow)',
              }}
            >
              {result}
            </motion.h2>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4 }}
              className="h-px mb-4 mx-8"
              style={{ background: 'linear-gradient(to right, transparent, var(--accent), transparent)' }}
            />

            {/* AI explanation */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm leading-relaxed mb-6"
              style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}
            >
              <span style={{ color: 'var(--accent2)' }}>AI says:</span> {explanation}
            </motion.p>

            {/* Share buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-2 justify-center mb-4 flex-wrap"
            >
              <button
                onClick={shareWhatsApp}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: '#25D366', color: 'white' }}
              >
                <span>📱</span> WhatsApp
              </button>
              <button
                onClick={copyResult}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text)' }}
              >
                <span>{copied ? '✅' : '📋'}</span> {copied ? 'Copied!' : 'Copy'}
              </button>
            </motion.div>

            {/* Action buttons */}
            <div className="flex gap-3">
              {hasFlipAction && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onPlayFlip}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    color: 'white',
                  }}
                >
                  Play Flip
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onSpin}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  color: 'white',
                  boxShadow: '0 4px 20px var(--glow)',
                }}
              >
                🎡 Spin Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}
              >
                ✖ Dismiss
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
