'use client'
import './projects.scss'
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

const b = block('projects-page')

export default function Projects() {
  const [search, setSearch] = useState<string>('')
  const [category, setCategory] = useState<ProjectsFilter['category']>('all')

  const router = useRouter()

  let filterItem: ProjectsFilter = { searchString: search, category }

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
          items={[
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
          ]}
          onSelectTab={(
            tabId: 'all' | 'category1' | 'category2' | 'category3'
          ) => {
            setCategory(tabId)
          }}
        />
      </div>
      <ProjectsList filter={filterItem} />
    </div>
  )
}

function ProjectsList({ filter }: { filter?: ProjectsFilter }) {
  const [projects, setProjects] = useState<Project[] | null>(null)
  useEffect(() => {
    if (!projects) {
      fetchProjects().then(setProjects)
    }
  }, [])

  const filteredList = filterList(projects, filter)

  return (
    <div className={b('list')}>
      {filteredList ? (
        <UsersTable projects={filteredList} setProjects={setProjects} />
      ) : (
        <Loader size="l" className="loader" />
      )}
    </div>
  )
}

function UsersTable({
  projects,
  setProjects,
}: {
  projects: Project[]
  setProjects: Dispatch<SetStateAction<Project[] | null>>
}) {
  const router = useRouter()
  const MyTable = withTableActions(Table)

  const data: any[] = projects.map((el) => {
    return {
      id: el._id,
      name: el.name,
      category: el.category,
      description: el.description,
      price: el.price,
      dateUpdatePrice: el.dateUpdatePrice,
    }
  })
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

  const getRowActions = (item: any, index: number) => {
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
  arr: Project[] | null,
  filter: ProjectsFilter | undefined
): Project[] | null {
  let filteredArr
  if (!arr) {
    return null
  }
  if (!filter) {
    return arr
  }

  if (filter.searchString) {
    filteredArr = arr.filter((el) => {
      return el.name.toLowerCase().includes(filter.searchString.toLowerCase())
    })
  } else {
    switch (filter.category) {
      case 'all': {
        filteredArr = Object.assign([], arr)
        break
      }
      default: {
        filteredArr = arr.filter((el) => {
          return el.category == filter.category
        })
        break
      }
    }
  }
  return filteredArr
}

type ProjectsFilter = {
  searchString: string
  category: 'all' | Project['category']
}
