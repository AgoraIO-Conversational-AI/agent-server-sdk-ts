---
sidebar_position: 1
title: Cascading Flow (ASR → LLM → TTS)
description: Build a voice agent using Speech-to-Text, a text LLM, and Text-to-Speech.
---

# Cascading Flow (ASR → LLM → TTS)

The cascading flow is the default conversation mode: user audio is transcribed by an STT vendor, the text is sent to an LLM, and the response is synthesized back to audio by a TTS vendor.

```
User audio → STT (speech-to-text) → LLM (generate response) → TTS (text-to-speech) → Agent audio
```

## Example 1: OpenAI + ElevenLabs + Deepgram

The most common combination — OpenAI for language, ElevenLabs for natural voice, Deepgram for fast transcription.

### Wrapper approach (recommended)

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
  name: 'cascading-assistant',
  instructions: 'You are a friendly voice assistant. Keep answers short and natural.',
  greeting: 'Hi there! What can I do for you?',
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

const session = agent.createSession(client, {
  channel: 'my-room',
  agentUid: '1',
  remoteUids: ['100'],
  idleTimeout: 120,
});

const agentId = await session.start();
console.log('Agent running:', agentId);

// When done:
await session.stop();
```

### Raw client approach

For advanced use cases where you need full control over the request body:

```typescript
import { AgoraClient, Area, generateRtcToken } from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
  customerId: 'your-customer-id',
  customerSecret: 'your-customer-secret',
});

const token = generateRtcToken({
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
  channel: 'my-room',
  uid: 1,
});

const response = await client.agents.start({
  appid: 'your-app-id',
  name: 'raw-cascading-agent',
  properties: {
    channel: 'my-room',
    token,
    agent_rtc_uid: '1',
    remote_rtc_uids: ['100'],
    idle_timeout: 120,
    llm: {
      url: 'https://api.openai.com/v1/chat/completions',
      api_key: 'your-openai-key',
      params: { model: 'gpt-4o-mini' },
      system_messages: [{ role: 'system', content: 'You are a helpful voice assistant.' }],
      greeting_message: 'Hi there!',
      max_history: 20,
      input_modalities: ['text'],
      style: 'openai',
    },
    tts: {
      vendor: 'elevenlabs',
      params: {
        key: 'your-elevenlabs-key',
        model_id: 'eleven_flash_v2_5',
        voice_id: 'your-voice-id',
        sample_rate: 24000,
      },
    },
    asr: {
      vendor: 'deepgram',
      language: 'en-US',
      params: {
        api_key: 'your-deepgram-key',
        model: 'nova-2',
        language: 'en-US',
      },
    },
  },
});

console.log('Agent ID:', response.agent_id);
```

The agentkit approach is preferred — it handles token generation, vendor serialization, and state management for you.

## Example 2: Azure OpenAI + Microsoft TTS + Microsoft STT

An all-Microsoft stack, useful when you need to stay within Azure.

```typescript
import {
  AgoraClient,
  Area,
  Agent,
  AzureOpenAI,
  MicrosoftTTS,
  MicrosoftSTT,
} from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.EU,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({
  name: 'azure-assistant',
  instructions: 'You are a professional support agent.',
  greeting: 'Welcome! How can I assist you?',
  maxHistory: 15,
})
  .withLlm(new AzureOpenAI({
    apiKey: 'your-azure-openai-key',
    model: 'gpt-4',
    resourceName: 'my-azure-resource',
    deploymentName: 'gpt-4-deployment',
  }))
  .withTts(new MicrosoftTTS({
    key: 'your-azure-speech-key',
    region: 'eastus',
    voiceName: 'en-US-JennyNeural',
    sampleRate: 24000,
  }))
  .withStt(new MicrosoftSTT({
    key: 'your-azure-speech-key',
    region: 'eastus',
    language: 'en-US',
  }));

const session = agent.createSession(client, {
  channel: 'support-room',
  agentUid: '1',
  remoteUids: ['100'],
});

await session.start();
```

## Configuration tips

- **`maxHistory`** controls how many conversation turns are sent to the LLM. Higher values give better context but increase token usage and latency.
- **`instructions`** on the `Agent` is injected as a system message. You can also pass `systemMessages` directly on the LLM vendor for more complex prompt setups.
- **`idleTimeout`** (in `SessionOptions`) auto-stops the agent if no audio activity is detected for the given number of seconds. Set to `0` to disable.

## Next steps

- [MLLM Flow](./mllm-flow.md) — skip the ASR → LLM → TTS pipeline with OpenAI Realtime or Gemini Live
- [Avatar Integration](./avatars.md) — add a visual avatar to the agent
