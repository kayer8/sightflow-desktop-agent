export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 为真实 UI 操作生成非零等待时间。
 * 80% 取 0-2000ms 偏移，20% 取 3000-5000ms 偏移；增减方向各 50%。
 */
export function randomizeUiWaitMs(baseMs: number): number {
  const base = Number.isFinite(baseMs) ? baseMs : 0
  const offset = Math.random() < 0.8
    ? Math.random() * 2000
    : 3000 + Math.random() * 2000
  const signedOffset = Math.random() < 0.5 ? -offset : offset
  return Math.max(1, Math.round(Math.abs(base + signedOffset)))
}

export const randomDelay = (ms: number) => delay(randomizeUiWaitMs(ms + Math.random() * 20 - 10))
export const randomDelayIn = (min: number, max: number) =>
  delay(randomizeUiWaitMs(min + Math.random() * (max - min)))

export function getRobot() {
  try {
    // We use runtime require to prevent Vite/Webpack from attempting to eagerly bundle
    // native C++ add-ons which can cause build failures or crash the main process on load.
    return require('@hurdlegroup/robotjs')
  } catch (err: any) {
    console.error('Failed to load @hurdlegroup/robotjs. Core RPA functions will not work.', err.message)
    return null
  }
}
