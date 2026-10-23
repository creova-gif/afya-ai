import {
  CONVERSATION_READ_LIMIT,
  CONVERSATION_WRITE_LIMIT,
  DEGRADED_BODY,
  DEGRADED_STATUS,
  GENERATE_LIMIT,
  MAX_CONTEXT_CHARS,
  MAX_STORED_TEXT_CHARS,
  buildModelMessages,
  clampTemperature,
  conversationListKey,
  isUserId,
  nextRateBucket,
  parseLanguage,
  parseResponseFormat,
  rateLimitKey,
  type ChatMessage,
} from "./ai-guard.ts";

export interface AuthedUser {
  id: string;
}

export interface AiKv {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: unknown) => Promise<void>;
  mget: (keys: string[]) => Promise<unknown[]>;
}

export interface CompletionRequest {
  messages: ChatMessage[];
  temperature: number;
  responseFormat: "text" | "json";
}

export interface CompletionResult {
  content: string;
  usage?: unknown;
}

export interface AiDeps {
  verifyAccessToken: (authorization: string | undefined) => Promise<AuthedUser | null>;
  kv: AiKv;
  getOpenAiApiKey: () => string | undefined;
  completeChat: (request: CompletionRequest) => Promise<CompletionResult>;
  now?: () => number;
}

interface AiContext {
  req: {
    json(): Promise<unknown>;
    param(name: string): string;
    query(name: string): string | undefined;
    header(name: string): string | undefined;
  };
  json(body: unknown, status?: number, headers?: Record<string, string>): Response;
  set(key: string, value: unknown): void;
  get(key: string): unknown;
}

interface AiApp {
  use(
    path: string,
    handler: (c: AiContext, next: () => Promise<void>) => Promise<Response | void>,
  ): void;
  post(path: string, handler: (c: AiContext) => Promise<Response>): void;
  get(path: string, handler: (c: AiContext) => Promise<Response>): void;
}

const UNAUTHORIZED = { error: "Authentication required", code: "unauthorized" };
const FORBIDDEN = { error: "Forbidden", code: "forbidden" };

export function registerAiRoutes(app: AiApp, deps: AiDeps): void {
  app.use("*", async (c, next) => {
    let user: AuthedUser | null = null;
    try {
      user = await deps.verifyAccessToken(c.req.header("Authorization"));
    } catch {
      user = null;
    }
    if (!user || !isUserId(user.id)) {
      return c.json(UNAUTHORIZED, 401);
    }
    c.set("userId", user.id);
    await next();
  });

  app.post("/generate", (c) => handleGenerate(c, deps));
  app.post("/conversation", (c) => handleSaveConversation(c, deps));
  app.get("/conversation/:userId", (c) => handleGetConversation(c, deps));
}

