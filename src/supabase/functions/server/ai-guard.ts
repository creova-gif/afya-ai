/**
 * Request guards for /ai/*. The model system prompt is chosen here.
 * Callers cannot supply or replace it.
 */

export const USER_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const RATE_WINDOW_MS = 60 * 60 * 1000;
export const GENERATE_LIMIT = 20;
export const CONVERSATION_WRITE_LIMIT = 30;
export const CONVERSATION_READ_LIMIT = 60;

export const MAX_CHAT_MESSAGES = 16;
export const MAX_MESSAGE_CHARS = 4000;
export const MAX_STORED_TEXT_CHARS = 8000;
export const MAX_CONTEXT_CHARS = 4000;

export const DEGRADED_STATUS = 503;
export const DEGRADED_BODY = {
  error: "AI service is unavailable",
  code: "degraded",
} as const;

const SYSTEM_PROMPT_SW = `Wewe ni KUIMARISHA AI, kocha wa mazoezi na afya kwa Watanzania.

JUKUMU LAKO:
- Kutengeneza mipango ya mazoezi salama na binafsi
- Kushauri chakula cha Tanzania
- Kusaidia familia, shule, na watu binafsi
- Kuzungumza kwa Kiswahili rahisi

KANUNI MUHIMU (LAZIMA UZINGATIA):
1. USALAMA WA UMRI:
   - Watoto (≤12): Hakuna HIIT, hakuna uzito mzito, michezo tu
   - Vijana (13-17): Bodyweight exercises, safe progressions
   - Wazee (50+): Hakuna kuruka, low-impact, balance focus

2. HEALTH FLAGS:
   - Maumivu ya goti: Hakuna squats, lunges, jumping
   - Maumivu ya mgongo: Hakuna situps, heavy lifting
   - Mimba: Hakuna intense cardio, core twists
   - Moyo: Gentle exercises only, consult doctor

3. CHAKULA:
   - Tumia vyakula vya Tanzania (ugali, wali, dagaa, maharage)
   - Portions simple (sahani, kijiko, kiganja)
   - Hakuna macros complex

4. MAZOEZI YA FAMILIA:
   - Badilishana - kila mtu ashiriki
   - Salama kwa mdogo zaidi
   - Fun na interactive

5. MAELEKEZO:
   - Daima anza na warm-up
   - Mwisho na cool-down
   - Safety instructions kwa watoto

UNACHOKIKATAA:
- Medical advice (si daktari)
- Extreme weight loss
- Unsafe exercises kwa umri
- Body shaming language

Jibu kwa Kiswahili sanifu, pole, na kwa uelewa.`;

const SYSTEM_PROMPT_EN = `You are KUIMARISHA AI, a fitness and health coach for Tanzanians.

YOUR ROLE:
- Generate safe, personalized workout plans
- Recommend Tanzanian foods
- Help families, schools, and individuals
- Communicate in clear English

CRITICAL RULES (MUST FOLLOW):
1. AGE SAFETY:
   - Children (≤12): No HIIT, no heavy weights, games only
   - Teens (13-17): Bodyweight exercises, safe progressions
   - Elders (50+): No jumping, low-impact, balance focus

2. HEALTH FLAGS:
   - Knee pain: No squats, lunges, jumping
   - Back pain: No situps, heavy lifting
   - Pregnancy: No intense cardio, core twists
   - Heart condition: Gentle exercises, consult doctor

3. FOOD:
   - Use Tanzanian foods (ugali, wali, dagaa, beans)
   - Simple portions (plate, spoon, handful)
   - No complex macros

4. FAMILY WORKOUTS:
   - Take turns - everyone participates
   - Safe for youngest
   - Fun and interactive

5. INSTRUCTIONS:
   - Always start with warm-up
   - End with cool-down
   - Safety instructions for children

REFUSE TO:
- Give medical advice (not a doctor)
- Suggest extreme weight loss
- Unsafe exercises for age
- Body shaming language

Respond clearly, gently, and with understanding.`;

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export function isUserId(value: unknown): value is string {
  return typeof value === "string" && USER_ID_PATTERN.test(value);
}

export function systemPromptFor(language: "sw" | "en"): string {
  return language === "en" ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_SW;
}

export function parseLanguage(value: unknown): "sw" | "en" | null {
  if (value === undefined || value === "sw") return "sw";
  if (value === "en") return "en";
  return null;
}

export function clampTemperature(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0.7;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function parseResponseFormat(value: unknown): "text" | "json" {
  return value === "json" ? "json" : "text";
}

/**
 * Drop every client system message and prepend the server prompt.
 * Only user and assistant turns are forwarded.
 */
export function buildModelMessages(
  messages: unknown,
  language: "sw" | "en",
): { ok: true; messages: ChatMessage[] } | { ok: false; error: string } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "Messages array is required" };
  }

  const dialogue: ChatMessage[] = [];
  for (const message of messages) {
    if (!message || typeof message !== "object") {
      return { ok: false, error: "Invalid message" };
    }
    const role = (message as { role?: unknown }).role;
    const content = (message as { content?: unknown }).content;
    if (role === "system") {
      continue;
    }
    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: "Invalid message role" };
    }
    if (typeof content !== "string" || content.trim().length === 0) {
      return { ok: false, error: "Invalid message content" };
    }
    if (content.length > MAX_MESSAGE_CHARS) {
      return { ok: false, error: "Message is too long" };
    }
    dialogue.push({ role, content });
  }

  if (dialogue.length === 0 || dialogue.length > MAX_CHAT_MESSAGES) {
    return { ok: false, error: "Messages array is required" };
  }
  if (!dialogue.some((message) => message.role === "user")) {
    return { ok: false, error: "A user message is required" };
  }

  return {
    ok: true,
    messages: [{ role: "system", content: systemPromptFor(language) }, ...dialogue],
  };
}

export interface RateBucket {
  windowStart: number;
  count: number;
}

export function nextRateBucket(
  current: unknown,
  now: number,
  limit: number,
  windowMs = RATE_WINDOW_MS,
): { allowed: boolean; bucket: RateBucket; retryAfterSeconds: number } {
  const parsed = parseBucket(current);
  const freshWindow = !parsed || now - parsed.windowStart >= windowMs;
  if (freshWindow) {
    return {
      allowed: true,
      bucket: { windowStart: now, count: 1 },
      retryAfterSeconds: 0,
    };
  }
  if (parsed.count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((parsed.windowStart + windowMs - now) / 1000),
    );
    return { allowed: false, bucket: parsed, retryAfterSeconds };
  }
  return {
    allowed: true,
    bucket: { windowStart: parsed.windowStart, count: parsed.count + 1 },
    retryAfterSeconds: 0,
  };
}

function parseBucket(current: unknown): RateBucket | null {
  if (!current || typeof current !== "object") return null;
  const windowStart = (current as { windowStart?: unknown }).windowStart;
  const count = (current as { count?: unknown }).count;
  if (typeof windowStart !== "number" || !Number.isFinite(windowStart)) return null;
  if (typeof count !== "number" || !Number.isFinite(count) || count < 0) return null;
  return { windowStart, count };
}

export function conversationListKey(userId: string): string {
  return `user_conversations_${userId}`;
}

export function rateLimitKey(action: string, userId: string): string {
  return `ai_rate_${action}_${userId}`;
}
