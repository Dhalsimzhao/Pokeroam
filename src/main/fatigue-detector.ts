import { FATIGUE_ACTIVE_MINUTES, FATIGUE_BREAK_MINUTES } from '../shared/constants'

export class FatigueDetector {
  private activeStart: number | null = null
  private lastKeyTime = 0
  private warned = false

  onKeystroke(): void {
    const now = Date.now()
    // If enough idle time has passed, reset the session
    if (now - this.lastKeyTime > FATIGUE_BREAK_MINUTES * 60_000) {
      this.activeStart = now
      this.warned = false
    }
    if (!this.activeStart) this.activeStart = now
    this.lastKeyTime = now
  }

  /** Returns true if a fatigue warning should be shown. */
  check(): boolean {
    if (this.warned || !this.activeStart) return false
    const activeMinutes = (Date.now() - this.activeStart) / 60_000
    if (activeMinutes >= FATIGUE_ACTIVE_MINUTES) {
      this.warned = true
      return true
    }
    return false
  }
}
