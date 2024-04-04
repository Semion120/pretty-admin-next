'use client'
import './styles.scss'
import block from 'bem-cn-lite'
import AddAction from './AddArticleAction'
import { Button } from '@gravity-ui/uikit'
import { useId, useReducer } from 'react'
import { BaseInput } from '@/app/components/inputs/text'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { TextArea } from '@/app/components/inputs/textarea'
import { TextEditor } from '@/app/components/inputs/texteditor'
import { Article } from '@/data/articles/article'
import { Action } from './AddArticleAction'

const b = block('article-add')

export default function AddArticleForm() {
  const router = useRouter()

  const createDate = new Date().toISOString()
  const defaultArticle: Article = {
    _id: useId().replaceAll(':', ''),
    shortName: '',
    title: '',
    description: '',
    textBlocks: [],
    createDate: createDate,
    editDate: createDate,
  }
  const [article, dispatch] = useReducer(ArticleReducer, defaultArticle)

  const [formState, action] = useFormState(AddAction, {
    status: undefined,
  })

  if (formState.status === 'valid') {
    router.push('/articles')
  }

  function CreateArtcle() {
    action(article)
  }
  return (
    <form>
      <TextEditor
        onUpdate={(data: any) => {
          dispatch({ type: 'update', payload: { textBlocks: data.blocks } })
        }}
        validationState={formState.errorMsgs?.textBlocks?.status}
        errorMessage={formState.errorMsgs?.textBlocks?.msg}
      />

      <div className={b('text-inputs')}>
        <BaseInput
          placeholder="Статья 2"
          label="Title*:"
          onUpdate={(val: string) => {
            dispatch({ type: 'update', payload: { title: val } })
          }}
          name="name"
          hasClear
          gloss="При заполнении стоит ориентироватьcя на сем. ядро и конкурентов по выдаче"
          errorMessage={formState.errorMsgs?.title?.msg}
          validationState={formState.errorMsgs?.title?.status}
          className="user-inputs-mb"
        />

        <TextArea
          placeholder="Какое то описание"
          name="description"
          onUpdate={(val: string) => {
            dispatch({ type: 'update', payload: { description: val } })
          }}
          label="Description*:"
          hasClear
          gloss="Этот текст будут видеть в поисковой выдаче. Стоит привлечь внимание."
          errorMessage={formState.errorMsgs?.description?.msg}
          validationState={formState.errorMsgs?.description?.status}
          className="user-inputs-mb"
        />

        <BaseInput
          placeholder="Статья 2"
          label="Коротко название*:"
          onUpdate={(val: string) => {
            dispatch({ type: 'update', payload: { shortName: val } })
          }}
          name="name"
          hasClear
          gloss="в паре слов о чем статья"
          errorMessage={formState.errorMsgs?.shortName?.msg}
          validationState={formState.errorMsgs?.shortName?.status}
          className="user-inputs-mb"
        />
      </div>
      <div className={b('action-button')}>
        <Button type="button" view="action" onClick={CreateArtcle}>
          Создать статью
        </Button>
      </div>
    </form>
  )
}

function ArticleReducer(articleState: Article, action: Action) {
  switch (action.type) {
    case 'update': {
      const updateData: any = action.payload
      const updateDataKey = Object.keys(updateData)[0]
      const updatedProject: any = Object.assign({}, articleState)
      updatedProject[updateDataKey] = updateData[updateDataKey]
      return updatedProject
    }
    default: {
      return articleState
    }
  }
}
