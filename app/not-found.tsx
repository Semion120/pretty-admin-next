'use client'

import { Link } from '@gravity-ui/uikit'

export default function NotFound() {
  return (
    <div>
      <h2>Страница не найдена</h2>
      <p>Такой странице не существет. Лучше начинать с главной страницы?</p>
      <Link href="/">Вернуться на главную</Link>
    </div>
  )
}
