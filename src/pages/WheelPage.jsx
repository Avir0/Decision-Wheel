import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SpinWheel from '../components/SpinWheel'
import ResultPopup from '../components/ResultPopup'
import { generateChoices, modeOptions, exampleDilemmas } from '../utils/aiChoices'

function launchConfetti() {
  if (typeof window === 'undefined') return
  import('canvas-confetti').then(({ default: confetti }) => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#7c6aff', '#ff6ab0', '#00ffe5', '#fbbf24'] })
    setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.7, x: 0.3 } }), 300)
    setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.7, x: 0.7 } }), 500)
  }).catch(() => {})
}

const moods = ['Hopeful', 'Anxious', 'Confident', 'Desperate', 'Meh', 'Motivated']

export default function WheelPage({ history, setHistory, setPage }) {
  const [dilemma, setDilemma] = useState('')
  const [choices, setChoices] = useState([])
  const [mode, setMode] = useState('funny')
  const [spinning, setSpinning] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [targetIndex, setTargetIndex] = useState(0)
  const [generated, setGenerated] = useState(false)
  const [mood, setMood] = useState(null)
  const [luckyPct] = useState(() => Math.floor(Math.random() * 40 + 60))
  const [showMoodPicker, setShowMoodPicker] = useState(false)
  const [placeholder] = useState(() => exampleDilemmas[Math.floor(Math.random() * exampleDilemmas.length)])

  const handleGenerate = async () => {
    if (generating) return
    setGenerating(true)
    const text = dilemma.trim() || placeholder
    try {
      const newChoices = await generateChoices(text, mode, 6)
      setChoices(newChoices)
      setGenerated(true)
      setResult(null)
    } finally {
      setGenerating(false)
    }
  }

  const startSpin = () => {
    if (spinning || choices.length === 0) return
    const idx = Math.floor(Math.random() * choices.length)
    setTargetIndex(idx)
    setResult(null)
    setSpinning(true)
  }

  const handleSpin = async () => {
    if (generating) return
    if (!generated || choices.length === 0) {
      await handleGenerate()
      setTimeout(() => startSpin(), 120)
      return
    }
    startSpin()
  }

  const handleSpinEnd = useCallback((landedIndex) => {
    setSpinning(false)
    const safeIndex = Number.isInteger(landedIndex) ? landedIndex : targetIndex
    const winner = choices[safeIndex]
    setResult(winner)
    launchConfetti()

    const entry = {
      id: Date.now(),
      dilemma: dilemma.trim() || placeholder,
      result: winner,
      mode,
      mood,
      timestamp: new Date().toLocaleString(),
    }
    setHistory(prev => [entry, ...prev].slice(0, 50))
  }, [choices, targetIndex, dilemma, mode, mood, placeholder, setHistory])

  const handleShuffle = () => {
    if (choices.length === 0) return
    setChoices(prev => [...prev].sort(() => Math.random() - 0.5))
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
            What are you <span style={{ color: 'var(--accent)' }}>confused</span> about?
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Type your dilemma. We&apos;ll handle the rest.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-5"
              style={{ border: '1px solid var(--glass-border)' }}
            >
              <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Your Dilemma
              </label>
              <textarea
                value={dilemma}
                onChange={e => setDilemma(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full bg-transparent text-sm resize-none outline-none leading-relaxed"
                style={{ color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {exampleDilemmas.slice(0, 3).map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setDilemma(d)}
                    className="text-xs px-3 py-1 rounded-lg transition-all hover:scale-105"
                    style={{ background: 'var(--glass)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-2xl p-5"
              style={{ border: '1px solid var(--glass-border)' }}
            >
              <label className="block text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Mode
              </label>
              <div className="flex flex-wrap gap-2">
                {modeOptions.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className="text-xs px-3 py-2 rounded-xl transition-all hover:scale-105 font-semibold"
                    style={{
                      background: mode === m.id ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--glass)',
                      color: mode === m.id ? 'white' : 'var(--text-muted)',
                      border: mode === m.id ? 'none' : '1px solid var(--glass-border)',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-5"
              style={{ border: '1px solid var(--glass-border)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                  Current Mood
                </label>
                <button
                  onClick={() => setShowMoodPicker(!showMoodPicker)}
                  className="text-xs px-2 py-1 rounded-lg"
                  style={{ color: 'var(--text-muted)', background: 'var(--glass)' }}
                >
                  {mood || 'pick one'}
                </button>
              </div>
              <AnimatePresence>
                {showMoodPicker && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="flex flex-wrap gap-2 mb-3 overflow-hidden">
                    {moods.map(m => (
                      <button key={m} onClick={() => { setMood(m); setShowMoodPicker(false) }} className="text-xs px-3 py-1.5 rounded-xl" style={{ background: mood === m ? 'var(--accent)' : 'var(--glass)', color: mood === m ? 'white' : 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                        {m}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                  <span>Lucky Meter Today</span>
                  <span style={{ color: 'var(--accent)' }}>{luckyPct}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--glass)' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${luckyPct}%` }} transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }} className="h-full rounded-full" style={{ background: 'linear-gradient(to right, var(--accent), var(--accent2))' }} />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="grid grid-cols-2 gap-3">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleGenerate} disabled={generating} className="py-3.5 rounded-2xl text-sm font-bold glass" style={{ border: '1px solid var(--accent)', color: 'var(--accent)', fontFamily: 'Syne, sans-serif', opacity: generating ? 0.7 : 1 }}>
                {generating ? 'Generating...' : 'Generate Choices'}
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleShuffle} disabled={choices.length === 0} className="py-3.5 rounded-2xl text-sm font-bold glass" style={{ border: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontFamily: 'Syne, sans-serif', opacity: choices.length === 0 ? 0.5 : 1 }}>
                Shuffle
              </motion.button>
            </motion.div>

            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.03, boxShadow: '0 0 60px var(--glow)' }} whileTap={{ scale: 0.97 }} onClick={handleSpin} disabled={spinning || generating} className="w-full py-5 rounded-2xl text-base font-black text-white relative overflow-hidden" style={{ background: spinning || generating ? 'var(--glass)' : 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)', boxShadow: spinning || generating ? 'none' : '0 8px 40px var(--glow)', fontFamily: 'Syne, sans-serif', opacity: spinning || generating ? 0.7 : 1 }}>
              {generating ? 'Generating with Ollama...' : spinning ? 'Spinning...' : 'SPIN THE WHEEL'}
            </motion.button>

            <AnimatePresence>
              {choices.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="glass rounded-2xl p-5 overflow-hidden" style={{ border: '1px solid var(--glass-border)' }}>
                  <label className="block text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                    Wheel Segments
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {choices.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="text-xs px-3 py-2 rounded-xl flex items-center gap-2" style={{ background: 'var(--glass)', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                        <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: `hsl(${i * 60}, 70%, 60%)` }} />
                        {c}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex flex-col items-center gap-6 lg:sticky lg:top-28">
            <SpinWheel choices={choices} spinning={spinning} onSpinEnd={handleSpinEnd} targetIndex={targetIndex} />

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass rounded-2xl p-4 w-full text-center" style={{ border: '1px solid var(--glass-border)' }}>
              <div className="text-2xl mb-1">Fate</div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--accent)', fontFamily: 'Syne, sans-serif' }}>Daily Fate Card</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                &quot;Today, the stars suggest you overthink everything... perfectly on brand.&quot;
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ResultPopup
        result={result}
        mode={mode}
        onClose={() => setResult(null)}
        onSpin={() => { setResult(null); setTimeout(() => handleSpin(), 300) }}
        onPlayFlip={() => { setResult(null); setPage('flip') }}
      />
    </div>
  )
}
