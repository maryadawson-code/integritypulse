import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
  const { error } = await sb.from("users").update({ monthly_usage_count: 24 }).eq("api_key", "test_key_123");
  if (error) { console.error(error); process.exit(1); }
  const { data } = await sb.from("users").select("monthly_usage_count, tier").eq("api_key", "test_key_123").single();
  console.log("Reset complete:", JSON.stringify(data));
}

main();
