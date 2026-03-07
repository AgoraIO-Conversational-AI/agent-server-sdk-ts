/**
 * Type-safe TTS (Text-to-Speech) vendor classes.
 */

import { BaseTTS } from "./base.js";
import type { ElevenLabsSampleRate, MicrosoftSampleRate, CartesiaSampleRate } from "./base.js";
import type { TtsConfig } from "../types.js";

/**
 * Constructor options for ElevenLabs TTS.
 */
export interface ElevenLabsTTSOptions<SR extends ElevenLabsSampleRate = ElevenLabsSampleRate> {
    /** ElevenLabs API key */
    key: string;
    /** Model ID (e.g., 'eleven_flash_v2_5', 'eleven_monolingual_v1') */
    modelId: string;
    /** Voice ID */
    voiceId: string;
    /** WebSocket base URL (defaults to ElevenLabs endpoint) */
    baseUrl?: string;
    /**
     * Audio sample rate in Hz.
     * - 16000 Hz: Required for Akool avatars
     * - 24000 Hz: Required for HeyGen avatars
     * - 22050, 44100 Hz: High quality, no avatar support
     */
    sampleRate?: SR;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * ElevenLabs TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new ElevenLabsTTS({
 *   key: process.env.ELEVENLABS_API_KEY,
 *   modelId: 'eleven_flash_v2_5',
 *   voiceId: 'pNInz6obpgDQGcFmaJgB',
 *   sampleRate: 24000, // For HeyGen avatar
 * });
 * ```
 */
export class ElevenLabsTTS<SR extends ElevenLabsSampleRate = ElevenLabsSampleRate> extends BaseTTS<SR> {
    private options: ElevenLabsTTSOptions<SR>;

    constructor(options: ElevenLabsTTSOptions<SR>) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, modelId, voiceId, baseUrl, sampleRate, skipPatterns } = this.options;

        return {
            vendor: "elevenlabs",
            params: {
                key,
                model_id: modelId,
                voice_id: voiceId,
                ...(baseUrl && { base_url: baseUrl }),
                ...(sampleRate && { sample_rate: sampleRate }),
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for Microsoft Azure TTS.
 */
export interface MicrosoftTTSOptions<SR extends MicrosoftSampleRate = MicrosoftSampleRate> {
    /** Microsoft Azure API key */
    key: string;
    /** Azure region (e.g., 'eastus', 'westus') */
    region: string;
    /** Voice name (e.g., 'en-US-AndrewMultilingualNeural') */
    voiceName: string;
    /**
     * Audio sample rate in Hz.
     * Supported values: 16000, 24000, 48000
     */
    sampleRate?: SR;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * Microsoft Azure TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new MicrosoftTTS({
 *   key: process.env.AZURE_SPEECH_KEY,
 *   region: 'eastus',
 *   voiceName: 'en-US-JennyNeural',
 *   sampleRate: 24000,
 * });
 * ```
 */
export class MicrosoftTTS<SR extends MicrosoftSampleRate = MicrosoftSampleRate> extends BaseTTS<SR> {
    private options: MicrosoftTTSOptions<SR>;

    constructor(options: MicrosoftTTSOptions<SR>) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, region, voiceName, sampleRate, skipPatterns } = this.options;

