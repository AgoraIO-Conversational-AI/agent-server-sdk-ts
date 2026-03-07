# Agora Conversational AI TypeScript SDK

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2FAgoraIO-Conversational-AI%2Fagora-agent-ts-sdk)
[![npm shield](https://img.shields.io/npm/v/agora-agent-sdk)](https://www.npmjs.com/package/agora-agent-sdk)

The Agora Conversational AI SDK provides convenient access to the Agora Conversational AI APIs, enabling you to build voice-powered AI agents with support for both **cascading flows** (ASR → LLM → TTS) and **multimodal flows** (MLLM) for real-time audio processing.

## Installation

```sh
npm i agora-agent-sdk
```

## Quick Start

Use the **builder pattern** with `Agent` and `AgentSession`:

```typescript
import {
  AgoraClient,
  Area,
  Agent,
  OpenAI,
  ElevenLabsTTS,
  DeepgramSTT,
} from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({
  name: 'support-assistant',
  instructions: 'You are a helpful voice assistant.',
  greeting: 'Hello! How can I help you today?',
  maxHistory: 10,
})
  .withLlm(new OpenAI({
    apiKey: 'your-openai-key',
    model: 'gpt-4o-mini',
  }))
  .withTts(new ElevenLabsTTS({
    key: 'your-elevenlabs-key',
    modelId: 'eleven_flash_v2_5',
    voiceId: 'your-voice-id',
    sampleRate: 24000,
  }))
  .withStt(new DeepgramSTT({
    apiKey: 'your-deepgram-key',
    language: 'en-US',
  }));

const session = agent.createSession(client, {
  channel: 'support-room-123',
  agentUid: '1',
  remoteUids: ['100'],
  idleTimeout: 120,
});

const agentId = await session.start();
await session.say('Hello! How can I help you today?');
await session.stop();
```

## Documentation

| Topic              | Link                                                                               |
| ------------------ | ---------------------------------------------------------------------------------- |
| **API docs**       | [docs.agora.io](https://docs.agora.io/en/conversational-ai/overview)               |
| **Installation**   | [docs/getting-started/installation.md](./docs/getting-started/installation.md)     |
| **Authentication** | [docs/getting-started/authentication.md](./docs/getting-started/authentication.md) |
| **Quick Start**    | [docs/getting-started/quick-start.md](./docs/getting-started/quick-start.md)       |
| **Cascading flow** | [docs/guides/cascading-flow.md](./docs/guides/cascading-flow.md)                   |
| **MLLM flow**      | [docs/guides/mllm-flow.md](./docs/guides/mllm-flow.md)                             |
| **Low-level API**  | [docs/guides/low-level-api.md](./docs/guides/low-level-api.md)                     |
| **Error handling** | [docs/guides/error-handling.md](./docs/guides/error-handling.md)                   |
| **Advanced**       | [docs/guides/advanced.md](./docs/guides/advanced.md)                               |
| **API reference**  | [reference.md](./reference.md)                                                     |

## Contributing

This library is generated programmatically. Contributions to the README and docs are welcome. For code changes, see [CONTRIBUTING.md](./CONTRIBUTING.md).
