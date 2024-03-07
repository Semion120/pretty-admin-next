'use client'
import './styles.scss'
import { Text, Checkbox } from '@gravity-ui/uikit'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'
import block from 'bem-cn-lite'

const b = block('base-checkbox')

export default function BaseCheckBox({
  className,
  options,
  subheader,
  onUpdate,
  errorMessage,
  validationState,
}: BaseCheckBoxProps) {
  let defaultState: string[] = []
  options.forEach((el) => {
    if (el.defaultChecked) {
      defaultState.push(el.value)
    }
  })

  const [checkBoxState, setCheckBox] = useState(defaultState)

  return (
    <div className={b()}>
      <Text variant="body-3" className={b('subheader')}>
        {subheader}
      </Text>

      <div className={b('options', { validation: validationState })}>
        {options &&
          options.map((el) => {
            return (
              <Checkbox
                key={el.value}
                onUpdate={(checked: boolean) => {
                  updateState(
                    setCheckBox,
                    checkBoxState,
                    checked,
                    el.value,
                    onUpdate
                  )
                }}
                size="l"
                {...el}
                className={className}
              />
            )
          })}
      </div>
      <Text variant="body-1" color="danger">
        {errorMessage && errorMessage}
      </Text>
    </div>
  )
}

function updateState(
  setState: Dispatch<SetStateAction<string[]>>,
  state: (string | undefined)[],
  checked: boolean,
  value: string,
  onUpdate?: BaseCheckBoxProps['onUpdate']
) {
  let newState = Object.assign([], state)
  if (checked) {
    newState.push(value)
  } else {
    newState = newState.filter((el) => {
      return el !== value
    })
  }
  setState(newState)

  if (onUpdate) {
    onUpdate(newState)
  }
}

type BaseCheckBoxProps = {
  options: Option[]
  subheader: string
  onUpdate?: (value: string[]) => void
  errorMessage?: string
  validationState?: undefined | 'invalid'
  className?: string
}

export type Option = {
  disabled?: boolean
  checked?: boolean
  defaultChecked?: boolean
  className?: string
  name?: string
  value: string
  content: ReactNode
}
