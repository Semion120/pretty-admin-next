'use client'
import { TextInput } from '@gravity-ui/uikit'
import { TextInputWrapper } from '@/app/components/inputs/wrappers'

export default function BaseInput(props: any) {
  return (
    <>
      <TextInputWrapper gloss={props.gloss}>
        <TextInput {...props} />
      </TextInputWrapper>
    </>
  )
}
