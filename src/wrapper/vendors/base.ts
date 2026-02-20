/**
 * Base classes for type-safe vendor configurations.
 *
 * Each vendor class extends a base class and implements a `toConfig()` method
 * that converts TypeScript-friendly constructor params (camelCase) into the
 * Agora API format (snake_case).
 */

import type { LlmConfig, TtsConfig, SttConfig, MllmConfig, AvatarConfig } from "../types.js";

/**
 * Standard audio sample rates supported by Agora platform.
 * Different vendors support different subsets of these rates.
 */
export type SampleRate = 8000 | 16000 | 22050 | 24000 | 44100 | 48000;

/**
 * Sample rates supported by ElevenLabs TTS.
 * - 16000 Hz: Required for Akool avatars
 * - 24000 Hz: Required for HeyGen avatars
 * - 22050, 44100 Hz: High quality, no avatar support
 */
export type ElevenLabsSampleRate = 16000 | 22050 | 24000 | 44100;

/**
 * Sample rates supported by Microsoft Azure TTS.
 */
export type MicrosoftSampleRate = 16000 | 24000 | 48000;

/**
 * Sample rates supported by Cartesia TTS.
 */
export type CartesiaSampleRate = 8000 | 16000 | 22050 | 24000 | 44100 | 48000;

/**
 * Sample rate required by HeyGen avatars (24kHz only).
 */
export type HeyGenSampleRate = 24000;

/**
 * Sample rate required by Akool avatars (16kHz only).
 */
export type AkoolSampleRate = 16000;

/**
 * Base class for LLM (Large Language Model) vendors.
 */
export abstract class BaseLLM {
    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): LlmConfig;
}

/**
 * Base class for TTS (Text-to-Speech) vendors with sample rate tracking.
 * @template SR - Sample rate literal type (e.g., 24000, 16000)
 */
export abstract class BaseTTS<SR extends number = number> {
    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): TtsConfig;
}

/**
 * Base class for STT (Speech-to-Text) vendors.
 */
export abstract class BaseSTT {
    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): SttConfig;
}

/**
 * Base class for MLLM (Multimodal Large Language Model) vendors.
 */
export abstract class BaseMLLM {
    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): MllmConfig;
}

/**
 * Base class for Avatar vendors with required sample rate.
 * @template RequiredSR - Required sample rate literal type
 */
export abstract class BaseAvatar<RequiredSR extends number = number> {
    /**
     * Converts the vendor configuration to the Agora API format.
     */
    abstract toConfig(): AvatarConfig;
    
    /**
     * The TTS sample rate required by this avatar vendor.
     */
    abstract readonly requiredSampleRate: RequiredSR;
}
