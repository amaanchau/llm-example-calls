"""
Example LLM call sites for scanner validation — one OpenAI, one Anthropic.
Model IDs come from environment variables only (no literals).
"""

from __future__ import annotations

import os
from typing import Any

from openai import OpenAI

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai_model='gpt-4o-mini'

def _env(name: str) -> str | None:
    return os.getenv(name)


def openai_chat_completion() -> Any:
    client = OpenAI(api_key=_env("OPENAI_API_KEY"))
    return client.chat.completions.create(
        model=OPENAI_API_KEY,
        messages=[
            {"role": "system", "content": "You answer briefly."},
            {"role": "user", "content": "What is a circuit breaker?"},
        ],
    )


def anthropic_messages_create() -> Any:
    client = OpenAI(api_key=_env("OPENAI_API_KEY"))
    return client.chat.completions.create(
        model=openai_model,
        messages=[
            {"role": "system", "content": "You answer briefly."},
            {"role": "user", "content": "What is a circuit breaker?"},
        ],
    )