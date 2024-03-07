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
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Article } from '@/data/articles/article'
import { fetchArticles } from '@/app/actions/Articles'

const b = block('article-card')

export default function ArticleCard() {
  const [visibleFields, setVisibleFields] = useState<number | 'all'>(5)
  const articlesSkeletons = [
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
  const [articles, setArticles] = useState<Article[] | undefined>()

  const filterArticlesWithDispatch = filterObjects.bind(
    null,
    visibleFields,
    setArticles
  )
  useEffect(() => {
    fetchArticles().then(filterArticlesWithDispatch)
  }, [visibleFields])

  return (
    <Card theme="normal" type="container" view="outlined" className={b()}>
      <h2>
        <Text variant="subheader-3">Статьи</Text>
        {articles && articles.length >= 5 ? (
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
            Название
          </Text>
          <Text className="field" variant="body-2">
            Дата создания
          </Text>
          <Text className="field" variant="body-2">
            Дата редактирования
          </Text>
        </div>

        <div className={b('table', { body: true })}>
          {articles
            ? articles.map((el) => {
                return (
                  <OneArticleCard
                    key={el._id}
                    shortName={el.shortName}
                    editDate={el.editDate}
                    createDate={el.createDate}
                  />
                )
              })
            : articlesSkeletons.map((el) => {
                return el
              })}
        </div>
      </div>
      <div className={b('nav-buttons')}>
        <Button size="l" view="outlined-action" href="/articles/add">
          Добавить новый
        </Button>
        <Button size="l" view="action" href="/articles">
          Все статьи
        </Button>
      </div>
    </Card>
  )
}

function OneArticleCard({ shortName, editDate, createDate }: ArticleCardProps) {
  const editDateNorm = new Date(editDate).toLocaleDateString('ru-RU')
  const createDateNorm = new Date(createDate).toLocaleDateString('ru-RU')
  return (
    <div className={b('table', { article: true })}>
      <div className="fields">
        <Text className="field">{shortName}</Text>
        <Text className="field">{editDateNorm}</Text>
        <Text className="field">{createDateNorm}</Text>
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
            action: () => console.log('Изменить'),
            text: 'Изменить',
          },
          {
            iconStart: <Icon size={16} data={TrashBin} />,
            action: () => console.log('Удалить'),
            text: 'Удалить',
            theme: 'danger',
          },
        ]}
      />
    </div>
  )
}

type ArticleCardProps = {
  shortName: string
  createDate: string
  editDate: string
}

function filterObjects(
  visibleFields: number | 'all',
  updateArticles: Dispatch<SetStateAction<Article[] | undefined>>,
  arr: Article[]
) {
  let workArr
  if (visibleFields == 'all') {
    workArr = arr.slice()
  } else {
    workArr = arr.slice(0, visibleFields)
  }
  updateArticles(workArr)
  return workArr
}
