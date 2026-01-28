/**
 * Wrapper layer for the Agora Conversational AI SDK.
 *
 * This module provides a cleaner, more ergonomic API on top of the
 * Fern-generated SDK types and methods.
 */

// Core classes
export { Agent } from "./Agent.js";
export type { AgentOptions } from "./Agent.js";

export { AgentSession } from "./AgentSession.js";
export type {
    AgentSessionOptions,
    AgentSessionEvent,
    AgentSessionEventHandler,
} from "./AgentSession.js";

// Clean type aliases
export type {
    // Core configuration types
    LlmConfig,
    LlmStyle,
    SttConfig,
    SttVendor,
    TtsConfig,
    MllmConfig,
    MllmVendor,
    MllmStyle,
    AvatarConfig,
    AvatarVendor,
    TurnDetectionConfig,
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
    // Agent configuration
    AgentConfig,
    AgentConfigUpdate,
    // Session types
    SessionStartOptions,
    SessionHandle,
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
    GroqTts,
    GroqTtsParams,
    GoogleTts,
    GoogleTtsParams,
    AmazonTts,
    AmazonTtsParams,
} from "./types.js";
