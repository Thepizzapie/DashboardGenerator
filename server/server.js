require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ── Mock data sources ────────────────────────────────────────────────────────

const mockData = {
  employees: [
    { name: "Alice Johnson",  dept: "Engineering", role: "Senior Dev",        status: "active",   hire_date: "2021-03-15", salary: 145000 },
    { name: "Bob Smith",      dept: "Marketing",   role: "Manager",           status: "active",   hire_date: "2019-07-01", salary: 118000 },
    { name: "Carol White",    dept: "Design",      role: "UX Lead",           status: "on-leave", hire_date: "2020-11-22", salary: 132000 },
    { name: "David Brown",    dept: "Engineering", role: "Junior Dev",        status: "active",   hire_date: "2023-01-10", salary: 92000  },
    { name: "Eve Davis",      dept: "Sales",       role: "Account Executive", status: "active",   hire_date: "2022-05-18", salary: 98000  },
    { name: "Frank Miller",   dept: "Engineering", role: "DevOps",            status: "active",   hire_date: "2020-09-03", salary: 138000 },
    { name: "Grace Lee",      dept: "HR",          role: "HR Manager",        status: "active",   hire_date: "2018-04-12", salary: 112000 },
    { name: "Henry Chen",     dept: "Finance",     role: "Analyst",           status: "active",   hire_date: "2021-08-30", salary: 105000 },
    { name: "Iris Patel",     dept: "Engineering", role: "Tech Lead",         status: "active",   hire_date: "2019-02-14", salary: 158000 },
    { name: "Jake Torres",    dept: "Sales",       role: "Sales Rep",         status: "active",   hire_date: "2023-06-05", salary: 85000  },
  ],

  projects: [
    { name: "Website Redesign",    owner: "Carol White",  status: "in-progress", pct_complete: 65,  budget: 80000,  spent: 52000,  due_date: "2026-04-15" },
    { name: "API Migration",       owner: "Alice Johnson", status: "in-progress", pct_complete: 40,  budget: 120000, spent: 48000,  due_date: "2026-05-01" },
    { name: "Mobile App v2",       owner: "David Brown",  status: "planning",    pct_complete: 10,  budget: 200000, spent: 20000,  due_date: "2026-06-30" },
    { name: "Analytics Dashboard", owner: "Bob Smith",    status: "completed",   pct_complete: 100, budget: 45000,  spent: 43200,  due_date: "2026-03-01" },
    { name: "Security Audit",      owner: "Iris Patel",   status: "in-progress", pct_complete: 75,  budget: 30000,  spent: 22500,  due_date: "2026-03-25" },
    { name: "Customer Portal",     owner: "Eve Davis",    status: "planning",    pct_complete: 5,   budget: 95000,  spent: 4750,   due_date: "2026-07-01" },
    { name: "Data Warehouse",      owner: "Henry Chen",   status: "in-progress", pct_complete: 55,  budget: 160000, spent: 88000,  due_date: "2026-05-20" },
  ],

  kpi_metrics: [
    { label: "Monthly Revenue",   value: "$284,500", current_val: 284500, target: 270000, delta: "+12%"   },
    { label: "Active Users",      value: "14,230",   current_val: 14230,  target: 15000,  delta: "+8%"    },
    { label: "Support Tickets",   value: "47",       current_val: 47,     target: 40,     delta: "-23%"   },
    { label: "Uptime",            value: "99.97%",   current_val: 99.97,  target: 99.9,   delta: "+0.02%" },
    { label: "Avg Response Time", value: "142ms",    current_val: 142,    target: 200,    delta: "-18%"   },
    { label: "NPS Score",         value: "72",       current_val: 72,     target: 70,     delta: "+5"     },
    { label: "Conversion Rate",   value: "3.8%",     current_val: 3.8,    target: 4.0,    delta: "+0.4%"  },
    { label: "Churn Rate",        value: "1.2%",     current_val: 1.2,    target: 1.5,    delta: "-0.3%"  },
  ],

  inventory: [
    { item: "Laptop Dell XPS 15",  sku: "HW-001", qty: 12, capacity: 20, unit: "units", status: "in-stock",    reorder_point: 5  },
    { item: "USB-C Hub 7-port",    sku: "HW-002", qty: 3,  capacity: 30, unit: "units", status: "low-stock",   reorder_point: 10 },
    { item: "Standing Desk",       sku: "FN-001", qty: 0,  capacity: 10, unit: "units", status: "out-of-stock", reorder_point: 3  },
    { item: 'Monitor 27" 4K',      sku: "HW-003", qty: 8,  capacity: 15, unit: "units", status: "in-stock",    reorder_point: 4  },
    { item: "Mechanical Keyboard", sku: "HW-004", qty: 2,  capacity: 25, unit: "units", status: "low-stock",   reorder_point: 8  },
    { item: "Webcam HD 1080p",     sku: "HW-005", qty: 15, capacity: 20, unit: "units", status: "in-stock",    reorder_point: 5  },
    { item: "Ergonomic Chair",     sku: "FN-002", qty: 1,  capacity: 12, unit: "units", status: "low-stock",   reorder_point: 4  },
    { item: "Noise-Cancel Headset",sku: "HW-006", qty: 0,  capacity: 15, unit: "units", status: "out-of-stock", reorder_point: 5  },
  ],

  sales_pipeline: [
    { deal: "Acme Corp ERP",         stage: "Proposal",    value: 85000,  probability: 60, close_date: "2026-04-10", rep: "Eve Davis"  },
    { deal: "Globex SaaS Expansion", stage: "Negotiation", value: 142000, probability: 80, close_date: "2026-03-28", rep: "Jake Torres" },
    { deal: "Initech Onboarding",    stage: "Discovery",   value: 32000,  probability: 30, close_date: "2026-05-15", rep: "Eve Davis"  },
    { deal: "Umbrella Corp Renewal", stage: "Closed Won",  value: 210000, probability: 100,close_date: "2026-03-01", rep: "Jake Torres" },
    { deal: "Soylent Analytics",     stage: "Proposal",    value: 67500,  probability: 55, close_date: "2026-04-22", rep: "Bob Smith"  },
    { deal: "Cyberdyne Platform",    stage: "Discovery",   value: 195000, probability: 25, close_date: "2026-06-30", rep: "Eve Davis"  },
    { deal: "Stark Industries MDM",  stage: "Negotiation", value: 88000,  probability: 75, close_date: "2026-03-31", rep: "Jake Torres" },
  ],

  support: [
    { id: "TKT-1041", subject: "Login SSO broken after update",     priority: "critical", status: "open",        assignee: "Frank Miller",  hours_open: 3  },
    { id: "TKT-1039", subject: "Dashboard export returns empty CSV",priority: "high",     status: "in-progress", assignee: "Alice Johnson", hours_open: 18 },
    { id: "TKT-1038", subject: "Slow query on /api/reports",        priority: "high",     status: "in-progress", assignee: "Iris Patel",    hours_open: 26 },
    { id: "TKT-1035", subject: "Email notifications not sending",   priority: "medium",   status: "open",        assignee: "Frank Miller",  hours_open: 42 },
    { id: "TKT-1032", subject: "UI glitch on mobile Safari",        priority: "low",      status: "open",        assignee: "Carol White",   hours_open: 71 },
    { id: "TKT-1030", subject: "User can't update billing address",  priority: "medium",   status: "resolved",    assignee: "Alice Johnson", hours_open: 8  },
    { id: "TKT-1028", subject: "Password reset link expires too fast",priority: "low",    status: "resolved",    assignee: "Grace Lee",     hours_open: 55 },
  ],

  budget: [
    { department: "Engineering", allocated: 520000, spent: 387000 },
    { department: "Marketing",   allocated: 180000, spent: 162000 },
    { department: "Sales",       allocated: 240000, spent: 198000 },
    { department: "Design",      allocated: 95000,  spent: 61000  },
    { department: "HR",          allocated: 75000,  spent: 48000  },
    { department: "Finance",     allocated: 60000,  spent: 41000  },
    { department: "DevOps",      allocated: 140000, spent: 128000 },
  ],

  sprint: [
    { story: "Auth refresh token flow",    points: 8,  status: "done",        assignee: "Alice Johnson", sprint: "Sprint 22" },
    { story: "Export to PDF",              points: 5,  status: "done",        assignee: "David Brown",   sprint: "Sprint 22" },
    { story: "Dark mode toggle",           points: 3,  status: "done",        assignee: "Carol White",   sprint: "Sprint 22" },
    { story: "Bulk user import CSV",       points: 13, status: "in-progress", assignee: "Iris Patel",    sprint: "Sprint 22" },
    { story: "Webhook retry logic",        points: 8,  status: "in-progress", assignee: "Frank Miller",  sprint: "Sprint 22" },
    { story: "Rate limiting middleware",   points: 5,  status: "todo",        assignee: "Alice Johnson", sprint: "Sprint 22" },
    { story: "Dashboard widget drag/drop", points: 13, status: "todo",        assignee: "Carol White",   sprint: "Sprint 22" },
    { story: "Mobile push notifications",  points: 8,  status: "blocked",     assignee: "David Brown",   sprint: "Sprint 22" },
  ],
};

