/**
 * Agentkit layer for the Agora Conversational AI SDK.
 *
 * This module provides a cleaner, more ergonomic API on top of the
 * Fern-generated SDK types and methods.
 *
 * ## Maintenance Notes
 *
 * This agentkit is designed to minimize maintenance burden:
 *
 * 1. **Type aliases** (in types.ts) re-export Fern types directly.
 *    When Fern adds new fields, they're automatically available.
 *
 * 2. **The `raw` property** on AgentSession exposes the underlying
 *    Fern-generated AgentsClient. When Fern adds new endpoints,
 *    they're immediately available via `session.raw.newEndpoint()`.
 *
 * 3. **Convenience methods** (say, stop, interrupt, etc.) are the only
 *    parts that need manual updates when adding new sugar.
 */

// Core classes
export { Agent } from "./Agent.js";
export type { AgentOptions } from "./Agent.js";

export { AgentSession } from "./AgentSession.js";

// Token generation
export { generateRtcToken, generateConvoAIToken, ExpiresIn } from "./token.js";
export type { GenerateTokenOptions, GenerateConvoAITokenOptions } from "./token.js";
export type {
    AgentSessionOptions,
    AgentSessionEvent,
    AgentSessionEventHandler,
} from "./AgentSession.js";

// Re-export the underlying client type for advanced usage
export type { AgentsClient } from "../api/resources/agents/client/Client.js";

// Clean type aliases
export type {
    // Core configuration types
    LlmConfig,
    LlmStyle,
    LlmGreetingConfigs,
    LlmGreetingConfigsMode,
    McpServersItem,
    SttConfig,
    SttVendor,
    TtsConfig,
    MllmConfig,
    MllmVendor,
    AvatarConfig,
    AvatarVendor,
    TurnDetectionConfig,
    TurnDetectionNestedConfig,
    StartOfSpeechConfig,
    StartOfSpeechMode,
    StartOfSpeechVadConfig,
    StartOfSpeechKeywordsConfig,
    StartOfSpeechDisabledConfig,
    StartOfSpeechDisabledConfigStrategy,
    EndOfSpeechConfig,
    EndOfSpeechMode,
    EndOfSpeechVadConfig,
    EndOfSpeechSemanticConfig,
    TurnDetectionType,
    InterruptMode,
    Eagerness,
    SalConfig,
    SalMode,
    AdvancedFeatures,
    SessionParams,
    SilenceConfig,
    SilenceAction,
    FarewellConfig,
    ParametersDataChannel,
    GeofenceConfig,
    GeofenceArea,
    GeofenceExcludeArea,
    RtcConfig,
    FillerWordsConfig,
    FillerWordsTrigger,
    FillerWordsTriggerFixedTimeConfig,
    FillerWordsContent,
    FillerWordsContentStaticConfig,
    FillerWordsContentSelectionRule,
    Labels,
    // Agent configuration
    AgentConfig,
    AgentConfigUpdate,
    // Session types
    SessionOptions,
    SessionStatus,
    SessionInfo,
    SessionListResponse,
    SessionSummary,
    // Conversation types
    ConversationHistory,
    ConversationTurn,
    ConversationRole,
    // Say/Speak types
    SayOptions,
    SpeakPriority,
    // TTS vendor-specific types
    MicrosoftTts,
    MicrosoftTtsParams,
    ElevenLabsTts,
    ElevenLabsTtsParams,
    CartesiaTts,
    CartesiaTtsParams,
    OpenAiTts,
    OpenAiTtsParams,
    HumeAiTts,
    HumeAiTtsParams,
    RimeTts,
    RimeTtsParams,
    FishAudioTts,
    FishAudioTtsParams,
    GoogleTts,
    GoogleTtsParams,
    AmazonTts,
    AmazonTtsParams,
    MinimaxTts,
    MinimaxTtsParams,
    MurfTts,
    MurfTtsParams,
    SarvamTts,
    SarvamTtsParams,
} from "./types.js";

// Vendor-specific avatar types with strict constraints
export type {
    StrictAvatarConfig,
    HeyGenAvatarConfig,
    AkoolAvatarConfig,
    GenericAvatarConfig,
} from "./avatar-types.js";

export {
    isHeyGenAvatar,
    isAkoolAvatar,
    validateAvatarConfig,
    validateTtsSampleRate,
    toBaseAvatarConfig,
} from "./avatar-types.js";

// Base vendor classes
export { BaseLLM, BaseTTS, BaseSTT, BaseMLLM, BaseAvatar } from "./vendors/base.js";

// Sample rate types
export type {
    SampleRate,
    ElevenLabsSampleRate,
    MicrosoftSampleRate,
    CartesiaSampleRate,
    HeyGenSampleRate,
    AkoolSampleRate,
} from "./vendors/base.js";

// LLM vendor classes
export { OpenAI, AzureOpenAI, Anthropic, Gemini } from "./vendors/llm.js";
export type {
    OpenAIOptions,
    AzureOpenAIOptions,
    AnthropicOptions,
    GeminiOptions,
} from "./vendors/llm.js";

// TTS vendor classes
export {
    ElevenLabsTTS,
    MicrosoftTTS,
    OpenAITTS,
    CartesiaTTS,
    GoogleTTS,
    AmazonTTS,
    HumeAITTS,
    RimeTTS,
    FishAudioTTS,
    MiniMaxTTS,
    MurfTTS,
    SarvamTTS,
} from "./vendors/tts.js";
export type {
    ElevenLabsTTSOptions,
    MicrosoftTTSOptions,
    OpenAITTSOptions,
    CartesiaTTSOptions,
    GoogleTTSOptions,
    AmazonTTSOptions,
    HumeAITTSOptions,
    RimeTTSOptions,
    FishAudioTTSOptions,
    MiniMaxTTSOptions,
    MurfTTSOptions,
    SarvamTTSOptions,
} from "./vendors/tts.js";

// STT vendor classes
export {
    SpeechmaticsSTT,
    DeepgramSTT,
    MicrosoftSTT,
    OpenAISTT,
    GoogleSTT,
    AmazonSTT,
    AssemblyAISTT,
    AresSTT,
    SarvamSTT,
} from "./vendors/stt.js";
export type {
    SpeechmaticsSTTOptions,
    DeepgramSTTOptions,
    MicrosoftSTTOptions,
    OpenAISTTOptions,
    GoogleSTTOptions,
    AmazonSTTOptions,
    AssemblyAISTTOptions,
    AresSTTOptions,
    SarvamSTTOptions,
} from "./vendors/stt.js";

// MLLM vendor classes
export { OpenAIRealtime, VertexAI } from "./vendors/mllm.js";
export type { OpenAIRealtimeOptions, VertexAIOptions } from "./vendors/mllm.js";

// Avatar vendor classes
export { HeyGenAvatar, AkoolAvatar } from "./vendors/avatar.js";
export type { HeyGenAvatarOptions, AkoolAvatarOptions } from "./vendors/avatar.js";
