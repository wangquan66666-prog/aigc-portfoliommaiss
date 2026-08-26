import { useEffect, useState, type CSSProperties } from 'react'

export type MorphSliderItem = {
  image: string
  caption: string
}

type MorphSliderProps = {
  items: MorphSliderItem[]
  transition?: 'melt'
  intensity?: number
  aberration?: number
  drift?: number
  autoplay?: boolean
}

export default function MorphSlider({
  items,
  transition = 'melt',
  intensity = 0.55,
  aberration = 0.35,
  drift = 0.4,
  autoplay = false,
}: MorphSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const goTo = (nextIndex: number) => {
    if (!items.length || nextIndex === activeIndex) return
    setPreviousIndex(activeIndex)
    setActiveIndex((nextIndex + items.length) % items.length)
  }

  useEffect(() => {
    if (!autoplay || paused || items.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => goTo(activeIndex + 1), 3800)
    return () => window.clearInterval(timer)
  }, [activeIndex, autoplay, items.length, paused])

  if (!items.length) return null

  const activeItem = items[activeIndex]
  const previousItem = items[previousIndex]
  const sliderStyle = {
    '--morph-blur': `${Math.max(0, intensity) * 24}px`,
    '--morph-scale': `${1 + Math.max(0, intensity) * 0.08}`,
    '--morph-aberration': `${Math.max(0, aberration) * 18}px`,
    '--morph-drift': `${Math.max(0, drift) * 28}px`,
  } as CSSProperties

  return (
    <div
      className={`morph-slider transition-${transition}`}
      style={sliderStyle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
    >
      <div className="morph-viewport" aria-live="polite">
        {previousIndex !== activeIndex && (
          <div key={`previous-${previousIndex}-${activeIndex}`} className="morph-slide is-previous" aria-hidden="true">
            <img src={previousItem.image} alt="" />
          </div>
        )}

        <div key={`active-${activeIndex}`} className="morph-slide is-active">
          <span className="morph-channel channel-cyan" style={{ backgroundImage: `url("${activeItem.image}")` }} />
          <span className="morph-channel channel-rose" style={{ backgroundImage: `url("${activeItem.image}")` }} />
          <img src={activeItem.image} alt={`${activeItem.caption} IP 设计规范`} loading="lazy" />
        </div>
      </div>

      <div className="morph-meta">
        <strong>{activeItem.caption}</strong>
        <div className="morph-navigation" aria-label="选择 IP 设计作品">
          {items.map((item, index) => (
            <button
              key={item.caption}
              type="button"
              className={index === activeIndex ? 'is-active' : ''}
              onClick={() => goTo(index)}
              aria-label={`查看${item.caption}`}
              aria-current={index === activeIndex ? 'true' : undefined}
            >
              {String(index + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
