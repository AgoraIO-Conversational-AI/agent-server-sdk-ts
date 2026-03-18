/**
 * Type-safe LLM (Large Language Model) vendor classes.
 */

import { BaseLLM, type BaseLlmOptions } from "./base.js";
import type { LlmConfig } from "../types.js";

/**
 * Constructor options for OpenAI LLM.
 */
export interface OpenAIOptions extends BaseLlmOptions {
    /** OpenAI API key */
    apiKey: string;
    /** Model name (e.g., 'gpt-4o-mini', 'gpt-4', 'gpt-3.5-turbo') */
    model: string;
    /** API endpoint URL (defaults to OpenAI's standard endpoint) */
    url?: string;
    /** Maximum number of conversation history messages to cache */
    maxHistory?: number;
    /** Sampling temperature (0.0–2.0) */
    temperature?: number;
    /** Nucleus sampling (0.0–1.0) */
    topP?: number;
    /** Maximum tokens to generate */
    maxTokens?: number;
    /** System messages for the LLM */
    systemMessages?: Record<string, unknown>[];
    /** Greeting message for the agent */
    greetingMessage?: string;
    /** Failure message when LLM call fails */
    failureMessage?: string;
    /** Input modalities (defaults to ["text"]) */
    inputModalities?: string[];
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
 *   model: 'gpt-4o',
 * });
 * ```
 */
export class OpenAI extends BaseLLM {
    private readonly options: OpenAIOptions;

    constructor(options: OpenAIOptions) {
        super(options);
        this.options = options;
    }

    toConfig(): LlmConfig {
        const {
            apiKey,
            model,
            url,
            maxHistory,
            temperature,
            topP,
            maxTokens,
            systemMessages,
            greetingMessage,
            failureMessage,
            inputModalities,
            params,
        } = this.options;

        return {
            url: url ?? "https://api.openai.com/v1/chat/completions",
            api_key: apiKey,
            // model is the default; params entries extend it; named fields win.
            params: {
                model,
                ...params,
                ...(temperature !== undefined && { temperature }),
                ...(topP !== undefined && { top_p: topP }),
                ...(maxTokens !== undefined && { max_tokens: maxTokens }),
            },
            max_history: maxHistory,
            system_messages: systemMessages,
            greeting_message: greetingMessage,
            failure_message: failureMessage,
            input_modalities: inputModalities ?? ["text"],
            output_modalities: this.outputModalities,
            style: "openai",
            vendor: this.vendor,
            greeting_configs: this.greetingConfigs,
            template_variables: this.templateVariables,
            mcp_servers: this.mcpServers,
        };
    }
}

/**
 * Constructor options for Azure OpenAI LLM.
 */
export interface AzureOpenAIOptions extends BaseLlmOptions {
    /** Azure OpenAI API key */
    apiKey: string;
    /** Model/deployment name */
    model: string;
    /** Azure resource name (e.g., 'my-resource') */
    resourceName: string;
    /** Deployment name in Azure */
    deploymentName: string;
    /** Azure API version (defaults to '2024-08-01-preview') */
    apiVersion?: string;
    /** Maximum number of conversation history messages to cache */
    maxHistory?: number;
    /** Sampling temperature (0.0–2.0) */
    temperature?: number;
    /** Nucleus sampling (0.0–1.0) */
    topP?: number;
    /** Maximum tokens to generate */
    maxTokens?: number;
    /** System messages for the LLM */
    systemMessages?: Record<string, unknown>[];
    /** Greeting message for the agent */
    greetingMessage?: string;
    /** Failure message when LLM call fails */
    failureMessage?: string;
    /** Input modalities (defaults to ["text"]) */
    inputModalities?: string[];
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
    private readonly options: AzureOpenAIOptions;

    constructor(options: AzureOpenAIOptions) {
        super(options);
        this.options = options;
    }

    toConfig(): LlmConfig {
        const {
            apiKey,
            model,
            resourceName,
            deploymentName,
            apiVersion = "2024-08-01-preview",
            maxHistory,
            temperature,
            topP,
            maxTokens,
            systemMessages,
            greetingMessage,
            failureMessage,
            inputModalities,
            params,
        } = this.options;

        return {
            url: `https://${resourceName}.openai.azure.com/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
            api_key: apiKey,
            // "azure" is required by Agora for Azure OpenAI; user-supplied vendor overrides if needed.
            vendor: this.vendor ?? "azure",
            // model is the default; params entries extend it; named fields win.
            params: {
                model,
                ...params,
                ...(temperature !== undefined && { temperature }),
                ...(topP !== undefined && { top_p: topP }),
                ...(maxTokens !== undefined && { max_tokens: maxTokens }),
            },
            max_history: maxHistory,
            system_messages: systemMessages,
            greeting_message: greetingMessage,
            failure_message: failureMessage,
            input_modalities: inputModalities ?? ["text"],
            output_modalities: this.outputModalities,
            style: "openai",
            greeting_configs: this.greetingConfigs,
            template_variables: this.templateVariables,
            mcp_servers: this.mcpServers,
        };
    }
}

