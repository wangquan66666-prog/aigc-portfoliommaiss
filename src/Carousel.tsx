import {
  useEffect,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { ArrowRight } from 'lucide-react'
import StarBorder from './StarBorder'

export type CarouselItem = {
  id: string
  title: string
  subtitle: string
  image: string
}

type CarouselProps = {
  items: CarouselItem[]
  baseWidth?: number
  autoplay?: boolean
  autoplayDelay?: number
  pauseOnHover?: boolean
  loop?: boolean
  round?: boolean
  selectedId?: string | null
  onItemClick?: (item: CarouselItem) => void
}

export default function Carousel({
  items,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = true,
  round = false,
  selectedId,
  onItemClick,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const pointerDownRef = useRef(false)
  const pointerStartXRef = useRef(0)
  const scrollStartRef = useRef(0)
  const draggedRef = useRef(false)

  useEffect(() => {
    if (!autoplay || items.length < 2) return

    const timer = window.setInterval(() => {
      const track = trackRef.current
      if (!track || pausedRef.current || pointerDownRef.current) return

      const cards = Array.from(track.querySelectorAll<HTMLElement>('.design-carousel-card'))
      const currentIndex = cards.findIndex((card) => card.offsetLeft + card.offsetWidth / 2 > track.scrollLeft + track.clientWidth / 2)
      const nextIndex = currentIndex < 0 || currentIndex === cards.length - 1
        ? (loop ? 0 : cards.length - 1)
        : currentIndex + 1

      cards[nextIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }, autoplayDelay)

    return () => window.clearInterval(timer)
  }, [autoplay, autoplayDelay, items.length, loop])

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track) return

    pointerDownRef.current = true
    draggedRef.current = false
    pointerStartXRef.current = event.clientX
    scrollStartRef.current = track.scrollLeft
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track || !pointerDownRef.current) return

    const distance = event.clientX - pointerStartXRef.current
    if (Math.abs(distance) > 10) {
      if (!draggedRef.current) {
        draggedRef.current = true
        track.classList.add('is-dragging')
        track.setPointerCapture(event.pointerId)
      }
      track.scrollLeft = scrollStartRef.current - distance
    }
  }

  const finishDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    pointerDownRef.current = false
    // 在 click 之前重置 draggedRef，避免上一次拖拽残留把后续点击误判为 drag
    draggedRef.current = false
    track?.classList.remove('is-dragging')
    if (track?.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)
  }

  if (!items.length) return null

  return (
    <div
      className={`design-carousel ${round ? 'is-round' : ''}`}
      style={{ '--carousel-card-width': `${baseWidth}px` } as CSSProperties}
      onMouseEnter={() => { if (pauseOnHover) pausedRef.current = true }}
      onMouseLeave={() => { if (pauseOnHover) pausedRef.current = false }}
      onFocusCapture={() => { if (pauseOnHover) pausedRef.current = true }}
      onBlurCapture={() => { if (pauseOnHover) pausedRef.current = false }}
      aria-label="精选设计分类，可横向拖动浏览"
    >
      <div
        ref={trackRef}
        className="design-carousel-track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        {items.map((item, index) => (
          <StarBorder
            as="button"
            type="button"
            key={item.id}
            className={`design-carousel-card ${selectedId === item.id ? 'is-selected' : ''}`}
            color="white"
            speed="5s"
            onClick={() => {
              if (draggedRef.current) {
                draggedRef.current = false
                return
              }
              onItemClick?.(item)
            }}
            aria-pressed={selectedId === item.id}
            aria-label={`查看${item.title}`}
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
    </div>
  )
}
