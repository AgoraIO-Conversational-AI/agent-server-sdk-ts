/**
 * AgentSession class - Manages the lifecycle of an agent session.
 *
 * This class provides a high-level interface for managing agent sessions,
 * including starting, stopping, and interacting with the agent.
 */

import type { AgoraAuthMode } from "../AgoraPoolClient.js";
import type * as Agora from "../api/index.js";
import type { AgentManagementClient } from "../api/resources/agentManagement/client/Client.js";
import type { AgentsClient } from "../api/resources/agents/client/Client.js";
import type { AgoraClient } from "../Client.js";
import { AgoraError } from "../errors/index.js";
import type { Agent } from "./Agent.js";
import {
    isAkoolAvatar,
    isAnamAvatar,
    isAvatarTokenManaged,
    isGenericAvatar,
    isHeyGenAvatar,
    isLiveAvatarAvatar,
    validateAvatarConfig,
    validateTtsSampleRate,
} from "./avatar-types.js";
import {
    getPresetCategory,
    inferAsrPreset,
    inferLlmPreset,
    inferTtsPreset,
    normalizePresetInput,
    type PresetCategory,
    type PresetInput,
    resolveSessionPresets,
} from "./presets.js";
import { ExpiresIn as ExpiresInHelper, generateConvoAIToken } from "./token.js";
import type {
    AgentConfigUpdate,
    ConversationHistory,
    ConversationTurns,
    GetTurnsOptions,
    SayOptions,
    SessionInfo,
    ThinkOptions,
    ThinkResponse,
} from "./types.js";

/**
 * Event types that can be emitted by AgentSession.
 */
export type AgentSessionEvent = "started" | "stopped" | "error";

/**
 * Event handler type.
 */
export type AgentSessionEventHandler<T = unknown> = (data: T) => void;

/**
 * Configuration options for creating an AgentSession.
 */
export interface AgentSessionOptions {
    /** The Agora client instance */
    client: AgoraClient;
    /** The agent configuration */
    agent: Agent;
    /** The App ID */
    appId: string;
    /** The App Certificate — enables automatic RTC token generation when starting sessions */
    appCertificate?: string;
    /** Unique name for this agent instance */
    name: string;
    /** The channel to join */
    channel: string;
    /** Authentication token for the channel. Omit to auto-generate (requires appCertificate). */
    token?: string;
    /** The agent's RTC UID */
    agentUid: string;
    /** Remote user UIDs to subscribe to */
    remoteUids: string[];
    /** Idle timeout in seconds (0 = no auto-exit) */
    idleTimeout?: number;
    /** Whether to use string UIDs */
    enableStringUid?: boolean;
    /** Preset IDs to use as the base ASR/LLM/TTS configuration for this session */
    preset?: PresetInput;
    /** Published AI Studio pipeline ID to use as this session's base configuration. Overrides agent.pipelineId. */
    pipelineId?: string;
    /**
     * Token lifetime in seconds (default: 86400 = 24 hours, Agora maximum).
     * Only applies when the SDK auto-generates a token (i.e. no `token` is provided).
     * Valid range: 1–86400. Use `ExpiresIn.hours()` / `ExpiresIn.minutes()` for clarity.
     */
    expiresIn?: number;
    /** Enable debug logging of API requests */
    debug?: boolean;
    /**
     * Optional logger for warnings. Defaults to console.warn.
     * Set to a no-op function to silence warnings.
     */
    warn?: (message: string) => void;
}

