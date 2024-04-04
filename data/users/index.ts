import { User } from './member'
import { writeFileSync, readFileSync } from 'fs'

const folder = __dirname.replace(/\.next.*/, '')
const pathToFile = folder + 'data/users/data.txt'

export function getUser(login: string) {
  const users = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  const result: User | undefined = users.filter((el: any) => {
    return el.login == login
  })[0]
  if (!result) {
    throw new Error('Не найден пользователь')
  }
  return result
}

export function getUserById(id: string) {
  const users = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  const result: User | undefined = users.filter((el: any) => {
    return el._id == id
  })[0]
  if (!result) {
    throw new Error('Не найден пользователь')
  }
  return result
}

export function getUsers() {
  const users = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  return users
}

export function checkUser(login: string, pass: string) {
  const users = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  const result: User | undefined = users.filter((el: any) => {
    return el.login == login && el.pass == pass
  })[0]

  if (result) {
    return true
  } else {
    return false
  }
}

export async function addUser(user: User) {
  const users = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  users.push(user)
  writeFileSync(pathToFile, JSON.stringify(users))

  return true
}

export async function removeUser(id: string): Promise<boolean> {
  try {
    let users = JSON.parse(
      readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
    )
    console.log(users, id)
    users = users.filter((el: any) => {
      return el._id !== id
    })
    console.log(users, id)
    writeFileSync(pathToFile, JSON.stringify(users))
    return true
  } catch (e) {
    return false
  }
}

export async function editUser(id: string, fieldsForUpdate: any) {
  let users = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  const userIndex = users.findIndex((el: any) => {
    return el._id == id
  })

  for (let key in fieldsForUpdate) {
    users[userIndex][key] = fieldsForUpdate[key]
  }

  writeFileSync(pathToFile, JSON.stringify(users))
  return true
}
