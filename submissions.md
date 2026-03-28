# OpenClaw FinOps — Registry Submissions Guide

## Smithery.ai

**Status:** Ready to submit. `smithery.yaml` is in the repo root.

**Steps:**
1. Go to https://smithery.ai/submit
2. Enter the GitHub repo URL: `https://github.com/maryadawson-code/openclaw-finops`
3. Smithery will auto-detect `smithery.yaml` and pull the config
4. Verify the listing preview, then publish

**Alternative (CLI):**
```bash
npx @smithery/cli publish openclaw-finops
```

---

## Glama.ai

**Steps:**
1. Go to https://glama.ai/mcp/servers/submit
2. Paste the GitHub repo URL: `https://github.com/maryadawson-code/openclaw-finops`
3. Glama reads `mcp-server.json` from the repo root for metadata
4. Add description: "Cloud deployment cost forecasting for AI agents. Verified pricing for AWS, GCP, and Azure. Revenue-gated with a 25 op/month free tier."

---

## PulseMCP

**Steps:**
1. Go to https://pulsemcp.com/submit
2. Submit the server URL: `https://openclaw-finops.marywomack.workers.dev/mcp`
3. PulseMCP will crawl `/.well-known/mcp` to auto-populate metadata

---

## MCP.so (Community Directory)

**Steps:**
1. Go to https://mcp.so/submit
2. Fill in:
   - Name: OpenClaw FinOps
   - URL: https://openclaw-finops.marywomack.workers.dev/mcp
   - GitHub: https://github.com/maryadawson-code/openclaw-finops
   - Category: DevOps / FinOps
   - Transport: Streamable HTTP (remote)
   - Auth: API Key

---

## GitHub Topics (already applied)

The repo has these topics for GitHub search discoverability:
`mcp-server` `mcp` `model-context-protocol` `agentic-ai` `finops`
`cloud-pricing` `cloudflare-workers` `ai-agents` `llm-tools` `devops`

---

## Submission Checklist

- [ ] Smithery.ai — submit via web or CLI
- [ ] Glama.ai — submit GitHub URL
- [ ] PulseMCP — submit server URL
- [ ] MCP.so — submit listing
- [ ] Hacker News — post from LAUNCH_POSTS.md
- [ ] X/Twitter — post thread from LAUNCH_POSTS.md
- [ ] LinkedIn — post from LAUNCH_POSTS.md
