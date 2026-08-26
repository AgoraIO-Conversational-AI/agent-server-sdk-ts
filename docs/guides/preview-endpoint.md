---
sidebar_position: 10
title: Preview Endpoint
description: How AgentSession routes preview providers, and how the gateway's agora-feature gate header behaves.
---

# Preview Endpoint

Some providers ship on a preview gateway before they reach the production Conversational AI environment. The standard `AgoraClient` detects these providers when `AgentSession.start()` resolves the request body and routes that session automatically.

Everything in this guide is temporary by design. When a preview provider goes GA it moves to the production gateway and its detection entry disappears.

## Using a preview vendor

```typescript
import {
  Agent,
  AgoraClient,
  Area,
  Gemini,
  GeminiSTT,
  GoogleTTS,
} from 'agora-agents';

const client = new AgoraClient({
  area: Area.US,
  appId: process.env.AGORA_APP_ID!,
  appCertificate: process.env.AGORA_APP_CERTIFICATE!,
});

const googleApiKey = process.env.GOOGLE_API_KEY!;
const session = new Agent({ client })
  .withStt(
    new GeminiSTT({
      apiKey: googleApiKey,
      languageCodes: ['en-US'],
    }),
  )
  .withLlm(new Gemini({ apiKey: googleApiKey, model: 'gemini-2.0-flash' }))
  .withTts(
    new GoogleTTS({
      key: googleApiKey,
      voiceName: 'en-US-Chirp3-HD-Charon',
      languageCode: 'en-US',
    }),
  )
  .createSession({ channel: 'demo', agentUid: '1', remoteUids: ['100'] });

await session.start();
```

Preview routing is session-scoped. Preview session lifecycle calls use the preview host and gate; GA sessions and direct client calls remain on the regional production endpoint.

## The gate header

The gateway routes preview traffic on a single request header:

```
agora-feature: gemini-live
```

| Constant                     | Value           |
| ---------------------------- | --------------- |
| `PREVIEW_FEATURE_HEADER`     | `agora-feature` |
| `PreviewFeatures.GeminiLive` | `gemini-live`   |

`agora-feature` is the header the SDK sends, and the supported way to reach a preview provider.

### The header is not overridable

Session routing pins the detected gate **after** caller-supplied `headers`, so custom headers cannot drop or blank it:

```typescript
const client = new AgoraClient({
  area: Area.US,
  appId,
  appCertificate,
  headers: { 'agora-feature': '', 'x-custom': 'kept' },
});
// Requests still send agora-feature: gemini-live, and x-custom: kept
```

This ordering is deliberate and load-bearing. A preview request that loses the header is not rejected — it routes to the production environment, where the preview providers do not exist.

The header rides every call made through the routed session, including `start`, `say`, `interrupt`, `think`, `update`, history and turn reads, and `stop`. Direct `client.agents.*` calls and `client.stopAgent()` stay production-only.

## Intake node behavior

The gateway decides where a request goes before it validates the body. That produces failure modes that look like outages but are routing problems.

| Symptom                                                    | What it means                                                                                      |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `503` `{"reason":"ServiceUnavailable"}` on `POST .../join` | The gate header was not recognised. The request died before validation, so the body is irrelevant. |
| `401` `Missing authorization header`                       | Routing worked; auth did not.                                                                      |
| `404` `no Route matched with those values`                 | The base URL path is wrong.                                                                        |
| `400` validation error                                     | You are past the gate. The header is fine and the body is the problem.                             |

The 503 is the one that misleads. It reads as a partner-side outage and invites waiting it out, when the fix is usually a one-line header change.

Observed on the `gemini-live` rollout in August 2026, when the gateway had not yet been configured to route on `agora-feature` and every request fell through to a 503. That was fixed server-side on 2026-08-09, so the 503 is not currently reproducible — the mapping is recorded here because it is the failure signature a newly provisioned preview family is most likely to hit first.

### Diagnosing without starting a billable agent

Two probes, neither of which allocates an agent:

1. **`GET .../v2/projects/{appId}/agents`** — a `200` proves host, auth, and routing are all healthy. If this succeeds while `join` fails, the problem is specific to the start path.
2. **A deliberately invalid start body** — send `properties` with no `llm` and no `mllm` at all. A `400` means you are past the gate; a `503` means you are not. This is what separates "my config is wrong" from "my header is wrong".

### Known gap (as of 2026-08-09)

