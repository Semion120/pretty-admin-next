import { OrderedPhoto } from '../components/DragAndDropSort/DragAndDropSort'

export function listWithSpaces(photos: OrderedPhoto[]) {
  const listWithSpaces: OrderedPhoto[] = []
  let incrementor = 1
  let orderIncrementor = 0
  for (let i = 0; i < photos.length; i++) {
    const updatedPhoto = Object.assign({}, photos[i])
    updatedPhoto.order = orderIncrementor
    orderIncrementor += 2
    listWithSpaces.push(updatedPhoto)

    const orderPosition = i + incrementor
    const id = 'space' + orderPosition
    listWithSpaces.push({
      type: 'space',
      url: '',
      order: orderPosition,
      id,
    })
    incrementor++
  }

  return listWithSpaces
}

export function mobListWithSpaces(photos: OrderedPhoto[]) {
  const listWithSpaces: OrderedPhoto[][] = []
  let incrementor = 1
  let orderIncrementor = 0
  for (let i = 0; i < photos.length; i++) {
    const updatedPhoto = Object.assign({}, photos[i])
    updatedPhoto.order = orderIncrementor
    orderIncrementor += 2

    const orderPosition = i + incrementor
    const id = 'space' + orderPosition
    const spaceCard: OrderedPhoto = {
      type: 'space',
      url: '',
      order: orderPosition,
      id,
    }
    listWithSpaces.push([updatedPhoto, spaceCard])
    incrementor++
  }

  return listWithSpaces
}
