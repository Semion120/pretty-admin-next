import AvailableOptions from '@/data/users/availableOptions'
import { Context, Dispatch, createContext } from 'react'

export const defaultAuthState: InitData = {
  login: '',
  pass: '',
  availableOptions: [''],
  isAuth: false,
}

export const AuthContext: Context<InitData> = createContext(defaultAuthState)
export const AuthDispatchContext: Context<Dispatch<Action>> = createContext(
  (value: Action) => {}
)

export type InitData = {
  login: string
  pass: string
  isAuth?: boolean
  role?: string
  availableOptions: AvailableOptions
}

export type Action = {
  type: string
  payload: InitData
}
