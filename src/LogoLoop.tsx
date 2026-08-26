import { useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import StarBorder from './StarBorder'

export type LogoLoopItem = {
  id: string
  title: string
  subtitle: string
  image: string
}

type LogoLoopProps = {
  logos: LogoLoopItem[]
  speed?: number
  direction?: 'left' | 'right'
  logoHeight?: number
  gap?: number
  hoverSpeed?: number
  scaleOnHover?: boolean
  fadeOut?: boolean
  fadeOutColor?: string
  ariaLabel?: string
  selectedId?: string | null
  onItemClick?: (item: LogoLoopItem) => void
}

type LogoLoopStyle = CSSProperties & {
  '--logo-loop-gap': string
  '--logo-loop-card-height': string
  '--logo-loop-card-width': string
  '--carousel-card-width': string
  '--logo-loop-fade-color': string
  '--logo-loop-duration': string
  '--logo-loop-distance': string
}

export default function LogoLoop({
  logos,
  speed = 120,
  direction = 'left',
  logoHeight = 460,
  gap = 16,
  hoverSpeed = 0,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = '#171815',
  ariaLabel = '循环作品列表',
  selectedId,
  onItemClick,
}: LogoLoopProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const releaseTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const group = groupRef.current
    if (!root || !group) return

    const updateMetrics = () => {
      const distance = group.getBoundingClientRect().width + gap
      root.style.setProperty('--logo-loop-distance', `${distance}px`)
      root.style.setProperty('--logo-loop-duration', `${Math.max(8, distance / Math.max(1, speed))}s`)
    }

    updateMetrics()
    const observer = new ResizeObserver(updateMetrics)
    observer.observe(group)

    return () => observer.disconnect()
  }, [gap, logos.length, speed])

  useEffect(() => () => {
    if (releaseTimerRef.current !== null) window.clearTimeout(releaseTimerRef.current)
  }, [])

  const pauseForTouch = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return
    rootRef.current?.classList.add('is-interacting')
    if (releaseTimerRef.current !== null) window.clearTimeout(releaseTimerRef.current)
  }

  const resumeAfterTouch = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse') return
    releaseTimerRef.current = window.setTimeout(() => {
      rootRef.current?.classList.remove('is-interacting')
      releaseTimerRef.current = null
    }, 450)
  }

  if (!logos.length) return null

  const renderGroup = (copy: 'primary' | 'duplicate') => (
    <div
      ref={copy === 'primary' ? groupRef : undefined}
      className="logo-loop-group"
      aria-hidden={copy === 'duplicate' ? true : undefined}
    >
      {logos.map((item, index) => (
        <StarBorder
          as="button"
          type="button"
          key={`${copy}-${item.id}`}
          className={`design-carousel-card ${selectedId === item.id ? 'is-selected' : ''}`}
          color="white"
          speed="5s"
          onClick={() => onItemClick?.(item)}
          aria-pressed={copy === 'primary' ? selectedId === item.id : undefined}
          aria-label={copy === 'primary' ? `查看${item.title}` : undefined}
          tabIndex={copy === 'duplicate' ? -1 : 0}
        >
          <span className="design-carousel-image">
            <img src={item.image} alt="" loading="lazy" draggable="false" />
          </span>
          <span className="design-carousel-meta">
            <span className="design-carousel-number">{String(index + 1).padStart(2, '0')}</span>
            <strong>{item.title}</strong>
            <small>{item.subtitle}</small>
          </span>
          <span className="design-carousel-open">
            {selectedId === item.id ? '已展开' : '查看系列'}
            <ArrowRight size={15} strokeWidth={1.5} />
          </span>
        </StarBorder>
      ))}
    </div>
  )

  const cardWidth = Math.round(logoHeight * 0.652)
  const style = {
    '--logo-loop-gap': `${gap}px`,
    '--logo-loop-card-height': `${logoHeight}px`,
    '--logo-loop-card-width': `${cardWidth}px`,
    '--carousel-card-width': `${cardWidth}px`,
    '--logo-loop-fade-color': fadeOutColor,
    '--logo-loop-duration': '40s',
    '--logo-loop-distance': '2200px',
  } as LogoLoopStyle

  return (
    <div
      ref={rootRef}
      className={`logo-loop is-${direction} ${hoverSpeed === 0 ? 'pauses-on-hover' : ''} ${scaleOnHover ? 'scale-on-hover' : ''} ${fadeOut ? 'has-fade' : ''}`}
      style={style}
      aria-label={ariaLabel}
      onPointerDown={pauseForTouch}
      onPointerUp={resumeAfterTouch}
      onPointerCancel={resumeAfterTouch}
    >
      <div className="logo-loop-viewport">
        <div className="logo-loop-track">
          {renderGroup('primary')}
          {renderGroup('duplicate')}
        </div>
      </div>
    </div>
  )
}
