'use client'
import {
  Card,
  Icon,
  Skeleton,
  Text,
  DropdownMenu,
  Button,
  Switch,
} from '@gravity-ui/uikit'
import { EllipsisVertical, Pencil, TrashBin } from '@gravity-ui/icons'
import './style.scss'
import block from 'bem-cn-lite'
import { User } from '@/data/users/member'
import { deleteUser, fetchUsers } from '@/app/actions/Users'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { AuthContext, InitData } from '@/app/lib/context/Auth'
import { useRouter } from 'next/navigation'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { revalidatePath } from 'next/cache'

const b = block('user-card')

export default function UserCard() {
  const [visibleFields, setVisibleFields] = useState<number | 'all'>(5)
  const userSkeletons = [
    <Skeleton
      key={1}
      style={{ width: '100%', height: '50px', marginBottom: '10px' }}
    />,
    <Skeleton
      key={2}
      style={{ width: '100%', height: '50px', marginBottom: '10px' }}
    />,
    <Skeleton
      key={3}
      style={{ width: '100%', height: '50px', marginBottom: '10px' }}
    />,
    <Skeleton
      key={4}
      style={{ width: '100%', height: '50px', marginBottom: '10px' }}
    />,
    <Skeleton
      key={5}
      style={{ width: '100%', height: '50px', marginBottom: '10px' }}
    />,
  ]
  const [users, setUsers] = useState<User[] | undefined>()
  const authState = useContext(AuthContext)

  const router = useRouter()

  const filterUsersWithDispatch = filterUsers.bind(
    null,
    visibleFields,
    setUsers,
    authState
  )

  useEffect(() => {
    fetchUsers().then(filterUsersWithDispatch)
  }, [visibleFields])

  return (
    <Card theme="normal" type="container" view="outlined" className={b()}>
      <h2>
        <Text variant="subheader-3">Мои юзеры</Text>
        {users && users.length >= 5 ? (
          <Switch
            size="m"
            content="Показать все"
            onUpdate={(checked: boolean) => {
              switch (checked) {
                case true: {
                  setVisibleFields('all')
                  break
                }
                case false: {
                  setVisibleFields(5)
                  break
                }
              }
            }}
          />
        ) : (
          <Switch
            size="m"
            content="Показать все"
            onUpdate={(checked: boolean) => {
              switch (checked) {
                case true: {
                  setVisibleFields('all')
                  break
                }
                case false: {
                  setVisibleFields(5)
                  break
                }
              }
            }}
            disabled
          />
        )}
      </h2>

      <div className={b('table')}>
        <div className={b('table', { head: true })}>
          <Text className="field" variant="body-2">
            Логин
          </Text>
          <Text className="field" variant="body-2">
            Пароль
          </Text>
          <Text className="field" variant="body-2">
            Роль
          </Text>
        </div>

        <div className={b('table', { body: true })}>
          {users
            ? users.map((el) => {
                return (
                  <OneUserCard
                    key={el.login}
                    id={el._id}
                    name={el.login}
                    pass={el.pass}
                    role={el.role}
                    router={router}
                    users={users}
                    setUsers={setUsers}
                  />
                )
              })
            : userSkeletons.map((el) => {
                return el
              })}
        </div>
      </div>
      <div className={b('nav-buttons')}>
        <Button size="l" view="outlined-action" href="/users/add">
          Добавить
        </Button>
        <Button size="l" view="action" href="/users">
          Все пользователи
        </Button>
      </div>
    </Card>
  )
}

function OneUserCard({
  id,
  name,
  pass,
  role,
  router,
  users,
  setUsers,
}: UserCardProps) {
  let roleRu
  switch (role) {
    case 'admin': {
      roleRu = 'Админ'
      break
    }
    case 'user': {
      roleRu = 'Юзер'
      break
    }
    default: {
      roleRu = 'Юзер'
    }
  }
  function deleteUserFromList(
    id: string,
    setUsers: Dispatch<SetStateAction<User[] | undefined>>
  ) {
    deleteUser(id)
    const newUsersList = users.filter((el) => {
      return el._id !== id
    })
    setUsers(newUsersList)
  }
  function editUser(id: string) {
    router.push('/users/edit/' + id)
  }
  const bindedDelete = deleteUserFromList.bind(null, id, setUsers)
  const bindedEdit = editUser.bind(null, id)
  return (
    <div className={b('table', { user: true })}>
      <div className="fields">
        <Text className="field">{name}</Text>
        <Text className="field">{pass}</Text>
        <Text className="field">{roleRu}</Text>
      </div>

      <DropdownMenu
        renderSwitcher={(props) => (
          <Button {...props} view="flat">
            <Icon size={16} data={EllipsisVertical} />
          </Button>
        )}
        items={[
          {
            iconStart: <Icon size={16} data={Pencil} />,
            action: () => bindedEdit(),
            text: 'Изменить',
          },
          {
            iconStart: <Icon size={16} data={TrashBin} />,
            action: () => bindedDelete(),
            text: 'Удалить',
            theme: 'danger',
          },
        ]}
      />
    </div>
  )
}

type UserCardProps = {
  name: string
  pass: string
  role: User['role']
  id: string
  router: AppRouterInstance
  users: User[]
  setUsers: Dispatch<SetStateAction<User[] | undefined>>
}

function filterUsers(
  visibleFields: number | 'all',
  updateUsers: Dispatch<SetStateAction<User[] | undefined>>,
  authState: InitData,
  arr: User[]
) {
  let filteredUsers: User[] = arr.filter((el) => {
    return el.role !== 'owner'
  })
  if (authState.role == 'owner') {
    filteredUsers = filteredUsers.filter((el) => {
      return el.role !== authState.role
    })
  } else if (authState.role == 'admin') {
    filteredUsers = filteredUsers.filter((el) => {
      return el.creater == authState.login
    })
  }

  if (visibleFields == 'all') {
    filteredUsers = filteredUsers.slice()
  } else {
    filteredUsers =
      filteredUsers.length > 5
        ? filteredUsers.slice(0, visibleFields)
        : filteredUsers.slice()
  }

  updateUsers(filteredUsers)
}
