# Reference

## Agent Management

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">start</a>(appid, { ...params }) -> Agora.AgentManagementStartResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Create and start a Conversational AI agent instance.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agentManagement.start("appid", {
    name: "unique_name",
    properties: {
        channel: "channel_name",
        token: "token",
        agent_rtc_uid: "1001",
        remote_rtc_uids: ["1002"],
        idle_timeout: 120,
        advanced_features: {
            enable_aivad: true,
        },
        asr: {
            language: "en-US",
        },
        tts: {
            vendor: "microsoft",
            params: {
                key: "<your_tts_api_key>",
                region: "eastus",
                voice_name: "en-US-AndrewMultilingualNeural",
            },
        },
        llm: {
            url: "https://api.openai.com/v1/chat/completions",
            api_key: "<your_llm_key>",
            system_messages: [
                {
                    role: "system",
                    content: "You are a helpful chatbot.",
                },
            ],
            params: {
                model: "gpt-4o-mini",
            },
            max_history: 32,
            greeting_message: "Hello, how can I assist you today?",
            failure_message: "Please hold on a second.",
        },
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**request:** `Agora.AgentManagementStartRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">list</a>(appid, { ...params }) -> core.Page<Agora.AgentManagementListResponseDataListItem></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of agents that meet the specified conditions.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.agentManagement.list("appid", {
    channel: "channel",
    from_time: 1.1,
    to_time: 1.1,
    state: "0",
    limit: 1,
    cursor: "cursor",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.agentManagement.list("appid", {
    channel: "channel",
    from_time: 1.1,
    to_time: 1.1,
    state: "0",
    limit: 1,
    cursor: "cursor",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**request:** `Agora.AgentManagementListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">get</a>(appid, agentId) -> Agora.AgentManagementGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the current state information of the specified agent instance.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agentManagement.get("appid", "agentId");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**agentId:** `string` — The agent instance ID you obtained after successfully calling `join` to start a conversational AI agent.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">getHistory</a>(appid, agentId) -> Agora.AgentManagementGetHistoryResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Get the history of the conversation between the user and the agent.

Call this endpoint while the agent is running to retrieve the conversation history. You can set the maximum number of cached entries using the `llm.max_history` parameter when calling the start agent endpoint. The default value is `32`.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agentManagement.getHistory("appid", "agentId");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**agentId:** `string` — The agent instance ID you obtained after successfully calling `join` to start a conversational AI agent.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">stop</a>(appid, agentId) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Stop the specified conversational agent instance.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agentManagement.stop("appid", "agentId");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**agentId:** `string` — The agent instance ID you obtained after successfully calling `join` to start a conversational AI agent.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">update</a>(appid, agentId, { ...params }) -> Agora.AgentManagementUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Adjust Conversation AI Engine parameters at runtime.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agentManagement.update("appid", "agentId", {
    properties: {
        token: "007eJxTYxxxxxxxxxxIaHMLAAAA0ex66",
        llm: {
            system_messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant. xxx",
                },
                {
                    role: "system",
                    content: "Previously, user has talked about their favorite hobbies with some key topics: xxx",
                },
            ],
            params: {
                model: "abab6.5s-chat",
                max_token: 1024,
            },
        },
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**agentId:** `string` — The agent instance ID you obtained after successfully calling `join` to start a conversational AI agent.

</dd>
</dl>

<dl>
<dd>

**request:** `Agora.AgentManagementUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">speak</a>(appid, agentId, { ...params }) -> Agora.AgentManagementSpeakResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Broadcast a custom message using the TTS module.

During a conversation with an agent, call this endpoint to immediately broadcast a custom message using the TTS module. Upon receiving the request, the system interrupts the agent's speech and thought process to deliver the message. This broadcast can be interrupted by human voice.

Note: The speak API is not supported when using `mllm` configuration.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agentManagement.speak("appid", "agentId", {
    text: "Sorry, the conversation content is not compliant.",
    priority: "INTERRUPT",
    interruptable: false,
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**agentId:** `string` — The agent instance ID you obtained after successfully calling `join` to start a conversational AI agent.

</dd>
</dl>

<dl>
<dd>

**request:** `Agora.AgentManagementSpeakRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">interrupt</a>(appid, agentId, { ...params }) -> Agora.AgentManagementInterruptResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Interrupt the specified agent while speaking or thinking.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.agentManagement.interrupt("appid", "agentId");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**agentId:** `string` — The agent instance ID you obtained after successfully calling `join` to start a conversational AI agent.

</dd>
</dl>

<dl>
<dd>

**request:** `Agora.AgentManagementInterruptRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Telephony

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">list</a>(appid, { ...params }) -> core.Page<Agora.TelephonyListResponseDataListItem></code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Query historical call records for a specified appid based on the filter criteria.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
const response = await client.telephony.list("appid", {
    number: "number",
    from_time: 1,
    to_time: 1,
    type: "inbound",
    limit: 1,
    cursor: "cursor",
});
for await (const item of response) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.telephony.list("appid", {
    number: "number",
    from_time: 1,
    to_time: 1,
    type: "inbound",
    limit: 1,
    cursor: "cursor",
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**request:** `Agora.TelephonyListRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Telephony.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">call</a>(appid, { ...params }) -> Agora.TelephonyCallResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Initiate an outbound call to a specified number and create an agent to join the specified RTC channel.

Use this endpoint to initiate an outbound call to the specified number and create an agent that joins the target RTC channel. The agent waits for the callee to answer.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.telephony.call("appid", {
    name: "customer_service",
    sip: {
        to_number: "+19876543210",
        from_number: "+11234567890",
        sip_rtc_uid: "100",
        sip_rtc_token: "<agora_sip_rtc_token>",
    },
    pipeline_id: "fzufjlweixxxxnlp",
    properties: {
        channel: "<agora_channel>",
        token: "<agora_channel_token>",
        agent_rtc_uid: "111",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**request:** `Agora.TelephonyCallRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Telephony.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">get</a>(appid, agentId) -> Agora.TelephonyGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve the call status and related information of a specified agent.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.telephony.get("appid", "agent_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**agentId:** `string` — The agent ID you obtained after successfully calling the API to initiate an outbound call.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Telephony.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">hangup</a>(appid, agentId, { ...params }) -> Agora.TelephonyHangupResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Instruct the agent to proactively hang up the ongoing call and leave the RTC channel.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.telephony.hangup("appid", "agent_id");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**appid:** `string` — The App ID of the project.

</dd>
</dl>

<dl>
<dd>

**agentId:** `string` — The agent ID you obtained after successfully calling the API to initiate an outbound call.

</dd>
</dl>

<dl>
<dd>

**request:** `Agora.TelephonyHangupRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `Telephony.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

## Phone Number Management

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">list</a>() -> Agora.PhoneNumberManagementListResponseItem[]</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve a list of all imported phone numbers under the current account.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.phoneNumberManagement.list();
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**requestOptions:** `PhoneNumberManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">add</a>({ ...params }) -> Agora.PhoneNumberManagementAddResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Import a pre-configured phone number that can be used for inbound or outbound calls.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.phoneNumberManagement.add({
    provider: "byo",
    phone_number: "+19876543210",
    label: "Sales Hotline",
    inbound: true,
    outbound: true,
    inbound_config: {
        allowed_addresses: ["112.126.15.64/27"],
    },
    outbound_config: {
        address: "xxx:xxx@sip.example.com",
        transport: "tls",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**request:** `Agora.PhoneNumberManagementAddRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumberManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">get</a>(phoneNumber) -> Agora.PhoneNumberManagementGetResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Retrieve detailed information for a specific phone number.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.phoneNumberManagement.get("phone_number");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**phoneNumber:** `string` — Telephone number in E.164 format. For example, +11234567890.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumberManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">delete</a>(phoneNumber) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove an imported phone number from the system.

Note: This operation only removes the number configuration from the Agora system; the number stored with the phone service provider is not deleted. After calling this endpoint, the number stops receiving calls routed through this system. To delete the number from the service provider, remove it in the service provider's console.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.phoneNumberManagement.delete("phone_number");
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**phoneNumber:** `string` — Telephone number in E.164 format. For example, +11234567890.

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumberManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">update</a>(phoneNumber, { ...params }) -> Agora.PhoneNumberManagementUpdateResponse</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Update the configuration for a phone number.

</dd>
</dl>
</dd>
</dl>

#### 🔌 Usage

<dl>
<dd>

<dl>
<dd>

```typescript
await client.phoneNumberManagement.update("phone_number", {
    inbound_config: {
        pipeline_id: "xxxxx",
    },
    outbound_config: {
        pipeline_id: "xxxxx",
    },
});
```

</dd>
</dl>
</dd>
</dl>

#### ⚙️ Parameters

<dl>
<dd>

<dl>
<dd>

**phoneNumber:** `string` — Telephone number in E.164 format. For example, +11234567890.

</dd>
</dl>

<dl>
<dd>

**request:** `Agora.PhoneNumberManagementUpdateRequest`

</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumberManagement.RequestOptions`

</dd>
</dl>
</dd>
</dl>

</dd>
</dl>
</details>
