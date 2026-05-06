/**
 * MIXED fixtures — intentionally tricky REAL vs DECOY pairings for scanner robustness.
 */

import OpenAI from "openai";
import { streamText } from "ai";
import { openai as vercelOpenAI } from "@ai-sdk/openai";

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

// REAL: Vercel AI SDK streamText (explicit await on stream conclusion)
export async function vercelStreamTextMixed() {
  const result = streamText({
    model: vercelOpenAI(runtimeModel),
    messages: [
      { role: "system", content: "Keep answers under 80 words." },
      { role: "user", content: "Explain idempotency keys for payments APIs." },
    ],
  });
  let full = "";
  for await (const delta of result.textStream) full += delta;
  return full;
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

// DECOY: template expression concatenation bait — still just prose for humans
export const releaseNotes = [
  "We renamed internal helper streamText() → streamTokens() to avoid confusion",
  "with the AI SDK export streamText(...).",
].join(" ");
