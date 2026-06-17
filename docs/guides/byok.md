---
sidebar_position: 4
title: BYOK
description: Bring your own vendor credentials and use custom vendor configuration with the TypeScript SDK.
---

# BYOK

Use BYOK when you want to provide vendor credentials yourself instead of relying on Agora-managed models via the builder.

Typical reasons:

- you need a vendor model outside the Agora-managed catalog
- you want to point to a custom endpoint
- you want direct control over vendor-specific parameters
- your organization manages vendor billing separately from Agora

## Full example

```typescript
import {
  Agent,
  AgoraClient,
  Area,
  DeepgramSTT,
  ElevenLabsTTS,
  OpenAI,
} from 'agora-agents';

async function main(): Promise<void> {
  const client = new AgoraClient({

    area: Area.US,
    appId: 'your-app-id',
    appCertificate: 'your-app-certificate',
  });

  // In BYOK mode, each vendor carries its own credentials.
  const agent = new Agent({ name: 'support-assistant' })
    .withStt(
      new DeepgramSTT({
        apiKey: process.env.DEEPGRAM_API_KEY!,
        model: 'nova-3',
        language: 'en-US',
      }),
    )
    .withLlm(
      new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
        url: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-4o-mini',
        systemMessages: [{ role: 'system', content: 'You are a concise support voice assistant.' }],
        greetingMessage: 'Hello! How can I help you today?',
        maxHistory: 10,
      }),
    )
    .withTts(
      new ElevenLabsTTS({
        key: process.env.ELEVENLABS_API_KEY!,
        modelId: 'eleven_flash_v2_5',
        voiceId: process.env.ELEVENLABS_VOICE_ID!,
        baseUrl: 'wss://api.elevenlabs.io/v1',
        sampleRate: 24000,
      }),
    );

  const session = agent.createSession(client, {
    channel: 'support-room-123',
    agentUid: '1',
    remoteUids: ['100'],
    idleTimeout: 120,
  });

  const agentSessionId = await session.start();
  console.log('Agent started:', agentSessionId);

  await session.stop();
}

void main();
```

## Builder-managed vs BYOK

- Builder without vendor keys: supported Agora-managed models
- BYOK: your keys and full vendor control
