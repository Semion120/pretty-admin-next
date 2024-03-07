'use server'
import {
  addUser,
  checkUser,
  getUser,
  getUserById,
  getUsers,
} from '@/data/users'
import { User } from '@/data/users/member'

export async function checkUserAuth(loginCookie: string, passCookie: string) {
  try {
    const isAuth = checkUser(loginCookie, passCookie)
    if (isAuth) {
      const user = getUser(loginCookie)
      const { login, pass, availableOptions, role } = user
      return { login, pass, availableOptions, role }
    } else {
      return isAuth
    }
  } catch (error) {
    return false
  }
}

export async function getAllUsers() {
  const users = await getUsers()
  return users
}

export async function findUserById(id: string) {
  const users = await getUserById(id)
  return users
}

export async function AddUser(user: User) {
  const status = await addUser(user)
  return status
}
