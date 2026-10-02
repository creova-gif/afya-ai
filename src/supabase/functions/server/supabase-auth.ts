import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import { isUserId } from "./ai-guard.ts";

function bearerToken(authorization: string | undefined): string | null {
  if (!authorization) return null;
  const match = /^Bearer\s+(\S+)$/i.exec(authorization.trim());
  return match ? match[1] : null;
}

/**
 * Validates a Supabase access token with Auth. The user id comes from that
 * check, not from the request body or path.
 * Fails closed when Supabase URL / anon key are unset or Auth rejects the token.
 */
export async function verifySupabaseAccessToken(
  authorization: string | undefined,
): Promise<{ id: string } | null> {
  const token = bearerToken(authorization);
  if (!token) return null;

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anonKey) {
    console.error("Supabase auth is not configured");
    return null;
  }

  try {
    const supabase = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(token);
    const id = data.user?.id;
    if (error || !isUserId(id)) return null;
    return { id };
  } catch {
    console.error("Supabase JWT verification failed");
    return null;
  }
}
