---
sidebar_position: 4
title: Vendors
description: Typed vendor classes for LLM, TTS, STT, MLLM, and Avatar providers.
---

# Vendors

Each vendor is a typed class that validates options at construction time and serializes to the wire format for the Agora API. Import all vendors from `agora-agents`.

## LLM vendors

| Class         | Provider                | Key constructor params                                                          |
| ------------- | ----------------------- | ------------------------------------------------------------------------------- |
| `OpenAI`      | OpenAI Chat Completions | `model` for Agora-managed models; `apiKey`, `url`, `model` for BYOK; `maxHistory?`, `greetingMessage?`, `failureMessage?` |
| `AzureOpenAI` | Azure OpenAI            | `apiKey`, `model`, `resourceName`, `deploymentName`, `apiVersion?`              |
| `Anthropic`   | Anthropic Claude        | `apiKey`, `model`, `url`, `headers`, `maxTokens`, `maxHistory?`                 |
| `Gemini`      | Google Gemini           | `apiKey`, `model`, `url?`, `maxHistory?`                                        |
| `Groq`        | Groq                    | `apiKey`, `model`, `url`, `maxHistory?`                                         |
| `VertexAILLM` | Google Vertex AI        | `apiKey`, `model`, `projectId`, `location`, `url?`                              |
| `AmazonBedrock` | Amazon Bedrock        | `accessKey`, `secretKey`, `region`, `model`                                     |
| `Dify`        | Dify                    | `apiKey`, `url`, `model`, `user?`, `conversationId?`                            |
| `CustomLLM`   | OpenAI-compatible LLM   | `apiKey`, `model`, `url`                                                        |

<!-- snippet: executable -->

```typescript
import { OpenAI } from 'agora-agents';

const llm = new OpenAI({
  apiKey: 'your-openai-key',
  url: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini',
});
```

## TTS vendors

| Class           | Provider         | `sampleRate` options                    |
| --------------- | ---------------- | --------------------------------------- |
| `ElevenLabsTTS` | ElevenLabs       | 16000, 22050, 24000, 44100              |
| `MicrosoftTTS`  | Azure Speech     | 16000, 24000, 48000                     |
| `OpenAITTS`     | OpenAI TTS       | Fixed at 24000                          |
| `CartesiaTTS`   | Cartesia         | 8000, 16000, 22050, 24000, 44100, 48000 |
| `GoogleTTS`     | Google Cloud TTS | Configurable                            |
| `AmazonTTS`     | Amazon Polly     | Configurable                            |
| `HumeAITTS`     | Hume AI          | Configurable                            |
| `RimeTTS`       | Rime             | Configurable                            |
| `FishAudioTTS`  | Fish Audio       | Configurable                            |
| `MiniMaxTTS`    | MiniMax          | `model` for supported Agora-managed models; BYOK accepts `key`, `groupId`, `model`, `voiceId`, and `url` |
| `MurfTTS`       | Murf             | Configurable                            |
| `DeepgramTTS`   | Deepgram         | Configurable                            |
| `SarvamTTS`     | Sarvam AI        | Configurable                            |

<!-- snippet: executable -->

```typescript
import { ElevenLabsTTS } from 'agora-agents';

const tts = new ElevenLabsTTS({
  key: 'your-elevenlabs-key',
  modelId: 'eleven_flash_v2_5',
  voiceId: 'your-voice-id',
  baseUrl: 'wss://api.elevenlabs.io/v1',
  sampleRate: 24000,
});
```

The `sampleRate` is critical when using avatars. See [Avatar Integration](../guides/avatars.md) for details.

## STT vendors

`turnDetection.language` sets the Agora interaction language and defaults to `en-US` when omitted. STT vendor `language` options are serialized under `asr.params` using each provider's own format. Ares does not take a provider language option; AgentKit uses `turnDetection.language` for REST `asr.language`.

