'use client'
import { Button, Text } from '@gravity-ui/uikit'
import { useReducer } from 'react'
import { BaseSelect } from '@/app/components/inputs/select'
import { BaseInput } from '@/app/components/inputs/text'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Project } from '@/data/projects/project'
import EditProjectAction from './EditProjectAction'
import { TextArea } from '@/app/components/inputs/textarea'

export default function EditProjectForm({
  oldProject,
}: {
  oldProject: Project
}) {
  const router = useRouter()
  const defaultProject: Project = oldProject
  const categoryOptions = [
    { value: 'category1', content: 'Категория 1', name: 'category' },
    { value: 'category2', content: 'Категория 2', name: 'category' },
    { value: 'category3', content: 'Категория 3', name: 'category' },
  ]
  const oldCategory = [
    categoryOptions.find((el) => {
      return el.value === defaultProject.category
    })?.content,
  ]

  const [project, dispatch] = useReducer(EditProjectReducer, defaultProject)

  const [formState, action] = useFormState(EditProjectAction, {
    status: undefined,
  })
  if (formState.status === 'valid') {
    router.push('/projects')
  }

  function EditProject() {
    const newProject: Project = project
    const payloadData = { oldProject, newProject }

    action(payloadData)
  }
  return (
    <>
      {formState.errorMsgs?.fieldsForUpdate?.msg && (
        <Text variant="body-1" color="danger" className="big-error">
          {formState.errorMsgs?.fieldsForUpdate?.msg}
        </Text>
      )}
      <form>
        <BaseSelect
          placeholder="Категория"
          hasClear
          onUpdate={(val: string) => {
            dispatch({ type: 'update', payload: { category: val[0] } })
          }}
          options={categoryOptions}
          gloss="Категория зависит от конкретного проекта"
          className="user-inputs-mb"
          defaultValue={oldCategory}
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
          defaultValue={project.name}
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
          defaultValue={project.description}
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
          defaultValue={project.price}
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
          ltValue={project.dateUpdatePrice}
        />

        <div className="action-button">
          <Button type="button" view="action" onClick={EditProject}>
            Редактировать
          </Button>
        </div>
      </form>
    </>
  )
}

function EditProjectReducer(projectState: Project, action: Action) {
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
