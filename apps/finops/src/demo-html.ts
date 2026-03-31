export const DEMO_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>OpenClaw Integrity Suite — See It In Action</title>
<meta property="og:title" content="OpenClaw: 4 tools that stop AI agents from making expensive mistakes">
<meta property="og:description" content="Watch AI agents get verified cloud pricing, real API specs, security audits, and ghost cost detection.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://openclaw-finops.marywomack.workers.dev/demo">
<meta name="twitter:card" content="summary_large_image">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#cdd6f4;overflow-x:hidden}
code,.mono{font-family:'SF Mono',Monaco,'Cascadia Code',monospace}

.hero{text-align:center;padding:48px 24px 0}
.hero h1{font-size:2.2rem;font-weight:800;color:#fff;margin-bottom:8px}
.hero h1 span{color:#f97316}
.hero p{color:#a0a0a0;font-size:1.05rem;max-width:560px;margin:0 auto 32px}

.scene-nav{display:flex;justify-content:center;gap:8px;margin-bottom:32px;flex-wrap:wrap;padding:0 16px}
.scene-tab{background:#1a1a2e;border:1px solid #333;color:#999;padding:8px 18px;border-radius:9999px;cursor:pointer;font-size:13px;font-weight:600;transition:all .2s}
.scene-tab:hover{border-color:#f97316;color:#f97316}
.scene-tab.active{background:#f97316;color:#000;border-color:#f97316}

.screen{width:min(900px,calc(100vw - 48px));margin:0 auto;border-radius:16px;overflow:hidden;box-shadow:0 20px 80px rgba(0,0,0,.6);position:relative}
.titlebar{background:#181825;height:36px;display:flex;align-items:center;padding:0 16px;gap:8px}
.dot{width:12px;height:12px;border-radius:50%}
.dot.r{background:#f38ba8}.dot.y{background:#f9e2af}.dot.g{background:#a6e3a1}
.titlebar-text{color:#6c7086;font-size:12px;margin-left:auto;margin-right:auto;font-family:'SF Mono',Monaco,monospace}
.chat{background:#1e1e2e;min-height:440px;padding:24px 28px;position:relative;overflow:hidden}

.msg{opacity:0;transform:translateY(10px);margin-bottom:14px}
.msg.show{opacity:1;transform:translateY(0);transition:opacity .4s ease,transform .4s ease}

.user-msg{display:flex;justify-content:flex-end}
.user-bubble{background:#45475a;color:#cdd6f4;padding:11px 16px;border-radius:16px 16px 4px 16px;max-width:480px;font-size:13.5px;line-height:1.5}

.bot-msg{display:flex;gap:10px}
.avatar{width:26px;height:26px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#000;flex-shrink:0;margin-top:2px}
.av-fin{background:linear-gradient(135deg,#f97316,#ea580c)}
.av-api{background:linear-gradient(135deg,#8b5cf6,#6d28d9)}
.av-grd{background:linear-gradient(135deg,#ef4444,#dc2626)}
.av-frt{background:linear-gradient(135deg,#06b6d4,#0891b2)}
.bot-bubble{background:#181825;border:1px solid #313244;color:#cdd6f4;padding:14px 18px;border-radius:4px 16px 16px 16px;max-width:580px;font-size:13px;line-height:1.6}

.tool-call{background:#1a1a2e;border:1px solid #f9731640;border-radius:8px;padding:8px 12px;margin:6px 0;font-size:11px;color:#f97316;font-family:'SF Mono',Monaco,monospace}
.tool-label{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#f9731660;margin-bottom:3px}
.badge{display:inline-block;font-size:9px;font-weight:700;padding:2px 7px;border-radius:9999px;margin-left:6px}
.badge-fin{background:#f9731620;color:#f97316}
.badge-api{background:#8b5cf620;color:#8b5cf6}
.badge-grd{background:#ef444420;color:#ef4444}
.badge-frt{background:#06b6d420;color:#06b6d4}

table{width:100%;border-collapse:collapse;margin:10px 0;font-size:11.5px;font-family:'SF Mono',Monaco,monospace}
th{text-align:left;padding:5px 8px;border-bottom:2px solid #f97316;color:#f97316;font-weight:600;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
td{padding:5px 8px;border-bottom:1px solid #252535;color:#bac2de}
.cost-col{text-align:right;font-weight:600}
.total-row td{border-top:2px solid #333;font-weight:700;font-size:13px;color:#f97316;padding-top:8px}

.hl{color:#f38ba8;text-decoration:line-through;opacity:.7}
.ok{color:#a6e3a1;font-weight:700}
.warn{color:#f9e2af}
.crit{color:#f38ba8;font-weight:700}
.tag{display:inline-block;font-size:10px;font-weight:700;padding:2px 6px;border-radius:4px;margin-right:4px}
.tag-crit{background:#f38ba820;color:#f38ba8}
.tag-high{background:#fab38720;color:#fab387}
.tag-med{background:#f9e2af20;color:#f9e2af}

.gate{background:linear-gradient(135deg,#1a1a2e,#1e1025);border:1px solid #f9731650;border-radius:10px;padding:14px 16px;margin:8px 0}
.gate-title{color:#f97316;font-weight:700;font-size:13px;margin-bottom:6px}
.gate p{font-size:12px;color:#a0a0a0;margin-bottom:4px}
.gate a{color:#f97316;font-weight:600}

.progress{position:absolute;bottom:0;left:0;height:3px;background:#f97316;width:0%;transition:width .3s linear}

.cta-section{text-align:center;padding:40px 24px 56px}
.cta-section h2{font-size:1.5rem;color:#fff;margin-bottom:8px}
.cta-section p{color:#888;margin-bottom:24px;font-size:.95rem}
.btn{display:inline-block;background:#f97316;color:#000;font-weight:700;padding:14px 32px;border-radius:9999px;font-size:1rem;text-decoration:none;margin:6px;transition:opacity .2s}
.btn:hover{opacity:.85}
.btn-outline{background:transparent;border:2px solid #f97316;color:#f97316}
.install-box{max-width:520px;margin:24px auto 0;background:#111;border:1px solid #333;border-radius:10px;padding:16px;font-family:'SF Mono',Monaco,monospace;font-size:12px;color:#a6e3a1;text-align:left;position:relative}
.install-box .copy-btn{position:absolute;top:10px;right:10px;background:#333;border:1px solid #555;color:#ccc;padding:4px 10px;border-radius:6px;font-size:11px;cursor:pointer}
.install-box .copy-btn:hover{background:#444}
footer{text-align:center;padding:0 24px 32px;color:#555;font-size:.8rem}
</style>
</head>
<body>

<div class="hero">
  <h1>The <span>Integrity Layer</span> for AI Agents</h1>
  <p>Four tools. One API key. Watch what happens when AI agents get grounded in reality.</p>
</div>

<div class="scene-nav">
  <div class="scene-tab active" onclick="switchScene(0)">FinOps</div>
  <div class="scene-tab" onclick="switchScene(1)">API-Bridge</div>
  <div class="scene-tab" onclick="switchScene(2)">Guardrail</div>
  <div class="scene-tab" onclick="switchScene(3)">Fortress</div>
  <div class="scene-tab" onclick="switchScene(4)">Revenue Gate</div>
</div>

<div class="screen">
  <div class="titlebar">
    <div class="dot r"></div><div class="dot y"></div><div class="dot g"></div>
    <span class="titlebar-text" id="titletext">Claude Desktop</span>
  </div>
  <div class="chat" id="chat"></div>
  <div class="progress" id="progress"></div>
</div>

<div class="cta-section">
  <h2>Stop hallucinations. Start shipping.</h2>
  <p>Free tier: 25 ops/month. No credit card. Set up in 30 seconds.</p>
  <a href="https://github.com/maryadawson-code/openclaw-finops" class="btn">Get Free API Key</a>
  <a href="/try" class="btn btn-outline">Try It Live</a>
  <div class="install-box">
    <button class="copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.textContent);this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',1500)">Copy</button>
    <pre>{
  "mcpServers": {
    "openclaw-finops": {
      "type": "streamable-http",
      "url": "https://openclaw-finops.marywomack.workers.dev/mcp",
      "headers": { "x-api-key": "YOUR_KEY" }
    }
  }
}</pre>
  </div>
</div>

<footer>
  OpenClaw Integrity Suite &mdash; MIT Licensed &mdash; Built by <a href="https://missionmeetstech.com" style="color:#f97316">Mission Meets Tech</a>
</footer>

<script>
const SCENES = [
  // Scene 0: FinOps
  {
    title: "openclaw-finops",
    messages: [
      {type:'user', text:'What would it cost to run our API on AWS with an m5.large, managed Postgres, and Redis?'},
      {type:'bot', avatar:'fin', html:'<div class="tool-call"><div class="tool-label">Tool Call</div>forecast_deployment_cost<span class="badge badge-fin">openclaw-finops</span></div>'},
      {type:'bot', avatar:'fin', html:'<div style="font-size:12px;color:#a6adc8;margin-bottom:8px">An LLM would estimate: <span class="hl">~$45/month</span>. Here\\'s the verified pricing:</div><table><tr><th>Service</th><th>Category</th><th>Hours</th><th class="cost-col">Cost</th></tr><tr class="anim-row"><td>m5.large</td><td>Compute</td><td>730</td><td class="cost-col">$70.08</td></tr><tr class="anim-row"><td>rds.postgres.db.m5.large</td><td>Database</td><td>730</td><td class="cost-col">$204.40</td></tr><tr class="anim-row"><td>elasticache.redis.t3.micro</td><td>Cache</td><td>730</td><td class="cost-col">$11.68</td></tr><tr class="anim-row total-row"><td colspan="3">Total Estimated Monthly Cost</td><td class="cost-col">$286.16</td></tr></table><div style="font-size:12px;color:#f38ba8;margin-top:4px">That\\'s <strong>6.4x more</strong> than the LLM hallucinated. This is what hits your AWS bill.</div>'},
    ]
  },
  // Scene 1: API-Bridge
  {
    title: "openclaw-api-bridge",
    messages: [
      {type:'user', text:'Parse the Stripe API spec and show me the endpoints for creating charges.'},
      {type:'bot', avatar:'api', html:'<div class="tool-call"><div class="tool-label">Tool Call</div>bridge_api_spec<span class="badge badge-api">openclaw-api-bridge</span></div><div style="color:#6c7086;font-size:11px;margin-top:4px">Fetching live OpenAPI spec from api.stripe.com...</div>'},
      {type:'bot', avatar:'api', html:'<div style="font-size:12px;color:#a6adc8;margin-bottom:8px">Without API-Bridge, I would have <span class="hl">guessed endpoints that don\\'t exist</span>. Here\\'s the real spec:</div><table><tr><th>Endpoint</th><th>Method</th><th>Description</th></tr><tr class="anim-row"><td style="color:#8b5cf6;font-family:monospace;font-size:11px">/v1/charges</td><td><span class="tag" style="background:#a6e3a120;color:#a6e3a1">POST</span></td><td>Create a new charge</td></tr><tr class="anim-row"><td style="color:#8b5cf6;font-family:monospace;font-size:11px">/v1/charges/{id}</td><td><span class="tag" style="background:#06b6d420;color:#06b6d4">GET</span></td><td>Retrieve a charge</td></tr><tr class="anim-row"><td style="color:#8b5cf6;font-family:monospace;font-size:11px">/v1/charges/{id}</td><td><span class="tag" style="background:#f9e2af20;color:#f9e2af">POST</span></td><td>Update a charge</td></tr><tr class="anim-row"><td style="color:#8b5cf6;font-family:monospace;font-size:11px">/v1/charges/{id}/capture</td><td><span class="tag" style="background:#a6e3a120;color:#a6e3a1">POST</span></td><td>Capture a charge</td></tr></table><div style="font-size:12px;color:#a6adc8;margin-top:6px">4 real endpoints with full parameter schemas. Zero hallucinated routes.</div>'},
    ]
  },
  // Scene 2: Guardrail
  {
    title: "openclaw-guardrail",
    messages: [
      {type:'user', text:'Audit this Terraform before I deploy:\\nresource \\"aws_s3_bucket\\" \\"data\\" {\\n  acl = \\"public-read\\"\\n}\\nresource \\"aws_security_group\\" \\"ssh\\" {\\n  ingress { from_port=22; to_port=22; cidr_blocks=[\\"0.0.0.0/0\\"] }\\n}'},
      {type:'bot', avatar:'grd', html:'<div class="tool-call"><div class="tool-label">Tool Call</div>audit_infrastructure_code<span class="badge badge-grd">openclaw-guardrail</span></div>'},
      {type:'bot', avatar:'grd', html:'<div style="font-size:13px;font-weight:700;color:#f38ba8;margin-bottom:10px">\\u26a0\\ufe0f 5 findings detected</div><table><tr><th>Severity</th><th>Resource</th><th>Issue</th></tr><tr class="anim-row"><td><span class="tag tag-crit">CRITICAL</span></td><td style="font-family:monospace;font-size:11px">aws_s3_bucket.data</td><td>Public read ACL exposes all objects</td></tr><tr class="anim-row"><td><span class="tag tag-crit">CRITICAL</span></td><td style="font-family:monospace;font-size:11px">aws_security_group.ssh</td><td>SSH open to 0.0.0.0/0 (the internet)</td></tr><tr class="anim-row"><td><span class="tag tag-high">HIGH</span></td><td style="font-family:monospace;font-size:11px">aws_s3_bucket.data</td><td>No server-side encryption configured</td></tr><tr class="anim-row"><td><span class="tag tag-high">HIGH</span></td><td style="font-family:monospace;font-size:11px">aws_s3_bucket.data</td><td>No versioning enabled</td></tr><tr class="anim-row"><td><span class="tag tag-med">MEDIUM</span></td><td style="font-family:monospace;font-size:11px">aws_s3_bucket.data</td><td>No access logging configured</td></tr></table><div style="font-size:12px;color:#f38ba8;margin-top:6px"><strong>Do not deploy.</strong> Fix the 2 critical issues first. Your S3 bucket is world-readable and SSH is open to the internet.</div>'},
    ]
  },
  // Scene 3: Fortress
  {
    title: "openclaw-fortress",
    messages: [
      {type:'user', text:'Verify my production endpoint is live and check for ghost costs in our AWS account.'},
      {type:'bot', avatar:'frt', html:'<div class="tool-call"><div class="tool-label">Tool Call</div>verify_live_state<span class="badge badge-frt">openclaw-fortress</span></div><div style="color:#6c7086;font-size:11px;margin-top:4px">Running zero-trust verification against production...</div>'},
      {type:'bot', avatar:'frt', html:'<div style="font-size:12px;color:#a6adc8;margin-bottom:10px">Live state verification complete:</div><table><tr><th>Check</th><th>Status</th><th>Impact</th></tr><tr class="anim-row"><td>API endpoint health</td><td><span class="ok">\\u2705 200 OK</span></td><td>\\u2014</td></tr><tr class="anim-row"><td>NAT Gateway (us-east-1)</td><td><span class="crit">\\u26a0\\ufe0f Idle</span></td><td class="cost-col" style="color:#f38ba8">$32.40/mo wasted</td></tr><tr class="anim-row"><td>Instance sizing</td><td><span class="warn">\\u26a0\\ufe0f Oversized</span></td><td class="cost-col" style="color:#fab387">m5.metal for API ($4,608/mo)</td></tr><tr class="anim-row"><td>Elastic IP (unattached)</td><td><span class="warn">\\u26a0\\ufe0f Idle</span></td><td class="cost-col" style="color:#fab387">$3.65/mo wasted</td></tr></table><div style="font-size:12px;color:#06b6d4;margin-top:8px"><strong>$4,644/mo</strong> in ghost costs detected. The m5.metal alone is 607x more than you need for a simple API (t3.micro: $7.59/mo).</div>'},
    ]
  },
  // Scene 4: Revenue Gate
  {
    title: "Revenue-Gated MCP",
    messages: [
      {type:'user', text:'What would it cost to run a t3.medium on AWS for a month?'},
      {type:'bot', avatar:'fin', html:'<div class="tool-call"><div class="tool-label">Tool Call</div>forecast_deployment_cost<span class="badge badge-fin">openclaw-finops</span></div>'},
      {type:'bot', avatar:'fin', html:'<div class="gate"><div class="gate-title">\\ud83d\\udd12 Free Tier Limit Reached</div><p>You\\'ve used 25/25 free operations this month.</p><p style="margin-top:8px;color:#cdd6f4">Upgrade to <strong style="color:#f97316">Pro ($29/mo)</strong> for 500 ops/month:</p><p style="margin-top:4px"><a href="#">\\u2192 Upgrade now</a></p></div><div style="font-size:11px;color:#6c7086;margin-top:8px;font-style:italic">This message was delivered inside the conversation via MCP\\'s isError:true flag \\u2014 not as an HTTP error that gets swallowed by the transport layer.</div>'},
      {type:'bot', avatar:'fin', html:'<div style="font-size:12px;color:#a6adc8">This is <strong style="color:#f97316">Revenue-Gated MCP</strong> \\u2014 a monetization pattern designed for AI tool access. The upgrade prompt reaches the user through the agent\\'s conversation, exactly where intent lives.</div><div style="font-size:12px;color:#6c7086;margin-top:8px">HTTP 402/429 \\u2192 agent swallows it, user never sees it \\u2718<br>MCP isError:true \\u2192 agent surfaces it in chat \\u2714</div>'},
    ]
  },
];

let currentScene = 0;
let animating = false;

function switchScene(idx) {
  if (animating) return;
  currentScene = idx;
  document.querySelectorAll('.scene-tab').forEach((t,i) => t.classList.toggle('active', i===idx));
  playScene(idx);
}

async function playScene(idx) {
  animating = true;
  const scene = SCENES[idx];
  const chat = document.getElementById('chat');
  const progress = document.getElementById('progress');
  document.getElementById('titletext').textContent = scene.title;
  chat.innerHTML = '';
  progress.style.width = '0%';

  const totalSteps = scene.messages.length;
  for (let i = 0; i < scene.messages.length; i++) {
    const m = scene.messages[i];
    const div = document.createElement('div');
    div.className = 'msg';

    if (m.type === 'user') {
      div.innerHTML = '<div class="user-msg"><div class="user-bubble">' + m.text.replace(/\\\\n/g,'<br>') + '</div></div>';
    } else {
      const avClass = {fin:'av-fin',api:'av-api',grd:'av-grd',frt:'av-frt'}[m.avatar] || 'av-fin';
      const letter = {fin:'F',api:'A',grd:'G',frt:'F'}[m.avatar] || 'O';
      div.innerHTML = '<div class="bot-msg"><div class="avatar ' + avClass + '">' + letter + '</div><div class="bot-bubble">' + m.html + '</div></div>';
    }

    chat.appendChild(div);
    await sleep(i === 0 ? 600 : 1200);
    div.classList.add('show');

    // Animate table rows
    const rows = div.querySelectorAll('.anim-row');
    for (const row of rows) {
      row.style.opacity = '0';
    }
    if (rows.length) {
      await sleep(300);
      for (const row of rows) {
        await sleep(280);
        row.style.transition = 'opacity .35s ease';
        row.style.opacity = '1';
      }
    }

    progress.style.width = ((i + 1) / totalSteps * 100) + '%';
  }
  animating = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

window.addEventListener('load', () => setTimeout(() => playScene(0), 400));
</script>
</body>
</html>`;
