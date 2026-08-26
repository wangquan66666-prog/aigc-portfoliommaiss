import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeft, ArrowUpRight, Minus, Play, Plus, RotateCcw, X } from 'lucide-react'
import StarBorder from './StarBorder'

export type DramaMaterial = {
  image: string
  caption: string
  captionEn?: string
}

export type CircularGalleryItem = {
  image: string
  title: string
  subtitle?: string
  link?: string
  imagePosition?: string
  backgroundSize?: string
  materials?: DramaMaterial[]
  materialsLabel?: string
}

type CircularGalleryProps = {
  items: CircularGalleryItem[]
  bend?: number
  textColor?: string
  borderRadius?: number
  scrollEase?: number
  fontUrl?: string
  font?: string
}

const wrap = (value: number, length: number) => ((value + length / 2) % length + length) % length - length / 2

export default function CircularGallery({
  items,
  bend = 3,
  textColor = '#ffffff',
  borderRadius = 0.05,
  scrollEase = 0.02,
  fontUrl,
  font = '700 30px sans-serif',
}: CircularGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef(0)
  const positionRef = useRef(0)
  const frameRef = useRef(0)
  const snapTimerRef = useRef<number | undefined>(undefined)
  const dragRef = useRef<{ x: number; target: number } | null>(null)
  const [position, setPosition] = useState(0)
  const [width, setWidth] = useState(1200)
  const [activeMaterialItem, setActiveMaterialItem] = useState<CircularGalleryItem | null>(null)
  const [zoomIndex, setZoomIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!fontUrl || document.querySelector(`link[href="${fontUrl}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = fontUrl
    document.head.appendChild(link)
  }, [fontUrl])

  useEffect(() => {
    if (!activeMaterialItem) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (zoomIndex !== null) {
          setZoomIndex(null)
        } else {
          setActiveMaterialItem(null)
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [activeMaterialItem, zoomIndex])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const animate = () => {
      const difference = targetRef.current - positionRef.current
      positionRef.current += difference * Math.max(0.02, Math.min(scrollEase, 0.24))
      if (Math.abs(difference) < 0.001) positionRef.current = targetRef.current
      setPosition(positionRef.current)
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [scrollEase])

  useEffect(() => () => window.clearTimeout(snapTimerRef.current), [])

  const scheduleSnap = () => {
    window.clearTimeout(snapTimerRef.current)
    snapTimerRef.current = window.setTimeout(() => {
      targetRef.current = Math.round(targetRef.current)
    }, 170)
  }

  const onWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    targetRef.current += Math.max(-1.1, Math.min(1.1, delta / 150))
    scheduleSnap()
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('.circular-card-link')) return
    dragRef.current = { x: event.clientX, target: targetRef.current }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.classList.add('is-dragging')
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    const sensitivity = width < 640 ? 150 : 230
    targetRef.current = dragRef.current.target - (event.clientX - dragRef.current.x) / sensitivity
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return
    dragRef.current = null
    event.currentTarget.classList.remove('is-dragging')
    targetRef.current = Math.round(targetRef.current)
  }

  const selectItem = (index: number) => {
    const delta = wrap(index - targetRef.current, items.length)
    targetRef.current += delta
  }

  const activeIndex = ((Math.round(position) % items.length) + items.length) % items.length
  const spacing = width < 640 ? Math.max(178, width * 0.55) : Math.min(330, Math.max(235, width * 0.235))

  const galleryStyle = {
    '--gallery-color': textColor,
    '--gallery-radius': `${borderRadius * 100}%`,
  } as CSSProperties

  const galleryContent = (
    <div
      ref={rootRef}
      className="circular-gallery"
      style={galleryStyle}
      role="region"
      aria-label={`${items.length} 集短剧环形画廊`}
      tabIndex={0}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          targetRef.current = Math.round(targetRef.current) - 1
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          targetRef.current = Math.round(targetRef.current) + 1
        }
      }}
    >
      <div className="circular-track" aria-live="polite">
        {items.map((item, index) => {
          const delta = wrap(index - position, items.length)
          const distance = Math.abs(delta)
          const x = delta * spacing
          const y = Math.pow(distance, 1.7) * bend * 12
          const scale = 1 - Math.min(distance * 0.075, 0.34)
          const cardStyle = {
            opacity: distance > 4.8 ? 0 : Math.max(0.18, 1 - distance * 0.13),
            zIndex: Math.round(100 - distance * 10),
            transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotateY(${-delta * 9}deg) rotateZ(${delta * bend * 0.9}deg) scale(${scale})`,
          } as CSSProperties

          const cardContent = (
            <>
              <span
                className="circular-card-image"
                style={{
                  backgroundImage: `url('${item.image}')`,
                  backgroundPosition: item.imagePosition ?? 'center',
                  backgroundSize: item.backgroundSize ?? 'cover',
                }}
                role="img"
                aria-label={`${item.subtitle ?? item.title}短剧封面`}
              />
              <span className="circular-card-copy" style={{ font }}>
                <strong>{item.title}</strong>
                {item.subtitle && <small>{item.subtitle}</small>}
              </span>
            </>
          )

          if (item.materials && item.materials.length > 0) {
            return (
              <StarBorder
                as="button"
                key={`${item.title}-${index}`}
                type="button"
                className={`circular-card circular-card-link ${distance < 0.5 ? 'is-centered' : ''}`}
                color="white"
                speed="5s"
                style={cardStyle}
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveMaterialItem(item)
                  setZoomIndex(null)
                }}
                aria-label={`查看第 ${index + 1} 集《${item.subtitle ?? item.title}》的制作素材`}
                aria-current={distance < 0.5 ? 'true' : undefined}
                tabIndex={distance < 0.5 ? 0 : -1}
              >
                {cardContent}
                <span className="circular-card-badge" aria-hidden="true">
                  {item.materialsLabel ?? `${item.materials.length} 件素材`}
                </span>
              </StarBorder>
            )
          }

          if (item.link) {
            return (
              <a
                key={`${item.title}-${index}`}
                className={`circular-card circular-card-link ${distance < 0.5 ? 'is-centered' : ''}`}
                style={cardStyle}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                aria-label={`打开第 ${index + 1} 集视频：${item.subtitle ?? item.title}`}
                aria-current={distance < 0.5 ? 'true' : undefined}
                tabIndex={distance < 0.5 ? 0 : -1}
              >
                {cardContent}
              </a>
            )
          }

          return (
            <button
              key={`${item.title}-${index}`}
              type="button"
              className={`circular-card ${distance < 0.5 ? 'is-centered' : ''}`}
              style={cardStyle}
              onClick={(event) => {
                event.stopPropagation()
                selectItem(index)
              }}
              aria-label={`查看第 ${index + 1} 集：${item.subtitle ?? item.title}`}
              aria-current={distance < 0.5 ? 'true' : undefined}
              tabIndex={distance < 0.5 ? 0 : -1}
            >
              {cardContent}
            </button>
          )
        })}
      </div>

      <div className="circular-gallery-status" aria-hidden="true">
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
        <span>DRAG · SCROLL · ← →</span>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return galleryContent

  return (
    <>
      {galleryContent}
      {activeMaterialItem && activeMaterialItem.materials && createPortal(
        <DramaMaterialsModal
          item={activeMaterialItem}
          onClose={() => {
            setActiveMaterialItem(null)
            setZoomIndex(null)
          }}
          onOpenZoom={(index) => setZoomIndex(index)}
        />,
        document.body
      )}
      {activeMaterialItem && activeMaterialItem.materials && zoomIndex !== null && createPortal(
        (() => {
          const materials = activeMaterialItem.materials!
          return (
            <ZoomLightbox
              material={materials[zoomIndex]}
              index={zoomIndex}
              total={materials.length}
              onPrev={() => setZoomIndex((zoomIndex - 1 + materials.length) % materials.length)}
              onNext={() => setZoomIndex((zoomIndex + 1) % materials.length)}
              onClose={() => setZoomIndex(null)}
            />
          )
        })(),
        document.body
      )}
    </>
  )
}

