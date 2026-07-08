import * as assert from 'node:assert/strict'
import { AI_API_TIMEOUT_MS, buildChatCompletionsRequest } from './ai-client'

const messages = [{ role: 'user', content: 'ping' }]

const openaiRequest = buildChatCompletionsRequest({
  baseURL: 'https://api.openai.com/v1',
  model: 'gpt-5.5',
  messages
})

assert.equal(openaiRequest.url, 'https://api.openai.com/v1/chat/completions')
assert.equal(openaiRequest.body.model, 'gpt-5.5')
assert.equal(openaiRequest.body.stream, false)
assert.equal(Object.prototype.hasOwnProperty.call(openaiRequest.body, 'thinking'), false)

const arkRequest = buildChatCompletionsRequest({
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3/',
  model: 'doubao-seed-2-0-lite-260215',
  messages
})

assert.equal(arkRequest.url, 'https://ark.cn-beijing.volces.com/api/v3/chat/completions')
assert.deepEqual(arkRequest.body.thinking, { type: 'disabled' })

assert.equal(AI_API_TIMEOUT_MS, 60_000)

console.log('ai-client-config tests passed')
