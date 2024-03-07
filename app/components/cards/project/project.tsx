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
import { Project } from '@/data/projects/project'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { fetchProjects } from '@/app/actions/Projects'

const b = block('project-card')

export default function ProjectCard() {
  const [visibleFields, setVisibleFields] = useState<number | 'all'>(5)
  const projectSkeletons = [
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
  const [projects, setProjects] = useState<Project[] | undefined>()

  const filterProjectsWithDispatch = filterProjects.bind(
    null,
    visibleFields,
    setProjects
  )
  useEffect(() => {
    fetchProjects().then(filterProjectsWithDispatch)
  }, [visibleFields])

  return (
    <Card theme="normal" type="container" view="outlined" className={b()}>
      <h2>
        <Text variant="subheader-3">Проекты</Text>
        {projects && projects.length >= 5 ? (
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
            Цена
          </Text>
          <Text className="field" variant="body-2">
            Дата о.ц.
          </Text>
        </div>

        <div className={b('table', { body: true })}>
          {projects
            ? projects.map((el) => {
                return (
                  <OneProjectCard
                    key={el.name}
                    name={el.name}
                    price={el.price}
                    dateUpdatePrice={el.dateUpdatePrice}
                  />
                )
              })
            : projectSkeletons.map((el) => {
                return el
              })}
        </div>
      </div>
      <div className={b('nav-buttons')}>
        <Button size="l" view="outlined-action" href="/projects/add">
          Добавить новый
        </Button>
        <Button size="l" view="action" href="/projects">
          Все проекты
        </Button>
      </div>
    </Card>
  )
}

function OneProjectCard({ name, price, dateUpdatePrice }: ProjectCardProps) {
  const makedPrice = price / 1000000
  const stringPrice = makedPrice.toFixed(3) + ' млн.'
  return (
    <div className={b('table', { project: true })}>
      <div className="fields">
        <Text className="field">{name}</Text>
        <Text className="field">{stringPrice}</Text>
        <Text className="field">{dateUpdatePrice}</Text>
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

type ProjectCardProps = {
  name: string
  price: number
  dateUpdatePrice: string
}

function filterProjects(
  visibleFields: number | 'all',
  updateProjects: Dispatch<SetStateAction<Project[] | undefined>>,
  arr: Project[]
) {
  let workArr
  if (visibleFields == 'all') {
    workArr = arr.slice()
  } else {
    workArr = arr.slice(0, visibleFields)
  }
  updateProjects(workArr)
  return workArr
}
