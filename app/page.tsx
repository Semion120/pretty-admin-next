import { Text } from '@gravity-ui/uikit'
import '@/app/styles.scss'

import { Metadata } from 'next'
import AuthForm from '@/app/components/forms/AuthForm'
import block from 'bem-cn-lite'

export const metadata: Metadata = {
  title: 'Авторизация в админке',
  description: 'Необходим логин и пароль от руководителя',
}

const b = block('main-page')

export default function Home() {
  return (
    <div className={b()}>
      <div className={b('landing-section')}>
        <div className={b('landing-section', { text: true })}>
          <h1>
            <Text variant="display-3">Авторизация</Text>
          </h1>
          <p>
            <Text variant="body-3">
              Получите данные для входа у администратора
            </Text>
          </p>
          <AuthForm />
        </div>
      </div>
    </div>
  )
}
