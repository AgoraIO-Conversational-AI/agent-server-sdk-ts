/**
 * Type-safe Avatar vendor classes.
 *
 * Avatar vendors provide visual representation for voice agents.
 * Different vendors have specific audio sample rate requirements.
 */

import { BaseAvatar } from "./base.js";
import type { HeyGenSampleRate, AkoolSampleRate } from "./base.js";
import type { AvatarConfig } from "../types.js";

/**
 * Constructor options for HeyGen Avatar.
 */
export interface HeyGenAvatarOptions {
    /** HeyGen API key */
    apiKey: string;
    /** Video quality: "low" (360p), "medium" (480p), or "high" (720p) */
    quality: "low" | "medium" | "high";
    /** RTC UID for the avatar (must be unique in the channel) */
    agoraUid: string;
    /** RTC token for avatar authentication */
    agoraToken?: string;
    /** HeyGen avatar ID */
    avatarId?: string;
    /** Whether to disable idle timeout (default: false) */
    disableIdleTimeout?: boolean;
    /** Idle timeout in seconds (default: 120, only applies if disableIdleTimeout is false) */
    activityIdleTimeout?: number;
    /** Enable avatar (default: true) */
    enable?: boolean;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * HeyGen Avatar vendor.
 *
 * ⚠️ IMPORTANT: HeyGen avatars ONLY support audio with a sample rate of 24,000 Hz.
 * You must configure your TTS with a 24kHz sample rate or the request will fail.
 *
 * @example
 * ```typescript
 * import { Agent, HeyGenAvatar, ElevenLabsTTS } from 'agora-agent-sdk';
 *
 * const avatar = new HeyGenAvatar({
 *   apiKey: process.env.HEYGEN_API_KEY,
 *   quality: 'high',
 *   agoraUid: '12345',
 *   avatarId: 'avatar-id',
 * });
 *
 * // Make sure TTS uses 24kHz sample rate for HeyGen
 * const tts = new ElevenLabsTTS({
 *   key: process.env.ELEVENLABS_API_KEY,
 *   modelId: 'eleven_flash_v2_5',
 *   voiceId: 'voice-id',
 *   sampleRate: 24000, // Required for HeyGen
 * });
 *
 * const agent = new Agent({ name: 'avatar-assistant' })
 *   .withTts(tts)
 *   .withAvatar(avatar);
 * ```
 *
 * @see https://docs.agora.io/en/conversational-ai/models/avatar/heygen
 */
export class HeyGenAvatar extends BaseAvatar<HeyGenSampleRate> {
    private options: HeyGenAvatarOptions;

    /**
     * HeyGen avatars require TTS sample rate of 24,000 Hz.
     */
    readonly requiredSampleRate = 24000 as const;

    constructor(options: HeyGenAvatarOptions) {
        super();
        this.options = options;

        // Validate required fields
        if (!options.apiKey) {
            throw new Error("HeyGen avatar requires apiKey");
        }
        if (!options.quality) {
            throw new Error("HeyGen avatar requires quality (low, medium, or high)");
        }
        if (!options.agoraUid) {
            throw new Error("HeyGen avatar requires agoraUid");
        }

        // Validate quality values
        const validQualities = ["low", "medium", "high"];
        if (!validQualities.includes(options.quality)) {
            throw new Error(
                `Invalid quality for HeyGen: ${options.quality}. ` +
                `Must be one of: ${validQualities.join(", ")}`
            );
        }
    }

    toConfig(): AvatarConfig {
        const {
            apiKey,
            quality,
            agoraUid,
            agoraToken,
            avatarId,
            disableIdleTimeout,
            activityIdleTimeout,
            enable = true,
            additionalParams,
        } = this.options;

        return {
            enable,
            vendor: "heygen",
            params: {
                api_key: apiKey,
                quality,
                agora_uid: agoraUid,
                ...(agoraToken && { agora_token: agoraToken }),
                ...(avatarId && { avatar_id: avatarId }),
                ...(disableIdleTimeout !== undefined && { disable_idle_timeout: disableIdleTimeout }),
                ...(activityIdleTimeout !== undefined && { activity_idle_timeout: activityIdleTimeout }),
                ...additionalParams,
            },
        };
    }
}

/**
 * Constructor options for Akool Avatar.
 */
export interface AkoolAvatarOptions {
    /** Akool API key */
    apiKey: string;
    /** Akool avatar ID */
    avatarId?: string;
    /** Enable avatar (default: true) */
    enable?: boolean;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * Akool Avatar vendor.
 *
 * ⚠️ IMPORTANT: Akool avatars ONLY support audio with a sample rate of 16,000 Hz.
 * You must configure your TTS with a 16kHz sample rate or the request will fail.
 *
 * @example
 * ```typescript
 * import { Agent, AkoolAvatar, MicrosoftTTS } from 'agora-agent-sdk';
 *
 * const avatar = new AkoolAvatar({
 *   apiKey: process.env.AKOOL_API_KEY,
 *   avatarId: 'avatar-id',
 * });
 *
 * // Make sure TTS uses 16kHz sample rate for Akool
 * const tts = new MicrosoftTTS({
 *   key: process.env.AZURE_SPEECH_KEY,
 *   region: 'eastus',
 *   voiceName: 'en-US-JennyNeural',
 *   // Note: Microsoft TTS doesn't have a sample_rate param in the API,
 *   // but ensure your audio pipeline is configured for 16kHz
 * });
 *
 * const agent = new Agent({ name: 'avatar-assistant' })
 *   .withTts(tts)
 *   .withAvatar(avatar);
 * ```
 *
 * @see https://docs.agora.io/en/conversational-ai/models/avatar/akool
 */
export class AkoolAvatar extends BaseAvatar<AkoolSampleRate> {
    private options: AkoolAvatarOptions;

    /**
     * Akool avatars require TTS sample rate of 16,000 Hz.
     */
    readonly requiredSampleRate = 16000 as const;

    constructor(options: AkoolAvatarOptions) {
        super();
        this.options = options;

        // Validate required fields
        if (!options.apiKey) {
            throw new Error("Akool avatar requires apiKey");
        }
    }

    toConfig(): AvatarConfig {
        const { apiKey, avatarId, enable = true, additionalParams } = this.options;

        return {
            enable,
            vendor: "akool",
            params: {
                api_key: apiKey,
                ...(avatarId && { avatar_id: avatarId }),
                ...additionalParams,
            },
        };
    }
}
