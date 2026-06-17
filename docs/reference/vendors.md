---
sidebar_position: 4
title: Vendor Reference
description: Constructor options for all LLM, TTS, STT, MLLM, and Avatar vendor classes.
---

# Vendor Reference

All vendor classes are imported from `agora-agents`.

## LLM vendors


### OpenAI

<!-- snippet: fragment -->
```typescript
new OpenAI(options: OpenAIOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | BYOK only | OpenAI API key. Optional for supported Agora-managed OpenAI models. |
| `model` | `string` | Yes | Model name (e.g., `'gpt-4o-mini'`, `'gpt-4'`) |
| `url` | `string` | BYOK only | API endpoint URL. Required when `apiKey` is set. |
| `maxHistory` | `number` | No | Max conversation history to cache |
| `systemMessages` | `Record<string, unknown>[]` | No | System messages for context |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message when LLM call fails |
| `inputModalities` | `string[]` | No | Input modalities (default: `["text"]`) |
| `outputModalities` | `string[]` | No | Output modalities |
| `params` | `Record<string, unknown>` | No | Additional LLM parameters (overrides `model` in params) |
| `headers` | `Record<string, string>` | No | Custom HTTP headers forwarded to the LLM provider |
| `greetingConfigs` | `LlmGreetingConfigs` | No | Greeting playback configuration |
| `templateVariables` | `Record<string, string>` | No | Template variables for messages |

For supported Agora-managed models, `apiKey` is optional:

- `gpt-4o-mini`
- `gpt-4.1-mini`
- `gpt-5-nano`
- `gpt-5-mini`

For those models, omit `apiKey` to use Agora-managed credentials. This option is only available with the default OpenAI endpoint and without a custom vendor hint. If `apiKey` is provided, AgentKit uses BYOK instead.

### AzureOpenAI

<!-- snippet: fragment -->
```typescript
new AzureOpenAI(options: AzureOpenAIOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Azure OpenAI API key |
| `model` | `string` | Yes | Model/deployment name |
| `resourceName` | `string` | Yes | Azure resource name |
| `deploymentName` | `string` | Yes | Deployment name in Azure |
| `apiVersion` | `string` | No | Azure API version (default: `'2024-08-01-preview'`) |
| `maxHistory` | `number` | No | Max conversation history to cache |
| `systemMessages` | `Record<string, unknown>[]` | No | System messages |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message when LLM call fails |
| `inputModalities` | `string[]` | No | Input modalities (default: `["text"]`) |
| `outputModalities` | `string[]` | No | Output modalities |
| `params` | `Record<string, unknown>` | No | Additional LLM parameters |
| `headers` | `Record<string, string>` | No | Custom HTTP headers forwarded to the LLM provider |
| `greetingConfigs` | `LlmGreetingConfigs` | No | Greeting playback configuration |
| `templateVariables` | `Record<string, string>` | No | Template variables for messages |

### Anthropic

<!-- snippet: fragment -->
```typescript
new Anthropic(options: AnthropicOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Anthropic API key |
| `model` | `string` | Yes | Model name (e.g., `'claude-3-5-sonnet-20241022'`) |
| `url` | `string` | Yes | API endpoint URL (for example, `https://api.anthropic.com/v1/messages`) |
| `maxHistory` | `number` | No | Max conversation history to cache |
| `maxTokens` | `number` | Yes | Maximum tokens to generate |
| `headers` | `Record<string, string>` | Yes | Custom HTTP headers forwarded to the LLM provider, including Anthropic API version |
| `systemMessages` | `Record<string, unknown>[]` | No | System messages |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message when LLM call fails |
| `inputModalities` | `string[]` | No | Input modalities (default: `["text"]`) |
| `outputModalities` | `string[]` | No | Output modalities |
| `params` | `Record<string, unknown>` | No | Additional LLM parameters |
| `greetingConfigs` | `LlmGreetingConfigs` | No | Greeting playback configuration |
| `templateVariables` | `Record<string, string>` | No | Template variables for messages |

### Gemini

<!-- snippet: fragment -->
```typescript
new Gemini(options: GeminiOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Google API key |
| `model` | `string` | Yes | Model name (e.g., `'gemini-pro'`) |
| `url` | `string` | No | API endpoint URL (default: `https://generativelanguage.googleapis.com/v1beta/models`) |
| `maxHistory` | `number` | No | Max conversation history to cache |
| `systemMessages` | `Record<string, unknown>[]` | No | System messages |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message when LLM call fails |
| `inputModalities` | `string[]` | No | Input modalities (default: `["text"]`) |
| `outputModalities` | `string[]` | No | Output modalities |
| `params` | `Record<string, unknown>` | No | Additional LLM parameters |
| `headers` | `Record<string, string>` | No | Custom HTTP headers forwarded to the LLM provider |
| `greetingConfigs` | `LlmGreetingConfigs` | No | Greeting playback configuration |
| `templateVariables` | `Record<string, string>` | No | Template variables for messages |

### Other LLM vendors

The SDK also includes named helpers for the remaining Agora-supported LLM providers. These helpers choose the correct request format internally.

| Class | Provider | Key options |
|---|---|---|
| `Groq` | Groq | `apiKey`, `model`, `url` |
| `VertexAILLM` | Google Vertex AI | `apiKey`, `model`, `projectId`, `location`, `url?` |
| `AmazonBedrock` | Amazon Bedrock | `accessKey`, `secretKey`, `region`, `model` |
| `Dify` | Dify | `apiKey`, `url`, `model`, `user?`, `conversationId?` |
| `CustomLLM` | OpenAI-compatible LLM | `apiKey`, `model`, `url` |

---

## TTS vendors

### ElevenLabsTTS

<!-- snippet: fragment -->
```typescript
new ElevenLabsTTS<SR extends ElevenLabsSampleRate>(options: ElevenLabsTTSOptions<SR>)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | Yes | ElevenLabs API key |
| `modelId` | `string` | Yes | Model ID (e.g., `'eleven_flash_v2_5'`) |
| `voiceId` | `string` | Yes | Voice ID |
| `baseUrl` | `string` | Yes | WebSocket base URL |
| `sampleRate` | `16000 \| 22050 \| 24000 \| 44100` | No | Audio sample rate in Hz |
| `optimizeStreamingLatency` | `number` | No | Latency optimization level, 0-4 |
| `stability` | `number` | No | Voice stability, 0.0-1.0 |
| `similarityBoost` | `number` | No | Voice similarity boost, 0.0-1.0 |
| `style` | `number` | No | Voice style exaggeration, 0.0-1.0 |
| `useSpeakerBoost` | `boolean` | No | Enable speaker boost |
| `skipPatterns` | `number[]` | No | Skip patterns for bracketed content |

### MicrosoftTTS

<!-- snippet: fragment -->
```typescript
new MicrosoftTTS<SR extends MicrosoftSampleRate>(options: MicrosoftTTSOptions<SR>)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | Yes | Azure Speech API key |
| `region` | `string` | Yes | Azure region (e.g., `'eastus'`) |
| `voiceName` | `string` | Yes | Voice name (e.g., `'en-US-JennyNeural'`) |
| `sampleRate` | `16000 \| 24000 \| 48000` | No | Audio sample rate in Hz |
| `speed` | `number` | No | Speaking rate multiplier |
| `volume` | `number` | No | Audio volume |
| `skipPatterns` | `number[]` | No | Skip patterns for bracketed content |

### OpenAITTS

<!-- snippet: fragment -->
```typescript
new OpenAITTS(options: OpenAITTSOptions)
```

Fixed at 24kHz — no configurable sample rate.

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | BYOK only | OpenAI API key |
| `voice` | `string` | Yes | Voice name (`'alloy'`, `'echo'`, `'fable'`, `'onyx'`, `'nova'`, `'shimmer'`) |
| `model` | `string` | BYOK only | Model name (e.g., `'tts-1'`, `'tts-1-hd'`) |
| `baseUrl` | `string` | BYOK only | OpenAI TTS endpoint URL |
| `instructions` | `string` | No | Custom instructions for voice style, accent, pace, and tone |
| `speed` | `number` | No | Speech speed multiplier |
| `skipPatterns` | `number[]` | No | Skip patterns for bracketed content |

`apiKey`, `model`, and `baseUrl` are required together for BYOK. `apiKey` is optional only for the Agora-managed `tts-1` path. If omitted with `model: 'tts-1'` or no explicit model, AgentKit sends the matching Agora-managed configuration.

### CartesiaTTS

<!-- snippet: fragment -->
```typescript
new CartesiaTTS<SR extends CartesiaSampleRate>(options: CartesiaTTSOptions<SR>)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Cartesia API key |
| `voiceId` | `string` | Yes | Voice ID (serialized as `{"mode": "id", "id": "..."}`) |
| `modelId` | `string` | Yes | Model ID |
| `baseUrl` | `string` | No | WebSocket URL for the Cartesia streaming API |
| `language` | `string` | No | Target language for speech synthesis |
| `sampleRate` | `8000 \| 16000 \| 22050 \| 24000 \| 44100 \| 48000` | No | Audio sample rate in Hz |
| `skipPatterns` | `number[]` | No | Skip patterns for bracketed content |

### Other TTS vendors

The following vendors share a similar pattern. See `src/agentkit/vendors/tts.ts` for the full constructor options:

| Class | Key params |
|---|---|
| `GoogleTTS` | `key`, `voiceName`, `languageCode?`, `sampleRate?` |
| `AmazonTTS` | `accessKey`, `secretKey`, `region`, `voiceId`, `engine` |
| `DeepgramTTS` | `apiKey`, `model`, `baseUrl?`, `sampleRate?`, `additionalParams?` |
| `HumeAITTS` | `key`, `voiceId`, `provider`, `configId?`, `baseUrl?`, `speed?`, `trailingSilence?` |
| `RimeTTS` | `key`, `speaker`, `modelId`, `baseUrl?` |
| `FishAudioTTS` | `key`, `referenceId`, `backend` |
| `MiniMaxTTS` | `key?`, `groupId?`, `model`, `voiceId?`, `url?` |
| `MurfTTS` | `key`, `voiceId?`, `baseUrl?`, `locale?`, `rate?`, `pitch?`, `model?`, `sampleRate?` |
| `SarvamTTS` | `key`, `speaker`, `targetLanguageCode`, `pitch?`, `pace?`, `loudness?`, `sampleRate?` |

For `MiniMaxTTS`, `key` is optional only for Agora-managed models:

- `speech-2.6-turbo`
- `speech-2.8-turbo`

For those models, omit `key` to use Agora-managed credentials. In that configuration, `groupId`, `voiceId`, and `url` are optional overrides rather than required fields. If `key` is provided, AgentKit uses BYOK.

---

## STT vendors

### DeepgramSTT

<!-- snippet: fragment -->
```typescript
new DeepgramSTT(options: DeepgramSTTOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | No | Deepgram API key. Optional only for `nova-2` and `nova-3` Agora-managed usage. |
| `model` | `string` | No | Model (e.g., `'nova-2'`, `'enhanced'`) |
| `language` | `string` | No | Language code (e.g., `'en-US'`) |
| `keyterm` | `string` | No | Boost specialized terms and brands; serialized as `asr.params.keyterm` |
| `smartFormat` | `boolean` | No | Enable smart formatting |
| `punctuation` | `boolean` | No | Enable punctuation |
| `additionalParams` | `Record<string, unknown>` | No | Additional vendor params |

For `nova-2` and `nova-3`, omit `apiKey` to use Agora-managed credentials. For all other Deepgram models, AgentKit requires `apiKey`.

### Other STT vendors

Use `turnDetection.language` for Agora interaction language; it defaults to `en-US`. Provider-specific language values stay under `asr.params` and may use a different format. AgentKit populates REST `asr.language` from `turnDetection.language`.

| Class | Key params |
|---|---|
| `SpeechmaticsSTT` | `apiKey`, `language`, `uri?` |
| `MicrosoftSTT` | `key`, `region`, `language` |
| `OpenAISTT` | `apiKey`, `model?`, `language?`, `prompt?`, `inputAudioTranscription?` |
| `GoogleSTT` | `projectId`, `location`, `adcCredentialsString`, `language`, `model?` |
| `AmazonSTT` | `accessKey`, `secretKey`, `region`, `language` |
| `AssemblyAISTT` | `apiKey`, `language`, `uri?` |
| `AresSTT` | — |
| `SarvamSTT` | `apiKey`, `language` |

---

## MLLM vendors

### OpenAIRealtime

<!-- snippet: fragment -->
```typescript
new OpenAIRealtime(options: OpenAIRealtimeOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | OpenAI API key |
| `model` | `string` | No | Model name (e.g., `'gpt-4o-realtime-preview'`) |
| `url` | `string` | No | WebSocket URL |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message played when the model call fails |
| `inputModalities` | `string[]` | No | Input modalities (e.g., `['audio']`) |
| `outputModalities` | `string[]` | No | Output modalities (e.g., `['text', 'audio']`) |
| `messages` | `Record<string, unknown>[]` | No | Conversation messages for short-term memory |
| `params` | `Record<string, unknown>` | No | Additional MLLM parameters |
| `turnDetection` | `MllmTurnDetectionConfig` | No | MLLM turn detection configuration; overrides top-level `turn_detection` |

### GeminiLive

<!-- snippet: fragment -->
```typescript
new GeminiLive(options: GeminiLiveOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Google API key |
| `model` | `string` | Yes | Model name (e.g., `'gemini-live-2.5-flash'`) |
| `url` | `string` | No | WebSocket URL |
| `instructions` | `string` | No | System instructions for the model |
| `voice` | `string` | No | Voice name (e.g., `'Aoede'`, `'Charon'`) |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message played when the model call fails |
| `inputModalities` | `string[]` | No | Input modalities |
| `outputModalities` | `string[]` | No | Output modalities |
| `messages` | `Record<string, unknown>[]` | No | Conversation messages |
| `additionalParams` | `Record<string, unknown>` | No | Additional parameters |
| `turnDetection` | `MllmTurnDetectionConfig` | No | MLLM turn detection configuration; overrides top-level `turn_detection` |

### VertexAI

<!-- snippet: fragment -->
```typescript
new VertexAI(options: VertexAIOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `model` | `string` | Yes | Model name (e.g., `'gemini-live-2.5-flash-preview-native-audio-09-2025'`) |
| `url` | `string` | No | WebSocket URL |
| `projectId` | `string` | Yes | Google Cloud project ID |
| `location` | `string` | Yes | Google Cloud location/region |
| `adcCredentialsString` | `string` | Yes | Application Default Credentials JSON string |
| `instructions` | `string` | No | System instructions for the model |
| `voice` | `string` | No | Voice name (e.g., `'Aoede'`, `'Charon'`) |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message played when the model call fails |
| `inputModalities` | `string[]` | No | Input modalities |
| `outputModalities` | `string[]` | No | Output modalities |
| `messages` | `Record<string, unknown>[]` | No | Conversation messages |
| `additionalParams` | `Record<string, unknown>` | No | Additional parameters |
| `turnDetection` | `MllmTurnDetectionConfig` | No | MLLM turn detection configuration; overrides top-level `turn_detection` |

### XaiGrok

<!-- snippet: fragment -->
```typescript
new XaiGrok(options: XaiGrokOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | xAI API key |
| `url` | `string` | No | WebSocket URL (defaults to xAI Realtime API) |
| `voice` | `string` | No | Voice identifier (for example, `'eve'`) |
| `language` | `string` | No | Language code |
| `sampleRate` | `number` | No | Audio sample rate in Hz |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message played when the model call fails |
| `inputModalities` | `string[]` | No | Input modalities |
| `outputModalities` | `string[]` | No | Output modalities |
| `messages` | `Record<string, unknown>[]` | No | Conversation messages |
| `params` | `Record<string, unknown>` | No | Additional xAI parameters |
| `turnDetection` | `MllmTurnDetectionConfig` | No | MLLM turn detection configuration; overrides top-level `turn_detection` |

---

## Avatar vendors

AgentKit auto-fills `agora_token` only for vendors that publish a separate RTC video identity: `HeyGenAvatar`, `LiveAvatarAvatar`, and `GenericAvatar`. When `agoraToken` is omitted on those vendors, AgentKit generates it at `session.start()` from the session App ID, channel, app certificate, and avatar `agoraUid`. Avatar tokens use the same ConvoAI token format as agent tokens, scoped to the avatar UID. Explicit `agoraToken` values are preserved. `AkoolAvatar` and `AnamAvatar` never receive an auto-generated token (the avatar provider handles publishing). Use `isAvatarTokenManaged(avatar)` to check whether a config is in the managed group.

### HeyGenAvatar

<!-- snippet: fragment -->
```typescript
new HeyGenAvatar(options: HeyGenAvatarOptions)
```

Deprecated. Use `LiveAvatarAvatar` for new integrations. Requires TTS at **24,000 Hz**. See [Avatar Integration](../guides/avatars.md).

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | HeyGen API key |
| `quality` | `"low" \| "medium" \| "high"` | Yes | Video quality (360p / 480p / 720p) |
| `agoraUid` | `string` | Yes | RTC UID for the avatar stream |
| `agoraToken` | `string` | No | Avatar token override |
| `avatarId` | `string` | No | HeyGen avatar ID |
| `disableIdleTimeout` | `boolean` | No | Disable idle timeout (default: false) |
| `activityIdleTimeout` | `number` | No | Idle timeout in seconds (default: 120) |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |

### LiveAvatarAvatar

<!-- snippet: fragment -->
```typescript
new LiveAvatarAvatar(options: LiveAvatarAvatarOptions)
```

Requires TTS at **24,000 Hz**. See [Avatar Integration](../guides/avatars.md).

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | LiveAvatar API key |
| `quality` | `"low" \| "medium" \| "high"` | Yes | Video quality |
| `agoraUid` | `string` | Yes | RTC UID for the avatar stream |
| `agoraToken` | `string` | No | Avatar token override |
| `avatarId` | `string` | No | Avatar ID |
| `disableIdleTimeout` | `boolean` | No | Disable idle timeout |
| `activityIdleTimeout` | `number` | No | Idle timeout in seconds |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |

### AkoolAvatar

<!-- snippet: fragment -->
```typescript
new AkoolAvatar(options: AkoolAvatarOptions)
```

Requires TTS at **16,000 Hz**. See [Avatar Integration](../guides/avatars.md).

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Akool API key |
| `avatarId` | `string` | No | Akool avatar ID |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |

### AnamAvatar

<!-- snippet: fragment -->
```typescript
new GenericAvatar(options: GenericAvatarOptions)
```

Generic avatars can omit `agoraAppId`, `agoraChannel`, and `agoraToken`. AgentKit fills them from the session at `start()`.

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Custom avatar provider API key |
| `apiBaseUrl` | `string` | Yes | Avatar provider API base URL |
| `avatarId` | `string` | Yes | Avatar ID |
| `agoraUid` | `string` | Yes | RTC UID for the avatar stream |
| `agoraAppId` | `string` | No | Agora App ID override |
| `agoraChannel` | `string` | No | Agora channel override |
| `agoraToken` | `string` | No | Avatar token override |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |



<!-- snippet: fragment -->
```typescript
new AnamAvatar(options: AnamAvatarOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Anam API key |
| `personaId` | `string` | No | Anam persona ID |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |

### GenericAvatar

<!-- snippet: fragment -->
```typescript
new GenericAvatar(options: GenericAvatarOptions)
```

Generic avatars can omit `agoraAppId`, `agoraChannel`, and `agoraToken`. AgentKit fills them from the session at `start()`.

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Custom avatar provider API key |
| `apiBaseUrl` | `string` | Yes | Avatar provider API base URL |
| `avatarId` | `string` | Yes | Avatar ID |
| `agoraUid` | `string` | Yes | RTC UID for the avatar stream |
| `agoraAppId` | `string` | No | Agora App ID override |
| `agoraChannel` | `string` | No | Agora channel override |
| `agoraToken` | `string` | No | Avatar token override |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |
