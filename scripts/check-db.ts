/**
 * Quick script to verify the Supabase `users` table has our test user.
 * Run with: npx tsx scripts/check-db.ts
 */
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config();

const url = process.env.SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(url, key);

async function main() {
  console.log("--- Querying users table ---");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .limit(10);

  if (error) {
    console.error("Supabase error:", error.message);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("⚠️  No users found. Seeding test user...");
    const { error: insertError } = await supabase.from("users").insert({
      api_key: "test_key_123",
      tier: "FREE",
      monthly_usage_count: 0,
    });
    if (insertError) {
      console.error("Insert error:", insertError.message);
      process.exit(1);
    }
    console.log("✅ Seeded test user with api_key='test_key_123', tier='FREE', usage=0");
  } else {
    console.table(data);
    const testUser = data.find((u: any) => u.api_key === "test_key_123");
    if (testUser) {
      console.log(`✅ Test user found: tier=${testUser.tier}, usage=${testUser.monthly_usage_count}`);
    } else {
      console.log("⚠️  No user with api_key='test_key_123'. Available keys:", data.map((u: any) => u.api_key));
    }
  }
}

main();
