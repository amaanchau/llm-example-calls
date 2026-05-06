"""
Benign examples for an LLM-call scanner: normal Python that touches the same
vocabulary (models, env, provider names) without calling provider APIs.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any


# Feature config or DB seed data — model ids only, no client
DEFAULT_MODEL_BY_USE_CASE: dict[str, str] = {
    "chat": "gpt-4o-mini",
    "long_context": "claude-sonnet-4-20250514",
    "batch": "gemini-2.0-flash",
}


@dataclass
class ModelDeployment:
    """Internal name for a deployed scoring model (not necessarily an LLM)."""

    name: str
    version: str
    runtime: str


deployment = ModelDeployment(name="recommendations-v2", version="1.3.0", runtime="cpu")


# Typical settings module pattern
def load_optional_openai_base_url() -> str | None:
    return os.getenv("OPENAI_BASE_URL")


# Static API response fixture for tests (no network)
STUB_CHAT_COMPLETION_JSON: dict[str, Any] = {
    "id": "stub",
    "object": "chat.completion",
    "model": "gpt-4o-mini",
    "choices": [{"index": 0, "message": {"role": "assistant", "content": "ok"}}],
}


# Prompt templates stored as data (common before any client is invoked)
PROMPT_LIBRARY_ENTRY = {
    "id": "incident_summary",
    "template": "Summarize this incident for execs:\n\n{{text}}",
    "suggested_model": "claude-3-5-haiku-latest",
}
