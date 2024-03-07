'use client'
import './PhotoInput.scss'
import { Switch, Text } from '@gravity-ui/uikit'

import block from 'bem-cn-lite'
import { useReducer, useState } from 'react'
import {
  PhotosReduser,
  PhotosDispatchContext,
  Photo,
  PhotosDataType,
} from './PhotosReduser'
import { DragAndDrop } from './components'
import makeId from './lib/id'

export const b = block('photo-input')

const DEFAULT_TITLE = 'Фотографии'

export default function PhotoInput({
  existPhotos,
  title,
  onUpdate,
}: PhotoInputProps) {
  const [oldPhotos, setOldPhotos] = useState<Photo[] | undefined>(undefined)
  let defaultState: PhotosDataType = {
    current: [],
  }

  if (existPhotos && existPhotos?.length > 0 && !oldPhotos) {
    const photos: Photo[] = existPhotos.map((el) => {
      const id = makeId()
      return { id, type: 'server', url: el }
    })

    defaultState = { current: photos, serverPhotos: photos }
    setOldPhotos(photos)
  }

  const [photosState, dispatch] = useReducer(PhotosReduser, defaultState)
  updateParantData(photosState, onUpdate)

  const [handSort, setHandSort] = useState(false)

  return (
    <div className={b()}>
      <h1>
        <Text variant="display-1">{title ? title : DEFAULT_TITLE}</Text>
      </h1>
      <div className={b('options')}>
        <Switch
          content="Ручная сортировка"
          size="l"
          checked={handSort}
          onUpdate={(checked) => {
            setHandSort(checked)
          }}
        />
      </div>
      <PhotosDispatchContext.Provider value={dispatch}>
        <DragAndDrop photos={photosState.current} handSort={handSort} />
      </PhotosDispatchContext.Provider>
    </div>
  )
}

type PhotoInputProps = {
  existPhotos?: string[]
  title?: string
  onUpdate?: (val: { currentList: Photo[]; deleteFromServer?: Photo[] }) => void
}

function updateParantData(
  photosState: PhotosDataType,
  updateParant: PhotoInputProps['onUpdate']
) {
  if (!updateParant) return

  const currentList = photosState.current
  const deleteFromServer = photosState.photosForDelete

  updateParant({ currentList, deleteFromServer })
}
