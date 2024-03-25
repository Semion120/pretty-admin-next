'use client'
import './styles.scss'
import { Text, TextInput, Tabs, Loader, Button, Icon } from '@gravity-ui/uikit'
import { CirclePlus } from '@gravity-ui/icons'
import block from 'bem-cn-lite'
import { useContext, useEffect, useState } from 'react'
import { deleteUser, fetchUsers } from '@/app/actions/Users'
import { User } from '@/data/users/member'
import { AuthContext } from '../lib/context/Auth'
import { useRouter } from 'next/navigation'
import { TableList } from '../components/items'
import filterList from './lib/filterList'
import normalizeItem from './lib/normalizeItem'

const b = block('users-page')

export default function Users() {
  const router = useRouter()
  const userContext = useContext(AuthContext)
  const [search, setSearch] = useState<string>('')
  const [role, setRole] = useState<UserFilter['role']>('all')
  let filter: UserFilter = { searchString: search, role }

  const [users, setUsers] = useState<User[] | null>(null)
  useEffect(() => {
    if (!users) {
      fetchUsers().then(setUsers)
    }
  }, [])
  const filteredList = filterList(userContext.login, users, filter)
  const normalize = normalizeItem.bind(null, userContext)
  const normaliseArr = filteredList?.map(normalize)

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
  const rowActions = (item: any, index: number) => {
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
            users &&
              users.filter((el) => {
                return el._id !== item.id
              })
          )
        },
        disabled: false,
      },
    ]
    if (userContext.role == 'owner') {
      return rowActions
    }

    if (item.role == 'Админ' && userContext.role == 'admin') {
      rowActions[0].disabled = true
      rowActions[1].disabled = true
    }
    if (item.creater !== userContext.login) {
      rowActions[0].disabled = true
      rowActions[1].disabled = true
    }

    return rowActions
  }

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
      {users ? (
        <TableList<User>
          items={normaliseArr ? normaliseArr : []}
          defaultItems={filteredList}
          columns={columns}
          rowActions={rowActions}
          updateItems={setUsers}
        />
      ) : (
        <Loader size="l" className="loader" />
      )}
    </div>
  )
}

type UserFilter = {
  searchString: string
  role: 'all' | User['role']
}
