import { useId, useState, type CSSProperties } from 'react'

type StrokeTextProps = {
  text: string
  strokeColor?: string
  fillColor?: string
  strokeWidth?: number
  drawDuration?: number
  fillDelay?: number
  stagger?: number
  ease?: 'power2.out' | 'ease-out' | 'linear'
  trigger?: 'mount' | 'hover'
  fillMode?: 'wipe' | 'fade'
  fontSize?: number
  fontWeight?: number
  letterSpacing?: number
  align?: 'left' | 'center'
  gradientColors?: [string, string, string?]
  fontFamily?: string
}

const easingMap = {
  'power2.out': 'cubic-bezier(0.22, 1, 0.36, 1)',
  'ease-out': 'ease-out',
  linear: 'linear',
}

export default function StrokeText({
  text,
  strokeColor = '#d8ff4f',
  fillColor = '#ecece7',
  strokeWidth = 1.4,
  drawDuration = 1.6,
  fillDelay = 0.2,
  stagger = 0.05,
  ease = 'power2.out',
  trigger = 'mount',
  fillMode = 'wipe',
  fontSize = 128,
  fontWeight = 800,
  letterSpacing = -4,
  align = 'center',
  gradientColors,
  fontFamily,
}: StrokeTextProps) {
  const rawId = useId()
  const clipId = `stroke-text-${rawId.replace(/:/g, '')}`
  const gradientId = `stroke-gradient-${rawId.replace(/:/g, '')}`
  const [run, setRun] = useState(0)
  const lines = text.split('\n')
  const multiline = lines.length > 1
  const viewBoxHeight = multiline ? 430 : 260
  const x = align === 'left' ? 8 : 500
  const anchor = align === 'left' ? 'start' : 'middle'
  const lineY = (index: number) => multiline ? 120 + index * 170 : 134
  const style = {
    '--stroke-color': strokeColor,
    '--fill-color': fillColor,
    '--stroke-width': strokeWidth,
    '--draw-duration': `${drawDuration}s`,
    '--fill-delay': `${fillDelay}s`,
    '--fill-duration': `${Math.max(0.45, drawDuration * 0.72)}s`,
    '--stroke-ease': easingMap[ease],
  } as CSSProperties

  const replay = () => {
    if (trigger === 'hover') setRun((value) => value + 1)
  }

  return (
    <div className="stroke-text" style={style} onPointerEnter={replay} aria-hidden="true">
      <svg key={run} viewBox={`0 0 1000 ${viewBoxHeight}`} preserveAspectRatio={align === 'left' ? 'xMinYMid meet' : 'xMidYMid meet'} role="presentation">
        <defs>
          {gradientColors && (
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              {gradientColors[2] && <stop offset="52%" stopColor={gradientColors[1]} />}
              <stop offset="100%" stopColor={gradientColors[2] ?? gradientColors[1]} />
            </linearGradient>
          )}
          <clipPath id={clipId}>
            <rect className={fillMode === 'wipe' ? 'stroke-text-wipe' : ''} x="0" y="0" width="1000" height={viewBoxHeight} />
          </clipPath>
        </defs>

        {lines.map((line, lineIndex) => {
          const previousCharacters = lines.slice(0, lineIndex).join('').length
          return (
            <text
              className="stroke-text-outline"
              x={x}
              y={lineY(lineIndex)}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize={fontSize}
              fontWeight={fontWeight}
              fontFamily={fontFamily}
              letterSpacing={letterSpacing}
              style={gradientColors ? { stroke: `url(#${gradientId})` } : undefined}
              key={`outline-${line}`}
            >
              {Array.from(line).map((character, index) => (
                <tspan key={`${character}-${index}`} style={{ animationDelay: `${(previousCharacters + index) * stagger}s` }}>
                  {character}
                </tspan>
              ))}
            </text>
          )
        })}

        {lines.map((line, lineIndex) => (
          <text
            className={`stroke-text-fill ${fillMode === 'fade' ? 'is-fade' : ''}`}
            x={x}
            y={lineY(lineIndex)}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize={fontSize}
            fontWeight={fontWeight}
            fontFamily={fontFamily}
            letterSpacing={letterSpacing}
            style={gradientColors ? { fill: `url(#${gradientId})` } : undefined}
            clipPath={fillMode === 'wipe' ? `url(#${clipId})` : undefined}
            key={`fill-${line}`}
          >
            {line}
          </text>
        ))}
      </svg>
    </div>
  )
}
