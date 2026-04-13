/**
 * Debug script: launches PokéRoam via Playwright's Electron support,
 * monitors pet window dimensions and BrowserWindow bounds.
 *
 * Usage: node scripts/debug-pet-physics.mjs
 * Prerequisites: pnpm build
 */
import { _electron as electron } from 'playwright'
import { setTimeout } from 'timers/promises'

const app = await electron.launch({
  executablePath: './node_modules/.bin/electron',
  args: ['.'],
  cwd: process.cwd()
})

console.log('App launched, waiting for windows...')
await setTimeout(3000)

const windows = app.windows()
let petPage = null
for (const w of windows) {
  const title = await w.title()
  if (title.includes('Pet')) petPage = w
}
if (!petPage) petPage = windows[0]

console.log('\n--- Monitoring pet window (20s) ---\n')
console.log('time | innerW | docW | bodyW | rootW | BW-bounds')

for (let i = 0; i < 20; i++) {
  try {
    const domData = await petPage.evaluate(() => ({
      innerW: window.innerWidth,
      innerH: window.innerHeight,
      docW: document.documentElement.scrollWidth,
      bodyW: document.body.scrollWidth,
      rootW: document.getElementById('root')?.scrollWidth ?? 0,
      // Check if any child overflows
      rootChildren: Array.from(document.getElementById('root')?.children ?? []).map(c => ({
        tag: c.tagName,
        scrollW: c.scrollWidth,
        clientW: c.clientWidth,
        offsetW: c.offsetWidth
      }))
    }))

    // Get BrowserWindow bounds via Electron API
    const bwBounds = await app.evaluate(({ BrowserWindow }) => {
      const wins = BrowserWindow.getAllWindows()
      return wins.map(w => ({ title: w.getTitle(), bounds: w.getBounds(), contentSize: w.getContentSize() }))
    })
    const petBW = bwBounds.find(b => b.title.includes('Pet'))

    console.log(
      `[${String(i).padStart(2)}s] inner:${domData.innerW}x${domData.innerH} doc:${domData.docW} body:${domData.bodyW} root:${domData.rootW}` +
      ` | BW:${petBW?.bounds.width}x${petBW?.bounds.height} content:${petBW?.contentSize?.[0]}x${petBW?.contentSize?.[1]}` +
      ` | children: ${domData.rootChildren.map(c => `${c.tag}(scroll:${c.scrollW} client:${c.clientW} offset:${c.offsetW})`).join(', ')}`
    )
  } catch (e) {
    console.log(`[${i}s] Error: ${e.message}`)
  }
  await setTimeout(1000)
}

console.log('\nDone.')
await app.close()
