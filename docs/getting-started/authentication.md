---
sidebar_position: 2
title: Authentication
description: Configure AgoraClient with app credentials, pre-built tokens, or Basic Auth.
---

# Authentication

The `AgoraClient` supports three authentication modes. App credentials is the recommended default.

## App credentials (recommended)

The SDK auto-generates a short-lived ConvoAI token per API call using your `appId` and `appCertificate`. No Customer Secret required.

```typescript
import { AgoraClient, Area } from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
});
```

This is the simplest setup. The generated token is scoped to a single App ID and channel, and refreshes automatically on each request.

## Pre-built token

Generate the token yourself (for example using `generateConvoAIToken`) and pass it directly. This gives you full control over the token lifecycle.

```typescript
import { AgoraClient, Area, generateConvoAIToken } from 'agora-agent-sdk';

const token = generateConvoAIToken({
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
  channelName: 'your-channel',
  account: '1001',
  tokenExpire: 3600,
});

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
  authToken: `agora token=${token}`,
});
```

## Basic Auth (Customer ID + Secret)

Use credentials from **Agora Console → Developer Toolkit → RESTful API**. This grants account-wide access — avoid for new projects.

```typescript
import { AgoraClient, Area } from 'agora-agent-sdk';

const client = new AgoraClient({
  area: Area.US,
  appId: 'your-app-id',
  appCertificate: 'your-app-certificate',
  customerId: 'your-customer-id',
  customerSecret: 'your-customer-secret',
});
```

## Comparison

| Mode | When to use | Security note |
|---|---|---|
| App credentials | Default choice; no server-side token service needed | Certificate scoped to a single App ID |
| Pre-built token | When you need full control over token lifecycle | Token is short-lived and channel-scoped |
| Basic Auth | Legacy integrations; avoid for new projects | Customer Secret grants access to all projects on the account |

The client exposes the resolved mode via `client.authMode` (returns `"app-credentials"`, `"token"`, or `"basic"`).
