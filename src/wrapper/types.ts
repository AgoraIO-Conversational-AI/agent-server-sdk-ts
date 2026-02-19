/**
 * Clean type aliases for the Agora Conversational AI SDK.
 * These provide shorter, more intuitive names for the verbose Fern-generated types.
 */

import type {
    StartAgentsRequest,
    UpdateAgentsRequest,
    ListAgentsResponse,
    GetAgentsResponse,
    GetHistoryAgentsResponse,
    SpeakAgentsRequest,
    Tts,
    MicrosoftTts as MicrosoftTtsType,
    MicrosoftTtsParams as MicrosoftTtsParamsType,
    ElevenLabsTts as ElevenLabsTtsType,
    ElevenLabsTtsParams as ElevenLabsTtsParamsType,
    CartesiaTts as CartesiaTtsType,
    CartesiaTtsParams as CartesiaTtsParamsType,
    OpenAiTts as OpenAiTtsType,
    OpenAiTtsParams as OpenAiTtsParamsType,
    HumeAiTts as HumeAiTtsType,
    HumeAiTtsParams as HumeAiTtsParamsType,
    RimeTts as RimeTtsType,
    RimeTtsParams as RimeTtsParamsType,
    FishAudioTts as FishAudioTtsType,
    FishAudioTtsParams as FishAudioTtsParamsType,
    GroqTts as GroqTtsType,
    GroqTtsParams as GroqTtsParamsType,
    GoogleTts as GoogleTtsType,
    GoogleTtsParams as GoogleTtsParamsType,
    AmazonTts as AmazonTtsType,
    AmazonTtsParams as AmazonTtsParamsType,
} from "../api/index.js";

// =============================================================================
// Core Configuration Types
// =============================================================================

/** LLM (Large Language Model) configuration */
export type LlmConfig = StartAgentsRequest.Properties.Llm;

/** LLM request style (openai, gemini, anthropic, dify) */
export type LlmStyle = StartAgentsRequest.Properties.Llm.Style;

/** STT/ASR (Speech-to-Text) configuration */
export type SttConfig = StartAgentsRequest.Properties.Asr;

/** STT vendor (ares, microsoft, deepgram, openai, etc.) */
export type SttVendor = StartAgentsRequest.Properties.Asr.Vendor;

/** TTS (Text-to-Speech) configuration - discriminated union */
export type TtsConfig = Tts;

/** MLLM (Multimodal LLM) configuration */
export type MllmConfig = StartAgentsRequest.Properties.Mllm;

/** MLLM vendor (openai, vertexai) */
export type MllmVendor = StartAgentsRequest.Properties.Mllm.Vendor;

/** MLLM style */
export type MllmStyle = StartAgentsRequest.Properties.Mllm.Style;

/** Avatar configuration */
export type AvatarConfig = StartAgentsRequest.Properties.Avatar;

/** Avatar vendor (akool, heygen) */
export type AvatarVendor = StartAgentsRequest.Properties.Avatar.Vendor;

/** Turn detection configuration */
export type TurnDetectionConfig = StartAgentsRequest.Properties.TurnDetection;

/** Turn detection type (agora_vad, server_vad, semantic_vad) */
export type TurnDetectionType = StartAgentsRequest.Properties.TurnDetection.Type;

/** Interrupt mode (interrupt, append, ignore, keyword, adaptive) */
export type InterruptMode = StartAgentsRequest.Properties.TurnDetection.InterruptMode;

/** Eagerness level (auto, low, high) */
export type Eagerness = StartAgentsRequest.Properties.TurnDetection.Eagerness;

/** SAL (Selective Attention Locking) configuration */
export type SalConfig = StartAgentsRequest.Properties.Sal;

/** SAL mode (locking, recognition) */
export type SalMode = StartAgentsRequest.Properties.Sal.SalMode;

/** Advanced features configuration */
export type AdvancedFeatures = StartAgentsRequest.Properties.AdvancedFeatures;

