/**
 * Agent class - A reusable agent definition.
 *
 * This class represents an agent configuration that can be used to create
 * multiple sessions. It provides a fluent builder pattern for configuration.
 */

import type * as Agora from "../api/index.js";
import type {
    LlmConfig,
    SttConfig,
    TtsConfig,
    MllmConfig,
    TurnDetectionConfig,
    SalConfig,
    AvatarConfig,
    AdvancedFeatures,
    SessionParams,
} from "./types.js";

/**
 * Configuration options for creating an Agent.
 */
export interface AgentOptions {
    /** System instructions for the agent */
    instructions?: string;
    /** LLM configuration or shorthand string (e.g., 'openai/gpt-4') */
    llm?: LlmConfig | string;
    /** TTS configuration */
    tts?: TtsConfig;
    /** STT/ASR configuration or shorthand string (e.g., 'deepgram/nova-2') */
    stt?: SttConfig | string;
    /** MLLM configuration for multimodal */
    mllm?: MllmConfig;
    /** Turn detection configuration */
    turnDetection?: TurnDetectionConfig;
    /** SAL configuration */
    sal?: SalConfig;
    /** Avatar configuration */
    avatar?: AvatarConfig;
    /** Advanced features */
    advancedFeatures?: AdvancedFeatures;
    /** Session parameters */
    parameters?: SessionParams;
    /** Greeting message */
    greeting?: string;
    /** Failure message */
    failureMessage?: string;
    /** Max conversation history */
    maxHistory?: number;
}

/**
 * Parses a shorthand LLM string like 'openai/gpt-4' into an LlmConfig.
 */
function parseLlmShorthand(shorthand: string): LlmConfig {
    const [vendor, model] = shorthand.split("/");
    const vendorUrls: Record<string, string> = {
        openai: "https://api.openai.com/v1/chat/completions",
        anthropic: "https://api.anthropic.com/v1/messages",
        azure: "https://YOUR_RESOURCE.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT/chat/completions",
        gemini: "https://generativelanguage.googleapis.com/v1beta/models",
    };

    const url = vendorUrls[vendor?.toLowerCase() ?? ""] ?? vendorUrls.openai;
    const style = vendor?.toLowerCase() as LlmConfig["style"];

    return {
        url,
        vendor: vendor?.toLowerCase() === "azure" ? "azure" : undefined,
        style: style === "gemini" || style === "anthropic" ? style : "openai",
        params: model ? { model } : undefined,
    };
}

/**
 * Parses a shorthand STT string like 'deepgram/nova-2' into an SttConfig.
 */
function parseSttShorthand(shorthand: string): SttConfig {
    const [vendor] = shorthand.split("/");
    const vendorMap: Record<string, SttConfig["vendor"]> = {
        ares: "ares",
        microsoft: "microsoft",
        deepgram: "deepgram",
        openai: "openai",
        google: "google",
        amazon: "amazon",
        assemblyai: "assemblyai",
        speechmatics: "speechmatics",
    };

    return {
        vendor: vendorMap[vendor?.toLowerCase() ?? ""] ?? "deepgram",
    };
}

/**
 * Agent class representing a reusable agent configuration.
 *
 * @example
 * ```typescript
 * const agent = new Agent({
 *   instructions: 'You are a helpful voice assistant.',
 *   llm: 'openai/gpt-4-turbo',
 *   tts: { vendor: 'microsoft', params: { key: '...', region: 'eastus', voice_name: 'en-US-JennyNeural' } },
 *   stt: 'deepgram/nova-2',
 * });
 *
 * // Or use the fluent builder pattern
 * const agent = new Agent({ instructions: 'You are helpful.' })
 *   .withLlm('openai/gpt-4')
 *   .withTts({ vendor: 'elevenlabs', params: { key: '...', model_id: '...', voice_id: '...' } });
 * ```
 */
export class Agent {
    private _llm?: LlmConfig;
    private _tts?: TtsConfig;
    private _stt?: SttConfig;
    private _mllm?: MllmConfig;
    private _turnDetection?: TurnDetectionConfig;
    private _sal?: SalConfig;
    private _avatar?: AvatarConfig;
    private _advancedFeatures?: AdvancedFeatures;
    private _parameters?: SessionParams;
    private _instructions?: string;
    private _greeting?: string;
    private _failureMessage?: string;
    private _maxHistory?: number;

    constructor(options: AgentOptions = {}) {
        this._instructions = options.instructions;
        this._greeting = options.greeting;
        this._failureMessage = options.failureMessage;
        this._maxHistory = options.maxHistory;

        if (options.llm) {
            this._llm = typeof options.llm === "string" ? parseLlmShorthand(options.llm) : options.llm;
        }
        if (options.tts) {
            this._tts = options.tts;
        }
        if (options.stt) {
            this._stt = typeof options.stt === "string" ? parseSttShorthand(options.stt) : options.stt;
        }
        if (options.mllm) {
            this._mllm = options.mllm;
        }
        if (options.turnDetection) {
            this._turnDetection = options.turnDetection;
        }
        if (options.sal) {
            this._sal = options.sal;
        }
        if (options.avatar) {
            this._avatar = options.avatar;
        }
        if (options.advancedFeatures) {
            this._advancedFeatures = options.advancedFeatures;
        }
        if (options.parameters) {
            this._parameters = options.parameters;
        }
    }

