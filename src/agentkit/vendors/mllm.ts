/**
 * Type-safe MLLM (Multimodal Large Language Model) vendor classes.
 *
 * MLLM vendors handle real-time audio end-to-end, bypassing the standard
 * ASR → LLM → TTS pipeline. Calling `agent.withMllm(vendor)` automatically
 * sets `mllm.enable: true`.
 */

import type { MllmConfig, MllmTurnDetectionConfig } from "../types.js";
import { BaseMLLM } from "./base.js";

/**
 * Constructor options for OpenAI Realtime API.
 */
export interface OpenAIRealtimeOptions {
    /** OpenAI API key */
    apiKey: string;
    /** Model name (e.g., 'gpt-4o-realtime-preview') */
    model?: string;
    /** Voice identifier for audio output */
    voice?: string;
    /** System instructions that define agent behavior */
    instructions?: string;
    /** Audio transcription settings */
    inputAudioTranscription?: Record<string, unknown>;
    /** WebSocket URL. Defaults to `wss://api.openai.com/v1/realtime` when omitted or empty. */
    url?: string;
    /** Agent greeting message */
    greetingMessage?: string;
    /** Input modalities (e.g., ['audio'], ['audio', 'text']) */
    inputModalities?: string[];
    /** Output modalities (e.g., ['text', 'audio']) */
    outputModalities?: string[];
    /** Conversation messages for short-term memory */
    messages?: Record<string, unknown>[];
    /** Additional MLLM parameters */
    params?: Record<string, unknown>;
    /** MLLM turn detection configuration. Overrides top-level turn_detection. */
    turnDetection?: MllmTurnDetectionConfig;
    /** Message played on failure */
    failureMessage?: string;
}

/**
 * OpenAI Realtime API MLLM vendor.
 *
 * @example
 * ```typescript
 * const client = new AgoraClient({ area: Area.US, appId: '...', appCertificate: '...' });
 * const agent = new Agent({ client })
 *   .withMllm(new OpenAIRealtime({
 *     apiKey: process.env.OPENAI_API_KEY,
 *     greetingMessage: 'Hello! How can I help you?',
 *   }));
 * ```
 */
export class OpenAIRealtime extends BaseMLLM {
    private readonly options: OpenAIRealtimeOptions;

    constructor(options: OpenAIRealtimeOptions) {
        super();
        this.options = options;
    }

    toConfig(): MllmConfig {
        const {
            apiKey,
            model,
            voice,
            instructions,
            inputAudioTranscription,
            url,
            greetingMessage,
            inputModalities,
            outputModalities,
            messages,
            params,
            turnDetection,
        } = this.options;

        // Build params only when there is something to include.
        // Previously `...(model && { params: ... })` silently dropped the
        // entire params object when model was undefined — fixed by checking
        // either field independently.
        const mergedParams = {
            ...(model !== undefined && { model }),
            ...params,
            ...(voice !== undefined && { voice }),
            ...(instructions !== undefined && { instructions }),
            ...(inputAudioTranscription !== undefined && { input_audio_transcription: inputAudioTranscription }),
        };
        const hasParams =
            model !== undefined ||
            params !== undefined ||
            voice !== undefined ||
            instructions !== undefined ||
            inputAudioTranscription !== undefined;

        return {
            vendor: "openai",
            api_key: apiKey,
            url: url || "wss://api.openai.com/v1/realtime",
            ...(hasParams && { params: mergedParams }),
            ...(greetingMessage && { greeting_message: greetingMessage }),
            ...(inputModalities && { input_modalities: inputModalities }),
            ...(outputModalities && { output_modalities: outputModalities }),
            ...(messages && { messages }),
            ...(this.options.failureMessage && { failure_message: this.options.failureMessage }),
            ...(turnDetection && { turn_detection: turnDetection }),
        };
    }
}

/**
 * Constructor options for Google Gemini Live (direct API, non-Vertex AI).
 */
export interface GeminiLiveOptions {
    /** Google API key */
    apiKey: string;
    /** Model name (e.g., 'gemini-live-2.5-flash') */
    model: string;
    /** WebSocket URL for real-time communication */
    url?: string;
    /** System instructions for the model */
    instructions?: string;
    /** Voice name (e.g., 'Aoede', 'Charon') */
    voice?: string;
    affectiveDialog?: boolean;
    proactiveAudio?: boolean;
    transcribeAgent?: boolean;
    transcribeUser?: boolean;
    httpOptions?: Record<string, unknown>;
    /** Agent greeting message */
    greetingMessage?: string;
    /** Input modalities (e.g., ['audio'], ['audio', 'text']) */
    inputModalities?: string[];
    /** Output modalities (e.g., ['text', 'audio']) */
    outputModalities?: string[];
    /** Conversation messages for short-term memory */
    messages?: Record<string, unknown>[];
    /** Additional MLLM parameters passed directly to the model */
    additionalParams?: Record<string, unknown>;
    /** MLLM turn detection configuration. Overrides top-level turn_detection. */
    turnDetection?: MllmTurnDetectionConfig;
    /** Message played on failure */
    failureMessage?: string;
}

