import { Text } from '@gravity-ui/uikit'

import block from 'bem-cn-lite'
import '@/app/styles.scss'
import { Metadata } from 'next'

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
            <Text variant="display-3">Разработка WEB-приложений</Text>
          </h1>

          <p>
            <Text variant="subheader-2">
              Создаю Frontend и Backend под бизнес-процессы клиентов.
            </Text>
          </p>
        </div>
      </div>
    </div>
  )
}
