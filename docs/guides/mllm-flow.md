---
sidebar_position: 2
title: MLLM Flow (Multimodal)
description: Use OpenAI Realtime or Vertex AI Gemini Live for end-to-end audio processing.
---

# MLLM Flow (Multimodal)

In MLLM mode, a single multimodal model handles audio input and output end-to-end — no separate STT or TTS step. This reduces latency and is required for OpenAI Realtime and Gemini Live.

## When to use MLLM

- You want the lowest-latency conversational experience
- You are using OpenAI Realtime API or Google Gemini Live
- You don't need fine-grained control over STT/TTS vendor selection

## Requirements

MLLM mode requires `advancedFeatures: { enable_mllm: true }` in the `Agent` constructor. The `withLlm()`, `withTts()`, and `withStt()` methods are not needed — the MLLM vendor handles everything.

## Example: OpenAI Realtime

```typescript
import { AgoraClient, Area, Agent, OpenAIRealtime } from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({
  name: 'realtime-assistant',
  advancedFeatures: { enable_mllm: true },
}).withMllm(new OpenAIRealtime({
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

## Example: Vertex AI (Gemini Live)

```typescript
import { AgoraClient, Area, Agent, VertexAI } from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({
  name: 'gemini-assistant',
  advancedFeatures: { enable_mllm: true },
}).withMllm(new VertexAI({
  model: 'gemini-live-2.5-flash-preview-native-audio-09-2025',
  projectId: 'your-gcp-project-id',
  location: 'us-central1',
  adcCredentialsString: 'your-adc-credentials-json-string',
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

## Turn detection in MLLM mode

You can configure turn detection alongside MLLM to control when the model should respond. The preferred approach uses the SOS/EOS (Start of Speech / End of Speech) model via `config.start_of_speech` and `config.end_of_speech` — see [Agent Reference](../reference/agent.md) for full type definitions.

Legacy format (deprecated in favor of SOS/EOS):

```typescript
const agent = new Agent({
  name: 'realtime-with-vad',
  advancedFeatures: { enable_mllm: true },
})
  .withMllm(new OpenAIRealtime({
    apiKey: 'your-openai-key',
    model: 'gpt-4o-realtime-preview',
    greetingMessage: 'Hi!',
  }))
  .withTurnDetection({
    type: 'server_vad',
    interrupt_mode: 'interrupt',
    eagerness: 'auto',
  });
```

## How MLLM mode works internally

When `enable_mllm: true` is set, the SDK:

1. Sends the `mllm` configuration in the request body
2. Omits `llm`, `tts`, and `asr` fields (the backend ignores them in MLLM mode)
3. The multimodal model processes audio input directly and generates audio output

You do not need to call `withLlm()`, `withTts()`, or `withStt()` — doing so has no effect when MLLM is enabled.

## Next steps

- [Cascading Flow](./cascading-flow.md) — if you need separate STT, LLM, and TTS vendors
- [Vendors](../concepts/vendors.md) — full MLLM vendor options
