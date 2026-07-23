'use client'

import { useEffect, useRef } from 'react'

const PETAL_COLORS = [
  '#d99c2b', // text-detalle (gold)
  '#FFEDA2', // detalle (light gold)
  '#9db3e6', // principal-light (soft blue)
  '#afc4ea', // principal-soft
  '#fff3c2', // detalle-light
  '#d4a574', // warm rose gold
]

function petal(ctx: CanvasRenderingContext2D) {
  const x = Math.random() * ctx.canvas.width
  const y = -10
  const size = Math.random() * 6 + 4
  const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]
  const angle = Math.random() * Math.PI * 2
  const speed = Math.random() * 1.5 + 0.5
  const wobbleSpeed = Math.random() * 0.02 + 0.01
  const wobbleAmp = Math.random() * 2 + 1

  return { x, y, size, color, angle, speed, wobbleSpeed, wobbleAmp, rotation: Math.random() * Math.PI * 2 }
}

export function WeddingConfetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const petals = Array.from({ length: 40 }, () => {
      const p = petal(ctx)
      p.y = Math.random() * canvas.height * 0.3
      return p
    })

    let frame = 0
    const maxFrames = 180

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of petals) {
        p.y += p.speed
        p.x += Math.sin(p.y * p.wobbleSpeed) * p.wobbleAmp
        p.rotation += 0.02

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = frame < 60 ? Math.min(1, frame / 30) : Math.max(0, 1 - (frame - 60) / 120)
        ctx.fill()
        ctx.restore()
      }

      frame++
      if (frame < maxFrames) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
    />
  )
}
