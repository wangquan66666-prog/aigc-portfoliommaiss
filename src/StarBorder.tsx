import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

type StarBorderCommonProps = {
  children: ReactNode
  className?: string
  color?: string
  speed?: string
  style?: CSSProperties
}

type StarBorderProps = StarBorderCommonProps & (
  | ({ as?: 'button' } & ButtonHTMLAttributes<HTMLButtonElement>)
  | ({ as: 'a' } & AnchorHTMLAttributes<HTMLAnchorElement>)
)

type StarBorderStyle = CSSProperties & {
  '--star-border-color': string
  '--star-border-speed': string
}

export default function StarBorder({
  as = 'button',
  children,
  className = '',
  color = 'white',
  speed = '5s',
  style,
  ...props
}: StarBorderProps) {
  const starStyle = {
    ...style,
    '--star-border-color': color,
    '--star-border-speed': speed,
  } as StarBorderStyle
  const classes = `star-border ${className}`.trim()

  if (as === 'a') {
    return (
      <a className={classes} style={starStyle} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} style={starStyle} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
