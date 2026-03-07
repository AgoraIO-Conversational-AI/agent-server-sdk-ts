---
sidebar_position: 3
title: Quick Start
description: Build and run your first Agora Conversational AI agent in TypeScript.
---

# Quick Start

Build a voice assistant that joins an Agora channel, listens to a user via Deepgram STT, responds with OpenAI, and speaks back with ElevenLabs TTS.

## Full example

```typescript
import {
  AgoraClient,
  Area,
  Agent,
  OpenAI,
  ElevenLabsTTS,
  DeepgramSTT,
} from 'agora-agent-sdk';

// 1. Create the client — app-credentials mode auto-generates tokens
const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

// 2. Define the agent — immutable builder, safe to reuse across sessions
const agent = new Agent({
  name: 'my-assistant',
  instructions: 'You are a helpful voice assistant. Keep responses concise.',
  greeting: 'Hello! How can I help you today?',
  maxHistory: 20,
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
    model: 'nova-2',
    language: 'en-US',
  }));

// 3. Create a session — connects the agent to a specific channel
const session = agent.createSession(client, {
  channel: 'my-room',
  agentUid: '1',
  remoteUids: ['100'],
  idleTimeout: 120,
});

// 4. Listen for events
session.on('started', ({ agentId }) => {
  console.log('Agent started:', agentId);
});

session.on('error', (err) => {
  console.error('Session error:', err);
});

// 5. Start the session — the agent joins the channel and begins listening
const agentId = await session.start();

// 6. Use the session — instruct the agent to speak, or interrupt it
await session.say('Let me tell you about our product.');
await session.interrupt();

// 7. Stop the session — the agent leaves the channel
await session.stop();
```

## Step-by-step

1. **Create the client** — `AgoraClient` handles authentication and regional routing. App credentials mode is recommended; see [Authentication](./authentication.md) for alternatives.

2. **Define the agent** — `Agent` is an immutable configuration object. Each `.withLlm()`, `.withTts()`, `.withStt()` call returns a new `Agent` instance. You can reuse one agent across multiple sessions.

3. **Create a session** — `agent.createSession(client, options)` returns an `AgentSession` bound to a specific channel. The `remoteUids` array lists the RTC UIDs the agent should listen to.

4. **Start the session** — `session.start()` sends the start request to the Agora API. The agent joins the channel and begins processing audio. Returns the `agentId`.

5. **Interact** — `session.say(text)` makes the agent speak. `session.interrupt()` stops current speech. `session.update(config)` changes the agent config mid-session.

6. **Stop the session** — `session.stop()` cleanly shuts down the agent.

## Next steps

- [MLLM Flow](../guides/mllm-flow.md) — use OpenAI Realtime or Gemini Live for end-to-end audio
- [Avatar Integration](../guides/avatars.md) — attach a HeyGen or Akool avatar
- [Regional Routing](../guides/regional-routing.md) — configure area and failover
- [Agent Reference](../reference/agent.md) — full API for the builder pattern
