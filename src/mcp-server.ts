import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { calculateForecast, PRICING_MATRIX, type CloudProvider } from "./pricing_matrix.js";

const SUPPORTED_PROVIDERS = Object.keys(PRICING_MATRIX) as CloudProvider[];

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "openclaw-finops",
    version: "1.0.0",
  });

  server.tool(
    "forecast_deployment_cost",
    "Estimate the monthly cloud deployment cost for a set of services on a given provider.",
    {
      provider: z
        .enum(["AWS", "GCP", "AZURE"])
        .describe("Cloud provider (AWS, GCP, or AZURE)"),
      services_to_add: z
        .array(
          z.object({
            service_name: z
              .string()
              .describe("Service/instance identifier from the pricing matrix"),
            estimated_usage_hours: z
              .number()
              .min(0)
              .describe("Estimated monthly usage in hours (defaults to 730 if 0)"),
          })
        )
        .min(1)
        .describe("List of services to forecast"),
    },
    async ({ provider, services_to_add }) => {
      if (!SUPPORTED_PROVIDERS.includes(provider)) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Unknown provider: ${provider}. Supported: ${SUPPORTED_PROVIDERS.join(", ")}.`,
            },
          ],
          isError: true,
        };
      }

      const forecast = calculateForecast(provider, services_to_add);

      let report = `## OpenClaw FinOps — Deployment Cost Forecast\n`;
      report += `**Provider:** ${forecast.provider}\n\n`;
      report += `| Service | Category | Hours | Est. Cost |\n`;
      report += `|---------|----------|-------|-----------|\n`;

      for (const item of forecast.line_items) {
        if ("error" in item) {
          report += `| ${item.service} | — | — | ⚠️ ${item.error} |\n`;
        } else {
          report += `| ${item.service} | ${item.category} | ${item.hours_calculated} | $${item.estimated_cost_usd.toFixed(2)} |\n`;
        }
      }

      report += `\n**Total Estimated Monthly Cost: $${forecast.total_estimated_monthly_cost_usd.toFixed(2)}**\n`;

      return {
        content: [{ type: "text" as const, text: report }],
      };
    }
  );

  return server;
}
