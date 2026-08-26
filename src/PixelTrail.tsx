import { useEffect, useRef } from 'react'

type GooeyFilter = {
  id: string
  strength: number
}

type PixelTrailProps = {
  gridSize?: number
  trailSize?: number
  maxAge?: number
  interpolate?: number
  color?: string
  gooeyFilter?: GooeyFilter
}

type TrailCell = {
  column: number
  row: number
  born: number
}

export default function PixelTrail({
  gridSize = 50,
  trailSize = 0.08,
  maxAge = 200,
  interpolate = 4.6,
  color = '#a6f231',
  gooeyFilter = { id: 'pixel-trail-goo', strength: 2 },
}: PixelTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches
    if (!canvas || reduceMotion || coarsePointer) return

    const context = canvas.getContext('2d')
    if (!context) return

    const cells = new Map<string, TrailCell>()
    let width = window.innerWidth
    let height = window.innerHeight
    let frame: number | null = null
    let lastPoint: { x: number; y: number } | null = null
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      cells.clear()
    }

    const addPoint = (x: number, y: number, born: number) => {
      const radius = Math.max(gridSize * 0.72, Math.min(width, height) * trailSize)
      const cellRadius = Math.ceil(radius / gridSize)
      const centerColumn = Math.floor(x / gridSize)
      const centerRow = Math.floor(y / gridSize)

      for (let rowOffset = -cellRadius; rowOffset <= cellRadius; rowOffset += 1) {
        for (let columnOffset = -cellRadius; columnOffset <= cellRadius; columnOffset += 1) {
          const column = centerColumn + columnOffset
          const row = centerRow + rowOffset
          const centerX = (column + 0.5) * gridSize
          const centerY = (row + 0.5) * gridSize
          if (Math.hypot(centerX - x, centerY - y) > radius) continue
          cells.set(`${column}:${row}`, { column, row, born })
        }
      }
    }

    const draw = (time: number) => {
      frame = null
      context.clearRect(0, 0, width, height)
      context.fillStyle = color

      cells.forEach((cell, key) => {
        const age = time - cell.born
        if (age >= maxAge) {
          cells.delete(key)
          return
        }

        const life = 1 - age / maxAge
        context.globalAlpha = life * life * 0.92
        const inset = Math.max(1.5, gridSize * 0.055)
        context.fillRect(
          cell.column * gridSize + inset,
          cell.row * gridSize + inset,
          gridSize - inset * 2,
          gridSize - inset * 2,
        )
      })

      context.globalAlpha = 1
      if (cells.size > 0) frame = window.requestAnimationFrame(draw)
    }

    const requestDraw = () => {
      if (frame === null) frame = window.requestAnimationFrame(draw)
    }

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const nextPoint = { x: event.clientX, y: event.clientY }
      const now = performance.now()

      if (!lastPoint) {
        addPoint(nextPoint.x, nextPoint.y, now)
      } else {
        const distance = Math.hypot(nextPoint.x - lastPoint.x, nextPoint.y - lastPoint.y)
        const steps = Math.max(1, Math.ceil(distance / Math.max(2, gridSize / interpolate)))
        for (let step = 1; step <= steps; step += 1) {
          const progress = step / steps
          addPoint(
            lastPoint.x + (nextPoint.x - lastPoint.x) * progress,
            lastPoint.y + (nextPoint.y - lastPoint.y) * progress,
            now,
          )
        }
      }

      lastPoint = nextPoint
      requestDraw()
    }

    const resetPointer = () => { lastPoint = null }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('blur', resetPointer)
    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', resetPointer)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('blur', resetPointer)
      document.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('mouseleave', resetPointer)
      if (frame !== null) window.cancelAnimationFrame(frame)
      cells.clear()
    }
  }, [color, gridSize, interpolate, maxAge, trailSize])

  return (
    <canvas
      ref={canvasRef}
      className="pixel-trail-canvas"
      data-goo-filter={gooeyFilter.id}
      style={{ filter: `blur(${gooeyFilter.strength * 0.4}px) drop-shadow(0 0 ${gooeyFilter.strength * 2.5}px ${color})` }}
      aria-hidden="true"
    />
  )
}