// ── Shared data context builder ───────────────────────────────────────────────

function buildDataContext() {
  return Object.entries(mockData)
    .map(([key, val]) => `### ${key}\n${JSON.stringify(val, null, 2)}`)
    .join("\n\n");
}

// ── System prompt: HTML mode ──────────────────────────────────────────────────

function buildHtmlSystemPrompt(dataContext) {
  return `You are a UI generation engine. Your ONLY output is raw HTML — no markdown code fences, no explanations, no comments outside the HTML.

Always wrap your entire output in: <div class="rendered">...</div>

## Available CSS classes (already styled by the client):

### Layout & containers
- .rendered — root wrapper (always use this as the outermost element)
- .card — bordered container with padding and rounded corners
- .section-title — styled heading for sections

### Stats grid
- .stats-grid — CSS grid of stat cards
- .stat-card — individual stat card inside .stats-grid
- .stat-label — small label text inside a stat card
- .stat-value — large prominent number/value inside a stat card
- .stat-delta — delta/change indicator inside a stat card (add class .positive or .negative for coloring)

### Tables
- Use standard <table> with <thead> and <tbody>
- <th> for header cells, <td> for data cells

### Badges
- .badge — inline pill badge
- .badge-green — green badge (active, completed, in-stock)
- .badge-red — red badge (error, out-of-stock, critical)
- .badge-amber — amber/yellow badge (warning, low-stock, on-leave)
- .badge-blue — blue badge (info, planning, in-progress)

### Progress bars
- .progress-bar — outer track element
- .progress-fill — inner fill element; set width inline as a percentage, e.g. style="width: 65%"

### Lists
- .list-item — flex row with space-between (good for key/value pairs)
- .muted — secondary text

### Typography
- h2, h3 — headings (styled globally)

## Derived / computed values
You are expected to compute new values from the raw data when the UI calls for it.
Never output "N/A" or skip a visual element because a field doesn't exist verbatim — derive it.

Examples of the kind of reasoning you must apply:
- Progress toward a goal: if data has \`current_val\` and \`target\`, compute \`Math.round(current_val / target * 100)\` for a progress bar width.
- Budget utilisation: \`spent / allocated * 100\` → progress bar width.
- Ratio / utilisation: \`used / capacity * 100\` → progress bar.
- Variance / gap: \`actual - target\` → show as a delta with .positive / .negative class.
- Aggregates: sum a column, count rows matching a condition, average a field — then display as a stat card.
- Status inference: if qty === 0 → badge-red; qty <= reorder_point → badge-amber; else badge-green.
- Weighted pipeline value: \`value * probability / 100\` per deal.
- Sprint velocity: sum of points where status === "done".
- Any two numeric columns can be combined into a ratio, difference, or percentage if that serves the requested UI.

Always do the arithmetic inline in the HTML (hard-code the computed result as a number). Do not emit JavaScript.

## Rules
1. Return ONLY the HTML. No \`\`\`html fences. No prose.
2. Use ONLY the CSS classes listed above — do not invent new class names.
3. Use inline styles ONLY for dynamic values (e.g. progress-fill width).
4. Use the real data provided in the DATA CONTEXT — derive computed values as needed.
5. Make the UI visually complete and realistic for the requested topic.

## DATA CONTEXT (real data — use these values):
${dataContext}`;
}

