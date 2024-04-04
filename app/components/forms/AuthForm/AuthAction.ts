'use server'

import { checkAndUpdateUser } from '@/app/actions/Users'
import { InitData } from '@/app/lib/context/Auth'

export default async function AuthAction(
  currentState: AuthFormState,
  payload: FormData
): Promise<AuthFormState> {
  const login = payload.get('login')
  const pass = payload.get('pass')
  if (login && pass) {
    const user = await checkAndUpdateUser(String(login), String(pass))
    if (user) {
      return { status: undefined, userData: user }
    } else {
      return { status: 'invalid', message: 'Пользователь не найден' }
    }
  } else {
    return { status: 'invalid', message: 'Не хватает данных' }
  }
}

type AuthFormState = {
  status: 'invalid' | undefined
  userData?: InitData
  message?: string
}
