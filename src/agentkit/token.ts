/**
 * Token generation for internal use by the agentkit layer.
 *
 * - RTC tokens authenticate a specific (appId, channel, uid) combination with
 *   the Agora RTC network.
 * - ConvoAI tokens are combined RTC + RTM tokens used to authenticate ConvoAI
 *   REST API calls via `Authorization: agora token=<token>`.
 *
 * The `agora-token` library handles the JWT signing.
 */

import { RtcTokenBuilder, RtcRole } from "agora-token";

const DEFAULT_EXPIRY_SECONDS = 86400;
const MAX_EXPIRY_SECONDS = 86400;

/**
 * Convenience helpers for specifying token expiry durations.
 *
 * Agora AccessToken2 tokens are valid for a maximum of 24 hours (86400 seconds).
 * Use these helpers with `expiresIn` when creating sessions to avoid hardcoding
 * raw second values.
 *
 * @example
 * ```typescript
 * agent.createSession(client, {
 *   channel: 'room-123',
 *   agentUid: '1',
 *   remoteUids: ['100'],
 *   expiresIn: ExpiresIn.hours(12),
 * });
 * ```
 */
export const ExpiresIn: {
    MAX: 86400;
    HOUR: 3600;
    DAY: 86400;
    hours(h: number): number;
    minutes(m: number): number;
    seconds(s: number): number;
} = {
    /** Maximum token lifetime allowed by Agora (24 hours = 86400 seconds) */
    MAX: 86400,
    HOUR: 3600,
    DAY: 86400,

    /**
     * Convert hours to seconds. Throws if the value exceeds 24 hours.
     * @param h - Number of hours (must be > 0 and ≤ 24)
     */
    hours(h: number): number {
        const secs = h * 3600;
        return _validateExpiresIn(secs);
    },

    /**
     * Convert minutes to seconds. Throws if the value exceeds 24 hours.
     * @param m - Number of minutes (must be > 0 and ≤ 1440)
     */
    minutes(m: number): number {
        const secs = m * 60;
        return _validateExpiresIn(secs);
    },

    /**
     * Validate raw seconds. Throws if ≤ 0; warns and caps at 86400 if > 86400.
     * @param s - Number of seconds
     */
    seconds(s: number): number {
        return _validateExpiresIn(s);
    },
};

/**
 * Validates an `expiresIn` value in seconds.
 * - Throws if ≤ 0.
 * - Warns and caps at MAX_EXPIRY_SECONDS if > MAX_EXPIRY_SECONDS.
 */
function _validateExpiresIn(secs: number): number {
    if (secs <= 0) {
        throw new Error("expiresIn must be between 1 and 86400 seconds (24h)");
    }
    if (secs > MAX_EXPIRY_SECONDS) {
        console.warn("agora-agent-sdk: expiresIn capped at 24h (Agora max)");
        return MAX_EXPIRY_SECONDS;
    }
    return secs;
}

export interface GenerateTokenOptions {
    appId: string;
    appCertificate: string;
    channel: string;
    uid: number;
    role?: typeof RtcRole.PUBLISHER | typeof RtcRole.SUBSCRIBER;
    expirySeconds?: number;
}

/**
 * Builds a short-lived RTC token for a numeric UID.
 *
 * Both `tokenExpire` and `privilegeExpire` are set to the same value — the
 * standard approach for most applications.
 */
export function generateRtcToken(opts: GenerateTokenOptions): string {
    const expiry = opts.expirySeconds ?? DEFAULT_EXPIRY_SECONDS;
    return RtcTokenBuilder.buildTokenWithUid(
        opts.appId,
        opts.appCertificate,
        opts.channel,
        opts.uid,
        opts.role ?? RtcRole.PUBLISHER,
        expiry,
        expiry,
    );
}

export interface GenerateRtcTokenWithAccountOptions {
    appId: string;
    appCertificate: string;
    channel: string;
    /** String account identity — used when enableStringUid is true */
    account: string;
    role?: typeof RtcRole.PUBLISHER | typeof RtcRole.SUBSCRIBER;
    expirySeconds?: number;
}

/**
 * Builds a short-lived RTC token for a string UID (user account).
 *
 * Use this instead of `generateRtcToken` when `enableStringUid` is true and
 * the agent UID is a non-numeric string. The Agora platform treats
 * `buildTokenWithUserAccount` tokens as valid for string-UID channels.
 *
 * Both `tokenExpire` and `privilegeExpire` are set to the same value.
 */
export function generateRtcTokenWithAccount(opts: GenerateRtcTokenWithAccountOptions): string {
    const expiry = opts.expirySeconds ?? DEFAULT_EXPIRY_SECONDS;
    return RtcTokenBuilder.buildTokenWithUserAccount(
        opts.appId,
        opts.appCertificate,
        opts.channel,
        opts.account,
        opts.role ?? RtcRole.PUBLISHER,
        expiry,
        expiry,
    );
}

export interface GenerateConvoAITokenOptions {
    appId: string;
    appCertificate: string;
    /** The channel the agent will join — must match the channel used in the start request */
    channelName: string;
    /**
     * String account identity for the token. When used with numeric UIDs, pass
     * the agent UID as a string (e.g. "1001"). For RTM, this becomes the user ID.
     */
    account: string;
    /** Seconds until the token expires (default: 86400) */
    tokenExpire?: number;
    /**
     * Seconds until privileges expire. Defaults to the same value as `tokenExpire`.
     * Per Agora docs, setting this to 0 would expire privileges immediately — the SDK
     * always substitutes `tokenExpire` when this is 0 or omitted.
     */
    privilegeExpire?: number;
}

/**
 * Builds a combined RTC + RTM token for ConvoAI REST API authentication.
 *
 * The resulting token is used as: `Authorization: agora token=<token>`
 *
 * Uses `buildTokenWithRtm` which bundles both RTC channel access and RTM
 * messaging privileges in a single AccessToken2 token.
 */
export function generateConvoAIToken(opts: GenerateConvoAITokenOptions): string {
    const tokenExpire = opts.tokenExpire ?? DEFAULT_EXPIRY_SECONDS;
    // Per Agora docs, privilegeExpire=0 means "expires immediately", which is invalid.
    // When omitted or 0, use the same value as tokenExpire.
    const privilegeExpire = (opts.privilegeExpire ?? 0) === 0 ? tokenExpire : opts.privilegeExpire!;
    return RtcTokenBuilder.buildTokenWithRtm(
        opts.appId,
        opts.appCertificate,
        opts.channelName,
        opts.account,
        RtcRole.PUBLISHER,
        tokenExpire,
        privilegeExpire,
    );
}
