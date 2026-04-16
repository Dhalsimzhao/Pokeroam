import { useEffect, useState } from 'react'
import { DialogueBubble } from './DialogueBubble'
import { getPortraitUrl } from './portraits'

interface DialogueShowData {
  speciesName: string
  emotion: string
  text: string
}

export default function App(): JSX.Element {
  const [data, setData] = useState<DialogueShowData | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const unsubShow = window.api.onDialogueShow((raw) => {
      const d = raw as DialogueShowData
      setData(d)
      setVisible(true)
    })
    const unsubHide = window.api.onDialogueHide(() => {
      setVisible(false)
    })
    return () => {
      unsubShow()
      unsubHide()
    }
  }, [])

  if (!data) return <div />

  const portraitSrc = getPortraitUrl(data.speciesName, data.emotion)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'transparent',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      <DialogueBubble
        portraitSrc={portraitSrc}
        emotion={data.emotion}
        text={data.text}
      />
    </div>
  )
}
