'use client'
import './styles.scss'
import { EDITOR_JS_TOOLS, EDITOR_JS_I18N } from './config'
import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs'
import { useEffect, useRef } from 'react'
import block from 'bem-cn-lite'

const b = block('editorjs-main')

export default function TextEditor({
  blocks,
  onUpdate,
  validationState,
  errorMessage,
}: Props) {
  const editorRef = useRef<EditorJS | null>(null)

  const config: EditorConfig = {
    holder: 'editorjs',
    placeholder: 'Начнем с первой буквы',
    tools: EDITOR_JS_TOOLS,
    i18n: EDITOR_JS_I18N,
    onChange: (api: any, event: CustomEvent<any>[] | CustomEvent<any>) => {
      editorRef.current?.save().then((data) => {
        console.log(data)
        onUpdate?.(data)
      })
    },
    data: blocks,
  }
  if (blocks) {
    config.data = blocks
  }

  useEffect(() => {
    if (!editorRef.current) {
      const Editor = new EditorJS(config)
      editorRef.current = Editor
    }
  })

  return (
    <>
      {validationState === 'invalid' && (
        <div className="error-message">{errorMessage}</div>
      )}
      <div id="editorjs" className={b({ validation: validationState })}></div>
    </>
  )
}

type EditorUpdate = CustomEvent<any>[] | CustomEvent<any>

type Props = {
  blocks?: OutputData
  onUpdate?: (data: any) => void
  validationState?: 'valid' | 'invalid' | undefined
  errorMessage?: string
}