// ── System prompt: MUI mode ───────────────────────────────────────────────────

function buildMuiSystemPrompt(dataContext) {
  return `You are a MUI (Material UI v5) React UI generation engine. Your ONLY output is a complete, self-contained HTML document that renders a React + MUI component.

OUTPUT FORMAT: Raw HTML document only. No markdown fences (\`\`\`). No prose. No explanation.

## Page structure (follow this template exactly):

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
  <style>html, body { margin: 0; padding: 0; }</style>
</head>
<body>
  <div id="root"></div>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/@mui/material@5/umd/material-ui.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel" data-presets="react">
    const {
      ThemeProvider, createTheme, CssBaseline,
      Box, Stack, Grid, Paper, Divider,
      Typography, Card, CardContent, CardHeader,
      Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
      Chip, LinearProgress, Avatar,
      List, ListItem, ListItemText,
    } = MaterialUI;

    const theme = createTheme({
      palette: {
        mode: 'dark',
        primary: { main: '#6366f1' },
        success: { main: '#22c55e' },
        warning: { main: '#f59e0b' },
        error:   { main: '#ef4444' },
        info:    { main: '#3b82f6' },
        background: { default: '#0f1117', paper: '#161b27' },
      },
      shape: { borderRadius: 8 },
      typography: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
    });

    function GeneratedUI() {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ p: 3, minHeight: '100vh' }}>
            {/* YOUR GENERATED CONTENT HERE */}
          </Box>
        </ThemeProvider>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<GeneratedUI />);
  </script>
</body>
</html>

## Available MUI components (already destructured from MaterialUI in the template):
- Box — generic container; use sx prop for all spacing and layout
- Stack — flex container: <Stack direction="row" spacing={2}>
- Grid — responsive grid: <Grid container spacing={2}><Grid item xs={12} md={6}>
- Paper — surface container: elevation={1-8}
- Card + CardContent + CardHeader — content card
- Typography — variant: h4 h5 h6 subtitle1 subtitle2 body1 body2 caption overline
- Table, TableHead, TableBody, TableRow, TableCell, TableContainer — data table
- Chip — color: default | primary | success | error | warning | info; size: small | medium
- LinearProgress — <LinearProgress variant="determinate" value={0-100} color="primary|success|warning|error" />
- Avatar — sx={{ bgcolor: 'primary.main' }} for colored initials circles
- List, ListItem, ListItemText — primaryTypographyProps={{ variant: 'body2' }}
- Divider — horizontal separator

## Derived / computed values
Compute new values from raw data whenever needed:
- Budget utilisation: Math.round(spent / allocated * 100) → LinearProgress value
- Progress toward target: Math.round(current_val / target * 100) → LinearProgress value
- Inventory fill rate: Math.round(qty / capacity * 100) → LinearProgress value
- Weighted pipeline value: value * probability / 100 per deal
- Sprint velocity: sum points where status === "done"
- Aggregates: sum, count, average any column
- Status → Chip color: active/done/completed → success; warning/low/on-leave → warning; critical/error/blocked → error; planning/info → info
Hard-code all computed results as JS literals inside the script. Do not fetch data at runtime.

## Rules
1. Output ONLY the complete HTML document. No markdown. No prose.
2. Use ONLY the MUI components listed above. Do not import anything else.
3. Use the real data from DATA CONTEXT — embed it as JS literals in the script tag.
4. Use sx prop for all styling. No external CSS classes.
5. Make the UI visually complete and polished for the requested topic.

## DATA CONTEXT:
${dataContext}`;
}

// ── Shared Claude call ────────────────────────────────────────────────────────

async function callClaude(systemPrompt, userPrompt, apiKey) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error: ${text}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? "";
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  try {
    const html = await callClaude(buildHtmlSystemPrompt(buildDataContext()), prompt, apiKey);
    res.json({ html });
  } catch (err) {
    console.error("/generate error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

app.post("/generate-mui", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  try {
    const html = await callClaude(buildMuiSystemPrompt(buildDataContext()), prompt, apiKey);
    res.json({ html });
  } catch (err) {
    console.error("/generate-mui error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT}`));
