import { useEffect, useRef, useState } from 'react'
import type { SpriteSheetConfig } from '../../../shared/types'

interface SpriteCanvasProps {
  spriteConfig: SpriteSheetConfig
  frameIndex: number
  facingLeft: boolean
  scale?: number
}

export function SpriteCanvas({
  spriteConfig,
  frameIndex,
  facingLeft,
  scale = 2
}: SpriteCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  const displayWidth = spriteConfig.frameWidth * scale
  const displayHeight = spriteConfig.frameHeight * scale

  // Load sprite sheet image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setImage(img)
    img.src = spriteConfig.src
    return () => {
      img.onload = null
    }
  }, [spriteConfig.src])

  // Draw current frame
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, displayWidth, displayHeight)
    ctx.imageSmoothingEnabled = false

    const sx = frameIndex * spriteConfig.frameWidth
    const sy = (spriteConfig.row ?? 0) * spriteConfig.frameHeight

    ctx.save()
    if (facingLeft) {
      ctx.scale(-1, 1)
      ctx.drawImage(
        image,
        sx, sy, spriteConfig.frameWidth, spriteConfig.frameHeight,
        -displayWidth, 0, displayWidth, displayHeight
      )
    } else {
      ctx.drawImage(
        image,
        sx, sy, spriteConfig.frameWidth, spriteConfig.frameHeight,
        0, 0, displayWidth, displayHeight
      )
    }
    ctx.restore()
  }, [image, frameIndex, facingLeft, spriteConfig, displayWidth, displayHeight])

  return (
    <canvas
      ref={canvasRef}
      width={displayWidth}
      height={displayHeight}
      style={{
        width: displayWidth,
        height: displayHeight,
        imageRendering: 'pixelated'
      }}
    />
  )
}
