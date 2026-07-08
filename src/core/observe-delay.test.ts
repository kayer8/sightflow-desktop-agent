import * as assert from 'node:assert/strict'
import {
  GenericChannelSession,
  OBSERVE_SCREENSHOT_DELAY_MS,
  createInitialGenericChannelState
} from './generic-channel-session'
import { DesktopDevice } from './device'
import { ChannelContext, ProviderEvent } from './session-types'

const calls: string[] = []
const timeouts: number[] = []

const device: DesktopDevice = {
  setAppType: () => undefined,
  setApiKey: () => undefined,
  measureLayout: async () => ({ success: true }),
  screenshot: async () => {
    calls.push('screenshot')
    return 'data:image/png;base64,test'
  },
  hasUnreadMessage: async () => ({ hasUnread: false }),
  isChatContactUnread: async () => ({ isUnread: false }),
  clearUnreadCache: () => undefined,
  setChatBaseline: async () => true,
  hasChatAreaChanged: async () => ({ hasDiff: false, hasBaseline: false }),
  clearChatBaseline: () => undefined,
  sendMessage: async () => undefined,
  activeUnreadByClick: async () => undefined,
  clickUnreadContact: async () => undefined,
  clickAt: async () => undefined
}

async function* noProviderEvents(): AsyncIterable<ProviderEvent> {}

const ctx: ChannelContext<ReturnType<typeof createInitialGenericChannelState>> = {
  appType: 'wechat',
  state: createInitialGenericChannelState(),
  host: {
    enqueue: () => undefined,
    schedule: () => undefined,
    runProvider: () => noProviderEvents(),
    log: () => undefined,
    trace: () => undefined,
    isRunning: () => true,
    stopSession: async () => undefined
  }
}

async function main(): Promise<void> {
  const originalSetTimeout = globalThis.setTimeout

  globalThis.setTimeout = ((handler: (...args: unknown[]) => void, timeout?: number) => {
    timeouts.push(Number(timeout))
    handler()
    return 0 as any
  }) as typeof setTimeout

  try {
    const session = new GenericChannelSession(device)
    await session.onEvent({ type: 'observe_chat' }, ctx)
  } finally {
    globalThis.setTimeout = originalSetTimeout
  }

  assert.equal(timeouts[0], OBSERVE_SCREENSHOT_DELAY_MS)
  assert.deepEqual(calls, ['screenshot'])

  console.log('observe-delay tests passed')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