async function handleGenerate(c: AiContext, deps: AiDeps): Promise<Response> {
  const userId = requiredUserId(c);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  if (!body || typeof body !== "object") {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  const record = body as {
    messages?: unknown;
    language?: unknown;
    temperature?: unknown;
    responseFormat?: unknown;
  };
  const language = parseLanguage(record.language);
  if (!language) {
    return c.json({ error: "language must be sw or en" }, 400);
  }
  const built = buildModelMessages(record.messages, language);
  if (!built.ok) {
    return c.json({ error: built.error }, 400);
  }

  if (!deps.getOpenAiApiKey()) {
    return c.json(DEGRADED_BODY, DEGRADED_STATUS);
  }

  const limited = await consumeLimit(c, deps, userId, "generate", GENERATE_LIMIT);
  if (limited) return limited;

  try {
    const result = await deps.completeChat({
      messages: built.messages,
      temperature: clampTemperature(record.temperature),
      responseFormat: parseResponseFormat(record.responseFormat),
    });
    if (typeof result?.content !== "string" || result.content.length === 0) {
      return c.json(DEGRADED_BODY, DEGRADED_STATUS);
    }
    return c.json({
      message: result.content,
      usage: result.usage ?? null,
    });
  } catch {
    return c.json(DEGRADED_BODY, DEGRADED_STATUS);
  }
}

async function handleSaveConversation(c: AiContext, deps: AiDeps): Promise<Response> {
  const userId = requiredUserId(c);
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  if (!body || typeof body !== "object") {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
  const record = body as {
    userId?: unknown;
    user_message?: unknown;
    ai_response?: unknown;
    context?: unknown;
  };

  if (record.userId !== undefined && record.userId !== userId) {
    return c.json(FORBIDDEN, 403);
  }
  if (typeof record.user_message !== "string" || record.user_message.trim().length === 0) {
    return c.json({ error: "user_message and ai_response are required" }, 400);
  }
  if (typeof record.ai_response !== "string" || record.ai_response.trim().length === 0) {
    return c.json({ error: "user_message and ai_response are required" }, 400);
  }
  if (
    record.user_message.length > MAX_STORED_TEXT_CHARS ||
    record.ai_response.length > MAX_STORED_TEXT_CHARS
  ) {
    return c.json({ error: "Conversation text is too long" }, 400);
  }

  let context: unknown = {};
  if (record.context !== undefined) {
    if (!record.context || typeof record.context !== "object" || Array.isArray(record.context)) {
      return c.json({ error: "Invalid context" }, 400);
    }
    const encoded = JSON.stringify(record.context);
    if (encoded.length > MAX_CONTEXT_CHARS) {
      return c.json({ error: "Context is too long" }, 400);
    }
    context = record.context;
  }

  const limited = await consumeLimit(c, deps, userId, "conversation_write", CONVERSATION_WRITE_LIMIT);
  if (limited) return limited;

  const now = deps.now?.() ?? Date.now();
  const conversationId = `conv_${userId}_${now}_${crypto.randomUUID()}`;
  const conversationData = {
    id: conversationId,
    user_id: userId,
    user_message: record.user_message,
    ai_response: record.ai_response,
    context,
    created_at: new Date(now).toISOString(),
  };

  try {
    await deps.kv.set(conversationId, conversationData);
    const listKey = conversationListKey(userId);
    const existing = await deps.kv.get(listKey);
    const previous = Array.isArray(existing)
      ? existing.filter((item): item is string => typeof item === "string")
      : [];
    await deps.kv.set(listKey, [conversationId, ...previous.slice(0, 49)]);
  } catch {
    return c.json({ error: "Failed to save conversation" }, 500);
  }

  return c.json({ success: true, conversationId });
}

async function handleGetConversation(c: AiContext, deps: AiDeps): Promise<Response> {
  const userId = requiredUserId(c);
  const pathUserId = c.req.param("userId");
  if (pathUserId !== userId) {
    return c.json(FORBIDDEN, 403);
  }

  const limited = await consumeLimit(c, deps, userId, "conversation_read", CONVERSATION_READ_LIMIT);
  if (limited) return limited;

  const rawLimit = Number.parseInt(c.req.query("limit") || "20", 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 50) : 20;

  try {
    const existing = await deps.kv.get(conversationListKey(userId));
    const conversationIds = Array.isArray(existing)
      ? existing.filter((item): item is string => typeof item === "string").slice(0, limit)
      : [];
    if (conversationIds.length === 0) {
      return c.json({ conversations: [] });
    }
    const conversations = await deps.kv.mget(conversationIds);
    return c.json({ conversations });
  } catch {
    return c.json({ error: "Failed to get conversation history" }, 500);
  }
}

function requiredUserId(c: AiContext): string {
  const userId = c.get("userId");
  if (!isUserId(userId)) {
    throw new Error("Authenticated user is missing");
  }
  return userId;
}

async function consumeLimit(
  c: AiContext,
  deps: AiDeps,
  userId: string,
  action: string,
  limit: number,
): Promise<Response | null> {
  const key = rateLimitKey(action, userId);
  const now = deps.now?.() ?? Date.now();
  let current: unknown;
  try {
    current = await deps.kv.get(key);
  } catch {
    return c.json({ error: "Service unavailable", code: "unavailable" }, 503);
  }
  const decision = nextRateBucket(current, now, limit);
  if (!decision.allowed) {
    return c.json(
      { error: "Rate limit exceeded", code: "rate_limited" },
      429,
      { "Retry-After": String(decision.retryAfterSeconds) },
    );
  }
  try {
    await deps.kv.set(key, decision.bucket);
  } catch {
    return c.json({ error: "Service unavailable", code: "unavailable" }, 503);
  }
  return null;
}
