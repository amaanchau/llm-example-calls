"""
Example LLM call sites for scanner validation — one OpenAI, one Anthropic.
Model IDs come from environment variables only (no literals).
"""

from __future__ import annotations

import os
from typing import Any

from google.generativeai import GenerativeModel

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
google_model='gemini-2.0-flash'

def _env(name: str) -> str | None:
    return os.getenv(name)


def anthropic_messages_create() -> Any:
    client = GenerativeModel(api_key=_env("GOOGLE_API_KEY"), model_name=google_model)
    return client.generate_content(
        contents="What is a circuit breaker?"
    )

