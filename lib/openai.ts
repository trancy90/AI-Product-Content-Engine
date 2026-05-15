import OpenAI from "openai";

let singleton: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (singleton) return singleton;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set.");
  }

  singleton = new OpenAI({ apiKey });
  return singleton;
}
