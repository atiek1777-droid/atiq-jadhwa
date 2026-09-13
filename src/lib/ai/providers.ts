/**
 * Provider abstraction for ATIQ AI.
 * Primary: Groq. Fallback: OpenRouter. Both are OpenAI-compatible chat
 * completion APIs, so a single request shape covers them — adding OpenAI,
 * Gemini, or Anthropic later means adding one more entry to `PROVIDERS`,
 * not rewriting the chat route.
 *
 * All keys are read from server-side env vars only (see .env.example) and
 * this module must never be imported from a "use client" file.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ProviderConfig {
  name: string;
  endpoint: string;
  apiKeyEnv: string;
  modelEnv: string;
  defaultModel: string;
}

const PROVIDERS: ProviderConfig[] = [
  {
    name: "groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    apiKeyEnv: "GROQ_API_KEY",
    modelEnv: "GROQ_MODEL",
    defaultModel: "qwen/qwen3.6-27b",
  },
  {
    name: "openrouter",
    endpoint: "https://openrouter.ai/api/v1/chat/completions",
    apiKeyEnv: "OPENROUTER_API_KEY",
    modelEnv: "OPENROUTER_MODEL",
    defaultModel: "qwen/qwen3.6-27b",
  },
];

export class AIProviderError extends Error {
  constructor(message: string, public readonly providersTried: string[]) {
    super(message);
    this.name = "AIProviderError";
  }
}

/**
 * Tries each configured provider in order (Groq, then OpenRouter). A
 * provider is skipped if its API key env var isn't set, so this works
 * correctly even before any key has been added — it just throws
 * AIProviderError, which the API route turns into ai.error from the
 * dictionary rather than a stack trace.
 */
export async function getChatCompletion(
  messages: ChatMessage[],
  opts: { timeoutMs?: number } = {}
): Promise<{ content: string; provider: string }> {
  const timeoutMs = opts.timeoutMs ?? 15_000;
  const tried: string[] = [];

  for (const provider of PROVIDERS) {
    const apiKey = process.env[provider.apiKeyEnv];
    if (!apiKey) continue;
    tried.push(provider.name);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(provider.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env[provider.modelEnv] || provider.defaultModel,
          messages,
          temperature: 0.4,
          max_tokens: 500,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        // Non-2xx (quota, invalid key, model unavailable) — try next provider.
        continue;
      }

      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content === "string" && content.trim().length > 0) {
        return { content, provider: provider.name };
      }
    } catch {
      // Network error or timeout — fall through to next provider.
      continue;
    }
  }

  throw new AIProviderError(
    tried.length === 0
      ? "No AI provider is configured (missing GROQ_API_KEY / OPENROUTER_API_KEY)."
      : "All configured AI providers failed to respond.",
    tried
  );
}
