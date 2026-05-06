"""
DECOY fixtures — Python patterns that resemble LLM integrations but are false positives.
"""

from __future__ import annotations

import json
import re
import unittest.mock
from typing import Any


# DECOY: string mentions dotted API path (policy / grep bait)
FORBIDDEN_SNIPPET = "Some interns paste client.chat.completions.create without reviewing."

# DECOY: comment referring to Anthropic API (not an invocation)
# NOTE: In prod we standardize on Anthropic messages.create for tool-use — see RFC-42.


# DECOY: local helper named like Gemini SDK surface
def generate_content(prompt: str) -> str:
    return f"NOT_LLM:{prompt}"


# DECOY: dict includes model key but no HTTP client / SDK call
MODEL_REGISTRY = {
    "router": {"model": "gpt-4o", "cost_class": "high"},
    "fallback": {"model": "gpt-4o-mini", "cost_class": "low"},
}


# DECOY: mock class that mimics Anthropic client naming
class FakeAnthropic:
    class Messages:
        @staticmethod
        def create(**kwargs: Any) -> dict[str, Any]:
            return {"type": "fixture", "kwargs_keys": sorted(kwargs.keys())}

    messages = Messages()


def build_fake_client() -> FakeAnthropic:
    return FakeAnthropic()


# DECOY: unittest.mock patching strings for CI
def test_scanner_does_not_match_patch_strings() -> None:
    patch_target = "openai.resources.chat.completions.Completions.create"
    assert "Completions.create" in patch_target


# DECOY: triple-quoted documentation embedded in constant
DOCS_FOOTER = '''
Developer hint:
    client.messages.create(...)
is not automatically audited — instrument wrappers instead.
'''


# DECOY: JSON blob describing endpoints (not executable calls)
OPENAPI_LIKE = json.dumps(
    {
        "paths": {
            "/v1/chat/completions": {"post": {"operationId": "chat_completions_create"}},
            "/v1/responses": {"post": {"operationId": "responses_create"}},
        }
    }
)


# DECOY: regex scanning for banned identifiers
_PATTERN = re.compile(r"langchain\.chat_models\.ChatOpenAI")


# DECOY: dataclass pretending to configure LLM but never imported SDK
from dataclasses import dataclass


@dataclass(frozen=True)
class LlmRoute:
    provider: str
    model: str
    temperature: float


DEFAULT_ROUTE = LlmRoute(provider="openai", model="gpt-4.1-mini", temperature=0.2)


# DECOY: pytest-style autospec mock
def demo_mock_autospec() -> unittest.mock.MagicMock:
    return unittest.mock.create_autospec(spec=["messages"], instance=True)


# DECOY: f-string template for internal wiki (no API)
WIKI_SNIPPET = f"""
Set OPENAI_API_KEY in `{process_env_placeholder()}` for local dev.
"""


def process_env_placeholder() -> str:
    return ".env.local"


# DECOY: list comprehension building “prompt-like” strings from CSV headers
HEADERS = ["sku", "qty", "model"]
FAKE_PROMPTS = [f"column:{h}" for h in HEADERS]


# DECOY: type alias referencing external symbols without importing them
OpenAIClient = Any  # noqa: UP007 — intentional fuzz for scanners


# DECOY: function returning schema-only payload (no network)
def export_prompt_catalog() -> dict[str, Any]:
    return {
        "entries": [
            {
                "id": "summarize",
                "template": "Summarize: {{text}}",
                "recommended_model": "claude-3-5-haiku-latest",
            }
        ]
    }


# DECOY: mention LlamaIndex in a comment only
# query_engine.query(...) should be wrapped by our observability layer.


# DECOY: dynamic getattr toy object
class DynamicFacade:
    def __getattr__(self, name: str) -> Any:
        return lambda **_kw: {"called": name}


facade = DynamicFacade()
_ = facade.chat_completions_create
