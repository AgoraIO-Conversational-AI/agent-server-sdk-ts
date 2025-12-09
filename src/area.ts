/**
 * Regional endpoint management for Agora API.
 *
 * This module provides area-based URL selection with automatic region cycling
 * for optimal connectivity.
 */

/**
 * Global regions where the Open API gateway endpoint is located.
 */
export const GatewayArea = {
    US: "US",
    EU: "EU",
    APAC: "APAC",
    CN: "CN",
} as const;

export type GatewayArea = (typeof GatewayArea)[keyof typeof GatewayArea];

const CHINESE_MAINLAND_DOMAIN = "sd-rtn.com";
const OVERSEAS_DOMAIN = "agora.io";

const US_WEST_REGION_PREFIX = "api-us-west-1";
const US_EAST_REGION_PREFIX = "api-us-east-1";

const AP_SOUTHEAST_REGION_PREFIX = "api-ap-southeast-1";
const AP_NORTHEAST_REGION_PREFIX = "api-ap-northeast-1";

const EU_WEST_REGION_PREFIX = "api-eu-west-1";
const EU_CENTRAL_REGION_PREFIX = "api-eu-central-1";

const CN_EAST_REGION_PREFIX = "api-cn-east-1";
const CN_NORTH_REGION_PREFIX = "api-cn-north-1";

interface DomainConfig {
    regionPrefixes: string[];
    domainSuffixes: string[];
}

const REGION_DOMAIN_CONFIG: Record<GatewayArea, DomainConfig> = {
    [GatewayArea.US]: {
        regionPrefixes: [US_WEST_REGION_PREFIX, US_EAST_REGION_PREFIX],
        domainSuffixes: [OVERSEAS_DOMAIN, CHINESE_MAINLAND_DOMAIN],
    },
    [GatewayArea.EU]: {
        regionPrefixes: [EU_WEST_REGION_PREFIX, EU_CENTRAL_REGION_PREFIX],
        domainSuffixes: [OVERSEAS_DOMAIN, CHINESE_MAINLAND_DOMAIN],
    },
    [GatewayArea.APAC]: {
        regionPrefixes: [AP_SOUTHEAST_REGION_PREFIX, AP_NORTHEAST_REGION_PREFIX],
        domainSuffixes: [OVERSEAS_DOMAIN, CHINESE_MAINLAND_DOMAIN],
    },
    [GatewayArea.CN]: {
        regionPrefixes: [CN_EAST_REGION_PREFIX, CN_NORTH_REGION_PREFIX],
        domainSuffixes: [CHINESE_MAINLAND_DOMAIN, OVERSEAS_DOMAIN],
    },
};

/**
 * Manages a pool of regional URLs with automatic cycling.
 *
 * This class provides:
 * - Area-based endpoint selection (US, EU, APAC, CN)
 * - Region cycling for failover scenarios
 */
export class RegionalEndpointPool {
    private readonly _gatewayArea: GatewayArea;
    private readonly _domainSuffixes: string[];
    private _currentDomain: string;
    private readonly _regionPrefixes: string[];
    private _currentRegionPrefixes: string[];

    /**
     * Initialize a regional endpoint pool for the specified area.
     *
     * @param gatewayArea - The geographic area for endpoint selection.
     * @throws Error if the gateway area is not valid.
     */
    constructor(gatewayArea: GatewayArea) {
        const config = REGION_DOMAIN_CONFIG[gatewayArea];
        if (!config) {
            throw new Error(`Invalid gateway area: ${gatewayArea}`);
        }

        this._gatewayArea = gatewayArea;
        this._domainSuffixes = [...config.domainSuffixes];
        this._currentDomain = this._domainSuffixes[0];
        this._regionPrefixes = [...config.regionPrefixes];
        this._currentRegionPrefixes = [...this._regionPrefixes];
    }

    /**
     * Cycle to the next region prefix in the pool.
     *
     * This method is useful for failover scenarios where the current
     * region is not responding.
     */
    public nextRegion(): void {
        this._currentRegionPrefixes = this._currentRegionPrefixes.slice(1);
        if (this._currentRegionPrefixes.length === 0) {
            this._currentRegionPrefixes = [...this._regionPrefixes];
        }
    }

    /**
     * Get the current base URL based on the selected region and domain.
     *
     * @returns The full base URL for API requests.
     */
    public getCurrentUrl(): string {
        const currentRegion = this._currentRegionPrefixes[0];
        const currentDomain = this._currentDomain;
        return `https://${currentRegion}.${currentDomain}/api/conversational-ai-agent`;
    }

    /**
     * The gateway area this pool is configured for.
     */
    public get gatewayArea(): GatewayArea {
        return this._gatewayArea;
    }
}
