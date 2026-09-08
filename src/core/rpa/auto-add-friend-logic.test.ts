import * as assert from 'node:assert/strict'
import { getAutoAddStepSequence, isBBoxValidForAutoAddStep, selectAutoAddBBox } from './auto-add-friend-logic'

assert.deepEqual(getAutoAddStepSequence(), [
  '通讯录',
  '新的联系人',
  '顶部添加',
  '搜索结果添加',
  '发送'
])

assert.equal(
  isBBoxValidForAutoAddStep('顶部添加', [940, 20, 980, 55]),
  true
)

assert.equal(
  isBBoxValidForAutoAddStep('搜索结果添加', [780, 550, 810, 585]),
  true
)

// The result-row action must not accept the page-level top-right action.
assert.equal(
  isBBoxValidForAutoAddStep('搜索结果添加', [940, 20, 980, 55]),
  false
)

assert.deepEqual(
  selectAutoAddBBox('搜索结果添加', [
    [940, 20, 980, 55],
    [780, 550, 810, 585]
  ]),
  [780, 550, 810, 585]
)

console.log('auto-add-friend-logic tests passed')
