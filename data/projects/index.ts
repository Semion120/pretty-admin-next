import projectBase, { Project } from './project'
import { writeFileSync, readFileSync } from 'fs'

const folder = __dirname.replace(/\.next.*/, '')
const pathToFile = folder + 'data/projects/data.txt'

export async function getProject(id: string) {
  const projects = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  const result: Project | undefined = projects.filter((el: any) => {
    return el._id == id
  })[0]
  if (!result) {
    throw new Error('Не найден проект')
  }
  return result
}

export async function getProjects() {
  const projects = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  return projects
}

export async function addProject(data: FormData) {
  const _id = data.get('_id') as string

  const name = data.get('name') as string

  const category = data.get('category') as string

  const description = data.get('description') as string

  const price = Number(data.get('price') as string)

  const dateUpdatePrice = data.get('dateUpdatePrice') as string

  const newProject = {
    _id,
    name,
    category,
    description,
    price,
    dateUpdatePrice,
  }

  const projects = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  projects.push(newProject)
  writeFileSync(pathToFile, JSON.stringify(projects))
  return true
}

type StatusType = {
  status: 'valid' | 'invalid'
  errors: {
    _id?: string
    name?: string
    category?: string
    description?: string
    price?: string
    dateUpdatePrice?: string
  }
}

export async function removeProject(id: string) {
  let projects = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  projects = projects.filter((el: any) => {
    return id !== el._id
  })
  writeFileSync(pathToFile, JSON.stringify(projects))
}

export async function editProject(id: string, fieldsForUpdate: any) {
  let projects = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  const projectIndex = projects.findIndex((el: any) => {
    return el._id == id
  })

  for (let key in fieldsForUpdate) {
    projects[projectIndex][key] = fieldsForUpdate[key]
  }

  writeFileSync(pathToFile, JSON.stringify(projects))
  return true
}
