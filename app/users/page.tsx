'use client'
import './styles.scss'
import {
  Text,
  TextInput,
  Tabs,
  Table,
  withTableActions,
  Loader,
  Button,
  Icon,
} from '@gravity-ui/uikit'
import { CirclePlus } from '@gravity-ui/icons'
import block from 'bem-cn-lite'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { deleteUser, fetchUsers } from '@/app/actions/Users'
import { User } from '@/data/users/member'
import { AuthContext, InitData } from '../lib/context/Auth'
import { useRouter } from 'next/navigation'

const b = block('users-page')

export default function Users() {
  const [search, setSearch] = useState<string>('')
  const [role, setRole] = useState<UserFilter['role']>('all')

  const router = useRouter()

  let filterItem: UserFilter = { searchString: search, role }

  return (
    <div className={b()}>
      <h1>
        <Text variant="display-3">Юзеры</Text>
        <Button
          view="action"
          size="l"
          className="add-new-btn"
          onClick={() => {
            router.push('/users/add')
          }}
        >
          <Icon data={CirclePlus} size={25} />
        </Button>
      </h1>
      <div className={b('head')}>
        <TextInput
          className="search"
          onUpdate={(value: string) => {
            setSearch(value)
          }}
          placeholder="Поиск по логину"
        />
        <Tabs
          activeTab={role}
          size="xl"
          items={[
            { id: 'all', title: 'Все', disabled: Boolean(search) },
            { id: 'admin', title: 'Админ', disabled: Boolean(search) },
            { id: 'user', title: 'Юзер', disabled: Boolean(search) },
          ]}
          onSelectTab={(tabId: UserFilter['role']) => {
            setRole(tabId)
          }}
        />
      </div>
      <UsersList filter={filterItem} />
    </div>
  )
}

function UsersList({ filter }: { filter?: UserFilter }) {
  const userContext = useContext(AuthContext)

  const [users, setUsers] = useState<User[] | null>(null)
  useEffect(() => {
    if (!users) {
      fetchUsers().then(setUsers)
    }
  }, [])

  const filterListByUser = filterList.bind(null, userContext.login)
  const filteredList = filterListByUser(users, filter)

  return (
    <div className={b('list')}>
      {filteredList ? (
        <UsersTable
          users={filteredList}
          activeUser={userContext}
          setUsers={setUsers}
        />
      ) : (
        <Loader size="l" className="loader" />
      )}
    </div>
  )
}

function UsersTable({
  users,
  activeUser,
  setUsers,
}: {
  users: User[]
  activeUser: InitData
  setUsers: Dispatch<SetStateAction<User[] | null>>
}) {
  const router = useRouter()

  const MyTable = withTableActions(Table)
  const data: any[] = users.map((el) => {
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
    if (activeUser.role == 'admin' && el.role == 'admin') {
      pass = ''
    }
    if (activeUser.role === 'admin' && el.creater !== activeUser.login) {
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
  })
  const columns = [
    {
      id: 'login',
      name: 'Логин',
    },
    {
      id: 'pass',
      name: 'Пароль',
    },
    {
      id: 'role',

      name: 'Роль',
    },
    {
      id: 'creater',
      name: 'Создатель',
    },
    {
      id: 'availableOptions',
      name: 'Права',
    },
    {
      id: 'id',
    },
  ]

  const getRowActions = (item: any, index: number) => {
    const rowActions = [
      {
        text: 'Изменить',
        handler: (item: any, index: number) => {
          router.push('/users/edit/' + item.id)
        },
        disabled: false,
      },
      {
        text: 'Удалить',
        handler: (item: any, index: number) => {
          deleteUser(item.id)
          setUsers(
            users.filter((el) => {
              return el._id !== item.id
            })
          )
        },
        disabled: false,
      },
    ]
    if (activeUser.role == 'owner') {
      return rowActions
    }

    if (item.role == 'Админ' && activeUser.role == 'admin') {
      rowActions[0].disabled = true
      rowActions[1].disabled = true
    }
    if (item.creater !== activeUser.login) {
      rowActions[0].disabled = true
      rowActions[1].disabled = true
    }

    return rowActions
  }

  return (
    <MyTable
      data={data}
      columns={columns}
      getRowActions={getRowActions}
      emptyMessage="Не найдено"
    />
  )
}

function filterList(
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

type UserFilter = {
  searchString: string
  role: 'all' | User['role']
}
