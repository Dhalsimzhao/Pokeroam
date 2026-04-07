import { GlobalKeyboardListener } from 'node-global-key-listener'
import { KEYBOARD_XP_COOLDOWN_MS } from '../shared/constants'

export class KeyboardMonitor {
  private listener: GlobalKeyboardListener | null = null
  private lastXpTime = 0

  start(onKeystroke: () => void): void {
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
  }

  stop(): void {
    this.listener?.kill()
    this.listener = null
  }
}
