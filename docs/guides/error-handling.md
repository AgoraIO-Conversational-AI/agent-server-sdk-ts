---
sidebar_position: 6
title: Error Handling
description: Handle API errors with AgoraError and subclasses.
---

# Error Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of `AgoraError` is thrown.

```typescript
import { AgoraError } from "agora-agent-sdk";

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
