import {
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
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
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<HTMLDivElement>(null)
  const releaseTimerRef = useRef<number | null>(null)
  const clickTimerRef = useRef<number | null>(null)
  const loopDistanceRef = useRef(0)
  const reducedMotionRef = useRef(false)
  const pointerDownRef = useRef(false)
  const pointerStartXRef = useRef(0)
  const dragStartOffsetRef = useRef(0)
  const dragOffsetRef = useRef(0)
  const draggedRef = useRef(false)
  const suppressClickRef = useRef(false)

  const readTrackOffset = () => {
    const track = trackRef.current
    if (!track) return 0

    const transform = window.getComputedStyle(track).transform
    if (transform === 'none') return 0

    return new DOMMatrixReadOnly(transform).m41
  }

  const wrapLoopOffset = (offset: number) => {
    const distance = loopDistanceRef.current
    if (distance <= 0) return offset

    const wrapped = offset % distance
    return wrapped > 0 ? wrapped - distance : wrapped
  }

  useEffect(() => {
    const root = rootRef.current
    const group = groupRef.current
    if (!root || !group) return

    const updateMetrics = () => {
      const distance = group.getBoundingClientRect().width + gap
      loopDistanceRef.current = distance
      root.style.setProperty('--logo-loop-distance', `${distance}px`)
      root.style.setProperty('--logo-loop-duration', `${Math.max(8, distance / Math.max(1, speed))}s`)
    }

    updateMetrics()
    const observer = new ResizeObserver(updateMetrics)
    observer.observe(group)

    return () => observer.disconnect()
  }, [gap, logos.length, speed])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => {
      reducedMotionRef.current = media.matches
      if (!media.matches) trackRef.current?.style.removeProperty('transform')
    }

    updatePreference()
    media.addEventListener('change', updatePreference)
    return () => media.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => () => {
    if (releaseTimerRef.current !== null) window.clearTimeout(releaseTimerRef.current)
    if (clickTimerRef.current !== null) window.clearTimeout(clickTimerRef.current)
  }, [])

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return

    if (releaseTimerRef.current !== null) window.clearTimeout(releaseTimerRef.current)
    pointerDownRef.current = true
    draggedRef.current = false
    pointerStartXRef.current = event.clientX
    dragStartOffsetRef.current = readTrackOffset()
    dragOffsetRef.current = dragStartOffsetRef.current
    rootRef.current?.classList.add('is-interacting')
  }

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track || !pointerDownRef.current) return

    const distance = event.clientX - pointerStartXRef.current
    if (!draggedRef.current && Math.abs(distance) <= 7) return

    if (!draggedRef.current) {
      draggedRef.current = true
      rootRef.current?.classList.add('is-dragging')
      viewport.setPointerCapture(event.pointerId)
      const activeElement = document.activeElement
      if (activeElement instanceof HTMLElement && viewport.contains(activeElement)) activeElement.blur()
    }

    event.preventDefault()

    const nextOffset = reducedMotionRef.current
      ? Math.max(
        Math.min(0, viewport.clientWidth - (groupRef.current?.getBoundingClientRect().width ?? 0)),
        Math.min(0, dragStartOffsetRef.current + distance),
      )
      : wrapLoopOffset(dragStartOffsetRef.current + distance)

    dragOffsetRef.current = nextOffset
    track.style.transform = `translate3d(${nextOffset}px, 0, 0)`
  }

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    const root = rootRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!pointerDownRef.current) return

    pointerDownRef.current = false

    if (draggedRef.current && !reducedMotionRef.current && track) {
      const distance = loopDistanceRef.current
      const duration = Math.max(8, distance / Math.max(1, speed))
      const offset = wrapLoopOffset(dragOffsetRef.current)
      const phase = direction === 'left'
        ? -offset / Math.max(1, distance)
        : (offset + distance) / Math.max(1, distance)

      root?.style.setProperty('--logo-loop-delay', `${-phase * duration}s`)
      track.style.removeProperty('transform')
    }

    root?.classList.remove('is-dragging')
    if (viewport?.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId)

    suppressClickRef.current = draggedRef.current && !cancelled
    if (clickTimerRef.current !== null) window.clearTimeout(clickTimerRef.current)
    clickTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false
      clickTimerRef.current = null
    }, 0)

    const resumeDelay = event.pointerType === 'mouse' ? 0 : 450
    releaseTimerRef.current = window.setTimeout(() => {
      root?.classList.remove('is-interacting')
      releaseTimerRef.current = null
    }, resumeDelay)
  }

  const blockClickAfterDrag = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return
    event.preventDefault()
    event.stopPropagation()
    suppressClickRef.current = false
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
      role="region"
      aria-label={`${ariaLabel}，可按住并左右拖动浏览`}
    >
      <div
        ref={viewportRef}
        className="logo-loop-viewport"
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={(event) => finishDrag(event)}
        onPointerCancel={(event) => finishDrag(event, true)}
        onClickCapture={blockClickAfterDrag}
        onDragStart={(event) => event.preventDefault()}
      >
        <div ref={trackRef} className="logo-loop-track">
          {renderGroup('primary')}
          {renderGroup('duplicate')}
        </div>
      </div>
    </div>
  )
}
