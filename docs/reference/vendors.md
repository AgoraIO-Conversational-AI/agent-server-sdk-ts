---
sidebar_position: 4
title: Vendor Reference
description: Constructor options for all LLM, TTS, STT, MLLM, and Avatar vendor classes.
---

# Vendor Reference

All vendor classes are imported from `agora-agent-sdk`.

## LLM vendors

### OpenAI

```typescript
new OpenAI(options: OpenAIOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | OpenAI API key |
| `model` | `string` | Yes | Model name (e.g., `'gpt-4o-mini'`, `'gpt-4'`) |
| `url` | `string` | No | API endpoint URL (default: `https://api.openai.com/v1/chat/completions`) |
| `maxHistory` | `number` | No | Max conversation history to cache |
| `systemMessages` | `Record<string, unknown>[]` | No | System messages for context |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message when LLM call fails |
| `inputModalities` | `string[]` | No | Input modalities (default: `["text"]`) |
| `params` | `Record<string, unknown>` | No | Additional LLM parameters (overrides `model` in params) |

### AzureOpenAI

```typescript
new AzureOpenAI(options: AzureOpenAIOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Azure OpenAI API key |
| `model` | `string` | Yes | Model/deployment name |
| `resourceName` | `string` | Yes | Azure resource name |
| `deploymentName` | `string` | Yes | Deployment name in Azure |
| `apiVersion` | `string` | No | Azure API version (default: `'2023-05-15'`) |
| `maxHistory` | `number` | No | Max conversation history to cache |
| `systemMessages` | `Record<string, unknown>[]` | No | System messages |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message when LLM call fails |
| `inputModalities` | `string[]` | No | Input modalities (default: `["text"]`) |
| `params` | `Record<string, unknown>` | No | Additional LLM parameters |

### Anthropic

```typescript
new Anthropic(options: AnthropicOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Anthropic API key |
| `model` | `string` | Yes | Model name (e.g., `'claude-3-5-sonnet-20241022'`) |
| `url` | `string` | No | API endpoint URL (default: `https://api.anthropic.com/v1/messages`) |
| `maxHistory` | `number` | No | Max conversation history to cache |
| `systemMessages` | `Record<string, unknown>[]` | No | System messages |
| `greetingMessage` | `string` | No | Agent greeting message |
| `failureMessage` | `string` | No | Message when LLM call fails |
| `inputModalities` | `string[]` | No | Input modalities (default: `["text"]`) |
| `params` | `Record<string, unknown>` | No | Additional LLM parameters |

### Gemini

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
| `params` | `Record<string, unknown>` | No | Additional LLM parameters |

---

## TTS vendors

### ElevenLabsTTS

```typescript
new ElevenLabsTTS<SR extends ElevenLabsSampleRate>(options: ElevenLabsTTSOptions<SR>)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | Yes | ElevenLabs API key |
| `modelId` | `string` | Yes | Model ID (e.g., `'eleven_flash_v2_5'`) |
| `voiceId` | `string` | Yes | Voice ID |
| `baseUrl` | `string` | No | WebSocket base URL |
| `sampleRate` | `16000 \| 22050 \| 24000 \| 44100` | No | Audio sample rate in Hz |
| `skipPatterns` | `number[]` | No | Skip patterns for bracketed content |

### MicrosoftTTS

```typescript
new MicrosoftTTS<SR extends MicrosoftSampleRate>(options: MicrosoftTTSOptions<SR>)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | Yes | Azure Speech API key |
| `region` | `string` | Yes | Azure region (e.g., `'eastus'`) |
| `voiceName` | `string` | Yes | Voice name (e.g., `'en-US-JennyNeural'`) |
| `sampleRate` | `16000 \| 24000 \| 48000` | No | Audio sample rate in Hz |
| `skipPatterns` | `number[]` | No | Skip patterns for bracketed content |

### OpenAITTS

```typescript
new OpenAITTS(options: OpenAITTSOptions)
```

Fixed at 24kHz — no configurable sample rate.

| Option | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | Yes | OpenAI API key |
| `voice` | `string` | Yes | Voice name (`'alloy'`, `'echo'`, `'fable'`, `'onyx'`, `'nova'`, `'shimmer'`) |
| `model` | `string` | No | Model name (e.g., `'tts-1'`, `'tts-1-hd'`) |
| `skipPatterns` | `number[]` | No | Skip patterns for bracketed content |

### CartesiaTTS

```typescript
new CartesiaTTS<SR extends CartesiaSampleRate>(options: CartesiaTTSOptions<SR>)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `key` | `string` | Yes | Cartesia API key |
| `voiceId` | `string` | Yes | Voice ID |
| `modelId` | `string` | No | Model ID |
| `sampleRate` | `8000 \| 16000 \| 22050 \| 24000 \| 44100 \| 48000` | No | Audio sample rate in Hz |
| `skipPatterns` | `number[]` | No | Skip patterns for bracketed content |

### Other TTS vendors

The following vendors share a similar pattern. See `src/agentkit/vendors/tts.ts` for the full constructor options:

| Class | Key params |
|---|---|
| `GoogleTTS` | `key`, `voiceName`, `languageCode?` |
| `AmazonTTS` | `accessKey`, `secretKey`, `region`, `voiceId` |
| `HumeAITTS` | `key`, `configId?` |
| `RimeTTS` | `key`, `speaker`, `modelId?` |
| `FishAudioTTS` | `key`, `referenceId` |
| `MiniMaxTTS` | `key`, `groupId`, `model`, `voiceId`, `url` |
| `MurfTTS` | `key`, `voiceId`, `style?` |
| `SarvamTTS` | `key`, `speaker`, `targetLanguageCode` |

---

## STT vendors

### DeepgramSTT

```typescript
new DeepgramSTT(options?: DeepgramSTTOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | No | Deepgram API key |
| `model` | `string` | No | Model (e.g., `'nova-2'`, `'enhanced'`) |
| `language` | `string` | No | Language code (e.g., `'en-US'`) |
| `smartFormat` | `boolean` | No | Enable smart formatting |
| `punctuation` | `boolean` | No | Enable punctuation |
| `additionalParams` | `Record<string, unknown>` | No | Additional vendor params |

### Other STT vendors

| Class | Key params |
|---|---|
| `SpeechmaticsSTT` | `apiKey`, `language` |
| `MicrosoftSTT` | `key`, `region`, `language?` |
| `OpenAISTT` | `apiKey`, `model?`, `language?` |
| `GoogleSTT` | `apiKey`, `language?` |
| `AmazonSTT` | `accessKey`, `secretKey`, `region`, `language?` |
| `AssemblyAISTT` | `apiKey`, `language?` |
| `AresSTT` | `language?` |
| `SarvamSTT` | `apiKey`, `language` |

---

## MLLM vendors

### OpenAIRealtime

```typescript
new OpenAIRealtime(options: OpenAIRealtimeOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | OpenAI API key |
| `model` | `string` | No | Model name (e.g., `'gpt-4o-realtime-preview'`) |
| `url` | `string` | No | WebSocket URL |
| `greetingMessage` | `string` | No | Agent greeting message |
| `inputModalities` | `string[]` | No | Input modalities (e.g., `['audio']`) |
| `outputModalities` | `string[]` | No | Output modalities (e.g., `['text', 'audio']`) |
| `messages` | `Record<string, unknown>[]` | No | Conversation messages for short-term memory |
| `params` | `Record<string, unknown>` | No | Additional MLLM parameters |

### VertexAI

```typescript
new VertexAI(options: VertexAIOptions)
```

| Option | Type | Required | Description |
|---|---|---|---|
| `model` | `string` | Yes | Model name (e.g., `'gemini-live-2.5-flash-preview-native-audio-09-2025'`) |
| `projectId` | `string` | Yes | Google Cloud project ID |
| `location` | `string` | Yes | Google Cloud location/region |
| `adcCredentialsString` | `string` | Yes | Application Default Credentials JSON string |
| `instructions` | `string` | No | System instructions for the model |
| `voice` | `string` | No | Voice name (e.g., `'Aoede'`, `'Charon'`) |
| `greetingMessage` | `string` | No | Agent greeting message |
| `inputModalities` | `string[]` | No | Input modalities |
| `outputModalities` | `string[]` | No | Output modalities |
| `messages` | `Record<string, unknown>[]` | No | Conversation messages |
| `additionalParams` | `Record<string, unknown>` | No | Additional parameters |

---

## Avatar vendors

### HeyGenAvatar

```typescript
new HeyGenAvatar(options: HeyGenAvatarOptions)
```

Requires TTS at **24,000 Hz**. See [Avatar Integration](../guides/avatars.md).

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | HeyGen API key |
| `quality` | `"low" \| "medium" \| "high"` | Yes | Video quality (360p / 480p / 720p) |
| `agoraUid` | `string` | Yes | RTC UID for the avatar stream |
| `agoraToken` | `string` | No | RTC token for avatar authentication |
| `avatarId` | `string` | No | HeyGen avatar ID |
| `disableIdleTimeout` | `boolean` | No | Disable idle timeout (default: false) |
| `activityIdleTimeout` | `number` | No | Idle timeout in seconds (default: 120) |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |

### AkoolAvatar

```typescript
new AkoolAvatar(options: AkoolAvatarOptions)
```

Requires TTS at **16,000 Hz**. See [Avatar Integration](../guides/avatars.md).

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Akool API key |
| `avatarId` | `string` | No | Akool avatar ID |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |
