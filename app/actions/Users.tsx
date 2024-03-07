'use server'
import { checkUserAuth, findUserById, getAllUsers } from '@/app/lib/api/users'
import { cookies } from 'next/headers'
import { InitData } from '@/app/lib/context/Auth'
import { User } from '@/data/users/member'
import { editUser, removeUser } from '@/data/users'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore, revalidatePath } from 'next/cache'

export async function checkAndUpdateUser(login: string, pass: string) {
  const isExist = await checkUserAuth(login, pass)

  if (isExist) {
    let cookieAge = 1000 * 60
    switch (isExist.role) {
      case 'owner': {
        cookieAge = 1000 * 60 * 60 * 24 * 150
      }
      case 'admin': {
        cookieAge = 1000 * 60 * 60 * 24 * 3
      }
      default: {
        cookieAge = 1000 * 60 * 60 * 12
      }
    }
    cookies().set('login', isExist.login, { maxAge: cookieAge })
    cookies().set('pass', isExist.pass, { maxAge: cookieAge })
    cookies().set('isAuth', 'true', { maxAge: cookieAge })

    const updatedUserData: InitData = isExist
    updatedUserData.isAuth = true
    return updatedUserData
  }
}
export type CheckUpdateUserType = (
  login: string,
  pass: string
) => Promise<InitData | undefined>

export async function fetchUsers() {
  const users: User[] = await getAllUsers()
  return users
}

export async function fetchUserById(id: string) {
  noStore()
  const users: User = await findUserById(id)
  return users
}

export async function fetchAdmins() {
  const users: User[] = await getAllUsers()
  return users.filter((el) => {
    return el.role == 'admin'
  })
}

export async function deleteUser(id: User['_id']) {
  const isDeleted = await removeUser(id)
  return isDeleted
}

export async function editUserOnServer(id: string, fieldsForUpdate: any) {
  const isSaved = await editUser(id, fieldsForUpdate)
  revalidatePath('/users/edit/' + id)
  return isSaved
}

export async function cancelAuth() {
  cookies().delete('login')
  cookies().delete('pass')
  cookies().delete('isAuth')
  redirect('/')
}
