/**
 * Token generation for internal use by the wrapper layer.
 *
 * - RTC tokens authenticate a specific (appId, channel, uid) combination with
 *   the Agora RTC network.
 * - ConvoAI tokens are combined RTC + RTM tokens used to authenticate ConvoAI
 *   REST API calls via `Authorization: agora token=<token>`.
 *
 * The `agora-token` library handles the JWT signing.
 */

import { RtcTokenBuilder, RtcRole } from "agora-token";

const DEFAULT_EXPIRY_SECONDS = 3600;

export interface GenerateTokenOptions {
    appId: string;
    appCertificate: string;
    channel: string;
    uid: number;
    role?: typeof RtcRole.PUBLISHER | typeof RtcRole.SUBSCRIBER;
    expirySeconds?: number;
}

/**
 * Builds a short-lived RTC token.
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
    /** Seconds until the token expires (default: 3600) */
    tokenExpire?: number;
    /** Seconds until privileges expire — 0 means same as tokenExpire (default: 0) */
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
    const privilegeExpire = opts.privilegeExpire ?? 0;
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
