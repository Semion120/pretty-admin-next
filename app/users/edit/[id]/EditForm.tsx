'use client'
import { Button, Text } from '@gravity-ui/uikit'

import { useContext, useEffect, useReducer, useState } from 'react'
import { BaseSelect } from '@/app/components/inputs/select'
import { BaseInput } from '@/app/components/inputs/text'
import { BaseCheckBox } from '@/app/components/inputs/checkbox'
import { Option } from '@/app/components/inputs/checkbox/BaseCheckBox'

import { fetchAdmins } from '@/app/actions/Users'
import { User } from '@/data/users/member'
import { AuthContext } from '@/app/lib/context/Auth'
import { useFormState } from 'react-dom'
import EditUserAction from './EditUserAction'
import { useRouter } from 'next/navigation'

export default function EditUserForm({ oldUser }: { oldUser: User }) {
  const router = useRouter()
  const defaultUser: User = oldUser
  const roleOptions = [
    { value: 'admin', content: 'Админ', name: 'role' },
    { value: 'user', content: 'Юзер', name: 'role' },
  ]
  let availableOptions: Option[] = [
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

  const [user, dispatch] = useReducer(EditUserReducer, defaultUser)
  const defaultRole = [
    roleOptions.find((el) => {
      return el.value === oldUser.role
    })?.content,
  ]
  if (user.availableOptions.length > 0) {
    availableOptions = availableOptions.map((el) => {
      const isExistInUser = user.availableOptions.find((userEl: string) => {
        return userEl === el.value
      })
      if (isExistInUser) {
        el.defaultChecked = true
        return el
      }
      return el
    })
  }
  const defaultCreater = [user.creater]

  const [formState, action] = useFormState(EditUserAction, {
    status: undefined,
  })
  if (formState.status === 'valid') {
    router.push('/users')
  }

  function EditUser() {
    const newUser: User = user
    const payloadData = { oldUser, newUser }
    if (newUser.role == 'admin' && authUser.role === 'owner') {
      newUser.creater = authUser.login
    }
    action(payloadData)
  }
  return (
    <>
      {formState.errorMsgs?.fieldsForUpdate?.msg && (
        <Text variant="body-1" color="danger" className="big-error">
          {formState.errorMsgs?.fieldsForUpdate?.msg}
        </Text>
      )}
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
          defaultValue={user.login}
        />
        <BaseInput
          placeholder="Пароль"
          name="pass"
          onUpdate={(val: string) => {
            dispatch({ type: 'update', payload: { pass: val } })
          }}
          defaultValue={user.pass}
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
            defaultValue={defaultRole}
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
            defaultValue={defaultCreater}
          />
        )}
        <div className="action-button">
          <Button type="button" view="action" onClick={EditUser}>
            Редактировать
          </Button>
        </div>
      </form>
    </>
  )
}

function EditUserReducer(userState: User, action: Action) {
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
