'use server'

import {
  addProject,
  editProject,
  getProject,
  getProjects,
  removeProject,
} from '@/data/projects'
import { Project } from '@/data/projects/project'

export async function fetchProjects() {
  const projects = await getProjects()
  return projects
}

export async function fetchProjectById(id: string) {
  const projects = await getProject(id)
  return projects
}

export async function deleteProjectAction(id: string) {
  const projects = await removeProject(id)
  return projects
}

export async function editProjectAction(id: string, fieldsForUpdate: any) {
  const projects = await editProject(id, fieldsForUpdate)
  return projects
}

export async function addProjectAction(project: any) {
  const data = new FormData()
  for (let key in project) {
    data.append(key, project[key])
  }
  const status = await addProject(data)
  return status
}
