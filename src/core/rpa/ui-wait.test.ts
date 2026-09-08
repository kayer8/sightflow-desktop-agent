import * as assert from 'node:assert/strict'
import { randomizeUiWaitMs } from './util'

function withRandomValues(values: number[], callback: () => void): void {
  const originalRandom = Math.random
  let index = 0
  Math.random = () => values[index++] ?? 0
  try {
    callback()
  } finally {
    Math.random = originalRandom
  }
}

withRandomValues([0.1, 0.5, 0.9], () => {
  assert.equal(randomizeUiWaitMs(1000), 2000)
})

withRandomValues([0.9, 0.5, 0.1], () => {
  assert.equal(randomizeUiWaitMs(1000), 3000)
})

withRandomValues([0, 0, 0.5], () => {
  assert.equal(randomizeUiWaitMs(0), 1)
})

console.log('ui-wait tests passed')
