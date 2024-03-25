'use client'

import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  ArrowShapeUpFromLine,
  Xmark,
  ArrowsOppositeToDots,
  ArrowRight,
  CircleExclamation,
} from '@gravity-ui/icons'
import { OrderedPhoto } from './DragAndDropSort/DragAndDropSort'
import { Button, Card, Icon, Modal, Text } from '@gravity-ui/uikit'
import { b } from '../PhotoInput'
import sortCardsByOrder from '../lib/sorting'
import { Photo, PhotosDispatchContext } from '../lib/PhotosReduser'

export function PhotoFile({ photo }: PhotoFileProps) {
  const [changeFile, setChangeFile] = useState<Photo | undefined>(undefined)
  const imageRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const dispatch = useContext(PhotosDispatchContext)
  const [openModal, setOpenModal] = useState(false)

  function deleteImage() {
    dispatch({ type: 'deleteImage', payload: { forDelete: photo } })
  }
  function changeImage() {
    if (changeFile) {
      dispatch({
        type: 'changePhoto',
        payload: { changePhoto: { oldPhoto: photo, newPhoto: changeFile } },
      })
      setOpenModal(false)
      setChangeFile(undefined)
    }
  }

  if (photo.type == 'client') {
    const reader = new FileReader()
    reader.readAsDataURL(photo.url as File)
    reader.onload = (e) => {
      if (imageRef.current)
        imageRef.current.style.backgroundImage = `url(${e.target?.result})`
    }

    return (
      <div ref={imageRef} className={b('one-photo')}>
        <div className="photo-options">
          <Button
            size="xs"
            view="normal-contrast"
            onClick={() => {
              setOpenModal(true)
            }}
          >
            <Icon data={ArrowsOppositeToDots} size={15} />
          </Button>
          <Button size="xs" view="normal-contrast" onClick={deleteImage}>
            <Icon data={Xmark} size={15} />
          </Button>
        </div>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <div className={b('modal-one-photo')}>
            <div className="head">
              <Text variant="header-1">Заменить изображение</Text>
              <Button
                view="flat"
                onClick={() => {
                  setOpenModal(false)
                }}
              >
                <Icon data={Xmark} size={20} />
              </Button>
            </div>
            <div className="alert">
              <Icon data={CircleExclamation} size={20} />
              <Text variant="body-1">
                Старое фото будет безвозвратно удалено
              </Text>
            </div>

            <div className="body">
              <PhotoNoOptions photo={photo} noInput />
              <Icon data={ArrowRight} size={25} />
              <PhotoNoOptions photo={changeFile} setNewPhoto={setChangeFile} />
            </div>
            <div className="action-btn">
              <Button view="action" onClick={changeImage}>
                Заменить
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  } else if (photo.type == 'server') {
    return (
      <div
        ref={imageRef}
        className={b('one-photo')}
        style={{ backgroundImage: `url(${photo.url})` }}
      >
        <div className="photo-options">
          <Button
            size="xs"
            view="normal-contrast"
            onClick={() => {
              setOpenModal(true)
            }}
          >
            <Icon data={ArrowsOppositeToDots} size={15} />
          </Button>
          <Button size="xs" view="normal-contrast" onClick={deleteImage}>
            <Icon data={Xmark} size={15} />
          </Button>
        </div>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <div className={b('modal-one-photo')}>
            <div className="head">
              <Text variant="header-1">Заменить изображение</Text>
              <Button
                view="flat"
                onClick={() => {
                  setOpenModal(false)
                }}
              >
                <Icon data={Xmark} size={20} />
              </Button>
            </div>
            <div className="alert">
              <Icon data={CircleExclamation} size={20} />
              <Text variant="body-1">
                Старое фото будет безвозвратно удалено
              </Text>
            </div>

            <div className="body">
              <PhotoNoOptions photo={photo} noInput />
              <Icon data={ArrowRight} size={25} />
              <PhotoNoOptions photo={changeFile} setNewPhoto={setChangeFile} />
            </div>
            <div className="action-btn">
              <Button view="action" onClick={changeImage}>
                Заменить
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

function PhotoNoOptions({
  photo,
  setNewPhoto,
  noInput,
}: {
  photo?: OrderedPhoto | Photo
  setNewPhoto?: Dispatch<SetStateAction<Photo | undefined>>
  noInput?: boolean
}) {
  const imageRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null)

  if (photo && photo.type == 'server') {
    return (
      <div
        className={b('photo_no-options')}
        style={{ backgroundImage: `url(${photo.url})` }}
        onClick={() => {
          if (!noInput) {
            inputRef.current?.click()
          }
        }}
      >
        {!noInput && (
          <input
            style={{ display: 'none' }}
            ref={inputRef}
            type="file"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null
              if (file && setNewPhoto) {
                setNewPhoto({
                  url: file,
                  type: 'client',
                })
              }
            }}
          />
        )}
      </div>
    )
  } else if (photo && photo.type == 'client') {
    const reader = new FileReader()
    reader.readAsDataURL(photo.url as File)
    reader.onload = (e) => {
      if (imageRef.current)
        imageRef.current.style.backgroundImage = `url(${e.target?.result})`
    }
    return (
      <div
        ref={imageRef}
        className={b('photo_no-options')}
        onClick={() => {
          if (!noInput) {
            inputRef.current?.click()
          }
        }}
      >
        {!noInput && (
          <input
            style={{ display: 'none' }}
            ref={inputRef}
            type="file"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null
              if (file && setNewPhoto) {
                setNewPhoto({
                  url: file,
                  type: 'client',
                })
              }
            }}
          />
        )}
      </div>
    )
  } else {
    return (
      <Card
        type="action"
        className={b('fileinput')}
        onClick={() => {
          inputRef.current?.click()
        }}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : null
            if (file && setNewPhoto) {
              setNewPhoto({
                url: file,
                type: 'client',
              })
            }
          }}
        />
        <Text variant="body-3">Фото для замены</Text>
      </Card>
    )
  }
}

