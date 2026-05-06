/**
 * Benign examples for an LLM-call scanner: normal code that mentions providers,
 * “model”, env vars, etc., without calling OpenAI / Anthropic / Gemini APIs.
 */

// HTTP client settings (common in services that also use LLMs elsewhere)
const openaiHttpDefaults = {
  baseURL: process.env.OPENAI_BASE_URL,
  timeoutMs: 30_000,
};

// Product / design tokens — names happen to match vendor branding
const anthropicAccent = "#D97757";

// Default model IDs for feature flags or a router service (data only)
export const defaultLlmIds = {
  cheap: "gpt-4o-mini",
  quality: "claude-sonnet-4-20250514",
  fast: "gemini-2.0-flash",
};

// Domain type: “model” means ML / catalog model, not necessarily an LLM call site
type CatalogEntry = {
  sku: string;
  model: string;
  year: number;
};

const inventoryRow: CatalogEntry = { sku: "x1", model: "widget-pro", year: 2025 };
void inventoryRow;

// Onboarding copy for engineers (string only)
const envSetupBlurb =
  "Copy .env.example and set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY as needed.";
void envSetupBlurb;

// App-level helper name — not the Google SDK
export function summarizeForUi(text: string): string {
  return text.slice(0, 120) + (text.length > 120 ? "…" : "");
}
