import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface UserRecord {
  user_id: string;
  api_key: string;
  stripe_customer_id: string | null;
  tier: "FREE" | "PRO";
  monthly_usage_count: number;
}

export function getSupabaseClient(url: string, key: string): SupabaseClient {
  return createClient(url, key);
}

export async function getUserByApiKey(
  supabase: SupabaseClient,
  apiKey: string
): Promise<UserRecord | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("api_key", apiKey)
    .single();

  if (error || !data) return null;
  return data as UserRecord;
}

export async function incrementUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  // Atomic increment via raw SQL RPC if available, otherwise read-then-write.
  const { error: rpcError } = await supabase.rpc("increment_usage", { uid: userId });

  if (rpcError) {
    // Fallback: fetch current count → write +1 (acceptable for low-contention dev/test)
    const { data } = await supabase
      .from("users")
      .select("monthly_usage_count")
      .eq("user_id", userId)
      .single();

    const current = data?.monthly_usage_count ?? 0;
    await supabase
      .from("users")
      .update({ monthly_usage_count: current + 1 })
      .eq("user_id", userId);
  }
}

export async function upgradeUser(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  await supabase
    .from("users")
    .update({ tier: "PRO", monthly_usage_count: 0 })
    .eq("user_id", userId);
}
