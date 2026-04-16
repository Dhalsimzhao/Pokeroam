interface DialogueBubbleProps {
  portraitSrc: string | null
  emotion: string
  text: string
}

export function DialogueBubble({ portraitSrc, emotion, text }: DialogueBubbleProps): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        background: 'rgba(0, 0, 0, 0.75)',
        borderRadius: 8,
        maxWidth: 280,
        minHeight: 48
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          imageRendering: 'pixelated'
        }}
      >
        {portraitSrc ? (
          <img
            src={portraitSrc}
            alt={emotion}
            style={{ width: 40, height: 40, imageRendering: 'pixelated' }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              color: '#aaa'
            }}
          >
            {emotion}
          </div>
        )}
      </div>
      <div
        style={{
          color: '#fff',
          fontSize: 13,
          lineHeight: 1.4,
          wordBreak: 'break-word',
          fontFamily: 'sans-serif'
        }}
      >
        {text || '...'}
      </div>
    </div>
  )
}
