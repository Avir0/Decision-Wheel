import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function pickRandomSide() {
  return Math.random() < 0.5 ? 0 : 1
}

export default function FlipPage({ setHistory }) {
  const [question, setQuestion] = useState('')
  const [optionA, setOptionA] = useState('')
  const [optionB, setOptionB] = useState('')
  const [flipping, setFlipping] = useState(false)
  const [result, setResult] = useState(null)
  const [face, setFace] = useState('READY')

  const canFlip = useMemo(() => optionA.trim() && optionB.trim(), [optionA, optionB])

  const handleFlip = () => {
    if (!canFlip || flipping) return

    setFlipping(true)
    setResult(null)

    const winnerIndex = pickRandomSide()
    const winner = winnerIndex === 0 ? optionA.trim() : optionB.trim()

    setTimeout(() => {
      setFace(winnerIndex === 0 ? 'A' : 'B')
      setResult(winner)
      setFlipping(false)

      const entry = {
        id: Date.now(),
        dilemma: question.trim() || 'Coin flip decision',
        result: winner,
        mode: 'flip',
        mood: null,
        timestamp: new Date().toLocaleString(),
      }
      setHistory(prev => [entry, ...prev].slice(0, 50))
    }, 1500)
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative z-10">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(circle at 22% 18%, color-mix(in srgb, var(--accent) 38%, transparent) 0%, transparent 45%),
            radial-gradient(circle at 78% 82%, color-mix(in srgb, var(--accent2) 35%, transparent) 0%, transparent 40%),
            radial-gradient(circle at 50% 60%, rgba(0,0,0,0.45) 0%, transparent 60%)
          `,
          zIndex: 0,
        }}
      />
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
            Flip Your <span style={{ color: 'var(--accent)' }}>Decision</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Add your two options and let fate pick one.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5" style={{ border: '1px solid var(--glass-border)' }}>
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Your Question
              </label>
              <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Should I do X or Y?"
                rows={3}
                className="w-full bg-transparent text-sm resize-none outline-none leading-relaxed"
                style={{ color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}
              />
            </div>

            <div className="glass rounded-2xl p-5 space-y-3" style={{ border: '1px solid var(--glass-border)' }}>
              <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Two Sides
              </label>
              <input
                value={optionA}
                onChange={e => setOptionA(e.target.value)}
                placeholder="Option A"
                className="w-full rounded-xl px-3 py-2 bg-transparent outline-none"
                style={{ border: '1px solid var(--glass-border)', color: 'var(--text)' }}
              />
              <input
                value={optionB}
                onChange={e => setOptionB(e.target.value)}
                placeholder="Option B"
                className="w-full rounded-xl px-3 py-2 bg-transparent outline-none"
                style={{ border: '1px solid var(--glass-border)', color: 'var(--text)' }}
              />
            </div>

            <motion.button
              whileHover={{ scale: canFlip ? 1.03 : 1 }}
              whileTap={{ scale: canFlip ? 0.97 : 1 }}
              onClick={handleFlip}
              disabled={!canFlip || flipping}
              className="w-full py-5 rounded-2xl text-base font-black text-white"
              style={{
                background: canFlip ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)' : 'var(--glass)',
                opacity: !canFlip || flipping ? 0.65 : 1,
                boxShadow: canFlip ? '0 8px 40px var(--glow)' : 'none',
                fontFamily: 'Syne, sans-serif',
              }}
            >
              {flipping ? 'Flipping...' : 'Play Flip'}
            </motion.button>
          </div>

          <div className="flex flex-col items-center gap-5 lg:sticky lg:top-28">
            <div
              className="absolute rounded-full blur-3xl opacity-60 pointer-events-none"
              style={{
                width: 360,
                height: 360,
                background: 'radial-gradient(circle, var(--glow) 0%, transparent 70%)',
                transform: 'translateY(10px)',
              }}
            />
            <motion.div
              animate={
                flipping
                  ? { rotateY: [0, 900, 1800], rotateX: [0, 20, -15, 0], scale: [1, 1.12, 0.98, 1] }
                  : { y: [0, -4, 0], boxShadow: ['0 0 40px var(--glow)', '0 0 56px var(--glow)', '0 0 40px var(--glow)'] }
              }
              transition={flipping ? { duration: 1.6, ease: 'easeInOut' } : { repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="w-80 h-80 rounded-full flex items-center justify-center text-center px-6 relative"
              style={{
                background: 'conic-gradient(from 0deg, var(--accent), var(--accent2), #fbbf24, var(--accent), var(--accent2))',
                border: '4px solid color-mix(in srgb, var(--accent) 55%, white)',
                boxShadow: '0 0 60px var(--glow), inset 0 0 38px rgba(255,255,255,0.16)',
              }}
            >
              <div
                className="absolute inset-5 rounded-full"
                style={{
                  border: '1px solid rgba(255,255,255,0.35)',
                  background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.24), rgba(255,255,255,0.03) 55%, rgba(0,0,0,0.25) 100%)',
                }}
              />
              <div>
                <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  Coin Face
                </div>
                <div className="text-4xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'white', textShadow: '0 0 22px rgba(255,255,255,0.45)' }}>
                  {flipping ? '...' : face}
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  className="glass rounded-2xl p-5 w-full text-center"
                  style={{
                    border: '1px solid var(--glass-border)',
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, transparent), color-mix(in srgb, var(--accent2) 10%, transparent))',
                    boxShadow: '0 0 38px color-mix(in srgb, var(--accent) 35%, transparent)',
                  }}
                >
                  <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
                    Result
                  </div>
                  <div className="text-2xl font-black" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>
                    {result}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
