/**
 * Type-safe LLM (Large Language Model) vendor classes.
 */

import { BaseLLM } from "./base.js";
import type { LlmConfig } from "../types.js";

/**
 * Constructor options for OpenAI LLM.
 */
export interface OpenAIOptions {
    /** OpenAI API key */
    apiKey: string;
    /** Model name (e.g., 'gpt-4o-mini', 'gpt-4', 'gpt-3.5-turbo') */
    model: string;
    /** API endpoint URL (defaults to OpenAI's standard endpoint) */
    url?: string;
    /** Maximum number of conversation history messages to cache */
    maxHistory?: number;
    /** System messages for the LLM */
    systemMessages?: Record<string, unknown>[];
    /** Greeting message for the agent */
    greetingMessage?: string;
    /** Failure message when LLM call fails */
    failureMessage?: string;
    /** Additional LLM parameters */
    params?: Record<string, unknown>;
}

/**
 * OpenAI LLM vendor (and OpenAI-compatible APIs).
 *
 * @example
 * ```typescript
 * const llm = new OpenAI({
 *   apiKey: process.env.OPENAI_API_KEY,
 *   model: 'gpt-4o-mini',
 * });
 * ```
 */
export class OpenAI extends BaseLLM {
    private options: OpenAIOptions;

    constructor(options: OpenAIOptions) {
        super();
        this.options = options;
    }

    toConfig(): LlmConfig {
        const { apiKey, model, url, maxHistory, systemMessages, greetingMessage, failureMessage, params } = this.options;
        
        return {
            url: url ?? "https://api.openai.com/v1/chat/completions",
            api_key: apiKey,
            params: params ?? { model },
            max_history: maxHistory,
            system_messages: systemMessages,
            greeting_message: greetingMessage,
            failure_message: failureMessage,
            style: "openai",
        };
    }
}

/**
 * Constructor options for Azure OpenAI LLM.
 */
export interface AzureOpenAIOptions {
    /** Azure OpenAI API key */
    apiKey: string;
    /** Model/deployment name */
    model: string;
    /** Azure resource name (e.g., 'my-resource') */
    resourceName: string;
    /** Deployment name in Azure */
    deploymentName: string;
    /** Azure API version (defaults to '2023-05-15') */
    apiVersion?: string;
    /** Maximum number of conversation history messages to cache */
    maxHistory?: number;
    /** System messages for the LLM */
    systemMessages?: Record<string, unknown>[];
    /** Greeting message for the agent */
    greetingMessage?: string;
    /** Failure message when LLM call fails */
    failureMessage?: string;
    /** Additional LLM parameters */
    params?: Record<string, unknown>;
}

/**
 * Azure OpenAI LLM vendor.
 *
 * @example
 * ```typescript
 * const llm = new AzureOpenAI({
 *   apiKey: process.env.AZURE_OPENAI_API_KEY,
 *   model: 'gpt-4',
 *   resourceName: 'my-azure-resource',
 *   deploymentName: 'gpt-4-deployment',
 * });
 * ```
 */
export class AzureOpenAI extends BaseLLM {
    private options: AzureOpenAIOptions;

    constructor(options: AzureOpenAIOptions) {
        super();
        this.options = options;
    }

    toConfig(): LlmConfig {
        const {
            apiKey,
            model,
            resourceName,
            deploymentName,
            apiVersion = "2023-05-15",
            maxHistory,
            systemMessages,
            greetingMessage,
            failureMessage,
            params,
        } = this.options;

        return {
            url: `https://${resourceName}.openai.azure.com/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
            api_key: apiKey,
            vendor: "azure",
            params: params ?? { model },
            max_history: maxHistory,
            system_messages: systemMessages,
            greeting_message: greetingMessage,
            failure_message: failureMessage,
            style: "openai",
        };
    }
}

/**
 * Constructor options for Anthropic Claude LLM.
 */
export interface AnthropicOptions {
    /** Anthropic API key */
    apiKey: string;
    /** Model name (e.g., 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229') */
    model: string;
    /** API endpoint URL (defaults to Anthropic's standard endpoint) */
    url?: string;
    /** Maximum number of conversation history messages to cache */
    maxHistory?: number;
    /** System messages for the LLM */
    systemMessages?: Record<string, unknown>[];
    /** Greeting message for the agent */
    greetingMessage?: string;
    /** Failure message when LLM call fails */
    failureMessage?: string;
    /** Additional LLM parameters */
    params?: Record<string, unknown>;
}

/**
 * Anthropic Claude LLM vendor.
 *
 * @example
 * ```typescript
 * const llm = new Anthropic({
 *   apiKey: process.env.ANTHROPIC_API_KEY,
 *   model: 'claude-3-5-sonnet-20241022',
 * });
 * ```
 */
export class Anthropic extends BaseLLM {
    private options: AnthropicOptions;

    constructor(options: AnthropicOptions) {
        super();
        this.options = options;
    }

    toConfig(): LlmConfig {
        const { apiKey, model, url, maxHistory, systemMessages, greetingMessage, failureMessage, params } = this.options;

        return {
            url: url ?? "https://api.anthropic.com/v1/messages",
            api_key: apiKey,
            params: params ?? { model },
            max_history: maxHistory,
            system_messages: systemMessages,
            greeting_message: greetingMessage,
            failure_message: failureMessage,
            style: "anthropic",
        };
    }
}

/**
 * Constructor options for Google Gemini LLM.
 */
export interface GeminiOptions {
    /** Google API key */
    apiKey: string;
    /** Model name (e.g., 'gemini-pro', 'gemini-pro-vision') */
    model: string;
    /** API endpoint URL (defaults to Google's generativelanguage endpoint) */
    url?: string;
    /** Maximum number of conversation history messages to cache */
    maxHistory?: number;
    /** System messages for the LLM */
    systemMessages?: Record<string, unknown>[];
    /** Greeting message for the agent */
    greetingMessage?: string;
    /** Failure message when LLM call fails */
    failureMessage?: string;
    /** Additional LLM parameters */
    params?: Record<string, unknown>;
}

/**
 * Google Gemini LLM vendor.
 *
 * @example
 * ```typescript
 * const llm = new Gemini({
 *   apiKey: process.env.GOOGLE_API_KEY,
 *   model: 'gemini-pro',
 * });
 * ```
 */
export class Gemini extends BaseLLM {
    private options: GeminiOptions;

    constructor(options: GeminiOptions) {
        super();
        this.options = options;
    }

    toConfig(): LlmConfig {
        const { apiKey, model, url, maxHistory, systemMessages, greetingMessage, failureMessage, params } = this.options;

        return {
            url: url ?? "https://generativelanguage.googleapis.com/v1beta/models",
            api_key: apiKey,
            params: params ?? { model },
            max_history: maxHistory,
            system_messages: systemMessages,
            greeting_message: greetingMessage,
            failure_message: failureMessage,
            style: "gemini",
        };
    }
}
