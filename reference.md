# Reference
## Agents
<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">start</a>({ ...params }) -> Agora.StartAgentsResponse</code></summary>
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
await client.agents.start({
    appid: "appid",
    name: "unique_name",
    properties: {
        channel: "channel_name",
        token: "token",
        agent_rtc_uid: "1001",
        remote_rtc_uids: ["1002"],
        idle_timeout: 120,
        asr: {
            language: "en-US"
        },
        tts: {
            vendor: "microsoft",
            params: {
                key: "key",
                region: "region",
                voice_name: "voice_name"
            }
        },
        llm: {
            url: "https://api.openai.com/v1/chat/completions",
            api_key: "<your_llm_key>",
            system_messages: [{
                    "role": "system",
                    "content": "You are a helpful chatbot."
                }],
            params: {
                "model": "gpt-4o-mini"
            },
            max_history: 32,
            greeting_message: "Hello, how can I assist you today?",
            failure_message: "Please hold on a second."
        }
    }
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

**request:** `Agora.StartAgentsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">list</a>({ ...params }) -> core.Page<Agora.ListAgentsResponse.Data.List.Item, Agora.ListAgentsResponse></code></summary>
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
const pageableResponse = await client.agents.list({
    appid: "appid"
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.agents.list({
    appid: "appid"
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}

// You can also access the underlying response
const response = page.response;

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

**request:** `Agora.ListAgentsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">get</a>({ ...params }) -> Agora.GetAgentsResponse</code></summary>
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
await client.agents.get({
    appid: "appid",
    agentId: "agentId"
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

**request:** `Agora.GetAgentsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">getHistory</a>({ ...params }) -> Agora.GetHistoryAgentsResponse</code></summary>
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
await client.agents.getHistory({
    appid: "appid",
    agentId: "agentId"
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

**request:** `Agora.GetHistoryAgentsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">stop</a>({ ...params }) -> void</code></summary>
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
await client.agents.stop({
    appid: "appid",
    agentId: "agentId"
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

**request:** `Agora.StopAgentsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">update</a>({ ...params }) -> Agora.UpdateAgentsResponse</code></summary>
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
await client.agents.update({
    appid: "appid",
    agentId: "agentId",
    properties: {
        token: "007eJxTYxxxxxxxxxxIaHMLAAAA0ex66",
        llm: {
            system_messages: [{
                    "role": "system",
                    "content": "You are a helpful assistant. xxx"
                }, {
                    "role": "system",
                    "content": "Previously, user has talked about their favorite hobbies with some key topics: xxx"
                }],
            params: {
                "model": "abab6.5s-chat",
                "max_token": 1024
            }
        }
    }
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

**request:** `Agora.UpdateAgentsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">speak</a>({ ...params }) -> Agora.SpeakAgentsResponse</code></summary>
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
await client.agents.speak({
    appid: "appid",
    agentId: "agentId",
    text: "Sorry, the conversation content is not compliant.",
    priority: "INTERRUPT",
    interruptable: false
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

**request:** `Agora.SpeakAgentsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.agents.<a href="/src/api/resources/agents/client/Client.ts">interrupt</a>({ ...params }) -> Agora.InterruptAgentsResponse</code></summary>
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
await client.agents.interrupt({
    appid: "appid",
    agentId: "agentId"
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

**request:** `Agora.InterruptAgentsRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `AgentsClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## Telephony
<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">list</a>({ ...params }) -> core.Page<Agora.ListTelephonyResponse.Data.List.Item, Agora.ListTelephonyResponse></code></summary>
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
const pageableResponse = await client.telephony.list({
    appid: "appid"
});
for await (const item of pageableResponse) {
    console.log(item);
}

// Or you can manually iterate page-by-page
let page = await client.telephony.list({
    appid: "appid"
});
while (page.hasNextPage()) {
    page = page.getNextPage();
}

// You can also access the underlying response
const response = page.response;

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

**request:** `Agora.ListTelephonyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TelephonyClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">call</a>({ ...params }) -> Agora.CallTelephonyResponse</code></summary>
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
await client.telephony.call({
    appid: "appid",
    name: "customer_service",
    sip: {
        to_number: "+19876543210",
        from_number: "+11234567890",
        rtc_uid: "100",
        rtc_token: "<agora_sip_rtc_token>"
    },
    pipeline_id: "fzufjlweixxxxnlp",
    properties: {
        channel: "<agora_channel>",
        token: "<agora_channel_token>",
        agent_rtc_uid: "111",
        remote_rtc_uids: ["100"]
    }
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

**request:** `Agora.CallTelephonyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TelephonyClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">get</a>({ ...params }) -> Agora.GetTelephonyResponse</code></summary>
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
await client.telephony.get({
    appid: "appid",
    agent_id: "agent_id"
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

**request:** `Agora.GetTelephonyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TelephonyClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.telephony.<a href="/src/api/resources/telephony/client/Client.ts">hangup</a>({ ...params }) -> Agora.HangupTelephonyResponse</code></summary>
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
await client.telephony.hangup({
    appid: "appid",
    agent_id: "agent_id"
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

**request:** `Agora.HangupTelephonyRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `TelephonyClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

## PhoneNumbers
<details><summary><code>client.phoneNumbers.<a href="/src/api/resources/phoneNumbers/client/Client.ts">list</a>() -> Agora.ListPhoneNumbersResponseItem[]</code></summary>
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
await client.phoneNumbers.list();

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

**requestOptions:** `PhoneNumbersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.phoneNumbers.<a href="/src/api/resources/phoneNumbers/client/Client.ts">add</a>({ ...params }) -> Agora.AddPhoneNumbersResponse</code></summary>
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
await client.phoneNumbers.add({
    provider: "byo",
    phone_number: "+19876543210",
    label: "Sales Hotline",
    inbound: true,
    outbound: true,
    inbound_config: {
        allowed_addresses: ["112.126.15.64/27"]
    },
    outbound_config: {
        address: "xxx:xxx@sip.example.com",
        transport: "tls"
    }
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

**request:** `Agora.AddPhoneNumbersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumbersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.phoneNumbers.<a href="/src/api/resources/phoneNumbers/client/Client.ts">get</a>({ ...params }) -> Agora.GetPhoneNumbersResponse</code></summary>
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
await client.phoneNumbers.get({
    phone_number: "phone_number"
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

**request:** `Agora.GetPhoneNumbersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumbersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.phoneNumbers.<a href="/src/api/resources/phoneNumbers/client/Client.ts">delete</a>({ ...params }) -> void</code></summary>
<dl>
<dd>

#### 📝 Description

<dl>
<dd>

<dl>
<dd>

Remove an imported phone number from the system.

After calling this endpoint, the number stops receiving calls routed through this system. To delete the number from the service provider, remove it in the service provider's console.
> This operation only removes the number configuration from the Agora system; the number stored with the phone service provider is not deleted.
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
await client.phoneNumbers.delete({
    phone_number: "phone_number"
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

**request:** `Agora.DeletePhoneNumbersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumbersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>

<details><summary><code>client.phoneNumbers.<a href="/src/api/resources/phoneNumbers/client/Client.ts">update</a>({ ...params }) -> Agora.UpdatePhoneNumbersResponse</code></summary>
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
await client.phoneNumbers.update({
    phone_number: "phone_number",
    inbound_config: {
        pipeline_id: "xxxxx"
    },
    outbound_config: {
        pipeline_id: "xxxxx"
    }
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

**request:** `Agora.UpdatePhoneNumbersRequest` 
    
</dd>
</dl>

<dl>
<dd>

**requestOptions:** `PhoneNumbersClient.RequestOptions` 
    
</dd>
</dl>
</dd>
</dl>


</dd>
</dl>
</details>
