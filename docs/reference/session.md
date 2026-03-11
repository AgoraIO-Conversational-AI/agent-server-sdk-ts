---
sidebar_position: 3
title: AgentSession
description: Full API reference for the AgentSession class.
---

# AgentSession Reference

```typescript
import { AgentSession } from 'agora-agent-sdk';
```

Create sessions via [`agent.createSession()`](./agent.md) — not by calling the constructor directly.

## State machine

```
idle ──► starting ──► running ──► stopping ──► stopped
                         │
                         ▼
                       error
```

| Transition | Trigger |
|---|---|
| `idle → starting` | `start()` called |
| `starting → running` | API responds with agent ID |
| `starting → error` | API request fails |
| `running → stopping` | `stop()` called |
| `stopping → stopped` | API confirms agent stopped |
| `stopping → error` | Stop request fails (and agent was not already stopped) |
| `running → error` | Unrecoverable error during interaction |

`start()` can also be called from `stopped` or `error` state to restart.

## Methods

### `start(): Promise<string>`

Start the agent session. Validates avatar/TTS configuration, sends the start request, and returns the agent ID.

- Transitions: `idle` / `stopped` / `error` → `starting` → `running`
- Throws if called in `starting`, `running`, or `stopping` state
- Throws if avatar config is invalid (wrong TTS sample rate)

### `stop(): Promise<void>`

Stop the agent session. If the agent has already stopped (e.g., timed out), resolves silently instead of throwing a 404 error.

- Transitions: `running` → `stopping` → `stopped`
- Throws if called outside `running` state

### `say(text: string, options?: SayOptions): Promise<void>`

Instruct the agent to speak the given text.

- Only valid in `running` state
- `options.priority`: `SpeakPriority` — message priority
- `options.interruptable`: `boolean` — whether this message can be interrupted

### `interrupt(): Promise<void>`

Interrupt the agent's current speech.

- Only valid in `running` state

### `update(config: AgentConfigUpdate): Promise<void>`

Update the agent configuration mid-session (LLM params, instructions, etc.).

- Only valid in `running` state
- Accepts a partial configuration object

### `getHistory(): Promise<ConversationHistory>`

Fetch the conversation history for this session.

- Requires a valid `agentId` (i.e., `start()` must have been called)

### `getInfo(): Promise<SessionInfo>`

Fetch current agent metadata from the API.

- Requires a valid `agentId`

### `on<T>(event: AgentSessionEvent, handler: AgentSessionEventHandler<T>): void`

Subscribe to a session event.

### `off<T>(event: AgentSessionEvent, handler: AgentSessionEventHandler<T>): void`

Unsubscribe from a session event.

## Events

| Event | Payload type | Description |
|---|---|---|
| `"started"` | `{ agentId: string }` | Agent successfully joined the channel |
| `"stopped"` | `{ agentId: string }` | Agent left the channel |
| `"error"` | `Error` | An unrecoverable error occurred |

Event type: `AgentSessionEvent = "started" | "stopped" | "error"`

Handler type: `AgentSessionEventHandler<T> = (data: T) => void`

## Properties

| Property | Type | Description |
|---|---|---|
| `status` | `"idle" \| "starting" \| "running" \| "stopping" \| "stopped" \| "error"` | Current session state |
| `id` | `string \| null` | Agent ID (populated after `start()` resolves) |
| `agent` | `Agent` | The agent configuration this session was created from |
| `appId` | `string` | The App ID for this session |
| `raw` | `AgentsClient` | Direct access to the Fern-generated `AgentsClient` for advanced operations |

### Using `session.raw`

Access the underlying Fern-generated client to call endpoints not yet wrapped:

```typescript
await session.raw.someNewEndpoint({
  appid: session.appId,
  agentId: session.id!,
});
```

You must pass `appid` and `agentId` manually when using raw methods.