export function PhotoFileSort({
  photo,
  setCurrentCard,
  currentCard,
  cards,
}: PhotoFileSortProps) {
  const imageRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const dispatch = useContext(PhotosDispatchContext)

  function dragStartHandler(e: any, card: OrderedPhoto) {
    e.target.classList.add('current')
    setCurrentCard(card)
  }
  function dragLeaveHandler(e: any) {
    e.preventDefault()
    e.target.classList.remove('over')
  }
  function dragEndHandler(e: any) {
    e.preventDefault()
    e.target.classList.remove('over', 'current')
    setCurrentCard(null)
  }
  function dragOverHandler(e: any) {
    e.preventDefault()
    e.target.classList.add('over')
  }
  function dropHandler(e: any, card: OrderedPhoto, cards: OrderedPhoto[]) {
    e.preventDefault()
    e.target.classList.remove('over', 'current')
    setCurrentCard(null)

    if (currentCard?.order !== card.order) {
      const updatedCards = cards.map((el) => {
        const updatedEl = Object.assign({}, el)

        if (updatedEl.id === currentCard?.id) {
          updatedEl.order = card.order
        } else if (updatedEl.id === card.id) {
          updatedEl.order = currentCard?.order
        }
        return updatedEl
      })

      const sortedUpdatedCards = sortCardsByOrder(updatedCards)

      dispatch({
        type: 'updateSort',
        payload: { updatedSort: sortedUpdatedCards },
      })
    }
  }

  if (photo.type == 'client') {
    const reader = new FileReader()
    reader.readAsDataURL(photo.url as File)
    reader.onload = (e) => {
      if (imageRef.current)
        imageRef.current.style.backgroundImage = `url(${e.target?.result})`
    }

    return (
      <div
        draggable={true}
        ref={imageRef}
        className={b('one-photo')}
        style={{ cursor: 'grab' }}
        onDragStart={(e) => {
          dragStartHandler(e, photo)
        }}
        onDragLeave={(e) => {
          dragLeaveHandler(e)
        }}
        onDragEnd={(e) => {
          dragEndHandler(e)
        }}
        onDragOver={(e) => {
          dragOverHandler(e)
        }}
        onDrop={(e) => {
          dropHandler(e, photo, cards)
        }}
      ></div>
    )
  } else if (photo.type == 'server') {
    return (
      <div
        draggable={true}
        ref={imageRef}
        className={b('one-photo')}
        style={{ cursor: 'grab', backgroundImage: `url(${photo.url})` }}
        onDragStart={(e) => {
          dragStartHandler(e, photo)
        }}
        onDragLeave={(e) => {
          dragLeaveHandler(e)
        }}
        onDragEnd={(e) => {
          dragEndHandler(e)
        }}
        onDragOver={(e) => {
          dragOverHandler(e)
        }}
        onDrop={(e) => {
          dropHandler(e, photo, cards)
        }}
      >
        <p style={{ visibility: 'hidden' }}>Card</p>
      </div>
    )
  } else {
    return (
      <div
        className={b('one-photo', { space: true })}
        style={{ width: '75px', cursor: 'grabbing', background: 'none' }}
        onDragLeave={(e) => {
          dragLeaveHandler(e)
        }}
        onDragEnd={(e) => {
          dragEndHandler(e)
        }}
        onDragOver={(e) => {
          dragOverHandler(e)
        }}
        onDrop={(e) => {
          dropHandler(e, photo, cards)
        }}
      >
        <Icon data={ArrowShapeUpFromLine} />
      </div>
    )
  }
}
export function PhotoFileClickSort({
  photo,
  setCurrentCard,
  currentCard,
  cards,
}: PhotoFileSortProps) {
  const imageRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const dispatch = useContext(PhotosDispatchContext)

  const classOptions = {
    clickSort: true,
    active: currentCard?.id === photo.id,
    notActive: currentCard?.id !== photo.id,
  }

  function clickHandler() {
    if (photo.type === 'space' && !currentCard) {
      return
    }
    if (!currentCard) {
      setCurrentCard(photo)
      return
    }
    if (currentCard.id == photo.id) {
      setCurrentCard(null)
      return
    }

    if (currentCard?.order !== photo.order) {
      const updatedCards = cards.map((el) => {
        const updatedEl = Object.assign({}, el)

        if (updatedEl.id === currentCard?.id) {
          updatedEl.order = photo.order
        } else if (updatedEl.id === photo.id) {
          updatedEl.order = currentCard.order
        }
        return updatedEl
      })

      const sortedUpdatedCards = sortCardsByOrder(updatedCards)

      dispatch({
        type: 'updateSort',
        payload: { updatedSort: sortedUpdatedCards },
      })
      setCurrentCard(null)
    }
  }

  if (photo.type == 'client') {
    const reader = new FileReader()
    reader.readAsDataURL(photo.url as File)
    reader.onload = (e) => {
      if (imageRef.current)
        imageRef.current.style.backgroundImage = `url(${e.target?.result})`
    }

    return (
      <div
        ref={imageRef}
        className={b('one-photo', classOptions)}
        style={{ cursor: 'pointer' }}
        onClick={clickHandler}
      ></div>
    )
  } else if (photo.type == 'server') {
    return (
      <div
        ref={imageRef}
        className={b('one-photo', classOptions)}
        style={{
          cursor: 'pointer',
          backgroundImage: `url(${photo.url})`,
        }}
        onClick={clickHandler}
      >
        <p style={{ visibility: 'hidden' }}>Card</p>
      </div>
    )
  } else {
    return (
      <div
        className={b('one-photo', { ...classOptions, space: true })}
        style={{
          width: '75px',
          cursor: 'pointer',
          background: 'none',
        }}
        onClick={clickHandler}
      >
        <Icon data={ArrowShapeUpFromLine} />
      </div>
    )
  }
}

type PhotoFileProps = {
  photo: OrderedPhoto
}

type PhotoFileSortProps = {
  photo: OrderedPhoto
  setCurrentCard: Dispatch<SetStateAction<OrderedPhoto | null>>
  currentCard: OrderedPhoto | null
  cards: OrderedPhoto[]
}