/**
 * AgentSession class for managing agent lifecycle and interactions.
 *
 * Use {@link Agent.createSession} to create a session — this is the recommended entry point.
 *
 * @example
 * ```typescript
 * import { AgoraClient, Area, Agent, OpenAI, ElevenLabsTTS, DeepgramSTT } from 'agora-agents';
 *
 * const client = new AgoraClient({
 *   area: Area.US,

 *   appId: '...',
 *   appCertificate: '...',
 * });
 *
 * const agent = new Agent({ name: 'support-assistant', instructions: 'You are a helpful voice assistant.' })
 *   .withLlm(new OpenAI({ apiKey: '...', model: 'gpt-4o-mini', url: 'https://api.openai.com/v1/chat/completions' }))
 *   .withTts(new ElevenLabsTTS({ key: '...', modelId: '...', voiceId: '...', baseUrl: 'wss://api.elevenlabs.io/v1', sampleRate: 24000 }))
 *   .withStt(new DeepgramSTT({ apiKey: '...', language: 'en-US' }));
 *
 * const session = agent.createSession(client, {
 *   channel: 'support-room-123',
 *   agentUid: '1',
 *   remoteUids: ['100'],
 * });
 *
 * const agentId = await session.start();
 *
 * await session.say('Hello! How can I help you today?');
 * await session.stop();
 * ```
 */
export class AgentSession {
    private readonly _client: AgoraClient;
    private readonly _agent: Agent;
    private readonly _appId: string;
    private readonly _appCertificate?: string;
    private readonly _name: string;
    private readonly _channel: string;
    private readonly _token?: string;
    private readonly _agentUid: string;
    private readonly _remoteUids: string[];
    private readonly _idleTimeout?: number;
    private readonly _enableStringUid?: boolean;
    private readonly _preset?: PresetInput;
    private readonly _pipelineId?: string;
    private readonly _expiresIn?: number;
    private readonly _debug?: boolean;
    private readonly _authMode: AgoraAuthMode;
    private _agentId: string | null = null;
    private _status: "idle" | "starting" | "running" | "stopping" | "stopped" | "error" = "idle";
    private _eventHandlers: Map<AgentSessionEvent, Set<AgentSessionEventHandler>> = new Map();
    private readonly _warn: (message: string) => void;

    constructor(options: AgentSessionOptions) {
        this._client = options.client;
        this._agent = options.agent;
        this._appId = options.appId;
        this._appCertificate = options.appCertificate;
        this._name = options.name;
        this._channel = options.channel;
        this._token = options.token;
        this._agentUid = options.agentUid;
        this._remoteUids = options.remoteUids;
        this._idleTimeout = options.idleTimeout;
        this._enableStringUid = options.enableStringUid;
        this._preset = options.preset;
        this._pipelineId = options.pipelineId;
        this._expiresIn = options.expiresIn;
        this._debug = options.debug;
        this._warn = options.warn ?? ((msg) => console.warn(msg));
        // Read authMode from pool client if available, else fall back to basic
        this._authMode = (options.client as { authMode?: AgoraAuthMode }).authMode ?? "basic";
    }

    /**
     * Builds per-request headers for app-credentials auth mode.
     *
     * Generates a fresh ConvoAI REST token on each call — no caching — to
     * avoid expired-token issues. Token generation is cheap.
     *
     * Returns undefined for basic and pre-built-token modes (the client handles those).
     */
    private _convoAIHeaders(): Record<string, string> | undefined {
        if (this._authMode !== "app-credentials") {
            return undefined;
        }
        if (!this._appCertificate) {
            throw new Error(
                "appCertificate is required for app-credentials auth mode. " +
                    "Pass appCertificate when creating AgoraClient.",
            );
        }
        const token = generateConvoAIToken({
            appId: this._appId,
            appCertificate: this._appCertificate,
            channelName: this._channel,
            uid: _parseNumericUid(this._agentUid, "agentUid"),
        });
        return { Authorization: `agora token=${token}` };
    }

    /**
     * The current agent ID (null if not started).
     */
    get id(): string | null {
        return this._agentId;
    }

    /**
     * The current session status.
     */
    get status(): "idle" | "starting" | "running" | "stopping" | "stopped" | "error" {
        return this._status;
    }

    /**
     * The agent configuration.
     */
    get agent(): Agent {
        return this._agent;
    }

    /**
     * The App ID for this session.
     */
    get appId(): string {
        return this._appId;
    }

