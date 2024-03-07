'use client'
import { UserCard, ProjectCard, ArticleCard } from '@/app/components/cards'

import './style.scss'
import block from 'bem-cn-lite'
import { useContext } from 'react'
import { AuthContext } from '../lib/context/Auth'

const b = block('dashboard-page')

export default function Dashboard() {
  const authUser = useContext(AuthContext)
  return (
    <div className={b()}>
      {authUser.availableOptions.includes('users') && <UserCard />}
      {authUser.availableOptions.includes('projects') && <ProjectCard />}
      {authUser.availableOptions.includes('articles') && <ArticleCard />}
    </div>
  )
}
