import { describe, expect, test } from "vitest";
import { Agent } from "../../../src/agentkit/Agent.js";
import { OpenAI } from "../../../src/agentkit/vendors/llm.js";
import {
    AmazonSTT,
    AssemblyAISTT,
    DeepgramSTT,
    GoogleSTT,
    OpenAISTT,
    SpeechmaticsSTT,
} from "../../../src/agentkit/vendors/stt.js";
import { ElevenLabsTTS } from "../../../src/agentkit/vendors/tts.js";

function baseAgent() {
    return new Agent()
        .withLlm(
            new OpenAI({ apiKey: "llm-key", model: "gpt-4o-mini", url: "https://api.openai.com/v1/chat/completions" }),
        )
        .withTts(
            new ElevenLabsTTS({
                key: "tts-key",
                voiceId: "voice",
                modelId: "eleven_flash_v2_5",
                baseUrl: "wss://api.elevenlabs.io/v1",
            }),
        );
}

describe("STT language serialization", () => {
    test("keeps STT language on vendor params and defaults turn_detection", () => {
        const properties = baseAgent()
            .withStt(new SpeechmaticsSTT({ apiKey: "stt-key", language: "en" }))
            .toProperties({
                channel: "channel",
                token: "token",
                agentUid: "1001",
                remoteUids: ["1002"],
            });

        expect(properties.asr).toMatchObject({
            vendor: "speechmatics",
            language: "en-US",
            params: {
                api_key: "stt-key",
                language: "en",
            },
        });
        expect(properties.turn_detection).toMatchObject({ language: "en-US" });
    });

    test("keeps bare Speechmatics language as a vendor param only", () => {
        const properties = baseAgent()
            .withStt(new SpeechmaticsSTT({ apiKey: "stt-key", language: "en" }))
            .toProperties({
                channel: "channel",
                token: "token",
                agentUid: "1001",
                remoteUids: ["1002"],
            });

        expect(properties.turn_detection).toMatchObject({ language: "en-US" });
        expect(properties.asr).toMatchObject({
            vendor: "speechmatics",
            language: "en-US",
            params: {
                api_key: "stt-key",
                language: "en",
            },
        });
    });

    test("uses turn detection language when it differs from provider language", () => {
        const properties = new Agent({ turnDetection: { language: "fr-FR" } })
            .withLlm(
                new OpenAI({
                    apiKey: "llm-key",
                    model: "gpt-4o-mini",
                    url: "https://api.openai.com/v1/chat/completions",
                }),
            )
            .withTts(
                new ElevenLabsTTS({
                    key: "tts-key",
                    voiceId: "voice",
                    modelId: "eleven_flash_v2_5",
                    baseUrl: "wss://api.elevenlabs.io/v1",
                }),
            )
            .withStt(new SpeechmaticsSTT({ apiKey: "stt-key", language: "en" }))
            .toProperties({
                channel: "channel",
                token: "token",
                agentUid: "1001",
                remoteUids: ["1002"],
            });

        expect(properties.asr).toMatchObject({
            vendor: "speechmatics",
            language: "fr-FR",
            params: {
                language: "en",
            },
        });
        expect(properties.turn_detection).toMatchObject({ language: "fr-FR" });
    });

    test("rejects invalid turn detection language", () => {
        expect(() =>
            new Agent({ turnDetection: { language: "xx" as never } })
                .withLlm(
                    new OpenAI({
                        apiKey: "llm-key",
                        model: "gpt-4o-mini",
                        url: "https://api.openai.com/v1/chat/completions",
                    }),
                )
                .withTts(
                    new ElevenLabsTTS({
                        key: "tts-key",
                        voiceId: "voice",
                        modelId: "eleven_flash_v2_5",
                        baseUrl: "wss://api.elevenlabs.io/v1",
                    }),
                )
                .toProperties({
                    channel: "channel",
                    token: "token",
                    agentUid: "1001",
                    remoteUids: ["1002"],
                }),
        ).toThrow("Invalid turnDetection.language: xx");
    });

    test("sends default interaction language when STT is omitted", () => {
        const properties = baseAgent().toProperties({
            channel: "channel",
            token: "token",
            agentUid: "1001",
            remoteUids: ["1002"],
        });

        expect(properties.asr).toEqual({ vendor: "ares", language: "en-US" });
        expect(properties.turn_detection).toEqual({ language: "en-US" });
    });

    test("serializes documented provider params without promoting provider language", () => {
        const deepgramManaged = new DeepgramSTT({ model: "nova-3", language: "en-US" }).toConfig();
        expect(deepgramManaged).not.toHaveProperty("language");
        expect(deepgramManaged.params).toMatchObject({
            model: "nova-3",
            language: "en-US",
        });

        expect(() => new DeepgramSTT({ model: "enhanced" } as never)).toThrow(
            "DeepgramSTT requires apiKey unless using a supported Agora-managed model",
        );

        expect(new DeepgramSTT({ apiKey: "dg-key", language: "en" }).toConfig().params).toMatchObject({
            key: "dg-key",
            language: "en",
        });

        expect(
            new OpenAISTT({
                apiKey: "openai-key",
                model: "gpt-4o-mini-transcribe",
                language: "en",
                prompt: "Transcribe English speech",
            }).toConfig().params,
        ).toEqual({
            api_key: "openai-key",
            input_audio_transcription: {
                model: "gpt-4o-mini-transcribe",
                language: "en",
                prompt: "Transcribe English speech",
            },
        });

        expect(() => new OpenAISTT({ apiKey: "openai-key", language: "en" }).toConfig()).toThrow(
            "OpenAISTT: inputAudioTranscription.prompt is required",
        );

        expect(() => new OpenAISTT({ apiKey: "openai-key", prompt: "Transcribe speech" }).toConfig()).toThrow(
            "OpenAISTT: inputAudioTranscription.language is required",
        );

        expect(
            new GoogleSTT({
                projectId: "project",
                location: "global",
                adcCredentialsString: "{}",
                language: "en-US",
                model: "long",
            }).toConfig().params,
        ).toMatchObject({
            project_id: "project",
            location: "global",
            adc_credentials_string: "{}",
            language: "en-US",
            model: "long",
        });

        expect(
            new AmazonSTT({
                accessKey: "access",
                secretKey: "secret",
                region: "us-east-1",
                language: "en-US",
            }).toConfig().params,
        ).toMatchObject({
            access_key_id: "access",
            secret_access_key: "secret",
            region: "us-east-1",
            language_code: "en-US",
        });

        const assemblyAiConfig = new AssemblyAISTT({
            apiKey: "assembly-key",
            language: "en-US",
            uri: "wss://example.test/ws",
        }).toConfig();
        expect(assemblyAiConfig).not.toHaveProperty("language");
        expect(assemblyAiConfig.params).toMatchObject({
            api_key: "assembly-key",
            language: "en-US",
            uri: "wss://example.test/ws",
        });
    });

    test("keeps AssemblyAI params nested and sources asr language from turn detection", () => {
        const properties = new Agent({ turnDetection: { language: "fr-FR" } })
            .withLlm(
                new OpenAI({
                    apiKey: "llm-key",
                    model: "gpt-4o-mini",
                    url: "https://api.openai.com/v1/chat/completions",
                }),
            )
            .withTts(
                new ElevenLabsTTS({
                    key: "tts-key",
                    voiceId: "voice",
                    modelId: "eleven_flash_v2_5",
                    baseUrl: "wss://api.elevenlabs.io/v1",
                }),
            )
            .withStt(new AssemblyAISTT({ apiKey: "assembly-key", language: "en-US", uri: "wss://example.test/ws" }))
            .toProperties({
                channel: "channel",
                token: "token",
                agentUid: "1001",
                remoteUids: ["1002"],
            });

        expect(properties.asr).toEqual({
            vendor: "assemblyai",
            language: "fr-FR",
            params: {
                api_key: "assembly-key",
                language: "en-US",
                uri: "wss://example.test/ws",
            },
        });
        expect(properties.turn_detection).toEqual({ language: "fr-FR" });
    });
});
