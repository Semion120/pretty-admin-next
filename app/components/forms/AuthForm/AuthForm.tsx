'use client'
import { Button, TextInput } from '@gravity-ui/uikit'
import { useContext } from 'react'
import { AuthContext, AuthDispatchContext } from '@/app/lib/context/Auth'
import { useRouter } from 'next/navigation'
import AuthAction from './AuthAction'
import block from 'bem-cn-lite'
import { useFormState, useFormStatus } from 'react-dom'

import './style.scss'
import { redirectToDash } from '@/app/actions/Helpers'

const b = block('auth-form')

export default function AuthForm() {
  const authUser = useContext(AuthContext)

  if (authUser.isAuth) {
    redirectToDash()
  }

  const dispatch = useContext(AuthDispatchContext)
  const router = useRouter()

  const [state, action] = useFormState(AuthAction, { status: undefined })

  if (state.userData && state.userData.isAuth) {
    dispatch({ type: 'updateLoginPass', payload: state.userData })
    router.push('/dashboard')
  }

  return (
    <div className={b()}>
      <form action={action}>
        <TextInput
          name="login"
          className={b('input')}
          type="text"
          placeholder="Логин"
          validationState={state.status}
        />
        <TextInput
          name="pass"
          className={b('input')}
          type="text"
          placeholder="Пароль"
          validationState={state.status}
          errorMessage={state.message}
        />
        <AuthorizeButton />
      </form>
    </div>
  )
}

function AuthorizeButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" size="m" view="action" disabled={pending}>
      {pending ? 'Вхожу' : 'Войти'}
    </Button>
  )
}
