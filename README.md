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
  ExpiresIn,
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
  // Configure Agent flow: STT → LLM → TTS → (optional) Avatar
  .withStt(new DeepgramSTT({ apiKey: 'your-deepgram-key', language: 'en-US' }))
  .withLlm(new OpenAI({ apiKey: 'your-openai-key', model: 'gpt-4o-mini' }))
  .withTts(
    new ElevenLabsTTS({
      key: 'your-elevenlabs-key',
      modelId: 'eleven_flash_v2_5',
      voiceId: 'your-voice-id',
      sampleRate: 24000,
    }),
  );
// .withAvatar(new HeyGenAvatar({ ... })) // optional

const session = agent.createSession(client, {
  channel: 'support-room-123',
  agentUid: '1',
  remoteUids: ['100'],
  idleTimeout: 120,
  expiresIn: ExpiresIn.hours(12), // optional — default is ExpiresIn.DAY (24 h)
});

// start() returns a session ID unique to this agent session
const agentSessionId = await session.start();

// In production, stop is typically called when your client signals the session has ended.
// Your server receives that request and calls session.stop().
await session.stop();
```

### Session lifecycle

`start()` joins the agent to the channel and returns a **session ID** — a unique identifier for this agent session. The session stays active until `stop()` is called.

There are two ways to stop a session depending on how your server is structured:

**Option 1 — Hold the session in memory:**

```typescript
// start-session handler
const agentSessionId = await session.start(); // unique ID for this session
// stop-session handler (same process, session still in scope)
await session.stop();
```

**Option 2 — Store the session ID and stop by ID (stateless servers):**

```typescript
// start-session handler: return session ID to your client app
const agentSessionId = await session.start();
res.json({ agentSessionId });

// stop-session handler: client sends back agentSessionId
const client = new AgoraClient({
  area: Area.US,
  appId: '...',
  appCertificate: '...',
});
await client.stopAgent(agentSessionId);
```

### Manual tokens (for debugging)

Generate tokens yourself and pass them in — useful when inspecting or reusing tokens:

```typescript
import {
  AgoraClient,
  Area,
  Agent,
  generateConvoAIToken,
  ExpiresIn,
} from 'agora-agent-sdk';

const APP_ID = 'your-app-id';
const APP_CERT = 'your-app-certificate';
const CHANNEL = 'support-room-123';
const AGENT_UID = '1';

// Auth header token — used by the SDK to authenticate REST API calls
const authToken = generateConvoAIToken({
  appId: APP_ID,
  appCertificate: APP_CERT,
  channelName: CHANNEL,
  account: AGENT_UID,
  tokenExpire: ExpiresIn.hours(12),
});

// Channel join token — embedded in the start request so the agent can join the channel
const joinToken = generateConvoAIToken({
  appId: APP_ID,
  appCertificate: APP_CERT,
  channelName: CHANNEL,
  account: AGENT_UID,
  tokenExpire: ExpiresIn.hours(12),
});

const client = new AgoraClient({
  area: Area.US,
  appId: APP_ID,
  appCertificate: APP_CERT,
  authToken: authToken, // Optional Debugging: uses this token for REST API auth header when set.
});

const session = agent.createSession(client, {
  channel: CHANNEL,
  agentUid: AGENT_UID,
  remoteUids: ['100'],
  token: joinToken, // channel join token
});
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