/**
 * Google Gemini Live MLLM vendor (direct API, non-Vertex AI).
 *
 * Uses a Google API key. For Vertex AI / ADC credentials use {@link VertexAI} instead.
 *
 * @example
 * ```typescript
 * const client = new AgoraClient({ area: Area.US, appId: '...', appCertificate: '...' });
 * const agent = new Agent({ client })
 *   .withMllm(new GeminiLive({
 *     apiKey: process.env.GOOGLE_API_KEY,
 *     model: 'gemini-live-2.5-flash',
 *     greetingMessage: 'Hello! Gemini is listening.',
 *   }));
 * ```
 */
export class GeminiLive extends BaseMLLM {
    private readonly options: GeminiLiveOptions;

    constructor(options: GeminiLiveOptions) {
        super();
        this.options = options;
    }

    toConfig(): MllmConfig {
        const {
            apiKey,
            model,
            url,
            instructions,
            voice,
            affectiveDialog,
            proactiveAudio,
            transcribeAgent,
            transcribeUser,
            httpOptions,
            greetingMessage,
            inputModalities,
            outputModalities,
            messages,
            additionalParams,
            turnDetection,
        } = this.options;

        return {
            vendor: "gemini",
            api_key: apiKey,
            url: url ?? "",
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                model,
                ...(instructions && { instructions }),
                ...(voice && { voice }),
                ...(affectiveDialog !== undefined && { affective_dialog: affectiveDialog }),
                ...(proactiveAudio !== undefined && { proactive_audio: proactiveAudio }),
                ...(transcribeAgent !== undefined && { transcribe_agent: transcribeAgent }),
                ...(transcribeUser !== undefined && { transcribe_user: transcribeUser }),
                ...(httpOptions && { http_options: httpOptions }),
            },
            ...(messages && { messages }),
            ...(greetingMessage && { greeting_message: greetingMessage }),
            ...(inputModalities && { input_modalities: inputModalities }),
            ...(outputModalities && { output_modalities: outputModalities }),
            ...(this.options.failureMessage && { failure_message: this.options.failureMessage }),
            ...(turnDetection && { turn_detection: turnDetection }),
        };
    }
}

/**
 * Constructor options for Google Gemini Live (Vertex AI).
 */
export interface VertexAIOptions {
    /** Model name (e.g., 'gemini-live-2.5-flash-preview-native-audio-09-2025') */
    model: string;
    /** WebSocket URL for real-time communication */
    url?: string;
    /** Google Cloud project ID */
    projectId: string;
    /** Google Cloud location/region */
    location: string;
    /** Application Default Credentials JSON string */
    adcCredentialsString: string;
    /** System instructions for the model */
    instructions?: string;
    /** Voice name (e.g., 'Aoede', 'Charon') */
    voice?: string;
    affectiveDialog?: boolean;
    proactiveAudio?: boolean;
    transcribeAgent?: boolean;
    transcribeUser?: boolean;
    httpOptions?: Record<string, unknown>;
    /** Agent greeting message */
    greetingMessage?: string;
    /** Input modalities (e.g., ['audio'], ['audio', 'text']) */
    inputModalities?: string[];
    /** Output modalities (e.g., ['text', 'audio']) */
    outputModalities?: string[];
    /** Conversation messages for short-term memory */
    messages?: Record<string, unknown>[];
    /** Additional MLLM parameters */
    additionalParams?: Record<string, unknown>;
    /** MLLM turn detection configuration. Overrides top-level turn_detection. */
    turnDetection?: MllmTurnDetectionConfig;
    /** Message played on failure */
    failureMessage?: string;
}

/**
 * Google Gemini Live (Vertex AI) MLLM vendor.
 *
 * @example
 * ```typescript
 * const client = new AgoraClient({ area: Area.US, appId: '...', appCertificate: '...' });
 * const agent = new Agent({ client })
 *   .withMllm(new VertexAI({
 *     model: 'gemini-live-2.5-flash-preview-native-audio-09-2025',
 *     projectId: process.env.GOOGLE_PROJECT_ID,
 *     location: 'us-central1',
 *     adcCredentialsString: process.env.GOOGLE_ADC_CREDENTIALS,
 *     instructions: 'You are a helpful voice assistant.',
 *     voice: 'Aoede',
 *     greetingMessage: 'Hello! Gemini is listening.',
 *   }));
 * ```
 */
