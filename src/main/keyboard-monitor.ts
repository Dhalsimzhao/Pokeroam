import { GlobalKeyboardListener } from 'node-global-key-listener'
import { KEYBOARD_XP_COOLDOWN_MS } from '../shared/constants'

export class KeyboardMonitor {
  private listener: GlobalKeyboardListener | null = null
  private lastXpTime = 0

  start(onKeystroke: () => void): void {
    try {
      // Catch unhandled rejections from the native key server spawn
      const onUnhandled = (reason: unknown): void => {
        console.warn('Keyboard monitor native server failed:', reason)
        this.listener = null
        process.removeListener('unhandledRejection', onUnhandled)
      }
      process.on('unhandledRejection', onUnhandled)

      this.listener = new GlobalKeyboardListener()
      this.listener.addListener((e) => {
        if (e.state === 'DOWN') {
          const now = Date.now()
          if (now - this.lastXpTime >= KEYBOARD_XP_COOLDOWN_MS) {
            this.lastXpTime = now
            onKeystroke()
          }
        }
      })

      // Remove the safety net after a short delay (spawn happens quickly)
      setTimeout(() => process.removeListener('unhandledRejection', onUnhandled), 3000)
    } catch (err) {
      console.warn('Failed to start keyboard monitor:', err)
      this.listener = null
    }
  }

  stop(): void {
    try {
      this.listener?.kill()
    } catch {
      // Ignore errors during cleanup
    }
    this.listener = null
  }
}
