import { InitData } from '@/app/lib/context/Auth'
import { User } from '@/data/users/member'

export default function normalizeItem(userContext: InitData, el: User) {
  let roleRu: any = el.role
  switch (el.role) {
    case 'owner': {
      roleRu = 'Владелец'
      break
    }
    case 'admin': {
      roleRu = 'Админ'
      break
    }
    default: {
      roleRu = 'Юзер'
      break
    }
  }

  let pass = el.pass
  if (userContext.role == 'admin' && el.role == 'admin') {
    pass = ''
  }
  if (userContext.role === 'admin' && el.creater !== userContext.login) {
    pass = ''
  }

  const options: string[] = []
  el.availableOptions.forEach((el) => {
    switch (el) {
      case 'articles': {
        options.push('статьи')
        break
      }
      case 'projects': {
        options.push('проекты')
        break
      }
      case 'users': {
        options.push('юзеры')
        break
      }
    }
  })
  const rights = options.join()
  return {
    id: el._id,
    login: el.login,
    pass,
    role: roleRu,
    availableOptions: rights,
    creater: el.creater,
  }
}