| Class             | Provider          | Key constructor params                           |
| ----------------- | ----------------- | ------------------------------------------------ |
| `SpeechmaticsSTT` | Speechmatics      | `apiKey`, `language`, `uri?`                     |
| `DeepgramSTT`     | Deepgram          | `model` for Agora-managed `nova-2`/`nova-3`; `apiKey` for BYOK; `language?`, `smartFormat?`, `keyterm?` |
| `MicrosoftSTT`    | Azure Speech      | `key`, `region`, `language`                      |
| `OpenAISTT`       | OpenAI Whisper    | `apiKey`, `model?`, `language?`, `prompt?`       |
| `GoogleSTT`       | Google Speech     | `projectId`, `location`, `adcCredentialsString`, `language` |
| `AmazonSTT`       | Amazon Transcribe | `accessKey`, `secretKey`, `region`, `language`   |
| `AssemblyAISTT`   | AssemblyAI        | `apiKey`, `language`, `uri?`                     |
| `AresSTT`         | Agora ARES        | —                                                |
| `SarvamSTT`       | Sarvam AI         | `apiKey`, `language`                             |

<!-- snippet: executable -->

```typescript
import { DeepgramSTT } from 'agora-agents';

const stt = new DeepgramSTT({
  apiKey: 'your-deepgram-key',
  model: 'nova-2',
  language: 'en-US',
});
```

## MLLM vendors

MLLM (Multimodal LLM) vendors handle audio end-to-end — no separate STT or TTS step. Call `agent.withMllm(vendor)` and MLLM mode is enabled automatically; no separate `advancedFeatures` flag is needed.

| Class            | Provider                        | Key constructor params                                                                                                                                                                    |
| ---------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OpenAIRealtime` | OpenAI Realtime API             | `apiKey`, `model?`, `url?`, `greetingMessage?`, `failureMessage?`, `inputModalities?`, `outputModalities?`, `messages?`, `turnDetection?`                                                 |
| `GeminiLive`     | Google Gemini Live API          | `apiKey`, `model`, `url?`, `voice?`, `greetingMessage?`, `failureMessage?`, `inputModalities?`, `outputModalities?`, `messages?`, `turnDetection?`                                        |
| `VertexAI`       | Vertex AI Gemini Live           | `model`, `url?`, `projectId`, `location`, `adcCredentialsString`, `voice?`, `greetingMessage?`, `failureMessage?`, `inputModalities?`, `outputModalities?`, `messages?`, `turnDetection?` |
| `XaiGrok`        | xAI Grok (`mllm.vendor`: `xai`) | `apiKey`, `url?`, `voice?`, `language?`, `sampleRate?`, `greetingMessage?`, `failureMessage?`, `inputModalities?`, `outputModalities?`, `messages?`, `turnDetection?`                     |

> Future xAI **STT** and **TTS** vendors will be named `XaiSTT` and `XaiTTS` (cascading pipeline).

<!-- snippet: executable -->

```typescript
import { OpenAIRealtime } from 'agora-agents';

const mllm = new OpenAIRealtime({
  apiKey: 'your-openai-key',
  model: 'gpt-4o-realtime-preview',
  greetingMessage: 'Hello! Ready to chat.',
});
```

See [MLLM Flow Guide](../guides/mllm-flow.md) for full examples.

## Avatar vendors

Avatars provide a visual representation for the agent. Several avatar vendors require a specific TTS sample rate — this is enforced at both compile time and runtime.

> Avatars currently require the cascading ASR + LLM + TTS pipeline. They are not supported with MLLM (`OpenAIRealtime`, `GeminiLive`, `VertexAI`, `XaiGrok`); combining the two throws at `Agent.toProperties()` and `AgentSession.start()`.

| Class              | Provider                                    | Required TTS sample rate |
| ------------------ | ------------------------------------------- | ------------------------ |
| `LiveAvatarAvatar` | LiveAvatar (formerly HeyGen)                | 24000 Hz                 |
| `HeyGenAvatar`     | HeyGen (deprecated, use `LiveAvatarAvatar`) | 24000 Hz                 |
| `AkoolAvatar`      | Akool                                       | 16000 Hz                 |
| `AnamAvatar`       | Anam                                        | Provider-defined         |
| `GenericAvatar`    | Custom avatar provider                      | Provider-defined         |

See [Avatar Integration](../guides/avatars.md) for full examples and the sample-rate constraint details.

For detailed constructor options for every vendor, see [Vendor Reference](../reference/vendors.md).
