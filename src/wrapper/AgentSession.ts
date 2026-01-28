/**
 * AgentSession class - Manages the lifecycle of an agent session.
 *
 * This class provides a high-level interface for managing agent sessions,
 * including starting, stopping, and interacting with the agent.
 */

import type { AgoraClient } from "../Client.js";
import type { AgentsClient } from "../api/resources/agents/client/Client.js";
import type * as Agora from "../api/index.js";
import { Agent } from "./Agent.js";
import type {
    SessionStartOptions,
    SessionHandle,
    ConversationHistory,
    SayOptions,
    AgentConfigUpdate,
    SessionInfo,
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
}

/**
 * AgentSession class for managing agent lifecycle and interactions.
 *
 * @example
 * ```typescript
 * import { AgoraClient, Agent, AgentSession } from 'agora-sdk';
 *
 * const client = new AgoraClient({ appId: '...', appCertificate: '...' });
 *
 * const agent = new Agent({
 *   instructions: 'You are a helpful voice assistant.',
 *   llm: 'openai/gpt-4-turbo',
 *   tts: { vendor: 'microsoft', params: { key: '...', region: 'eastus', voice_name: 'en-US-JennyNeural' } },
 * });
 *
 * const session = new AgentSession({ client, agent, appId: 'your-app-id' });
 *
 * // Start the session
 * const handle = await session.start({
 *   name: 'my-agent',
 *   channel: 'support-room-123',
 *   token: rtcToken,
 *   agentUid: '1001',
 *   remoteUids: ['1002'],
 * });
 *
 * // Interact with the agent
 * await session.say('Hello! How can I help you today?');
 *
 * // Get conversation history
 * const history = await session.getHistory();
 *
 * // Stop the session
 * await session.stop();
 * ```
 */
export class AgentSession {
    private readonly _client: AgoraClient;
    private readonly _agent: Agent;
    private readonly _appId: string;
    private _agentId: string | null = null;
    private _status: "idle" | "starting" | "running" | "stopping" | "stopped" | "error" = "idle";
    private _eventHandlers: Map<AgentSessionEvent, Set<AgentSessionEventHandler>> = new Map();

    constructor(options: AgentSessionOptions) {
        this._client = options.client;
        this._agent = options.agent;
        this._appId = options.appId;
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
     * Start the agent session.
     *
     * @param options - Session start options
     * @returns A promise that resolves to the session handle
     */
    async start(
        options: Omit<SessionStartOptions, "appId">,
    ): Promise<SessionHandle> {
        if (this._status !== "idle" && this._status !== "stopped" && this._status !== "error") {
            throw new Error(`Cannot start session in ${this._status} state`);
        }

        this._status = "starting";

        try {
            const properties = this._agent.toProperties(
                options.channel,
                options.token,
                options.agentUid,
                options.remoteUids,
                {
                    idleTimeout: options.idleTimeout,
                    enableStringUid: options.enableStringUid,
                },
            );

            const request: Agora.StartAgentsRequest = {
                appid: this._appId,
                name: options.name,
                properties,
            };

            const response = await this._client.agents.start(request);

            this._agentId = response.agent_id ?? null;
            this._status = "running";

            const handle: SessionHandle = {
                agentId: response.agent_id ?? "",
                createTs: response.create_ts ?? Date.now(),
                status: response.status ?? "running",
            };

            this._emit("started", handle);
            return handle;
        } catch (error) {
            this._status = "error";
            this._emit("error", error);
            throw error;
        }
    }

    /**
     * Stop the agent session.
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
