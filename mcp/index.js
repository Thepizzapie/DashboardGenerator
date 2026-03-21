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

// ── Tool: list_sources ────────────────────────────────────────────────────────

const SOURCES = [
  // SaaS internals
  { id: "employees",             label: "Employees",              rows: 27,    fields: "name, dept, role, level, status, hire_date, salary, manager, location, performance",                        category: "People"       },
  { id: "projects",              label: "Projects",               rows: 14,    fields: "name, owner, team, status, pct_complete, budget, spent, due_date, priority, dept",                          category: "Operations"   },
  { id: "kpi_metrics",           label: "KPI Metrics",            rows: 19,    fields: "label, value, current_val, target, delta, trend, category",                                                 category: "Finance"      },
  { id: "monthly_revenue",       label: "Monthly Revenue",        rows: 12,    fields: "month, mrr, new_arr, expansion, churn, net_new",                                                            category: "Finance"      },
  { id: "revenue_by_segment",    label: "Revenue by Segment",     rows: 4,     fields: "segment, mrr, customers, avg_acv, churn_rate, ndr",                                                         category: "Finance"      },
  { id: "budget",                label: "Budget",                 rows: 8,     fields: "department, allocated, spent, headcount, q1_forecast",                                                      category: "Finance"      },
  { id: "sales_pipeline",        label: "Sales Pipeline",         rows: 14,    fields: "deal, stage, value, probability, close_date, rep, industry, source",                                        category: "Sales"        },
  { id: "support",               label: "Support Tickets",        rows: 15,    fields: "id, subject, priority, status, assignee, category, hours_open, created",                                    category: "Operations"   },
  { id: "inventory",             label: "Inventory",              rows: 13,    fields: "item, sku, qty, capacity, unit, status, reorder_point, unit_cost, supplier, lead_days",                     category: "Operations"   },
  { id: "sprint",                label: "Sprint Stories",         rows: 14,    fields: "story, points, status, assignee, sprint, epic",                                                             category: "Engineering"  },
  { id: "sprint_velocity",       label: "Sprint Velocity",        rows: 6,     fields: "sprint, committed, completed, bugs_closed, team_size",                                                      category: "Engineering"  },
  { id: "infra_services",        label: "Infrastructure",         rows: 10,    fields: "service, region, status, uptime_30d, p99_latency_ms, error_rate_pct, cost_month",                           category: "Engineering"  },
  { id: "marketing_campaigns",   label: "Marketing Campaigns",    rows: 8,     fields: "campaign, channel, spend, leads, opps, closed, revenue, roi",                                               category: "Marketing"    },
  { id: "web_analytics",         label: "Web Analytics",          rows: 6,     fields: "month, sessions, pageviews, signups, trials, paid_conversions",                                             category: "Marketing"    },
  { id: "feature_adoption",      label: "Feature Adoption",       rows: 10,    fields: "feature, mau, pct_users, satisfaction, p99_load_ms",                                                        category: "Product"      },
  // Cross-industry
  { id: "ecommerce_orders",      label: "E-Commerce Orders",      rows: 20,    fields: "order_id, date, customer, country, channel, category, product, qty, unit_price, discount_pct, total, status, rating", category: "Retail"    },
  { id: "ecommerce_products",    label: "Product Catalogue",      rows: 20,    fields: "sku, name, category, brand, price, cost, margin_pct, inventory, rating_avg, review_count, return_rate_pct, monthly_units", category: "Retail" },
  { id: "clinical_trial",        label: "Clinical Trial",         rows: 18,    fields: "patient_id, age, sex, bmi, treatment_arm, baseline_hba1c, week12_hba1c, reduction, adverse_events, discontinued, comorbidities, region", category: "Healthcare" },
  { id: "real_estate",           label: "Real Estate Listings",   rows: 15,    fields: "id, address, city, state, type, beds, baths, sqft, list_price, price_per_sqft, hoa_monthly, pool, status, days_on_market, school_rating, walk_score", category: "Real Estate" },
  { id: "iot_sensors",           label: "IoT Sensors",            rows: 20,    fields: "sensor_id, location, type, value, unit, timestamp, status, threshold_hi, threshold_lo, battery_pct, firmware", category: "IoT"       },
  { id: "portfolio",             label: "Equity Portfolio",       rows: 11,    fields: "ticker, name, sector, shares, avg_cost, current_price, market_value, unrealized_pnl, pnl_pct, weight_pct, beta, pe_ratio, dividend_yield, analyst_rating, ytd_return", category: "Finance" },
  { id: "restaurant_orders",     label: "Restaurant Orders",      rows: 13,    fields: "order_id, date, time, table, server, covers, channel, items, subtotal, tax, tip, total, payment, kitchen_time_min, rating", category: "Food & Bev" },
  { id: "student_performance",   label: "Student Performance",    rows: 15,    fields: "student_id, name, grade, school, gpa, sat_score, act_score, attendance_pct, extracurriculars, ap_courses, volunteer_hrs, intended_major, college_acceptance, financial_aid, first_gen", category: "Education" },
  { id: "premier_league",        label: "Premier League",         rows: 20,    fields: "club, played, won, drawn, lost, goals_for, goals_against, goal_diff, points, form, top_scorer, xg_for, xg_against, avg_possession, shots_pg, clean_sheets, position", category: "Sports" },
  { id: "country_indicators",    label: "Country Indicators",     rows: 25,    fields: "country, iso, region, gdp_per_capita, hdi, life_expectancy, literacy_rate, internet_pct, co2_per_capita, pop_millions, urban_pct, gini, health_exp_gdp_pct", category: "Global"    },
  // Rich generated
  { id: "transactions",          label: "Transactions",           rows: 500,   fields: "txn_id, date, customer, category, product, channel, qty, unit_price, discount_pct, subtotal, shipping, tax, total, payment, status", category: "Retail"    },
  { id: "stock_history",         label: "Stock History",          rows: 1512,  fields: "ticker, name, sector, date, open, high, low, close, volume, pct_change  (6 tickers × 252 days)",          category: "Finance"    },
  { id: "customer_accounts",     label: "Customer Accounts",      rows: 150,   fields: "account_id, company, segment, industry, plan, mrr, arr, seats, health_score, status, nps, days_since_login, renewal_date, csm, country, feature_usage_pct", category: "SaaS" },
  { id: "hourly_web_traffic",    label: "Hourly Web Traffic",     rows: 720,   fields: "date, hour, datetime, sessions, pageviews, new_visitors, bounce_rate_pct, avg_session_sec, conversions, top_source, server_errors  (30d × 24h)", category: "Marketing" },
  { id: "hr_survey",             label: "HR Survey",              rows: 120,   fields: "respondent_id, dept, level, tenure, location, gender, age_band, [14 Likert questions 1-5], enps, overall_avg", category: "People"   },
  { id: "shipments",             label: "Logistics Shipments",    rows: 200,   fields: "shipment_id, origin, destination, carrier, mode, product_type, weight_kg, declared_value, freight_cost, sla_days, actual_days, on_time, status, exception_code", category: "Logistics" },
  { id: "marketing_attribution", label: "Marketing Attribution",  rows: 300,   fields: "record_id, week, campaign, channel, segment, impressions, clicks, ctr_pct, spend, leads, mqls, opps, closed_won, revenue, roi_pct, cost_per_lead", category: "Marketing" },
  { id: "ed_visits",             label: "ED Visits",              rows: 100,   fields: "visit_id, arrival_date, age, sex, chief_complaint, acuity_level, triage_to_provider_min, los_minutes, insurance, disposition, admitted_to_icu, labs_ordered, readmit_30day", category: "Healthcare" },
  { id: "energy_readings",       label: "Energy Readings",        rows: 1460,  fields: "date, building_id, building_type, temp_c, is_weekend, consumption_kwh, solar_gen_kwh, net_kwh, cost_usd, carbon_kg, peak_demand_kw, water_gallons  (4 buildings × 365d)", category: "Utilities" },
  { id: "ab_test_results",       label: "A/B Test Results",       rows: 400,   fields: "user_id, experiment, variant, is_control, assigned_date, device, country, sessions, pages_viewed, time_on_site_sec, [metric], revenue, bounced, new_user", category: "Product" },
  { id: "crypto_history",        label: "Crypto History",         rows: 1440,  fields: "symbol, name, date, open, high, low, close, volume_usd, market_cap, pct_change, dominance_pct  (8 coins × 180d)", category: "Finance" },
  { id: "recruitment_pipeline",  label: "Recruitment Pipeline",   rows: 180,   fields: "candidate_id, role, dept, level, source, applied_date, stage, days_in_pipeline, country, yoe, salary_expectation, offered_salary, interview_score, rejected_reason, recruiter", category: "People" },
];

