'use client'
import './projects.scss'
import { Text, TextInput, Tabs, Loader, Button, Icon } from '@gravity-ui/uikit'
import { CirclePlus } from '@gravity-ui/icons'
import block from 'bem-cn-lite'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Project } from '@/data/projects/project'
import { deleteProjectAction, fetchProjects } from '@/app/actions/Projects'
import { TableList } from '../components/items'
import filterList from './lib/filterList'

const b = block('projects-page')

export default function Projects() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const tabs = [
    { id: 'all', title: 'Все', disabled: Boolean(search) },
    {
      id: 'category1',
      title: 'Категория 1',
      disabled: Boolean(search),
    },
    {
      id: 'category2',
      title: 'Категория 2',
      disabled: Boolean(search),
    },
    {
      id: 'category3',
      title: 'Категория 3',
      disabled: Boolean(search),
    },
  ]
  const [category, setCategory] = useState<ProjectsFilter['category']>('all')

  const [projects, setProjects] = useState<Project[] | null>(null)
  useEffect(() => {
    if (!projects) {
      fetchProjects().then(setProjects)
    }
  }, [])

  const filter: ProjectsFilter = { searchString: search, category }
  const filteredArr = filterList(projects, filter)
  const columns = [
    {
      id: 'name',
      name: 'Название',
    },
    {
      id: 'category',
      name: 'Категория',
    },
    {
      id: 'description',
      name: 'Описание',
    },
    {
      id: 'price',
      name: 'Цена',
    },
    {
      id: 'dateUpdatePrice',
      name: 'Дата обновления',
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
          router.push('/projects/edit/' + item.id)
        },
        disabled: false,
      },
      {
        text: 'Удалить',
        handler: (item: any, index: number) => {
          deleteProjectAction(item.id)
          projects &&
            setProjects(
              projects.filter((el) => {
                return el._id !== item.id
              })
            )
        },
        disabled: false,
      },
    ]

    return rowActions
  }
  const normaliseArr = filteredArr?.map((el) => {
    return {
      id: el._id,
      name: el.name,
      category: el.category,
      description: el.description,
      price: el.price,
      dateUpdatePrice: el.dateUpdatePrice,
    }
  })

  return (
    <div className={b()}>
      <h1>
        <Text variant="display-3">Проекты</Text>
        <Button
          view="action"
          size="l"
          className="add-new-btn"
          onClick={() => {
            router.push('/projects/add')
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
        <Tabs
          activeTab={category}
          size="xl"
          items={tabs}
          onSelectTab={(
            tabId: 'all' | 'category1' | 'category2' | 'category3'
          ) => {
            setCategory(tabId)
          }}
        />
      </div>

      {projects ? (
        <TableList<Project>
          items={normaliseArr ? normaliseArr : []}
          defaultItems={filteredArr}
          columns={columns}
          rowActions={rowActions}
          updateItems={setProjects}
        />
      ) : (
        <Loader size="l" className="loader" />
      )}
    </div>
  )
}

export type ProjectsFilter = {
  searchString: string
  category: 'all' | Project['category']
}
