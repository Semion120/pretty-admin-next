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
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '@/data/projects/project'
import { deleteProjectAction, fetchProjects } from '@/app/actions/Projects'
import { Article } from '@/data/articles/article'
import { deleteArticleAction, fetchArticles } from '../actions/Articles'

const b = block('articles-page')

export default function Articles() {
  const [search, setSearch] = useState<string>('')

  const router = useRouter()

  let filterItem: ArticlesFilter = { searchString: search }

  return (
    <div className={b()}>
      <h1>
        <Text variant="display-3">Статьи</Text>
        <Button
          view="action"
          size="l"
          className="add-new-btn"
          onClick={() => {
            router.push('/articles/add')
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
          placeholder="Поиск по названию"
        />
      </div>
      <ArticlesList filter={filterItem} />
    </div>
  )
}

function ArticlesList({ filter }: { filter?: ArticlesFilter }) {
  const [articles, setArticles] = useState<Article[] | null>(null)

  useEffect(() => {
    if (!articles) {
      fetchArticles().then(setArticles)
    }
  }, [])

  const filteredList = filterList(articles, filter)

  return (
    <div className={b('list')}>
      {filteredList ? (
        <ArticlesTable articles={filteredList} setArticles={setArticles} />
      ) : (
        <Loader size="l" className="loader" />
      )}
    </div>
  )
}

function ArticlesTable({
  articles,
  setArticles,
}: {
  articles: Article[]
  setArticles: Dispatch<SetStateAction<Article[] | null>>
}) {
  const router = useRouter()
  const MyTable = withTableActions(Table)

  const data: any[] = articles.map((el) => {
    return {
      id: el._id,
      shortName: el.shortName,
      createDate: el.createDate,
      editDate: el.editDate,
    }
  })
  const columns = [
    {
      id: 'shortName',
      name: 'Короткое название',
    },
    {
      id: 'createDate',
      name: 'Дата создания',
    },
    {
      id: 'editDate',
      name: 'Последнее редактирование',
    },
    {
      id: 'id',
      name: 'ID',
    },
  ]

  const getRowActions = (item: any, index: number) => {
    const rowActions = [
      {
        text: 'Изменить',
        handler: (item: any, index: number) => {
          router.push('/articles/edit/' + item.id)
        },
        disabled: false,
      },
      {
        text: 'Удалить',
        handler: (item: any, index: number) => {
          deleteArticleAction(item.id)
          setArticles(
            articles.filter((el) => {
              return el._id !== item.id
            })
          )
        },
        disabled: false,
      },
    ]

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
  arr: Article[] | null,
  filter: ArticlesFilter | undefined
): Article[] | undefined {
  if (!arr) {
    return undefined
  }
  if (!filter) {
    return arr
  }

  let filteredArr = arr

  if (filter.searchString) {
    filteredArr = arr.filter((el) => {
      return el.shortName
        .toLowerCase()
        .includes(filter.searchString.toLowerCase())
    })
  }
  return filteredArr
}

type ArticlesFilter = {
  searchString: string
}