        return {
            vendor: "microsoft",
            params: {
                key,
                region,
                voice_name: voiceName,
                ...(sampleRate && { sample_rate: sampleRate }),
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for OpenAI TTS.
 */
export interface OpenAITTSOptions {
    /** OpenAI API key */
    key: string;
    /** Voice name (e.g., 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer') */
    voice: string;
    /** Model name (e.g., 'tts-1', 'tts-1-hd') */
    model?: string;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * OpenAI TTS vendor.
 * 
 * Note: OpenAI TTS is fixed at 24kHz and does not support changing the sample rate.
 *
 * @example
 * ```typescript
 * const tts = new OpenAITTS({
 *   key: process.env.OPENAI_API_KEY,
 *   voice: 'alloy',
 * });
 * ```
 */
export class OpenAITTS extends BaseTTS<24000> {
    private options: OpenAITTSOptions;

    constructor(options: OpenAITTSOptions) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, voice, model, skipPatterns } = this.options;

        return {
            vendor: "openai",
            params: {
                key,
                voice,
                ...(model && { model }),
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for Cartesia TTS.
 */
export interface CartesiaTTSOptions<SR extends CartesiaSampleRate = CartesiaSampleRate> {
    /** Cartesia API key */
    key: string;
    /** Voice ID */
    voiceId: string;
    /** Model ID */
    modelId?: string;
    /**
     * Audio sample rate in Hz.
     * Supported values: 8000, 16000, 22050, 24000, 44100, 48000
     */
    sampleRate?: SR;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * Cartesia TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new CartesiaTTS({
 *   key: process.env.CARTESIA_API_KEY,
 *   voiceId: 'voice-id-here',
 *   sampleRate: 24000,
 * });
 * ```
 */
export class CartesiaTTS<SR extends CartesiaSampleRate = CartesiaSampleRate> extends BaseTTS<SR> {
    private options: CartesiaTTSOptions<SR>;

    constructor(options: CartesiaTTSOptions<SR>) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, voiceId, modelId, sampleRate, skipPatterns } = this.options;

        return {
            vendor: "cartesia",
            params: {
                key,
                voice_id: voiceId,
                ...(modelId && { model_id: modelId }),
                ...(sampleRate && { sample_rate: sampleRate }),
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for Google TTS.
 */
export interface GoogleTTSOptions {
    /** Google Cloud API key */
    key: string;
    /** Voice name */
    voiceName: string;
    /** Language code (e.g., 'en-US') */
    languageCode?: string;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * Google TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new GoogleTTS({
 *   key: process.env.GOOGLE_API_KEY,
 *   voiceName: 'en-US-Wavenet-D',
 * });
 * ```
 */
export class GoogleTTS extends BaseTTS {
    private options: GoogleTTSOptions;

    constructor(options: GoogleTTSOptions) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, voiceName, languageCode, skipPatterns } = this.options;

        return {
            vendor: "google",
            params: {
                key,
                voice_name: voiceName,
                ...(languageCode && { language_code: languageCode }),
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for Amazon Polly TTS.
 */
export interface AmazonTTSOptions {
    /** AWS access key */
    accessKey: string;
    /** AWS secret key */
    secretKey: string;
    /** AWS region (e.g., 'us-east-1') */
    region: string;
    /** Amazon Polly voice ID */
    voiceId: string;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * Amazon Polly TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new AmazonTTS({
 *   accessKey: process.env.AWS_ACCESS_KEY_ID,
 *   secretKey: process.env.AWS_SECRET_ACCESS_KEY,
 *   region: 'us-east-1',
 *   voiceId: 'Joanna',
 * });
 * ```
 */
export class AmazonTTS extends BaseTTS {
    private options: AmazonTTSOptions;

    constructor(options: AmazonTTSOptions) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { accessKey, secretKey, region, voiceId, skipPatterns } = this.options;

        return {
            vendor: "amazon",
            params: {
                access_key: accessKey,
                secret_key: secretKey,
                region,
                voice_id: voiceId,
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for Hume AI TTS.
 */
export interface HumeAITTSOptions {
    /** Hume AI API key */
    key: string;
    /** Configuration ID */
    configId?: string;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * Hume AI TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new HumeAITTS({
 *   key: process.env.HUME_API_KEY,
 * });
 * ```
 */
export class HumeAITTS extends BaseTTS {
    private options: HumeAITTSOptions;

    constructor(options: HumeAITTSOptions) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, configId, skipPatterns } = this.options;

        return {
            vendor: "humeai",
            params: {
                key,
                ...(configId && { config_id: configId }),
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for Rime TTS.
 */
export interface RimeTTSOptions {
    /** Rime API key */
    key: string;
    /** Speaker ID */
    speaker: string;
    /** Model ID */
    modelId?: string;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * Rime TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new RimeTTS({
 *   key: process.env.RIME_API_KEY,
 *   speaker: 'speaker-id',
 * });
 * ```
 */
export class RimeTTS extends BaseTTS {
    private options: RimeTTSOptions;

    constructor(options: RimeTTSOptions) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, speaker, modelId, skipPatterns } = this.options;

        return {
            vendor: "rime",
            params: {
                key,
                speaker,
                ...(modelId && { model_id: modelId }),
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for Fish Audio TTS.
 */
export interface FishAudioTTSOptions {
    /** Fish Audio API key */
    key: string;
    /** Reference ID */
    referenceId: string;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * Fish Audio TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new FishAudioTTS({
 *   key: process.env.FISH_AUDIO_API_KEY,
 *   referenceId: 'reference-id',
 * });
 * ```
 */
export class FishAudioTTS extends BaseTTS {
    private options: FishAudioTTSOptions;

    constructor(options: FishAudioTTSOptions) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, referenceId, skipPatterns } = this.options;

        return {
            vendor: "fishaudio",
            params: {
                key,
                reference_id: referenceId,
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for MiniMax TTS.
 */
export interface MiniMaxTTSOptions {
    /** MiniMax API key */
    key: string;
    /** MiniMax group identifier */
    groupId: string;
    /** TTS model (e.g., 'speech-02-turbo') */
    model: string;
    /** Voice style identifier (e.g., 'English_captivating_female1') */
    voiceId: string;
    /** WebSocket endpoint (e.g., 'wss://api-uw.minimax.io/ws/v1/t2a_v2') */
    url: string;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * MiniMax TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new MiniMaxTTS({
 *   key: process.env.MINIMAX_API_KEY,
 *   groupId: 'your-group-id',
 *   model: 'speech-02-turbo',
 *   voiceId: 'English_captivating_female1',
 *   url: 'wss://api-uw.minimax.io/ws/v1/t2a_v2',
 * });
 * ```
 */
export class MiniMaxTTS extends BaseTTS {
    private options: MiniMaxTTSOptions;

    constructor(options: MiniMaxTTSOptions) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, groupId, model, voiceId, url, skipPatterns } = this.options;

        return {
            vendor: "minimax",
            params: {
                key,
                group_id: groupId,
                model,
                voice_setting: { voice_id: voiceId },
                url,
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for Sarvam TTS (Beta).
 */
export interface SarvamTTSOptions {
    /** Sarvam API subscription key */
    key: string;
    /** Speaker/voice ID (e.g., 'anushka', 'abhilash', 'karun', 'hitesh', 'manisha', 'vidya', 'arya') */
    speaker: string;
    /** Target language code (e.g., 'en-IN', 'hi-IN', 'ta-IN') */
    targetLanguageCode: string;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * Sarvam TTS vendor (Beta).
 *
 * @example
 * ```typescript
 * const tts = new SarvamTTS({
 *   key: process.env.SARVAM_API_KEY,
 *   speaker: 'anushka',
 *   targetLanguageCode: 'en-IN',
 * });
 * ```
 */
export class SarvamTTS extends BaseTTS {
    private options: SarvamTTSOptions;

    constructor(options: SarvamTTSOptions) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, speaker, targetLanguageCode, skipPatterns } = this.options;

        return {
            vendor: "sarvam",
            params: {
                key,
                speaker,
                target_language_code: targetLanguageCode,
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}

/**
 * Constructor options for Murf TTS.
 */
export interface MurfTTSOptions {
    /** Murf API key */
    key: string;
    /** Voice ID (e.g., 'Ariana', 'Natalie', 'Ken') */
    voiceId: string;
    /** Voice style (e.g., 'Angry', 'Sad', 'Conversational', 'Newscast') */
    style?: string;
    /** Skip patterns for bracketed content */
    skipPatterns?: number[];
}

/**
 * Murf TTS vendor.
 *
 * @example
 * ```typescript
 * const tts = new MurfTTS({
 *   key: process.env.MURF_API_KEY,
 *   voiceId: 'Ariana',
 *   style: 'Conversational',
 * });
 * ```
 */
export class MurfTTS extends BaseTTS {
    private options: MurfTTSOptions;

    constructor(options: MurfTTSOptions) {
        super();
        this.options = options;
    }

    toConfig(): TtsConfig {
        const { key, voiceId, style, skipPatterns } = this.options;

        return {
            vendor: "murf",
            params: {
                key,
                voice_id: voiceId,
                ...(style && { style }),
            },
            ...(skipPatterns && { skip_patterns: skipPatterns }),
        };
    }
}
