/**
 * Example LLM call sites for scanner validation — one OpenAI, one Anthropic.
 * Model IDs come from environment variables only (no literals).
 */

import OpenAI from "openai";
import OpenAI from "openai";

export async function openaiChatCompletion() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages: [
      { role: "system", content: "You answer briefly." },
      { role: "user", content: "What is a circuit breaker?" },
    ],
  });
}

export async function anthropicMessagesCreate2() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client.chat.completions.create({
    model: "gpt-5.4-mini",
    max_tokens: 512,
    messages: [{ role: "user", content: "Whats the weather in Tokyo?" }],
  });
}
