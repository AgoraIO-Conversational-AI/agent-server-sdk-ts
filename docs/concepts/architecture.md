---
sidebar_position: 1
title: Architecture
description: How the TypeScript SDK layers are structured and when to use each.
---

# Architecture

The SDK is built in two layers: a hand-written agentkit on top of a Fern-generated core.

```
┌──────────────────────────────────────────────────────────┐
│                    Developer API                         │
│  Agent  ·  AgentSession  ·  Vendors  ·  Token helpers    │  ← agentkit/ (hand-written)
├──────────────────────────────────────────────────────────┤
│               AgoraClient / Pool                         │  ← AgoraPoolClient (hand-written)
├──────────────────────────────────────────────────────────┤
│            Fern-generated Client Core                    │
│  client.agents  ·  client.telephony  ·  Type system      │  ← auto-generated, do not edit
└──────────────────────────────────────────────────────────┘
```

## When to use each layer

| Use case | Layer | Entry point |
|---|---|---|
| Start a voice agent with typed vendor config | Agentkit | `new Agent().withLlm().withTts().withStt()` |
| Manage session lifecycle and events | Agentkit | `session.start()`, `session.stop()`, `session.on()` |
| Auto-generate RTC/ConvoAI tokens | Agentkit | App-credentials auth mode, `generateRtcToken()` |
| Access a new API endpoint not yet in the agentkit | Raw client | `session.raw.someNewEndpoint()` |
| Build custom `StartAgentsRequest` bodies | Raw client | `client.agents.start({ appid, name, properties })` |
| Use advanced `mllm` or vendor params not in typed classes | Raw client | Pass raw config objects directly |

## What Fern generates vs. what is hand-written

**Fern-generated** (from `agoraio-fern-config/fern/openapi.yaml`):
- `Client` base class with sub-clients (`agents`, `telephony`, `phoneNumbers`)
- Request/response types for every API endpoint
- Error types (`AgoraError`, `AgoraTimeoutError`)
- The `reference.md` file at the repo root

**Hand-written** (protected by `.fernignore`):
- `AgoraPoolClient.ts` — `AgoraClient` with regional domain pool, three auth modes
- `agentkit/Agent.ts` — immutable builder pattern with phantom-type avatar safety
- `agentkit/AgentSession.ts` — state machine, events, lifecycle methods
- `agentkit/vendors/` — typed vendor classes for all LLM, TTS, STT, MLLM, and Avatar providers
- `agentkit/token.ts` — RTC and ConvoAI token generation
- `core/domain/index.ts` — `Area` enum, `Pool` class, DNS-based domain selection

The Fern-generated `reference.md` documents the raw client layer. This documentation covers the agentkit layer.
