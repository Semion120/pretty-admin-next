'use server'

import { addArticleAction } from '@/app/actions/Articles'
import { Article } from '@/data/articles/article'

export type Action = {
  type: string
  payload: object
}

export default async function AddAction(
  currentState: AddArticleState,
  payload: Article
): Promise<AddArticleState> {
  const { article, errorMsgs } = validateData(payload)

  if (article) {
    const status = await addArticleAction(article)

    return { status: 'valid' }
  } else {
    return { status: 'invalid', errorMsgs }
  }
}

type AddArticleState = {
  status: 'valid' | 'invalid' | undefined
  articleData?: Article
  errorMsgs?: ErrorMsgsType
}

type ErrorMsgsType = {
  textBlocks?: { msg: string; status: undefined | 'invalid' }
  shortName?: { msg: string; status: undefined | 'invalid' }
  title?: { msg: string; status: undefined | 'invalid' }
  description?: { msg: string; status: undefined | 'invalid' }
}

function validateData(data: Article): {
  article: Article | undefined
  errorMsgs: ErrorMsgsType
} {
  const errorMsgs: ErrorMsgsType = {}

  const _id = data._id

  const shortName = data.shortName
  if (!shortName)
    errorMsgs.shortName = { msg: 'Не заполнено поле', status: 'invalid' }

  const title = data.title
  if (!title) errorMsgs.title = { msg: 'Не заполнено поле', status: 'invalid' }

  const description = data.description
  if (!description)
    errorMsgs.description = { msg: 'Не заполнено поле', status: 'invalid' }

  const textBlocks = data.textBlocks
  if (!textBlocks || textBlocks.length === 0) {
    errorMsgs.textBlocks = {
      msg: 'Чтобы создать статью - нужен текст',
      status: 'invalid',
    }
  }
  const createDate = data.createDate
  const editDate = data.editDate

  if (Object.keys(errorMsgs).length > 0) {
    return { article: undefined, errorMsgs }
  } else {
    return {
      article: {
        _id,
        shortName,
        title,
        description,
        textBlocks,
        createDate,
        editDate,
      },
      errorMsgs,
    }
  }
}
