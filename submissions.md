# OpenClaw Integrity Suite — Registry & Store Submissions Guide

**Goal:** Get listed in every MCP registry, AI tool store, and developer marketplace where vibe coders discover tools.

---

## MCP Registries (Primary — Submit First)

### 1. Smithery.ai
**Status:** Config ready (`smithery.yaml`)
**Steps:**
1. Go to https://smithery.ai/submit
2. Enter repo URL: `https://github.com/maryadawson-code/openclaw-finops`
3. Smithery auto-detects `smithery.yaml` — verify and publish
**Alternative:** `npx @smithery/cli publish openclaw-finops`

### 2. Glama.ai
**Status:** Config ready (`mcp-server.json`)
**Steps:**
1. Go to https://glama.ai/mcp/servers/submit
2. Paste repo URL: `https://github.com/maryadawson-code/openclaw-finops`
3. Glama reads `mcp-server.json` for metadata
4. Description: "Stop AI agents from hallucinating cloud costs. Verified pricing for AWS, GCP, Azure. Free 25 ops/month."

### 3. MCP.so (Community Directory)
**Steps:**
1. Go to https://mcp.so/submit
2. Fill in:
   - Name: OpenClaw Integrity Suite
   - URL: https://openclaw-finops.marywomack.workers.dev/mcp
   - GitHub: https://github.com/maryadawson-code/openclaw-finops
   - Category: DevOps / FinOps
   - Transport: Streamable HTTP (remote)
   - Auth: API Key

### 4. PulseMCP
**Steps:**
1. Go to https://pulsemcp.com/submit
2. Submit server URL: `https://openclaw-finops.marywomack.workers.dev/mcp`
3. PulseMCP crawls `/.well-known/mcp` to auto-populate

### 5. mcp.run
**Steps:**
1. Go to https://mcp.run
2. Submit as a remote MCP server
3. Include all five endpoints (FinOps, API-Bridge, Guardrail, Fortress, Ambassador)

### 6. mcpservers.org
**Steps:**
1. Go to https://mcpservers.org
2. Submit GitHub repo URL
3. Tags: finops, cloud-pricing, security, terraform, vibe-coding

---

## AI Platform Stores

### 7. Anthropic Skills Repository
**Status:** Config ready (`skills/openclaw-finops/SKILL.md`, `skills/openclaw-ambassador/SKILL.md`)
**Steps:**
1. Fork https://github.com/anthropics/skills
2. Copy `skills/openclaw-finops/` and `skills/openclaw-ambassador/` directories
3. Open PR: "Add openclaw-finops and openclaw-ambassador: Cloud cost + security tools via MCP"
4. Highlight: Revenue Gate pattern, 13x pricing hallucination stat, free tier

### 8. Microsoft 365 Copilot / Teams
**Status:** Config ready (`copilot/declarativeAgent.json`, `copilot/openclaw-finops-plugin.json`)
**Steps:**
1. Create `openapi.yaml` wrapping the MCP endpoint as REST
2. Package as Teams app: manifest.json + declarativeAgent.json + plugin + OpenAPI spec
3. Submit via Microsoft Partner Center or Teams Developer Portal
4. When Microsoft adds native MCP support, `/.well-known/mcp` handles discovery

### 9. VS Code Marketplace
**Steps:**
1. Create a VS Code extension that pre-configures OpenClaw MCP servers
2. Extension adds servers to `.vscode/mcp.json` on install
3. Publish to VS Code Marketplace under category "AI" / "Other"
4. One-click install from VS Code

### 10. JetBrains Marketplace
**Steps:**
1. Create a JetBrains plugin that adds OpenClaw to AI Assistant MCP config
2. Publish to JetBrains Marketplace
3. Compatible with IntelliJ, WebStorm, PyCharm, GoLand, Rider, etc.

---

## Developer Communities & Directories

### 11. GitHub Topics (Already Applied)
The repo should have these topics:
`mcp-server` `mcp` `model-context-protocol` `agentic-ai` `finops`
`cloud-pricing` `cloudflare-workers` `ai-agents` `llm-tools` `devops`
`vibe-coding` `cloud-cost` `terraform` `infrastructure-as-code`

### 12. FinOps Foundation Landscape
**Steps:**
1. Go to https://www.finops.org/landscape/
2. Submit OpenClaw as a FinOps tool
3. Category: Cloud Cost Management / AI-Assisted

### 13. CNCF Landscape
**Steps:**
1. Open a PR at https://github.com/cncf/landscape
2. Category: Observability and Analysis > Cost Management
3. Include logo, description, GitHub URL

### 14. Product Hunt
**Steps:**
1. Create a Product Hunt listing
2. Tagline: "Stop AI agents from hallucinating your cloud bill"
3. Schedule launch for Tuesday (highest traffic day)
4. Include demo video showing 13x pricing hallucination caught

### 15. Awesome MCP Servers Lists
**Steps:**
1. Find and PR into awesome-mcp-servers lists on GitHub
2. Search for: `awesome-mcp`, `awesome-model-context-protocol`
3. Add under DevOps/FinOps category

---

## AAIF (Agentic AI Foundation)
**Status:** Awaiting registry launch
**Preparation complete:**
- `/.well-known/ai` follows IETF draft-aiendpoint-ai-discovery-00
- `/.well-known/mcp` follows SEP-1960 conventions
- `/.well-known/agent.json` follows Google A2A spec
- Revenue Gate pattern documented as a reusable standard
**Action:** Monitor https://aaif.io/ and https://github.com/modelcontextprotocol/ for registry announcements

---

## Submission Checklist

### MCP Registries
- [ ] Smithery.ai — submit via web or CLI
- [ ] Glama.ai — submit GitHub URL
- [ ] MCP.so — submit listing
- [ ] PulseMCP — submit server URL
- [ ] mcp.run — submit remote server
- [ ] mcpservers.org — submit repo URL

### AI Platform Stores
- [ ] Anthropic Skills — fork repo, copy skills/, open PR
- [ ] Microsoft Copilot — package as Teams app
- [ ] VS Code Marketplace — create extension
- [ ] JetBrains Marketplace — create plugin

### Developer Directories
- [ ] GitHub Topics — verify all topics applied
- [ ] FinOps Foundation — submit to landscape
- [ ] CNCF Landscape — submit PR
- [ ] Product Hunt — create and schedule launch
- [ ] Awesome MCP lists — find and PR into all

### Community Launch
- [ ] Hacker News — Show HN post (Tue/Wed 9-10am EST)
- [ ] X/Twitter — thread from LAUNCH_POSTS.md
- [ ] LinkedIn — post from LAUNCH_POSTS.md
- [ ] Reddit — r/MCP, r/devops, r/aws, r/vibecoding
- [ ] Discord — Anthropic, Cursor, Cloudflare channels
- [ ] Dev.to/Hashnode — "Revenue-Gated MCP" technical article

### Monitoring
- [ ] AAIF — submit when portal opens
- [ ] Microsoft native MCP — activate when supported
