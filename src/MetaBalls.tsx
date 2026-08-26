import { useEffect, useRef } from 'react'

type MetaBallsProps = {
  color?: string
  cursorBallColor?: string
  cursorBallSize?: number
  ballCount?: number
  animationSize?: number
  enableMouseInteraction?: boolean
  enableTransparency?: boolean
  hoverSmoothness?: number
  clumpFactor?: number
  speed?: number
}

type Ball = {
  phase: number
  speed: number
  orbitX: number
  orbitY: number
  offsetX: number
  offsetY: number
  radius: number
}

const seeded = (index: number) => {
  const value = Math.sin(index * 9283.31 + 17.17) * 43758.5453
  return value - Math.floor(value)
}

export default function MetaBalls({
  color = '#ffffff',
  cursorBallColor = '#ffffff',
  cursorBallSize = 2,
  ballCount = 15,
  animationSize = 30,
  enableMouseInteraction = true,
  enableTransparency = true,
  hoverSmoothness = 0.05,
  clumpFactor = 1,
  speed = 0.3,
}: MetaBallsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const balls: Ball[] = Array.from({ length: ballCount }, (_, index) => ({
      phase: seeded(index + 1) * Math.PI * 2,
      speed: 0.45 + seeded(index + 2) * 0.8,
      orbitX: 0.12 + seeded(index + 3) * 0.4,
      orbitY: 0.1 + seeded(index + 4) * 0.34,
      offsetX: 0.12 + seeded(index + 5) * 0.76,
      offsetY: 0.12 + seeded(index + 6) * 0.76,
      radius: animationSize * (1.15 + seeded(index + 7) * 2.1),
    }))

    const pointer = { targetX: 0, targetY: 0, x: 0, y: 0, active: false }
    let width = 0
    let height = 0
    let frame = 0
    let start = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.round(width * ratio))
      canvas.height = Math.max(1, Math.round(height * ratio))
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      if (!pointer.x && !pointer.y) {
        pointer.x = width / 2
        pointer.y = height / 2
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!enableMouseInteraction) return
      const rect = canvas.getBoundingClientRect()
      pointer.active = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
      pointer.targetX = event.clientX - rect.left
      pointer.targetY = event.clientY - rect.top
    }

    const onPointerLeave = () => { pointer.active = false }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('blur', onPointerLeave)
    resize()

    const draw = (now: number) => {
      const elapsed = reducedMotion ? 0 : (now - start) / 1000 * speed
      context.clearRect(0, 0, width, height)
      context.globalCompositeOperation = 'screen'
      context.fillStyle = color
      context.globalAlpha = enableTransparency ? 0.62 : 1

      const pull = Math.max(0.35, clumpFactor)
      balls.forEach((ball, index) => {
        const x = width * (0.5 + (ball.offsetX - 0.5) / pull * 0.62 + Math.cos(elapsed * ball.speed + ball.phase) * ball.orbitX / pull)
        const y = height * (0.5 + (ball.offsetY - 0.5) / pull * 0.58 + Math.sin(elapsed * ball.speed * 0.82 + ball.phase + index) * ball.orbitY / pull)
        const pulse = 1 + Math.sin(elapsed * 1.7 + ball.phase) * 0.12
        context.beginPath()
        context.arc(x, y, ball.radius * pulse, 0, Math.PI * 2)
        context.fill()
      })

      if (enableMouseInteraction && pointer.active) {
        const smoothing = Math.max(0.01, Math.min(hoverSmoothness, 1))
        pointer.x += (pointer.targetX - pointer.x) * smoothing
        pointer.y += (pointer.targetY - pointer.y) * smoothing
        context.fillStyle = cursorBallColor
        context.globalAlpha = enableTransparency ? 0.82 : 1
        context.beginPath()
        context.arc(pointer.x, pointer.y, Math.max(18, cursorBallSize * 22), 0, Math.PI * 2)
        context.fill()
      }

      context.globalAlpha = 1
      frame = requestAnimationFrame(draw)
    }

    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', onPointerLeave)
      start = 0
    }
  }, [animationSize, ballCount, clumpFactor, color, cursorBallColor, cursorBallSize, enableMouseInteraction, enableTransparency, hoverSmoothness, speed])

  return <canvas ref={canvasRef} className="meta-balls-canvas" aria-hidden="true" />
}