A missing gate header is _intended_ to route to the production environment, where a preview config would fail. In practice an ungated start currently **succeeds** against the preview host, so the fallback is not observable from the client side.

The SDK cannot control the intake node, and this does not affect SDK users because the header is pinned. It matters only for callers hitting the REST API directly, who may get a request that appears to succeed while silently landing in the wrong environment. Flag it to the endpoint owner rather than working around it in SDK code.

## Route detection

Detection reads the resolved request body rather than the vendor classes, so hand-written configs are covered too. This branch keys on `asr.vendor`, using the preview vendor registry in `preview/client.ts`.

## Preview vendors

| Class       | Wire vendor             | Model                        |
| ----------- | ----------------------- | ---------------------------- |
| `GeminiSTT` | `asr.vendor = "gemini"` | `gemini-3.5-transcribe-live` |

`GeminiSTT` is an ASR stage, so it needs an LLM and a TTS vendor alongside it. The sample above uses Gemini LLM and Google TTS with the same Google API key. Mixing in other vendors is still valid; preview routing triggers only on `asr.vendor`.

### ASR language selection

Gemini Transcribe takes `params.language_codes`, an **array**, in place of the singular `params.language` other ASR vendors use.

```typescript
// Auto-detect (the default) — language_codes is not sent at all
new GeminiSTT({ apiKey });

// Commit to one language
new GeminiSTT({ apiKey, languageCodes: ['en-US'] });

// Let the model choose between several
new GeminiSTT({ apiKey, languageCodes: ['en-US', 'es-ES'] });

// Auto-detect, stated outright
new GeminiSTT({ apiKey, languageCodes: [] });
```

`languageCodes` is omitted from the request unless you supply it, which is how the provider spells auto-detect. Omitting the field and sending `[]` mean the same thing.

`GeminiSTT` takes **no `language` option**. `Agent` always derives the top-level `asr.language` from `turnDetection.language` — as it does for every STT vendor — so a vendor-level copy would be a no-op the builder overwrites. Set the interaction language on `turnDetection`, and the transcription languages on `languageCodes`; they are separate settings and neither feeds the other.

| Setting                 | Where it belongs              | What it controls            |
| ----------------------- | ----------------------------- | --------------------------- |
| interaction language    | `turnDetection.language`      | top-level `asr.language`    |
| transcription languages | `languageCodes` on the vendor | `asr.params.language_codes` |

`customVocabulary` biases recognition toward words the model would otherwise mis-hear — product names, jargon, proper nouns. It is omitted from the request entirely when unset.

```typescript
new GeminiSTT({ apiKey, customVocabulary: ['Agora', 'Kubernetes'] });
```

`wordTimestamp` is also omitted unless you set it explicitly. Gemini does not support enabled word timestamps together with `customVocabulary`, so `toConfig()` throws if both are requested. Explicit `wordTimestamp: false` remains compatible with custom vocabulary.

```typescript
new GeminiSTT({ apiKey, wordTimestamp: true });
```

## The vendor class is not the whole wire shape

A vendor class emitting the right object is not proof of what ships, because `Agent.toProperties` **also writes into the vendor config** after the vendor is done with it — using the Agora schema spellings, which are correct for every GA provider but need not match what a preview route reads.

Every field the shared builder injects is listed below. Each one is a candidate for a silent mismatch on a preview route:

| Category | Field                                                                                       | Written from                                                                              | When                                     |
| -------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------- |
| `mllm`   | `greeting_message`                                                                          | agent-level `greeting`                                                                    | only when the vendor left it unset       |
| `mllm`   | `failure_message`                                                                           | agent-level `failureMessage`                                                              | only when the vendor left it unset       |
| `mllm`   | `enable`                                                                                    | `withMllm()`                                                                              | always                                   |
| `asr`    | `language`                                                                                  | turn detection `language`                                                                 | **always — overwrites any vendor value** |
| `llm`    | `system_messages`, `greeting_message`, `greeting_configs`, `failure_message`, `max_history` | agent-level `instructions`, `greeting`, `greetingConfigs`, `failureMessage`, `maxHistory` | only when the vendor left them unset     |

So when a preview provider documents a field that appears in that table, putting it on the vendor class is not the whole fix. One of three things applies:

- **The builder always overwrites it** (`asr.language`) — do not expose it on the vendor class at all; it would be an argument the builder silently discards. `GeminiSTT` takes no `language` for exactly this reason.
- **It is an Agora engine field rather than the provider's** (`failure_message`) — leave it in the schema spelling.
- **The preview route spells it differently** — the translation belongs in `preview/client.ts`, applied at session start, so it disappears with `preview/` at GA rather than leaving a vestigial hook in the shared builder. Nothing in this release needs one, but a future preview family may.

### Verify against the request body, not the vendor output

`toConfig()` returning the right object proves nothing about what ships, because the builder runs after it. Both checks are needed:

1. A unit test on the vendor class, for the fields the vendor owns.
2. An **end-to-end test that starts a session against a mock transport and asserts on the captured request body** — the only check that sees the builder's injections. Every preview vendor has one in `tests/unit/agentkit/preview.test.ts`.

The manual version is `debug: true`, which logs the fully resolved body. Diff it against the payload the provider documented, key by key. A value sitting under a name the route ignores fails **silently** — no error, no validation complaint, the agent simply never greets. That is the failure mode this whole section exists to catch, and it is invisible to type checking, to schema validation, and to any test that stops at the vendor class.

Wire parity across the three SDKs is a hard requirement, so a change here lands in TypeScript, Python, and Go together, verified by diffing the serialized bodies.

## Base URL

```
https://partner.ai.agora.io/preview/api/conversational-ai-agent
```

Request paths append to it exactly as they do in production — `POST {base}/v2/projects/{appId}/join`. The service path segment is part of the base: `https://partner.ai.agora.io/preview/api/` alone returns `404 no Route matched with those values`.

The preview host is a single partner endpoint with no regional replicas. `PREVIEW_API_BASE_URL` in `preview/client.ts` is the internal session routing target; the public client has no preview-host override.

## Adding a future preview family

Everything preview-only lives under `src/agentkit/preview/` so it can be deleted wholesale at GA. To add a family:

1. Add an entry to `PreviewFeatures` in `preview/client.ts`. The value is what goes in the `agora-feature` header.
2. Add the vendor classes to `preview/vendors.ts`, extending the same `BaseSTT` / `BaseMLLM` / `BaseLLM` bases as production vendors so the builder accepts them unchanged.
3. Register the detection keys — for an ASR family, the vendor name in `PREVIEW_ASR_VENDORS` — so `requiredPreviewFeatures()` recognises configs that need the new family.
4. Export from `preview/index.ts`, `agentkit/index.ts`, and `src/index.ts`.
5. **Diff the resolved request body against the payload the provider documented**, not the vendor class output — see [The vendor class is not the whole wire shape](#the-vendor-class-is-not-the-whole-wire-shape).
6. Add an end-to-end test that starts a session and asserts on the captured body, alongside the vendor-class unit test.

If the generated request types do not model the new provider (a preview ASR vendor missing from the closed `Asr` union, for example), widen the AgentKit-level type in `agentkit/types.ts` rather than editing generated code. Generated files are overwritten on the next Fern run; `.fernignore` protects `src/agentkit/`.

At GA, delete `preview/` and move the vendor classes into `vendors/stt.ts`.

## Debug output

`debug: true` on a session logs the resolved start request. The body passes through `redactSecrets` first, which replaces vendor API keys, the RTC token, and the App ID with `[REDACTED]` while leaving model names, voices, and instructions readable. Headers pass through `redactHeadersForDebug`, which keeps the auth scheme but drops the credential (`agora [REDACTED]`) and leaves `agora-feature` visible.

```typescript
const session = agent.createSession({
  channel,
  agentUid,
  remoteUids,
  debug: true,
});
```

```
[Agora Debug] API Endpoint: https://partner.ai.agora.io/preview/api/conversational-ai-agent
[Agora Debug] Headers: { "agora-feature": "gemini-live", "Authorization": "agora [REDACTED]" }
[Agora Debug] Request: { "appid": "[REDACTED]", "properties": { "asr": { "params": { "api_key": "[REDACTED]", ... } } } }
```

Empty strings are left visible on purpose: `""` is the signature of an unset environment variable, and hiding it would disguise the exact misconfiguration the debug output exists to surface. `redactSecrets` and `redactHeadersForDebug` are exported if you want the same treatment for your own logging; neither mutates its input, so the request on the wire is untouched.

## Related

- [Regional Routing](./regional-routing.md) — the production domain pool the preview client bypasses
- [Error Handling](./error-handling.md) — `AgoraError` and status code handling
- [Advanced](./advanced.md) — custom headers, retries, timeouts, and the custom fetcher
