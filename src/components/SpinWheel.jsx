import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const WHEEL_COLORS = [
  ['#7c6aff', '#9f8fff'],
  ['#ff6ab0', '#ff9dd0'],
  ['#00ffe5', '#7fffee'],
  ['#ff7e35', '#ffb580'],
  ['#a855f7', '#d19ffa'],
  ['#4ade80', '#9ef9ba'],
  ['#fbbf24', '#fde68a'],
  ['#f472b6', '#fba8d0'],
]

export default function SpinWheel({ choices = [], spinning = false, onSpinEnd, targetIndex = 0 }) {
  const canvasRef = useRef(null)
  const angleRef = useRef(0)
  const animRef = useRef(null)

  const segments = choices.length || 6
  const segAngle = (Math.PI * 2) / segments
  const pointerAngle = -Math.PI / 2

  function normalizeAngle(rad) {
    return ((rad % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
  }

  function getWinningIndex(angle, segCount) {
    const normalizedWheelAngle = normalizeAngle(angle)
    const relative = normalizeAngle(pointerAngle - normalizedWheelAngle)
    return Math.floor(relative / ((Math.PI * 2) / segCount)) % segCount
  }

  function drawRoundedRect(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath()
      ctx.roundRect(x, y, w, h, r)
      return
    }
    const radius = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.arcTo(x + w, y, x + w, y + h, radius)
    ctx.arcTo(x + w, y + h, x, y + h, radius)
    ctx.arcTo(x, y + h, x, y, radius)
    ctx.arcTo(x, y, x + w, y, radius)
    ctx.closePath()
  }

  function drawWheel(angle) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const cx = W / 2
    const cy = W / 2
    const R = W / 2 - 8

    ctx.clearRect(0, 0, W, W)

    // Outer glow ring
    const glowGrad = ctx.createRadialGradient(cx, cy, R - 10, cx, cy, R + 10)
    glowGrad.addColorStop(0, 'rgba(255,255,255,0.0)')
    glowGrad.addColorStop(0.5, 'rgba(255,255,255,0.12)')
    glowGrad.addColorStop(1, 'rgba(255,255,255,0.0)')
    ctx.beginPath()
    ctx.arc(cx, cy, R + 5, 0, Math.PI * 2)
    ctx.fillStyle = glowGrad
    ctx.fill()

    // Segments
    const displayChoices = choices.length > 0 ? choices : Array.from({ length: 6 }, (_, i) => `Option ${i + 1}`)

    displayChoices.forEach((choice, i) => {
      const startAngle = angle + i * segAngle
      const endAngle = startAngle + segAngle
      const colors = WHEEL_COLORS[i % WHEEL_COLORS.length]

      // Segment fill
      const grad = ctx.createLinearGradient(
        cx + Math.cos(startAngle + segAngle / 2) * R * 0.3,
        cy + Math.sin(startAngle + segAngle / 2) * R * 0.3,
        cx + Math.cos(startAngle + segAngle / 2) * R,
        cy + Math.sin(startAngle + segAngle / 2) * R,
      )
      grad.addColorStop(0, colors[1] + 'ee')
      grad.addColorStop(1, colors[0] + 'cc')

      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, R, startAngle, endAngle)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()

      // Segment border
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, R, startAngle, endAngle)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Text
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(startAngle + segAngle / 2)
      ctx.textAlign = 'right'
      const textR = R - 12

      // Text background pill
      const textW = Math.min(choice.length * 7, R * 0.55)
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      drawRoundedRect(ctx, textR - textW - 4, -10, textW + 8, 20, 6)
      ctx.fill()

      ctx.fillStyle = 'rgba(255,255,255,0.95)'
      ctx.font = `bold ${Math.max(9, Math.min(13, 120 / segments))}px DM Sans, sans-serif`
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 4

      const label = choice.length > 16 ? choice.slice(0, 14) + '…' : choice
      ctx.fillText(label, textR - 2, 4)
      ctx.restore()
    })

    // Center circle
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28)
    centerGrad.addColorStop(0, 'rgba(255,255,255,0.9)')
    centerGrad.addColorStop(0.4, 'rgba(200,200,255,0.6)')
    centerGrad.addColorStop(1, 'rgba(100,80,200,0.3)')

    ctx.beginPath()
    ctx.arc(cx, cy, 28, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(10,10,20,0.95)'
    ctx.fill()

    ctx.beginPath()
    ctx.arc(cx, cy, 24, 0, Math.PI * 2)
    ctx.fillStyle = centerGrad
    ctx.fill()

    // Center icon
    ctx.font = '18px serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🎯', cx, cy)
  }

  // Draw on mount and when choices change
  useEffect(() => {
    drawWheel(angleRef.current)
  }, [choices])

  // Spin animation
  useEffect(() => {
    if (!spinning) return

    const totalRotations = 6 + Math.random() * 4
    const targetDeg = totalRotations * Math.PI * 2
    const segAngleRad = (Math.PI * 2) / Math.max(segments, 1)
    const desiredFinalNormalized = normalizeAngle(pointerAngle - (targetIndex + 0.5) * segAngleRad)
    const currentNormalized = normalizeAngle(angleRef.current)
    let alignmentDelta = desiredFinalNormalized - currentNormalized
    if (alignmentDelta < 0) alignmentDelta += Math.PI * 2
    const finalAngle = angleRef.current + targetDeg + alignmentDelta

    let start = null
    const duration = 4500

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 4)
    }

    function animate(ts) {
      if (!start) start = ts
      const elapsed = ts - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOut(progress)
      const angle = angleRef.current + (finalAngle - angleRef.current) * eased

      drawWheel(angle)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        angleRef.current = finalAngle % (Math.PI * 2)
        drawWheel(angleRef.current)
        const landedIndex = getWinningIndex(angleRef.current, Math.max(segments, 1))
        onSpinEnd && onSpinEnd(landedIndex)
      }
    }

    cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animRef.current)
  }, [spinning, segments, targetIndex, onSpinEnd])

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)', transform: 'scale(1.3)' }}
      />

      {/* Pointer */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
        style={{ filter: 'drop-shadow(0 0 8px var(--accent))' }}
      >
        <div
          style={{
            width: 0, height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '24px solid var(--accent)',
            filter: 'drop-shadow(0 2px 8px var(--glow))',
          }}
        />
      </div>

      {/* Wheel canvas */}
      <motion.div
        animate={spinning ? { scale: [1, 1.01, 1] } : {}}
        transition={{ repeat: Infinity, duration: 0.3 }}
      >
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          style={{ borderRadius: '50%', display: 'block' }}
        />
      </motion.div>

      {/* Outer ring decoration */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          border: '2px solid var(--glass-border)',
          boxShadow: '0 0 40px var(--glow), inset 0 0 40px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  )
}
