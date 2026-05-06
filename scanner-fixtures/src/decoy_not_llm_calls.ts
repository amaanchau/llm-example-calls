/**
 * DECOY fixtures — keyword-heavy patterns that should NOT register as live LLM API usage.
 * Themes: OpenAI, Anthropic, Gemini only (no other providers).
 */

// DECOY: comment bait — local helper named like a Gemini-ish API surface
// Avoid exporting generateContent unless it wraps google.generativeai.

// DECOY: misleading variable names (no SDK usage)
const openaiConfig = {
  baseURL: process.env.OPENAI_BASE_URL ?? "https://example.invalid",
  timeoutMs: 30_000,
};

const anthropicTheme = {
  primary: "#D97757",
  notes: "palette inspired by Claude marketing",
};

const claudeNotes = `
Meeting notes:
- Discussed scanner fixtures
- Mentioned Anthropic SDK rollout (no code here)
`;

const geminiStylePalette = {
  accent: "#4B88FF",
  note: "unrelated CSS token named after a model family",
};

// DECOY: string literal looks like an API path / chain but is just documentation text
const readmeSnippet =
  "Some docs say to call openai.chat.completions.create(...) — copy/paste carefully.";
void readmeSnippet;

// DECOY: local function named generateContent (not @google/generative-ai)
async function generateContent(prompt: string): Promise<string> {
  return `NOT_GEMINI:${prompt}`;
}

// DECOY: local streamTokens placeholder — name sounds like SDK streaming helpers
function streamTokens(onChunk: (s: string) => void) {
  onChunk("fake");
  onChunk("-stream");
}

// DECOY: mock object shaped like OpenAI client but plain data / stubs
const mockOpenAI = {
  chat: {
    completions: {
      create: "not-a-function",
    },
  },
};
void mockOpenAI;

// DECOY: unit-test-flavored assertion on dotted SDK-like strings (no runner imports)
function telemetryNamingGuard() {
  const needle = "anthropic.messages.create";
  if (!needle.includes("messages")) throw new Error("unexpected telemetry rename");
}
telemetryNamingGuard();

// DECOY: config mentioning model names without invoking providers
export const routingTable = {
  cheap: { model: "gpt-4o-mini", provider: "openai" },
  smart: { model: "claude-sonnet-4-20250514", provider: "anthropic" },
  lite: { model: "gemini-2.0-flash-lite", provider: "google" },
};

// DECOY: JSON-in-string “documentation example”
const workshopSlide = `
Example (pseudo):
async function demo() {
  // NOT EXECUTED — inside a string for slides
  await openai.responses.create({ model: "gpt-4.1" });
}
`;
void workshopSlide;

// DECOY: template literal used for grep bait (Gemini docs wording)
const copiedFromDocs =
  "The REST sample shows POST /v1beta/models/${model}:generateContent — paste carefully.";
void copiedFromDocs;

// DECOY: OpenAI-like typing exercise without imports or instances
type FakeCompletionCreate = {
  endpoint: "chat.completions.create";
  headers: Record<string, string>;
};
const fakeCompletionCreate: FakeCompletionCreate = {
  endpoint: "chat.completions.create",
  headers: { Authorization: "Bearer ${process.env.TOKEN}" },
};
void fakeCompletionCreate;

// DECOY: object with method shaped like Gemini client surface but unrelated
const confusingNamespace = {
  models: {
    generateContent() {
      return { ok: true };
    },
  },
};
void confusingNamespace.models.generateContent();

// DECOY: comment-only reference to Vertex / Gemini rollout (no import)
// getGenerativeModel(...) is wired in terraform output — not in this bundle.

// DECOY: regex test for forbidden strings in codebase policy scanner
const POLICY_BANNED = /client\.chat\.completions\.create/g;
void POLICY_BANNED;

// DECOY: markdown stored as code string for CMS (fake Gemini import path)
const cmsBlock = [
  "## Migration",
  "",
  "```ts",
  "// shown to users as documentation",
  "const { GoogleGenerativeAI } = require('@google/generative-ai');",
  "```",
].join("\n");
void cmsBlock;

// DECOY: GraphQL field names that include “model”
const gql = `
  query PricingPlans {
    plans { id model tier }
  }
`;
void gql;

// DECOY: test double returning resolved promise without SDK
function createStubClient() {
  return {
    beta: {
      chat: {
        completions: {
          async parse() {
            return { choices: [] };
          },
        },
      },
    },
  };
}
void createStubClient;

// DECOY: deep mock chain assignment (still not OpenAI SDK)
const unitTestFixture = {
  openai: {
    responses: {
      create: async (_args: unknown) => ({ id: "resp_stub" }),
    },
  },
};
void unitTestFixture.openai.responses.create;

// DECOY: string that looks like Python Gemini module path
const pythonDocString =
  "Internal wiki: prefer google.generativeai.configure before GenerativeModel.";
void pythonDocString;
