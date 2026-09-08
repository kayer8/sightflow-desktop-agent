import * as assert from 'node:assert/strict'
import { getTestAutoAddPhone, normalizeAutoAddFriendsSettings, parseAutoAddPhones } from './auto-add-friends'

assert.deepEqual(parseAutoAddPhones('{"phones":["13800138000"," 13800138000 ","+8613900139000"]}'), [
  '13800138000',
  '+8613900139000'
])
assert.deepEqual(parseAutoAddPhones('{"phones":[]}'), [])
assert.deepEqual(parseAutoAddPhones('{"phones":["bad","123"]}'), [])
assert.deepEqual(parseAutoAddPhones('not-json'), [])

assert.deepEqual(
  normalizeAutoAddFriendsSettings({
    enabled: true,
    phonesJson: '{"phones":["13800138000"]}',
    intervalSeconds: 2
  }),
  {
    enabled: true,
    phonesJson: '{"phones":["13800138000"]}',
    intervalSeconds: 20
  }
)

assert.equal(normalizeAutoAddFriendsSettings({ intervalMinutes: 1 } as any).intervalSeconds, 60)

assert.equal(getTestAutoAddPhone('{"phones":["13800138000","13900139000"]}'), '13800138000')
assert.equal(getTestAutoAddPhone('{"phones":[]}'), null)

console.log('auto-add-friends tests passed')
