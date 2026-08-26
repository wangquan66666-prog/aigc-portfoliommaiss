import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export type AccordionGalleryItem = {
  image: string
  label: string
  link?: string
}

type AccordionGalleryProps = {
  items: AccordionGalleryItem[]
  defaultIndex?: number
  expandRatio?: number
  trigger?: 'hover' | 'click'
  ariaLabel?: string
  imageAltSuffix?: string
}

export default function AccordionGallery({
  items,
  defaultIndex = 0,
  expandRatio = 0.52,
  trigger = 'hover',
  ariaLabel = '作品切换',
  imageAltSuffix = '设计作品',
}: AccordionGalleryProps) {
  const safeDefault = Math.min(Math.max(defaultIndex, 0), Math.max(items.length - 1, 0))
  const [activeIndex, setActiveIndex] = useState(safeDefault)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const inactiveGrow = 1
  const activeGrow = items.length > 1
    ? (expandRatio / Math.max(1 - expandRatio, 0.01)) * (items.length - 1)
    : 1

  const openPreview = (index: number) => {
    setActiveIndex(index)
    setPreviewIndex(index)
  }

  const movePreview = (direction: number) => {
    setPreviewIndex((current) => {
      if (current === null || items.length === 0) return current
      return (current + direction + items.length) % items.length
    })
  }

  useEffect(() => {
    if (previewIndex === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewIndex(null)
      if (event.key === 'ArrowLeft') movePreview(-1)
      if (event.key === 'ArrowRight') movePreview(1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [previewIndex, items.length])

  const previewItem = previewIndex === null ? null : items[previewIndex]

  return (
    <>
      <div className="accordion-gallery" aria-label={ariaLabel}>
        {items.map((item, index) => {
          const active = index === activeIndex
          const panelStyle = { '--panel-grow': active ? activeGrow : inactiveGrow } as CSSProperties
          const interactionProps = {
            onFocus: () => setActiveIndex(index),
            ...(trigger === 'hover' ? { onMouseEnter: () => setActiveIndex(index) } : {}),
          }

          const content = (
            <>
              <span className="accordion-image-wrap">
                <img src={item.image} alt={`${item.label}${imageAltSuffix}`} loading="lazy" />
              </span>
              <span className="accordion-label">{item.label}</span>
            </>
          )

          return item.link ? (
            <a
              key={item.label}
              href={item.link}
              className={`accordion-panel ${active ? 'is-active' : ''}`}
              style={panelStyle}
              aria-label={`查看${item.label}完整图片`}
              onClick={(event) => {
                event.preventDefault()
                openPreview(index)
              }}
              {...interactionProps}
            >
              {content}
            </a>
          ) : (
            <button
              key={item.label}
              type="button"
              className={`accordion-panel ${active ? 'is-active' : ''}`}
              style={panelStyle}
              aria-pressed={active}
              aria-label={`查看${item.label}完整图片`}
              onClick={() => openPreview(index)}
              {...interactionProps}
            >
              {content}
            </button>
          )
        })}
      </div>

      {previewItem && createPortal(
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${previewItem.label}完整图片预览`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPreviewIndex(null)
          }}
        >
          <div className="gallery-lightbox-bar">
            <div>
              <strong>{previewItem.label}</strong>
              <span>{String((previewIndex ?? 0) + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
            </div>
            <button ref={closeButtonRef} type="button" onClick={() => setPreviewIndex(null)} aria-label="关闭完整图片预览">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <div className="gallery-lightbox-stage">
            <button type="button" className="gallery-lightbox-nav is-previous" onClick={() => movePreview(-1)} aria-label="查看上一张">
              <ChevronLeft size={28} strokeWidth={1.5} />
            </button>
            <img src={previewItem.image} alt={`${previewItem.label}${imageAltSuffix}完整图片`} />
            <button type="button" className="gallery-lightbox-nav is-next" onClick={() => movePreview(1)} aria-label="查看下一张">
              <ChevronRight size={28} strokeWidth={1.5} />
            </button>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
