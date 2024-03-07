import './styles.scss'
import { Text } from '@gravity-ui/uikit'
import block from 'bem-cn-lite'
import { User } from '@/data/users/member'
import { fetchUserById } from '@/app/actions/Users'
import EditUserForm from './EditForm'

const b = block('user-edit')

export default async function UserEdit({ params }: { params: { id: string } }) {
  const user: User = await fetchUserById(params.id)
  return (
    <div className={b()}>
      <h1>
        <Text variant="display-3">Редактировать юзера: {user.login}</Text>
      </h1>
      <EditUserForm oldUser={user} />
    </div>
  )
}
