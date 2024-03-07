'use client'
import { Button, Icon } from '@gravity-ui/uikit'
import { ArrowRightFromSquare } from '@gravity-ui/icons'
import { useContext, useTransition } from 'react'
import {
  AuthContext,
  AuthDispatchContext,
  defaultAuthState,
} from '@/app/lib/context/Auth'
import { cancelAuth } from '@/app/actions/Users'

export default function LogOutBtn() {
  const authUser = useContext(AuthContext)
  const dispatch = useContext(AuthDispatchContext)
  const [isPending, startTransition] = useTransition()

  return (
    <Button
      view="outlined-action"
      size="s"
      onClick={() => {
        startTransition(() => {
          dispatch({ type: 'logOut', payload: defaultAuthState })
          cancelAuth()
        })
      }}
    >
      {authUser.login}
      <Icon data={ArrowRightFromSquare} size={18} />
    </Button>
  )
}
