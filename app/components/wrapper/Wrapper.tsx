'use client'

import React from 'react'
import block from 'bem-cn-lite'
import { Theme, ThemeProvider } from '@gravity-ui/uikit'

import './Wrapper.scss'

const b = block('wrapper')

export const DARK = 'dark-hc'
export const LIGHT = 'light-hc'
const DEFAULT_THEME = LIGHT

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`

export type AppProps = {
  children: React.ReactNode
}

export const Wrapper: React.FC<AppProps> = ({ children }) => {
  const [theme, setTheme] = React.useState<Theme>(DEFAULT_THEME)

  return (
    <ThemeProvider theme={theme}>
      <div className={b()}>
        <div className={b('layout')}>
          <div className={b('content')}>{children}</div>
        </div>
      </div>
    </ThemeProvider>
  )
}
