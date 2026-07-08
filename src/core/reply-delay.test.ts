import * as assert from 'node:assert/strict'
import { calculateRemainingReplyDelayMs, calculateReplyDelayMs } from './generic-channel-session'

assert.equal(calculateReplyDelayMs('好'), 2000)
assert.equal(calculateReplyDelayMs('测'.repeat(20)), 2400)
assert.equal(calculateReplyDelayMs('测'.repeat(50)), 4200)
assert.equal(calculateReplyDelayMs('很长'.repeat(200)), 12000)

assert.equal(calculateRemainingReplyDelayMs('测'.repeat(50), 1000, 2500), 2700)
assert.equal(calculateRemainingReplyDelayMs('测'.repeat(50), 1000, 6000), 0)

console.log('reply-delay tests passed')
