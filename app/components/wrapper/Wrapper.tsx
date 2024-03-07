'use client'

import React, { useContext } from 'react'
import block from 'bem-cn-lite'
import { ThemeProvider } from '@gravity-ui/uikit'
import Header from './Header/Header'

import './Wrapper.scss'
import { AuthContext } from '@/app/lib/context/Auth'
import { usePathname } from 'next/navigation'
import { cancelAuth } from '@/app/actions/Users'

const b = block('wrapper')

export const DARK = 'dark-hc'
export const LIGHT = 'light-hc'
const DEFAULT_THEME = LIGHT

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`

export type AppProps = {
  children: React.ReactNode
}

export const Wrapper: React.FC<AppProps> = ({ children }) => {
  const auth = useContext(AuthContext)
  const route = usePathname()

  if (!auth.isAuth && route !== '/') {
    cancelAuth()
  } else {
    return (
      <ThemeProvider theme={DEFAULT_THEME}>
        <div className={b()}>
          {auth.isAuth && <Header availableOptions={auth.availableOptions} />}
          <div className={b('content')}>{children}</div>
        </div>
      </ThemeProvider>
    )
  }
}

export type AuthStatus = {
  isAuth?: boolean
  availableOptions?: string[]
}