/** Session parameters configuration */
export type SessionParams = StartAgentsRequest.Properties.Parameters;

/** Silence configuration */
export type SilenceConfig = StartAgentsRequest.Properties.Parameters.SilenceConfig;

/** Silence action */
export type SilenceAction = StartAgentsRequest.Properties.Parameters.SilenceConfig.Action;

/** Farewell configuration */
export type FarewellConfig = StartAgentsRequest.Properties.Parameters.FarewellConfig;

// =============================================================================
// Agent Configuration (combines all the above)
// =============================================================================

/** Full agent configuration (alias for StartAgentsRequest.Properties) */
export type AgentConfig = StartAgentsRequest.Properties;

/** Agent configuration update (for runtime updates) */
export type AgentConfigUpdate = UpdateAgentsRequest.Properties;

// =============================================================================
// Session Types
// =============================================================================

/** Options for creating a session */
export interface SessionOptions {
    /** Unique name for this agent instance (optional - resolved from agent or auto-generated) */
    name?: string;
    /** The channel to join */
    channel: string;
    /** Authentication token for the channel. Omit to auto-generate (requires appCertificate on the session). */
    token?: string;
    /** The agent's RTC UID */
    agentUid: string;
    /** Remote user UIDs to subscribe to */
    remoteUids: string[];
    /** Idle timeout in seconds (0 = no auto-exit) */
    idleTimeout?: number;
    /** Whether to use string UIDs */
    enableStringUid?: boolean;
}

/** Session status */
export type SessionStatus = ListAgentsResponse.Data.List.Item.Status;

/** Session info (from get endpoint) */
export type SessionInfo = GetAgentsResponse;

/** Session list response */
export type SessionListResponse = ListAgentsResponse;

/** Session summary (list item) */
export type SessionSummary = ListAgentsResponse.Data.List.Item;

// =============================================================================
// Conversation Types
// =============================================================================

/** Conversation history */
export type ConversationHistory = GetHistoryAgentsResponse;

/** Conversation turn */
export type ConversationTurn = GetHistoryAgentsResponse.Contents.Item;

/** Conversation role */
export type ConversationRole = GetHistoryAgentsResponse.Contents.Item.Role;

// =============================================================================
// Say/Speak Types
// =============================================================================

/** Options for the say() method */
export interface SayOptions {
    /** Priority of the message */
    priority?: SpeakPriority;
    /** Whether the message can be interrupted */
    interruptable?: boolean;
}

/** Speak priority */
export type SpeakPriority = SpeakAgentsRequest.Priority;

// =============================================================================
// TTS Vendor-Specific Types (re-exports for convenience)
// =============================================================================

export type MicrosoftTts = MicrosoftTtsType;
export type MicrosoftTtsParams = MicrosoftTtsParamsType;
export type ElevenLabsTts = ElevenLabsTtsType;
export type ElevenLabsTtsParams = ElevenLabsTtsParamsType;
export type CartesiaTts = CartesiaTtsType;
export type CartesiaTtsParams = CartesiaTtsParamsType;
export type OpenAiTts = OpenAiTtsType;
export type OpenAiTtsParams = OpenAiTtsParamsType;
export type HumeAiTts = HumeAiTtsType;
export type HumeAiTtsParams = HumeAiTtsParamsType;
export type RimeTts = RimeTtsType;
export type RimeTtsParams = RimeTtsParamsType;
export type FishAudioTts = FishAudioTtsType;
export type FishAudioTtsParams = FishAudioTtsParamsType;
export type GroqTts = GroqTtsType;
export type GroqTtsParams = GroqTtsParamsType;
export type GoogleTts = GoogleTtsType;
export type GoogleTtsParams = GoogleTtsParamsType;
export type AmazonTts = AmazonTtsType;
export type AmazonTtsParams = AmazonTtsParamsType;
