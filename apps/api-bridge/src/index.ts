import { Hono } from "hono";
import {
  getSupabaseClient,
  authenticateAndCheckLimits,
  extractApiKey,
  extractReferralCode,
  handleStripeWebhook,
} from "@openclaw/core";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  RESEND_API_KEY?: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) =>
  c.json({ status: "ok", service: "openclaw-api-bridge", suite: "openclaw", ready: false })
);

// MCP endpoint — placeholder for Tool B
app.post("/mcp", async (c) => {
  const supabase = getSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY);
  const apiKey = extractApiKey(c.req.raw.headers);
  const referralCode = extractReferralCode(c.req.raw.headers);
  const authResult = await authenticateAndCheckLimits(supabase, apiKey, referralCode);

  if (!authResult.ok) {
    return c.json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32001, message: authResult.message },
    }, authResult.reason === "rate_limited" ? 200 : 401);
  }

  // TODO: Implement API-Bridge MCP server and tool registration
  return c.json({
    jsonrpc: "2.0",
    id: null,
    error: { code: -32601, message: "API-Bridge tools not yet implemented." },
  });
});

// Stripe webhook — shared handler
app.post("/api/webhook/stripe", async (c) => {
  const sig = c.req.header("stripe-signature");
  if (!sig) return c.json({ error: "Missing stripe-signature header" }, 400);
  const rawBody = await c.req.text();
  const result = await handleStripeWebhook(rawBody, sig, {
    STRIPE_SECRET_KEY: c.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: c.env.STRIPE_WEBHOOK_SECRET,
    SUPABASE_URL: c.env.SUPABASE_URL,
    SUPABASE_SERVICE_KEY: c.env.SUPABASE_SERVICE_KEY,
    RESEND_API_KEY: c.env.RESEND_API_KEY,
  });
  if (!result.ok) return c.json({ error: result.error }, 400);
  return c.json({ received: true });
});

export default app;
