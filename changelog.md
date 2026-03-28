# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

## [v1.2.0] — 2026-03-27

### Fixed

- **`AresSTT`** — Removed redundant `language` key from the `params` dict. Language is now emitted only at the top level. `params` is only included when `additionalParams` is provided.
- **`OpenAIRealtime` / `VertexAI` (MLLM)** — Agent-level `greeting`, `failureMessage`, and `maxHistory` overrides are now correctly applied when the agent is in MLLM mode. Previously these values were silently dropped.
- **`VertexAI` (MLLM)** — `messages` is now correctly placed inside `params` (required by the Gemini Live API). Previously it was emitted at the top level and silently ignored.

### Changed

- **`OpenAITTS`** — Renamed constructor option `key` → `apiKey` to match the Agora server API expectation. ⚠️ **Breaking change.**
- **`CartesiaTTS`** — Renamed constructor option `key` → `apiKey`. Voice is now serialized as `{"mode": "id", "id": "<voiceId>"}` instead of a flat `voice_id` string. ⚠️ **Breaking change.**
- **`HeyGenAvatar`** — Removed legacy options `avatarName`, `voiceId`, `language`, `version`. Added `agoraToken`, `avatarId`, `enable`, `disableIdleTimeout`, `activityIdleTimeout`. The config now includes a top-level `enable` field (defaults `true`). ⚠️ **Breaking change.**

### Added

- **`OpenAITTS`** — New optional parameters: `responseFormat` (string, e.g. `"pcm"`) and `speed` (number).
- **`CartesiaTTS`** — `voiceId` user-facing option is preserved; voice is serialized to the required nested object format automatically.
- **`RimeTTS`** — New optional parameters: `lang` (string), `samplingRate` (number, serialized as `samplingRate`), `speedAlpha` (number, serialized as `speedAlpha`).
- **`OpenAIRealtime`** — New optional parameters: `predefinedTools` (string[]), `failureMessage` (string), `maxHistory` (number).
- **`VertexAI` (MLLM)** — New optional parameters: `predefinedTools` (string[]), `failureMessage` (string), `maxHistory` (number).
- **`HeyGenAvatar`** — New options: `agoraToken` (string), `avatarId` (string), `enable` (boolean, default `true`), `disableIdleTimeout` (boolean), `activityIdleTimeout` (number).

## [v1.1.0] — 2026-03-17

### Fixed

- `ElevenLabsTTS`: added missing voice tuning params — `optimizeStreamingLatency`, `stability`, `similarityBoost`, `style`, `useSpeakerBoost`
- `Gemini` LLM: `toConfig()` now serializes `temperature`, `topP`, `topK`, and `maxOutputTokens` (fields existed on the interface but were silently dropped)
- `AzureOpenAI` LLM: corrected default `apiVersion` from `2023-05-15` to `2024-08-01-preview`
- `SpeechmaticsSTT`, `SarvamSTT`: added optional `model` field

## [v1.0.0] — 2026-03-11

Initial stable release of the Agora Agent Server SDK for TypeScript.

### Added

- `Agent` builder with fluent API (`.withLlm()`, `.withTts()`, `.withStt()`, `.withMllm()`, `.withAvatar()`)
- `AgentSession` for session lifecycle management (`start()`, `stop()`)
- Automatic token generation — pass `appId` + `appCertificate` and tokens are handled internally
- Token utilities: `generateRtcToken`, `generateConvoAIToken`, `ExpiresIn.hours()`, `ExpiresIn.minutes()`
- Turn detection configuration via `TurnDetectionConfig` with nested `StartOfSpeechConfig` and `EndOfSpeechConfig`
- SAL (Selective Attention Locking) via `SalConfig` with `SalMode`
- Filler words support: `FillerWordsConfig`, `FillerWordsTrigger`, `FillerWordsContent`
- Session parameters: `SessionParams`, `SilenceConfig`, `FarewellConfig`, `ParametersDataChannel`
- Geofencing via `GeofenceConfig`
- Advanced features (MLLM mode) via `AdvancedFeatures`
- Type-safe constants: `DataChannel`, `SilenceActionValues`, `SalModeValues`, `Geofence`, `FillerWordsSelectionRule`, `TurnDetectionTypeValues`
- Vendor integrations:
  - **LLM**: `OpenAI`, `AzureOpenAI`, `Anthropic`, `Gemini`, `VertexAI`
  - **MLLM**: `OpenAIRealtime`
  - **TTS**: `ElevenLabsTTS`, `MicrosoftTTS`, `OpenAITTS`, `CartesiaTTS`, `GoogleTTS`, `AmazonTTS`, `HumeAITTS`, `RimeTTS`, `FishAudioTTS`, `MiniMaxTTS`, `SarvamTTS`
  - **STT**: `DeepgramSTT`, `MicrosoftSTT`, `OpenAISTT`, `GoogleSTT`, `AmazonSTT`, `AssemblyAISTT`, `AresSTT`, `SarvamSTT`, `SpeechmaticsSTT`
  - **Avatar**: `HeyGenAvatar`, `AkoolAvatar`
