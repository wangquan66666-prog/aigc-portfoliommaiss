import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react'

type StackProps = {
  cards: ReactNode[]
  randomRotation?: boolean
  sensitivity?: number
  sendToBackOnClick?: boolean
}

type DragState = {
  pointerId: number
  startX: number
  startY: number
  cardIndex: number
} | null

export default function Stack({
  cards,
  randomRotation = false,
  sensitivity = 180,
  sendToBackOnClick = false,
}: StackProps) {
  const [order, setOrder] = useState(() => cards.map((_, index) => index))
  const dragState = useRef<DragState>(null)
  const settleTimer = useRef<number | null>(null)
  const rotations = useMemo(
    () => cards.map((_, index) => randomRotation ? ((index * 17) % 11) - 5 : 0),
    [cards.length, randomRotation],
  )

  useEffect(() => () => {
    if (settleTimer.current !== null) window.clearTimeout(settleTimer.current)
  }, [])

  const sendToBack = (cardIndex: number) => {
    setOrder((current) => [cardIndex, ...current.filter((index) => index !== cardIndex)])
  }

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>, cardIndex: number) => {
    if (cardIndex !== order[order.length - 1]) return
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.style.transition = 'none'
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      cardIndex,
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>, cardIndex: number) => {
    const drag = dragState.current
    if (!drag || drag.pointerId !== event.pointerId || drag.cardIndex !== cardIndex) return
    const x = event.clientX - drag.startX
    const y = event.clientY - drag.startY
    const tilt = (x / Math.max(sensitivity, 1)) * 8
    event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotations[cardIndex] + tilt}deg)`
  }

  const handlePointerEnd = (event: PointerEvent<HTMLButtonElement>, cardIndex: number) => {
    const drag = dragState.current
    if (!drag || drag.pointerId !== event.pointerId || drag.cardIndex !== cardIndex) return
    const x = event.clientX - drag.startX
    const y = event.clientY - drag.startY
    const distance = Math.hypot(x, y)
    const shouldSendBack = distance >= sensitivity || (distance < 8 && sendToBackOnClick)

    dragState.current = null
    event.currentTarget.style.transition = 'transform .38s cubic-bezier(.16,1,.3,1)'
    event.currentTarget.style.transform = `translate3d(0, 0, 0) rotate(${rotations[cardIndex]}deg)`

    if (shouldSendBack) {
      settleTimer.current = window.setTimeout(() => sendToBack(cardIndex), 180)
    }
  }

  return (
    <div className="stack" aria-label="字体设计作品卡片组">
      {order.map((cardIndex, position) => {
        const depth = order.length - 1 - position
        const isTop = depth === 0
        const style = {
          zIndex: position + 1,
          transform: `translate3d(${depth * 5}px, ${depth * 5}px, 0) rotate(${rotations[cardIndex]}deg)`,
        }

        return (
          <button
            key={cardIndex}
            type="button"
            className={`stack-card ${isTop ? 'is-top' : ''}`}
            style={style}
            tabIndex={isTop ? 0 : -1}
            aria-label={`查看第 ${cardIndex + 1} 张字体设计，点击切换下一张`}
            onPointerDown={(event) => handlePointerDown(event, cardIndex)}
            onPointerMove={(event) => handlePointerMove(event, cardIndex)}
            onPointerUp={(event) => handlePointerEnd(event, cardIndex)}
            onPointerCancel={(event) => handlePointerEnd(event, cardIndex)}
            onKeyDown={(event) => {
              if (isTop && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault()
                sendToBack(cardIndex)
              }
            }}
          >
            {cards[cardIndex]}
          </button>
        )
      })}
    </div>
  )
}