    /**
     * Direct access to the underlying Fern-generated AgentsClient.
     *
     * Use this to access any new endpoints that Fern generates without
     * waiting for agentkit method updates. New endpoints are immediately
     * available via this property.
     *
     * Note: You'll need to pass appid and agentId manually when using raw methods.
     *
     * @example
     * ```typescript
     * // Access new endpoints directly
     * await session.raw.someNewEndpoint({
     *   appid: session.appId,
     *   agentId: session.id!,
     *   // ... other params
     * });
     * ```
     */
    get raw(): AgentsClient {
        return this._client.agents;
    }

    /**
     * Direct access to the underlying Fern-generated AgentManagement client.
     */
    get rawAgentManagement(): AgentManagementClient {
        return this._client.agentManagement;
    }

    /**
     * Returns true when the agent is configured for MLLM (multimodal end-to-end audio).
     */
    private _isMllmMode(): boolean {
        const mllm = this._agent.mllm;
        if (mllm?.enable === true) {
            return true;
        }
        return mllm !== undefined;
    }

    /**
     * Validates avatar and TTS configuration before starting.
     *
     * This catches common misconfigurations like using the wrong TTS sample rate
     * for a specific avatar vendor (e.g., HeyGen requires 24kHz, Akool requires 16kHz),
     * and rejects the unsupported MLLM + avatar combination.
     *
     * @throws {Error} If configuration is invalid
     */
    private _validateAvatarConfig(): void {
        const agentConfig = this._agent.config;
        const avatar = agentConfig.avatar;
        const tts = this._agent.tts;

        // Skip validation if no avatar is configured
        if (!avatar || avatar.enable === false) {
            return;
        }

        // Avatars currently require the cascading ASR/LLM/TTS pipeline. Reject
        // MLLM + avatar before sending the request so callers see a clear,
        // actionable error instead of an opaque server failure.
        if (this._isMllmMode()) {
            throw new Error(
                "Avatars are only supported with the cascading ASR + LLM + TTS pipeline. " +
                    "Remove the avatar configuration when using MLLM, or switch to a cascading session.",
            );
        }

        const strictAvatar = avatar as unknown as Parameters<typeof validateAvatarConfig>[0];

        // Validate non-session fields up-front. Generic avatars have additional
        // session-derived fields (agora_appid, agora_channel, agora_token) that
        // are filled by `_enrichAvatarParams()` and validated separately.
        if (
            isHeyGenAvatar(strictAvatar) ||
            isLiveAvatarAvatar(strictAvatar) ||
            isAkoolAvatar(strictAvatar) ||
            isAnamAvatar(strictAvatar) ||
            isGenericAvatar(strictAvatar)
        ) {
            validateAvatarConfig(strictAvatar);
        }

        // Validate TTS sample rate against avatar requirements
        // Note: tts can be a string (shorthand) or an object with params
        // sample_rate may not exist on all TTS vendor params, so we check dynamically
        const ttsParams = tts && typeof tts !== "string" ? tts.params : undefined;
        const sampleRate =
            ttsParams && "sample_rate" in ttsParams ? (ttsParams as { sample_rate?: number }).sample_rate : undefined;

        if (typeof sampleRate === "number") {
            if (isHeyGenAvatar(strictAvatar) || isLiveAvatarAvatar(strictAvatar) || isAkoolAvatar(strictAvatar)) {
                validateTtsSampleRate(strictAvatar, sampleRate);
            }
        } else if (isHeyGenAvatar(strictAvatar)) {
            // HeyGen requires explicit 24kHz - warn if not set
            this._warn(
                "Warning: HeyGen avatar detected but TTS sample_rate is not explicitly set. " +
                    "HeyGen requires 24,000 Hz. Please ensure your TTS provider is configured for 24kHz.",
            );
        } else if (isLiveAvatarAvatar(strictAvatar)) {
            // LiveAvatar requires explicit 24kHz - warn if not set
            this._warn(
                "Warning: LiveAvatar avatar detected but TTS sample_rate is not explicitly set. " +
                    "LiveAvatar requires 24,000 Hz. Please ensure your TTS provider is configured for 24kHz.",
            );
        } else if (isAkoolAvatar(strictAvatar)) {
            // Akool requires explicit 16kHz - warn if not set
            this._warn(
                "Warning: Akool avatar detected but TTS sample_rate is not explicitly set. " +
                    "Akool requires 16,000 Hz. Please ensure your TTS provider is configured for 16kHz.",
            );
        }
    }

