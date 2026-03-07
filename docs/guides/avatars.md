---
sidebar_position: 3
title: Avatar Integration
description: Add a digital avatar (HeyGen or Akool) to your Conversational AI agent.
---

# Avatar Integration

Avatars attach a visual representation to the agent's audio output. Two avatar providers are supported, each with a strict TTS sample rate requirement.

| Avatar | Provider | Required TTS sample rate |
|---|---|---|
| `HeyGenAvatar` | HeyGen | **24,000 Hz** |
| `AkoolAvatar` | Akool | **16,000 Hz** |

## The sample-rate constraint

Avatars require the TTS audio to be at a specific sample rate. If you use the wrong rate, the avatar will not render correctly. The SDK enforces this in two ways:

### 1. Compile-time enforcement (TypeScript phantom types)

The `Agent` class tracks the TTS sample rate as a type parameter. When you call `.withAvatar()`, TypeScript checks that the TTS sample rate type matches the avatar's required rate. If they don't match, you get a compile error:

```typescript
import { Agent, ElevenLabsTTS, HeyGenAvatar } from 'agora-agent-sdk';

// This works — ElevenLabs at 24kHz matches HeyGen's requirement
const good = new Agent({ name: 'avatar-agent' })
  .withTts(new ElevenLabsTTS({ key: 'your-key', modelId: 'eleven_flash_v2_5', voiceId: 'your-voice-id', sampleRate: 24000 }))
  .withAvatar(new HeyGenAvatar({ apiKey: 'your-heygen-key', quality: 'high', agoraUid: '12345' }));

// This fails at compile time — 16kHz does not match HeyGen's required 24kHz
const bad = new Agent({ name: 'avatar-agent' })
  .withTts(new ElevenLabsTTS({ key: 'your-key', modelId: 'eleven_flash_v2_5', voiceId: 'your-voice-id', sampleRate: 16000 }))
  .withAvatar(new HeyGenAvatar({ apiKey: 'your-heygen-key', quality: 'high', agoraUid: '12345' }));
  //         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  // TypeScript error: 'this' context of type 'Agent<16000>' is not assignable to
  // method's 'this' of type 'Agent<24000>'
```

### 2. Runtime enforcement

If phantom types are bypassed (for example, when config comes from external data), `session.start()` validates the TTS sample rate against the avatar vendor before sending the API request:

```
Error: HeyGen avatars ONLY support 24,000 Hz sample rate. Your TTS is configured
with 16000 Hz. Please update your TTS configuration to use 24kHz sample rate.
See: https://docs.agora.io/en/conversational-ai/models/avatar/heygen
```

For Akool:

```
Error: Akool avatars ONLY support 16,000 Hz sample rate. Your TTS is configured
with 24000 Hz. Please update your TTS configuration to use 16kHz sample rate.
See: https://docs.agora.io/en/conversational-ai/models/avatar/akool
```

## Example: HeyGen avatar with ElevenLabs at 24kHz

```typescript
import {
  AgoraClient,
  Area,
  Agent,
  OpenAI,
  ElevenLabsTTS,
  DeepgramSTT,
  HeyGenAvatar,
} from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({ name: 'heygen-agent', instructions: 'You are a friendly avatar assistant.' })
  .withLlm(new OpenAI({ apiKey: 'your-openai-key', model: 'gpt-4o-mini' }))
  .withTts(new ElevenLabsTTS({
    key: 'your-elevenlabs-key',
    modelId: 'eleven_flash_v2_5',
    voiceId: 'your-voice-id',
    sampleRate: 24000,  // Required for HeyGen
  }))
  .withStt(new DeepgramSTT({ apiKey: 'your-deepgram-key', model: 'nova-2' }))
  .withAvatar(new HeyGenAvatar({
    apiKey: 'your-heygen-key',
    quality: 'high',
    agoraUid: '12345',
    avatarId: 'your-avatar-id',
  }));

const session = agent.createSession(client, {
  channel: 'avatar-room',
  agentUid: '1',
  remoteUids: ['100'],
});

await session.start();
```

## Example: Akool avatar with ElevenLabs at 16kHz

```typescript
import {
  AgoraClient,
  Area,
  Agent,
  OpenAI,
  ElevenLabsTTS,
  DeepgramSTT,
  AkoolAvatar,
} from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({ name: 'akool-agent', instructions: 'You are a friendly avatar assistant.' })
  .withLlm(new OpenAI({ apiKey: 'your-openai-key', model: 'gpt-4o-mini' }))
  .withTts(new ElevenLabsTTS({
    key: 'your-elevenlabs-key',
    modelId: 'eleven_flash_v2_5',
    voiceId: 'your-voice-id',
    sampleRate: 16000,  // Required for Akool
  }))
  .withStt(new DeepgramSTT({ apiKey: 'your-deepgram-key', model: 'nova-2' }))
  .withAvatar(new AkoolAvatar({
    apiKey: 'your-akool-key',
    avatarId: 'your-avatar-id',
  }));

const session = agent.createSession(client, {
  channel: 'avatar-room',
  agentUid: '1',
  remoteUids: ['100'],
});

await session.start();
```

## HeyGenAvatar constructor options

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | HeyGen API key |
| `quality` | `"low" \| "medium" \| "high"` | Yes | Video quality (360p / 480p / 720p) |
| `agoraUid` | `string` | Yes | RTC UID for the avatar stream (must be unique in the channel) |
| `agoraToken` | `string` | No | RTC token for avatar authentication |
| `avatarId` | `string` | No | HeyGen avatar ID |
| `disableIdleTimeout` | `boolean` | No | Disable idle timeout (default: false) |
| `activityIdleTimeout` | `number` | No | Idle timeout in seconds (default: 120) |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |

## AkoolAvatar constructor options

| Option | Type | Required | Description |
|---|---|---|---|
| `apiKey` | `string` | Yes | Akool API key |
| `avatarId` | `string` | No | Akool avatar ID |
| `enable` | `boolean` | No | Enable/disable the avatar (default: true) |