/**
 * Constructor options for Anthropic Claude LLM.
 */
export interface AnthropicOptions extends BaseLlmOptions {
    /** Anthropic API key */
    apiKey: string;
    /** Model name (e.g., 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229') */
    model: string;
    /** API endpoint URL (defaults to Anthropic's standard endpoint) */
    url?: string;
    /** Maximum number of conversation history messages to cache */
    maxHistory?: number;
    /** Maximum tokens to generate */
    maxTokens?: number;
    /** Sampling temperature (0.0–1.0) */
    temperature?: number;
    /** Nucleus sampling (0.0–1.0) */
    topP?: number;
    /** System messages for the LLM */
    systemMessages?: Record<string, unknown>[];
    /** Greeting message for the agent */
    greetingMessage?: string;
    /** Failure message when LLM call fails */
    failureMessage?: string;
    /** Input modalities (defaults to ["text"]) */
    inputModalities?: string[];
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
    private readonly options: AnthropicOptions;

    constructor(options: AnthropicOptions) {
        super(options);
        this.options = options;
    }

    toConfig(): LlmConfig {
        const { apiKey, model, url, maxHistory, maxTokens, temperature, topP, systemMessages, greetingMessage, failureMessage, inputModalities, params } = this.options;

        return {
            url: url ?? "https://api.anthropic.com/v1/messages",
            api_key: apiKey,
            // model is the default; params entries extend it; named fields win.
            params: {
                model,
                ...params,
                ...(maxTokens !== undefined && { max_tokens: maxTokens }),
                ...(temperature !== undefined && { temperature }),
                ...(topP !== undefined && { top_p: topP }),
            },
            max_history: maxHistory,
            system_messages: systemMessages,
            greeting_message: greetingMessage,
            failure_message: failureMessage,
            input_modalities: inputModalities ?? ["text"],
            output_modalities: this.outputModalities,
            style: "anthropic",
            vendor: this.vendor,
            greeting_configs: this.greetingConfigs,
            template_variables: this.templateVariables,
            mcp_servers: this.mcpServers,
        };
    }
}

/**
 * Constructor options for Google Gemini LLM.
 */
export interface GeminiOptions extends BaseLlmOptions {
    /** Google API key */
    apiKey: string;
    /** Model name (e.g., 'gemini-pro', 'gemini-pro-vision') */
    model: string;
    /** API endpoint URL (defaults to Google's generativelanguage endpoint) */
    url?: string;
    /** Maximum number of conversation history messages to cache */
    maxHistory?: number;
    /** Sampling temperature (0.0–2.0) */
    temperature?: number;
    /** Nucleus sampling (0.0–1.0) */
    topP?: number;
    /** Top-k sampling */
    topK?: number;
    /** Maximum output tokens to generate */
    maxOutputTokens?: number;
    /** System messages for the LLM */
    systemMessages?: Record<string, unknown>[];
    /** Greeting message for the agent */
    greetingMessage?: string;
    /** Failure message when LLM call fails */
    failureMessage?: string;
    /** Input modalities (defaults to ["text"]) */
    inputModalities?: string[];
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
    private readonly options: GeminiOptions;

    constructor(options: GeminiOptions) {
        super(options);
        this.options = options;
    }

    toConfig(): LlmConfig {
        const { apiKey, model, url, maxHistory, temperature, topP, topK, maxOutputTokens, systemMessages, greetingMessage, failureMessage, inputModalities, params } = this.options;

        return {
            url: url ?? "https://generativelanguage.googleapis.com/v1beta/models",
            api_key: apiKey,
            // model is the default; params entries extend it; named fields win.
            params: {
                model,
                ...params,
                ...(temperature !== undefined && { temperature }),
                ...(topP !== undefined && { top_p: topP }),
                ...(topK !== undefined && { top_k: topK }),
                ...(maxOutputTokens !== undefined && { max_output_tokens: maxOutputTokens }),
            },
            max_history: maxHistory,
            system_messages: systemMessages,
            greeting_message: greetingMessage,
            failure_message: failureMessage,
            input_modalities: inputModalities ?? ["text"],
            output_modalities: this.outputModalities,
            style: "gemini",
            vendor: this.vendor,
            greeting_configs: this.greetingConfigs,
            template_variables: this.templateVariables,
            mcp_servers: this.mcpServers,
        };
    }
}
