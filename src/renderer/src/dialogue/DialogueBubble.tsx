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
        padding: '6px 8px',
        background: '#fff',
        maxWidth: 280,
        minHeight: 48,
        border: '3px solid #222',
        borderRadius: 4,
        boxShadow: '4px 4px 0px #888, inset 0 0 0 2px #fff, inset 0 0 0 3px #aaa',
        imageRendering: 'pixelated'
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
              background: '#e8e8e8',
              border: '2px solid #aaa',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              color: '#666'
            }}
          >
            {emotion}
          </div>
        )}
      </div>
      <div
        style={{
          color: '#222',
          fontSize: 13,
          lineHeight: 1.4,
          wordBreak: 'break-word',
          fontFamily: '"MS Gothic", "ＭＳ ゴシック", monospace'
        }}
      >
        {text || '...'}
      </div>
    </div>
  )
}
