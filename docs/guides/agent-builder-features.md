---
sidebar_position: 5
title: Agent Builder Features
description: Configure SAL, advanced features, parameters, geofence, labels, RTC, filler words, and more.
---

# Agent Builder Features

The Agent builder supports many configuration options beyond the core LLM, TTS, and STT vendors. This guide shows how to use each feature.

## Overview

| Feature | Method | Description |
|---|---|---|
| `sal` | `withSal(config)` | Selective Attention Locking — speaker recognition and noise suppression |
| `advancedFeatures` | `withAdvancedFeatures(features)` | Enable MLLM, RTM, SAL, tools |
| `parameters` | `withParameters(params)` | Silence config, farewell config, data channel |
| `failureMessage` | `withFailureMessage(msg)` | Message spoken when LLM fails |
| `maxHistory` | `withMaxHistory(n)` | Max conversation turns in LLM context |
| `geofence` | `withGeofence(config)` | Restrict backend server regions |
| `labels` | `withLabels(labels)` | Custom key-value labels (returned in callbacks) |
| `rtc` | `withRtc(config)` | RTC media encryption |
| `fillerWords` | `withFillerWords(config)` | Filler words while waiting for LLM |

## SAL (Selective Attention Locking)

SAL helps the agent focus on the primary speaker and suppress background noise. Enable it via `advancedFeatures` and configure with `withSal`:

```typescript
import {
  Agent,
  OpenAI,
  ElevenLabsTTS,
  DeepgramSTT,
} from 'agora-agent-sdk';

const agent = new Agent({
  name: 'sal-assistant',
  instructions: 'You are a helpful assistant.',
})
  .withLlm(new OpenAI({ apiKey: 'your-key', model: 'gpt-4o-mini' }))
  .withTts(new ElevenLabsTTS({ key: 'your-key', modelId: 'eleven_flash_v2_5', voiceId: 'your-voice-id', sampleRate: 24000 }))
  .withStt(new DeepgramSTT({ apiKey: 'your-key', model: 'nova-2', language: 'en-US' }))
  .withAdvancedFeatures({ enable_sal: true })
  .withSal({
    sal_mode: 'locking',
    sample_urls: { 'primary-speaker': 'https://example.com/voiceprint.pcm' },
  });
```

`sal_mode` can be `'locking'` (speaker lock) or `'recognition'` (voiceprint recognition).

## Advanced Features

Enable MLLM, RTM, SAL, or tools:

```typescript
import { Agent } from 'agora-agent-sdk';

// MLLM mode (see mllm-flow guide)
const mllmAgent = new Agent()
  .withAdvancedFeatures({ enable_mllm: true })
  .withMllm(/* ... */);

// RTM signaling for custom data delivery
const rtmAgent = new Agent()
  .withAdvancedFeatures({ enable_rtm: true });

// Enable tool invocation via MCP
const toolsAgent = new Agent()
  .withAdvancedFeatures({ enable_tools: true });
```

## Session Parameters

Configure silence handling, farewell behavior, and data channel:

```typescript
import { Agent } from 'agora-agent-sdk';

const agent = new Agent({ name: 'params-agent' })
  .withLlm(/* ... */)
  .withTts(/* ... */)
  .withStt(/* ... */)
  .withParameters({
    silence_config: {
      timeout_ms: 10000,
      action: 'speak',
      content: 'I\'m still here. Take your time.',
    },
    farewell_config: {
      graceful_enabled: true,
      graceful_timeout_seconds: 10,
    },
    data_channel: 'rtm', // or 'datastream'
  });
```

## Failure Message and Max History

```typescript
const agent = new Agent({
  name: 'assistant',
  failureMessage: 'Sorry, I encountered an error. Please try again.',
  maxHistory: 20,
})
  .withLlm(/* ... */)
  .withTts(/* ... */)
  .withStt(/* ... */);

// Or via builder methods
const agent2 = new Agent()
  .withFailureMessage('Something went wrong.')
  .withMaxHistory(15)
  .withLlm(/* ... */)
  .withTts(/* ... */)
  .withStt(/* ... */);
```

## Geofence

Restrict which geographic regions the backend can use:

