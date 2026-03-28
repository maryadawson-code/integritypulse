import Stripe from "stripe";
import { getSupabaseClient, upgradeUser } from "./supabase.js";
import { sendProWelcomeEmail } from "./email.js";

const ENTERPRISE_PRICE_ID = "price_1TG19DJ8qAPoi4y2q08hGQzo";

export interface StripeEnv {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  RESEND_API_KEY?: string;
}

/**
 * Shared Stripe webhook handler for all OpenClaw servers.
 * Verifies the signature, processes checkout.session.completed,
 * upgrades the user, and sends the welcome email.
 */
export async function handleStripeWebhook(
  rawBody: string,
  signature: string,
  env: StripeEnv
): Promise<{ ok: boolean; error?: string }> {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return { ok: false, error: "Webhook signature verification failed" };
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (userId) {
      const supabase = getSupabaseClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
      const priceId = session.metadata?.price_id;
      const tier = priceId === ENTERPRISE_PRICE_ID ? "ENTERPRISE" as const : "PRO" as const;

      const upgradedUser = await upgradeUser(supabase, userId, tier);

      if (upgradedUser && session.customer_email) {
        await sendProWelcomeEmail(
          {
            to: session.customer_email,
            userName: session.customer_email.split("@")[0],
            apiKey: upgradedUser.api_key,
            referralCode: upgradedUser.referral_code,
          },
          env.RESEND_API_KEY
        );
      }
    }
  }

  return { ok: true };
}
