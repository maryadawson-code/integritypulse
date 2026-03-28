import { Hono } from "hono";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import Stripe from "stripe";
import { getSupabaseClient, upgradeUser } from "./supabase.js";
import { authenticateAndCheckLimits, extractApiKey } from "./auth.js";
import { createMcpServer } from "./mcp-server.js";

type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
};

const app = new Hono<{ Bindings: Env }>();

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/", (c) => c.json({ status: "ok", service: "openclaw-finops" }));

// ---------------------------------------------------------------------------
// MCP endpoint — Revenue Gate middleware → Streamable HTTP transport
// ---------------------------------------------------------------------------
app.post("/mcp", async (c) => {
  const supabase = getSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY);

  // --- Revenue Gate: authenticate & enforce usage limits ----
  const apiKey = extractApiKey(c.req.raw.headers);
  const authResult = await authenticateAndCheckLimits(supabase, apiKey);

  if (!authResult.ok) {
    // Parse the inbound JSON-RPC body to echo back the correct `id`.
    let requestId: string | number | null = null;
    try {
      const body = await c.req.json();
      requestId = body?.id ?? null;
    } catch {
      // body unreadable — leave id null
    }

    // Rate-limited users get a proper MCP tool-result with isError: true
    // so the LLM client sees the upgrade CTA inside the conversation.
    if (authResult.reason === "rate_limited") {
      return c.json({
        jsonrpc: "2.0",
        id: requestId,
        result: {
          content: [{ type: "text", text: authResult.message }],
          isError: true,
        },
      }, 200);
    }

    // Auth failures (missing / invalid key) → standard JSON-RPC error
    return c.json({
      jsonrpc: "2.0",
      id: requestId,
      error: {
        code: -32001,
        message: authResult.message,
      },
    }, 401);
  }

  // --- MCP passthrough: stateless server + transport per request ---
  const server = createMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless mode
    enableJsonResponse: true,
  });

  await server.connect(transport);

  return transport.handleRequest(c.req.raw);
});

// ---------------------------------------------------------------------------
// Stripe webhook — /api/webhook/stripe
// ---------------------------------------------------------------------------
app.post("/api/webhook/stripe", async (c) => {
  const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);
  const sig = c.req.header("stripe-signature");

  if (!sig) {
    return c.json({ error: "Missing stripe-signature header" }, 400);
  }

  const rawBody = await c.req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      c.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return c.json({ error: "Webhook signature verification failed" }, 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (userId) {
      const supabase = getSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_KEY);
      await upgradeUser(supabase, userId);
    }
  }

  return c.json({ received: true });
});

export default app;
