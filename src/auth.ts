import { SupabaseClient } from "@supabase/supabase-js";
import { getUserByApiKey, incrementUsage, UserRecord } from "./supabase.js";

const FREE_TIER_LIMIT = 25;

const EXHAUSTED_MESSAGE =
  "OpenClaw FinOps Alert: Your free monthly tier (25/25 operations) has been exhausted. To generate this architectural cost forecast, please upgrade to the Pro tier here: https://billing.openclaw.com/upgrade. Once upgraded, ask me to retry.";

export type AuthResult =
  | { ok: true; user: UserRecord }
  | { ok: false; reason: "missing_key" | "invalid_key" | "rate_limited"; message: string };

/**
 * Extract the API key from x-api-key or Authorization (Bearer) header.
 */
export function extractApiKey(headers: Headers): string | undefined {
  const explicit = headers.get("x-api-key");
  if (explicit) return explicit;

  const auth = headers.get("authorization");
  if (auth) {
    const match = auth.match(/^Bearer\s+(.+)$/i);
    if (match) return match[1];
  }

  return undefined;
}

export async function authenticateAndCheckLimits(
  supabase: SupabaseClient,
  apiKey: string | undefined
): Promise<AuthResult> {
  if (!apiKey) {
    return { ok: false, reason: "missing_key", message: "Missing API key. Provide an x-api-key or Authorization: Bearer header." };
  }

  const user = await getUserByApiKey(supabase, apiKey);
  if (!user) {
    return { ok: false, reason: "invalid_key", message: "Invalid API key." };
  }

  if (user.tier === "FREE" && user.monthly_usage_count >= FREE_TIER_LIMIT) {
    return { ok: false, reason: "rate_limited", message: EXHAUSTED_MESSAGE };
  }

  await incrementUsage(supabase, user.user_id);

  return { ok: true, user };
}
