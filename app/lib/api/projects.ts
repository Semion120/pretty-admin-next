'use server'
import { getProjects } from '@/data/projects'

export async function getAllProjects() {
  const projects = getProjects()
  return projects
}
