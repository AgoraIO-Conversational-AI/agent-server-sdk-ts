/**
 * Vendor-specific Avatar configuration types with strict type constraints.
 * 
 * This provides type safety for vendor-specific parameters like sample rates,
 * ensuring that invalid combinations are caught at compile time.
 */

import type { AvatarConfig as BaseAvatarConfig } from './types.js';

/**
 * HeyGen-specific avatar configuration.
 * 
 * ⚠️ IMPORTANT: HeyGen avatars ONLY support audio with a sample rate of 24,000 Hz.
 * You must configure your TTS with a 24kHz sample rate or the request will fail.
 * 
 * @see https://docs.agora.io/en/conversational-ai/models/avatar/heygen
 */
export interface HeyGenAvatarConfig {
  enable?: boolean;
  vendor: 'heygen';
  params: {
    /** API key for HeyGen authentication (required) */
    api_key: string;
    /** Video quality: "high" (720p), "medium" (480p), or "low" (360p) (required) */
    quality: 'low' | 'medium' | 'high';
    /** RTC UID for the avatar (must be unique in the channel) (required) */
    agora_uid: string;
    /** RTC token for avatar authentication (optional) */
    agora_token?: string;
    /** HeyGen avatar ID (optional) */
    avatar_id?: string;
    /** Whether to disable idle timeout (default: false) */
    disable_idle_timeout?: boolean;
    /** Idle timeout in seconds (default: 120, only applies if disable_idle_timeout is false) */
    activity_idle_timeout?: number;
    [key: string]: unknown;
  };
}

/**
 * Akool-specific avatar configuration.
 * 
 * ⚠️ IMPORTANT: Akool avatars ONLY support audio with a sample rate of 16,000 Hz.
 * You must configure your TTS with a 16kHz sample rate or the request will fail.
 * 
 * @see https://docs.agora.io/en/conversational-ai/models/avatar/akool
 */
export interface AkoolAvatarConfig {
  enable?: boolean;
  vendor: 'akool';
  params: {
    /** API key for Akool authentication (required) */
    api_key: string;
    /** Akool avatar ID (optional) */
    avatar_id?: string;
    /** Additional vendor-specific parameters */
    [key: string]: unknown;
  };
}

/**
 * Generic avatar configuration (fallback for unknown vendors).
 * Use this when you need flexibility or for custom avatar providers.
 */
export interface GenericAvatarConfig {
  enable?: boolean;
  vendor?: string;
  params?: {
    [key: string]: unknown;
  };
}

/**
 * Discriminated union of all avatar configurations.
 * TypeScript will enforce vendor-specific constraints based on the vendor field.
 */
export type StrictAvatarConfig = 
  | HeyGenAvatarConfig 
  | AkoolAvatarConfig 
  | GenericAvatarConfig;

/**
 * Helper type guard to check if an avatar config is for HeyGen
 */
export function isHeyGenAvatar(config: StrictAvatarConfig): config is HeyGenAvatarConfig {
  return config.vendor === 'heygen';
}

/**
 * Helper type guard to check if an avatar config is for Akool
 */
export function isAkoolAvatar(config: StrictAvatarConfig): config is AkoolAvatarConfig {
  return config.vendor === 'akool';
}

/**
 * Validates avatar configuration at runtime.
 * TypeScript catches most issues, but this provides runtime validation
 * for cases where types are bypassed or data comes from external sources.
 * 
 * @throws {Error} If the configuration is invalid
 */
export function validateAvatarConfig(config: StrictAvatarConfig): void {
  if (isHeyGenAvatar(config)) {
    // Validate required fields
    if (!config.params.api_key) {
      throw new Error('HeyGen avatar requires api_key');
    }
    if (!config.params.quality) {
      throw new Error('HeyGen avatar requires quality (low, medium, or high)');
    }
    if (!config.params.agora_uid) {
      throw new Error('HeyGen avatar requires agora_uid');
    }
    
    // Validate quality values
    const validQualities = ['low', 'medium', 'high'];
    if (!validQualities.includes(config.params.quality)) {
      throw new Error(
        `Invalid quality for HeyGen: ${config.params.quality}. ` +
        `Must be one of: ${validQualities.join(', ')}`
      );
    }
  } else if (isAkoolAvatar(config)) {
    if (!config.params.api_key) {
      throw new Error('Akool avatar requires api_key');
    }
  }
}

/**
 * Validates that TTS sample rate is compatible with the avatar vendor.
 * 
 * Different avatar vendors have specific sample rate requirements:
 * - ⚠️ HeyGen: ONLY supports 24,000 Hz
 * - ⚠️ Akool: ONLY supports 16,000 Hz
 * 
 * This function helps catch TTS/Avatar misconfigurations at runtime.
 * 
 * @param avatarConfig - The avatar configuration
 * @param ttsSampleRate - The sample rate from your TTS configuration (in Hz)
 * @throws {Error} If TTS sample rate is incompatible with the avatar vendor
 * 
 * @example
 * ```typescript
 * // HeyGen example
 * const heygenAvatar: HeyGenAvatarConfig = { vendor: 'heygen', ... };
 * validateTtsSampleRate(heygenAvatar, 24000); // ✅ Passes
 * validateTtsSampleRate(heygenAvatar, 16000); // ❌ Throws error
 * 
 * // Akool example
 * const akoolAvatar: AkoolAvatarConfig = { vendor: 'akool', ... };
 * validateTtsSampleRate(akoolAvatar, 16000); // ✅ Passes
 * validateTtsSampleRate(akoolAvatar, 24000); // ❌ Throws error
 * ```
 */
export function validateTtsSampleRate(
  avatarConfig: StrictAvatarConfig,
  ttsSampleRate: number
): void {
  if (isHeyGenAvatar(avatarConfig)) {
    if (ttsSampleRate !== 24000) {
      throw new Error(
        `HeyGen avatars ONLY support 24,000 Hz sample rate. ` +
        `Your TTS is configured with ${ttsSampleRate} Hz. ` +
        `Please update your TTS configuration to use 24kHz sample rate. ` +
        `See: https://docs.agora.io/en/conversational-ai/models/avatar/heygen`
      );
    }
  } else if (isAkoolAvatar(avatarConfig)) {
    if (ttsSampleRate !== 16000) {
      throw new Error(
        `Akool avatars ONLY support 16,000 Hz sample rate. ` +
        `Your TTS is configured with ${ttsSampleRate} Hz. ` +
        `Please update your TTS configuration to use 16kHz sample rate. ` +
        `See: https://docs.agora.io/en/conversational-ai/models/avatar/akool`
      );
    }
  }
}

/**
 * Converts strict avatar config to base avatar config for API calls.
 * This bridges the gap between our type-safe wrapper and Fern's generated types.
 */
export function toBaseAvatarConfig(config: StrictAvatarConfig): BaseAvatarConfig {
  return config as unknown as BaseAvatarConfig;
}
