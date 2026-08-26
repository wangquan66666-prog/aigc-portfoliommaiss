import { useEffect, useMemo, useRef, type ReactNode } from 'react'

type GridMotionProps = {
  items: ReactNode[]
}

const isImageSource = (value: ReactNode): value is string =>
  typeof value === 'string' && /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(value)

function GridMotion({ items }: GridMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const rows = useMemo(() => {
    const normalized = Array.from({ length: 28 }, (_, index) => items[index % items.length])
    return Array.from({ length: 4 }, (_, rowIndex) => normalized.slice(rowIndex * 7, rowIndex * 7 + 7))
  }, [items])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const layer = root.parentElement
    const home = document.querySelector('#home')
    const visibilityObserver = home && layer
      ? new IntersectionObserver(([entry]) => {
          layer.classList.toggle('is-home-visible', entry.isIntersecting && entry.intersectionRatio >= 0.35)
        }, { threshold: [0, 0.35, 1] })
      : null
    if (home && visibilityObserver) visibilityObserver.observe(home)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches) {
      return () => {
        visibilityObserver?.disconnect()
        layer?.classList.remove('is-home-visible')
      }
    }

    let animationFrame = 0
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const updateMotion = () => {
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12
      root.style.setProperty('--grid-pointer-x', `${currentX.toFixed(2)}px`)
      root.style.setProperty('--grid-pointer-y', `${currentY.toFixed(2)}px`)
      root.style.setProperty('--grid-pointer-x-negative', `${(-currentX).toFixed(2)}px`)
      root.style.setProperty('--grid-pointer-y-negative', `${(-currentY).toFixed(2)}px`)

      if (Math.abs(targetX - currentX) > 0.08 || Math.abs(targetY - currentY) > 0.08) {
        animationFrame = window.requestAnimationFrame(updateMotion)
      } else {
        animationFrame = 0
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 34
      targetY = (event.clientY / window.innerHeight - 0.5) * 24
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateMotion)
    }

    const handlePointerLeave = () => {
      targetX = 0
      targetY = 0
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateMotion)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      visibilityObserver?.disconnect()
      layer?.classList.remove('is-home-visible')
      window.removeEventListener('pointermove', handlePointerMove)
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div ref={rootRef} className="grid-motion" aria-hidden="true">
      <div className="grid-motion-plane">
        {rows.map((row, rowIndex) => (
          <div
            className="grid-motion-row"
            key={`grid-row-${rowIndex}`}
          >
            <div className={`grid-motion-track ${rowIndex % 2 === 0 ? '' : 'is-reverse'}`}>
              {[...row, ...row].map((item, itemIndex) => (
                <div className="grid-motion-item" key={`grid-item-${rowIndex}-${itemIndex}`}>
                  {isImageSource(item) ? (
                    <img src={item} alt="" loading="lazy" decoding="async" draggable="false" />
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GridMotion
