---
sidebar_position: 2
title: Agent
description: The Agent builder — configure an AI agent with LLM, TTS, STT, and more.
---

# Agent

`Agent` is an immutable configuration object. Every builder method returns a **new** `Agent` instance — the original is never modified. This makes agents safe to reuse across multiple sessions.

## Constructor options

<!-- snippet: executable -->
```typescript
import { Agent, OpenAI } from 'agora-agents';

const agent = new Agent({ name: 'my-assistant' }).withLlm(
  new OpenAI({
    apiKey: 'your-openai-key',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    systemMessages: [{ role: 'system', content: 'You are a helpful voice assistant.' }],
    greetingMessage: 'Hello! How can I help?',
    maxHistory: 20,
  }),
);
```

| Option | Type | Description |
|---|---|---|
| `name` | `string` | Agent name (used as default session name) |
| `instructions` | `string` | Deprecated. Use LLM vendor `systemMessages` instead. |
| `greeting` | `string` | Deprecated. Use LLM/MLLM vendor `greetingMessage` instead. |
| `failureMessage` | `string` | Deprecated. Use LLM/MLLM vendor `failureMessage` instead. |
| `maxHistory` | `number` | Deprecated. Use LLM vendor `maxHistory` instead. |
| `turnDetection` | `TurnDetectionConfig` | Interaction language and voice activity detection settings |
| `sal` | `SalConfig` | Selective Attention Locking configuration |
| `avatar` | `AvatarConfig` | Avatar configuration (prefer `withAvatar()` for type safety) |
| `advancedFeatures` | `AdvancedFeatures` | Enable MLLM mode, AI-VAD, etc. |
| `parameters` | `SessionParams` | Session parameters (silence config, farewell config) |
| `geofence` | `GeofenceConfig` | Regional access restriction |
| `labels` | `Labels` | Custom key-value labels (returned in callbacks) |
| `rtc` | `RtcConfig` | RTC media encryption |
| `fillerWords` | `FillerWordsConfig` | Filler words while waiting for LLM |

## Builder methods

Each method returns a new `Agent` instance with the updated configuration.

| Method | Signature | Description |
|---|---|---|
| `withLlm` | `withLlm(vendor: BaseLLM): Agent` | Set the LLM vendor |
| `withTts` | `withTts<SR>(vendor: BaseTTS<SR>): Agent<SR>` | Set the TTS vendor (tracks sample rate type) |
| `withStt` | `withStt(vendor: BaseSTT): Agent` | Set the STT vendor |
| `withMllm` | `withMllm(vendor: BaseMLLM): Agent` | Set the MLLM vendor (for multimodal flow). Not compatible with `withAvatar()`. |
| `withAvatar` | `withAvatar<SR>(vendor: BaseAvatar<SR>): Agent` | Set the avatar vendor (enforces TTS sample rate match). Requires the cascading pipeline; not supported with `withMllm()`. |
| `withTurnDetection` | `withTurnDetection(config: TurnDetectionConfig): Agent` | Configure `turn_detection.language` and cascading-flow SOS/EOS detection; use `withInterruption()` for interruption behavior |
| `withInstructions` | `withInstructions(text: string): Agent` | Deprecated. Use LLM vendor `systemMessages` instead. |
| `withGreeting` | `withGreeting(text: string): Agent` | Deprecated. Use LLM/MLLM vendor `greetingMessage` instead. |
| `withName` | `withName(name: string): Agent` | Override the agent name |
| `withSal` | `withSal(config: SalConfig): Agent` | Set SAL configuration |
| `withAdvancedFeatures` | `withAdvancedFeatures(features: AdvancedFeatures): Agent` | Set advanced features |
| `withParameters` | `withParameters(parameters: SessionParams): Agent` | Set session parameters |
| `withFailureMessage` | `withFailureMessage(message: string): Agent` | Deprecated. Use LLM/MLLM vendor `failureMessage` instead. |
| `withMaxHistory` | `withMaxHistory(maxHistory: number): Agent` | Deprecated. Use LLM vendor `maxHistory` instead. |
| `withGeofence` | `withGeofence(geofence: GeofenceConfig): Agent` | Set geofence configuration |
| `withLabels` | `withLabels(labels: Labels): Agent` | Set custom labels |
| `withRtc` | `withRtc(rtc: RtcConfig): Agent` | Set RTC configuration |
| `withFillerWords` | `withFillerWords(fillerWords: FillerWordsConfig): Agent` | Set filler words configuration |

## Creating a session

Call `createSession()` to bind the agent to a client and channel:

<!-- snippet: fragment -->
```typescript
const session = agent.createSession(client, {
  channel: 'room-123',
  agentUid: '1',
  remoteUids: ['100'],
  idleTimeout: 120,
});
```

### SessionOptions

| Option | Type | Required | Description |
|---|---|---|---|
| `channel` | `string` | Yes | Channel name to join |
| `agentUid` | `string` | Yes | The agent's RTC UID |
| `remoteUids` | `string[]` | Yes | Remote user UIDs to subscribe to |
| `name` | `string` | No | Session name (defaults to agent name or auto-generated) |
| `token` | `string` | No | Pre-built RTC token (omit to auto-generate) |
| `idleTimeout` | `number` | No | Seconds before auto-exit if no audio (0 = disabled) |
| `enableStringUid` | `boolean` | No | Use string UIDs instead of numeric |
| `debug` | `boolean` | No | Log API requests to console |

## Immutable reuse

Because every method returns a new instance, you can create a base agent and derive variations:

<!-- snippet: executable -->
```typescript
import { Agent, OpenAI, ElevenLabsTTS, DeepgramSTT } from 'agora-agents';

const base = new Agent()
  .withLlm(new OpenAI({
    apiKey: 'your-openai-key',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    systemMessages: [{ role: 'system', content: 'You are helpful.' }],
  }))
  .withTts(new ElevenLabsTTS({ key: 'your-elevenlabs-key', modelId: 'eleven_flash_v2_5', voiceId: 'your-voice-id', baseUrl: 'wss://api.elevenlabs.io/v1', sampleRate: 24000 }))
  .withStt(new DeepgramSTT({ apiKey: 'your-deepgram-key', model: 'nova-2' }));

// Two sessions from the same agent config — safe, no shared mutable state

const sessionA = base.createSession(client, { channel: 'room-a', agentUid: '1', remoteUids: ['100'] });
const sessionB = base.createSession(client, { channel: 'room-b', agentUid: '1', remoteUids: ['200'] });
```

See [Agent Reference](../reference/agent.md) for full TypeScript signatures.
