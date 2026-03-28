import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Headers that reveal cache vs origin behavior
const CACHE_HEADERS = [
  "cf-cache-status",
  "x-cache",
  "x-cache-hits",
  "x-served-by",
  "x-varnish",
  "age",
  "cache-control",
  "cdn-cache-control",
  "x-fastly-request-id",
  "x-amz-cf-pop",
  "x-vercel-cache",
  "x-netlify-cache",
];

interface VerificationResult {
  url: string;
  final_url: string;
  status: number;
  cache_busted: boolean;
  cache_evidence: Record<string, string>;
  cache_verdict: "ORIGIN" | "EDGE_CACHE" | "INDETERMINATE";
  dom_signature_match: boolean | null;
  dom_signature_detail: string;
  response_headers: Record<string, string>;
  body_preview: string;
  body_length: number;
  timestamp: string;
}

function assessCacheVerdict(headers: Record<string, string>): "ORIGIN" | "EDGE_CACHE" | "INDETERMINATE" {
  const cfCache = headers["cf-cache-status"]?.toUpperCase();
  if (cfCache === "HIT" || cfCache === "STALE" || cfCache === "REVALIDATED") return "EDGE_CACHE";
  if (cfCache === "MISS" || cfCache === "DYNAMIC" || cfCache === "BYPASS") return "ORIGIN";

  const xCache = headers["x-cache"]?.toUpperCase();
  if (xCache?.includes("HIT")) return "EDGE_CACHE";
  if (xCache?.includes("MISS")) return "ORIGIN";

  const vercelCache = headers["x-vercel-cache"]?.toUpperCase();
  if (vercelCache === "HIT" || vercelCache === "STALE") return "EDGE_CACHE";
  if (vercelCache === "MISS") return "ORIGIN";

  const age = parseInt(headers["age"] || "0", 10);
  if (age > 0) return "EDGE_CACHE";

  return "INDETERMINATE";
}

function checkDomSignature(html: string, signature: string): { match: boolean; detail: string } {
  if (!signature || signature.trim() === "") {
    return { match: true, detail: "No signature provided — skipped." };
  }

  // Parse simple signature patterns:
  // "exactly one <header id='main-nav'>" → count occurrences of the tag
  // "contains <div class='app-root'>" → check existence
  // "no <iframe>" → check absence

  const exactlyMatch = signature.match(/^exactly\s+(\w+)\s+(<.+>)$/i);
  if (exactlyMatch) {
    const count = exactlyMatch[1] === "one" ? 1 : exactlyMatch[1] === "two" ? 2 : parseInt(exactlyMatch[1], 10);
    const tag = exactlyMatch[2];
    // Extract tag pattern for regex
    const tagContent = tag.replace(/^</, "").replace(/>$/, "");
    const regex = new RegExp(`<${tagContent}[\\s>]`, "gi");
    const matches = html.match(regex);
    const found = matches?.length ?? 0;
    if (found === count) {
      return { match: true, detail: `PASS: Found exactly ${count} occurrence(s) of ${tag}.` };
    }
    return { match: false, detail: `FAIL: Expected ${count} occurrence(s) of ${tag}, found ${found}.` };
  }

  const containsMatch = signature.match(/^contains\s+(<.+>)$/i);
  if (containsMatch) {
    const tag = containsMatch[1].replace(/^</, "").replace(/>$/, "");
    const regex = new RegExp(`<${tag}[\\s>]`, "i");
    if (regex.test(html)) {
      return { match: true, detail: `PASS: Found ${containsMatch[1]} in DOM.` };
    }
    return { match: false, detail: `FAIL: ${containsMatch[1]} not found in DOM.` };
  }

  const noMatch = signature.match(/^no\s+(<.+>)$/i);
  if (noMatch) {
    const tag = noMatch[1].replace(/^</, "").replace(/>$/, "");
    const regex = new RegExp(`<${tag}[\\s>]`, "i");
    if (!regex.test(html)) {
      return { match: true, detail: `PASS: Confirmed ${noMatch[1]} is absent from DOM.` };
    }
    return { match: false, detail: `FAIL: ${noMatch[1]} was found in DOM but should be absent.` };
  }

  // Fallback: treat signature as a literal string search
  if (html.includes(signature)) {
    return { match: true, detail: `PASS: Literal string "${signature.substring(0, 50)}" found in response body.` };
  }
  return { match: false, detail: `FAIL: Literal string "${signature.substring(0, 50)}" not found in response body.` };
}

