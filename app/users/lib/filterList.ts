import { User } from '@/data/users/member'

type UserFilter = {
  searchString: string
  role: 'all' | User['role']
}

export default function filterList(
  userLogin: string,
  arr: User[] | null,
  filter: UserFilter | undefined
): User[] | null {
  let filteredArr
  if (!arr) {
    return null
  }
  if (!filter) {
    return arr
  }

  if (filter.searchString) {
    filteredArr = arr.filter((el) => {
      return (
        el.login.includes(filter.searchString) &&
        el.role !== 'owner' &&
        el.login !== userLogin
      )
    })
  } else {
    switch (filter.role) {
      case 'all': {
        filteredArr = arr.filter((el) => {
          return el.role !== 'owner' && el.login !== userLogin
        })
        break
      }
      default: {
        filteredArr = arr.filter((el) => {
          return el.role == filter.role && el.login !== userLogin
        })
        break
      }
    }
  }
  return filteredArr
}
