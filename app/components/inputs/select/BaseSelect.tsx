import { Select } from '@gravity-ui/uikit'
import { TextInputWrapper } from '@/app/components/inputs/wrappers'

export default function BaseSelect(props: any) {
  return (
    <TextInputWrapper gloss={props.gloss}>
      <Select {...props} />
    </TextInputWrapper>
  )
}