type DramaMaterialsModalProps = {
  item: CircularGalleryItem
  onClose: () => void
  onOpenZoom: (index: number) => void
}

function DramaMaterialsModal({ item, onClose, onOpenZoom }: DramaMaterialsModalProps) {
  const materials = item.materials ?? []

  return (
    <div
      className="drama-modal-scrim"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drama-modal-title"
      onClick={onClose}
    >
      <div className="drama-modal" onClick={(event) => event.stopPropagation()}>
        <header className="drama-modal-header">
          <button type="button" className="drama-modal-back" onClick={onClose} aria-label="返回精选短剧">
            <ArrowLeft size={18} strokeWidth={1.8} /> 返回精选短剧
          </button>
          <div className="drama-modal-heading">
            <p className="drama-modal-eyebrow">{item.title} · 制作素材</p>
            <h3 id="drama-modal-title" className="drama-modal-title">{item.subtitle ?? item.title}</h3>
            <p className="drama-modal-meta">{materials.length} 件素材 · 点击任意素材查看大图</p>
          </div>
          <button type="button" className="drama-modal-close" onClick={onClose} aria-label="关闭素材弹窗">
            <X size={20} strokeWidth={1.5} />
          </button>
        </header>

        <ul className="drama-modal-grid" aria-label="素材列表">
          {materials.map((material, index) => (
            <li key={material.image} className="drama-modal-grid-item">
              <button
                type="button"
                className="drama-modal-tile"
                onClick={() => onOpenZoom(index)}
                aria-label={`放大查看 ${material.caption}`}
              >
                <img src={material.image} alt={material.caption} loading="lazy" />
                <span className="drama-modal-tile-overlay">
                  <span className="drama-modal-tile-caption">
                    <strong>{material.caption}</strong>
                    {material.captionEn && <small>{material.captionEn}</small>}
                  </span>
                  <span className="drama-modal-tile-action" aria-hidden="true">
                    <Plus size={16} strokeWidth={1.8} /> 放大查看
                  </span>
                </span>
              </button>
              <p className="drama-modal-tile-label">
                <span className="drama-modal-tile-index">{String(index + 1).padStart(2, '0')} / {String(materials.length).padStart(2, '0')}</span>
                <span className="drama-modal-tile-name">{material.caption}</span>
              </p>
            </li>
          ))}
        </ul>

        {item.link && (
          <footer className="drama-modal-footer">
            <a
              className="drama-modal-watch"
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              aria-label={`前往 B 站观看《${item.subtitle ?? item.title}》完整短剧`}
            >
              <span className="drama-modal-watch-icon" aria-hidden="true">
                <Play size={14} strokeWidth={2} fill="currentColor" />
              </span>
              前往 B 站观看完整短剧
              <ArrowUpRight size={18} strokeWidth={1.5} />
            </a>
          </footer>
        )}
      </div>
    </div>
  )
}

