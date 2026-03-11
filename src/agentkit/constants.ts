/**
 * Type-safe constants for agent configuration values.
 * Use these instead of raw strings to avoid typos and get IDE autocomplete.
 */

// Import namespace as value from source (api index uses export type)
import { StartAgentsRequest as StartAgentsRequestNS } from "../api/resources/agents/client/requests/StartAgentsRequest.js";

/** Data channel: `"rtm"` | `"datastream"` */
export const DataChannel: typeof StartAgentsRequestNS.Properties.Parameters.DataChannel =
    StartAgentsRequestNS.Properties.Parameters.DataChannel;

/** Silence action when timeout elapses: `"speak"` | `"think"` (avoids shadowing SilenceAction type) */
export const SilenceActionValues: typeof StartAgentsRequestNS.Properties.Parameters.SilenceConfig.Action =
    StartAgentsRequestNS.Properties.Parameters.SilenceConfig.Action;

/** SAL mode: `"locking"` | `"recognition"` (avoids shadowing SalMode type) */
export const SalModeValues: typeof StartAgentsRequestNS.Properties.Sal.SalMode =
    StartAgentsRequestNS.Properties.Sal.SalMode;

/** Geofence area and exclude area constants */
export const Geofence: typeof StartAgentsRequestNS.Properties.Geofence =
    StartAgentsRequestNS.Properties.Geofence;

/** Filler word selection rule: `"shuffle"` | `"round_robin"` */
export const FillerWordsSelectionRule: typeof StartAgentsRequestNS.Properties.FillerWords.Content.StaticConfig.SelectionRule =
    StartAgentsRequestNS.Properties.FillerWords.Content.StaticConfig.SelectionRule;

/**
 * Turn detection type (deprecated; use `TurnDetectionNestedConfig.EndOfSpeech` instead).
 * - `AgoraVad`: Agora VAD
 * - `ServerVad`: Server-side VAD (MLLM only)
 * - `SemanticVad`: Semantic VAD (MLLM only)
 */
export const TurnDetectionTypeValues: typeof StartAgentsRequestNS.Properties.TurnDetection.Type =
    StartAgentsRequestNS.Properties.TurnDetection.Type;
