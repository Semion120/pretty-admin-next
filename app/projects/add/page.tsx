'use client'
import './addProject.scss'

import { Button, Text } from '@gravity-ui/uikit'
import { useId, useReducer } from 'react'
import { BaseSelect } from '@/app/components/inputs/select'
import { BaseInput } from '@/app/components/inputs/text'

import block from 'bem-cn-lite'

import { useFormState } from 'react-dom'
import AddAction from './AddProjectAction'
import { useRouter } from 'next/navigation'
import { Project } from '@/data/projects/project'
import { TextArea } from '@/app/components/inputs/textarea'
import { PhotoInput } from '@/app/components/inputs/photoInput'
import { TextEditor } from '@/app/components/inputs/texteditor'

const b = block('projects-add')

export default function AddProject() {
  const router = useRouter()
  const categoryOptions = [
    { value: 'category1', content: 'Категория 1', name: 'category' },
    { value: 'category2', content: 'Категория 2', name: 'category' },
    { value: 'category3', content: 'Категория 3', name: 'category' },
  ]

  const defaultUser: Project = {
    _id: useId().replaceAll(':', ''),
    name: '',
    category: undefined,
    description: '',
    price: 1200000,
    dateUpdatePrice: '',
  }
  const [project, dispatch] = useReducer(ProjectReducer, defaultUser)

  const [formState, action] = useFormState(AddAction, {
    status: undefined,
  })

  if (formState.status === 'valid') {
    router.push('/projects')
  }

  function CreateProject() {
    action(project)
  }

  return (
    <div className={b()}>
      <h1>
        <Text variant="display-3">Добавить проект</Text>
      </h1>

      <form>
        <div className={b('text-inputs')}>
          <BaseSelect
            placeholder="Категория"
            hasClear
            onUpdate={(val: string) => {
              dispatch({ type: 'update', payload: { category: val[0] } })
            }}
            options={categoryOptions}
            gloss="Категория зависит от конкретного проекта"
            className="user-inputs-mb"
          />

          <BaseInput
            placeholder="Project2"
            label="Название*:"
            onUpdate={(val: string) => {
              dispatch({ type: 'update', payload: { name: val } })
            }}
            name="name"
            hasClear
            gloss="Любое название, уникальное в пределах данного сайта"
            errorMessage={formState.errorMsgs?.name?.msg}
            validationState={formState.errorMsgs?.name?.status}
            className="user-inputs-mb"
          />

          <TextArea
            placeholder="Какое то описание"
            name="description"
            onUpdate={(val: string) => {
              dispatch({ type: 'update', payload: { description: val } })
            }}
            label="Описание*:"
            hasClear
            gloss="Описание проекта"
            errorMessage={formState.errorMsgs?.description?.msg}
            validationState={formState.errorMsgs?.description?.status}
            className="user-inputs-mb"
          />

          <BaseInput
            placeholder="1920000"
            label="Цена*:"
            onUpdate={(val: string) => {
              dispatch({ type: 'update', payload: { price: val } })
            }}
            name="price"
            hasClear
            gloss="Введите цену. Только цифры"
            errorMessage={formState.errorMsgs?.price?.msg}
            validationState={formState.errorMsgs?.price?.status}
            className="user-inputs-mb"
          />

          <BaseInput
            placeholder="12.10.2023"
            label="Дата обновления цены*:"
            onUpdate={(val: string) => {
              dispatch({ type: 'update', payload: { dateUpdatePrice: val } })
            }}
            name="price"
            hasClear
            gloss="Введите дату обновления цены"
            errorMessage={formState.errorMsgs?.dateUpdatePrice?.msg}
            validationState={formState.errorMsgs?.dateUpdatePrice?.status}
            className="user-inputs-mb"
          />
        </div>

        <PhotoInput
          existPhotos={TESTING}
          onUpdate={(val) => {
            console.log(val)
          }}
        />
        <div className={b('action-button')}>
          <Button type="button" view="action" onClick={CreateProject}>
            Создать проект
          </Button>
        </div>
      </form>
    </div>
  )
}
const TESTING = [
  'https://img.freepik.com/free-photo/funny-potatoes_144627-34154.jpg',
  'https://img.freepik.com/free-photo/flat-lay-fruits-holding-hands_23-2148891853.jpg',
  'https://img.freepik.com/free-photo/painted-eggs-with-faces-halloween-style_23-2147895101.jpg',
  'https://img.freepik.com/free-photo/happy-easter-with-many-colorful-cute-easter-eggs-generative-ai_60438-2536.jpg',
]

function ProjectReducer(projectState: Project, action: Action) {
  switch (action.type) {
    case 'update': {
      const updateData: any = action.payload
      const updateDataKey = Object.keys(updateData)[0]
      const updatedProject: any = Object.assign({}, projectState)
      updatedProject[updateDataKey] = updateData[updateDataKey]
      return updatedProject
    }
    default: {
      return projectState
    }
  }
}

export type Action = {
  type: string
  payload: object
}
