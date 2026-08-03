---
sidebar_position: 4
title: Regional Routing
description: Configure the AgoraClient to route requests to the nearest Agora region.
---

# Regional Routing

The `AgoraClient` uses a domain pool to route API requests to the nearest Agora region. This is configured via the `Area` enum.

## Area enum

```typescript
import { Area } from 'agora-agents';
```

| Value | Region |
|---|---|
| `Area.US` | United States (west + east) |
| `Area.EU` | Europe (west + central) |
| `Area.AP` | Asia-Pacific (southeast + northeast) |
| `Area.CN` | Chinese mainland (east + north) |

Pass the area when creating the client:

```typescript
import { AgoraClient, Area } from 'agora-agents';

const client = new AgoraClient({
  area: Area.EU,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});
```

## Vendor classes

Import any supported vendor class and pass it to `.withStt()`, `.withLlm()`, `.withTts()`, or `.withMllm()`. `client.area` does not restrict explicit provider choice, and it also determines the default ASR vendor when `.withStt()` is omitted:

- `Area.CN` defaults to `FengmingSTT`
- all other areas default to `AresSTT`

| Typical global providers | Typical CN providers |
|---|---|
| `DeepgramSTT`, `OpenAI`, `MiniMaxTTS`, `AzureOpenAIRealtime`, `GenericTTS`, … | `FengmingSTT`, `AliyunLLM`, `MiniMaxCNTTS`, `QwenOmni`, `GenericTTS`, … |

See the tables below for the full catalog. You may combine any explicit vendor with any `client.area`.
`GenericTTS` is included in both the exported `GlobalTtsVendor` and `CNTtsVendor` types.
MLLM helpers retain their region in the exported `GlobalMllmVendor` and `CNMllmVendor` types: Azure is global and Qwen Omni is CN.

Global client example:

```typescript
import { AgoraClient, Agent, Area, DeepgramSTT, MiniMaxTTS, OpenAI } from 'agora-agents';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({
  client,
  turnDetection: { language: 'en-US' },
})
  .withStt(new DeepgramSTT({ model: 'nova-3', language: 'en-US' }))
  .withLlm(new OpenAI({ model: 'gpt-4o-mini' }))
  .withTts(new MiniMaxTTS({ model: 'speech_2_6_turbo', voiceId: 'English_captivating_female1' }));

const session = agent.createSession({
  name: `conversation-${Date.now()}`,
  channel: `demo-channel-${Date.now()}`,
  agentUid: '1001',
  remoteUids: ['*'],
});
```

CN client example:

```typescript
import { AgoraClient, Agent, Area, AliyunLLM, FengmingSTT, MiniMaxCNTTS } from 'agora-agents';

const client = new AgoraClient({
  area: Area.CN,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({
  client,
  turnDetection: { language: 'zh-CN' },
})
  .withStt(new FengmingSTT())
  .withLlm(new AliyunLLM({
    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    model: 'qwen-plus',
  }))
  .withTts(new MiniMaxCNTTS({
    key: process.env.MINIMAX_API_KEY!,
    model: 'speech-01-turbo',
    voiceSetting: { voice_id: 'female-shaonv' },
    audioSetting: { sample_rate: 16000 },
  }));

const session = agent.createSession({
  name: `conversation-${Date.now()}`,
  channel: `demo-channel-${Date.now()}`,
  agentUid: '1001',
  remoteUids: ['*'],
});
```

## How the domain pool works

Each area has two regional domain prefixes and two domain suffixes. The `Pool` class:

1. Starts with the first regional prefix and the first domain suffix
2. Resolves the best domain suffix via DNS every **30 seconds**
3. Constructs the full URL as `https://{prefix}.{suffix}/api/conversational-ai-agent`

## Region-to-domain mapping

| Area | Primary prefix | Fallback prefix | Primary suffix | Fallback suffix |
|---|---|---|---|---|
| `Area.US` | `api-us-west-1` | `api-us-east-1` | `agora.io` | `sd-rtn.com` |
| `Area.EU` | `api-eu-west-1` | `api-eu-central-1` | `agora.io` | `sd-rtn.com` |
| `Area.AP` | `api-ap-southeast-1` | `api-ap-northeast-1` | `agora.io` | `sd-rtn.com` |
| `Area.CN` | `api-cn-east-1` | `api-cn-north-1` | `sd-rtn.com` | `agora.io` |

Note: `Area.CN` uses `sd-rtn.com` as the primary suffix (optimized for Chinese mainland).

## Manual failover

If a request fails, call `client.nextRegion()` to cycle to the next domain prefix, then retry:

```typescript
import { AgoraClient, Area, Agent, OpenAI, ElevenLabsTTS, DeepgramSTT } from 'agora-agents';

const client = new AgoraClient({
  area: Area.EU,

  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({ client })
  .withLlm(new OpenAI({
    apiKey: 'your-openai-key',
    url: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4o-mini',
    systemMessages: [{ role: 'system', content: 'You are helpful.' }],
  }))
  .withTts(new ElevenLabsTTS({ key: 'your-elevenlabs-key', modelId: 'eleven_flash_v2_5', voiceId: 'your-voice-id', baseUrl: 'wss://api.elevenlabs.io/v1', sampleRate: 24000 }))
  .withStt(new DeepgramSTT({ apiKey: 'your-deepgram-key' }));

const session = agent.createSession({
  name: `conversation-${Date.now()}`,
  channel: `demo-channel-${Date.now()}`,
  agentUid: '1',
  remoteUids: ['100'],
});

try {
  await session.start();
} catch (err) {
  console.warn('First attempt failed, cycling region:', err);
  client.nextRegion();  // Cycle from api-eu-west-1 to api-eu-central-1
  await session.start();  // Retry with fallback prefix
}
```

## Additional methods

| Method | Description |
|---|---|
| `client.nextRegion()` | Cycle to the next domain prefix in the pool |
| `client.selectBestDomain(signal?)` | Trigger a manual DNS resolution check (normally runs every 30s) |
| `client.getCurrentURL()` | Inspect the full URL currently being used for API requests |
| `client.pool` | Access the `Pool` instance for advanced usage |

```typescript
// Check the current URL
console.log(client.getCurrentURL());
// → "https://api-eu-west-1.agora.io/api/conversational-ai-agent"

// Force a DNS check
await client.selectBestDomain();
```
