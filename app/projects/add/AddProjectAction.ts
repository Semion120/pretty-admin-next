'use server'

import { addProjectAction } from '@/app/actions/Projects'
import { Project } from '@/data/projects/project'
import { User } from '@/data/users/member'

export default async function AddAction(
  currentState: AddProjectState,
  payload: Project
): Promise<AddProjectState> {
  const { project, errorMsgs } = validateData(payload)

  if (project) {
    const status = await addProjectAction(project)

    return { status: 'valid' }
  } else {
    return { status: 'invalid', errorMsgs }
  }
}

type AddProjectState = {
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
