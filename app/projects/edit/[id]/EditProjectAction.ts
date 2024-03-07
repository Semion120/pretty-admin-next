'use server'

import { editProjectAction } from '@/app/actions/Projects'
import { editUserOnServer } from '@/app/actions/Users'
import { AddUser } from '@/app/lib/api/users'
import { Project } from '@/data/projects/project'
import { User } from '@/data/users/member'

export default async function EditProjectAction(
  currentState: EditUserState,
  payload: PayloadEdit
): Promise<EditUserState> {
  const { project, errorMsgs } = validateData(payload.newProject)

  const fieldsForUpdate = compareData(payload)
  const keysForUpdate = Object.keys(fieldsForUpdate)
  if (keysForUpdate.length == 0) {
    errorMsgs.fieldsForUpdate = {
      msg: 'Чтобы редактировать проект, нужно изменить данные',
      status: 'invalid',
    }
  }

  if (project && keysForUpdate.length > 0) {
    const status = await editProjectAction(project._id, fieldsForUpdate)

    return { status: 'valid' }
  } else {
    return { status: 'invalid', errorMsgs }
  }
}

type EditUserState = {
  status: 'valid' | 'invalid' | undefined
  projectData?: Project
  errorMsgs?: ErrorMsgsType
}

type ErrorMsgsType = {
  category?: { msg: string; status: undefined | 'invalid' }
  name?: { msg: string; status: undefined | 'invalid' }
  description?: { msg: string; status: undefined | 'invalid' }
  price?: { msg: string; status: undefined | 'invalid' }
  dateUpdatePrice?: { msg: string; status: undefined | 'invalid' }
  fieldsForUpdate?: { msg: string; status: undefined | 'invalid' }
}

type PayloadEdit = {
  oldProject: Project
  newProject: Project
}

function validateData(data: Project): {
  project: Project | undefined
  errorMsgs: ErrorMsgsType
} {
  const errorMsgs: ErrorMsgsType = {}

  const _id = data._id

  const name = data.name
  if (!name) errorMsgs.name = { msg: 'Не заполнено поле', status: 'invalid' }

  const description = data.description
  if (!description)
    errorMsgs.description = { msg: 'Не заполнено поле', status: 'invalid' }

  const category = data.category
  if (!category) {
    errorMsgs.category = {
      msg: 'Нужно выбрать хотя бы одно',
      status: 'invalid',
    }
  }

  const price = Number(data.price)
  if (!price) {
    errorMsgs.price = {
      msg: 'Не заполнено поле. Нужно ввести только цифры',
      status: 'invalid',
    }
  }

  const dateUpdatePrice = data.dateUpdatePrice
  if (!dateUpdatePrice) {
    errorMsgs.dateUpdatePrice = {
      msg: 'Не заполнено поле',
      status: 'invalid',
    }
  }

  if (Object.keys(errorMsgs).length > 0) {
    return { project: undefined, errorMsgs }
  } else {
    return {
      project: { _id, name, category, description, price, dateUpdatePrice },
      errorMsgs,
    }
  }
}

function compareData(data: PayloadEdit) {
  const oldP: any = data.oldProject
  const newP: any = data.newProject

  const keys = Object.keys(oldP).filter((el) => {
    return el !== '_id'
  })

  const updatedData: any = {}

  for (let key of keys) {
    switch (key) {
      default: {
        if (oldP[key] !== newP[key]) {
          updatedData[key] = newP[key]
        }
      }
    }
  }
  return updatedData
}
