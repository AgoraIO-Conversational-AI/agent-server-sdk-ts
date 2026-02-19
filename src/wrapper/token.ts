/**
 * RTC token generation for internal use by the wrapper layer.
 *
 * Tokens authenticate a specific (appId, channel, uid) combination with the
 * Agora RTC network.  The `agora-token` library handles the JWT signing.
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
