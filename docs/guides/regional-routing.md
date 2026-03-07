---
sidebar_position: 4
title: Regional Routing
description: Configure the AgoraClient to route requests to the nearest Agora region.
---

# Regional Routing

The `AgoraClient` uses a domain pool to route API requests to the nearest Agora region. This is configured via the `Area` enum.

## Area enum

```typescript
import { Area } from 'agora-agent-sdk';
```

| Value | Region |
|---|---|
| `Area.US` | United States (west + east) |
| `Area.EU` | Europe (west + central) |
| `Area.AP` | Asia-Pacific (southeast + northeast) |
| `Area.CN` | Chinese mainland (east + north) |

Pass the area when creating the client:

```typescript
import { AgoraClient, Area } from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.EU,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
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
import { AgoraClient, Area, Agent, OpenAI, ElevenLabsTTS, DeepgramSTT } from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.EU,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});

const agent = new Agent({ name: 'failover-demo', instructions: 'You are helpful.' })
  .withLlm(new OpenAI({ apiKey: 'your-openai-key', model: 'gpt-4o-mini' }))
  .withTts(new ElevenLabsTTS({ key: 'your-elevenlabs-key', modelId: 'eleven_flash_v2_5', voiceId: 'your-voice-id', sampleRate: 24000 }))
  .withStt(new DeepgramSTT({ apiKey: 'your-deepgram-key' }));

const session = agent.createSession(client, {
  channel: 'my-room',
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
| `client.pool` | Access the underlying `Pool` instance for advanced usage |

```typescript
// Check the current URL
console.log(client.getCurrentURL());
// → "https://api-eu-west-1.agora.io/api/conversational-ai-agent"

// Force a DNS check
await client.selectBestDomain();
```
