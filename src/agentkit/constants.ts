/**
 * Type-safe constants for agent configuration values.
 * Use these instead of raw strings to avoid typos and get IDE autocomplete.
 */

// Import namespace as value from source (api index uses export type)
import { AgentThinkAgentManagementRequest as AgentThinkRequestNS } from "../api/resources/agentManagement/client/requests/AgentThinkAgentManagementRequest.js";
import { SpeakAgentsRequest as SpeakAgentsRequestNS } from "../api/resources/agents/client/requests/SpeakAgentsRequest.js";
import { StartAgentsRequest as StartAgentsRequestNS } from "../api/resources/agents/client/requests/StartAgentsRequest.js";
import { MllmTurnDetection as MllmTurnDetectionNS } from "../api/types/MllmTurnDetection.js";

/** Credential source for vendors that support Agora-managed credentials and BYOK. */
export const CredentialMode = {
    Managed: "managed",
    Byok: "byok",
} as const;

export type CredentialMode = (typeof CredentialMode)[keyof typeof CredentialMode];

/** Data channel: `"rtm"` | `"datastream"` */
export const DataChannel: typeof StartAgentsRequestNS.Properties.Parameters.DataChannel =
    StartAgentsRequestNS.Properties.Parameters.DataChannel;

/** RTC audio scenario: `"default"` | `"chorus"` | `"aiserver"` */
export const AudioScenario: typeof StartAgentsRequestNS.Properties.Parameters.AudioScenario =
    StartAgentsRequestNS.Properties.Parameters.AudioScenario;

/** Silence action when timeout elapses: `"speak"` | `"think"` (avoids shadowing SilenceAction type) */
export const SilenceActionValues: typeof StartAgentsRequestNS.Properties.Parameters.SilenceConfig.Action =
    StartAgentsRequestNS.Properties.Parameters.SilenceConfig.Action;

/** SAL mode: `"locking"` | `"recognition"` (avoids shadowing SalMode type) */
export const SalModeValues: typeof StartAgentsRequestNS.Properties.Sal.SalMode =
    StartAgentsRequestNS.Properties.Sal.SalMode;

/** Geofence area and exclude area constants */
export const Geofence: typeof StartAgentsRequestNS.Properties.Geofence = StartAgentsRequestNS.Properties.Geofence;

/** Filler word selection rule: `"shuffle"` | `"round_robin"` */
export const FillerWordsSelectionRule: typeof StartAgentsRequestNS.Properties.FillerWords.Content.StaticConfig.SelectionRule =
    StartAgentsRequestNS.Properties.FillerWords.Content.StaticConfig.SelectionRule;

/** Filler word content mode: `static` | `generated`. */
export const FillerWordsContentModeValues: typeof StartAgentsRequestNS.Properties.FillerWords.Content.Mode =
    StartAgentsRequestNS.Properties.FillerWords.Content.Mode;

/**
 * Turn detection type (deprecated; use `TurnDetectionNestedConfig.EndOfSpeech` instead).
 * - `AgoraVad`: Agora VAD
 * - `ServerVad`: Server-side VAD (MLLM only)
 * - `SemanticVad`: Semantic VAD (MLLM only)
 */
export const TurnDetectionTypeValues: typeof StartAgentsRequestNS.Properties.TurnDetection.Type =
    StartAgentsRequestNS.Properties.TurnDetection.Type;

/** Interruption trigger mode: `"start_of_speech"` | `"keywords"` */
export const InterruptionModeValues: typeof StartAgentsRequestNS.Properties.Interruption.Mode =
    StartAgentsRequestNS.Properties.Interruption.Mode;

/** Interruption trigger mode: `"start_of_speech"` */
export const InterruptionModeStartOfSpeech: StartAgentsRequestNS.Properties.Interruption.Mode =
    StartAgentsRequestNS.Properties.Interruption.Mode.StartOfSpeech;

/** Interruption trigger mode: `"keywords"` */
export const InterruptionModeKeywords: StartAgentsRequestNS.Properties.Interruption.Mode =
    StartAgentsRequestNS.Properties.Interruption.Mode.Keywords;

/** Strategy when interruption is disabled: `"append"` | `"ignore"` */
export const InterruptionDisabledStrategy: typeof StartAgentsRequestNS.Properties.Interruption.DisabledConfig.Strategy =
    StartAgentsRequestNS.Properties.Interruption.DisabledConfig.Strategy;

