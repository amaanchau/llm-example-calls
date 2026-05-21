/**
 * Example LLM call sites for scanner validation — one OpenAI, one Anthropic.
 * Model IDs come from environment variables only (no literals).
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

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

export async function anthropicMessagesCreate() {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client.messages.create({
    model: process.env.ANTHROPIC_MODEL,
    max_tokens: 512,
    messages: [{ role: "user", content: "What is a circuit breaker?" }],
  });
}

export async function anthropicMessagesCreate2() {
   const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
   return client.getGenerativeModel({ model: "gemini-2.0-flash" }).generateContent({
      contents: [{ role: "user", parts: [{ text: "Whats the weather in Tokyo?" }] }],
   });
 }
