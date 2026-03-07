---
sidebar_position: 2
title: Agent
description: Full API reference for the Agent builder class.
---

# Agent Reference

```typescript
import { Agent } from 'agora-agent-sdk';
```

## Constructor

```typescript
new Agent<TTSSampleRate extends number = number>(options?: AgentOptions)
```

### AgentOptions

| Option | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `undefined` | Agent name (used as default session name) |
| `instructions` | `string` | `undefined` | System prompt injected as a system message to the LLM |
| `greeting` | `string` | `undefined` | First message spoken when the session starts |
| `failureMessage` | `string` | `undefined` | Message spoken when an LLM call fails |
| `maxHistory` | `number` | `undefined` | Max conversation turns kept in LLM context |
| `turnDetection` | `TurnDetectionConfig` | `undefined` | Voice activity detection settings |
| `sal` | `SalConfig` | `undefined` | Selective Attention Locking configuration |
| `avatar` | `AvatarConfig` | `undefined` | Avatar configuration |
| `advancedFeatures` | `AdvancedFeatures` | `undefined` | Enable MLLM mode, AI-VAD, etc. |
| `parameters` | `SessionParams` | `undefined` | Session parameters (silence config, farewell config) |

## Builder methods

All methods return a **new** `Agent` instance. The original is never modified.

### `withLlm(vendor: BaseLLM): Agent<TTSSampleRate>`

Set the LLM vendor. Pass an instance of `OpenAI`, `AzureOpenAI`, `Anthropic`, or `Gemini`.

### `withTts<SR extends number>(vendor: BaseTTS<SR>): Agent<SR>`

Set the TTS vendor. The sample rate type `SR` is captured and tracked for avatar compatibility.

### `withStt(vendor: BaseSTT): Agent<TTSSampleRate>`

Set the STT vendor. Pass an instance of any STT class (`DeepgramSTT`, `SpeechmaticsSTT`, etc.).

### `withMllm(vendor: BaseMLLM): Agent<TTSSampleRate>`

Set the MLLM vendor for multimodal mode. Pass `OpenAIRealtime` or `VertexAI`.

### `withAvatar<RequiredSR extends number>(this: Agent<RequiredSR>, vendor: BaseAvatar<RequiredSR>): Agent<RequiredSR>`

Set the avatar vendor. The `this` constraint enforces that the Agent's TTS sample rate matches the avatar's required rate at compile time.

### `withTurnDetection(config: TurnDetectionConfig): Agent<TTSSampleRate>`

Configure turn detection (type, interrupt mode, eagerness).

### `withInstructions(instructions: string): Agent<TTSSampleRate>`

Override the system prompt.

### `withGreeting(greeting: string): Agent<TTSSampleRate>`

Override the greeting message.

### `withName(name: string): Agent<TTSSampleRate>`

Override the agent name.

## Getter properties

| Property | Type | Description |
|---|---|---|
| `name` | `string \| undefined` | The agent name |
| `llm` | `LlmConfig \| undefined` | LLM config (set via `withLlm`) |
| `tts` | `TtsConfig \| undefined` | TTS config (set via `withTts`) |
| `stt` | `SttConfig \| undefined` | STT config (set via `withStt`) |
| `mllm` | `MllmConfig \| undefined` | MLLM config (set via `withMllm`) |
| `turnDetection` | `TurnDetectionConfig \| undefined` | Turn detection config |
| `instructions` | `string \| undefined` | System prompt |
| `greeting` | `string \| undefined` | Greeting message |
| `config` | `AgentOptions` | Full read-only configuration snapshot |

## `createSession(client, options): AgentSession`

Creates a new `AgentSession` bound to the given client and channel.

```typescript
createSession(
  client: AgoraClient & { readonly appId: string; readonly appCertificate?: string },
  options: SessionOptions,
): AgentSession
```

### SessionOptions

| Option | Type | Required | Description |
|---|---|---|---|
| `channel` | `string` | Yes | Channel name to join |
| `agentUid` | `string` | Yes | The agent's RTC UID |
| `remoteUids` | `string[]` | Yes | Remote user UIDs to subscribe to |
| `name` | `string` | No | Session name (defaults to agent name or `agent-{timestamp}`) |
| `token` | `string` | No | Pre-built RTC token (omit to auto-generate) |
| `idleTimeout` | `number` | No | Seconds before auto-exit if no audio (0 = disabled) |
| `enableStringUid` | `boolean` | No | Use string UIDs instead of numeric |
| `debug` | `boolean` | No | Log API requests to console |

## `toProperties(opts): StartAgentsRequest.Properties`

Low-level method to convert the agent config to the Fern request format. Used internally by `AgentSession.start()`. You typically don't need to call this directly unless building custom request bodies.
