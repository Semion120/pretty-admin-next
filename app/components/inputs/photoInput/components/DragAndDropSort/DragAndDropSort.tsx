'use client'

import { useEffect, useState } from 'react'
import { Photo } from '../../lib/PhotosReduser'
import { b } from '../../PhotoInput'
import FileInput from '../FileInput'
import './DragStatus.scss'
import makeId from '../../lib/id'
import { listWithSpaces } from '../../lib/spaces'
import { PhotoFile, PhotoFileClickSort, PhotoFileSort } from '../PhotoFile'
import identifyDevice from '../../lib/deviceType'

export default function DragAndDrop({ photos, handSort }: DragAndDropProps) {
  const [currentCard, setCurrentCard] = useState<OrderedPhoto | null>(null)

  const [device, setDevice] = useState({
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  })
  useEffect(() => {
    const device = identifyDevice(window.innerWidth)
    setDevice(device)
  }, [])

  let orderedPhotos: OrderedPhoto[] = photos.map((el, index) => {
    const updatedEl: OrderedPhoto = Object.assign({}, el)
    if (!el.id) {
      const id = makeId()
      updatedEl.id = id
    }
    updatedEl.order = index
    return updatedEl
  })
  if (handSort) {
    orderedPhotos = listWithSpaces(orderedPhotos)
  }

  if (device.isMobile) {
    return (
      <div className={b('gallery', { mobile: true })}>
        <div className="file-input">
          <FileInput id="Start" title="Добавить в начало" />
        </div>

        {orderedPhotos.map((el, index) => {
          if (handSort) {
            return (
              <PhotoFileClickSort
                key={index}
                photo={el}
                currentCard={currentCard}
                setCurrentCard={setCurrentCard}
                cards={orderedPhotos}
              />
            )
          } else {
            return <PhotoFile key={index} photo={el} />
          }
        })}
        <div className="file-input">
          <FileInput id="End" title="Добавить в конец" />
        </div>
      </div>
    )
  }
  return (
    <div className={b('gallery')}>
      <FileInput id="Start" title="Добавить в начало" />
      {orderedPhotos.map((el, index) => {
        if (handSort) {
          return (
            <PhotoFileSort
              key={index}
              photo={el}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
              cards={orderedPhotos}
            />
          )
        } else {
          return <PhotoFile key={index} photo={el} />
        }
      })}
      <FileInput id="End" title="Добавить в конец" />
    </div>
  )
}

type DragAndDropProps = { photos: Photo[]; handSort: boolean }

export type OrderedPhoto = Photo & { order?: number }
