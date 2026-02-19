/**
 * Wrapper layer for the Agora Conversational AI SDK.
 *
 * This module provides a cleaner, more ergonomic API on top of the
 * Fern-generated SDK types and methods.
 *
 * ## Maintenance Notes
 *
 * This wrapper is designed to minimize maintenance burden:
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
export { generateRtcToken } from "./token.js";
export type { GenerateTokenOptions } from "./token.js";
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
    GroqTts,
    GroqTtsParams,
    GoogleTts,
    GoogleTtsParams,
    AmazonTts,
    AmazonTtsParams,
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
