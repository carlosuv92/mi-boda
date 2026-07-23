'use client'

import { useEffect, useRef } from 'react'

const LEAF_COLORS = [
  '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff',
  '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff',
  '#f5f5f0', '#f5f5f0',
  '#c9b37e', '#FFEDA2', '#d4a574',
]

function drawLeaf(ctx: CanvasRenderingContext2D, size: number) {
  const w = size * 0.4
  const h = size
  ctx.beginPath()
  ctx.moveTo(0, -h / 2)
  ctx.bezierCurveTo(w, -h / 3, w, h / 3, 0, h / 2)
  ctx.bezierCurveTo(-w, h / 3, -w, -h / 3, 0, -h / 2)
  ctx.closePath()
}

function leaf(ctx: CanvasRenderingContext2D, canvasH: number) {
  const x = Math.random() * ctx.canvas.width
  const y = -20
  const size = Math.random() * 10 + 8
  const color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]
  const speed = Math.random() * 1.2 + 0.4
  const wobbleSpeed = Math.random() * 0.015 + 0.008
  const wobbleAmp = Math.random() * 2.5 + 1
  const hasVein = color !== '#ffffff' && color !== '#f5f5f0'

  return { x, y, size, color, speed, wobbleSpeed, wobbleAmp, rotation: Math.random() * Math.PI * 2, hasVein, canvasH }
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

    const leaves = Array.from({ length: 50 }, () => {
      const l = leaf(ctx, canvas.height)
      l.y = Math.random() * canvas.height * 0.3
      return l
    })

    let frame = 0
    const maxFrames = 180

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const l of leaves) {
        l.y += l.speed
        l.x += Math.sin(l.y * l.wobbleSpeed) * l.wobbleAmp
        l.rotation += 0.015

        ctx.save()
        ctx.translate(l.x, l.y)
        ctx.rotate(l.rotation)
        drawLeaf(ctx, l.size)
        ctx.fillStyle = l.color
        ctx.globalAlpha = frame < 60 ? Math.min(1, frame / 30) : Math.max(0, 1 - (frame - 60) / 120)
        ctx.fill()

        if (l.hasVein) {
          ctx.beginPath()
          ctx.moveTo(0, -l.size / 2 + 1)
          ctx.lineTo(0, l.size / 2 - 1)
          ctx.strokeStyle = 'rgba(201, 179, 126, 0.4)'
          ctx.lineWidth = 0.5
          ctx.stroke()
        }

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
