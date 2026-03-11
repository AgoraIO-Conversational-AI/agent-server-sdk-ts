---
sidebar_position: 9
title: Low-Level API
description: Direct client.agents.start() usage without the builder pattern.
---

# Low-Level API

For direct control over the REST API, use `client.agents.start()` with raw request objects. See the [API Reference](../../reference.md) for full details.

## Direct client usage

```typescript
import { AgoraClient, Area } from "agora-agent-sdk";

const client = new AgoraClient({
  area: Area.US,
  appId: "your-app-id",
  appCertificate: "your-app-certificate",
});

await client.agents.start({
  appid: "your_app_id",
  name: "unique_name",
  properties: {
    channel: "channel_name",
    token: "your_token",
    agent_rtc_uid: "1001",
    remote_rtc_uids: ["1002"],
    idle_timeout: 120,
    asr: {
      language: "en-US",
      vendor: "deepgram",
      params: { api_key: "your-deepgram-key" },
    },
    tts: {
      vendor: "elevenlabs",
      params: {
        key: "your-elevenlabs-key",
        model_id: "eleven_flash_v2_5",
        voice_id: "your-voice-id",
      },
    },
    llm: {
      url: "https://api.openai.com/v1/chat/completions",
      api_key: "<your_llm_key>",
      system_messages: [{ role: "system", content: "You are a helpful chatbot." }],
      params: { model: "gpt-4o-mini" },
      max_history: 32,
      greeting_message: "Hello, how can I assist you today?",
      failure_message: "Please hold on a second.",
    },
  },
});
```

## Using named types

Use the `Agora` namespace for typed request objects and IDE autocompletion:

```typescript
import { AgoraClient, Area, Agora } from "agora-agent-sdk";

const client = new AgoraClient({
  area: Area.US,
  appId: "your-app-id",
  appCertificate: "your-app-certificate",
});

const tts: Agora.StartAgentsRequest.Properties.Tts = {
  vendor: "elevenlabs",
  params: {
    key: "<your_elevenlabs_key>",
    model_id: "eleven_flash_v2_5",
    voice_id: "<your_voice_id>",
  },
};

const asr: Agora.StartAgentsRequest.Properties.Asr = {
  language: "en-US",
  vendor: Agora.StartAgentsRequest.Properties.Asr.Vendor.Deepgram,
  params: { api_key: "<your_deepgram_key>" },
};

const llm: Agora.StartAgentsRequest.Properties.Llm = {
  url: "https://api.openai.com/v1/chat/completions",
  api_key: "<your_llm_key>",
  system_messages: [{ role: "system", content: "You are a helpful assistant." }],
  params: { model: "gpt-4o-mini" },
  max_history: 32,
  greeting_message: "Hello, how can I assist you today?",
  failure_message: "Please hold on a second.",
};

await client.agents.start({
  appid: "your_app_id",
  name: "unique_agent_name",
  properties: {
    channel: "channel_name",
    token: "your_token",
    agent_rtc_uid: "1001",
    remote_rtc_uids: ["1002"],
    idle_timeout: 120,
    asr,
    tts,
    llm,
  },
});
```

## MLLM (raw API)

For MLLM flow without the builder pattern, pass `mllm` and `turn_detection` directly. See the [MLLM Overview](https://docs.agora.io/en/conversational-ai/models/mllm/overview) for details.

```typescript
import { AgoraClient, Area, Agora } from "agora-agent-sdk";

const client = new AgoraClient({
  area: Area.US,
  appId: "your-app-id",
  appCertificate: "your-app-certificate",
});

const mllm: Agora.StartAgentsRequest.Properties.Mllm = {
  url: "wss://api.openai.com/v1/realtime",
  api_key: "<your_openai_api_key>",
  vendor: Agora.StartAgentsRequest.Properties.Mllm.Vendor.Openai,
  params: { model: "gpt-4o-realtime-preview", voice: "alloy" },
  input_modalities: ["audio"],
  output_modalities: ["text", "audio"],
  greeting_message: "Hello! I'm ready to chat in real-time.",
};

const turnDetection: Agora.StartAgentsRequest.Properties.TurnDetection = {
  type: Agora.StartAgentsRequest.Properties.TurnDetection.Type.ServerVad,
  threshold: 0.5,
  silence_duration_ms: 500,
};

await client.agents.start({
  appid: "your_app_id",
  name: "mllm_agent",
  properties: {
    channel: "channel_name",
    token: "your_token",
    agent_rtc_uid: "1001",
    remote_rtc_uids: ["1002"],
    idle_timeout: 120,
    advanced_features: { enable_mllm: true },
    mllm,
    turn_detection: turnDetection,
    tts: {
      vendor: "elevenlabs",
      params: {
        key: "your-elevenlabs-key",
        model_id: "eleven_flash_v2_5",
        voice_id: "your-voice-id",
      },
    },
    llm: { url: "https://api.openai.com/v1/chat/completions" },
  },
});
```
