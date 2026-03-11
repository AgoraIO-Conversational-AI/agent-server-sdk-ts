---
sidebar_position: 8
title: Advanced
description: Headers, retries, timeouts, logging, and custom fetch client.
---

# Advanced

## Additional Headers

Send additional headers with the `headers` request option:

```typescript
const response = await client.agents.start(..., {
  headers: { "X-Custom-Header": "custom value" },
});
```

## Additional Query String Parameters

Use the `queryParams` request option:

```typescript
const response = await client.agents.start(..., {
  queryParams: { customQueryParamKey: "custom query param value" },
});
```

## Retries

The SDK retries automatically with exponential backoff. A request is retried when it returns:

- **408** (Timeout)
- **429** (Too Many Requests)
- **5XX** (Internal Server Errors)

Default retry limit: 2. Override with `maxRetries`:

```typescript
const response = await client.agents.start(..., {
  maxRetries: 0,
});
```

## Timeouts

Default timeout: 60 seconds. Override with `timeoutInSeconds`:

```typescript
const response = await client.agents.start(..., {
  timeoutInSeconds: 30,
});
```

## Aborting Requests

Pass an abort signal to cancel a request:

```typescript
const controller = new AbortController();
const response = await client.agents.start(..., {
  abortSignal: controller.signal,
});
controller.abort();
```

## Access Raw Response Data

Use `.withRawResponse()` to get headers and raw response:

```typescript
const { data, rawResponse } = await client.agents.start(...).withRawResponse();

console.log(data);
console.log(rawResponse.headers["X-My-Header"]);
```

## Logging

Configure the logger via client options:

```typescript
import { AgoraClient, logging } from "agora-agent-sdk";

const client = new AgoraClient({
  area: Area.US,
  appId: "your-app-id",
  appCertificate: "your-app-certificate",
  logging: {
    level: logging.LogLevel.Debug,
    logger: new logging.ConsoleLogger(),
    silent: false,
  },
});
```

Log levels: `Debug`, `Info`, `Warn`, `Error`.

### Custom logger

Implement the `logging.ILogger` interface:

```typescript
import winston from "winston";

const winstonLogger = winston.createLogger({ ... });

const logger: logging.ILogger = {
  debug: (msg, ...args) => winstonLogger.debug(msg, ...args),
  info: (msg, ...args) => winstonLogger.info(msg, ...args),
  warn: (msg, ...args) => winstonLogger.warn(msg, ...args),
  error: (msg, ...args) => winstonLogger.error(msg, ...args),
};
```

## Runtime Compatibility

The SDK works in:

- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

## Customizing Fetch Client

Provide a custom `fetcher` for unsupported environments:

```typescript
import { AgoraClient } from "agora-agent-sdk";

const client = new AgoraClient({
  area: Area.US,
  appId: "your-app-id",
  appCertificate: "your-app-certificate",
  fetcher: (url, init) => fetch(url, init), // your implementation
});
```
