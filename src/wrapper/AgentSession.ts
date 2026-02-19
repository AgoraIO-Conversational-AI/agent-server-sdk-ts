/**
 * AgentSession class - Manages the lifecycle of an agent session.
 *
 * This class provides a high-level interface for managing agent sessions,
 * including starting, stopping, and interacting with the agent.
 */

import type { AgoraClient } from "../Client.js";
import type { AgentsClient } from "../api/resources/agents/client/Client.js";
import type * as Agora from "../api/index.js";
import { AgoraError } from "../errors/index.js";
import { Agent } from "./Agent.js";
import type {
    ConversationHistory,
    SayOptions,
    AgentConfigUpdate,
    SessionInfo,
} from "./types.js";
import { validateTtsSampleRate, validateAvatarConfig, isHeyGenAvatar, isAkoolAvatar } from "./avatar-types.js";

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
}

/**
 * AgentSession class for managing agent lifecycle and interactions.
 *
 * Use {@link Agent.createSession} to create a session — this is the recommended entry point.
 *
 * @example
 * ```typescript
 * import { AgoraClient, Area, Agent } from 'agora-sdk';
 *
 * const client = new AgoraClient({
 *   area: Area.US,
 *   appId: '...',
 *   appCertificate: '...',
 *   customerId: '...',
 *   customerSecret: '...',
 * });
 *
 * const agent = new Agent({ name: 'support-assistant', instructions: 'You are a helpful voice assistant.' })
 *   .withLlm({ url: 'https://api.openai.com/v1/chat/completions', api_key: '...' })
 *   .withTts({ vendor: 'elevenlabs', params: { key: '...', model_id: '...', voice_id: '...' } })
 *   .withStt({ vendor: 'deepgram', params: { api_key: '...' } });
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
    private _agentId: string | null = null;
    private _status: "idle" | "starting" | "running" | "stopping" | "stopped" | "error" = "idle";
    private _eventHandlers: Map<AgentSessionEvent, Set<AgentSessionEventHandler>> = new Map();

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
     * waiting for wrapper method updates. New endpoints are immediately
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
     * Validates avatar and TTS configuration before starting.
     * 
     * This catches common misconfigurations like using the wrong TTS sample rate
     * for a specific avatar vendor (e.g., HeyGen requires 24kHz, Akool requires 16kHz).
     * 
     * @throws {Error} If configuration is invalid
     */
    private _validateAvatarConfig(): void {
        const agentConfig = this._agent.config;
        const avatar = agentConfig.avatar;
        const tts = agentConfig.tts;

        // Skip validation if no avatar is configured
        if (!avatar || avatar.enable === false) {
            return;
        }

        // Validate avatar config structure
        if (isHeyGenAvatar(avatar) || isAkoolAvatar(avatar)) {
            validateAvatarConfig(avatar);
        }

        // Validate TTS sample rate against avatar requirements
        // Note: tts can be a string (shorthand) or an object with params
        // sample_rate may not exist on all TTS vendor params, so we check dynamically
        const ttsParams = tts && typeof tts !== 'string' ? tts.params : undefined;
        const sampleRate = ttsParams && 'sample_rate' in ttsParams 
            ? (ttsParams as { sample_rate?: number }).sample_rate 
            : undefined;
        
        if (typeof sampleRate === 'number') {
            if (isHeyGenAvatar(avatar) || isAkoolAvatar(avatar)) {
                validateTtsSampleRate(avatar, sampleRate);
            }
        } else if (isHeyGenAvatar(avatar)) {
            // HeyGen requires explicit 24kHz - warn if not set
            console.warn(
                '⚠️  Warning: HeyGen avatar detected but TTS sample_rate is not explicitly set. ' +
                'HeyGen requires 24,000 Hz. Please ensure your TTS provider is configured for 24kHz.'
            );
        } else if (isAkoolAvatar(avatar)) {
            // Akool requires explicit 16kHz - warn if not set
            console.warn(
                '⚠️  Warning: Akool avatar detected but TTS sample_rate is not explicitly set. ' +
                'Akool requires 16,000 Hz. Please ensure your TTS provider is configured for 16kHz.'
            );
        }
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

        this._status = "starting";

        try {
            const tokenOpts = this._token
                ? { token: this._token }
                : {
                      appId: this._appId,
                      appCertificate: this._appCertificate!,
                  };

            const properties = this._agent.toProperties({
                channel: this._channel,
                agentUid: this._agentUid,
                remoteUids: this._remoteUids,
                idleTimeout: this._idleTimeout,
                enableStringUid: this._enableStringUid,
                ...tokenOpts,
            });

            const request: Agora.StartAgentsRequest = {
                appid: this._appId,
                name: this._name,
                properties,
            };

            const response = await this._client.agents.start(request);

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
            await this._client.agents.stop({
                appid: this._appId,
                agentId: this._agentId,
            });

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

        await this._client.agents.speak({
            appid: this._appId,
            agentId: this._agentId,
            text,
            priority: options?.priority,
            interruptable: options?.interruptable,
        });
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

        await this._client.agents.interrupt({
            appid: this._appId,
            agentId: this._agentId,
        });
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

        await this._client.agents.update({
            appid: this._appId,
            agentId: this._agentId,
            properties: config,
        });
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

        return this._client.agents.getHistory({
            appid: this._appId,
            agentId: this._agentId,
        });
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

        return this._client.agents.get({
            appid: this._appId,
            agentId: this._agentId,
        });
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
        this._eventHandlers.get(event)!.add(handler as AgentSessionEventHandler);
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
                } catch {
                    // Ignore handler errors
                }
            }
        }
    }
}
