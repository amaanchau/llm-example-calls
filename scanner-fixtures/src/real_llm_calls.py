"""
Example LLM call sites for scanner validation — one OpenAI, one Anthropic.
Model IDs come from environment variables only (no literals).
"""

from __future__ import annotations

import os
from typing import Any

from anthropic import Anthropic
from openai import OpenAI


def _env(name: str) -> str | None:
    return os.getenv(name)


def openai_chat_completion() -> Any:
    client = OpenAI(api_key=_env("OPENAI_API_KEY"))
    return client.chat.completions.create(
        model=_env("OPENAI_MODEL"),
        messages=[
            {"role": "system", "content": "You answer briefly."},
            {"role": "user", "content": "What is a circuit breaker?"},
        ],
    )


def anthropic_messages_create() -> Any:
    client = Anthropic(api_key=_env("ANTHROPIC_API_KEY"))
    return client.messages.create(
        model=_env("ANTHROPIC_MODEL"),
        max_tokens=512,
        messages=[{"role": "user", "content": "What is a circuit breaker?"}],
    )
