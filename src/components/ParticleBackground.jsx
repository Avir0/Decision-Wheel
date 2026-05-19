import { useEffect, useRef } from 'react'
import { useTheme } from '../utils/ThemeContext'

function getRgb(theme) {
  const map = {
    space: '168,85,247',
    zen: '74,222,128',
    neon: '0,255,229',
    anime: '255,77,136',
    sunset: '255,126,53',
    dream: '244,114,182',
  }
  return map[theme] || '168,85,247'
}

export default function ParticleBackground() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const animRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rgb = getRgb(theme)

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const count = theme === 'space' ? 120 : theme === 'neon' ? 60 : 80

    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach(p => {
        p.pulse += p.twinkleSpeed
        const opacity = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse))

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)

        if (theme === 'neon') {
          ctx.shadowBlur = 15
          ctx.shadowColor = `rgba(${rgb},0.8)`
        } else {
          ctx.shadowBlur = theme === 'space' ? 8 : 4
          ctx.shadowColor = `rgba(${rgb},0.5)`
        }

        ctx.fillStyle = `rgba(${rgb},${opacity})`
        ctx.fill()
        ctx.shadowBlur = 0

        p.x += p.dx
        p.y += p.dy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      })

      // Draw connecting lines for nearby particles (space theme)
      if (theme === 'space' || theme === 'neon') {
        const particles = particlesRef.current
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 100) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(${rgb},${0.08 * (1 - dist / 100)})`
              ctx.lineWidth = 0.5
              ctx.moveTo(particles[i].x, particles[i].y)
              ctx.lineTo(particles[j].x, particles[j].y)
              ctx.stroke()
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      id="particle-canvas"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
    />
  )
}
