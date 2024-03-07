'use client'

import { useContext } from 'react'
import { AuthContext } from '@/app/lib/context/Auth'
import { useRouter } from 'next/navigation'

export default function UsersLayout({ children }: LayoutProps) {
  const authUser = useContext(AuthContext)
  const router = useRouter()
  if (!authUser.availableOptions.includes('articles')) {
    router.push('/dashboard')
    return <></>
  }
  return <>{children}</>
}

type LayoutProps = {
  children: React.ReactNode
}
