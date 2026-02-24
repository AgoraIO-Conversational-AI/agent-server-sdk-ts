/**
 * Type-safe MLLM (Multimodal Large Language Model) vendor classes.
 *
 * MLLM vendors handle real-time audio end-to-end, bypassing the standard
 * ASR → LLM → TTS pipeline. Requires `advancedFeatures: { enable_mllm: true }`
 * in the Agent configuration.
 */

import { BaseMLLM } from "./base.js";
import type { MllmConfig } from "../types.js";

/**
 * Constructor options for OpenAI Realtime API.
 */
export interface OpenAIRealtimeOptions {
    /** OpenAI API key */
    apiKey: string;
    /** Model name (e.g., 'gpt-4o-realtime-preview') */
    model?: string;
    /** WebSocket URL for real-time communication */
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
}

/**
 * OpenAI Realtime API MLLM vendor.
 *
 * @example
 * ```typescript
 * const mllm = new OpenAIRealtime({
 *   apiKey: process.env.OPENAI_API_KEY,
 *   greetingMessage: 'Hello! How can I help you?',
 * });
 *
 * const agent = new Agent({
 *   name: 'realtime-assistant',
 *   advancedFeatures: { enable_mllm: true },
 * }).withMllm(mllm);
 * ```
 */
export class OpenAIRealtime extends BaseMLLM {
    private options: OpenAIRealtimeOptions;

    constructor(options: OpenAIRealtimeOptions) {
        super();
        this.options = options;
    }

    toConfig(): MllmConfig {
        const {
            apiKey,
            model,
            url,
            greetingMessage,
            inputModalities,
            outputModalities,
            messages,
            params,
        } = this.options;

        return {
            vendor: "openai",
            style: "openai",
            api_key: apiKey,
            ...(url && { url }),
            ...(model && { params: { model, ...params } }),
            ...(greetingMessage && { greeting_message: greetingMessage }),
            ...(inputModalities && { input_modalities: inputModalities }),
            ...(outputModalities && { output_modalities: outputModalities }),
            ...(messages && { messages }),
        };
    }
}

/**
 * Constructor options for Google Gemini Live (Vertex AI).
 */
export interface VertexAIOptions {
    /** Model name (e.g., 'gemini-live-2.5-flash-preview-native-audio-09-2025') */
    model: string;
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
}

/**
 * Google Gemini Live (Vertex AI) MLLM vendor.
 *
 * @example
 * ```typescript
 * const mllm = new VertexAI({
 *   model: 'gemini-live-2.5-flash-preview-native-audio-09-2025',
 *   projectId: process.env.GOOGLE_PROJECT_ID,
 *   location: 'us-central1',
 *   adcCredentialsString: process.env.GOOGLE_ADC_CREDENTIALS,
 *   instructions: 'You are a helpful voice assistant.',
 *   voice: 'Aoede',
 *   greetingMessage: 'Hello! Gemini is listening.',
 * });
 *
 * const agent = new Agent({
 *   name: 'gemini-assistant',
 *   advancedFeatures: { enable_mllm: true },
 * }).withMllm(mllm);
 * ```
 */
export class VertexAI extends BaseMLLM {
    private options: VertexAIOptions;

    constructor(options: VertexAIOptions) {
        super();
        this.options = options;
    }

    toConfig(): MllmConfig {
        const {
            model,
            projectId,
            location,
            adcCredentialsString,
            instructions,
            voice,
            greetingMessage,
            inputModalities,
            outputModalities,
            messages,
            additionalParams,
        } = this.options;

        return {
            vendor: "vertexai",
            style: "openai",
            params: {
                model,
                project_id: projectId,
                location,
                adc_credentials_string: adcCredentialsString,
                ...(instructions && { instructions }),
                ...(voice && { voice }),
                ...additionalParams,
            },
            ...(greetingMessage && { greeting_message: greetingMessage }),
            ...(inputModalities && { input_modalities: inputModalities }),
            ...(outputModalities && { output_modalities: outputModalities }),
            ...(messages && { messages }),
        };
    }
}
