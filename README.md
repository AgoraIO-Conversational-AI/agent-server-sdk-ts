# Agoraio TypeScript Library

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2Ffern-demo%2Fagoraio-ts-sdk)
[![npm shield](https://img.shields.io/npm/v/agora-sdk)](https://www.npmjs.com/package/agora-sdk)

The Agora Conversational AI SDK provides convenient access to the Agora Conversational AI APIs, 
enabling you to build voice-powered AI agents with support for both cascading flows (ASR -> LLM -> TTS) 
and multimodal flows (MLLM) for real-time audio processing.


## Table of Contents

- [Installation](#installation)
- [Reference](#reference)
- [Usage](#usage)
- [Request and Response Types](#request-and-response-types)
- [Exception Handling](#exception-handling)
- [Pagination](#pagination)
- [Advanced](#advanced)
  - [Additional Headers](#additional-headers)
  - [Additional Query String Parameters](#additional-query-string-parameters)
  - [Retries](#retries)
  - [Timeouts](#timeouts)
  - [Aborting Requests](#aborting-requests)
  - [Access Raw Response Data](#access-raw-response-data)
  - [Logging](#logging)
  - [Runtime Compatibility](#runtime-compatibility)
- [Contributing](#contributing)

## Documentation

API reference documentation is available [here](https://docs.agora.io/en/conversational-ai/overview).

## Installation

```sh
npm i -s agora-sdk
```

## Reference

A full reference for this library is available [here](https://github.com/fern-demo/agoraio-ts-sdk/blob/HEAD/./reference.md).

## MLLM Flow (Multimodal)

For real-time audio processing using OpenAI's Realtime API or Google Gemini Live, use the MLLM (Multimodal Large Language Model) flow instead of the cascading ASR -> LLM -> TTS flow. See the [MLLM Overview](https://docs.agora.io/en/conversational-ai/models/mllm/overview) for more details.

```typescript
import { AgoraClient, Agora } from "agora-sdk";

const client = new AgoraClient({ username: "YOUR_APP_ID", password: "YOUR_APP_CERTIFICATE" });

// Configure MLLM with typed parameters
const mllm: Agora.StartAgentsRequest.Properties.Mllm = {
    url: "wss://api.openai.com/v1/realtime",
    api_key: "<your_openai_api_key>",
    vendor: Agora.StartAgentsRequest.Properties.Mllm.Vendor.Openai,
    params: {
        model: "gpt-4o-realtime-preview",
        voice: "alloy"
    },
    input_modalities: ["audio"],
    output_modalities: ["text", "audio"],
    greeting_message: "Hello! I'm ready to chat in real-time."
};

// Configure turn detection for MLLM
const turnDetection: Agora.StartAgentsRequest.Properties.TurnDetection = {
    type: Agora.StartAgentsRequest.Properties.TurnDetection.Type.ServerVad,
    threshold: 0.5,
    silence_duration_ms: 500
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
        // TTS and LLM are still required but not used when MLLM is enabled
        tts: { vendor: Agora.StartAgentsRequest.Properties.Tts.Vendor.Microsoft, params: {} },
        llm: { url: "https://api.openai.com/v1/chat/completions" }
    }
});
```


## Using Named Types

The SDK exports all request types under the `Agora` namespace. You can use these types for better IDE autocompletion and type safety:

```typescript
import { AgoraClient, Agora } from "agora-sdk";

const client = new AgoraClient({ username: "YOUR_APP_ID", password: "YOUR_APP_CERTIFICATE" });

// Use named types for better type safety and autocompletion
const tts: Agora.StartAgentsRequest.Properties.Tts = {
    vendor: Agora.StartAgentsRequest.Properties.Tts.Vendor.Microsoft,
    params: {
        key: "<your_tts_api_key>",
        region: "eastus",
        voice_name: "en-US-AndrewMultilingualNeural"
    }
};

const llm: Agora.StartAgentsRequest.Properties.Llm = {
    url: "https://api.openai.com/v1/chat/completions",
    api_key: "<your_llm_key>",
    system_messages: [{ role: "system", content: "You are a helpful assistant." }],
    params: { model: "gpt-4o-mini" },
    max_history: 32,
    greeting_message: "Hello, how can I assist you today?",
    failure_message: "Please hold on a second."
};

const asr: Agora.StartAgentsRequest.Properties.Asr = {
    language: "en-US",
    vendor: Agora.StartAgentsRequest.Properties.Asr.Vendor.Deepgram
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
        advanced_features: { enable_aivad: true },
        asr,
        tts,
        llm
    }
});
```


## Usage

Instantiate and use the client with the following:

```typescript
import { AgoraClient } from "agora-sdk";

const client = new AgoraClient({ username: "YOUR_USERNAME", password: "YOUR_PASSWORD" });
await client.agents.start({
    appid: "appid",
    name: "unique_name",
    properties: {
        channel: "channel_name",
        token: "token",
        agent_rtc_uid: "1001",
        remote_rtc_uids: ["1002"],
        idle_timeout: 120,
        advanced_features: {
            enable_aivad: true
        },
        asr: {
            language: "en-US"
        },
        tts: {
            vendor: "microsoft",
            params: {
                "key": "<your_tts_api_key>",
                "region": "eastus",
                "voice_name": "en-US-AndrewMultilingualNeural"
            }
        },
        llm: {
            url: "https://api.openai.com/v1/chat/completions",
            api_key: "<your_llm_key>",
            system_messages: [{
                    "role": "system",
                    "content": "You are a helpful chatbot."
                }],
            params: {
                "model": "gpt-4o-mini"
            },
            max_history: 32,
            greeting_message: "Hello, how can I assist you today?",
            failure_message: "Please hold on a second."
        }
    }
});
```

## Request And Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { Agora } from "agora-sdk";

const request: Agora.StartAgentsRequest = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { AgoraError } from "agora-sdk";

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

## Pagination

List endpoints are paginated. The SDK provides an iterator so that you can simply loop over the items:

```typescript
import { AgoraClient } from "agora-sdk";

const client = new AgoraClient({ username: "YOUR_USERNAME", password: "YOUR_PASSWORD" });
const pageableResponse = await client.agents.list({
    appid: "appid"
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.agents.list({
    appid: "appid"
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}

// You can also access the underlying response
const response = page.response;
```

## Advanced

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option.

```typescript
const response = await client.agents.start(..., {
    headers: {
        'X-Custom-Header': 'custom value'
    }
});
```

### Additional Query String Parameters

If you would like to send additional query string parameters as part of the request, use the `queryParams` request option.

```typescript
const response = await client.agents.start(..., {
    queryParams: {
        'customQueryParamKey': 'custom query param value'
    }
});
```

### Retries

The SDK is instrumented with automatic retries with exponential backoff. A request will be retried as long
as the request is deemed retryable and the number of retry attempts has not grown larger than the configured
retry limit (default: 2).

A request is deemed retryable when any of the following HTTP status codes is returned:

- [408](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/408) (Timeout)
- [429](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429) (Too Many Requests)
- [5XX](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500) (Internal Server Errors)

Use the `maxRetries` request option to configure this behavior.

```typescript
const response = await client.agents.start(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.agents.start(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.agents.start(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Access Raw Response Data

The SDK provides access to raw response data, including headers, through the `.withRawResponse()` method.
The `.withRawResponse()` method returns a promise that results to an object with a `data` and a `rawResponse` property.

```typescript
const { data, rawResponse } = await client.agents.start(...).withRawResponse();

console.log(data);
console.log(rawResponse.headers['X-My-Header']);
```

### Logging

The SDK supports logging. You can configure the logger by passing in a `logging` object to the client options.

```typescript
import { AgoraClient, logging } from "agora-sdk";

const client = new AgoraClient({
    ...
    logging: {
        level: logging.LogLevel.Debug, // defaults to logging.LogLevel.Info
        logger: new logging.ConsoleLogger(), // defaults to ConsoleLogger
        silent: false, // defaults to true, set to false to enable logging
    }
});
```
The `logging` object can have the following properties:
- `level`: The log level to use. Defaults to `logging.LogLevel.Info`.
- `logger`: The logger to use. Defaults to a `logging.ConsoleLogger`.
- `silent`: Whether to silence the logger. Defaults to `true`.

The `level` property can be one of the following values:
- `logging.LogLevel.Debug`
- `logging.LogLevel.Info`
- `logging.LogLevel.Warn`
- `logging.LogLevel.Error`

To provide a custom logger, you can pass in an object that implements the `logging.ILogger` interface.

<details>
<summary>Custom logger examples</summary>

Here's an example using the popular `winston` logging library.
```ts
import winston from 'winston';

const winstonLogger = winston.createLogger({...});

const logger: logging.ILogger = {
    debug: (msg, ...args) => winstonLogger.debug(msg, ...args),
    info: (msg, ...args) => winstonLogger.info(msg, ...args),
    warn: (msg, ...args) => winstonLogger.warn(msg, ...args),
    error: (msg, ...args) => winstonLogger.error(msg, ...args),
};
```

Here's an example using the popular `pino` logging library.

```ts
import pino from 'pino';

const pinoLogger = pino({...});

const logger: logging.ILogger = {
  debug: (msg, ...args) => pinoLogger.debug(args, msg),
  info: (msg, ...args) => pinoLogger.info(args, msg),
  warn: (msg, ...args) => pinoLogger.warn(args, msg),
  error: (msg, ...args) => pinoLogger.error(args, msg),
};
```
</details>


### Runtime Compatibility


The SDK works in the following runtimes:



- Node.js 18+
- Vercel
- Cloudflare Workers
- Deno v1.25+
- Bun 1.0+
- React Native

### Customizing Fetch Client

The SDK provides a way for you to customize the underlying HTTP client / Fetch function. If you're running in an
unsupported environment, this provides a way for you to break glass and ensure the SDK works.

```typescript
import { AgoraClient } from "agora-sdk";

const client = new AgoraClient({
    ...
    fetcher: // provide your implementation here
});
```

## Contributing

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!