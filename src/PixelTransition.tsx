import { useMemo, useState, type FocusEvent, type PointerEvent, type ReactNode } from 'react'

type PixelTransitionProps = {
  firstContent: ReactNode
  secondContent: ReactNode
  gridSize?: number
  pixelColor?: string
  once?: boolean
  animationStepDuration?: number
  className?: string
  ariaLabel?: string
}

export default function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 12,
  pixelColor = '#ffffff',
  once = false,
  animationStepDuration = 0.4,
  className = '',
  ariaLabel,
}: PixelTransitionProps) {
  const [active, setActive] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const pixels = useMemo(() => Array.from({ length: gridSize * gridSize }, (_, index) => {
    const row = Math.floor(index / gridSize)
    const column = index % gridSize
    const order = (row * 7 + column * 11 + row * column * 3) % (gridSize + 5)
    return { index, delay: order / (gridSize + 5) }
  }), [gridSize])

  const show = () => {
    setInteracted(true)
    setActive(true)
  }

  const hide = () => {
    if (!once) setActive(false)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') {
      setInteracted(true)
      setActive((value) => once ? true : !value)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget) && !once) setActive(false)
  }

  return (
    <div
      className={`pixel-transition ${active ? 'is-active' : ''} ${interacted ? 'has-interacted' : ''} ${className}`.trim()}
      style={{
        '--pixel-grid-size': gridSize,
        '--pixel-color': pixelColor,
        '--pixel-duration': `${animationStepDuration}s`,
      } as React.CSSProperties}
      tabIndex={0}
      aria-label={ariaLabel}
      onPointerEnter={(event) => { if (event.pointerType === 'mouse') show() }}
      onPointerLeave={(event) => { if (event.pointerType === 'mouse') hide() }}
      onPointerUp={handlePointerUp}
      onFocus={show}
      onBlur={handleBlur}
    >
      <div className="pixel-transition-face pixel-transition-first" aria-hidden={active}>{firstContent}</div>
      <div className="pixel-transition-face pixel-transition-second" aria-hidden={!active}>{secondContent}</div>
      <span className="pixel-transition-grid" aria-hidden="true">
        {pixels.map(({ index, delay }) => (
          <span
            key={index}
            style={{ '--pixel-delay': `${delay * animationStepDuration}s` } as React.CSSProperties}
          />
        ))}
      </span>
    </div>
  )
}
