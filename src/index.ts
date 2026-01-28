export * as Agora from "./api/index.js";
export { AgoraClient } from "./AgoraPoolClient.js";
export type { BaseClientOptions, BaseRequestOptions } from "./BaseClient.js";
export { AgoraEnvironment } from "./environments.js";
export { AgoraError, AgoraTimeoutError } from "./errors/index.js";
export * from "./exports.js";

// Wrapper layer exports - clean, ergonomic API
export { Agent, AgentSession } from "./wrapper/index.js";
export type {
    AgentOptions,
    AgentSessionOptions,
    AgentSessionEvent,
    AgentSessionEventHandler,
    // Clean type aliases
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
    AgentConfig,
    AgentConfigUpdate,
    SessionStartOptions,
    SessionHandle,
    SessionStatus,
    SessionInfo,
    SessionListResponse,
    SessionSummary,
    ConversationHistory,
    ConversationTurn,
    ConversationRole,
    SayOptions,
    SpeakPriority,
} from "./wrapper/index.js";
