# Changelog

All notable changes to the OpenClaw Integrity Suite are documented here.

**Update model:** OpenClaw runs as remote MCP servers on Cloudflare Workers. Updates deploy automatically — no client-side action needed. Use the Ambassador's `check_for_updates` tool or visit `/.well-known/mcp` on any endpoint to verify you're on the latest version.

---

## [1.1.0] — 2026-03-30

### Added
- **Ambassador Bot** — New MCP server that contextually surfaces OpenClaw tools when developers discuss cloud costs, Terraform, APIs, or vibe coding deployments. Four tools: `check_cloud_cost_risk`, `recommend_openclaw_tool`, `get_install_config`, `check_terraform_risks`. Free, no API key required.
- **One-click installer** (`scripts/install.sh`) — Auto-detects Claude Desktop and Cursor, adds MCP config automatically. Run: `curl -fsSL https://raw.githubusercontent.com/maryadawson-code/openclaw-finops/main/scripts/install.sh | bash`
- **Auto-update version check** — Ambassador `check_for_updates` tool reports current versions across all services and notifies of new features.
- **Expanded platform configs** — `mcp-config.json` now covers 11 platforms: Claude Desktop, Cursor, Windsurf, VS Code Copilot, JetBrains, Claude Code, Zed, Continue.dev, Cline, Aider, OpenAI Agents SDK.
- **Launch execution plan** (`LAUNCH_PLAN.md`) — 7-day phased rollout covering registry submissions, community launch, developer communities, and ecosystem partnerships.
- **Registry submission configs** — Smithery, Glama, PulseMCP, MCP.so, Anthropic Skills, Microsoft Copilot all pre-configured.

### Fixed
- README self-hosting clone URL corrected to actual repository URL.

---

## [1.0.0] — 2026-03-28

### Initial Release
- **FinOps** — Verified cloud pricing oracle for AWS, GCP, and Azure. Tool: `forecast_deployment_cost`. Returns line-item cost breakdowns from a deterministic pricing matrix.
- **API-Bridge** — Live OpenAPI/Swagger spec parser. Fetches real API definitions so agents work with actual endpoints, not hallucinated ones.
- **Guardrail** — IaC security scanner for Terraform, CloudFormation, and Pulumi. Catches public S3 buckets, open SSH, unencrypted databases, and ghost costs before `terraform apply`.
- **Fortress** — Zero-trust live state verification engine. 12 tools for checking deployment health, route parity, accessibility, visual contracts, and rollback automation.
- **Core** — Shared authentication, billing (Stripe 3-tier), usage tracking (Supabase), and referral system (+5 ops per referral).
- **Revenue Gate Pattern** — When free tier users hit their limit, upgrade CTA surfaces inside the AI conversation via MCP `isError: true`, not as an HTTP error.
- **Discovery endpoints** — `/.well-known/mcp`, `/.well-known/ai`, `/.well-known/agent.json`, `/llms.txt`, `/llms-full.txt` on all services.
- **3-tier billing** — Free (25 ops), Pro $29/mo (500 ops), Team $99/mo (2,000 ops), Enterprise $499/mo (50,000 ops). Live Stripe price IDs.
