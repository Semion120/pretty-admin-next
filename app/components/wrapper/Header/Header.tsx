'use client'
import { Button, Icon, Link, Text } from '@gravity-ui/uikit'
import { Bars, Xmark } from '@gravity-ui/icons'
import './style.scss'
import block from 'bem-cn-lite'
import AvailableOptions from '@/data/availableOptions'
import { useState } from 'react'
import LogOutBtn from './LogOutBtn'

const b = block('header')

export default function Header({
  availableOptions,
}: {
  availableOptions: AvailableOptions
}) {
  let navData = []
  const [isOpenMenu, setMenuStatus] = useState(false)

  for (let i of availableOptions) {
    switch (i) {
      case 'projects': {
        navData.push({ name: 'Проекты', href: '/projects' })
        break
      }
      case 'articles': {
        navData.push({ name: 'Статьи', href: '/articles' })
        break
      }
      case 'users': {
        navData.push({ name: 'Пользователи', href: '/users' })
        break
      }
    }
  }

  return (
    <header className={b()}>
      <div className={b('logo')}>
        <Link href="/dashboard">
          <span className={b('logo-image')}></span>
        </Link>
      </div>
      <div className={b('navs')}>
        {navData.length > 0 &&
          navData.map((el) => {
            return <NavLink key={el.name} name={el.name} href={el.href} />
          })}
        <LogOutBtn />
      </div>

      <div className={b('hamburger')}>
        <Button
          onClick={() => {
            setMenuStatus(!isOpenMenu)
          }}
          view="outlined"
        >
          <Icon data={isOpenMenu ? Xmark : Bars}></Icon>
        </Button>
      </div>
      <div
        className={b('hamburger-content', {
          open: isOpenMenu,
        })}
      >
        <div
          className={b('hamburger-content', {
            navs: true,
          })}
        >
          {navData.length > 0 &&
            navData.map((el) => {
              return <NavLink key={el.name} name={el.name} href={el.href} />
            })}
          <LogOutBtn />
        </div>
      </div>
    </header>
  )
}

function NavLink({ name, href }: { name: string; href: string }) {
  return (
    <Link view="primary" className="nav" href={href}>
      <Text variant="subheader-2">{name}</Text>
    </Link>
  )
}
