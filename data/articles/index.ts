import { readFileSync, writeFileSync } from 'fs'
import { Article } from './article'

const folder = __dirname.replace(/\.next.*/, '')
const pathToFile = folder + 'data/articles/data.txt'

export async function getArticle(id: string) {
  const articles = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  const result: Article | undefined = articles.filter((el: any) => {
    return el._id == id
  })[0]
  if (!result) {
    throw new Error('Не найден проект')
  }
  return result
}

export async function getArticles() {
  const articles = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  return articles
}

export async function addArticle(data: Article) {
  const articles = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  articles.push(data)
  writeFileSync(pathToFile, JSON.stringify(articles))
  return true
}

export async function removeArticle(id: string) {
  let articles = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  articles = articles.filter((el: any) => {
    return id !== el._id
  })
  writeFileSync(pathToFile, JSON.stringify(articles))
}

export async function editArticle(id: string, fieldsForUpdate: any) {
  let Articles = JSON.parse(
    readFileSync(pathToFile, { encoding: 'utf8', flag: 'r' })
  )
  const ArticleIndex = Articles.findIndex((el: any) => {
    return el._id == id
  })

  for (let key in fieldsForUpdate) {
    Articles[ArticleIndex][key] = fieldsForUpdate[key]
  }

  writeFileSync(pathToFile, JSON.stringify(Articles))
  return true
}
