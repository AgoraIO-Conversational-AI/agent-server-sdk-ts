/**
 * Base classes for type-safe vendor configurations.
 *
 * Each vendor class extends a base class and implements a `toConfig()` method
 * that converts TypeScript-friendly constructor params (camelCase) into the
 * Agora API format (snake_case).
 */

import type { LlmConfig, TtsConfig, SttConfig, MllmConfig, AvatarConfig, McpServersItem, LlmGreetingConfigs } from "../types.js";

/**
 * Common options shared by all LLM vendor classes.
 * These map directly to top-level fields on `LlmConfig` that are not
 * vendor-specific and therefore belong here rather than on individual vendors.
 */
export interface BaseLlmOptions {
    /**
     * LLM output modalities.
     * - `["text"]` (default): Output text is converted to speech by TTS and published to RTC.
     * - `["audio"]`: Voice only — audio published directly to RTC (no TTS step).
     * - `["text", "audio"]`: Both text and audio; handle the output with custom logic.
     */
    outputModalities?: string[];
    /**
     * Greeting broadcast mode for multi-user channels.
     * - `"single_every"`: Broadcasts a greeting every time a user joins.
     * - `"single_first"`: Broadcasts a greeting only once to the first user.
     */
    greetingConfigs?: LlmGreetingConfigs;
    /**
     * Key-value pairs injected into `system_messages`, `greeting_message`, and
     * `failure_message` via `{{variable_name}}` syntax. Useful for per-session
     * personalisation (e.g. injecting the caller's name into the system prompt).
     * Variable values cannot reference other variables.
     */
    templateVariables?: Record<string, string>;
    /**
     * LLM provider hint.
     * - `"custom"`: Adds `turn_id` and `timestamp` fields to every LLM request —
     *   useful for custom LLM backends that need per-turn tracking.
     * - `"azure"`: Required for Azure OpenAI (set automatically by `AzureOpenAI`).
     * Omit for standard OpenAI / Anthropic / Gemini endpoints.
     */
    vendor?: string;
    /** MCP server configurations enabling the agent to call tools from external services */
    mcpServers?: McpServersItem[];
}

/**
 * Standard audio sample rates supported by Agora platform.
 * Different vendors support different subsets of these rates.
 */
export type SampleRate = 8000 | 16000 | 22050 | 24000 | 44100 | 48000;

/**
 * Sample rates supported by ElevenLabs TTS.
 * - 16000 Hz: Required for Akool avatars
 * - 24000 Hz: Required for HeyGen avatars
 * - 22050, 44100 Hz: High quality, no avatar support
 */
export type ElevenLabsSampleRate = 16000 | 22050 | 24000 | 44100;

/**
 * Sample rates supported by Microsoft Azure TTS.
 */
export type MicrosoftSampleRate = 16000 | 24000 | 48000;

/**
 * Sample rates supported by Cartesia TTS.
 */
export type CartesiaSampleRate = 8000 | 16000 | 22050 | 24000 | 44100 | 48000;

/**
 * Sample rates supported by Google Cloud TTS.
 */
export type GoogleTTSSampleRate = 8000 | 16000 | 22050 | 24000 | 44100 | 48000;

/**
 * Sample rate required by HeyGen avatars (24kHz only).
 */
export type HeyGenSampleRate = 24000;

/**
 * Sample rate required by Akool avatars (16kHz only).
 */
export type AkoolSampleRate = 16000;

/**
 * Base class for LLM (Large Language Model) vendors.
 */
export abstract class BaseLLM {
    private readonly _outputModalities?: string[];
    private readonly _greetingConfigs?: LlmGreetingConfigs;
    private readonly _templateVariables?: Record<string, string>;
    private readonly _vendor?: string;
    private readonly _mcpServers?: McpServersItem[];

    constructor(options?: BaseLlmOptions) {
        this._outputModalities = options?.outputModalities;
        this._greetingConfigs = options?.greetingConfigs;
        this._templateVariables = options?.templateVariables;
        this._vendor = options?.vendor;
        this._mcpServers = options?.mcpServers;
    }

    protected get outputModalities(): string[] | undefined { return this._outputModalities; }
    protected get greetingConfigs(): LlmGreetingConfigs | undefined { return this._greetingConfigs; }
    protected get templateVariables(): Record<string, string> | undefined { return this._templateVariables; }
    protected get vendor(): string | undefined { return this._vendor; }
    /** MCP servers with transport defaulted to streamable_http (API requires it; only option). */
    protected get mcpServers(): McpServersItem[] | undefined {
        if (!this._mcpServers?.length) return this._mcpServers;
        return this._mcpServers.map((s) =>
            s.transport ? s : { ...s, transport: "streamable_http" as const }
        );
    }

    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): LlmConfig;
}

/**
 * Base class for TTS (Text-to-Speech) vendors with sample rate tracking.
 *
 * `SR` is a phantom type — it is never used at runtime and does not appear in
 * the `toConfig()` return type. Its sole purpose is to thread the sample rate
 * literal through `Agent<TTSSampleRate>` so that `withAvatar()` can enforce
 * TTS/avatar compatibility at compile time.
 *
 * This means TypeScript cannot verify that a concrete subclass actually emits
 * the sample rate it declares — e.g., `class MyTTS extends BaseTTS<24000>`
 * could emit `sample_rate: 16000` in its config without a type error. The
 * guarantee is therefore "the vendor class declares what it supports", not
 * "the config it produces is verified". Runtime validation in AgentSession
 * provides a second layer of safety for known avatar vendors.
 *
 * @template SR - Sample rate literal type (e.g., 24000, 16000)
 */
export abstract class BaseTTS<SR extends number = number> {
    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): TtsConfig;
}

/**
 * Base class for STT (Speech-to-Text) vendors.
 */
export abstract class BaseSTT {
    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): SttConfig;
}

/**
 * Base class for MLLM (Multimodal Large Language Model) vendors.
 */
export abstract class BaseMLLM {
    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): MllmConfig;
}

/**
 * Base class for Avatar vendors with required sample rate.
 * @template RequiredSR - Required sample rate literal type
 */
export abstract class BaseAvatar<RequiredSR extends number = number> {
    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): AvatarConfig;
    
    /**
     * The TTS sample rate required by this avatar vendor.
     */
    abstract readonly requiredSampleRate: RequiredSR;
}
