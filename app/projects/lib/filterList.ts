import { Project } from '@/data/projects/project'
import { ProjectsFilter } from '../page'

export default function filterList(
  arr: Project[] | null,
  filter: ProjectsFilter | undefined
): Project[] | null {
  let filteredArr
  if (!arr) {
    return null
  }
  if (!filter) {
    return arr
  }

  if (filter.searchString) {
    filteredArr = arr.filter((el) => {
      return el.name.toLowerCase().includes(filter.searchString.toLowerCase())
    })
  } else {
    switch (filter.category) {
      case 'all': {
        filteredArr = Object.assign([], arr)
        break
      }
      default: {
        filteredArr = arr.filter((el) => {
          return el.category == filter.category
        })
        break
      }
    }
  }
  return filteredArr
}
