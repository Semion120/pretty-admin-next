import { Photo } from '../PhotosReduser'
import { OrderedPhoto } from '../components/DragAndDropSort/DragAndDropSort'

export default function sortCardsByOrder(cards: OrderedPhoto[]) {
  let arr: OrderedPhoto[] = Object.assign([], cards)
  arr.sort((a: any, b: any) => {
    if (a.order < b.order) {
      return -1
    }
    if (a.order > b.order) {
      return 1
    }

    return 0
  })

  arr = arr.filter((el) => {
    return el.type !== 'space'
  })

  const doneArr: Photo[] = arr.map((el) => {
    const updatedEl = Object.assign({}, el)

    delete updatedEl.order

    return updatedEl
  })
  return doneArr
}