server.tool(
  "list_sources",
  "List all datasets available in Dashy. Returns each dataset's id, label, row count, " +
  "field names, and category. Use this to discover what data is available before choosing " +
  "which datasets to reference in a generation prompt.",
  {
    category: z.enum([
      "all", "Finance", "People", "Operations", "Engineering", "Marketing",
      "Product", "Sales", "Retail", "Healthcare", "Real Estate", "IoT",
      "Food & Bev", "Education", "Sports", "Global", "SaaS", "Logistics",
      "Utilities",
    ]).default("all").describe("Filter by category, or 'all' to return every dataset."),
  },
  async ({ category }) => {
    const filtered = category === "all" ? SOURCES : SOURCES.filter(s => s.category === category);
    const lines = filtered.map(s =>
      `• ${s.id} — ${s.label} (${s.rows} rows) [${s.category}]\n  Fields: ${s.fields}`
    ).join("\n\n");
    const text = `${filtered.length} dataset(s)${category !== "all" ? ` in category "${category}"` : ""}:\n\n${lines}`;
    return { content: [{ type: "text", text }] };
  }
);

// ── Tool: list_components ──────────────────────────────────────────────────────

const COMPONENTS = {
  html: [
    { name: ".stats-grid",      label: "Stat Card Grid",    desc: "Big numbers with labels and trend arrows. Use for KPIs." },
    { name: ".card",            label: "Card Container",    desc: "Bordered surface for grouping any content." },
    { name: ".progress-bar",    label: "Progress Bar",      desc: "Gradient fill track — set width% inline." },
    { name: ".badge",           label: "Status Badge",      desc: "Color-coded pill: .badge-green/.badge-red/.badge-amber/.badge-blue" },
    { name: "table",            label: "Data Table",        desc: "Sortable rows with hover highlights. Add onclick sort script." },
    { name: ".alert",           label: "Alert Banner",      desc: ".alert-info / .alert-success / .alert-warning / .alert-error" },
    { name: ".tabs-bar",        label: "Tabs",              desc: "JS-driven tab switching. Toggle .active on .tab-btn and .tab-panel." },
    { name: ".timeline",        label: "Timeline",          desc: "Vertical event list with .timeline-dot (.green/.amber/.red) markers." },
    { name: ".kanban",          label: "Kanban Board",      desc: "Flex columns with .kanban-col and .kanban-card items." },
    { name: ".activity-feed",   label: "Activity Feed",     desc: "Avatar + text + timestamp stream." },
    { name: ".donut",           label: "Donut Chart",       desc: "CSS conic-gradient ring — set percentage inline." },
    { name: ".heat-grid",       label: "Heatmap Grid",      desc: "Color-intensity cells with 5 severity levels." },
    { name: ".sparkline",       label: "Sparkline",         desc: "Inline SVG mini-chart for inline trend display." },
    { name: ".kv-grid",         label: "Key/Value Grid",    desc: "Two-column .kv-key / .kv-value label pairs." },
    { name: ".list-item",       label: "List Row",          desc: "Flex row with left label and right value." },
  ],
  mui: [
    { name: "useState / useMemo",           label: "State & Memo",    desc: "React hooks for tabs, filters, sorting state." },
    { name: "Box / Stack / Grid / Paper",   label: "Layout",          desc: "Flex, grid and surface containers." },
    { name: "Card + CardContent",           label: "Card",            desc: "Elevated content surface." },
    { name: "Typography",                   label: "Typography",      desc: "h4–h6, body1/2, caption, overline variants." },
    { name: "Table + TableRow + TableCell", label: "Data Table",      desc: "Sortable, filterable MUI table." },
    { name: "Chip / Badge",                 label: "Chip / Badge",    desc: "Status pills and notification overlays." },
    { name: "LinearProgress / CircularProgress", label: "Progress",   desc: "Fill bars and ring gauges." },
    { name: "Avatar + AvatarGroup",         label: "Avatar",          desc: "Initials circles or stacked group." },
    { name: "Tabs + Tab",                   label: "Tabs",            desc: "Tab switching with useState." },
    { name: "ToggleButtonGroup",            label: "Toggle Group",    desc: "Exclusive selection — e.g. time-range picker." },
    { name: "Accordion",                    label: "Accordion",       desc: "Collapsible sections." },
    { name: "Button / ButtonGroup",         label: "Buttons",         desc: "Contained, outlined, text variants." },
    { name: "Alert + AlertTitle",           label: "Alert",           desc: "Severity banners: error/warning/info/success." },
    { name: "Tooltip",                      label: "Tooltip",         desc: "Hover hint on any element." },
    { name: "Rating",                       label: "Rating",          desc: "Read-only star rating display." },
    { name: "Stepper + Step + StepLabel",   label: "Stepper",         desc: "Multi-step progress indicator." },
  ],
  charts: [
    { name: "BarChart",                     label: "Bar Chart",       desc: "Vertical or horizontal bars. Good for comparisons." },
    { name: "LineChart",                    label: "Line Chart",      desc: "Trend lines — supports multi-series." },
    { name: "AreaChart",                    label: "Area Chart",      desc: "Filled area under line — good for volume/cumulative." },
    { name: "ComposedChart",                label: "Composed Chart",  desc: "Mix Bar + Line + Area on the same axes." },
    { name: "PieChart + Pie + Cell",        label: "Pie Chart",       desc: "Proportional slices. Use Recharts Cell for colours." },
    { name: "RadarChart + Radar",           label: "Radar Chart",     desc: "Spider chart for multi-metric comparison." },
    { name: "RadialBarChart + RadialBar",   label: "Radial Bar",      desc: "Circular progress gauges." },
    { name: "ScatterChart + Scatter",       label: "Scatter / Bubble",desc: "x/y or x/y/z bubble plot." },
    { name: "Treemap",                      label: "Treemap",         desc: "Proportional rectangles — good for part-of-whole." },
    { name: "FunnelChart + Funnel",         label: "Funnel Chart",    desc: "Conversion funnel stages." },
    { name: "XAxis / YAxis / CartesianGrid",label: "Axes & Grid",     desc: "Labels, ticks, and background gridlines." },
    { name: "Tooltip + Legend",             label: "Tooltip & Legend",desc: "Interactive overlays." },
    { name: "ReferenceLine",                label: "Reference Line",  desc: "Target or threshold — use strokeDasharray." },
    { name: "Brush",                        label: "Brush / Zoom",    desc: "Scroll and zoom handle for long datasets." },
  ],
  infographic: [
    { name: "annotated-chart",   label: "Annotated Chart",    desc: "SVG chart with callout labels highlighting key data points." },
    { name: "timeline",          label: "Timeline",           desc: "Horizontal or vertical event sequence with dates." },
    { name: "flow-diagram",      label: "Flow Diagram",       desc: "Step-by-step process or methodology flow." },
    { name: "comparison-table",  label: "Comparison Table",   desc: "Side-by-side metric comparison with visual indicators." },
    { name: "bar-chart",         label: "SVG Bar Chart",      desc: "Animated SVG bars with CSS @keyframes." },
    { name: "scatter-plot",      label: "Scatter Plot",       desc: "SVG x/y dot plot — good for correlations." },
    { name: "treemap",           label: "Treemap",            desc: "Proportional rectangle layout in SVG." },
    { name: "network-graph",     label: "Network Graph",      desc: "Node/edge relationship diagram in SVG." },
  ],
  diagram: [
    { name: "flow-diagram",      label: "Flow Diagram",       desc: "D3 step-by-step process flow with labelled nodes and arrows." },
    { name: "org-chart",         label: "Org Chart",          desc: "D3 tree layout showing hierarchy from employees or teams." },
    { name: "network-graph",     label: "Network Graph",      desc: "D3 force-directed graph — nodes and weighted edges." },
    { name: "system-architecture",label: "System Architecture",desc: "Service/component diagram with grouped layers." },
    { name: "decision-tree",     label: "Decision Tree",      desc: "D3 binary or multi-branch decision flow." },
    { name: "treemap",           label: "Treemap",            desc: "D3 proportional rectangle hierarchy." },
    { name: "sankey",            label: "Sankey / Alluvial",  desc: "D3 flow diagram showing volume through stages." },
    { name: "timeline",          label: "D3 Timeline",        desc: "Horizontal time axis with labelled events." },
  ],
};

server.tool(
  "list_components",
  "List the UI components and primitives available in each Dashy canvas mode. " +
  "Use this to understand what building blocks are available before writing a generation prompt, " +
  "or to tell the generator exactly which components to use.",
  {
    mode: z.enum(["html", "mui", "charts", "infographic", "diagram", "all"])
      .default("all")
      .describe("Canvas mode to list components for, or 'all' for every mode."),
  },
  async ({ mode }) => {
    const modes = mode === "all" ? Object.keys(COMPONENTS) : [mode];
    const sections = modes.map(m => {
      const items = COMPONENTS[m];
      const lines = items.map(c => `  • ${c.name} — ${c.label}: ${c.desc}`).join("\n");
      return `## ${m.toUpperCase()} mode (${items.length} components)\n${lines}`;
    });
    return { content: [{ type: "text", text: sections.join("\n\n") }] };
  }
);

// ── Start ─────────────────────────────────────────────────────────────────────

const transport = new StdioServerTransport();
await server.connect(transport);
