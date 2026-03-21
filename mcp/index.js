#!/usr/bin/env node
// Dashy MCP Server — exposes all 5 Dashy generators as callable tools
// Usage: node mcp/index.js
// Configure DASHY_URL (default: http://localhost:3001) and DASHY_API_KEY in env

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const DASHY_URL = process.env.DASHY_URL || "http://localhost:3001";
const API_KEY   = process.env.DASHY_API_KEY || "dev";

const server = new McpServer({
  name: "dashy",
  version: "1.0.0",
});

// ── Shared fetch helper ────────────────────────────────────────────────────────

async function callDashy(endpoint, prompt, extraBody = {}) {
  const res = await fetch(`${DASHY_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ prompt, ...extraBody }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Dashy ${endpoint} failed (${res.status}): ${text}`);
  }

  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.html;
}

// ── Pipeline helper (SSE endpoint used by the main UI) ─────────────────────────

async function callPipeline(prompt, mode) {
  const res = await fetch(`${DASHY_URL}/generate-pipeline`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ prompt, mode }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Dashy pipeline failed (${res.status}): ${text}`);
  }

  // Read SSE stream and return the final result HTML
  const text = await res.text();
  for (const line of text.split("\n").reverse()) {
    if (!line.startsWith("data: ")) continue;
    try {
      const data = JSON.parse(line.slice(6));
      if (data.result) return data.result;
      if (data.error) throw new Error(data.error);
    } catch (_) {}
  }
  throw new Error("No result in pipeline response");
}

// ── Tool: generate_html_dashboard ─────────────────────────────────────────────

server.tool(
  "generate_html_dashboard",
  "Generate a standalone HTML dashboard using Dashy's HTML canvas mode. " +
  "Uses CSS classes and vanilla JS — no external dependencies. " +
  "Best for stat cards, tables, timelines, kanban boards, progress bars and badges. " +
  "Returns a self-contained HTML string ready to render in a browser.",
  {
    prompt: z.string().describe(
      "Plain-English description of the dashboard to build. " +
      "Mention dataset names to include them (e.g. 'show employees and budget'). " +
      "Available datasets: employees, projects, kpi_metrics, monthly_revenue, " +
      "revenue_by_segment, budget, sales_pipeline, support, inventory, sprint, " +
      "sprint_velocity, infra_services, marketing_campaigns, web_analytics, " +
      "feature_adoption, ecommerce_orders, ecommerce_products, clinical_trial, " +
      "real_estate, iot_sensors, portfolio, restaurant_orders, student_performance, " +
      "premier_league, country_indicators, transactions, stock_history, " +
      "customer_accounts, hourly_web_traffic, hr_survey, shipments, " +
      "marketing_attribution, ed_visits, energy_readings, ab_test_results, " +
      "crypto_history, recruitment_pipeline."
    ),
  },
  async ({ prompt }) => {
    const html = await callDashy("/generate", prompt);
    return { content: [{ type: "text", text: html }] };
  }
);

// ── Tool: generate_mui_dashboard ──────────────────────────────────────────────

server.tool(
  "generate_mui_dashboard",
  "Generate a React + Material-UI dashboard using Dashy's MUI canvas mode. " +
  "Uses MUI components (Card, Grid, Chip, LinearProgress, List, Accordion, Table) " +
  "with full theming and at least one interactive hook (filter, sort, toggle). " +
  "Returns a self-contained HTML string with React + MUI loaded via CDN.",
  {
    prompt: z.string().describe(
      "Plain-English description of the dashboard. Mention dataset names to get richer data samples. " +
      "MUI mode excels at structured layouts with interactive state."
    ),
  },
  async ({ prompt }) => {
    const html = await callDashy("/generate-mui", prompt);
    return { content: [{ type: "text", text: html }] };
  }
);

// ── Tool: generate_charts_dashboard ───────────────────────────────────────────

server.tool(
  "generate_charts_dashboard",
  "Generate a React + Recharts data visualisation dashboard using Dashy's Charts canvas mode. " +
  "Produces 4–6 charts in a responsive grid: BarChart, LineChart, AreaChart, PieChart, " +
  "ScatterChart, RadarChart, ComposedChart, Treemap. Best for time-series, distributions, " +
  "comparisons and trend analysis. Returns a self-contained HTML string.",
  {
    prompt: z.string().describe(
      "Describe the charts and data to visualise. Mention dataset names. " +
      "Charts mode is best for: stock history, hourly traffic, energy readings, " +
      "monthly revenue, sprint velocity, crypto history, and any time-series data."
    ),
  },
  async ({ prompt }) => {
    const html = await callDashy("/generate-charts", prompt);
    return { content: [{ type: "text", text: html }] };
  }
);

// ── Tool: generate_infographic ────────────────────────────────────────────────

server.tool(
  "generate_infographic",
  "Generate a visual infographic using Dashy's Infographic canvas mode. " +
  "Produces editorial-style layouts with animated SVG bars, timelines, annotated charts, " +
  "flow diagrams, and comparison tables — all in pure HTML/CSS/SVG with no dependencies. " +
  "Best for storytelling, reports, and presenting insights rather than raw data grids.",
  {
    prompt: z.string().describe(
      "Describe the story or insight to visualise. Can be abstract ('show the health of our pipeline') " +
      "or data-driven ('compare drug efficacy across treatment arms in the clinical trial'). " +
      "Infographic mode prioritises visual narrative over interactivity."
    ),
  },
  async ({ prompt }) => {
    const html = await callDashy("/generate-infographic", prompt);
    return { content: [{ type: "text", text: html }] };
  }
);

// ── Tool: generate_diagram ────────────────────────────────────────────────────

server.tool(
  "generate_diagram",
  "Generate a technical diagram or flow chart using Dashy's Diagram canvas mode powered by D3. " +
  "Supports: flow diagrams, network graphs, org charts, system architecture, pipeline flows, " +
  "decision trees, force-directed graphs, and treemaps. " +
  "Returns a self-contained HTML string with D3 loaded via CDN.",
  {
    prompt: z.string().describe(
      "Describe the diagram. Examples: 'org chart from employees data', " +
      "'system architecture for our infra services', " +
      "'flow diagram of the shipment lifecycle', " +
      "'network graph of project-team relationships'."
    ),
  },
  async ({ prompt }) => {
    const html = await callDashy("/generate-diagram", prompt);
    return { content: [{ type: "text", text: html }] };
  }
);

// ── Tool: generate_dashboard_pipeline ────────────────────────────────────────
// Uses the full multi-agent pipeline (planner → stylist → generator → critic → refine)

server.tool(
  "generate_dashboard_pipeline",
  "Generate a high-quality dashboard using Dashy's full multi-agent pipeline: " +
  "planner → stylist → generator → critic → refinement loop. " +
  "Takes longer than direct generation but produces significantly better results " +
  "with correct data, balanced layout, and visual polish. " +
  "Use this when quality matters more than speed.",
  {
    prompt: z.string().describe("Plain-English description of the dashboard to build."),
    mode: z.enum(["html", "mui", "charts", "infographic", "diagram"])
      .default("html")
      .describe("Canvas mode to generate in. Default: html."),
  },
  async ({ prompt, mode }) => {
    const html = await callPipeline(prompt, mode);
    return { content: [{ type: "text", text: html }] };
  }
);

// ── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
