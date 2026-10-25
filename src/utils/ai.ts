require("dotenv").config();
import OpenAI from "openai";

// OpenRouter is OpenAI-compatible, so the official SDK works with a custom baseURL.
export const AI_BASE_URL =
  process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";
export const AI_MODEL = process.env.AI_MODEL || "openai/gpt-6-luna";
export const AI_KEY = process.env.OPENROUTER_API_KEY || "";
// Reasoning tokens count against max_tokens; keep it low so JSON isn't cut off.
export const AI_REASONING_EFFORT = process.env.AI_REASONING_EFFORT || "minimal";

// Adds OpenRouter's `reasoning` field to every chat request body.
const fetchWithReasoning: typeof fetch = (url, init) => {
  if (init?.body && typeof init.body === "string") {
    try {
      const body = JSON.parse(init.body);
      if (body.model && !body.reasoning) {
        body.reasoning = { effort: AI_REASONING_EFFORT, exclude: true };
        init = { ...init, body: JSON.stringify(body) };
      }
    } catch {}
  }
  return fetch(url, init);
};

export const openai = new OpenAI({
  apiKey: AI_KEY,
  baseURL: AI_BASE_URL,
  fetch: fetchWithReasoning as any,
  defaultHeaders: {
    "HTTP-Referer": "https://t.me/Slayd_Robo_Bot",
    "X-Title": "Slayd Robo Bot",
  },
});

export default openai;
