import * as assert from 'node:assert/strict'
import { createHumanLikePath, getMouseMovementDelayMs } from './mouse-movement'

const path = createHumanLikePath(
  { x: 10, y: 20 },
  { x: 510, y: 320 },
  { minSteps: 20, maxSteps: 60, random: () => 0.75 }
)

assert.ok(path.length >= 20)
assert.deepEqual(path.at(-1), { x: 510, y: 320 })
assert.ok(path.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)))

const movementDelays = [
  getMouseMovementDelayMs(0, 8, () => 0),
  getMouseMovementDelayMs(0.5, 8, () => 0.5),
  getMouseMovementDelayMs(1, 8, () => 1)
]

assert.ok(movementDelays.every((delayMs) => delayMs >= 5 && delayMs <= 100))
assert.ok(movementDelays.every((delayMs) => delayMs < 1000))

console.log('mouse-movement tests passed')
