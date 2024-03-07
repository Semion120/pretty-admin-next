'use server'

import { editArticleAction } from '@/app/actions/Articles'
import { Article } from '@/data/articles/article'

export default async function EditProjectAction(
  currentState: EditArticleState,
  payload: PayloadEdit
): Promise<EditArticleState> {
  const { article, errorMsgs } = validateData(payload.newArticle)

  const fieldsForUpdate = compareData(payload)

  const keysForUpdate = Object.keys(fieldsForUpdate)
  if (keysForUpdate.length == 0) {
    errorMsgs.fieldsForUpdate = {
      msg: 'Чтобы редактировать статью, нужно изменить данные',
      status: 'invalid',
    }
  }

  if (article && keysForUpdate.length > 0) {
    const status = await editArticleAction(article._id, fieldsForUpdate)

    return { status: 'valid' }
  } else {
    return { status: 'invalid', errorMsgs }
  }
}

type EditArticleState = {
  status: 'valid' | 'invalid' | undefined
  articleData?: Article
  errorMsgs?: ErrorMsgsType
}

type ErrorMsgsType = {
  textBlocks?: { msg: string; status: undefined | 'invalid' }
  shortName?: { msg: string; status: undefined | 'invalid' }
  title?: { msg: string; status: undefined | 'invalid' }
  description?: { msg: string; status: undefined | 'invalid' }
  fieldsForUpdate?: { msg: string; status: undefined | 'invalid' }
}

type PayloadEdit = {
  oldArticle: Article
  newArticle: Article
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

function compareData(data: PayloadEdit) {
  const oldA: any = data.oldArticle
  const newA: any = data.newArticle

  const keys = Object.keys(oldA).filter((el) => {
    return el !== '_id'
  })

  console.log(oldA, newA)

  const updatedData: any = {}

  for (let key of keys) {
    switch (key) {
      case 'textBlocks': {
        if (JSON.stringify(oldA[key]) !== JSON.stringify(newA[key])) {
          updatedData[key] = newA[key]
        }
        break
      }
      default: {
        if (oldA[key] !== newA[key]) {
          updatedData[key] = newA[key]
        }
      }
    }
  }
  return updatedData
}
