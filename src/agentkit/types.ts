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
    GoogleTts as GoogleTtsType,
    GoogleTtsParams as GoogleTtsParamsType,
    AmazonTts as AmazonTtsType,
    AmazonTtsParams as AmazonTtsParamsType,
    MinimaxTts as MinimaxTtsType,
    MinimaxTtsParams as MinimaxTtsParamsType,
    MurfTts as MurfTtsType,
    MurfTtsParams as MurfTtsParamsType,
    SarvamTts as SarvamTtsType,
    SarvamTtsParams as SarvamTtsParamsType,
} from "../api/index.js";

// =============================================================================
// Core Configuration Types
// =============================================================================

/** LLM request style (openai, gemini, anthropic, dify) */
export type LlmStyle = StartAgentsRequest.Properties.Llm.Style;

/** 
 * STT/ASR (Speech-to-Text) configuration with vendor-specific typed parameters.
 * This discriminated union provides type safety and auto-complete for vendor params.
 * When using shorthand strings or minimal configs, the untyped variant is available.
 */
export type SttConfig =
    | { vendor: 'speechmatics'; language?: string; params: SpeechmaticsParams }
    | { vendor: 'deepgram'; language?: string; params?: DeepgramParams }
    | { vendor: 'microsoft'; language?: string; params: MicrosoftAsrParams }
    | { vendor: 'openai'; language?: string; params: OpenAiAsrParams }
    | { vendor: 'google'; language?: string; params: GoogleAsrParams }
    | { vendor: 'amazon'; language?: string; params: AmazonAsrParams }
    | { vendor: 'assemblyai'; language?: string; params?: AssemblyAiParams }
    | { vendor: 'ares'; language?: string; params?: AresParams }
    | { vendor: 'sarvam'; language?: string; params?: SarvamAsrParams }
    | StartAgentsRequest.Properties.Asr; // Fallback for shorthand/untyped configs

/** STT vendor (ares, microsoft, deepgram, openai, etc.) */
export type SttVendor = StartAgentsRequest.Properties.Asr.Vendor;

/** TTS (Text-to-Speech) configuration - discriminated union */
export type TtsConfig = Tts | { vendor: "groq"; params?: Record<string, unknown>; skip_patterns?: number[] };

/** MLLM (Multimodal LLM) configuration */
export type MllmConfig = StartAgentsRequest.Properties.Mllm;

/** MLLM vendor (openai, vertexai) */
export type MllmVendor = StartAgentsRequest.Properties.Mllm.Vendor;

/** Avatar configuration */
export type AvatarConfig = StartAgentsRequest.Properties.Avatar;

/** Avatar vendor (akool, heygen) */
export type AvatarVendor = StartAgentsRequest.Properties.Avatar.Vendor;

/** Turn detection configuration */
export type TurnDetectionConfig = StartAgentsRequest.Properties.TurnDetection;

// --- New SOS/EOS turn detection types (preferred) ---

/** Detailed nested config for turn detection (`turn_detection.config`) */
export type TurnDetectionNestedConfig = StartAgentsRequest.Properties.TurnDetection.Config;

/** Start of Speech (SoS) detection configuration (`turn_detection.config.start_of_speech`) */
export type StartOfSpeechConfig = StartAgentsRequest.Properties.TurnDetection.Config.StartOfSpeech;

/** Start of speech detection mode: `"vad"` | `"keywords"` | `"disabled"` */
export type StartOfSpeechMode = StartAgentsRequest.Properties.TurnDetection.Config.StartOfSpeech.Mode;

/** VAD config for SoS detection (`start_of_speech.vad_config`) */
export type StartOfSpeechVadConfig = StartAgentsRequest.Properties.TurnDetection.Config.StartOfSpeech.VadConfig;

/** Keyword trigger config for SoS detection (`start_of_speech.keywords_config`) */
export type StartOfSpeechKeywordsConfig = StartAgentsRequest.Properties.TurnDetection.Config.StartOfSpeech.KeywordsConfig;

/** Disabled mode config for SoS detection (`start_of_speech.disabled_config`) */
export type StartOfSpeechDisabledConfig = StartAgentsRequest.Properties.TurnDetection.Config.StartOfSpeech.DisabledConfig;

/** Voice processing strategy when SoS is disabled: `"append"` | `"ignored"` */
export type StartOfSpeechDisabledConfigStrategy = StartAgentsRequest.Properties.TurnDetection.Config.StartOfSpeech.DisabledConfig.Strategy;

/** End of Speech (EoS) detection configuration (`turn_detection.config.end_of_speech`) */
export type EndOfSpeechConfig = StartAgentsRequest.Properties.TurnDetection.Config.EndOfSpeech;

