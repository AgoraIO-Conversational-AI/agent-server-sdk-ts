---
sidebar_position: 2
title: MLLM Flow (Multimodal)
description: Use OpenAI Realtime, Gemini Live, Vertex AI, or xAI Grok for end-to-end audio processing.
---

# MLLM Flow (Multimodal)

In MLLM mode, a single multimodal model handles audio input and output end-to-end — no separate STT or TTS step. This reduces latency and is required for OpenAI Realtime, Gemini Live, Vertex AI, and xAI Grok.

## When to use MLLM

- You want the lowest-latency conversational experience
- You are using OpenAI Realtime API, Google Gemini Live, Vertex AI Gemini Live, or xAI Grok Realtime
- You don't need fine-grained control over STT/TTS vendor selection

## Requirements

Call `agent.withMllm(vendor)` — that's it. MLLM mode is enabled automatically through `mllm.enable`. The `withLlm()`, `withTts()`, and `withStt()` methods are not needed — the MLLM vendor handles everything.

## Limitations

Avatars are not supported with MLLM at this time. The avatar publisher requires the cascading ASR + LLM + TTS pipeline, so combining `withMllm()` with `withAvatar()` throws at `Agent.toProperties()` and `AgentSession.start()`:

```
Avatars are only supported with the cascading ASR + LLM + TTS pipeline.
Remove the avatar configuration when using MLLM, or switch to a cascading session.
```

If you need an avatar, switch to the [cascading flow](./cascading-flow.md). If you need MLLM, omit the avatar.

## Example: OpenAI Realtime

```typescript
import { AgoraClient, Area, Agent, OpenAIRealtime } from 'agora-agents';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({ name: 'realtime-assistant' })
  .withMllm(new OpenAIRealtime({
    apiKey: 'your-openai-key',
    model: 'gpt-4o-realtime-preview',
    greetingMessage: 'Hello! Ready to chat.',
    inputModalities: ['audio'],
    outputModalities: ['text', 'audio'],
  }));

const session = agent.createSession(client, {
  channel: 'realtime-room',
  agentUid: '1',
  remoteUids: ['100'],
});

const agentId = await session.start();
console.log('Realtime agent running:', agentId);

// When done:
await session.stop();
```

## Example: Gemini Live

```typescript
import { AgoraClient, Area, Agent, GeminiLive } from 'agora-agents';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({ name: 'gemini-assistant' })
  .withMllm(new GeminiLive({
    apiKey: 'your-google-ai-api-key',
    model: 'gemini-live-2.5-flash',
    instructions: 'You are a helpful voice assistant.',
    voice: 'Aoede',
    greetingMessage: 'Hello! Gemini is listening.',
  }));

const session = agent.createSession(client, {
  channel: 'gemini-room',
  agentUid: '1',
  remoteUids: ['100'],
});

const agentId = await session.start();
console.log('Gemini agent running:', agentId);
```

## Example: xAI Grok

```typescript
import { AgoraClient, Area, Agent, XaiGrok } from 'agora-agents';

const client = new AgoraClient({
  area: Area.US,

  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({ name: 'grok-assistant' })
  .withMllm(new XaiGrok({
    apiKey: 'your-xai-key',
    voice: 'eve',
    language: 'en',
    sampleRate: 24000,
    greetingMessage: 'Hello! Grok is listening.',
  }));

const session = agent.createSession(client, {
  channel: 'grok-room',
  agentUid: '1',
  remoteUids: ['100'],
});

const agentId = await session.start();
console.log('Grok agent running:', agentId);
```

## Turn detection in MLLM mode

Configure MLLM turn detection on the MLLM vendor with `turnDetection`. When set, `mllm.turn_detection` overrides the top-level `turn_detection` object.

Example:

```typescript
const agent = new Agent({ name: 'realtime-with-vad' })
  .withMllm(new OpenAIRealtime({
    apiKey: 'your-openai-key',
    model: 'gpt-4o-realtime-preview',
    greetingMessage: 'Hi!',
    turnDetection: {
      mode: 'server_vad',
      server_vad_config: {
        idle_timeout_ms: 5000,
      },
    },
  });
```

## How MLLM mode works internally

When MLLM mode is active (set automatically by `withMllm()`), the SDK:

1. Sends the `mllm` configuration in the request body
2. Omits `llm`, `tts`, and `asr` fields (the backend ignores them in MLLM mode)
3. The multimodal model processes audio input directly and generates audio output

You do not need to call `withLlm()`, `withTts()`, or `withStt()` — doing so has no effect when MLLM is enabled.

## Next steps

- [Cascading Flow](./cascading-flow.md) — if you need separate STT, LLM, and TTS vendors
- [Vendors](../concepts/vendors.md) — full MLLM vendor options
