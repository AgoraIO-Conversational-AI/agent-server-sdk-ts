/**
 * Agent class - A reusable agent definition.
 *
 * This class represents an agent configuration that can be used to create
 * multiple sessions. It provides a fluent builder pattern for configuration.
 */

import type * as Agora from "../api/index.js";
import type { AgoraClient } from "../Client.js";
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
    SessionOptions,
} from "./types.js";
import { BaseLLM, BaseTTS, BaseSTT, BaseMLLM, BaseAvatar } from "./vendors/base.js";
import { generateRtcToken } from "./token.js";
import { AgentSession } from "./AgentSession.js";

/**
 * Configuration options for creating an Agent.
 * 
 * Use the fluent builder methods (.withLlm(), .withTts(), .withStt(), .withMllm())
 * to configure vendor settings after construction.
 */
export interface AgentOptions {
    /** Optional name for the agent (used as default session name) */
    name?: string;
    /** System instructions for the agent */
    instructions?: string;
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
 * Agent class representing a reusable agent configuration.
 * 
 * @template TTSSampleRate - The TTS sample rate literal type (tracked for avatar compatibility)
 *
 * @example
 * ```typescript
 * import { Agent, OpenAI, MicrosoftTTS, DeepgramSTT } from 'agora-agent-sdk';
 *
 * // Use the fluent builder pattern to configure vendors
 * const agent = new Agent({ instructions: 'You are helpful.' })
 *   .withLlm(new OpenAI({ apiKey: '...', model: 'gpt-4' }))
 *   .withTts(new ElevenLabsTTS({ key: '...', modelId: '...', voiceId: '...', sampleRate: 24000 }))
 *   .withStt(new DeepgramSTT({ apiKey: '...', model: 'nova-2' }));
 * ```
 */
export class Agent<TTSSampleRate extends number = number> {
    private _name?: string;
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
        this._name = options.name;
        this._instructions = options.instructions;
        this._greeting = options.greeting;
        this._failureMessage = options.failureMessage;
        this._maxHistory = options.maxHistory;

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
     * Returns a new Agent with the specified LLM vendor.
     * 
     * @param vendor - LLM vendor instance (e.g., new OpenAI({ apiKey: '...', model: 'gpt-4' }))
     */
    withLlm(vendor: BaseLLM): Agent<TTSSampleRate> {
        const newAgent = this._clone() as Agent<TTSSampleRate>;
        newAgent._llm = vendor.toConfig();
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified TTS vendor.
     * 
     * The sample rate type is tracked for compile-time avatar compatibility checking.
     * 
     * @template SR - Sample rate literal type
     * @param vendor - TTS vendor instance (e.g., new ElevenLabsTTS({ key: '...', modelId: '...', voiceId: '...', sampleRate: 24000 }))
     * @returns Agent with tracked sample rate type
     */
    withTts<SR extends number>(vendor: BaseTTS<SR>): Agent<SR> {
        const newAgent = this._clone() as Agent<SR>;
        newAgent._tts = vendor.toConfig();
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified STT vendor.
     * 
     * @param vendor - STT vendor instance (e.g., new SpeechmaticsSTT({ apiKey: '...', language: 'en' }))
     * 
     * @example
     * ```typescript
     * import { SpeechmaticsSTT } from 'agora-agent-sdk';
     * 
     * agent.withStt(new SpeechmaticsSTT({
     *   apiKey: 'your-key',
     *   language: 'en',
     * }));
     * ```
     */
    withStt(vendor: BaseSTT): Agent<TTSSampleRate> {
        const newAgent = this._clone() as Agent<TTSSampleRate>;
        newAgent._stt = vendor.toConfig();
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified MLLM vendor.
     * 
     * @param vendor - MLLM vendor instance (e.g., new VertexAI({ model: '...', projectId: '...', ... }))
     */
    withMllm(vendor: BaseMLLM): Agent<TTSSampleRate> {
        const newAgent = this._clone() as Agent<TTSSampleRate>;
        newAgent._mllm = vendor.toConfig();
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified Avatar vendor.
     * 
     * ⚠️ IMPORTANT: Different avatar vendors require specific TTS sample rates:
     * - HeyGen: Requires 24,000 Hz (24kHz)
     * - Akool: Requires 16,000 Hz (16kHz)
     * 
     * This method enforces sample rate compatibility at compile time. If you configure
     * a TTS with 16kHz and try to add a HeyGen avatar (which needs 24kHz), TypeScript
     * will show a compile error.
     * 
     * @template RequiredSR - Required sample rate for the avatar
     * @param vendor - Avatar vendor instance (e.g., new HeyGenAvatar({ apiKey: '...', quality: 'high', ... }))
     * 
     * @example
     * ```typescript
     * import { HeyGenAvatar, ElevenLabsTTS } from 'agora-agent-sdk';
     * 
     * const agent = new Agent({ name: 'avatar-assistant' })
     *   .withTts(new ElevenLabsTTS({
     *     key: '...',
     *     modelId: '...',
     *     voiceId: '...',
     *     sampleRate: 24000, // Required for HeyGen
     *   }))
     *   .withAvatar(new HeyGenAvatar({
     *     apiKey: '...',
     *     quality: 'high',
     *     agoraUid: '12345',
     *   }));
     * ```
     */
    withAvatar<RequiredSR extends number>(
        this: Agent<RequiredSR>,
        vendor: BaseAvatar<RequiredSR>
    ): Agent<RequiredSR> {
        const newAgent = this._clone() as Agent<RequiredSR>;
        newAgent._avatar = vendor.toConfig();
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified turn detection configuration.
     */
    withTurnDetection(config: TurnDetectionConfig): Agent<TTSSampleRate> {
        const newAgent = this._clone() as Agent<TTSSampleRate>;
        newAgent._turnDetection = config;
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified instructions.
     */
    withInstructions(instructions: string): Agent<TTSSampleRate> {
        const newAgent = this._clone() as Agent<TTSSampleRate>;
        newAgent._instructions = instructions;
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified greeting message.
     */
    withGreeting(greeting: string): Agent<TTSSampleRate> {
        const newAgent = this._clone() as Agent<TTSSampleRate>;
        newAgent._greeting = greeting;
        return newAgent;
    }

    /**
     * Returns a new Agent with the specified name.
     */
    withName(name: string): Agent<TTSSampleRate> {
        const newAgent = this._clone() as Agent<TTSSampleRate>;
        newAgent._name = name;
        return newAgent;
    }

    /**
     * Get the agent name.
     */
    get name(): string | undefined {
        return this._name;
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
     * Get the full agent configuration as an AgentConfig object.
     * This provides read-only access to the complete configuration.
     */
    get config(): AgentOptions {
        return {
            name: this._name,
            instructions: this._instructions,
            turnDetection: this._turnDetection,
            sal: this._sal,
            avatar: this._avatar,
            advancedFeatures: this._advancedFeatures,
            parameters: this._parameters,
            greeting: this._greeting,
            failureMessage: this._failureMessage,
            maxHistory: this._maxHistory,
        };
    }

    /**
     * Creates a new session from this agent configuration.
     *
     * @param client - The Agora client instance (must have appId and appCertificate properties)
     * @param options - Session connection options
     * @returns A new AgentSession instance ready to start
     *
     * @example
     * ```typescript
     * const agent = new Agent({ name: 'my-assistant', instructions: '...' })
     *   .withLlm({ ... })
     *   .withTts({ ... });
     *
     * const session = agent.createSession(client, {
     *   channel: 'room-123',
     *   agentUid: '1',
     *   remoteUids: ['100'],
     *   idleTimeout: 120,
     * });
     *
     * const agentId = await session.start();
     * ```
     */
    createSession(
        client: AgoraClient & { readonly appId: string; readonly appCertificate?: string },
        options: SessionOptions,
    ): AgentSession {
        const name = options.name ?? this._name ?? `agent-${Date.now()}`;
        return new AgentSession({
            client,
            agent: this,
            appId: client.appId,
            appCertificate: client.appCertificate,
            ...options,
            name,
        });
    }

    /**
     * Converts the Agent configuration to the Fern request properties format.
     *
     * Pass either a pre-built `token` OR `appId` + `appCertificate` to have
     * the SDK generate one automatically.
     */
    toProperties(opts: {
        channel: string;
        agentUid: string;
        remoteUids: string[];
        idleTimeout?: number;
        enableStringUid?: boolean;
    } & (
        | { token: string; appId?: undefined; appCertificate?: undefined }
        | { token?: undefined; appId: string; appCertificate: string; tokenExpirySeconds?: number }
    )): Agora.StartAgentsRequest.Properties {
        const token =
            opts.token ??
            generateRtcToken({
                appId: opts.appId!,
                appCertificate: opts.appCertificate!,
                channel: opts.channel,
                uid: parseInt(opts.agentUid, 10),
                expirySeconds: opts.tokenExpirySeconds,
            });
        // In MLLM mode the backend handles audio end-to-end; LLM, TTS, and ASR
        // are disabled automatically — they must not be required by the SDK.
        const isMllmMode = this._advancedFeatures?.enable_mllm === true;

        const base = {
            channel: opts.channel,
            token,
            agent_rtc_uid: opts.agentUid,
            remote_rtc_uids: opts.remoteUids,
            idle_timeout: opts.idleTimeout,
            enable_string_uid: opts.enableStringUid,
            mllm: this._mllm,
            turn_detection: this._turnDetection,
            sal: this._sal,
            avatar: this._avatar,
            advanced_features: this._advancedFeatures,
            parameters: this._parameters,
        };

        if (isMllmMode) {
            // Cast needed because the generated Properties type marks `tts` as
            // required, but the REST API omits it when enable_mllm = true.
            return base as Agora.StartAgentsRequest.Properties;
        }

        if (!this._tts) {
            throw new Error("TTS configuration is required. Use withTts() to set it.");
        }

        // TODO: Once Agora provides a platform-level default LLM, replace the
        // throw below with a fallback config so callers can omit withLlm().
        //
        // const llmConfig: Agora.StartAgentsRequest.Properties.Llm = this._llm
        //     ? {
        //           ...this._llm,
        //           system_messages: this._instructions
        //               ? [{ role: "system", content: this._instructions }]
        //               : this._llm.system_messages,
        //           greeting_message: this._greeting ?? this._llm.greeting_message,
        //           failure_message: this._failureMessage ?? this._llm.failure_message,
        //           max_history: this._maxHistory ?? this._llm.max_history,
        //       }
        //     : {
        //           url: "<agora-default-llm-url>",
        //           system_messages: this._instructions ? [{ role: "system", content: this._instructions }] : undefined,
        //           greeting_message: this._greeting,
        //           failure_message: this._failureMessage,
        //           max_history: this._maxHistory,
        //       };

        if (!this._llm) {
            throw new Error("LLM configuration is required. Use withLlm() to set it.");
        }

        const llmConfig: Agora.StartAgentsRequest.Properties.Llm = {
            ...this._llm,
            system_messages: this._instructions
                ? [{ role: "system", content: this._instructions }]
                : this._llm.system_messages,
            greeting_message: this._greeting ?? this._llm.greeting_message,
            failure_message: this._failureMessage ?? this._llm.failure_message,
            max_history: this._maxHistory ?? this._llm.max_history,
        };

        return { ...base, llm: llmConfig, tts: this._tts, asr: this._stt };
    }

    private _clone(): Agent {
        const newAgent = new Agent();
        newAgent._name = this._name;
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