    /**
     * Returns a new Agent with the specified LLM configuration.
     */
    withLlm(config: LlmConfig | string): Agent {
        const newAgent = this._clone();
        newAgent._llm = typeof config === "string" ? parseLlmShorthand(config) : config;
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified TTS configuration.
     */
    withTts(config: TtsConfig): Agent {
        const newAgent = this._clone();
        newAgent._tts = config;
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified STT configuration.
     */
    withStt(config: SttConfig | string): Agent {
        const newAgent = this._clone();
        newAgent._stt = typeof config === "string" ? parseSttShorthand(config) : config;
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified MLLM configuration.
     */
    withMllm(config: MllmConfig): Agent {
        const newAgent = this._clone();
        newAgent._mllm = config;
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified turn detection configuration.
     */
    withTurnDetection(config: TurnDetectionConfig): Agent {
        const newAgent = this._clone();
        newAgent._turnDetection = config;
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified instructions.
     */
    withInstructions(instructions: string): Agent {
        const newAgent = this._clone();
        newAgent._instructions = instructions;
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified greeting message.
     */
    withGreeting(greeting: string): Agent {
        const newAgent = this._clone();
        newAgent._greeting = greeting;
        return newAgent;
    }

    /**
     * Get the LLM configuration.
     */
    get llm(): LlmConfig | undefined {
        return this._llm;
    }

    /**
     * Get the TTS configuration.
     */
    get tts(): TtsConfig | undefined {
        return this._tts;
    }

    /**
     * Get the STT configuration.
     */
    get stt(): SttConfig | undefined {
        return this._stt;
    }

    /**
     * Get the MLLM configuration.
     */
    get mllm(): MllmConfig | undefined {
        return this._mllm;
    }

    /**
     * Get the turn detection configuration.
     */
    get turnDetection(): TurnDetectionConfig | undefined {
        return this._turnDetection;
    }

    /**
     * Get the instructions.
     */
    get instructions(): string | undefined {
        return this._instructions;
    }

    /**
     * Get the greeting message.
     */
    get greeting(): string | undefined {
        return this._greeting;
    }

    /**
     * Converts the Agent configuration to the internal Fern request properties format.
     * @internal
     */
    toProperties(
        channel: string,
        token: string,
        agentUid: string,
        remoteUids: string[],
        options?: {
            idleTimeout?: number;
            enableStringUid?: boolean;
        },
    ): Agora.StartAgentsRequest.Properties {
        const llmConfig: Agora.StartAgentsRequest.Properties.Llm | undefined = this._llm
            ? {
                  ...this._llm,
                  system_messages: this._instructions
                      ? [{ role: "system", content: this._instructions }]
                      : this._llm.system_messages,
                  greeting_message: this._greeting ?? this._llm.greeting_message,
                  failure_message: this._failureMessage ?? this._llm.failure_message,
                  max_history: this._maxHistory ?? this._llm.max_history,
              }
            : {
                  url: "https://api.openai.com/v1/chat/completions",
                  system_messages: this._instructions ? [{ role: "system", content: this._instructions }] : undefined,
                  greeting_message: this._greeting,
                  failure_message: this._failureMessage,
                  max_history: this._maxHistory,
              };

        if (!this._tts) {
            throw new Error("TTS configuration is required. Use withTts() to set it.");
        }

        return {
            channel,
            token,
            agent_rtc_uid: agentUid,
            remote_rtc_uids: remoteUids,
            idle_timeout: options?.idleTimeout,
            enable_string_uid: options?.enableStringUid,
            llm: llmConfig,
            tts: this._tts,
            asr: this._stt,
            mllm: this._mllm,
            turn_detection: this._turnDetection,
            sal: this._sal,
            avatar: this._avatar,
            advanced_features: this._advancedFeatures,
            parameters: this._parameters,
        };
    }

    private _clone(): Agent {
        const newAgent = new Agent();
        newAgent._llm = this._llm;
        newAgent._tts = this._tts;
        newAgent._stt = this._stt;
        newAgent._mllm = this._mllm;
        newAgent._turnDetection = this._turnDetection;
        newAgent._sal = this._sal;
        newAgent._avatar = this._avatar;
        newAgent._advancedFeatures = this._advancedFeatures;
        newAgent._parameters = this._parameters;
        newAgent._instructions = this._instructions;
        newAgent._greeting = this._greeting;
        newAgent._failureMessage = this._failureMessage;
        newAgent._maxHistory = this._maxHistory;
        return newAgent;
    }
}
