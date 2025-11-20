"use client"

import { useEffect, useRef } from 'react'

interface AnimatedChartProps {
  type: 'line' | 'bar' | 'donut'
  delay?: number
}

export function AnimatedChart({ type, delay = 0 }: AnimatedChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Animation state
    let animationFrame = 0
    const maxFrames = 60

    const animate = () => {
      if (animationFrame >= maxFrames) return

      ctx.clearRect(0, 0, rect.width, rect.height)
      const progress = animationFrame / maxFrames

      if (type === 'line') {
        drawLineChart(ctx, rect, progress)
      } else if (type === 'bar') {
        drawBarChart(ctx, rect, progress)
      } else if (type === 'donut') {
        drawDonutChart(ctx, rect, progress)
      }

      animationFrame++
      requestAnimationFrame(animate)
    }

    setTimeout(() => {
      requestAnimationFrame(animate)
    }, delay)

  }, [type, delay])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

function drawLineChart(ctx: CanvasRenderingContext2D, rect: DOMRect, progress: number) {
  const padding = 20
  const width = rect.width - padding * 2
  const height = rect.height - padding * 2

  // Data points
  const data = [30, 45, 40, 60, 55, 70, 85]
  const points = data.length

  // Draw grid lines
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
  ctx.lineWidth = 1
  for (let i = 0; i <= 4; i++) {
    const y = padding + (height / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(padding + width, y)
    ctx.stroke()
  }

  // Draw line with gradient
  const gradient = ctx.createLinearGradient(0, padding, 0, padding + height)
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)')
  gradient.addColorStop(1, 'rgba(147, 51, 234, 0.8)')

  ctx.strokeStyle = gradient
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  ctx.beginPath()
  const visiblePoints = Math.floor(points * progress)

  for (let i = 0; i <= visiblePoints; i++) {
    const x = padding + (width / (points - 1)) * i
    const y = padding + height - (data[i] / 100) * height

    if (i === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  }
  ctx.stroke()

  // Draw dots
  ctx.fillStyle = '#3b82f6'
  for (let i = 0; i <= visiblePoints; i++) {
    const x = padding + (width / (points - 1)) * i
    const y = padding + height - (data[i] / 100) * height

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawBarChart(ctx: CanvasRenderingContext2D, rect: DOMRect, progress: number) {
  const padding = 20
  const width = rect.width - padding * 2
  const height = rect.height - padding * 2

  const data = [65, 45, 80, 55, 70]
  const barWidth = width / data.length - 10
  const maxValue = Math.max(...data)

  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * height * progress
    const x = padding + index * (barWidth + 10)
    const y = padding + height - barHeight

    // Gradient for each bar
    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight)
    gradient.addColorStop(0, '#3b82f6')
    gradient.addColorStop(1, '#9333ea')

    ctx.fillStyle = gradient
    ctx.fillRect(x, y, barWidth, barHeight)
  })
}

function drawDonutChart(ctx: CanvasRenderingContext2D, rect: DOMRect, progress: number) {
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const radius = Math.min(rect.width, rect.height) / 2 - 20
  const innerRadius = radius * 0.6

  const data = [
    { value: 35, color: '#3b82f6' },
    { value: 25, color: '#8b5cf6' },
    { value: 20, color: '#ec4899' },
    { value: 20, color: '#f59e0b' },
  ]

  let currentAngle = -Math.PI / 2
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  data.forEach((item) => {
    const sliceAngle = (item.value / totalValue) * Math.PI * 2 * progress

    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
    ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true)
    ctx.closePath()

    ctx.fillStyle = item.color
    ctx.fill()

    currentAngle += sliceAngle
  })
}
