'use client'
import './styles.scss'
import {
  Text,
  TextInput,
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
import { Article } from '@/data/articles/article'
import { deleteArticleAction, fetchArticles } from '../actions/Articles'
import { TableList } from '../components/items'
import filterList from './lib/filterList'

const b = block('articles-page')

export default function Articles() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const [articles, setArticles] = useState<Article[] | null>(null)
  useEffect(() => {
    if (!articles) {
      fetchArticles().then(setArticles)
    }
  }, [])
  const filteredList = filterList(articles, search)
  const normaliseArr = articles?.map((el) => {
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

  const rowActions = (item: any, index: number) => {
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
            articles &&
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
      {articles ? (
        <TableList<Article>
          items={normaliseArr ? normaliseArr : []}
          defaultItems={filteredList}
          columns={columns}
          rowActions={rowActions}
          updateItems={setArticles}
        />
      ) : (
        <Loader size="l" className="loader" />
      )}
    </div>
  )
}