    /**
     * Fills session-derived avatar fields and generates avatar ConvoAI tokens.
     *
     * Token management is gated to vendors that publish a separate RTC video
     * identity (HeyGen, LiveAvatar, Generic). Other vendors (Akool, Anam) do
     * not run a separate publisher and never receive an auto-generated token.
     */
    private _enrichAvatarParams(
        properties: Agora.StartAgentsRequest.Properties,
        expirySeconds?: number,
    ): Agora.StartAgentsRequest.Properties {
        const avatar = properties.avatar;
        if (!avatar || avatar.enable === false || !avatar.params) {
            return properties;
        }

        const params = { ...avatar.params } as Record<string, unknown>;
        const strictAvatar = avatar as unknown as Parameters<typeof validateAvatarConfig>[0];
        const tokenManaged = isAvatarTokenManaged(strictAvatar);

        if (isGenericAvatar(strictAvatar)) {
            if (params.agora_appid == null || params.agora_appid === "") {
                params.agora_appid = this._appId;
            }
            if (params.agora_channel == null || params.agora_channel === "") {
                params.agora_channel = this._channel;
            }
        }

        if (tokenManaged) {
            const avatarUid = params.agora_uid;
            const hasAvatarUid =
                (typeof avatarUid === "string" && avatarUid.length > 0) || typeof avatarUid === "number";
            const hasAvatarToken = typeof params.agora_token === "string" && params.agora_token.length > 0;

            if (hasAvatarUid && !hasAvatarToken) {
                if (!this._appCertificate) {
                    throw new Error(
                        "Cannot auto-generate avatar agora_token: appCertificate is required. " +
                            "Pass appCertificate when creating AgoraClient, or set agoraToken on the avatar vendor.",
                    );
                }
                params.agora_token = generateConvoAIToken({
                    appId: this._appId,
                    appCertificate: this._appCertificate,
                    channelName: this._channel,
                    uid: _parseNumericUid(String(avatarUid), "avatar agora_uid"),
                    tokenExpire: expirySeconds,
                });
            }

            if (hasAvatarUid && String(avatarUid) === this._agentUid) {
                this._warn(
                    "Warning: avatar agora_uid matches agent_rtc_uid. Use a unique UID for the avatar video publisher.",
                );
            }
        }

        return { ...properties, avatar: { ...avatar, params } };
    }

    private _validateEnrichedAvatarConfig(properties: Agora.StartAgentsRequest.Properties): void {
        const avatar = properties.avatar;
        if (!avatar || avatar.enable === false) {
            return;
        }

        const strictAvatar = avatar as unknown as Parameters<typeof validateAvatarConfig>[0];
        if (
            isHeyGenAvatar(strictAvatar) ||
            isLiveAvatarAvatar(strictAvatar) ||
            isAkoolAvatar(strictAvatar) ||
            isAnamAvatar(strictAvatar) ||
            isGenericAvatar(strictAvatar)
        ) {
            validateAvatarConfig(strictAvatar, { requireSessionFields: isGenericAvatar(strictAvatar) });
        }

        if (!isAvatarTokenManaged(strictAvatar)) {
            return;
        }

        const params = avatar.params as Record<string, unknown> | undefined;
        const hasUid = typeof params?.agora_uid === "string" || typeof params?.agora_uid === "number";
        const hasToken = typeof params?.agora_token === "string" && params.agora_token.length > 0;
        if (hasUid && !hasToken) {
            throw new Error(
                `${avatar.vendor ?? "Avatar"} avatar requires agora_token. ` +
                    "Pass agoraToken on the avatar vendor or provide appCertificate for automatic token generation.",
            );
        }
    }

