'use client'
import { Button, Icon, Popup, Text } from '@gravity-ui/uikit'
import { CircleQuestion } from '@gravity-ui/icons'
import './styles.scss'
import { useRef, useState } from 'react'

import block from 'bem-cn-lite'

const b = block('text-input-wrapper')

export default function TextInputWrapper({ children, gloss }: WrapperProps) {
  const buttonRef = useRef(null)
  const [open, setOpen] = useState(false)

  const defaultGloss =
    'Определение - короткое пояснение, что требуется вводить в поле'
  return (
    <div className={b()}>
      <div className={b('info')} ref={buttonRef}>
        <Button
          view="outlined"
          className={b('btn')}
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          <Icon data={CircleQuestion} size={20} />
        </Button>
        {children}
      </div>
      <Popup
        anchorRef={buttonRef}
        open={open}
        placement="bottom"
        className={b('pop-up')}
        onMouseLeave={() => setOpen((prevOpen) => !prevOpen)}
        onOutsideClick={() => setOpen((prevOpen) => !prevOpen)}
      >
        <div className={b('pop-up_content')}>
          <p style={{ margin: 0 }}>
            <Text variant="body-1">{gloss ? gloss : defaultGloss}</Text>
          </p>
        </div>
      </Popup>
    </div>
  )
}

type WrapperProps = { children: React.ReactNode; gloss?: string }
