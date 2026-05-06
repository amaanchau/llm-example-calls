/**
 * DECOY fixtures — keyword-heavy patterns that should NOT register as live LLM API usage.
 */

/* DECOY: comment mentions Vercel — generateText is a common helper name in tutorials */
// Tip: if you export generateText from your own util, avoid naming collisions with `ai`.

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

// DECOY: string literal looks like an API path / chain but is just documentation text
const readmeSnippet =
  "Some docs say to call openai.chat.completions.create(...) — copy/paste carefully.";
void readmeSnippet;

// DECOY: local function named generateText (not imported from `ai`)
async function generateText(input: string): Promise<string> {
  return `ECHO:${input}`;
}

// DECOY: local streamText placeholder for UI simulations
function streamText(onChunk: (s: string) => void) {
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
  embed: { model: "text-embedding-3-large", provider: "openai" },
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

// DECOY: template literal used for grep bait
const copiedFromDocs = `Use streamText({ model, messages }) from the AI SDK.`;
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

// DECOY: object destructuring from unrelated library pretending to be AI
const confusingNamespace = {
  generateObject() {
    return { ok: true };
  },
};
void confusingNamespace.generateObject();

// DECOY: mentions LangChain in comment only
// ChatOpenAI(...) is imported in another repo—here we only parse env defaults.

// DECOY: Zod schema named like AI SDK but no model call
import { z } from "zod";
const GenerateObjectSchema = z.object({ answer: z.string() });
void GenerateObjectSchema;

// DECOY: regex test for forbidden strings in codebase policy scanner
const POLICY_BANNED = /client\.chat\.completions\.create/g;
void POLICY_BANNED;

// DECOY: markdown stored as code string for CMS
const cmsBlock = [
  "## Migration",
  "",
  "```ts",
  "// shown to users as documentation",
  "import { streamObject } from 'ai'",
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