/** End of speech detection mode: `"vad"` | `"semantic"` */
export type EndOfSpeechMode = StartAgentsRequest.Properties.TurnDetection.Config.EndOfSpeech.Mode;

/** VAD config for EoS detection (`end_of_speech.vad_config`) */
export type EndOfSpeechVadConfig = StartAgentsRequest.Properties.TurnDetection.Config.EndOfSpeech.VadConfig;

/** Semantic config for EoS detection (`end_of_speech.semantic_config`) */
export type EndOfSpeechSemanticConfig = StartAgentsRequest.Properties.TurnDetection.Config.EndOfSpeech.SemanticConfig;

// --- Deprecated turn detection types ---

/**
 * @deprecated Use `TurnDetectionConfig` with `config.start_of_speech` and `config.end_of_speech` instead.
 * The `type` field and `agora_vad` / `server_vad` / `semantic_vad` values are being removed in a future release.
 */
export type TurnDetectionType = StartAgentsRequest.Properties.TurnDetection.Type;

/**
 * @deprecated Use `StartOfSpeechConfig` with `mode: "vad" | "keywords" | "disabled"` and the corresponding
 * `vad_config`, `keywords_config`, or `disabled_config` instead.
 */
export type InterruptMode = StartAgentsRequest.Properties.TurnDetection.InterruptMode;

/**
 * @deprecated Only applies to `server_vad` / `semantic_vad` modes with OpenAI Realtime API (MLLM).
 * Has no equivalent in the standard ASR + LLM + TTS pipeline.
 */
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

/** Agent data transmission channel (`"rtm"` | `"datastream"`) */
export type ParametersDataChannel = StartAgentsRequest.Properties.Parameters.DataChannel;

/** Regional access restriction configuration */
export type GeofenceConfig = StartAgentsRequest.Properties.Geofence;

/** Allowed geographic region for server access */
export type GeofenceArea = StartAgentsRequest.Properties.Geofence.Area;

/** Geographic region to exclude when `area` is `"GLOBAL"` */
export type GeofenceExcludeArea = StartAgentsRequest.Properties.Geofence.ExcludeArea;

/** RTC media encryption configuration */
export type RtcConfig = StartAgentsRequest.Properties.Rtc;

/** Filler word configuration (plays filler words while waiting for LLM responses) */
export type FillerWordsConfig = StartAgentsRequest.Properties.FillerWords;

/** Filler word trigger configuration (when to play filler words) */
export type FillerWordsTrigger = StartAgentsRequest.Properties.FillerWords.Trigger;

/** Fixed-time trigger config for filler words (`trigger.fixed_time_config`) */
export type FillerWordsTriggerFixedTimeConfig = StartAgentsRequest.Properties.FillerWords.Trigger.FixedTimeConfig;

/** Filler word content configuration (source and selection of filler words) */
export type FillerWordsContent = StartAgentsRequest.Properties.FillerWords.Content;

/** Static filler word content config (`content.static_config`) */
export type FillerWordsContentStaticConfig = StartAgentsRequest.Properties.FillerWords.Content.StaticConfig;

/** Filler word selection rule: `"shuffle"` | `"round_robin"` */
export type FillerWordsContentSelectionRule = StartAgentsRequest.Properties.FillerWords.Content.StaticConfig.SelectionRule;

/** Custom business labels attached to the agent (returned in notification callbacks) */
export type Labels = Record<string, string>;

// =============================================================================
// LLM Sub-types
// =============================================================================

/** LLM greeting broadcast configuration (`llm.greeting_configs`) */
export type LlmGreetingConfigs = StartAgentsRequest.Properties.Llm.GreetingConfigs;

/** Greeting broadcast mode: `"single_every"` | `"single_first"` */
export type LlmGreetingConfigsMode = StartAgentsRequest.Properties.Llm.GreetingConfigs.Mode;

/** MCP server config item (`llm.mcp_servers[]`) */
export type McpServersItem = StartAgentsRequest.Properties.Llm.McpServers.Item;

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
    /**
     * Token lifetime in seconds (default: 86400 = 24 hours, Agora maximum).
     * Only applies when the SDK auto-generates a token (i.e. no `token` is provided).
     * Valid range: 1–86400. Use `ExpiresIn.hours()` / `ExpiresIn.minutes()` for clarity.
     */
    expiresIn?: number;
    /** Enable debug logging of API requests */
    debug?: boolean;
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
// LLM Vendor-Specific Parameter Types
// =============================================================================

