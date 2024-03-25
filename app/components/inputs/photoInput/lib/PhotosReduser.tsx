'use client'

import { Context, Dispatch, createContext } from 'react'
import makeId from './id'
import { OrderedPhoto } from '../components/DragAndDropSort/DragAndDropSort'

export const PhotosDispatchContext: Context<Dispatch<ActionType>> =
  createContext((value: ActionType) => {})

export function PhotosReduser(photosData: PhotosDataType, action: ActionType) {
  const updatedData = Object.assign({}, photosData)
  switch (action.type) {
    case 'pushToStart': {
      const uploadedFiles = action.payload.uploadFiles
      if (!uploadedFiles || (uploadedFiles && uploadedFiles?.length == 0)) {
        updatedData.error = 'Нет загруженных файлов'
        break
      }
      const unpackedFiles = unPackFiles(uploadedFiles, 'client')

      const dataUrls = []

      for (let photo of unpackedFiles) {
        const file = photo.file
        dataUrls.push({ id: photo.id, type: photo.type, url: file })
        continue
      }
      updatedData.current = [...dataUrls, ...photosData.current]
      updatedData.error && delete updatedData.error
      break
    }
    case 'pushToEnd': {
      const uploadedFiles = action.payload.uploadFiles
      if (!uploadedFiles || (uploadedFiles && uploadedFiles?.length == 0)) {
        updatedData.error = 'Нет загруженных файлов'
        break
      }
      const unpackedFiles = unPackFiles(uploadedFiles, 'client')

      const dataUrls = []

      for (let photo of unpackedFiles) {
        const file = photo.file

        dataUrls.push({ id: photo.id, type: photo.type, url: file })
        continue
      }
      updatedData.current = [...photosData.current, ...dataUrls]
      updatedData.error && delete updatedData.error
      break
    }
    case 'updateSort': {
      if (action.payload.updatedSort) {
        updatedData.current = action.payload.updatedSort
      }
      break
    }
    case 'deleteImage': {
      const deleteImage = action.payload.forDelete
      if (deleteImage && deleteImage.type == 'client') {
        updatedData.current = updatedData.current.filter((el) => {
          return el.id !== deleteImage.id
        })
      } else if (deleteImage && deleteImage.type == 'server') {
        updatedData.current = updatedData.current.filter((el) => {
          return el.id !== deleteImage.id
        })
        if (updatedData.serverPhotos) {
          updatedData.serverPhotos = updatedData.serverPhotos.filter((el) => {
            return el.url !== deleteImage.url
          })

          if (
            updatedData.photosForDelete &&
            !updatedData.photosForDelete.find((el) => {
              return el.id == deleteImage.id
            })
          ) {
            updatedData.photosForDelete.push(deleteImage)
          } else if (!updatedData.photosForDelete) {
            updatedData.photosForDelete = [deleteImage]
          }
        }
      }
      break
    }
    case 'changePhoto': {
      if (action.payload.changePhoto) {
        const oldPhoto = action.payload.changePhoto.oldPhoto
        const newPhoto: OrderedPhoto = action.payload.changePhoto.newPhoto
        newPhoto.order = oldPhoto.order
        newPhoto.id = oldPhoto.id
        if (oldPhoto.type == 'client') {
          updatedData.current = updatedData.current.map((el) => {
            if (el.id == oldPhoto.id) {
              return newPhoto
            }
            return el
          })
        } else if (oldPhoto.type == 'server') {
          updatedData.current = updatedData.current.map((el) => {
            if (el.id == oldPhoto.id) {
              return newPhoto
            }
            return el
          })

          if (
            updatedData.photosForDelete &&
            !updatedData.photosForDelete.find((el) => {
              return el.id == oldPhoto.id
            })
          ) {
            updatedData.photosForDelete.push(oldPhoto)
          } else if (!updatedData.photosForDelete) {
            updatedData.photosForDelete = [oldPhoto]
          }

          updatedData.serverPhotos = updatedData.serverPhotos?.filter((el) => {
            return el.id !== oldPhoto.id
          })
        }
      }
      break
    }
  }

  return updatedData
}

function unPackFiles(list: FileList, type: Photo['type']) {
  const unpackedFiles = []
  for (let i = 0; i < list.length; i++) {
    const id = 'id' + makeId()
    const file = list.item(i)
    if (file) {
      unpackedFiles.push({ id, type, file })
    }
    continue
  }
  return unpackedFiles
}

export type PhotosDataType = {
  current: Photo[]
  serverPhotos?: Photo[]
  photosForDelete?: Photo[]
  error?: string
}

type ActionType = {
  type: string
  payload: {
    uploadFiles?: FileList | null
    updatedSort?: Photo[]
    forDelete?: Photo
    changePhoto?: { oldPhoto: OrderedPhoto; newPhoto: Photo }
  }
}

export type Photo = {
  id?: string
  type: 'client' | 'server' | 'space'
  url: File | string
}
