import { BrowserWindow, screen } from 'electron'
import type { DialogueEventType } from '../shared/types'
import { getDialogue, resolveDialogueText } from '../shared/dialogue-data'
import { PET_WINDOW_SIZE } from '../shared/constants'

const DIALOGUE_WIDTH = 300
const DIALOGUE_HEIGHT = 100
const AUTO_CLOSE_MS = 4000
const FADE_OUT_MS = 300
const GAP_ABOVE_SPRITE = 8

interface SpriteBounds {
  x: number
  y: number
  width: number
  height: number
}

export class DialogueManager {
  private dialogueWindow: BrowserWindow
  private petWindow: BrowserWindow
  private autoCloseTimer: ReturnType<typeof setTimeout> | null = null
  private hideTimer: ReturnType<typeof setTimeout> | null = null
  private visible = false
  // Sprite rect in pet-window client coords. Renderer pushes this via
  // update-hit-regions; we anchor the dialogue to the sprite's actual top
  // instead of the pet window's top so the bubble sits right above the head
  // regardless of how much transparent padding the current animation uses.
  private spriteBounds: SpriteBounds | null = null

  constructor(dialogueWindow: BrowserWindow, petWindow: BrowserWindow) {
    this.dialogueWindow = dialogueWindow
    this.petWindow = petWindow
  }

  setSpriteBounds(bounds: SpriteBounds | null): void {
    this.spriteBounds = bounds
    if (this.visible) this.updatePosition()
  }

  private computePosition(): { x: number; y: number } {
    const [petX, petY] = this.petWindow.getPosition()
    const { workArea } = screen.getPrimaryDisplay()

    // Fall back to window center if the renderer hasn't reported bounds yet.
    const b = this.spriteBounds ?? {
      x: 0,
      y: 0,
      width: PET_WINDOW_SIZE,
      height: PET_WINDOW_SIZE
    }
    const spriteCenterX = petX + b.x + b.width / 2
    const spriteTopY = petY + b.y

    let x = Math.round(spriteCenterX - DIALOGUE_WIDTH / 2)
    let y = Math.round(spriteTopY - DIALOGUE_HEIGHT - GAP_ABOVE_SPRITE)

    x = Math.max(workArea.x, Math.min(x, workArea.x + workArea.width - DIALOGUE_WIDTH))
    y = Math.max(workArea.y, Math.min(y, workArea.y + workArea.height - DIALOGUE_HEIGHT))

    return { x, y }
  }

  showDialogue(speciesName: string, eventType: DialogueEventType): void {
    // Cancel any pending timers
    this.clearTimers()

    const lookupName = speciesName.toLowerCase()
    const entry = getDialogue(lookupName, eventType)
    const text = resolveDialogueText(entry.text, { name: speciesName })

    const { x, y } = this.computePosition()
    this.dialogueWindow.setBounds({
      x,
      y,
      width: DIALOGUE_WIDTH,
      height: DIALOGUE_HEIGHT
    })

    this.dialogueWindow.webContents.send('dialogue-show', {
      speciesName: lookupName,
      emotion: entry.emotion,
      text
    })

    this.dialogueWindow.show()
    this.dialogueWindow.setAlwaysOnTop(true, 'screen-saver')
    this.visible = true

    // Auto-close after delay
    this.autoCloseTimer = setTimeout(() => {
      this.hideDialogue()
    }, AUTO_CLOSE_MS)
  }

  hideDialogue(): void {
    this.clearTimers()

    this.dialogueWindow.webContents.send('dialogue-hide')

    // Wait for fade-out animation before hiding window
    this.hideTimer = setTimeout(() => {
      this.dialogueWindow.hide()
      this.hideTimer = null
      this.visible = false
    }, FADE_OUT_MS)
  }

  updatePosition(): void {
    if (!this.visible) return

    const { x, y } = this.computePosition()
    this.dialogueWindow.setBounds({
      x,
      y,
      width: DIALOGUE_WIDTH,
      height: DIALOGUE_HEIGHT
    })
  }

  private clearTimers(): void {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer)
      this.autoCloseTimer = null
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
      // If we're canceling a hide animation, hide immediately for the new dialogue
      this.dialogueWindow.hide()
    }
  }
}
