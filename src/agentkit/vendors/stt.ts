/**
 * Type-safe STT (Speech-to-Text) vendor classes.
 */

import { BaseSTT } from "./base.js";
import type { SttConfig } from "../types.js";

/**
 * Constructor options for Speechmatics STT.
 */
export interface SpeechmaticsSTTOptions {
    /** Speechmatics API key */
    apiKey: string;
    /** Language code (e.g., 'en', 'es', 'fr') */
    language: string;
    /** Model name */
    model?: string;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * Speechmatics STT vendor.
 *
 * @example
 * ```typescript
 * const stt = new SpeechmaticsSTT({
 *   apiKey: process.env.SPEECHMATICS_API_KEY,
 *   language: 'en',
 * });
 * ```
 */
export class SpeechmaticsSTT extends BaseSTT {
    private readonly options: SpeechmaticsSTTOptions;

    constructor(options: SpeechmaticsSTTOptions) {
        super();
        this.options = options;
    }

    toConfig(): SttConfig {
        const { apiKey, language, model, additionalParams } = this.options;

        return {
            vendor: "speechmatics",
            // Top-level language is used by the Agora platform for routing/filtering.
            // language inside params is forwarded directly to the Speechmatics API.
            // Both are intentionally set to the same value.
            language,
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                api_key: apiKey,
                language,
                ...(model !== undefined && { model }),
            },
        };
    }
}

/**
 * Constructor options for Deepgram STT.
 */
export interface DeepgramSTTOptions {
    /** Deepgram API key */
    apiKey?: string;
    /** Model to use (e.g., 'nova-2', 'enhanced', 'base') */
    model?: string;
    /** Language code (e.g., 'en-US', 'es', 'fr') */
    language?: string;
    /** Enable smart formatting */
    smartFormat?: boolean;
    /** Enable punctuation */
    punctuation?: boolean;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * Deepgram STT vendor.
 *
 * @example
 * ```typescript
 * const stt = new DeepgramSTT({
 *   apiKey: process.env.DEEPGRAM_API_KEY,
 *   model: 'nova-2',
 *   smartFormat: true,
 * });
 * ```
 */
export class DeepgramSTT extends BaseSTT {
    private readonly options: DeepgramSTTOptions;

    constructor(options: DeepgramSTTOptions = {}) {
        super();
        this.options = options;
    }

    toConfig(): SttConfig {
        const { apiKey, model, language, smartFormat, punctuation, additionalParams } = this.options;

        return {
            vendor: "deepgram",
            language,
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                ...(apiKey && { api_key: apiKey }),
                ...(model && { model }),
                ...(language && { language }),
                ...(smartFormat !== undefined && { smart_format: smartFormat }),
                ...(punctuation !== undefined && { punctuation }),
            },
        };
    }
}

/**
 * Constructor options for Microsoft Azure Speech STT.
 */
export interface MicrosoftSTTOptions {
    /** Microsoft Azure subscription key */
    key: string;
    /** Azure region (e.g., 'eastus', 'westus') */
    region: string;
    /** Language code (e.g., 'en-US', 'es-ES') */
    language?: string;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * Microsoft Azure Speech STT vendor.
 *
 * @example
 * ```typescript
 * const stt = new MicrosoftSTT({
 *   key: process.env.AZURE_SPEECH_KEY,
 *   region: 'eastus',
 *   language: 'en-US',
 * });
 * ```
 */
export class MicrosoftSTT extends BaseSTT {
    private readonly options: MicrosoftSTTOptions;

    constructor(options: MicrosoftSTTOptions) {
        super();
        this.options = options;
    }

    toConfig(): SttConfig {
        const { key, region, language, additionalParams } = this.options;

        return {
            vendor: "microsoft",
            language,
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                key,
                region,
                ...(language && { language }),
            },
        };
    }
}

/**
 * Constructor options for OpenAI Whisper STT.
 */
export interface OpenAISTTOptions {
    /** OpenAI API key */
    apiKey: string;
    /** Model to use (default: 'whisper-1') */
    model?: string;
    /** Language code */
    language?: string;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * OpenAI Whisper STT vendor.
 *
 * @example
 * ```typescript
 * const stt = new OpenAISTT({
 *   apiKey: process.env.OPENAI_API_KEY,
 * });
 * ```
 */
export class OpenAISTT extends BaseSTT {
    private readonly options: OpenAISTTOptions;

    constructor(options: OpenAISTTOptions) {
        super();
        this.options = options;
    }

    toConfig(): SttConfig {
        const { apiKey, model, language, additionalParams } = this.options;

        return {
            vendor: "openai",
            language,
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                api_key: apiKey,
                ...(model && { model }),
            },
        };
    }
}

/**
 * Constructor options for Google Cloud Speech-to-Text STT.
 */
