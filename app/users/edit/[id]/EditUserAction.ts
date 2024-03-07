'use server'

import { editUserOnServer } from '@/app/actions/Users'
import { AddUser } from '@/app/lib/api/users'
import { User } from '@/data/users/member'

export default async function EditUserAction(
  currentState: EditUserState,
  payload: PayloadEdit
): Promise<EditUserState> {
  const { user, errorMsgs } = validateData(payload.newUser)

  const fieldsForUpdate = compareData(payload)
  const keysForUpdate = Object.keys(fieldsForUpdate)
  if (keysForUpdate.length == 0) {
    errorMsgs.fieldsForUpdate = {
      msg: 'Чтобы редактировать пользователя, нужно изменить данные',
      status: 'invalid',
    }
  }

  if (user && keysForUpdate.length > 0) {
    const status = await editUserOnServer(user._id, fieldsForUpdate)

    return { status: 'valid' }
  } else {
    return { status: 'invalid', errorMsgs }
  }
}

type EditUserState = {
  status: 'valid' | 'invalid' | undefined
  userData?: User
  errorMsgs?: ErrorMsgsType
}

type ErrorMsgsType = {
  login?: { msg: string; status: undefined | 'invalid' }
  pass?: { msg: string; status: undefined | 'invalid' }
  availableOptions?: { msg: string; status: undefined | 'invalid' }
  fieldsForUpdate?: { msg: string; status: undefined | 'invalid' }
}

type PayloadEdit = {
  oldUser: User
  newUser: User
}

function validateData(data: User): {
  user: User | undefined
  errorMsgs: ErrorMsgsType
} {
  const errorMsgs: ErrorMsgsType = {}

  const _id = data._id

  const login = data.login
  if (!login) errorMsgs.login = { msg: 'Не заполнено поле', status: 'invalid' }

  const pass = data.pass
  if (!pass) errorMsgs.pass = { msg: 'Не заполнено поле', status: 'invalid' }

  let availableOptions = data.availableOptions
  if (!availableOptions[0]) {
    errorMsgs.availableOptions = {
      msg: 'Нужно выбрать хотя бы одно',
      status: 'invalid',
    }
  }

  const role = data.role
  if (role === 'admin' && !availableOptions.includes('users')) {
    availableOptions.push('users')
  } else if (role === 'user') {
    availableOptions = availableOptions.filter((el) => {
      return el !== 'users'
    })
  }

  const creater = data.creater

  if (Object.keys(errorMsgs).length > 0) {
    return { user: undefined, errorMsgs }
  } else {
    return {
      user: { _id, login, pass, availableOptions, role, creater },
      errorMsgs,
    }
  }
}

function compareData(data: PayloadEdit) {
  const oldU: any = data.oldUser
  const newU: any = data.newUser

  const keys = Object.keys(oldU).filter((el) => {
    return el !== '_id'
  })

  const updatedData: any = {}

  for (let key of keys) {
    switch (key) {
      case 'availableOptions': {
        if (newU[key].length !== oldU[key].length) {
          updatedData[key] = newU[key]
          break
        } else {
          let isSame = true
          newU[key].forEach((el: any) => {
            if (!oldU[key].includes(el)) {
              isSame = false
            }
          })
          if (!isSame) {
            updatedData[key] = newU[key]
          }
          break
        }
      }
      default: {
        if (oldU[key] !== newU[key]) {
          updatedData[key] = newU[key]
        }
      }
    }
  }
  return updatedData
}
