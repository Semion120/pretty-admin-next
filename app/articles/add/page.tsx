'use server'

import './styles.scss'
import block from 'bem-cn-lite'
import { Text } from '@gravity-ui/uikit'
import AddArticleForm from './AddForm'

const b = block('article-add')

export default async function AddArticlePage() {
  return (
    <div className={b()}>
      <h1>
        <Text variant="display-3">Добавить статью</Text>
      </h1>

      <AddArticleForm />
    </div>
  )
}
