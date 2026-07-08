# OpenAI-Compatible AI Config Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the desktop agent configurable for OpenAI-compatible `baseURL`, `apiKey`, and `model`, defaulting to OpenAI `gpt-5.5` while preserving Ark compatibility.

**Architecture:** Extend the existing `vision` settings object with `baseURL` and `model`. Route all core AI calls, VLM devices, test connection, memory learning, and built-in provider startup through that settings object. Keep the existing provider bundle shape, but let it honor provider config values.

**Tech Stack:** Electron, React, TypeScript, Node built-in test runner, ts-node.

---

### Task 1: Request Payload Behavior

**Files:**
- Modify: `src/core/ai-client.ts`
- Test: `src/core/ai-client-config.test.ts`

- [ ] Add a failing test proving OpenAI-compatible requests omit provider-specific `thinking`.
- [ ] Add a failing test proving Ark-compatible requests keep `thinking: { type: "disabled" }`.
- [ ] Extract a small request builder from `AIClient` and make the tests pass.

### Task 2: Settings Data Flow

**Files:**
- Modify: `src/main/index.ts`
- Modify: `src/core/device.ts`
- Modify: `src/core/rpa-device.ts`
- Modify: `src/core/mock-device.ts`
- Modify: `src/core/box-select-device.ts`
- Modify: `src/core/rpa/tests/test-vlm-parallel.ts`

- [ ] Extend `vision` settings to include `baseURL` and `model`.
- [ ] Preserve legacy saved API keys while defaulting new installs to OpenAI.
- [ ] Pass the full AI config into `AIClient` for connection tests, memory learning, VLM layout measurement, and runtime device updates.

### Task 3: UI and Built-In Provider

**Files:**
- Modify: `src/renderer/src/App.tsx`
- Modify: `src/renderer/src/i18n.ts`
- Modify: `resources/providers/volcengine-ark/provider.bundle.js`
- Modify: `resources/providers/volcengine-ark/manifest.json`

- [ ] Make Base URL and model editable in the base settings panel.
- [ ] Default built-in provider fields to OpenAI-compatible values.
- [ ] Make the provider bundle honor `baseURL` and omit Ark-only fields for OpenAI.

### Task 4: Verification

**Commands:**
- `npx ts-node src/core/ai-client-config.test.ts`
- `npm run typecheck`
- Restart `npm run dev` and confirm Electron stays running.