export class VertexAI extends BaseMLLM {
    private readonly options: VertexAIOptions;

    constructor(options: VertexAIOptions) {
        super();
        this.options = options;
    }

    toConfig(): MllmConfig {
        const {
            model,
            url,
            projectId,
            location,
            adcCredentialsString,
            instructions,
            voice,
            affectiveDialog,
            proactiveAudio,
            transcribeAgent,
            transcribeUser,
            httpOptions,
            greetingMessage,
            inputModalities,
            outputModalities,
            messages,
            additionalParams,
            turnDetection,
        } = this.options;

        return {
            vendor: "vertexai",
            url: url ?? "",
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                model,
                project_id: projectId,
                location,
                adc_credentials_string: adcCredentialsString,
                ...(instructions && { instructions }),
                ...(voice && { voice }),
                ...(affectiveDialog !== undefined && { affective_dialog: affectiveDialog }),
                ...(proactiveAudio !== undefined && { proactive_audio: proactiveAudio }),
                ...(transcribeAgent !== undefined && { transcribe_agent: transcribeAgent }),
                ...(transcribeUser !== undefined && { transcribe_user: transcribeUser }),
                ...(httpOptions && { http_options: httpOptions }),
            },
            ...(messages && { messages }),
            ...(greetingMessage && { greeting_message: greetingMessage }),
            ...(inputModalities && { input_modalities: inputModalities }),
            ...(outputModalities && { output_modalities: outputModalities }),
            ...(this.options.failureMessage && { failure_message: this.options.failureMessage }),
            ...(turnDetection && { turn_detection: turnDetection }),
        };
    }
}

/**
 * Constructor options for xAI Grok Realtime API.
 */
export interface XaiGrokOptions {
    /** xAI API key */
    apiKey: string;
    /** WebSocket URL for real-time communication (defaults to xAI Realtime API) */
    url?: string;
    /** Voice identifier (e.g., 'eve', 'rex') */
    voice?: string;
    /** Language code (e.g., 'en') */
    language?: string;
    /** Audio sample rate in Hz (e.g., 24000) */
    sampleRate?: number;
    /** Agent greeting message */
    greetingMessage?: string;
    /** Message played on failure */
    failureMessage?: string;
    /** Input modalities (e.g., ['audio'], ['audio', 'text']) */
    inputModalities?: string[];
    /** Output modalities (e.g., ['audio'], ['text', 'audio']) */
    outputModalities?: string[];
    /** Conversation messages for short-term memory */
    messages?: Record<string, unknown>[];
    /** Additional MLLM parameters passed directly to xAI */
    params?: Record<string, unknown>;
    /** MLLM turn detection configuration. Overrides top-level turn_detection. */
    turnDetection?: MllmTurnDetectionConfig;
}

/**
 * xAI Grok MLLM vendor (`mllm.vendor`: `"xai"`).
 *
 * Uses the xAI Realtime API WebSocket URL by default. Do not name future xAI ASR/TTS
 * wrappers `XaiRealtime`; use `XaiSTT` / `XaiTTS` when those pipelines are added.
 *
 * @example
 * ```typescript
 * const client = new AgoraClient({ area: Area.US, appId: '...', appCertificate: '...' });
 * const agent = new Agent({ client })
 *   .withMllm(new XaiGrok({
 *     apiKey: process.env.XAI_API_KEY,
 *     voice: 'eve',
 *     language: 'en',
 *     sampleRate: 24000,
 *     greetingMessage: 'Hello, how can I help?',
 *   }));
 * ```
 */
export class XaiGrok extends BaseMLLM {
    private readonly options: XaiGrokOptions;

    constructor(options: XaiGrokOptions) {
        super();
        this.options = options;

        if (!options.apiKey) {
            throw new Error("XaiGrok requires apiKey");
        }
    }

    toConfig(): MllmConfig {
        const {
            apiKey,
            url = "wss://api.x.ai/v1/realtime",
            voice,
            language,
            sampleRate,
            greetingMessage,
            failureMessage,
            inputModalities,
            outputModalities,
            messages,
            params,
            turnDetection,
        } = this.options;

        return {
            vendor: "xai",
            api_key: apiKey,
            url,
            ...(messages && { messages }),
            params: {
                ...params,
                ...(voice && { voice }),
                ...(language && { language }),
                ...(sampleRate !== undefined && { sample_rate: sampleRate }),
            },
            ...(inputModalities && { input_modalities: inputModalities }),
            ...(outputModalities && { output_modalities: outputModalities }),
            ...(greetingMessage && { greeting_message: greetingMessage }),
            ...(failureMessage && { failure_message: failureMessage }),
            ...(turnDetection && { turn_detection: turnDetection }),
        };
    }
}
