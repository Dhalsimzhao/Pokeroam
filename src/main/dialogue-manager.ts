import { BrowserWindow, screen } from 'electron'
import type { DialogueEventType } from '../shared/types'
import { getDialogue, resolveDialogueText } from '../shared/dialogue-data'

const DIALOGUE_WIDTH = 300
const DIALOGUE_HEIGHT = 100
const AUTO_CLOSE_MS = 4000
const FADE_OUT_MS = 300

export class DialogueManager {
  private dialogueWindow: BrowserWindow
  private petWindow: BrowserWindow
  private autoCloseTimer: ReturnType<typeof setTimeout> | null = null
  private hideTimer: ReturnType<typeof setTimeout> | null = null

  constructor(dialogueWindow: BrowserWindow, petWindow: BrowserWindow) {
    this.dialogueWindow = dialogueWindow
    this.petWindow = petWindow
  }

  showDialogue(speciesName: string, eventType: DialogueEventType): void {
    // Cancel any pending timers
    this.clearTimers()

    const lookupName = speciesName.toLowerCase()
    const entry = getDialogue(lookupName, eventType)
    const text = resolveDialogueText(entry.text, { name: speciesName })

    // Position dialogue above pet
    const [petX, petY] = this.petWindow.getPosition()
    const { workArea } = screen.getPrimaryDisplay()

    let x = petX + 64 - Math.floor(DIALOGUE_WIDTH / 2)
    let y = petY - DIALOGUE_HEIGHT - 8

    // Clamp to work area
    x = Math.max(workArea.x, Math.min(x, workArea.x + workArea.width - DIALOGUE_WIDTH))
    y = Math.max(workArea.y, Math.min(y, workArea.y + workArea.height - DIALOGUE_HEIGHT))

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
    }, FADE_OUT_MS)
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