/**
 * OpenAI-style LLM parameters
 * Used for: OpenAI, Azure OpenAI, and OpenAI-compatible APIs
 * @see https://docs.agora.io/en/conversational-ai/models/llm/overview
 */
export interface OpenAiLlmParams {
    /** Model name (e.g., 'gpt-4o-mini', 'gpt-4', 'gpt-3.5-turbo') */
    model: string;
    /** Maximum number of tokens to generate */
    max_tokens?: number;
    /** Temperature for response randomness (0-2) */
    temperature?: number;
    /** Top-p nucleus sampling parameter */
    top_p?: number;
    /** Number of completions to generate */
    n?: number;
    /** Presence penalty (-2.0 to 2.0) */
    presence_penalty?: number;
    /** Frequency penalty (-2.0 to 2.0) */
    frequency_penalty?: number;
    /** Additional OpenAI-specific parameters */
    [key: string]: unknown;
}

/**
 * Gemini-style LLM parameters
 * Used for: Google Gemini and Vertex AI
 * @see https://docs.agora.io/en/conversational-ai/models/llm/overview
 */
export interface GeminiLlmParams {
    /** Model name (e.g., 'gemini-pro', 'gemini-1.5-flash') */
    model: string;
    /** Maximum number of output tokens */
    maxOutputTokens?: number;
    /** Temperature for response randomness (0-2) */
    temperature?: number;
    /** Top-p nucleus sampling parameter */
    topP?: number;
    /** Top-k sampling parameter */
    topK?: number;
    /** Google Cloud project ID (for Vertex AI) */
    project_id?: string;
    /** Google Cloud location (for Vertex AI) */
    location?: string;
    /** Additional Gemini-specific parameters */
    [key: string]: unknown;
}

/**
 * Anthropic-style LLM parameters
 * Used for: Anthropic Claude models
 * @see https://docs.agora.io/en/conversational-ai/models/llm/overview
 */
export interface AnthropicLlmParams {
    /** Model name (e.g., 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229') */
    model: string;
    /** Maximum number of tokens to generate */
    max_tokens?: number;
    /** Temperature for response randomness (0-1) */
    temperature?: number;
    /** Top-p nucleus sampling parameter */
    top_p?: number;
    /** Top-k sampling parameter */
    top_k?: number;
    /** Additional Anthropic-specific parameters */
    [key: string]: unknown;
}

/**
 * Dify-style LLM parameters
 * Used for: Dify workflow API
 * @see https://docs.agora.io/en/conversational-ai/models/llm/overview
 */
export interface DifyLlmParams {
    /** Dify user identifier */
    user?: string;
    /** Conversation ID for continuing a conversation */
    conversation_id?: string;
    /** Additional Dify-specific parameters */
    [key: string]: unknown;
}

/**
 * Common LLM configuration fields shared across all vendors
 */
interface BaseLlmConfig {
    /** The LLM callback address */
    url: string;
    /** The LLM API key */
    api_key?: string;
    /** System messages for context */
    system_messages?: Record<string, unknown>[];
    /** Maximum conversation history to cache */
    max_history?: number;
    /** Input modalities (e.g., ["text"], ["text", "image"]) */
    input_modalities?: string[];
    /** Output modalities (e.g., ["text"], ["audio"], ["text", "audio"]) */
    output_modalities?: string[];
    /** Agent greeting message */
    greeting_message?: string;
    /** Failure message when LLM call fails */
    failure_message?: string;
    /** LLM provider (e.g., 'azure', 'custom') */
    vendor?: string;
    /** Greeting broadcast configuration for multi-user channels (`llm.greeting_configs`) */
    greeting_configs?: LlmGreetingConfigs;
    /** Key-value pairs injected into system_messages / greeting_message via `{{variable_name}}` syntax */
    template_variables?: Record<string, string>;
    /** MCP server configurations enabling the agent to call tools from external services */
    mcp_servers?: McpServersItem[];
}

/**
 * LLM (Large Language Model) configuration with vendor-specific typed parameters.
 * This discriminated union provides type safety and auto-complete based on the style.
 */
export type LlmConfig =
    | (BaseLlmConfig & { style: 'openai'; params: OpenAiLlmParams })
    | (BaseLlmConfig & { style: 'gemini'; params: GeminiLlmParams })
    | (BaseLlmConfig & { style: 'anthropic'; params: AnthropicLlmParams })
    | (BaseLlmConfig & { style: 'dify'; params: DifyLlmParams })
    | (BaseLlmConfig & { style?: undefined; params?: Record<string, unknown> })
    | StartAgentsRequest.Properties.Llm; // Fallback for shorthand configs

