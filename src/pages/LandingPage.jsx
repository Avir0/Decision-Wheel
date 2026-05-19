import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { funStats, exampleDilemmas } from '../utils/aiChoices'

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
}

const features = [
  { emoji: '🤖', title: 'AI-Generated Choices', desc: 'Smart suggestions tailored to your exact dilemma' },
  { emoji: '😂', title: 'Funny Mode', desc: 'Maximum chaos, zero responsibility, pure vibes' },
  { emoji: '🧘', title: 'Serious Mode', desc: 'Thoughtful, grounded decisions when stakes are high' },
  { emoji: '💕', title: 'Relationship Mode', desc: 'For heart matters that need cosmic guidance' },
  { emoji: '🔥', title: 'Roast Mode', desc: 'Brutal honesty with zero mercy. You asked.' },
  { emoji: '📚', title: 'Study Mode', desc: 'Procrastinate with purpose and academic flair' },
  { emoji: '🎲', title: 'Daily Luck', desc: 'Let fate set the tone for your entire day' },
  { emoji: '📜', title: 'Decision History', desc: 'Look back at every questionable choice you made' },
]

export default function LandingPage({ onStart }) {
  const [dilemmaIdx, setDilemmaIdx] = useState(0)
  const [demoSpin, setDemoSpin] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setDilemmaIdx(i => (i + 1) % exampleDilemmas.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 relative z-10">
      <div className="max-w-5xl mx-auto">

        {/* HERO */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="text-center mb-24"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest"
              style={{
                background: 'var(--glass)',
                border: '1px solid var(--glass-border)',
                color: 'var(--accent)',
                fontFamily: 'Syne, sans-serif',
              }}
            >
              ✨ Life-changing since 2026
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-display font-black mb-6 leading-none"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}
          >
            Confused?
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Let destiny
            </span>
            <br />
            decide.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl mb-10 max-w-lg mx-auto"
            style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans, sans-serif' }}
          >
            Spin. Trust the universe. Blame the wheel.
          </motion.p>

          {/* Rotating dilemma */}
          <motion.div variants={fadeUp} className="mb-10 h-10 flex items-center justify-center">
            <motion.div
              key={dilemmaIdx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="px-5 py-2 rounded-xl text-sm font-semibold glass"
              style={{ color: 'var(--text-muted)', border: '1px solid var(--glass-border)', fontFamily: 'DM Sans, sans-serif' }}
            >
              "{exampleDilemmas[dilemmaIdx]}"
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={fadeUp}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 60px var(--glow)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onStart}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
                boxShadow: '0 8px 32px var(--glow)',
                fontFamily: 'Syne, sans-serif',
              }}
            >
              🎡 Spin the Wheel
              <span className="text-xl">→</span>
            </motion.button>
          </motion.div>
        </motion.section>

        {/* DEMO WHEEL PREVIEW */}
        <motion.section
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="flex justify-center mb-24"
        >
          <div className="relative">
            {/* Mini animated wheel preview */}
            <div
              className="w-64 h-64 rounded-full flex items-center justify-center relative"
              style={{
                background: 'conic-gradient(from 0deg, var(--accent) 0deg 60deg, var(--accent2) 60deg 120deg, #4ade80 120deg 180deg, #fbbf24 180deg 240deg, #f472b6 240deg 300deg, #60a5fa 300deg 360deg)',
                boxShadow: '0 0 60px var(--glow)',
                animation: 'spin 12s linear infinite',
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                style={{ background: 'var(--bg-primary)', position: 'absolute' }}
              >
                🎯
              </div>
            </div>
            {/* Pointer */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2"
              style={{ filter: 'drop-shadow(0 0 8px var(--accent))' }}
            >
              <div style={{
                width: 0, height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '20px solid var(--accent)',
              }} />
            </div>
          </div>
        </motion.section>

        {/* STATS */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-24"
        >
          {funStats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.04 }}
              className="glass rounded-2xl p-5 text-center"
              style={{ border: '1px solid var(--glass-border)' }}
            >
              <div
                className="text-3xl font-black mb-1"
                style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent)' }}
              >
                {s.stat}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.section>

        {/* FUNNY SOCIAL PROOF */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { text: '"I asked if I should quit my job. The wheel said yes. I did. No regrets... yet."', author: 'Priya S. ⭐⭐⭐⭐⭐' },
              { text: '"Science not verified but honestly more accurate than my therapist."', author: 'Raj K. ⭐⭐⭐⭐⭐' },
              { text: '"Texted my ex because the wheel said so. The wheel lied. 10/10 would spin again."', author: 'Anon 💔' },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-5"
                style={{ border: '1px solid var(--glass-border)' }}
              >
                <p className="text-sm mb-3 leading-relaxed" style={{ color: 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}>
                  {t.text}
                </p>
                <p className="text-xs" style={{ color: 'var(--accent)' }}>{t.author}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FEATURES */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2
            className="text-3xl font-black text-center mb-3"
            style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}
          >
            Everything you need
          </h2>
          <p className="text-center mb-10 text-sm" style={{ color: 'var(--text-muted)' }}>
            to make terrible decisions with style
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                className="glass rounded-2xl p-5"
                style={{ border: '1px solid var(--glass-border)', cursor: 'default' }}
              >
                <div className="text-3xl mb-3">{f.emoji}</div>
                <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FINAL CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center glass rounded-3xl p-12"
          style={{ border: '1px solid var(--glass-border)' }}
        >
          <div className="text-5xl mb-4">🌀</div>
          <h2 className="text-3xl font-black mb-3" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
            Stop overthinking.
          </h2>
          <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            The wheel has never been wrong. (Disclaimer: the wheel has been wrong many times.)
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              boxShadow: '0 8px 32px var(--glow)',
              fontFamily: 'Syne, sans-serif',
            }}
          >
            Let fate decide →
          </motion.button>
        </motion.section>

      </div>
    </div>
  )
}
