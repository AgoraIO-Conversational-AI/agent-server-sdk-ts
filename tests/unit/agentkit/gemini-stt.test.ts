import { describe, expect, test, vi } from "vitest";
import { AgoraClient } from "../../../src/AgoraPoolClient.js";
import { Agent } from "../../../src/agentkit/Agent.js";
import { Gemini } from "../../../src/agentkit/vendors/llm.js";
import { GeminiSTT } from "../../../src/agentkit/vendors/stt.js";
import { GoogleTTS } from "../../../src/agentkit/vendors/tts.js";
import { Area } from "../../../src/core/domain/index.js";

const API_KEY = "AIza-test-key";

function createClient(fetchFn?: typeof fetch) {
    return new AgoraClient({
        area: Area.US,
        appId: "test-app-id-0123456789abcdefghij",
        appCertificate: "test-app-certificate-01234567890",
        ...(fetchFn && { fetch: fetchFn }),
    });
}

function withGeminiAsr(agent: Agent): Agent {
    return agent
        .withStt(
            new GeminiSTT({
                apiKey: API_KEY,
                model: "gemini-3.7-transcribe-live",
                language: "en-US",
                wordTimestamp: true,
            }),
        )
        .withLlm(new Gemini({ apiKey: API_KEY, model: "gemini-2.0-flash" }))
        .withTts(new GoogleTTS({ key: API_KEY, voiceName: "en-US-Chirp3-HD-Charon", languageCode: "en-US" }));
}

describe("Gemini STT", () => {
    test("serializes the Fern-generated ASR schema", () => {
        expect(
            new GeminiSTT({
                apiKey: API_KEY,
                model: "gemini-3.7-transcribe-live",
                language: "en-US",
                wordTimestamp: true,
            }).toConfig(),
        ).toEqual({
            vendor: "gemini",
            params: {
                api_key: API_KEY,
                model: "gemini-3.7-transcribe-live",
                language: "en-US",
                word_timestamp: true,
            },
        });
    });

    test("omits optional fields and lets explicit options override additional params", () => {
        expect(
            new GeminiSTT({
                apiKey: API_KEY,
                model: "gemini-3.7-transcribe-live",
                additionalParams: { language: "fr-FR", word_timestamp: true, model: "overridden" },
            }).toConfig(),
        ).toEqual({
            vendor: "gemini",
            params: {
                language: "fr-FR",
                word_timestamp: true,
                api_key: API_KEY,
                model: "gemini-3.7-transcribe-live",
            },
        });
    });

    test("requires apiKey and model", () => {
        expect(() => new GeminiSTT({ apiKey: "", model: "gemini-3.7-transcribe-live" })).toThrow(
            "GeminiSTT requires apiKey",
        );
        expect(() => new GeminiSTT({ apiKey: API_KEY, model: "" })).toThrow("GeminiSTT requires model");
    });

    test("starts through the normal regional endpoint without a preview header", async () => {
        const fetchMock = vi
            .fn<typeof fetch>()
            .mockResolvedValue(new Response(JSON.stringify({ agent_id: "agent-1" }), { status: 200 }));
        const session = withGeminiAsr(new Agent({ client: createClient(fetchMock) })).createSession({
            name: "gemini-agent",
            channel: "gemini-channel",
            agentUid: "1",
            remoteUids: ["100"],
        });

        await expect(session.start()).resolves.toBe("agent-1");

        const [url, init] = fetchMock.mock.calls[0] ?? [];
        expect(String(url)).not.toContain("partner.ai.agora.io/preview");
        expect(new Headers(init?.headers).get("agora-feature")).toBeNull();
        const request = JSON.parse(init?.body as string);
        expect(request.properties.asr.params).toMatchObject({
            api_key: API_KEY,
            model: "gemini-3.7-transcribe-live",
            language: "en-US",
            word_timestamp: true,
        });
    });
});
