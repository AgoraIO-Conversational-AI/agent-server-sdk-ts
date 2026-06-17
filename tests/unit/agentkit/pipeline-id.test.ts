import { describe, expect, test, vi } from "vitest";
import { Agent } from "../../../src/agentkit/Agent.js";
import { OpenAI } from "../../../src/agentkit/vendors/llm.js";
import { OpenAITTS } from "../../../src/agentkit/vendors/tts.js";
import type * as Agora from "../../../src/api/index.js";
import type { AgoraClient } from "../../../src/Client.js";

function createClient() {
    const start = vi.fn(async (_request: Agora.StartAgentsRequest) => ({
        agent_id: "agent-id",
        create_ts: 1737111452,
        status: "RUNNING" as const,
    }));

    const client = {
        appId: "appid",
        agents: { start },
    } as unknown as AgoraClient & { readonly appId: string };

    return { client, start };
}

function getStartRequest(start: ReturnType<typeof createClient>["start"]): Agora.StartAgentsRequest {
    expect(start).toHaveBeenCalledTimes(1);
    const call = start.mock.calls[0];
    expect(call).toBeDefined();
    return call[0];
}

describe("Agent pipelineId", () => {
    test("agent-level pipelineId is sent as top-level pipeline_id", async () => {
        const { client, start } = createClient();
        const agent = new Agent({ name: "support", pipelineId: "studio-pipeline-id" });

        const session = agent.createSession(client, {
            channel: "channel",
            token: "token",
            agentUid: "1",
            remoteUids: ["100"],
        });

        await session.start();

        const request = getStartRequest(start);
        expect(request).toMatchObject({
            appid: "appid",
            name: "support",
            pipeline_id: "studio-pipeline-id",
            properties: {
                channel: "channel",
                token: "token",
                agent_rtc_uid: "1",
                remote_rtc_uids: ["100"],
            },
        });
    });

    test("session-level pipelineId overrides agent-level pipelineId", async () => {
        const { client, start } = createClient();
        const agent = new Agent({ name: "support", pipelineId: "agent-pipeline" });

        const session = agent.createSession(client, {
            channel: "channel",
            token: "token",
            agentUid: "1",
            remoteUids: ["100"],
            pipelineId: "session-pipeline",
        });

        await session.start();

        expect(getStartRequest(start).pipeline_id).toBe("session-pipeline");
    });

    test("agent-level pipelineId skips missing ASR/LLM/TTS vendor validation", async () => {
        const { client, start } = createClient();
        const agent = new Agent({ name: "support", pipelineId: "studio-pipeline-id" });

        const session = agent.createSession(client, {
            channel: "channel",
            token: "token",
            agentUid: "1",
            remoteUids: ["100"],
        });

        await expect(session.start()).resolves.toBe("agent-id");
        expect(start).toHaveBeenCalledTimes(1);
        expect(getStartRequest(start).properties).not.toHaveProperty("asr");
        expect(getStartRequest(start).properties).not.toHaveProperty("llm");
        expect(getStartRequest(start).properties).not.toHaveProperty("tts");
    });

    test("pipelineId allows a single LLM override without TTS or ASR", async () => {
        const { client, start } = createClient();
        const agent = new Agent({ name: "support", pipelineId: "studio-pipeline-id" }).withLlm(
            new OpenAI({
                apiKey: "openai-key",
                url: "https://api.openai.com/v1/chat/completions",
                model: "gpt-4o",
            }),
        );

        const session = agent.createSession(client, {
            channel: "channel",
            token: "token",
            agentUid: "1",
            remoteUids: ["100"],
        });

        await session.start();

        const request = getStartRequest(start);
        expect(request.properties).not.toHaveProperty("asr");
        expect(request.properties).not.toHaveProperty("tts");
        expect(request.properties.llm?.api_key).toBe("openai-key");
        expect(request.properties.llm?.params?.model).toBe("gpt-4o");
    });

    test("pipelineId allows multiple overrides without ASR", async () => {
        const { client, start } = createClient();
        const agent = new Agent({ name: "support", pipelineId: "studio-pipeline-id" })
            .withLlm(
                new OpenAI({
                    apiKey: "openai-key",
                    url: "https://api.openai.com/v1/chat/completions",
                    model: "gpt-4o",
                }),
            )
            .withTts(
                new OpenAITTS({
                    apiKey: "tts-key",
                    baseUrl: "https://api.openai.com/v1/audio/speech",
                    model: "tts-1-hd",
                    voice: "alloy",
                }),
            );

        const session = agent.createSession(client, {
            channel: "channel",
            token: "token",
            agentUid: "1",
            remoteUids: ["100"],
        });

        await session.start();

        const request = getStartRequest(start);
        expect(request.properties).not.toHaveProperty("asr");
        expect(request.properties.llm?.api_key).toBe("openai-key");
        expect(request.properties.tts?.vendor).toBe("openai");
        expect(request.properties.tts?.params?.api_key).toBe("tts-key");
    });

    test("pipelineId allows a single LLM override without TTS or ASR", async () => {
        const { client, start } = createClient();
        const agent = new Agent({ name: "support", pipelineId: "studio-pipeline-id" }).withLlm(
            new OpenAI({
                apiKey: "openai-key",
                url: "https://api.openai.com/v1/chat/completions",
                model: "gpt-4o",
            }),
        );

        const session = agent.createSession(client, {
            channel: "channel",
            token: "token",
            agentUid: "1",
            remoteUids: ["100"],
        });

        await session.start();

        const request = getStartRequest(start);
        expect(request.properties).not.toHaveProperty("asr");
        expect(request.properties).not.toHaveProperty("tts");
        expect(request.properties.llm?.api_key).toBe("openai-key");
        expect(request.properties.llm?.params?.model).toBe("gpt-4o");
    });

    test("pipelineId allows multiple overrides without ASR", async () => {
        const { client, start } = createClient();
        const agent = new Agent({ name: "support", pipelineId: "studio-pipeline-id" })
            .withLlm(
                new OpenAI({
                    apiKey: "openai-key",
                    url: "https://api.openai.com/v1/chat/completions",
                    model: "gpt-4o",
                }),
            )
            .withTts(
                new OpenAITTS({
                    apiKey: "tts-key",
                    baseUrl: "https://api.openai.com/v1/audio/speech",
                    model: "tts-1-hd",
                    voice: "alloy",
                }),
            );

        const session = agent.createSession(client, {
            channel: "channel",
            token: "token",
            agentUid: "1",
            remoteUids: ["100"],
        });

        await session.start();

        const request = getStartRequest(start);
        expect(request.properties).not.toHaveProperty("asr");
        expect(request.properties.llm?.api_key).toBe("openai-key");
        expect(request.properties.tts?.vendor).toBe("openai");
        expect(request.properties.tts?.params?.api_key).toBe("tts-key");
    });

    test("pipeline_id is not sent inside properties", async () => {
        const { client, start } = createClient();
        const agent = new Agent({ name: "support", pipelineId: "studio-pipeline-id" });

        const session = agent.createSession(client, {
            channel: "channel",
            token: "token",
            agentUid: "1",
            remoteUids: ["100"],
        });

        await session.start();

        const request = getStartRequest(start);
        expect(request.pipeline_id).toBe("studio-pipeline-id");
        expect(request.properties).not.toHaveProperty("pipeline_id");
    });

    test("fluent builder clones preserve pipelineId", async () => {
        const { client, start } = createClient();
        const agent = new Agent({ name: "support", pipelineId: "studio-pipeline-id" }).withAdvancedFeatures({
            enable_rtm: true,
        });

        expect(agent.pipelineId).toBe("studio-pipeline-id");

        const session = agent.createSession(client, {
            channel: "channel",
            token: "token",
            agentUid: "1",
            remoteUids: ["100"],
        });

        await session.start();

        const request = getStartRequest(start);
        expect(request.pipeline_id).toBe("studio-pipeline-id");
        expect(request.properties.advanced_features).toEqual({ enable_rtm: true });
    });
});
