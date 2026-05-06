/**
 * MIXED fixtures — tricky REAL vs DECOY pairings (OpenAI, Anthropic, Gemini only).
 */

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const runtimeModel = process.env.MIXED_EDGE_MODEL ?? "gpt-4o-mini";

// REAL: OpenAI chat completion with nested `messages` arrays inside content parts (multimodal-ish shape)
export async function nestedMessagesOpenAI() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai.chat.completions.create({
    model: runtimeModel,
    messages: [
      {
        role: "system",
        content: "You compare two drafts and pick the safer one.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Draft A vs Draft B",
          },
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

// REAL: Anthropic messages.create (variable model + multi-line system)
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

// REAL: Gemini generateContent inside same file as decoys
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

// DECOY: local object named `openai` with `.responses.create` — not the SDK import
export async function fakeOpenaiShadowing() {
  const openai = {
    responses: {
      create: async (_args: unknown) => ({ local: true }),
    },
  };
  return openai.responses.create({ model: "not-real" });
}

// REAL: model passed via variable (scanner must not require string literals only)
export async function modelFromVariable() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const chosen = runtimeModel;
  return client.chat.completions.create({
    model: chosen,
    messages: [{ role: "user", content: "Return JSON: {ok:true}" }],
    response_format: { type: "json_object" },
  });
}

// REAL: call inside try/catch with logging side effects
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

// REAL: returned directly without intermediate const (expression body async arrow)
export const immediateReturnOpenAI = () =>
  new OpenAI({ apiKey: process.env.OPENAI_API_KEY }).chat.completions.create({
    model: runtimeModel,
    messages: [{ role: "user", content: "Say ‘pong’." }],
  });

// REAL: assigned to const then returned (common refactor shape)
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

// DECOY: “call” only appears inside a markdown code fence stored as a string
export const markdownStringTrap = `
## Safe rollback script

\`\`\`ts
import OpenAI from "openai";
await new OpenAI({ apiKey: process.env.OPENAI_API_KEY }).chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{ role: "user", content: "This is not executed; it's documentation." }],
});
\`\`\`
`;

// DECOY: prose that mentions Anthropic chains without invoking the SDK here
export const releaseNotes = [
  "Renamed docs section: messages.create troubleshooting (no SDK in this repo path).",
  "Claude model strings are centralized in anthropic_constants.ts.",
].join(" ");
