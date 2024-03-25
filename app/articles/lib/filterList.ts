import { Article } from '@/data/articles/article'

export default function filterList(
  arr: Article[] | null,
  searchString: string
): Article[] | null {
  if (!arr) {
    return null
  }
  if (!searchString) {
    return arr
  }

  let filteredArr = arr

  if (searchString) {
    filteredArr = arr.filter((el) => {
      return el.shortName.toLowerCase().includes(searchString.toLowerCase())
    })
  }
  return filteredArr
}
