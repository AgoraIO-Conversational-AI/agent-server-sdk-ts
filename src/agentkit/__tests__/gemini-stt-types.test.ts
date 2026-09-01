/** Compile-time checks for the global Gemini STT vendor. */

import type { GlobalSttVendor } from "../region-vendors.js";
import type { SttConfig } from "../types.js";
import { GeminiSTT } from "../vendors/stt.js";

const _globalGeminiStt: GlobalSttVendor = new GeminiSTT({
    apiKey: "test",
    model: "gemini-3.7-transcribe-live",
    language: "en-US",
    wordTimestamp: true,
});

const _handWrittenAsr: SttConfig = {
    vendor: "gemini",
    language: "en-US",
    params: {
        api_key: "test",
        model: "gemini-3.7-transcribe-live",
        language: "en-US",
        word_timestamp: true,
    },
};

function _requiresApiKey(): GeminiSTT {
    // @ts-expect-error apiKey is required
    return new GeminiSTT({ model: "gemini-3.7-transcribe-live" });
}

function _requiresModel(): GeminiSTT {
    // @ts-expect-error model is required
    return new GeminiSTT({ apiKey: "test" });
}