/** Strategy when interruption is disabled: append speech to the next turn. */
export const InterruptionDisabledStrategyAppend: StartAgentsRequestNS.Properties.Interruption.DisabledConfig.Strategy =
    StartAgentsRequestNS.Properties.Interruption.DisabledConfig.Strategy.Append;

/** Strategy when interruption is disabled: ignore speech while busy. */
export const InterruptionDisabledStrategyIgnore: StartAgentsRequestNS.Properties.Interruption.DisabledConfig.Strategy =
    StartAgentsRequestNS.Properties.Interruption.DisabledConfig.Strategy.Ignore;

/** Speak priority: `"INTERRUPT"` | `"APPEND"` | `"IGNORE"` */
export const SpeakPriorityValues: typeof SpeakAgentsRequestNS.Priority = SpeakAgentsRequestNS.Priority;

/** Speak immediately by interrupting the current output. */
export const SpeakPriorityInterrupt: SpeakAgentsRequestNS.Priority = SpeakAgentsRequestNS.Priority.Interrupt;

/** Queue the message after current output finishes. */
export const SpeakPriorityAppend: SpeakAgentsRequestNS.Priority = SpeakAgentsRequestNS.Priority.Append;

/** Drop the message if the agent is busy. */
export const SpeakPriorityIgnore: SpeakAgentsRequestNS.Priority = SpeakAgentsRequestNS.Priority.Ignore;

/** MLLM turn-detection mode: `"agora_vad"` | `"server_vad"` | `"semantic_vad"` */
export const MllmTurnDetectionModeValues: typeof MllmTurnDetectionNS.Mode = MllmTurnDetectionNS.Mode;

/** MLLM turn-detection mode: Agora VAD. */
export const MllmTurnDetectionModeAgoraVad: MllmTurnDetectionNS.Mode = MllmTurnDetectionNS.Mode.AgoraVad;

/** MLLM turn-detection mode: server/vendor VAD. */
export const MllmTurnDetectionModeServerVad: MllmTurnDetectionNS.Mode = MllmTurnDetectionNS.Mode.ServerVad;

/** MLLM turn-detection mode: semantic VAD. */
export const MllmTurnDetectionModeSemanticVad: MllmTurnDetectionNS.Mode = MllmTurnDetectionNS.Mode.SemanticVad;

/** Think action when the agent is listening: inject custom text without interrupting. */
export const ThinkOnListeningActionInject: AgentThinkRequestNS.OnListeningAction =
    AgentThinkRequestNS.OnListeningAction.Inject;

/** Think action when the agent is listening: interrupt and start a new turn. */
export const ThinkOnListeningActionInterrupt: AgentThinkRequestNS.OnListeningAction =
    AgentThinkRequestNS.OnListeningAction.Interrupt;

/** Think action when the agent is listening: ignore the request. */
export const ThinkOnListeningActionIgnore: AgentThinkRequestNS.OnListeningAction =
    AgentThinkRequestNS.OnListeningAction.Ignore;

/** Queue the think instruction until the current listening turn completes. */
export const ThinkOnListeningActionAppend: AgentThinkRequestNS.OnListeningAction =
    AgentThinkRequestNS.OnListeningAction.Append;

/** Think action when the agent is thinking: interrupt and start a new turn. */
export const ThinkOnThinkingActionInterrupt: AgentThinkRequestNS.OnThinkingAction =
    AgentThinkRequestNS.OnThinkingAction.Interrupt;

/** Think action when the agent is thinking: ignore the request. */
export const ThinkOnThinkingActionIgnore: AgentThinkRequestNS.OnThinkingAction =
    AgentThinkRequestNS.OnThinkingAction.Ignore;

/** Queue the think instruction until the current LLM turn completes. */
export const ThinkOnThinkingActionAppend: AgentThinkRequestNS.OnThinkingAction =
    AgentThinkRequestNS.OnThinkingAction.Append;

/** Think action when the agent is speaking: interrupt and start a new turn. */
export const ThinkOnSpeakingActionInterrupt: AgentThinkRequestNS.OnSpeakingAction =
    AgentThinkRequestNS.OnSpeakingAction.Interrupt;

/** Think action when the agent is speaking: ignore the request. */
export const ThinkOnSpeakingActionIgnore: AgentThinkRequestNS.OnSpeakingAction =
    AgentThinkRequestNS.OnSpeakingAction.Ignore;

/** Queue the think instruction until the current TTS playback completes. */
export const ThinkOnSpeakingActionAppend: AgentThinkRequestNS.OnSpeakingAction =
    AgentThinkRequestNS.OnSpeakingAction.Append;
