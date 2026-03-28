#!/usr/bin/env bash
# check-funnel.sh — Query Supabase to show conversion funnel metrics.
# Usage: ./scripts/check-funnel.sh
# Requires: .env with SUPABASE_URL and SUPABASE_SERVICE_KEY

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Load env
if [ -f "$ROOT_DIR/.env" ]; then
  export $(grep -v '^#' "$ROOT_DIR/.env" | xargs)
fi

if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_KEY:-}" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env"
  exit 1
fi

API="${SUPABASE_URL}/rest/v1"
AUTH=(-H "apikey: ${SUPABASE_SERVICE_KEY}" -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}")

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║          OpenClaw Integrity Suite — Funnel Report        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# --- User counts by tier ---
echo "📊 Users by Tier"
echo "─────────────────"
for tier in FREE PRO ENTERPRISE; do
  count=$(curl -s "${API}/users?tier=eq.${tier}&select=user_id" "${AUTH[@]}" \
    -H "Prefer: count=exact" -o /dev/null -w "%{http_code}" 2>/dev/null)

  # Use a different approach — count the array length
  result=$(curl -s "${API}/users?tier=eq.${tier}&select=user_id" "${AUTH[@]}")
  count=$(echo "$result" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null || echo "?")
  printf "  %-12s %s\n" "${tier}:" "${count} users"
done
echo ""

# --- Gate Hits: FREE users at their limit (usage >= monthly_limit) ---
echo "🚧 Gate Hits (users who hit the paywall)"
echo "─────────────────────────────────────────"
gate_hits=$(curl -s "${API}/users?tier=eq.FREE&select=api_key,monthly_usage_count,monthly_limit,referral_code" "${AUTH[@]}")
echo "$gate_hits" | python3 -c "
import sys, json
users = json.load(sys.stdin)
at_limit = [u for u in users if u['monthly_usage_count'] >= u['monthly_limit']]
if not at_limit:
    print('  No users currently at their limit.')
else:
    for u in at_limit:
        key_preview = u['api_key'][:12] + '...'
        print(f\"  {key_preview}  usage: {u['monthly_usage_count']}/{u['monthly_limit']}  ref: {u['referral_code']}\")
    print(f'  Total: {len(at_limit)} users at paywall')
" 2>/dev/null
echo ""

# --- Conversions: upgrade_events ---
echo "💰 Conversions (upgrade events)"
echo "────────────────────────────────"
upgrades=$(curl -s "${API}/upgrade_events?select=*&order=upgraded_at.desc&limit=10" "${AUTH[@]}" 2>/dev/null)
echo "$upgrades" | python3 -c "
import sys, json
events = json.load(sys.stdin)
if not events:
    print('  No upgrades recorded yet.')
else:
    print(f'  Total upgrades: {len(events)} (showing last 10)')
    for e in events:
        print(f\"  {e['upgraded_at'][:19]}  user: {e['user_id'][:8]}...  source: {e['source']}\")
" 2>/dev/null
echo ""

# --- PRO users who might upsell to Enterprise ---
echo "📈 Upsell Candidates (PRO users with high usage)"
echo "──────────────────────────────────────────────────"
pro_users=$(curl -s "${API}/users?tier=eq.PRO&select=api_key,monthly_usage_count,monthly_limit" "${AUTH[@]}")
echo "$pro_users" | python3 -c "
import sys, json
users = json.load(sys.stdin)
hot = [u for u in users if u['monthly_usage_count'] >= u['monthly_limit'] * 0.8]
if not hot:
    print('  No PRO users near their limit.')
else:
    for u in hot:
        key_preview = u['api_key'][:12] + '...'
        pct = round(u['monthly_usage_count'] / max(u['monthly_limit'], 1) * 100)
        print(f\"  {key_preview}  usage: {u['monthly_usage_count']}/{u['monthly_limit']} ({pct}%)\")
    print(f'  {len(hot)} PRO users ready for Enterprise upsell')
" 2>/dev/null
echo ""

echo "───────────────────────────────────────────────────"
echo "  Report generated: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo ""
