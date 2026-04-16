import { uIOhook } from 'uiohook-napi'
import { KEYBOARD_XP_COOLDOWN_MS } from '../shared/constants'

export class KeyboardMonitor {
  private lastXpTime = 0
  private started = false

  start(onKeystroke: () => void): void {
    try {
      uIOhook.on('keydown', () => {
        const now = Date.now()
        if (now - this.lastXpTime >= KEYBOARD_XP_COOLDOWN_MS) {
          this.lastXpTime = now
          onKeystroke()
        }
      })
      uIOhook.start()
      this.started = true
    } catch (err) {
      console.warn('Failed to start keyboard monitor:', err)
    }
  }

  stop(): void {
    if (this.started) {
      try {
        uIOhook.stop()
      } catch {
        // Ignore cleanup errors
      }
      this.started = false
    }
  }
}