function formatReport(result: VerificationResult): string {
  let report = `## OpenClaw Fortress — Live State Verification\n\n`;
  report += `**Target:** \`${result.url}\`\n`;
  if (result.final_url !== result.url) {
    report += `**Redirected to:** \`${result.final_url}\`\n`;
  }
  report += `**Status:** ${result.status}\n`;
  report += `**Timestamp:** ${result.timestamp}\n`;
  report += `**Body size:** ${result.body_length.toLocaleString()} bytes\n\n`;

  // Cache analysis
  report += `### Cache Analysis\n\n`;
  report += `**Cache busted:** ${result.cache_busted ? "Yes (query param + no-cache headers)" : "No (standard request)"}\n`;
  report += `**Verdict:** **${result.cache_verdict}**\n\n`;

  if (Object.keys(result.cache_evidence).length > 0) {
    report += `| Header | Value |\n`;
    report += `|--------|-------|\n`;
    for (const [k, v] of Object.entries(result.cache_evidence)) {
      report += `| \`${k}\` | ${v} |\n`;
    }
    report += `\n`;
  } else {
    report += `No cache-related headers detected.\n\n`;
  }

  // DOM signature
  report += `### DOM Signature Check\n\n`;
  report += `${result.dom_signature_detail}\n\n`;

  // Key response headers
  report += `### Response Headers\n\n`;
  report += `| Header | Value |\n`;
  report += `|--------|-------|\n`;
  const importantHeaders = ["content-type", "server", "x-powered-by", "strict-transport-security", "content-security-policy"];
  for (const h of importantHeaders) {
    if (result.response_headers[h]) {
      report += `| \`${h}\` | ${result.response_headers[h]} |\n`;
    }
  }
  report += `\n`;

  // Body preview
  report += `### Body Preview (first 500 chars)\n\n`;
  report += `\`\`\`html\n${result.body_preview}\n\`\`\`\n`;

  return report;
}

export function createFortressServer(): McpServer {
  const server = new McpServer({
    name: "openclaw-fortress",
    version: "1.0.0",
    instructions:
      "You are connected to OpenClaw Fortress, a zero-trust live state verification engine. " +
      "Use verify_live_state to confirm what a URL actually returns RIGHT NOW — bypassing " +
      "edge caches if needed. Use this before making deployment decisions, verifying DNS " +
      "propagation, checking if a fix is live, or confirming that a page matches expectations.",
  });

  server.tool(
    "verify_live_state",
    "Fetch a live URL and return the actual HTTP response, cache status, and DOM signature check. " +
      "Use this to verify deployments, detect cache-masking, and confirm what end users actually see. " +
      "Set bypass_cache=true to force an origin hit.",
    {
      target_url: z
        .string()
        .url()
        .describe("The URL to verify (must be HTTPS or HTTP)"),
      expected_dom_signature: z
        .string()
        .default("")
        .describe(
          "DOM assertion to check. Formats: 'exactly one <header id=\"main-nav\">', " +
            "'contains <div class=\"app-root\">', 'no <iframe>', or a literal string."
        ),
      bypass_cache: z
        .boolean()
        .default(false)
        .describe("If true, append a cache-busting param and set no-cache headers to force an origin hit"),
    },
    async ({ target_url, expected_dom_signature, bypass_cache }) => {
      try {
        // Build the request URL
        let fetchUrl = target_url;
        if (bypass_cache) {
          const separator = target_url.includes("?") ? "&" : "?";
          fetchUrl = `${target_url}${separator}_ocfcb=${Date.now()}`;
        }

        const headers: Record<string, string> = {
          "User-Agent": "OpenClaw-Fortress/1.0 (Live State Verifier)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        };
        if (bypass_cache) {
          headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
          headers["Pragma"] = "no-cache";
        }

        const res = await fetch(fetchUrl, {
          headers,
          redirect: "follow",
        });

        const body = await res.text();

        // Collect all response headers
        const responseHeaders: Record<string, string> = {};
        res.headers.forEach((v, k) => {
          responseHeaders[k.toLowerCase()] = v;
        });

        // Extract cache-specific headers
        const cacheEvidence: Record<string, string> = {};
        for (const h of CACHE_HEADERS) {
          if (responseHeaders[h]) {
            cacheEvidence[h] = responseHeaders[h];
          }
        }

        const cacheVerdict = assessCacheVerdict(responseHeaders);
        const sigCheck = checkDomSignature(body, expected_dom_signature);

        const result: VerificationResult = {
          url: target_url,
          final_url: res.url || fetchUrl,
          status: res.status,
          cache_busted: bypass_cache,
          cache_evidence: cacheEvidence,
          cache_verdict: cacheVerdict,
          dom_signature_match: expected_dom_signature ? sigCheck.match : null,
          dom_signature_detail: sigCheck.detail,
          response_headers: responseHeaders,
          body_preview: body.substring(0, 500),
          body_length: body.length,
          timestamp: new Date().toISOString(),
        };

        const report = formatReport(result);

        return {
          content: [{ type: "text" as const, text: report }],
          isError: sigCheck.match === false,
        };
      } catch (err: any) {
        return {
          content: [
            {
              type: "text" as const,
              text: `OpenClaw Fortress Error: Failed to verify ${target_url}\n\n${err.message}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  return server;
}
