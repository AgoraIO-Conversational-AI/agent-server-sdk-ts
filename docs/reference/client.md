---
sidebar_position: 1
title: AgoraClient
description: AgoraClient constructor options and public methods.
---

# AgoraClient

`AgoraClient` extends the Fern-generated base client with domain pool support for regional URL cycling and three authentication modes.

```typescript
import { AgoraClient, Area } from 'agora-agent-sdk';
```

## Constructor

```typescript
const client = new AgoraClient(options: AgoraClient.Options);
```

### Options

| Option | Type | Required | Description |
|---|---|---|---|
| `area` | `Area` | Yes | Region for API routing (`Area.US`, `Area.EU`, `Area.AP`, `Area.CN`) |
| `appId` | `string` | Yes | Agora App ID |
| `appCertificate` | `string` | Yes | Agora App Certificate (keep secret) |
| `customerId` | `string` | No | Customer ID for Basic Auth |
| `customerSecret` | `string` | No | Customer Secret for Basic Auth |
| `authToken` | `string` | No | Pre-built `agora token=<value>` string |
| `timeout` | `number` | No | Request timeout in ms (default from Fern config) |
| `maxRetries` | `number` | No | Max retry attempts (default from Fern config) |
| `fetch` | `typeof fetch` | No | Custom fetch implementation |

Authentication mode is determined by which options you provide:

| Options provided | Resolved mode |
|---|---|
| `customerId` + `customerSecret` | `"basic"` |
| `authToken` | `"token"` |
| Neither | `"app-credentials"` |

See [Authentication](../getting-started/authentication.md) for details on each mode.

## Public properties

| Property | Type | Description |
|---|---|---|
| `appId` | `string` (readonly) | The Agora App ID |
| `appCertificate` | `string` (readonly) | The Agora App Certificate |
| `authMode` | `AgoraAuthMode` (readonly) | `"basic"`, `"token"`, or `"app-credentials"` |
| `pool` | `Pool` (readonly) | The underlying domain pool instance |

## Public methods

### `nextRegion(): void`

Cycle to the next region prefix in the pool. Call this after a request failure to try a different regional endpoint.

### `selectBestDomain(signal?: AbortSignal): Promise<void>`

Trigger a manual DNS resolution check to select the best domain suffix. This runs automatically every 30 seconds, but you can call it manually.

### `getCurrentURL(): string`

Returns the full URL currently being used for API requests (e.g., `https://api-us-west-1.agora.io/api/conversational-ai-agent`).

## Sub-clients

The client exposes Fern-generated sub-clients for direct API access:

| Property | Description |
|---|---|
| `client.agents` | Start, stop, update, speak, interrupt, get history, list agents |
| `client.telephony` | Telephony-related endpoints |
| `client.phoneNumbers` | Phone number management |

See the [API Reference](../../reference.md) for the full sub-client method signatures.
