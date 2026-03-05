/**
 * Wire tests for token-based authentication on the ConvoAI REST API.
 *
 * Three auth modes:
 * 1. Token auth  — fetch wrapper sets `Authorization: agora token=<value>`
 * 2. App-credentials — AgentSession generates token per call; captured via fetch intercept
 * 3. Basic auth  — `Authorization: Basic <base64(cid:cs)>`
 *
 * Pool-client (AgoraPoolClient) authMode property is also asserted.
 */

import { AgoraClient as BaseAgoraClient } from "../../src/Client";
import { AgoraClient } from "../../src/AgoraPoolClient";
import { Area } from "../../src/core/domain/index";
import { AgentSession } from "../../src/wrapper/AgentSession";
import { mockServerPool } from "../mock-server/MockServerPool";

const AGENT_RESPONSE_BODY = {
    agent_id: "test-agent-id",
    create_ts: 1737111452,
    status: "RUNNING",
};

const MINIMAL_PROPERTIES = {
    channel: "test-channel",
    token: "rtc-token",
    agent_rtc_uid: "1001",
    remote_rtc_uids: ["100"],
    idle_timeout: 30,
    asr: { language: "en-US" },
    tts: { vendor: "microsoft", params: {} },
    llm: { url: "https://api.openai.com/v1/chat/completions" },
};

// ─── Token auth ───────────────────────────────────────────────────────────────

describe("Token auth: Authorization: agora token=<value>", () => {
    test("fetch wrapper overrides Authorization to agora token header", async () => {
        const server = mockServerPool.createServer();
        const tokenValue = "agora token=fake-wire-test-token";

        const client = new BaseAgoraClient({
            maxRetries: 0,
            username: "",
            password: "",
            environment: server.baseUrl,
            fetch: async (url, init) => {
                const headers = new Headers((init as RequestInit).headers);
                headers.set("Authorization", tokenValue);
                return globalThis.fetch(url, { ...(init as RequestInit), headers });
            },
        });

        server
            .mockEndpoint()
            .post("/v2/projects/test-app/join")
            .header("Authorization", tokenValue)
            .respondWith()
            .statusCode(200)
            .jsonBody(AGENT_RESPONSE_BODY)
            .build();

        const response = await client.agents.start({
            appid: "test-app",
            name: "test-agent",
            properties: MINIMAL_PROPERTIES,
        });

        expect(response).toEqual(AGENT_RESPONSE_BODY);
    });
});

// ─── Pool client authMode ─────────────────────────────────────────────────────

describe("AgoraClient (pool) authMode", () => {
    test("is 'token' when authToken is provided", () => {
        const client = new AgoraClient({
            area: Area.US,
            appId: "test-app",
            appCertificate: "test-cert",
            authToken: "agora token=some-token",
        });
        expect(client.authMode).toBe("token");
    });

    test("is 'app-credentials' when only appId+appCertificate", () => {
        const client = new AgoraClient({
            area: Area.US,
            appId: "test-app",
            appCertificate: "test-cert",
        });
        expect(client.authMode).toBe("app-credentials");
    });

    test("is 'basic' when customerId+customerSecret are provided", () => {
        const client = new AgoraClient({
            area: Area.US,
            appId: "test-app",
            appCertificate: "test-cert",
            customerId: "cid",
            customerSecret: "cs",
        });
        expect(client.authMode).toBe("basic");
    });
});

// ─── App-credentials: AgentSession injects token per call ────────────────────

describe("App-credentials auth: AgentSession injects ConvoAI token", () => {
    test("start uses agora token= header instead of Basic auth", async () => {
        const server = mockServerPool.createServer();

        let capturedAuthHeader: string | null = null;
        const capturingFetch: typeof fetch = async (url, init) => {
            const headers = new Headers((init as RequestInit).headers);
            capturedAuthHeader = headers.get("authorization") ?? headers.get("Authorization");
            return globalThis.fetch(url, init as RequestInit);
        };

        // Use real-length (32-char) appId + appCertificate for token signing
        const appId = "a".repeat(32);
        const appCertificate = "b".repeat(32);

        // Build a base client directly; attach authMode so AgentSession detects it
        const baseClient = new BaseAgoraClient({
            maxRetries: 0,
            username: "",
            password: "",
            environment: server.baseUrl,
            fetch: capturingFetch,
        });
        (baseClient as unknown as Record<string, unknown>).authMode = "app-credentials";

        // Build a minimal stub agent with the properties AgentSession accesses
        const stubAgent = {
            config: {},  // _validateAvatarConfig reads config.avatar; undefined avatar means skip
            tts: undefined,
            toProperties: (opts: Record<string, unknown>) => ({
                ...MINIMAL_PROPERTIES,
                channel: opts.channel as string,
                agent_rtc_uid: opts.agentUid as string,
                remote_rtc_uids: opts.remoteUids as string[],
                idle_timeout: (opts.idleTimeout ?? 30) as number,
                token: `rtc-for-${opts.channel}`,
            }),
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = new AgentSession({
            client: baseClient as any,
            agent: stubAgent as any,
            appId,
            appCertificate,
            name: "test-agent",
            channel: "test-channel",
            agentUid: "1001",
            remoteUids: ["100"],
            idleTimeout: 30,
        });

        server
            .mockEndpoint()
            .post(`/v2/projects/${appId}/join`)
            .respondWith()
            .statusCode(200)
            .jsonBody(AGENT_RESPONSE_BODY)
            .build();

        const agentId = await session.start();
        expect(agentId).toBe("test-agent-id");
        expect(capturedAuthHeader).toMatch(/^agora token=/);
    });
});

// ─── Basic auth ───────────────────────────────────────────────────────────────

describe("Basic auth: Authorization: Basic <base64>", () => {
    test("start uses Basic Authorization header", async () => {
        const server = mockServerPool.createServer();

        const client = new BaseAgoraClient({
            maxRetries: 0,
            username: "cid",
            password: "cs",
            environment: server.baseUrl,
        });

        // Basic base64("cid:cs") = "Y2lkOmNz"
        server
            .mockEndpoint()
            .post("/v2/projects/test-app/join")
            .header("Authorization", "Basic Y2lkOmNz")
            .respondWith()
            .statusCode(200)
            .jsonBody(AGENT_RESPONSE_BODY)
            .build();

        const response = await client.agents.start({
            appid: "test-app",
            name: "test-agent",
            properties: MINIMAL_PROPERTIES,
        });

        expect(response).toEqual(AGENT_RESPONSE_BODY);
    });
});
