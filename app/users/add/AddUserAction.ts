'use server'

import { AddUser } from '@/app/lib/api/users'
import { User } from '@/data/users/member'

export default async function AddUserAction(
  currentState: AddUserState,
  payload: FormData
): Promise<AddUserState> {
  const { user, errorMsgs } = validateData(payload)

  if (user) {
    const status = await AddUser(user)

    return { status: 'valid' }
  } else {
    return { status: 'invalid', errorMsgs }
  }
}

type AddUserState = {
  status: 'valid' | 'invalid' | undefined
  userData?: User
  errorMsgs?: ErrorMsgsType
}

type ErrorMsgsType = {
  login?: { msg: string; status: undefined | 'invalid' }
  pass?: { msg: string; status: undefined | 'invalid' }
  availableOptions?: { msg: string; status: undefined | 'invalid' }
}

function validateData(data: FormData): {
  user: User | undefined
  errorMsgs: ErrorMsgsType
} {
  const errorMsgs: ErrorMsgsType = {}

  const _id = data.get('_id') as string

  const login = data.get('login') as string
  if (!login) errorMsgs.login = { msg: 'Не заполнено поле', status: 'invalid' }

  const pass = data.get('pass') as string
  if (!pass) errorMsgs.pass = { msg: 'Не заполнено поле', status: 'invalid' }

  const availableOptions = data.getAll(
    'availableOptions'
  ) as User['availableOptions']
  if (!availableOptions[0]) {
    errorMsgs.availableOptions = {
      msg: 'Нужно выбрать хотя бы одно',
      status: 'invalid',
    }
  }

  const role = data.get('role') as User['role']
  if (role == 'admin') availableOptions.push('users')

  const creater = data.get('creater') as string

  if (Object.keys(errorMsgs).length > 0) {
    return { user: undefined, errorMsgs }
  } else {
    return {
      user: { _id, login, pass, availableOptions, role, creater },
      errorMsgs,
    }
  }
}
