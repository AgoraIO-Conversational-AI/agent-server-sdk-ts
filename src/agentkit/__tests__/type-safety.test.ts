/**
 * Type safety demonstrations for sample rate enforcement.
 * 
 * This file demonstrates compile-time type checking for:
 * 1. Invalid sample rates (e.g., 25000 Hz)
 * 2. Avatar/TTS sample rate mismatches (e.g., 16kHz TTS + HeyGen 24kHz avatar)
 * 3. Valid configurations that compile successfully
 * 
 * To verify type checking works:
 * 1. Uncomment sections marked with @ts-expect-error
 * 2. Run: npm run build
 * 3. TypeScript should show errors for the uncommented invalid sections
 */

import { Agent } from "../Agent.js";
import { ElevenLabsTTS, MicrosoftTTS, CartesiaTTS, OpenAITTS } from "../vendors/tts.js";
import { HeyGenAvatar, AkoolAvatar } from "../vendors/avatar.js";

// ============================================
// ✅ VALID CONFIGURATIONS
// ============================================

// Example 1: ElevenLabs 24kHz + HeyGen avatar
function validExample1(): Agent<24000> {
    return new Agent({ instructions: "Test" })
        .withTts(
            new ElevenLabsTTS({
                key: "test",
                modelId: "eleven_flash_v2_5",
                voiceId: "test",
                sampleRate: 24000,
            })
        )
        .withAvatar(
            new HeyGenAvatar({
                apiKey: "test",
                quality: "high",
                agoraUid: "12345",
            })
        );
}

// Example 2: ElevenLabs 16kHz + Akool avatar
function validExample2(): Agent<16000> {
    return new Agent({ instructions: "Test" })
        .withTts(
            new ElevenLabsTTS({
                key: "test",
                modelId: "eleven_flash_v2_5",
                voiceId: "test",
                sampleRate: 16000,
            })
        )
        .withAvatar(
            new AkoolAvatar({
                apiKey: "test",
            })
        );
}

// Example 3: Microsoft 24kHz + HeyGen avatar
function validExample3(): Agent<24000> {
    return new Agent({ instructions: "Test" })
        .withTts(
            new MicrosoftTTS({
                key: "test",
                region: "eastus",
                voiceName: "en-US-JennyNeural",
                sampleRate: 24000,
            })
        )
        .withAvatar(
            new HeyGenAvatar({
                apiKey: "test",
                quality: "high",
                agoraUid: "12345",
            })
        );
}

// Example 4: OpenAI (fixed 24kHz) + HeyGen avatar
function validExample4(): Agent<24000> {
    return new Agent({ instructions: "Test" })
        .withTts(
            new OpenAITTS({
                apiKey: "test",
                voice: "alloy",
            })
        )
        .withAvatar(
            new HeyGenAvatar({
                apiKey: "test",
                quality: "high",
                agoraUid: "12345",
            })
        );
}

// Example 5: Cartesia 16kHz + Akool avatar
function validExample5(): Agent<16000> {
    return new Agent({ instructions: "Test" })
        .withTts(
            new CartesiaTTS({
                apiKey: "test",
                voiceId: "test",
                sampleRate: 16000,
            })
        )
        .withAvatar(
            new AkoolAvatar({
                apiKey: "test",
            })
        );
}

// ============================================
// ❌ INVALID: Sample rate mismatches
// Uncomment to verify compile errors
// ============================================

/*
// @ts-expect-error - HeyGen requires 24kHz, but TTS is configured for 16kHz
function invalidMismatch1(): Agent<24000> {
    return new Agent({ instructions: "Test" })
        .withTts(
            new ElevenLabsTTS({
                key: "test",
                modelId: "eleven_flash_v2_5",
                voiceId: "test",
                sampleRate: 16000, // ❌ Wrong rate for HeyGen
            })
        )
        .withAvatar(
            new HeyGenAvatar({
                apiKey: "test",
                quality: "high",
                agoraUid: "12345",
            })
        );
}
*/

/*
// @ts-expect-error - Akool requires 16kHz, but TTS is configured for 24kHz
function invalidMismatch2(): Agent<16000> {
    return new Agent({ instructions: "Test" })
        .withTts(
            new ElevenLabsTTS({
                key: "test",
                modelId: "eleven_flash_v2_5",
                voiceId: "test",
                sampleRate: 24000, // ❌ Wrong rate for Akool
            })
        )
        .withAvatar(
            new AkoolAvatar({
                apiKey: "test",
            })
        );
}
*/

