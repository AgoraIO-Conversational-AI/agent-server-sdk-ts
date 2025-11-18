# Reference

## Agent Management

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">startAgent</a>(appid, { ...params }) -> Agora.StartAgentResponse</code></summary>
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
await client.agentManagement.startAgent("appid", {
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

**request:** `Agora.StartAgentRequest`

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

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">listAgents</a>(appid, { ...params }) -> Agora.ListAgentsResponse</code></summary>
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
await client.agentManagement.listAgents("appid", {
    channel: "channel",
    from_time: 1.1,
    to_time: 1.1,
    state: "0",
    limit: 1,
    cursor: "cursor",
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

**request:** `Agora.ListAgentsRequest`

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

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">queryAgentStatus</a>(appid, agentId) -> Agora.QueryAgentStatusResponse</code></summary>
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
await client.agentManagement.queryAgentStatus("appid", "agentId");
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

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">getAgentHistory</a>(appid, agentId) -> Agora.GetAgentHistoryResponse</code></summary>
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
await client.agentManagement.getAgentHistory("appid", "agentId");
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

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">stopAgent</a>(appid, agentId) -> void</code></summary>
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
await client.agentManagement.stopAgent("appid", "agentId");
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

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">updateAgent</a>(appid, agentId, { ...params }) -> Agora.UpdateAgentResponse</code></summary>
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
await client.agentManagement.updateAgent("appid", "agentId", {
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

**request:** `Agora.UpdateAgentRequest`

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

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">agentSpeak</a>(appid, agentId, { ...params }) -> Agora.AgentSpeakResponse</code></summary>
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
await client.agentManagement.agentSpeak("appid", "agentId", {
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

**request:** `Agora.AgentSpeakRequest`

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

<details><summary><code>client.agentManagement.<a href="/src/api/resources/agentManagement/client/Client.ts">agentInterrupt</a>(appid, agentId, { ...params }) -> Agora.AgentInterruptResponse</code></summary>
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
await client.agentManagement.agentInterrupt("appid", "agentId");
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

**request:** `Agora.AgentInterruptRequest`

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

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">retrieveCallRecords</a>(appid, { ...params }) -> Agora.RetrieveCallRecordsResponse</code></summary>
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
await client.telephony.retrieveCallRecords("appid", {
    number: "number",
    from_time: 1,
    to_time: 1,
    type: "inbound",
    limit: 1,
    cursor: "cursor",
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

**request:** `Agora.RetrieveCallRecordsRequest`

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

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">initiateOutboundCall</a>(appid, { ...params }) -> Agora.InitiateOutboundCallResponse</code></summary>
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
await client.telephony.initiateOutboundCall("appid", {
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

**request:** `Agora.InitiateOutboundCallRequest`

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

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">retrieveCallStatus</a>(appid, agentId) -> Agora.RetrieveCallStatusResponse</code></summary>
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
await client.telephony.retrieveCallStatus("appid", "agent_id");
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

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">hangupCall</a>(appid, agentId, { ...params }) -> Agora.HangupCallResponse</code></summary>
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
await client.telephony.hangupCall("appid", "agent_id");
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

**request:** `Agora.HangupCallRequest`

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

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">retrieveNumberList</a>() -> Agora.RetrieveNumberListResponseItem[]</code></summary>
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
await client.phoneNumberManagement.retrieveNumberList();
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

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">importNumber</a>({ ...params }) -> Agora.ImportNumberResponse</code></summary>
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
await client.phoneNumberManagement.importNumber({
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

**request:** `Agora.ImportNumberRequest`

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

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">retrieveNumberInformation</a>(phoneNumber) -> Agora.RetrieveNumberInformationResponse</code></summary>
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
await client.phoneNumberManagement.retrieveNumberInformation("phone_number");
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

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">deleteNumber</a>(phoneNumber) -> void</code></summary>
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
await client.phoneNumberManagement.deleteNumber("phone_number");
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

<details><summary><code>client.phoneNumberManagement.<a href="/src/api/resources/phoneNumberManagement/client/Client.ts">updateNumberConfiguration</a>(phoneNumber, { ...params }) -> Agora.UpdateNumberConfigurationResponse</code></summary>
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
await client.phoneNumberManagement.updateNumberConfiguration("phone_number", {
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

**request:** `Agora.UpdateNumberConfigurationRequest`

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