// =============================================================================
// STT/ASR Vendor-Specific Parameter Types
// =============================================================================

/**
 * Speechmatics STT parameters
 * @see https://docs.agora.io/en/conversational-ai/models/asr/speechmatics
 */
export interface SpeechmaticsParams {
    /** Speechmatics API key for authentication (required) */
    api_key: string;
    /** Language code for transcription (e.g., 'en', 'es', 'fr') (required) */
    language: string;
    /** Additional Speechmatics-specific parameters passed directly to Speechmatics API */
    [key: string]: unknown;
}

/**
 * Deepgram STT parameters
 * @see https://docs.agora.io/en/conversational-ai/models/asr/deepgram
 */
export interface DeepgramParams {
    /** Deepgram API key */
    api_key?: string;
    /** Model to use (e.g., 'nova-2', 'enhanced', 'base') */
    model?: string;
    /** Language code (e.g., 'en-US', 'es', 'fr') */
    language?: string;
    /** Enable smart formatting */
    smart_format?: boolean;
    /** Enable punctuation */
    punctuation?: boolean;
    /** Additional Deepgram-specific parameters */
    [key: string]: unknown;
}

/**
 * Microsoft Azure Speech STT parameters
 * @see https://docs.agora.io/en/conversational-ai/models/asr/microsoft
 */
export interface MicrosoftAsrParams {
    /** Microsoft Azure subscription key (required) */
    key: string;
    /** Azure region (e.g., 'eastus', 'westus') (required) */
    region: string;
    /** Language code (e.g., 'en-US', 'es-ES') */
    language?: string;
    /** Additional Microsoft Azure Speech-specific parameters */
    [key: string]: unknown;
}

/**
 * OpenAI Whisper STT parameters
 * @see https://docs.agora.io/en/conversational-ai/models/asr/openai
 */
export interface OpenAiAsrParams {
    /** OpenAI API key (required) */
    api_key: string;
    /** Model to use (default: 'whisper-1') */
    model?: string;
    /** Additional OpenAI-specific parameters */
    [key: string]: unknown;
}

/**
 * Google Cloud Speech-to-Text parameters
 * @see https://docs.agora.io/en/conversational-ai/models/asr/google
 */
export interface GoogleAsrParams {
    /** Google Cloud API key (required) */
    api_key: string;
    /** Language code (e.g., 'en-US', 'es-ES') */
    language?: string;
    /** Additional Google Speech-to-Text parameters */
    [key: string]: unknown;
}

/**
 * Amazon Transcribe STT parameters
 * @see https://docs.agora.io/en/conversational-ai/models/asr/amazon
 */
export interface AmazonAsrParams {
    /** AWS Access Key ID (required) */
    access_key: string;
    /** AWS Secret Access Key (required) */
    secret_key: string;
    /** AWS region (e.g., 'us-east-1') (required) */
    region: string;
    /** Language code */
    language?: string;
    /** Additional Amazon Transcribe parameters */
    [key: string]: unknown;
}

/**
 * AssemblyAI STT parameters
 * @see https://docs.agora.io/en/conversational-ai/models/asr/assemblyai
 */
export interface AssemblyAiParams {
    /** AssemblyAI API key (required) */
    api_key: string;
    /** Language code */
    language?: string;
    /** Additional AssemblyAI-specific parameters */
    [key: string]: unknown;
}

/**
 * Agora ARES (Adaptive Recognition Engine for Speech) parameters
 * @see https://docs.agora.io/en/conversational-ai/models/asr/ares
 */
export interface AresParams {
    /** Language code for ARES ASR */
    language?: string;
    /** Additional ARES-specific parameters */
    [key: string]: unknown;
}

/**
 * Sarvam Speech-to-Text parameters (Beta)
 * @see https://docs.agora.io/en/conversational-ai/models/asr/sarvam
 */
export interface SarvamAsrParams {
    /** Sarvam API key */
    api_key: string;
    /** Language code (e.g., 'en', 'hi', 'ta') */
    language?: string;
    /** Additional Sarvam-specific parameters */
    [key: string]: unknown;
}

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
export type GoogleTts = GoogleTtsType;
export type GoogleTtsParams = GoogleTtsParamsType;
export type AmazonTts = AmazonTtsType;
export type AmazonTtsParams = AmazonTtsParamsType;
export type MinimaxTts = MinimaxTtsType;
export type MinimaxTtsParams = MinimaxTtsParamsType;
export type MurfTts = MurfTtsType;
export type MurfTtsParams = MurfTtsParamsType;
export type SarvamTts = SarvamTtsType;
export type SarvamTtsParams = SarvamTtsParamsType;
