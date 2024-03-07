'use client'
import './styles.scss'

import { Button, Text } from '@gravity-ui/uikit'
import { useContext, useEffect, useId, useReducer, useState } from 'react'
import { BaseSelect } from '@/app/components/inputs/select'
import { BaseInput } from '@/app/components/inputs/text'
import { BaseCheckBox } from '@/app/components/inputs/checkbox'

import block from 'bem-cn-lite'
import { fetchAdmins } from '@/app/actions/Users'
import { User } from '@/data/users/member'
import { AuthContext } from '@/app/lib/context/Auth'
import { useFormState } from 'react-dom'
import AddUserAction from './AddUserAction'
import { useRouter } from 'next/navigation'

const b = block('users-add')

export default function AddUser() {
  const router = useRouter()
  const randomPass = useId().replaceAll(':', '')
  const roleOptions = [
    { value: 'admin', content: 'Админ', name: 'role' },
    { value: 'user', content: 'Юзер', name: 'role' },
  ]
  const availableOptions = [
    {
      content: 'Проекты',
      value: 'projects',
      name: 'availibleOptions',
    },
    { content: 'Статьи', value: 'articles', name: 'availibleOptions' },
  ]
  const authUser = useContext(AuthContext)
  const [admins, setAdmins] = useState<{ value: string; content: string }[]>([
    { value: authUser.login, content: authUser.login },
  ])
  useEffect(() => {
    fetchAdmins().then((val) => {
      const adminsSelect = val.map((el) => {
        return { value: el.login, content: el.login, name: 'creator' }
      })
      const allCreators = [...admins, ...adminsSelect]
      setAdmins(allCreators)
    })
  }, [])

  const defaultUser: User = {
    _id: useId().replaceAll(':', ''),
    login: '',
    pass: randomPass,
    role: 'owner',
    creater: '',
    availableOptions: [''],
  }
  const [user, dispatch] = useReducer(CreateUserReducer, defaultUser)

  const [formState, action] = useFormState(AddUserAction, { status: undefined })
  if (formState.status === 'valid') {
    router.push('/users')
  }

  function CreateUser() {
    const formData = new FormData()
    for (let key in user) {
      const value = user[key]
      switch (key) {
        case 'availableOptions': {
          value.forEach((el: any) => {
            formData.append(key, el)
          })
          break
        }
        default: {
          formData.set(key, value)
          break
        }
      }
    }
    if (!user.creater) formData.set('creater', authUser.login)
    if (!user.role || authUser.role === 'admin') formData.set('role', 'user')

    action(formData)
  }
  return (
    <div className={b()}>
      <h1>
        <Text variant="display-3">Добавить юзера</Text>
      </h1>

      <form>
        <BaseInput
          placeholder="Логин"
          label="Логин*:"
          onUpdate={(val: string) => {
            dispatch({ type: 'update', payload: { login: val } })
          }}
          name="login"
          hasClear
          gloss="Только английские символы и цифры, пример: semion120"
          errorMessage={formState.errorMsgs?.login?.msg}
          validationState={formState.errorMsgs?.login?.status}
          className="user-inputs-mb"
        />
        <BaseInput
          placeholder="Пароль"
          name="pass"
          onUpdate={(val: string) => {
            dispatch({ type: 'update', payload: { pass: val } })
          }}
          defaultValue={randomPass}
          label="Пароль*:"
          hasClear
          gloss="Генерируется автоматически. При необходимости можно заменить на любой другой. Только англ. буквы и цифры без пробелов."
          errorMessage={formState.errorMsgs?.pass?.msg}
          validationState={formState.errorMsgs?.pass?.status}
          className="user-inputs-mb"
        />
        {authUser.role === 'owner' && (
          <BaseSelect
            placeholder="Роль"
            hasClear
            onUpdate={(val: string) => {
              dispatch({ type: 'update', payload: { role: val[0] } })
            }}
            options={roleOptions}
            gloss="Админ - может создавать новых пользоватлей. Юзер - не может создавать новых пользователей"
            className="user-inputs-mb"
          />
        )}

        <BaseCheckBox
          options={availableOptions}
          subheader="Дать права на*:"
          onUpdate={(val: string[]) => {
            dispatch({
              type: 'update',
              payload: { availableOptions: val },
            })
          }}
          errorMessage={formState.errorMsgs?.availableOptions?.msg}
          validationState={formState.errorMsgs?.availableOptions?.status}
          className="user-inputs-mb"
        />
        {authUser.role === 'owner' && user.role === 'user' && (
          <BaseSelect
            placeholder="Создатель"
            hasClear
            onUpdate={(val: string) => {
              dispatch({ type: 'update', payload: { creater: val[0] } })
            }}
            options={admins}
            gloss="Позволяет закрепить нового юзера за любым из админов"
            className="user-inputs-mb"
          />
        )}
        <Button type="button" view="action" onClick={CreateUser}>
          Создать нового
        </Button>
      </form>
    </div>
  )
}

function CreateUserReducer(userState: User, action: Action) {
  switch (action.type) {
    case 'update': {
      const updateData: any = action.payload
      const updateDataKey = Object.keys(updateData)[0]

      const updatedUser: any = Object.assign({}, userState)
      updatedUser[updateDataKey] = updateData[updateDataKey]
      return updatedUser
    }
    default: {
      return userState
    }
  }
}

export type Action = {
  type: string
  payload: object
}
