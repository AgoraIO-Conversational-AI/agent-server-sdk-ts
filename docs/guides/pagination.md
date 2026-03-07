---
sidebar_position: 7
title: Pagination
description: Iterate over paginated list endpoints.
---

# Pagination

List endpoints are paginated. The SDK provides an iterator so you can loop over items:

```typescript
import { AgoraClient, Area } from "agora-agent-sdk";

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
