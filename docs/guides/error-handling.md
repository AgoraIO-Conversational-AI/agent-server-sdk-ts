---
sidebar_position: 6
title: Error Handling
description: Handle API errors with AgoraError and subclasses.
---

# Error Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of `AgoraError` is thrown.

```typescript
import { AgoraError } from "agora-agents";

try {
  await client.agents.start(...);
} catch (err) {
  if (err instanceof AgoraError) {
    console.log(err.statusCode);
    console.log(err.message);
    console.log(err.body);
    console.log(err.rawResponse);
  }
}
```

## Common Conversational AI responses

The generated core SDK exposes the full API response body on `err.body`. Conversational AI errors commonly use these status codes:

| Status | Meaning |
|---|---|
| `400` | Invalid request parameters |
| `401` | Authentication failed |
| `403` | Unauthorized access or service not enabled |
| `404` | Agent not found or has exited |
| `409` | Agent conflict (duplicate join, conflicting session state) |
| `422` | Access limit exceeded |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `502` | Gateway error |
| `503` | Agent startup failure |
| `504` | Request timeout |

Most error bodies match `AgentErrorResponse` and include a `detail` message and a stable `reason` enum value. Treat `reason` as the machine-readable identifier; keep `detail` for logs or user diagnostics.

```typescript
import { Agora } from "agora-agents";

if (err instanceof AgoraError) {
  const body = err.body as Agora.AgentErrorResponse;
  switch (body.reason) {
    case "ServiceNotEnabled":
    case "AccountSuspended":
    case "InvalidPermission":
    case "InvalidRequestBody":
    case "MissingRequiredField":
    case "InvalidFieldValue":
    case "ResourceQuotaLimitExceeded":
    case "ConcurrencyLimitExceeded":
    case "ServiceUnavailable":
    case "ResourceAllocationFailed":
    case "TaskConflict":
    case "TaskNotFound":
    case "TaskOperationTimeout":
    case "NotImplemented":
    case "InternalError":
      console.error(body.reason, body.detail);
      break;
  }
}
```

See [Error Reference](../reference/errors.md) for v2.7 status code and `reason` migration notes.

## Common Conversational AI responses

The generated core SDK exposes the full API response body on `err.body`. Conversational AI errors commonly use these status codes:

| Status | Meaning |
|---|---|
| `400` | Invalid request parameters |
| `401` | Authentication failed |
| `403` | Unauthorized access or service not enabled |
| `404` | Agent not found or has exited |
| `409` | Agent conflict (duplicate join, conflicting session state) |
| `422` | Access limit exceeded |
| `429` | Rate limit exceeded |
| `500` | Internal server error |
| `502` | Gateway error |
| `503` | Agent startup failure |
| `504` | Request timeout |

Most error bodies match `AgentErrorResponse` and include a `detail` message and a stable `reason` enum value. Treat `reason` as the machine-readable identifier; keep `detail` for logs or user diagnostics.

```typescript
import { Agora } from "agora-agents";

if (err instanceof AgoraError) {
  const body = err.body as Agora.AgentErrorResponse;
  switch (body.reason) {
    case "ServiceNotEnabled":
    case "AccountSuspended":
    case "InvalidPermission":
    case "InvalidRequestBody":
    case "MissingRequiredField":
    case "InvalidFieldValue":
    case "ResourceQuotaLimitExceeded":
    case "ConcurrencyLimitExceeded":
    case "ServiceUnavailable":
    case "ResourceAllocationFailed":
    case "TaskConflict":
    case "TaskNotFound":
    case "TaskOperationTimeout":
    case "NotImplemented":
    case "InternalError":
      console.error(body.reason, body.detail);
      break;
  }
}
```

See [Error Reference](../reference/errors.md) for v2.7 status code and `reason` migration notes.