    private _vendorValidationCategories(pipelineId?: string): {
        skipVendorValidationCategories: ReadonlySet<PresetCategory>;
        allowMissingVendorCategories: ReadonlySet<PresetCategory>;
    } {
        const skipVendorValidationCategories = new Set<PresetCategory>();
        const allowMissingVendorCategories = new Set<PresetCategory>();

        if (pipelineId) {
            allowMissingVendorCategories.add("asr");
            allowMissingVendorCategories.add("llm");
            allowMissingVendorCategories.add("tts");
        }

        const normalizedPreset = normalizePresetInput(this._preset);
        if (normalizedPreset) {
            for (const item of normalizedPreset.split(",")) {
                const category = getPresetCategory(item);
                if (category) {
                    skipVendorValidationCategories.add(category);
                    allowMissingVendorCategories.add(category);
                }
            }
        }

        if (inferAsrPreset(this._agent.stt as Agora.Asr | undefined)) {
            skipVendorValidationCategories.add("asr");
        }
        if (inferLlmPreset(this._agent.llm as Agora.Llm | undefined)) {
            skipVendorValidationCategories.add("llm");
        }
        if (inferTtsPreset(this._agent.tts as Agora.Tts | undefined)) {
            skipVendorValidationCategories.add("tts");
        }

        return { skipVendorValidationCategories, allowMissingVendorCategories };
    }

    /**
     * Start the agent session.
     *
     * All connection details were provided when creating the session.
     *
     * @returns A promise that resolves to the agent ID
     * @throws {Error} If avatar/TTS configuration is invalid
     */
    async start(): Promise<string> {
        if (this._status !== "idle" && this._status !== "stopped" && this._status !== "error") {
            throw new Error(`Cannot start session in ${this._status} state`);
        }

        // Validate avatar configuration before starting
        this._validateAvatarConfig();

        // Validate that we can generate a token if one is not provided
        if (!this._token && !this._appCertificate) {
            throw new Error(
                "Cannot auto-generate RTC token: appCertificate is required when a pre-built token is not provided. " +
                    "Pass appCertificate when creating AgoraClient, or supply a pre-built token via the session options.",
            );
        }

        this._status = "starting";

        try {
            const pipelineId = this._pipelineId ?? this._agent.pipelineId;
            // appCertificate presence is guaranteed by the guard above when no token is provided.
            let expiresIn = this._expiresIn;
            if (expiresIn !== undefined) {
                expiresIn = ExpiresInHelper.seconds(expiresIn);
            }
            const tokenOpts = this._token
                ? { token: this._token }
                : {
                      appId: this._appId,
                      appCertificate: this._appCertificate as string,
                      expiresIn,
                  };
            const { skipVendorValidationCategories, allowMissingVendorCategories } =
                this._vendorValidationCategories(pipelineId);

            const properties = this._agent.toProperties({
                channel: this._channel,
                agentUid: this._agentUid,
                remoteUids: this._remoteUids,
                idleTimeout: this._idleTimeout,
                enableStringUid: this._enableStringUid,
                skipVendorValidationCategories,
                allowMissingVendorCategories,
                ...tokenOpts,
            });
            const resolved = resolveSessionPresets({
                preset: this._preset,
                properties,
            });
            const enrichedProperties = this._enrichAvatarParams(resolved.properties, expiresIn);
            this._validateEnrichedAvatarConfig(enrichedProperties);

            const request: Agora.StartAgentsRequest = {
                appid: this._appId,
                name: this._name,
                preset: resolved.preset,
                pipeline_id: pipelineId,
                properties: enrichedProperties,
            };

            if (this._debug) {
                console.log("[Agora Debug] Starting agent session...");
                if ("getCurrentURL" in this._client && typeof this._client.getCurrentURL === "function") {
                    console.log("[Agora Debug] API Endpoint:", this._client.getCurrentURL());
                }
                console.log("[Agora Debug] Request:", JSON.stringify(request, null, 2));
            }

            const response = await this._client.agents.start(request, { headers: this._convoAIHeaders() });

            this._agentId = response.agent_id ?? null;
            this._status = "running";

            this._emit("started", { agentId: this._agentId });
            return this._agentId ?? "";
        } catch (error) {
            this._status = "error";
            this._emit("error", error);
            throw error;
        }
    }

