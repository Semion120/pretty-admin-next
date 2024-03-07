'use server'

import {
  addArticle,
  editArticle,
  getArticle,
  getArticles,
  removeArticle,
} from '@/data/articles'
import { Article } from '@/data/articles/article'
import { revalidatePath } from 'next/cache'

export async function fetchArticles() {
  const Articles = await getArticles()
  return Articles
}

export async function fetchArticleById(id: string) {
  const Articles = await getArticle(id)
  return Articles
}

export async function deleteArticleAction(id: string) {
  const Articles = await removeArticle(id)
  return Articles
}

export async function editArticleAction(id: string, fieldsForUpdate: any) {
  const Articles = await editArticle(id, fieldsForUpdate)
  revalidatePath('/articles')
  return Articles
}

export async function addArticleAction(article: Article) {
  const status = await addArticle(article)
  return status
}
