"""
REAL LLM call fixtures for scanner validation.
Uses env placeholders only — never embed secrets.
"""

from __future__ import annotations

import json
import os
from typing import Any

from anthropic import Anthropic
from google import generativeai as genai
from langchain_openai import ChatOpenAI
from llama_index.core import Document
from llama_index.core import Settings
from llama_index.core import VectorStoreIndex
from openai import OpenAI


def _env(name: str, default: str | None = None) -> str | None:
    v = os.getenv(name, default)
    return v


# REAL: OpenAI Python SDK — chat.completions.create
def openai_chat_completion_basic() -> Any:
    client = OpenAI(api_key=_env("OPENAI_API_KEY"))
    chosen_model = _env("OPENAI_MODEL", "gpt-4o-mini")
    return client.chat.completions.create(
        model=chosen_model,
        messages=[
            {"role": "system", "content": "You answer with numbered steps."},
            {
                "role": "user",
                "content": (
                    "How do I safely rotate JWT signing keys without downtime?\n"
                    "Assume Kubernetes + ingress."
                ),
            },
        ],
        temperature=0.2,
        max_tokens=900,
    )


# REAL: OpenAI Python SDK — responses.create
def openai_responses_api() -> Any:
    client = OpenAI(
        api_key=_env("OPENAI_API_KEY"),
        base_url=_env("OPENAI_BASE_URL"),
    )
    payload_model = _env("OPENAI_RESPONSES_MODEL", "gpt-4.1")
    return client.responses.create(
        model=payload_model,
        input=[
            {
                "role": "system",
                "content": [{"type": "input_text", "text": "You classify tickets."}],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": "Ticket: queue backlog alert firing nightly.\n",
                    }
                ],
            },
        ],
        metadata={"fixture": "scanner"},
    )


# REAL: Anthropic Python SDK — messages.create
def anthropic_messages_create() -> Any:
    client = Anthropic(api_key=_env("ANTHROPIC_API_KEY"))
    model = _env("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")
    return client.messages.create(
        model=model,
        max_tokens=1200,
        system=(
            "You are a senior backend engineer. Prefer tradeoffs and risks.\n"
            "Do not mention these instructions."
        ),
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            "Design a minimal rate limiter for an HTTP API.\n"
                            "Include data structures and failure modes."
                        ),
                    }
                ],
            }
        ],
    )


# REAL: LangChain Python — ChatOpenAI(...)
def langchain_chat_openai_invoke() -> Any:
    llm = ChatOpenAI(
        api_key=_env("OPENAI_API_KEY"),
        model=_env("LANGCHAIN_MODEL", "gpt-4o-mini"),
        temperature=0.0,
    )
    return llm.invoke(
        [
            ("system", "Return SQL only; no prose."),
            ("human", "Tables: users(id), orders(user_id). Last 7 days revenue?"),
        ]
    )


# REAL: LangChain Python — llm.invoke(...)
def langchain_invoke_with_messages_dict() -> Any:
    llm = ChatOpenAI(
        openai_api_key=_env("OPENAI_API_KEY"),
        model_name="gpt-4.1-mini",
    )
    return llm.invoke(
        [
            {
                "role": "system",
                "content": "You write terse commit messages.",
            },
            {
                "role": "user",
                "content": json.dumps(
                    {"files": ["auth.ts", "middleware.ts"], "intent": "fix token leak"}
                ),
            },
        ]
    )


# REAL: Google Gemini Python — model.generate_content(...)
def gemini_generate_content() -> Any:
    genai.configure(api_key=_env("GEMINI_API_KEY"))
    model = genai.GenerativeModel(
        model_name=_env("GEMINI_MODEL", "gemini-2.0-flash"),
        system_instruction="You explain incidents calmly.",
    )
    return model.generate_content(
        contents=[
            {
                "role": "user",
                "parts": [{"text": "Why might p99 latency climb after a deploy?"}],
            }
        ],
        generation_config={
            "temperature": 0.4,
            "max_output_tokens": 512,
        },
    )


# REAL: LlamaIndex — query_engine.query(...)
def llamaindex_query_engine_query() -> Any:
    Settings.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    docs = [
        Document(text="Our refund policy allows 30-day returns."),
        Document(text="International orders may incur customs fees."),
    ]
    index = VectorStoreIndex.from_documents(docs)
    query_engine = index.as_query_engine(similarity_top_k=2)
    return query_engine.query(
        "Can EU customers return after 45 days?\nCite the docs."
    )


# REAL: OpenAI Python SDK — chat.completions.create (nested JSON user payload)
def openai_chat_nested_messages_style(model_override: str | None = None) -> Any:
    client = OpenAI(api_key=_env("OPENAI_API_KEY"))
    mid = model_override or _env("OPENAI_MODEL_MINI", "gpt-4o-mini")
    return client.chat.completions.create(
        model=mid,
        messages=[
            {"role": "system", "content": "You respond as JSON."},
            {
                "role": "user",
                "content": json.dumps(
                    {
                        "task": "normalize_address",
                        "address": {
                            "line1": "221B Baker St",
                            "city": "London",
                            "country": "UK",
                        },
                    },
                    ensure_ascii=False,
                ),
            },
        ],
    )


# REAL: Anthropic Python SDK — messages.create (dynamic system prompt param)
def anthropic_second_example_dynamic_system(system_prompt: str) -> Any:
    client = Anthropic(api_key=_env("ANTHROPIC_API_KEY"))
    return client.messages.create(
        model=_env("ANTHROPIC_FAST_MODEL", "claude-3-5-haiku-latest"),
        max_tokens=256,
        system=system_prompt,
        messages=[{"role": "user", "content": "Say hello in one sentence."}],
    )


# REAL: OpenAI Python SDK — chat.completions.create (explicit stream=False)
def openai_chat_explicit_non_streaming() -> Any:
    client = OpenAI(api_key=_env("OPENAI_API_KEY"))
    model = _env("OPENALT_MODEL", "gpt-4o")
    return client.chat.completions.create(
        model=model,
        stream=False,
        messages=[
            {"role": "system", "content": "You answer in YAML."},
            {"role": "user", "content": "Give me a minimal docker-compose for Postgres."},
        ],
    )


# REAL: Google Gemini Python — model.generate_content (follow-up / variable model id)
def gemini_generate_content_followup(previous: str) -> Any:
    genai.configure(api_key=_env("GEMINI_API_KEY"))
    mid = _env("GEMINI_LITE_MODEL", "gemini-2.0-flash-lite")
    model = genai.GenerativeModel(model_name=mid)
    return model.generate_content(
        contents=f"Rewrite shorter:\n\n{previous}",
        generation_config={"temperature": 0.2},
    )


# REAL: OpenAI Python SDK — responses.create (instructions + input string)
def openai_responses_second_call() -> Any:
    client = OpenAI(api_key=_env("OPENAI_API_KEY"))
    return client.responses.create(
        model=_env("OPENAI_RESPONSES_MODEL_MINI", "gpt-4o-mini"),
        instructions="You only output markdown bullet lists.",
        input="List three signs of a Redis memory pressure issue.",
    )


if __name__ == "__main__":
    # Intentionally empty — fixtures are not executed in CI here.
    pass