    /**
     * Stop the agent session.
     *
     * If the agent has already stopped (e.g., crashed or timed out),
     * this method will succeed silently rather than throwing an error.
     */
    async stop(): Promise<void> {
        if (this._status !== "running") {
            throw new Error(`Cannot stop session in ${this._status} state`);
        }

        if (!this._agentId) {
            throw new Error("No agent ID available");
        }

        this._status = "stopping";

        try {
            await this._client.agents.stop(
                {
                    appid: this._appId,
                    agentId: this._agentId,
                },
                { headers: this._convoAIHeaders() },
            );

            this._status = "stopped";
            this._emit("stopped", { agentId: this._agentId });
        } catch (error) {
            // Handle 404 "task not found" gracefully - agent is already stopped
            if (error instanceof AgoraError && error.statusCode === 404) {
                this._status = "stopped";
                this._emit("stopped", { agentId: this._agentId });
                return; // Don't throw - agent is already stopped
            }

            this._status = "error";
            this._emit("error", error);
            throw error;
        }
    }

    /**
     * Send a message to be spoken by the agent.
     *
     * @param text - The text to speak
     * @param options - Optional speak options
     */
    async say(text: string, options?: SayOptions): Promise<void> {
        if (this._status !== "running") {
            throw new Error(`Cannot say in ${this._status} state`);
        }

        if (!this._agentId) {
            throw new Error("No agent ID available");
        }

        await this._client.agents.speak(
            {
                appid: this._appId,
                agentId: this._agentId,
                text,
                priority: options?.priority,
                interruptable: options?.interruptable,
            },
            { headers: this._convoAIHeaders() },
        );
    }

    /**
     * Interrupt the agent while speaking or thinking.
     */
    async interrupt(): Promise<void> {
        if (this._status !== "running") {
            throw new Error(`Cannot interrupt in ${this._status} state`);
        }

        if (!this._agentId) {
            throw new Error("No agent ID available");
        }

        await this._client.agents.interrupt(
            {
                appid: this._appId,
                agentId: this._agentId,
            },
            { headers: this._convoAIHeaders() },
        );
    }

    /**
     * Inject a text instruction into the current session pipeline.
     */
    async think(text: string, options?: ThinkOptions): Promise<ThinkResponse> {
        if (this._status !== "running") {
            throw new Error(`Cannot think in ${this._status} state`);
        }

        if (!this._agentId) {
            throw new Error("No agent ID available");
        }

        return this._client.agentManagement.agentThink(
            {
                appid: this._appId,
                agentId: this._agentId,
                text,
                on_listening_action: options?.on_listening_action,
                on_thinking_action: options?.on_thinking_action,
                on_speaking_action: options?.on_speaking_action,
                interruptable: options?.interruptable,
                metadata: options?.metadata,
            },
            { headers: this._convoAIHeaders() },
        );
    }

    /**
     * Update the agent configuration at runtime.
     *
     * @param config - Partial configuration to update
     */
    async update(config: AgentConfigUpdate): Promise<void> {
        if (this._status !== "running") {
            throw new Error(`Cannot update in ${this._status} state`);
        }

        if (!this._agentId) {
            throw new Error("No agent ID available");
        }

        await this._client.agents.update(
            {
                appid: this._appId,
                agentId: this._agentId,
                properties: config,
            },
            { headers: this._convoAIHeaders() },
        );
    }

    /**
     * Get the conversation history.
     *
     * @returns The conversation history
     */
    async getHistory(): Promise<ConversationHistory> {
        if (!this._agentId) {
            throw new Error("No agent ID available");
        }

        return this._client.agents.getHistory(
            {
                appid: this._appId,
                agentId: this._agentId,
            },
            { headers: this._convoAIHeaders() },
        );
    }

