import './styles.scss'
import { Text, Loader } from '@gravity-ui/uikit'
import block from 'bem-cn-lite'
import { Article } from '@/data/articles/article'
import { fetchArticleById } from '@/app/actions/Articles'
import EditArticleForm from './EditForm'
import { Suspense } from 'react'

const b = block('article-edit')

export default async function ArticleEdit({
  params,
}: {
  params: { id: string }
}) {
  const article: Article = await fetchArticleById(params.id)
  return (
    <Suspense fallback={<Loading />}>
      <div className={b()}>
        <h1>
          <Text variant="display-3">
            Редактировать статью: {article.shortName}
          </Text>
        </h1>
        <EditArticleForm oldArticle={article} />
      </div>
    </Suspense>
  )
}

function Loading() {
  return (
    <div className="loading">
      <Loader size="l" />
    </div>
  )
}
