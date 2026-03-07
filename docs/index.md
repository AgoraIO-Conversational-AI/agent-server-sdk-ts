---
sidebar_position: 1
title: Overview
description: The Agora Conversational AI TypeScript SDK — install, concepts, and examples.
---

# Agora Conversational AI TypeScript SDK

The `agora-agent-sdk` package lets you build real-time voice AI agents on the [Agora Conversational AI](https://docs.agora.io/en/conversational-ai/overview) platform. Create agents that listen, think, and speak — powered by any combination of LLM, TTS, and STT providers.

## Two conversation flows

**Cascading flow** — Speech-to-text feeds a text LLM, whose output is synthesized back to speech (ASR → LLM → TTS). This is the default path and supports the widest range of vendor combinations.

**MLLM flow** — A multimodal model (OpenAI Realtime or Vertex AI Gemini Live) handles audio end-to-end with no separate STT or TTS step. Lower latency for real-time conversation.

## SDK layers

The SDK has two layers:

| Layer | What it does | When to use |
|---|---|---|
| **Agentkit** (`Agent`, `AgentSession`, vendor classes) | High-level builder pattern, session lifecycle, typed vendors, automatic token generation | Most use cases |
| **Fern-generated core** (`client.agents`, `client.telephony`) | Direct REST client mapping every API endpoint | Advanced use cases requiring full control over request bodies |

The agentkit layer is built on top of the generated core. You can drop down to the raw client at any time via `session.raw`.

## Install

```sh
npm install agora-agent-sdk
```

## Documentation

| Section | What you will find |
|---|---|
| [Installation](./getting-started/installation.md) | Prerequisites, package managers, runtime compatibility |
| [Authentication](./getting-started/authentication.md) | App credentials, pre-built tokens, Basic Auth |
| [Quick Start](./getting-started/quick-start.md) | End-to-end cascading flow example |
| [Architecture](./concepts/architecture.md) | Two-layer design, when to use agentkit vs. raw client |
| [Agent](./concepts/agent.md) | Builder pattern, immutable reuse, vendor configuration |
| [AgentSession](./concepts/session.md) | State machine, lifecycle methods, events |
| [Vendors](./concepts/vendors.md) | LLM, TTS, STT, MLLM, and Avatar provider catalog |
| [Cascading Flow Guide](./guides/cascading-flow.md) | Step-by-step ASR → LLM → TTS |
| [MLLM Flow Guide](./guides/mllm-flow.md) | OpenAI Realtime and Vertex AI Gemini Live |
| [Avatar Integration](./guides/avatars.md) | HeyGen and Akool with sample-rate constraints |
| [Regional Routing](./guides/regional-routing.md) | Area enum, domain pool, failover |
| [Error Handling](./guides/error-handling.md) | AgoraError and API error handling |
| [Pagination](./guides/pagination.md) | Iterate over paginated list endpoints |
| [Advanced](./guides/advanced.md) | Headers, retries, timeouts, logging, custom fetcher |
| [Low-Level API](./guides/low-level-api.md) | Direct client.agents.start() without builder |
| [AgoraClient Reference](./reference/client.md) | Constructor options, public methods |
| [Agent Reference](./reference/agent.md) | Full builder API with TypeScript signatures |
| [AgentSession Reference](./reference/session.md) | All methods, events, and payload types |
| [Vendor Reference](./reference/vendors.md) | Constructor options for every vendor class |

For Fern-generated raw API types, see the [API Reference](../../reference.md).