```typescript
const agent = new Agent()
  .withGeofence({
    area: 'NORTH_AMERICA',
  })
  .withLlm(/* ... */)
  .withTts(/* ... */)
  .withStt(/* ... */);

// Global with exclusion
const agent2 = new Agent()
  .withGeofence({
    area: 'GLOBAL',
    exclude_area: 'EUROPE',
  })
  .withLlm(/* ... */)
  .withTts(/* ... */)
  .withStt(/* ... */);
```

Valid `area` values: `'GLOBAL'`, `'NORTH_AMERICA'`, `'EUROPE'`, `'ASIA'`, `'INDIA'`, `'JAPAN'`.

## Labels

Attach custom labels returned in notification callbacks:

```typescript
const agent = new Agent()
  .withLabels({
    environment: 'production',
    team: 'support',
    version: '1.2.0',
  })
  .withLlm(/* ... */)
  .withTts(/* ... */)
  .withStt(/* ... */);
```

## RTC Encryption

Configure RTC media encryption:

```typescript
const agent = new Agent()
  .withRtc({
    encryption_key: 'your-32-byte-key',
    encryption_mode: 5, // AES_128_GCM
  })
  .withLlm(/* ... */)
  .withTts(/* ... */)
  .withStt(/* ... */);
```

## Filler Words

Play filler words while waiting for the LLM response:

```typescript
const agent = new Agent()
  .withFillerWords({
    enable: true,
    trigger: {
      mode: 'fixed_time',
      fixed_time_config: { response_wait_ms: 2000 },
    },
    content: {
      mode: 'static',
      static_config: {
        phrases: ['Let me think...', 'One moment...', 'Hmm...'],
        selection_rule: 'shuffle',
      },
    },
  })
  .withLlm(/* ... */)
  .withTts(/* ... */)
  .withStt(/* ... */);
```

## Getters

Read back configuration via getter properties:

```typescript
const agent = new Agent({ maxHistory: 20 })
  .withGeofence({ area: 'EUROPE' })
  .withLabels({ env: 'staging' });

agent.name;           // string | undefined
agent.maxHistory;     // 20
agent.geofence;       // { area: 'NORTH_AMERICA' }
agent.labels;         // { env: 'staging' }
agent.sal;            // SalConfig | undefined
agent.advancedFeatures;
agent.parameters;
agent.failureMessage;
agent.rtc;
agent.fillerWords;
agent.config;         // Full read-only snapshot
```

## Chaining All Features

```typescript
import {
  Agent,
  AgoraClient,
  Area,
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
  name: 'full-featured-assistant',
  instructions: 'You are a helpful voice assistant.',
  greeting: 'Hello! How can I help?',
  failureMessage: 'Sorry, I had trouble processing that.',
  maxHistory: 20,
})
  .withLlm(new OpenAI({ apiKey: 'your-key', model: 'gpt-4o-mini' }))
  .withTts(new ElevenLabsTTS({ key: 'your-key', modelId: 'eleven_flash_v2_5', voiceId: 'your-voice-id', sampleRate: 24000 }))
  .withStt(new DeepgramSTT({ apiKey: 'your-key', model: 'nova-2', language: 'en-US' }))
  .withAdvancedFeatures({ enable_rtm: true })
  .withParameters({
    silence_config: { timeout_ms: 8000, action: 'speak', content: 'I\'m listening.' },
    farewell_config: { graceful_enabled: true, graceful_timeout_seconds: 5 },
  })
  .withGeofence({ area: 'NORTH_AMERICA' })
  .withLabels({ app: 'voice-assistant', version: '2.0' })
  .withFillerWords({
    enable: true,
    trigger: { mode: 'fixed_time', fixed_time_config: { response_wait_ms: 1500 } },
    content: {
      mode: 'static',
      static_config: {
        phrases: ['Let me think...', 'One moment please.'],
        selection_rule: 'shuffle',
      },
    },
  });

const session = agent.createSession(client, {
  channel: 'demo-room',
  agentUid: '1',
  remoteUids: ['100'],
  idleTimeout: 120,
});

const agentId = await session.start();
```

## Next steps

- [Agent Reference](../reference/agent.md) — full API signatures
- [Cascading Flow](./cascading-flow.md) — ASR → LLM → TTS setup
- [MLLM Flow](./mllm-flow.md) — multimodal flow with `enable_mllm`
- [Regional Routing](./regional-routing.md) — client area and geofence
