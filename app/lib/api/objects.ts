'use server'
import { getObjects } from '@/data/articles'

export async function getAllObjects() {
  const objects = getObjects()
  return objects
}