type ZoomLightboxProps = {
  material: DramaMaterial
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  onClose: () => void
}

function ZoomLightbox({ material, index, total, onPrev, onNext, onClose }: ZoomLightboxProps) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const stageRef = useRef<HTMLDivElement>(null)
  const panRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null)

  useEffect(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [material.image])

  const zoomIn = () => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))
  const zoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  const onWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.deltaY < 0) zoomIn()
    else zoomOut()
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1) return
    panRef.current = { startX: event.clientX, startY: event.clientY, originX: pan.x, originY: pan.y }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.classList.add('is-panning')
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!panRef.current) return
    setPan({
      x: panRef.current.originX + (event.clientX - panRef.current.startX),
      y: panRef.current.originY + (event.clientY - panRef.current.startY),
    })
  }

  const endPan = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!panRef.current) return
    panRef.current = null
    event.currentTarget.classList.remove('is-panning')
  }

  return (
    <div
      className="zoom-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`放大查看 ${material.caption}`}
      onClick={onClose}
    >
      <header className="zoom-lightbox-bar" onClick={(event) => event.stopPropagation()}>
        <div className="zoom-lightbox-bar-meta">
          <span className="zoom-lightbox-index">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          <div className="zoom-lightbox-caption">
            <strong>{material.caption}</strong>
            {material.captionEn && <small>{material.captionEn}</small>}
          </div>
        </div>
        <button type="button" className="zoom-lightbox-close" onClick={onClose} aria-label="关闭放大视图">
          <X size={20} strokeWidth={1.5} />
        </button>
      </header>

      <div
        ref={stageRef}
        className={`zoom-lightbox-stage ${zoom > 1 ? 'is-zoomable' : ''}`}
        onClick={(event) => event.stopPropagation()}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <img
          src={material.image}
          alt={material.caption}
          className="zoom-lightbox-image"
          draggable={false}
          style={{
            transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
            transformOrigin: 'center center',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        />
      </div>

      <footer className="zoom-lightbox-controls" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="zoom-lightbox-nav is-prev" onClick={onPrev} aria-label="上一张">
          <ArrowUpRight size={18} strokeWidth={1.5} style={{ transform: 'rotate(180deg)' }} />
        </button>
        <div className="zoom-lightbox-zoom">
          <button type="button" className="zoom-lightbox-btn" onClick={zoomOut} aria-label="缩小" disabled={zoom <= 0.5}>
            <Minus size={16} strokeWidth={1.8} />
          </button>
          <button type="button" className="zoom-lightbox-reset" onClick={resetZoom} aria-label="重置缩放">
            <RotateCcw size={14} strokeWidth={1.8} />
            <span>{Math.round(zoom * 100)}%</span>
          </button>
          <button type="button" className="zoom-lightbox-btn" onClick={zoomIn} aria-label="放大" disabled={zoom >= 4}>
            <Plus size={16} strokeWidth={1.8} />
          </button>
        </div>
        <button type="button" className="zoom-lightbox-nav is-next" onClick={onNext} aria-label="下一张">
          <ArrowUpRight size={18} strokeWidth={1.5} />
        </button>
      </footer>
    </div>
  )
}
