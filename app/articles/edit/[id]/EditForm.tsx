'use client'
import { Button, Text } from '@gravity-ui/uikit'
import { useReducer } from 'react'
import { BaseInput } from '@/app/components/inputs/text'
import { useFormState } from 'react-dom'
import { useRouter } from 'next/navigation'
import { TextArea } from '@/app/components/inputs/textarea'
import { Article } from '@/data/articles/article'
import EditArticleAction from './EditArticleAction'
import { TextEditor } from '@/app/components/inputs/texteditor'
import { b } from './page'

export default function EditArticleForm({
  oldArticle,
}: {
  oldArticle: Article
}) {
  const router = useRouter()
  const defaultArticle: Article = oldArticle

  const [article, dispatch] = useReducer(EditArticleReducer, defaultArticle)

  const [formState, action] = useFormState(EditArticleAction, {
    status: undefined,
  })

  if (formState.status === 'valid') {
    router.push('/articles')
  }

  const defaultBlocks = {
    blocks: article.textBlocks,
    time: Date.now(),
    version: '2.29.0',
  }

  function EditArticle() {
    const newArticle: Article = article
    const payloadData = { oldArticle, newArticle }

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
        <TextEditor
          blocks={defaultBlocks}
          onUpdate={(data: any) => {
            dispatch({ type: 'update', payload: { textBlocks: data.blocks } })
          }}
          validationState={formState.errorMsgs?.textBlocks?.status}
          errorMessage={formState.errorMsgs?.textBlocks?.msg}
        />

        <div className={b('text-inputs')}>
          <BaseInput
            placeholder="Статья 2 тайтл"
            label="Title*:"
            onUpdate={(val: string) => {
              dispatch({ type: 'update', payload: { title: val } })
            }}
            defaultValue={article.title}
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
            defaultValue={article.description}
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
            defaultValue={article.shortName}
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
          <Button type="button" view="action" onClick={EditArticle}>
            Редактировать
          </Button>
        </div>
      </form>
    </>
  )
}

function EditArticleReducer(articleState: Article, action: Action) {
  switch (action.type) {
    case 'update': {
      const updateData: any = action.payload
      const updateDataKey = Object.keys(updateData)[0]

      const updatedArticle: any = Object.assign({}, articleState)
      updatedArticle[updateDataKey] = updateData[updateDataKey]
      return updatedArticle
    }
    default: {
      return articleState
    }
  }
}

export type Action = {
  type: string
  payload: object
}
