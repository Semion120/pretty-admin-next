import type { Metadata } from 'next'
import { DEFAULT_BODY_CLASSNAME, Wrapper } from '@/app/components/wrapper'
import AuthProvider from '@/app/components/auth'

import '@gravity-ui/uikit/styles/fonts.css'
import '@gravity-ui/uikit/styles/styles.css'
import '@/styles/globals.scss'
import { cookies } from 'next/headers'
import { checkUserAuth } from '@/app/lib/api/users'
import { InitData } from '@/app/lib/context/Auth'

export const metadata: Metadata = {
  title: 'Авторизация',
  description: 'Авторизация в админке для сайта',
}

export default async function RootLayout({ children }: LayoutProps) {
  const login = cookies().get('login')
  const pass = cookies().get('pass')

  const authFromCookie: InitData = {
    login: '',
    pass: '',
    isAuth: false,
    role: 'user',
    availableOptions: [''],
  }
  if (login && pass) {
    authFromCookie.login = login.value
    authFromCookie.pass = pass.value

    const isAuth = await checkUserAuth(
      authFromCookie.login,
      authFromCookie.pass
    )

    if (isAuth && isAuth.availableOptions && isAuth.role) {
      authFromCookie.availableOptions = isAuth.availableOptions
      authFromCookie.role = isAuth.role
      authFromCookie.isAuth = true
    }
  }

  return (
    <html lang="ru">
      <AuthProvider authFromCookie={authFromCookie}>
        <body className={DEFAULT_BODY_CLASSNAME}>
          <Wrapper>{children}</Wrapper>
        </body>
      </AuthProvider>
    </html>
  )
}

type LayoutProps = {
  children: React.ReactNode
}
