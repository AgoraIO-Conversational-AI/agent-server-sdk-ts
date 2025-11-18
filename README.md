# Agoraio TypeScript Library

[![fern shield](https://img.shields.io/badge/%F0%9F%8C%BF-Built%20with%20Fern-brightgreen)](https://buildwithfern.com?utm_source=github&utm_medium=github&utm_campaign=readme&utm_source=https%3A%2F%2Fgithub.com%2Ffern-demo%2Fagoraio-ts-sdk)
[![npm shield](https://img.shields.io/npm/v/agora-sdk)](https://www.npmjs.com/package/agora-sdk)

The Agoraio TypeScript library provides convenient access to the Agoraio APIs from TypeScript.

## Table of Contents

- [Table of Contents](#table-of-contents)
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
    - [Runtime Compatibility](#runtime-compatibility)
- [Contributing](#contributing)

## Table of Contents

- [Installation](#installation)
- [Reference](#reference)
- [Usage](#usage)
- [Request and Response Types](#request-and-response-types)
- [Exception Handling](#exception-handling)
- [Advanced](#advanced)
    - [Additional Headers](#additional-headers)
    - [Additional Query String Parameters](#additional-query-string-parameters)
    - [Retries](#retries)
    - [Timeouts](#timeouts)
    - [Aborting Requests](#aborting-requests)
    - [Access Raw Response Data](#access-raw-response-data)
    - [Runtime Compatibility](#runtime-compatibility)
- [Contributing](#contributing)

## Installation

```sh
npm i -s agora-sdk
```

## Reference

A full reference for this library is available [here](https://github.com/fern-demo/agoraio-ts-sdk/blob/HEAD/./reference.md).

## Usage

Instantiate and use the client with the following:

```typescript
import { AgoraClient } from "agora-sdk";

const client = new AgoraClient({ username: "YOUR_USERNAME", password: "YOUR_PASSWORD" });
await client.agentManagement.start("appid", {
    name: "unique_name",
    properties: {
        channel: "channel_name",
        token: "token",
        agent_rtc_uid: "1001",
        remote_rtc_uids: ["1002"],
        idle_timeout: 120,
        advanced_features: {
            enable_aivad: true,
        },
        asr: {
            language: "en-US",
        },
        tts: {
            vendor: "microsoft",
            params: {
                key: "<your_tts_api_key>",
                region: "eastus",
                voice_name: "en-US-AndrewMultilingualNeural",
            },
        },
        llm: {
            url: "https://api.openai.com/v1/chat/completions",
            api_key: "<your_llm_key>",
            system_messages: [
                {
                    role: "system",
                    content: "You are a helpful chatbot.",
                },
            ],
            params: {
                model: "gpt-4o-mini",
            },
            max_history: 32,
            greeting_message: "Hello, how can I assist you today?",
            failure_message: "Please hold on a second.",
        },
    },
});
```

## Request and Response Types

The SDK exports all request and response types as TypeScript interfaces. Simply import them with the
following namespace:

```typescript
import { Agora } from "agora-sdk";

const request: Agora.AgentManagementStartRequest = {
    ...
};
```

## Exception Handling

When the API returns a non-success status code (4xx or 5xx response), a subclass of the following error
will be thrown.

```typescript
import { AgoraError } from "agora-sdk";

try {
    await client.agentManagement.start(...);
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
const response = await client.agentManagement.list("appid", {
    channel: "channel",
    from_time: 1.1,
    to_time: 1.1,
    state: "0",
    limit: 1,
    cursor: "cursor",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.agentManagement.list("appid", {
    channel: "channel",
    from_time: 1.1,
    to_time: 1.1,
    state: "0",
    limit: 1,
    cursor: "cursor",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

## Advanced

### Additional Headers

If you would like to send additional headers as part of the request, use the `headers` request option.

```typescript
const response = await client.agentManagement.start(..., {
    headers: {
        'X-Custom-Header': 'custom value'
    }
});
```

### Additional Query String Parameters

If you would like to send additional query string parameters as part of the request, use the `queryParams` request option.

```typescript
const response = await client.agentManagement.start(..., {
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
const response = await client.agentManagement.start(..., {
    maxRetries: 0 // override maxRetries at the request level
});
```

### Timeouts

The SDK defaults to a 60 second timeout. Use the `timeoutInSeconds` option to configure this behavior.

```typescript
const response = await client.agentManagement.start(..., {
    timeoutInSeconds: 30 // override timeout to 30s
});
```

### Aborting Requests

The SDK allows users to abort requests at any point by passing in an abort signal.

```typescript
const controller = new AbortController();
const response = await client.agentManagement.start(..., {
    abortSignal: controller.signal
});
controller.abort(); // aborts the request
```

### Access Raw Response Data

The SDK provides access to raw response data, including headers, through the `.withRawResponse()` method.
The `.withRawResponse()` method returns a promise that results to an object with a `data` and a `rawResponse` property.

```typescript
const { data, rawResponse } = await client.agentManagement.start(...).withRawResponse();

console.log(data);
console.log(rawResponse.headers['X-My-Header']);
```

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
