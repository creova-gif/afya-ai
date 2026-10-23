import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { registerAiRoutes, type CompletionRequest } from "./ai-http.ts";
import { verifySupabaseAccessToken } from "./supabase-auth.ts";

const aiRoutes = new Hono();

registerAiRoutes(aiRoutes, {
  verifyAccessToken: verifySupabaseAccessToken,
  kv,
  getOpenAiApiKey: () => Deno.env.get("OPENAI_API_KEY"),
  completeChat,
});

async function completeChat(request: CompletionRequest) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("AI provider is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: request.messages,
      temperature: request.temperature,
      ...(request.responseFormat === "json"
        ? { response_format: { type: "json_object" } }
        : {}),
    }),
  });

  if (!response.ok) {
    console.error("AI provider request failed");
    throw new Error("AI provider request failed");
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.length === 0) {
    console.error("AI provider returned an empty completion");
    throw new Error("AI provider returned an empty completion");
  }

  return { content, usage: data.usage };
}

export default aiRoutes;
