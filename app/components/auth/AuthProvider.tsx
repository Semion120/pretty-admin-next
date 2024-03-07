'use client'

import { AuthContext, AuthDispatchContext } from '@/app/lib/context/Auth'
import { useReducer } from 'react'
import { Action, InitData, defaultAuthState } from '../../lib/context/Auth'

export default function AuthProvider({
  children,
  authFromCookie,
}: AuthProviderProps) {
  let defaultState = defaultAuthState

  const { login, pass, isAuth, availableOptions, role } = authFromCookie

  if (login && pass && isAuth) {
    defaultState = { login, pass, isAuth, availableOptions, role }
  }

  const [authState, dispatch] = useReducer(AuthReducer, defaultState)

  return (
    <AuthContext.Provider value={authState}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthContext.Provider>
  )
}

function AuthReducer(authData: InitData, action: Action) {
  switch (action.type) {
    case 'updateLoginPass': {
      return {
        login: action.payload.login,
        pass: action.payload.pass,
        isAuth: action.payload.isAuth,
        role: action.payload.role,
        availableOptions: action.payload.availableOptions,
      }
    }
    case 'logOut': {
      return defaultAuthState
    }
    default: {
      return authData
    }
  }
}

type AuthProviderProps = {
  children: React.ReactNode
  authFromCookie: InitData
}
