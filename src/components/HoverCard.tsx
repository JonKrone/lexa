import { Box, ClickAwayListener, Popper } from '@mui/material'
import React, { ReactElement, useEffect, useRef, useState } from 'react'
import { Providers } from './Providers'
import { ShadowDOM } from './ShadowDOM'

const HOVER_DELAY = 350

interface HoverCardProps {
  onHover: () => void
  content: ReactElement
  children: React.ReactNode
}

export const HoverCard: React.FC<HoverCardProps> = ({
  onHover,
  content,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    onHover()

    hoverTimerRef.current = setTimeout(() => {
      setIsOpen(true)
    }, HOVER_DELAY)
  }

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  const handleClick = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    setIsOpen((prev) => !prev)
  }

  const handleClickAway = () => {
    setIsOpen(false)
  }

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleEscapeKey)

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
    }
  }, [])

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="lexa-click-away-listener">
        <Box
          className="lexa-hover-card-anchor"
          ref={anchorRef}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </Box>
        <Popper
          open={isOpen}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          modifiers={[
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
              },
            },
          ]}
        >
          <ShadowDOM>
            <Providers>{content}</Providers>
            {/* {content} */}
          </ShadowDOM>
        </Popper>
      </div>
    </ClickAwayListener>
  )
}
