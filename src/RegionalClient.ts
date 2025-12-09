/**
 * Regional Agora client with area-based URL selection.
 *
 * This module provides a wrapper client that extends the base AgoraClient
 * with support for regional endpoint selection.
 */

import { AgentsClient } from "./api/resources/agents/client/Client.js";
import { PhoneNumbersClient } from "./api/resources/phoneNumbers/client/Client.js";
import { TelephonyClient } from "./api/resources/telephony/client/Client.js";
import type { BaseClientOptions, BaseRequestOptions } from "./BaseClient.js";
import { normalizeClientOptions } from "./BaseClient.js";
import { type GatewayArea, RegionalEndpointPool } from "./area.js";

export declare namespace RegionalAgoraClient {
    export interface Options extends BaseClientOptions {
        /**
         * The geographic area for endpoint selection. If provided, the client
         * will automatically select the appropriate regional endpoint.
         */
        gatewayArea?: GatewayArea;
        /**
         * A pre-configured endpoint pool. Use this if you want to manage
         * the pool lifecycle yourself or share a pool across multiple clients.
         */
        endpointPool?: RegionalEndpointPool;
    }

    export interface RequestOptions extends BaseRequestOptions {}
}

/**
 * Agora client with regional endpoint selection.
 *
 * This client extends the base functionality with support for area-based
 * URL selection, allowing you to connect to the optimal regional endpoint.
 *
 * @example
 * ```typescript
 * import { AgoraClient, GatewayArea } from "agora-sdk";
 *
 * const client = new AgoraClient({
 *     gatewayArea: GatewayArea.US,
 *     username: "YOUR_USERNAME",
 *     password: "YOUR_PASSWORD",
 * });
 * ```
 */
export class RegionalAgoraClient {
    protected readonly _options: RegionalAgoraClient.Options;
    protected readonly _endpointPool: RegionalEndpointPool | undefined;
    protected _agents: AgentsClient | undefined;
    protected _telephony: TelephonyClient | undefined;
    protected _phoneNumbers: PhoneNumbersClient | undefined;

    constructor(options: RegionalAgoraClient.Options) {
        const resolvedOptions = { ...options };
        let endpointPool: RegionalEndpointPool | undefined;

        if (options.baseUrl == null) {
            if (options.endpointPool != null) {
                endpointPool = options.endpointPool;
                resolvedOptions.baseUrl = () => endpointPool?.getCurrentUrl();
            } else if (options.gatewayArea != null) {
                endpointPool = new RegionalEndpointPool(options.gatewayArea);
                resolvedOptions.baseUrl = () => endpointPool?.getCurrentUrl();
            }
        }

        this._endpointPool = endpointPool;
        this._options = normalizeClientOptions(resolvedOptions);
    }

    /**
     * The endpoint pool used by this client, if any.
     */
    public get endpointPool(): RegionalEndpointPool | undefined {
        return this._endpointPool;
    }

    public get agents(): AgentsClient {
        return (this._agents ??= new AgentsClient(this._options));
    }

    public get telephony(): TelephonyClient {
        return (this._telephony ??= new TelephonyClient(this._options));
    }

    public get phoneNumbers(): PhoneNumbersClient {
        return (this._phoneNumbers ??= new PhoneNumbersClient(this._options));
    }
}