    /**
     * Get turn-by-turn analytics and timing details for this session.
     *
     * @returns The session's conversation turns
     */
    async getTurns(options?: GetTurnsOptions): Promise<ConversationTurns> {
        if (!this._agentId) {
            throw new Error("No agent ID available");
        }

        return this._client.agents.getTurns(
            {
                appid: this._appId,
                agentId: this._agentId,
                page_index: options?.page_index,
                page_size: options?.page_size,
            },
            { headers: this._convoAIHeaders() },
        );
    }

    /**
     * Get all turn analytics pages for this session.
     *
     * For very long sessions, prefer processing pages with `getTurns()` to avoid
     * holding all turn data in memory at once.
     */
    async getAllTurns(options?: Omit<GetTurnsOptions, "page_index">): Promise<ConversationTurns> {
        let page = await this.getTurns({ page_index: 1, page_size: options?.page_size });
        const allTurns = [...(page.turns ?? [])];
        let currentPage = page.pagination?.page_index ?? 1;

        while (page.pagination && !page.pagination.is_last_page) {
            if (page.pagination.page_index === undefined && page.pagination.total_pages === undefined) {
                throw new Error(
                    "getAllTurns pagination cannot continue: response must include page_index, total_pages, " +
                        "or is_last_page=true.",
                );
            }
            if (page.pagination.total_pages !== undefined && currentPage >= page.pagination.total_pages) {
                break;
            }
            const nextPage = currentPage + 1;
            page = await this.getTurns({ page_index: nextPage, page_size: options?.page_size });
            allTurns.push(...(page.turns ?? []));
            const returnedPage = page.pagination?.page_index;
            if (returnedPage !== undefined) {
                if (returnedPage <= currentPage && !page.pagination?.is_last_page) {
                    throw new Error(
                        `getAllTurns pagination did not advance: requested page ${nextPage}, ` +
                            `received page ${returnedPage}.`,
                    );
                }
                currentPage = returnedPage;
            } else {
                if (page.pagination?.total_pages === undefined && !page.pagination?.is_last_page) {
                    throw new Error(
                        "getAllTurns pagination cannot continue: response must include page_index, total_pages, " +
                            "or is_last_page=true.",
                    );
                }
                currentPage = nextPage;
            }
        }

        return { ...page, turns: allTurns };
    }

    /**
     * Get the current session info.
     *
     * @returns The session info
     */
    async getInfo(): Promise<SessionInfo> {
        if (!this._agentId) {
            throw new Error("No agent ID available");
        }

        return this._client.agents.get(
            {
                appid: this._appId,
                agentId: this._agentId,
            },
            { headers: this._convoAIHeaders() },
        );
    }

    /**
     * Register an event handler.
     *
     * @param event - The event type
     * @param handler - The event handler
     */
    on<T = unknown>(event: AgentSessionEvent, handler: AgentSessionEventHandler<T>): void {
        if (!this._eventHandlers.has(event)) {
            this._eventHandlers.set(event, new Set());
        }
        this._eventHandlers.get(event)?.add(handler as AgentSessionEventHandler);
    }

    /**
     * Unregister an event handler.
     *
     * @param event - The event type
     * @param handler - The event handler
     */
    off<T = unknown>(event: AgentSessionEvent, handler: AgentSessionEventHandler<T>): void {
        const handlers = this._eventHandlers.get(event);
        if (handlers) {
            handlers.delete(handler as AgentSessionEventHandler);
        }
    }

    /**
     * Emit an event to all registered handlers.
     */
    private _emit<T>(event: AgentSessionEvent, data: T): void {
        const handlers = this._eventHandlers.get(event);
        if (handlers) {
            for (const handler of handlers) {
                try {
                    handler(data);
                } catch (err) {
                    this._warn(
                        `Unhandled error in '${event}' event handler: ${err instanceof Error ? err.message : String(err)}`,
                    );
                }
            }
        }
    }
}

function _parseNumericUid(uid: string, label: string): number {
    if (!/^\d+$/.test(uid)) {
        throw new Error(`${label} must be a numeric RTC UID when auto-generating a ConvoAI token`);
    }
    return Number(uid);
}
