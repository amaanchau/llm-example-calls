/**
 * Like a real repo file: real provider calls mixed with ordinary config and types.
 * For scanning GitHub — useful shapes (env model, try/catch, etc.), not decoy games.
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const runtimeModel = process.env.MIXED_EDGE_MODEL ?? "gpt-4o-mini";

// --- Real calls (same providers as the rest of the fixtures) ---

export async function nestedMessagesOpenAI() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai.chat.completions.create({
    model: runtimeModel,
    messages: [
      { role: "system", content: "You compare two drafts and pick the safer one." },
      {
        role: "user",
        content: [
          { type: "text", text: "Draft A vs Draft B" },
          {
            type: "text",
            text: JSON.stringify({
              drafts: [
                { id: "A", messages: [{ role: "user", content: "Hello" }] },
                { id: "B", messages: [{ role: "user", content: "Hi!!" }] },
              ],
            }),
          },
        ],
      },
    ],
  });
}

export async function anthropicMixedVariableModel() {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = process.env.MIXED_ANTHROPIC_MODEL ?? "claude-3-5-sonnet-latest";
  return client.messages.create({
    model,
    max_tokens: 600,
    system: ["You prioritize security.", "No markdown tables."].join("\n"),
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: "Review this nginx snippet for SSRF pitfalls." }],
      },
    ],
  });
}

export async function geminiMixedGenerateContent() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
  const model = genAI.getGenerativeModel({
    model: process.env.MIXED_GEMINI_MODEL ?? "gemini-2.0-flash",
  });
  const out = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: "One tip for canary analysis." }] }],
  });
  return out.response.text();
}

export async function modelFromVariable() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const chosen = runtimeModel;
  return client.chat.completions.create({
    model: chosen,
    messages: [{ role: "user", content: "Return JSON: {ok:true}" }],
    response_format: { type: "json_object" },
  });
}

export async function wrappedWithTryCatch() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    return await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "One sentence about observability." }],
    });
  } catch (e) {
    console.error("openai failure", e);
    throw e;
  }
}

export const immediateReturnOpenAI = () =>
  new OpenAI({ apiKey: process.env.OPENAI_API_KEY }).chat.completions.create({
    model: runtimeModel,
    messages: [{ role: "user", content: "Say ‘pong’." }],
  });

export async function assignedToConst() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "Be literal." },
      { role: "user", content: "Reply with the word: ok" },
    ],
  });
  return completion;
}

// Ordinary constant in the same file — mentions a provider key, no API usage
export const README_ENV_HINT =
  "For local runs, export OPENAI_API_KEY (see .env.example).";
