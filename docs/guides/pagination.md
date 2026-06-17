---
sidebar_position: 7
title: Pagination
description: Iterate over paginated list endpoints.
---

# Pagination

List endpoints are paginated. The SDK provides an iterator so you can loop over items:

```typescript
import { AgoraClient, Area } from "agora-agents";

const client = new AgoraClient({
  area: Area.US,
  appId: "your-app-id",
  appCertificate: "your-app-certificate",
});

const pageableResponse = await client.agents.list({ appid: "appid" });

for await (const item of pageableResponse) {
  console.log(item);
}
```

## Manual page-by-page iteration

```typescript
let page = await client.agents.list({ appid: "appid" });

while (page.hasNextPage()) {
  page = page.getNextPage();
}

const response = page.response;
```

## Agent turn analytics

`AgentSession.getTurns()` supports the Conversational AI turn analytics pagination parameters directly:

```typescript
const firstPage = await session.getTurns({ page_index: 1, page_size: 20 });
```

Use `getAllTurns()` when you want AgentKit to fetch and merge every page:

```typescript
const allTurns = await session.getAllTurns({ page_size: 20 });
```

For very long sessions, prefer page-by-page processing with `getTurns()` to avoid holding all turn data in memory.

## Agent turn analytics

`AgentSession.getTurns()` supports the Conversational AI turn analytics pagination parameters directly:

```typescript
const firstPage = await session.getTurns({ page_index: 1, page_size: 20 });
```

Use `getAllTurns()` when you want AgentKit to fetch and merge every page:

```typescript
const allTurns = await session.getAllTurns({ page_size: 20 });
```

For very long sessions, prefer page-by-page processing with `getTurns()` to avoid holding all turn data in memory.