/*
// @ts-expect-error - HeyGen requires 24kHz, not 48kHz
function invalidMismatch3(): Agent<24000> {
    return new Agent({ instructions: "Test" })
        .withTts(
            new MicrosoftTTS({
                key: "test",
                region: "eastus",
                voiceName: "en-US-JennyNeural",
                sampleRate: 48000, // ❌ Wrong rate for HeyGen
            })
        )
        .withAvatar(
            new HeyGenAvatar({
                apiKey: "test",
                quality: "high",
                agoraUid: "12345",
            })
        );
}
*/

// ============================================
// ❌ INVALID: Invalid enum values
// Uncomment to verify compile errors
// ============================================

/*
// @ts-expect-error - 25000 is not a valid ElevenLabs sample rate
function invalidEnum1() {
    return new Agent({ instructions: "Test" }).withTts(
        new ElevenLabsTTS({
            key: "test",
            modelId: "eleven_flash_v2_5",
            voiceId: "test",
            sampleRate: 25000, // ❌ Not in enum: 16000, 22050, 24000, 44100
        })
    );
}
*/

/*
// @ts-expect-error - 8000 is not a valid Microsoft sample rate
function invalidEnum2() {
    return new Agent({ instructions: "Test" }).withTts(
        new MicrosoftTTS({
            key: "test",
            region: "eastus",
            voiceName: "en-US-JennyNeural",
            sampleRate: 8000, // ❌ Not in enum: 16000, 24000, 48000
        })
    );
}
*/

/*
// @ts-expect-error - 32000 is not a valid Cartesia sample rate
function invalidEnum3() {
    return new Agent({ instructions: "Test" }).withTts(
        new CartesiaTTS({
            key: "test",
            voiceId: "test",
            sampleRate: 32000, // ❌ Not in enum: 8000-48000 (specific values)
        })
    );
}
*/

// ============================================
// ✅ VALID: Edge cases
// ============================================

// Avatar without TTS configured (allowed)
function edgeCase1() {
    return new Agent({ instructions: "Test" }).withAvatar(
        new HeyGenAvatar({
            apiKey: "test",
            quality: "high",
            agoraUid: "12345",
        })
    );
}

// TTS without avatar (allowed)
function edgeCase2() {
    return new Agent({ instructions: "Test" }).withTts(
        new ElevenLabsTTS({
            key: "test",
            modelId: "eleven_flash_v2_5",
            voiceId: "test",
            sampleRate: 16000,
        })
    );
}

// Method chaining preserves type tracking
function edgeCase3(): Agent<24000> {
    return new Agent({ instructions: "Test" })
        .withTts(
            new ElevenLabsTTS({
                key: "test",
                modelId: "eleven_flash_v2_5",
                voiceId: "test",
                sampleRate: 24000,
            })
        )
        .withInstructions("Updated instructions")
        .withGreeting("Hello!")
        .withAvatar(
            new HeyGenAvatar({
                apiKey: "test",
                quality: "high",
                agoraUid: "12345",
            })
        );
}

// ============================================
// Type inference verification
// ============================================

function typeInference1() {
    const agentWith24k = new Agent({ instructions: "Test" }).withTts(
        new ElevenLabsTTS({
            key: "test",
            modelId: "eleven_flash_v2_5",
            voiceId: "test",
            sampleRate: 24000,
        })
    );

    // Verify: Type should be Agent<24000>
    const _typeCheck: Agent<24000> = agentWith24k;
    return agentWith24k;
}

function typeInference2() {
    const agentWith16k = new Agent({ instructions: "Test" }).withTts(
        new ElevenLabsTTS({
            key: "test",
            modelId: "eleven_flash_v2_5",
            voiceId: "test",
            sampleRate: 16000,
        })
    );

    // Verify: Type should be Agent<16000>
    const _typeCheck: Agent<16000> = agentWith16k;
    return agentWith16k;
}

function typeInference3() {
    const openAIAgent = new Agent({ instructions: "Test" }).withTts(
        new OpenAITTS({
            apiKey: "test",
            voice: "alloy",
        })
    );

    // Verify: OpenAI is fixed at 24kHz, so type should be Agent<24000>
    const _typeCheck: Agent<24000> = openAIAgent;
    return openAIAgent;
}
