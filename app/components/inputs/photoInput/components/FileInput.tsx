'use client'

import { Card, Text } from '@gravity-ui/uikit'
import { PhotosDispatchContext } from '../lib/PhotosReduser'
import { MutableRefObject, useContext, useRef } from 'react'
import { b } from '../PhotoInput'

export default function FileInput({ id, title }: FileInputProps) {
  const inputRef: MutableRefObject<HTMLInputElement | null> = useRef(null)
  const dispatchPhotos = useContext(PhotosDispatchContext)

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
        multiple
        accept="image/png, image/jpeg"
        onChange={(e) => {
          const files = e.target.files

          const payload = {
            type: 'pushTo' + id,
            payload: { uploadFiles: files },
          }
          dispatchPhotos(payload)
        }}
      />
      <Text variant="body-3">{title}</Text>
    </Card>
  )
}

type FileInputProps = { id: 'Start' | 'End'; title: string }