export interface GoogleSTTOptions {
    /** Google Cloud API key */
    apiKey: string;
    /** Language code (e.g., 'en-US', 'es-ES') */
    language?: string;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * Google Cloud Speech-to-Text STT vendor.
 *
 * @example
 * ```typescript
 * const stt = new GoogleSTT({
 *   apiKey: process.env.GOOGLE_API_KEY,
 *   language: 'en-US',
 * });
 * ```
 */
export class GoogleSTT extends BaseSTT {
    private readonly options: GoogleSTTOptions;

    constructor(options: GoogleSTTOptions) {
        super();
        this.options = options;
    }

    toConfig(): SttConfig {
        const { apiKey, language, additionalParams } = this.options;

        return {
            vendor: "google",
            language,
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                api_key: apiKey,
                ...(language && { language }),
            },
        };
    }
}

/**
 * Constructor options for Amazon Transcribe STT.
 */
export interface AmazonSTTOptions {
    /** AWS Access Key ID */
    accessKey: string;
    /** AWS Secret Access Key */
    secretKey: string;
    /** AWS region (e.g., 'us-east-1') */
    region: string;
    /** Language code */
    language?: string;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * Amazon Transcribe STT vendor.
 *
 * @example
 * ```typescript
 * const stt = new AmazonSTT({
 *   accessKey: process.env.AWS_ACCESS_KEY_ID,
 *   secretKey: process.env.AWS_SECRET_ACCESS_KEY,
 *   region: 'us-east-1',
 * });
 * ```
 */
export class AmazonSTT extends BaseSTT {
    private readonly options: AmazonSTTOptions;

    constructor(options: AmazonSTTOptions) {
        super();
        this.options = options;
    }

    toConfig(): SttConfig {
        const { accessKey, secretKey, region, language, additionalParams } = this.options;

        return {
            vendor: "amazon",
            language,
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                access_key: accessKey,
                secret_key: secretKey,
                region,
                ...(language && { language }),
            },
        };
    }
}

/**
 * Constructor options for AssemblyAI STT.
 */
export interface AssemblyAISTTOptions {
    /** AssemblyAI API key */
    apiKey: string;
    /** Language code */
    language?: string;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * AssemblyAI STT vendor.
 *
 * @example
 * ```typescript
 * const stt = new AssemblyAISTT({
 *   apiKey: process.env.ASSEMBLYAI_API_KEY,
 * });
 * ```
 */
export class AssemblyAISTT extends BaseSTT {
    private readonly options: AssemblyAISTTOptions;

    constructor(options: AssemblyAISTTOptions) {
        super();
        this.options = options;
    }

    toConfig(): SttConfig {
        const { apiKey, language, additionalParams } = this.options;

        return {
            vendor: "assemblyai",
            language,
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                api_key: apiKey,
            },
        };
    }
}

/**
 * Constructor options for Agora ARES STT.
 */
export interface AresSTTOptions {
    /** Language code for ARES ASR */
    language?: string;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * Agora ARES (Adaptive Recognition Engine for Speech) STT vendor.
 *
 * @example
 * ```typescript
 * const stt = new AresSTT({
 *   language: 'en',
 * });
 * ```
 */
export class AresSTT extends BaseSTT {
    private readonly options: AresSTTOptions;

    constructor(options: AresSTTOptions = {}) {
        super();
        this.options = options;
    }

    toConfig(): SttConfig {
        const { language, additionalParams } = this.options;

        // Only include params when there is content to send; avoids emitting
        // params: {} when neither language nor additionalParams are provided.
        const paramsEntries = {
            ...(language && { language }),
            ...additionalParams,
        };

        return {
            vendor: "ares",
            language,
            ...(Object.keys(paramsEntries).length > 0 && { params: paramsEntries }),
        };
    }
}

/**
 * Constructor options for Sarvam STT.
 */
export interface SarvamSTTOptions {
    /** Sarvam API key */
    apiKey: string;
    /** Language code (e.g., 'en', 'hi', 'ta') */
    language: string;
    /** Model name */
    model?: string;
    /** Additional vendor-specific parameters */
    additionalParams?: Record<string, unknown>;
}

/**
 * Sarvam STT vendor (Beta).
 *
 * @example
 * ```typescript
 * const stt = new SarvamSTT({
 *   apiKey: process.env.SARVAM_API_KEY,
 *   language: 'en',
 * });
 * ```
 */
export class SarvamSTT extends BaseSTT {
    private readonly options: SarvamSTTOptions;

    constructor(options: SarvamSTTOptions) {
        super();
        this.options = options;
    }

    toConfig(): SttConfig {
        const { apiKey, language, model, additionalParams } = this.options;

        return {
            vendor: "sarvam",
            // Top-level language is used by the Agora platform for routing/filtering.
            // language inside params is forwarded directly to the Sarvam API.
            // Both are intentionally set to the same value.
            language,
            params: {
                // additionalParams spread first so that explicit fields always win.
                ...additionalParams,
                api_key: apiKey,
                language,
                ...(model !== undefined && { model }),
            },
        };
    }
}
