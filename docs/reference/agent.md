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
| `geofence` | `GeofenceConfig` | `undefined` | Regional access restriction |
| `labels` | `Labels` | `undefined` | Custom key-value labels (returned in callbacks) |
| `rtc` | `RtcConfig` | `undefined` | RTC media encryption |
| `fillerWords` | `FillerWordsConfig` | `undefined` | Filler words while waiting for LLM |

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

Configure turn detection. Use `config.start_of_speech` and `config.end_of_speech` for the preferred SOS/EOS model.

### `withInstructions(instructions: string): Agent<TTSSampleRate>`

Override the system prompt.

### `withGreeting(greeting: string): Agent<TTSSampleRate>`

Override the greeting message.

### `withName(name: string): Agent<TTSSampleRate>`

Override the agent name.

### `withSal(config: SalConfig): Agent<TTSSampleRate>`

Set SAL (Selective Attention Locking) configuration.

### `withAdvancedFeatures(features: AdvancedFeatures): Agent<TTSSampleRate>`

Set advanced features (e.g. `enable_mllm`, `enable_rtm`).

### `withParameters(parameters: SessionParams): Agent<TTSSampleRate>`

Set session parameters (silence config, farewell config, data channel, etc.).

### `withFailureMessage(message: string): Agent<TTSSampleRate>`

Set the message spoken via TTS when the LLM call fails.

### `withMaxHistory(maxHistory: number): Agent<TTSSampleRate>`

Set the maximum conversation history length.

### `withGeofence(geofence: GeofenceConfig): Agent<TTSSampleRate>`

Set geofence configuration (restricts backend server regions).

### `withLabels(labels: Labels): Agent<TTSSampleRate>`

Set custom labels (key-value pairs returned in notification callbacks).

### `withRtc(rtc: RtcConfig): Agent<TTSSampleRate>`

Set RTC configuration.

### `withFillerWords(fillerWords: FillerWordsConfig): Agent<TTSSampleRate>`

Set filler words configuration (played while waiting for LLM response).

## Getter properties

| Property | Type | Description |
|---|---|---|
| `name` | `string \| undefined` | The agent name |
| `llm` | `LlmConfig \| undefined` | LLM config (set via `withLlm`) |
| `tts` | `TtsConfig \| undefined` | TTS config (set via `withTts`) |
| `stt` | `SttConfig \| undefined` | STT config (set via `withStt`) |
| `mllm` | `MllmConfig \| undefined` | MLLM config (set via `withMllm`) |
| `avatar` | `AvatarConfig \| undefined` | Avatar config (set via `withAvatar`) |
| `turnDetection` | `TurnDetectionConfig \| undefined` | Turn detection config |
| `instructions` | `string \| undefined` | System prompt |
| `greeting` | `string \| undefined` | Greeting message |
| `failureMessage` | `string \| undefined` | Message spoken when LLM fails |
| `maxHistory` | `number \| undefined` | Max conversation history length |
| `sal` | `SalConfig \| undefined` | SAL configuration |
| `advancedFeatures` | `AdvancedFeatures \| undefined` | Advanced features |
| `parameters` | `SessionParams \| undefined` | Session parameters |
| `geofence` | `GeofenceConfig \| undefined` | Geofence configuration |
| `labels` | `Labels \| undefined` | Custom labels |
| `rtc` | `RtcConfig \| undefined` | RTC configuration |
| `fillerWords` | `FillerWordsConfig \| undefined` | Filler words configuration |
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
| `token` | `string` | No | Pre-built RTC+RTM token (omit to auto-generate) |
| `expiresIn` | `number` | No | Token lifetime in seconds (default: `86400` = 24 h, Agora max). Only applies when the token is auto-generated. Use `ExpiresIn.hours()` or `ExpiresIn.minutes()` for clarity. Valid range: 1–86400. |
| `idleTimeout` | `number` | No | Seconds before auto-exit if no audio (0 = disabled) |
| `enableStringUid` | `boolean` | No | Use string UIDs instead of numeric |
| `debug` | `boolean` | No | Log API requests to console |

## `toProperties(opts): StartAgentsRequest.Properties`

Low-level method to convert the agent config to the Fern request format. Used internally by `AgentSession.start()`. You typically don't need to call this directly unless building custom request bodies.
