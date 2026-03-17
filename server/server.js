require("dotenv").config({ path: "../.env" });
const express = require("express");
const cors = require("cors");
const { initDb, getAllSources } = require("./db");

const app = express();
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173"];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// ── Init DB ───────────────────────────────────────────────────────────────────

initDb();
app.use("/api", require("./routes/sources"));

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

async function buildDataContext() {
  const merged = { ...mockData };
  const userSources = getAllSources();
  for (const s of userSources) {
    if (!s.cached_data) continue;
    try { merged[s.name] = JSON.parse(s.cached_data); } catch (_) {}
  }
  return Object.entries(merged)
    .map(([k, v]) => `### ${k}\n${JSON.stringify(v, null, 2)}`)
    .join("\n\n");
}

// ── System prompt: HTML mode ──────────────────────────────────────────────────

function buildHtmlSystemPrompt(dataContext) {
  return `You are a UI generation engine. Your ONLY output is raw HTML — no markdown code fences, no explanations, no comments outside the HTML.

Always wrap your entire output in: <div class="rendered">...</div>

You MAY include a single <script> block at the end of your output for simple interactivity (tab switching, accordion toggles). Keep scripts minimal — no external libraries.

## Available CSS classes (already styled by the client):

### Layout & containers
- .rendered — root wrapper (always use this as the outermost element)
- .card — bordered container with padding and rounded corners
- .section-title — styled heading for sections
- .kv-grid — two-column key/value layout; children: .kv-key and .kv-value

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

### Alert banners
- .alert.alert-info — blue informational banner
- .alert.alert-success — green success banner
- .alert.alert-warning — amber warning banner
- .alert.alert-error — red error banner

### Tabs (JS-driven: toggle .active on .tab-btn and .tab-panel)
- .tabs-bar — container for tab buttons
- .tab-btn — clickable tab button; add class .active for selected state
- .tab-panel — content area; add class .active to show it
- Use a <script> to toggle active class on click

### Timeline
- .timeline — outer container
- .timeline-item — one row; children: .timeline-track + .timeline-content
- .timeline-track — contains .timeline-dot (add .green/.amber/.red) and .timeline-line
- .timeline-content — contains .timeline-title and .timeline-meta

### Kanban board
- .kanban — flex container of columns
- .kanban-col — one column; children: .kanban-col-title + .kanban-card items
- .kanban-card — individual card within a column

### Activity feed
- .activity-feed — outer container
- .activity-item — one entry; children: .activity-avatar, .activity-body
- .activity-body — contains .activity-text and .activity-time
- .activity-avatar — circular initial avatar (put 1-2 letter initials inside)

### Donut chart (CSS conic-gradient)
- .donut-wrap — flex row with .donut + .donut-legend
- .donut — 80×80 circle; set background inline: style="background: conic-gradient(#2563eb VALUE%, rgba(255,255,255,0.06) 0)"
- .donut-legend — list of .donut-legend-item (each contains .donut-legend-dot + label text)

### Heatmap grid
- .heat-grid — CSS grid container (set grid-template-columns inline)
- .heat-cell — one cell; use intensity classes .heat-0 through .heat-4

### Sparkline (inline SVG)
- .sparkline — inline container; place a hand-drawn <svg> polyline inside
  Example: <svg width="80" height="28" viewBox="0 0 80 28"><polyline points="0,24 16,18 32,20 48,8 64,12 80,4" fill="none" stroke="#2563eb" stroke-width="2"/></svg>

### Lists
- .list-item — flex row with space-between (good for key/value pairs)
- .muted — secondary text

### Typography
- h2, h3 — headings (styled globally)

## Derived / computed values
Compute new values from raw data whenever the UI calls for it. Never output "N/A".
- Budget utilisation: spent / allocated * 100 → progress bar width
- Progress toward target: current_val / target * 100 → progress bar
- Inventory fill rate: qty / capacity * 100 → progress bar
- Status inference: qty === 0 → badge-red; qty <= reorder_point → badge-amber; else badge-green
- Weighted pipeline value: value * probability / 100 per deal
- Sprint velocity: sum of points where status === "done"
- Aggregates: sum, count, average any column
Always hard-code computed results as numbers in the HTML.

## Rules
1. Return ONLY the HTML (+ optional <script>). No \`\`\`html fences. No prose.
2. Use ONLY the CSS classes listed above — do not invent new class names.
3. Use inline styles only for dynamic values (progress-fill width, conic-gradient stops, grid-template-columns).
4. Use real data from DATA CONTEXT — derive computed values as needed.
5. Make the UI visually complete. Combine multiple component types in one output (stat cards + table + timeline, etc.).
6. For tab interactivity, add a <script> at the end that wires up .tab-btn clicks to toggle .active.
7. If the user asks for sorting: add a <script> that wires up <th> click → sort the table rows in the DOM (toggle asc/desc, re-append sorted <tr> elements, update a sort indicator ▲/▼ in the header).
8. If the user asks for filtering: add a <script> with a filter <select> or <input> above the table that hides non-matching <tr> rows via style.display.

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
    const { useState, useMemo, useCallback } = React;
    const {
      ThemeProvider, createTheme, CssBaseline,
      Box, Stack, Grid, Paper, Divider,
      Typography, Card, CardContent, CardHeader, CardActions,
      Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
      Chip, LinearProgress, CircularProgress, Avatar, AvatarGroup,
      List, ListItem, ListItemText, ListItemAvatar, ListItemIcon,
      Button, ButtonGroup, IconButton,
      Tabs, Tab,
      Accordion, AccordionSummary, AccordionDetails,
      Alert, AlertTitle,
      Badge, Tooltip,
      Switch, FormControlLabel,
      ToggleButton, ToggleButtonGroup,
      Skeleton,
      Stepper, Step, StepLabel,
      Rating,
    } = MaterialUI;

    const theme = createTheme({
      palette: {
        mode: 'dark',
        primary: { main: '#2563eb' },
        success: { main: '#22c55e' },
        warning: { main: '#f59e0b' },
        error:   { main: '#ef4444' },
        info:    { main: '#38bdf8' },
        background: { default: '#0f1117', paper: '#161b27' },
      },
      shape: { borderRadius: 10 },
      typography: { fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif' },
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

## React hooks available (destructured from React):
- useState — local state for tabs, filters, toggles, search: const [tab, setTab] = useState(0)
- useMemo — memoize derived data: const filtered = useMemo(() => data.filter(...), [tab])
- useCallback — stable callbacks

## Available MUI components (destructured from MaterialUI in the template):

### Layout
- Box — generic container; use sx prop for all spacing/layout
- Stack — flex container: <Stack direction="row" spacing={2}>
- Grid — responsive grid: <Grid container spacing={2}><Grid item xs={12} md={6}>
- Paper — surface: elevation={1-8}
- Divider — horizontal separator

### Data display
- Card + CardContent + CardHeader + CardActions — content card
- Typography — variant: h4 h5 h6 subtitle1 subtitle2 body1 body2 caption overline
- Table, TableHead, TableBody, TableRow, TableCell, TableContainer — sortable data table
- Chip — color: default|primary|success|error|warning|info; size: small|medium
- LinearProgress — <LinearProgress variant="determinate" value={0-100} color="success|warning|error" />
- CircularProgress — <CircularProgress variant="determinate" value={0-100} size={60} />
- Avatar — sx={{ bgcolor:'primary.main' }} for initials; src for images
- AvatarGroup — stack multiple avatars: <AvatarGroup max={4}>
- List + ListItem + ListItemText + ListItemAvatar + ListItemIcon
- Badge — <Badge badgeContent={count} color="error"><Avatar /></Badge>
- Tooltip — <Tooltip title="hint"><Box>…</Box></Tooltip>
- Rating — <Rating value={3.5} precision={0.5} readOnly />
- Skeleton — loading placeholder: <Skeleton variant="rectangular" height={40} />

### Navigation & layout
- Tabs + Tab — <Tabs value={tab} onChange={(e,v)=>setTab(v)}><Tab label="Overview"/></Tabs>
  Pair with: {tab === 0 && <Box>...</Box>}
- Accordion + AccordionSummary + AccordionDetails — collapsible sections
- Stepper + Step + StepLabel — progress steps: <Stepper activeStep={2}>

### Actions & controls
- Button — variant: contained|outlined|text; color: primary|success|error|warning
- ButtonGroup — grouped buttons
- IconButton — icon-only button; nest SVG or emoji inside
- Switch + FormControlLabel — toggle: const [on, setOn] = useState(false)
- ToggleButton + ToggleButtonGroup — exclusive selection (chart type, time range)

### Feedback
- Alert + AlertTitle — severity: success|info|warning|error
  <Alert severity="warning"><AlertTitle>Warning</AlertTitle>message</Alert>

## Derived / computed values
Compute new values from raw data whenever needed:
- Budget utilisation: Math.round(spent / allocated * 100) → LinearProgress / CircularProgress value
- Progress toward target: Math.round(current_val / target * 100)
- Inventory fill rate: Math.round(qty / capacity * 100)
- Weighted pipeline value: value * probability / 100 per deal
- Sprint velocity: data.filter(s=>s.status==='done').reduce((sum,s)=>sum+s.points, 0)
- Aggregates: reduce/filter/map any column
- Status → Chip color: active/done/completed→success; low/warning/on-leave→warning; critical/error/blocked→error; planning/info→info
Hard-code all raw data as JS const arrays in the script. Do not fetch at runtime.

## Interactive patterns (use useState + useMemo):
- Tabs: const [tab, setTab] = useState(0) — show/hide sections with {tab===0 && ...}
- Status filter: const [filter, setFilter] = useState('all') — useMemo to filter rows; pair with ToggleButtonGroup or ButtonGroup for the UI
- Sort: const [sort, setSort] = useState({ col: 'name', dir: 'asc' }) — useMemo to sort rows; clicking a TableCell header toggles dir
- Search: const [search, setSearch] = useState('') — TextField input + useMemo filter by name/subject
- Time range: const [range, setRange] = useState('30d') — ToggleButtonGroup for '7d'|'30d'|'90d'; slice arrays in useMemo
- If the user mentions sorting by a column: implement click-to-sort on that TableCell header with ▲/▼ indicator
- If the user mentions filtering by status/priority/department: add filter chips or a ButtonGroup above the table

## Rules
1. Output ONLY the complete HTML document. No markdown. No prose.
2. Use ONLY the components listed above. Do not import anything else.
3. Embed all data as JS const arrays in the script tag. Do not fetch at runtime.
4. Use sx prop for all styling. No external CSS classes.
5. Make the UI interactive — use at least one useState hook. If the user mentions filters or sorting, implement them fully.
6. Make the dashboard visually complete and polished.

## DATA CONTEXT:
${dataContext}`;
}

// ── System prompt: Charts mode ────────────────────────────────────────────────

function buildChartsSystemPrompt(dataContext) {
  return `You are a React + MUI + Recharts dashboard generation engine. Your ONLY output is a complete, self-contained HTML document.

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
  <script crossorigin src="https://unpkg.com/prop-types@15/prop-types.min.js"></script>
  <script crossorigin src="https://unpkg.com/@mui/material@5/umd/material-ui.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/recharts@2.12.7/umd/Recharts.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel" data-presets="react">
    const { useState, useMemo } = React;
    const {
      ThemeProvider, createTheme, CssBaseline,
      Box, Stack, Grid, Paper, Divider,
      Typography, Card, CardContent, CardHeader,
      Chip, LinearProgress, Avatar,
      Button, ButtonGroup,
      Tabs, Tab,
      ToggleButton, ToggleButtonGroup,
      Alert,
    } = MaterialUI;
    const {
      BarChart, LineChart, AreaChart, PieChart, ComposedChart,
      RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
      RadialBarChart, RadialBar,
      ScatterChart, Scatter, ZAxis,
      Treemap,
      FunnelChart, Funnel, LabelList,
      Bar, Line, Area, Pie, Cell,
      XAxis, YAxis, CartesianGrid,
      Tooltip, Legend, ReferenceLine, Brush,
      ResponsiveContainer,
    } = Recharts;

    const theme = createTheme({
      palette: {
        mode: 'dark',
        primary: { main: '#2563eb' },
        success: { main: '#22c55e' },
        warning: { main: '#f59e0b' },
        error:   { main: '#ef4444' },
        info:    { main: '#38bdf8' },
        background: { default: '#0f1117', paper: '#161b27' },
      },
      shape: { borderRadius: 10 },
      typography: { fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif' },
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

## React hooks available:
- useState — for tab switching, time-range filters, chart-type toggles
- useMemo — memoize filtered/aggregated chart data

## Available Recharts components (all destructured from Recharts global):

### Standard charts
- BarChart — vertical bars; add layout="vertical" for horizontal
- LineChart — trend over time; multiple <Line> for multi-series
- AreaChart — filled area; use fillOpacity for stacking
- PieChart + Pie + Cell — proportional slices
- ComposedChart — mix Bar + Line + Area on same axes

### Advanced charts
- RadarChart + Radar + PolarGrid + PolarAngleAxis + PolarRadiusAxis — spider/radar chart for multi-metric comparison
- RadialBarChart + RadialBar — circular progress bars; set startAngle={180} endAngle={0} for semicircle
- ScatterChart + Scatter + ZAxis — bubble/scatter plot; data needs {x, y, z} shape
- Treemap — proportional rectangles; data needs {name, size} shape
- FunnelChart + Funnel + LabelList — funnel/conversion chart; data needs {name, value} shape

### Shared primitives
- ResponsiveContainer — ALWAYS wraps every chart: <ResponsiveContainer width="100%" height={300}>
- XAxis / YAxis — dataKey, tickFormatter, tick={{ fill:'#6b7280' }}, axisLine={false}
- CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"
- Tooltip contentStyle={{ background:'#1e2235', border:'1px solid rgba(255,255,255,0.08)' }}
- Legend wrapperStyle={{ fontSize:12 }}
- ReferenceLine — target/threshold: <ReferenceLine y={target} stroke="#f59e0b" strokeDasharray="4 4" />
- Brush — scroll/zoom: <Brush dataKey="name" height={20} stroke="#2563eb" /> (add inside chart for long datasets)

## Available MUI components (destructured from MaterialUI):
- Box, Stack, Grid, Paper, Divider — layout
- Typography, Chip, LinearProgress, Avatar — display
- Card + CardContent + CardHeader — chart wrapper card
- Button, ButtonGroup — actions
- Tabs + Tab — tab switching: const [tab, setTab] = useState(0)
- ToggleButton + ToggleButtonGroup — time range selector: '7d'|'30d'|'90d'
- Alert — severity: success|info|warning|error

## Chart rules
1. ALWAYS wrap every chart in <ResponsiveContainer width="100%" height={280}>
2. ALWAYS wrap each chart in <Card><CardContent> — include a <Typography variant="subtitle2"> title
3. ALL chart data = hard-coded JS const arrays computed BEFORE the return statement
4. Use: const COLORS = ['#2563eb','#0ea5e9','#22c55e','#f59e0b','#ef4444','#a855f7','#ec4899','#14b8a6']
5. PieChart: always use <Pie dataKey="value"> with <Cell fill={COLORS[i % COLORS.length]}> per entry
6. RadarChart data shape: [{ subject:'Metric', A: value, B: value }] — each <Radar> maps one series
7. Treemap data: [{ name, size }] — use fill={COLORS[i%COLORS.length]} on each content renderer
8. FunnelChart data: [{ name, value }] sorted descending — LabelList shows values inside bars

## Interactivity (use useState + useMemo):
- Tab switching: const [tab, setTab] = useState(0) → show different chart groups per tab
- Time range: const [range, setRange] = useState('30d') → ToggleButtonGroup for 7d/30d/90d; filter arrays in useMemo
- Chart-type toggle: ToggleButtonGroup to switch between BarChart and LineChart for same data
- Filter by category: const [filter, setFilter] = useState('all') → useMemo to filter chart data; pair with Chip group or ToggleButtonGroup
- Sort charts: reorder data arrays using useMemo before passing to Recharts (sort bars by value desc, etc.)
- If user mentions filtering/sorting: implement it — e.g. "sort by value desc" → data.slice().sort((a,b)=>b.value-a.value)

## Derived / computed values — aggregate BEFORE return:
- Budget BarChart: mockBudget.map(d => ({ name: d.department, Allocated: d.allocated, Spent: d.spent, '%Used': Math.round(d.spent/d.allocated*100) }))
- Sprint velocity: mockSprint.filter(s=>s.status==='done').reduce((a,s)=>a+s.points,0)
- Pipeline by stage: group mockSalesPipeline by stage, sum values
- KPIs vs target: mockKpiMetrics.map(k=>({ name:k.label, current:k.current_val, target:k.target }))
- Radar multi-metric: normalize each metric to 0-100 scale for comparable axes

Hard-code all computed arrays. Do not fetch data at runtime.

## Rules
1. Output ONLY the complete HTML document. No markdown. No prose.
2. Use only the components listed above.
3. Embed all data as JS const arrays in the script. Do not fetch at runtime.
4. Use sx prop for all MUI styling.
5. Build a multi-chart dashboard (4–6 charts in a Grid layout). Add at least one interactive element (tab, toggle, or time-range selector).
6. Mix chart types — don't use only BarChart. Consider ComposedChart, RadarChart, or Treemap for variety.

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
    const dataContext = await buildDataContext();
    const html = await callClaude(buildHtmlSystemPrompt(dataContext), prompt, apiKey);
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
    const dataContext = await buildDataContext();
    const html = await callClaude(buildMuiSystemPrompt(dataContext), prompt, apiKey);
    res.json({ html });
  } catch (err) {
    console.error("/generate-mui error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

app.post("/generate-charts", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  try {
    const dataContext = await buildDataContext();
    const html = await callClaude(buildChartsSystemPrompt(dataContext), prompt, apiKey);
    res.json({ html });
  } catch (err) {
    console.error("/generate-charts error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── POST /edit ────────────────────────────────────────────────────────────────

app.post("/edit", async (req, res) => {
  const { html, instruction } = req.body;
  if (!html || !instruction) return res.status(400).json({ error: "html and instruction are required" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  const systemPrompt = `You are a UI editor. You will receive an existing dashboard HTML and an instruction describing a change the user wants. Apply the change and return the COMPLETE updated HTML document.

Rules:
1. Return ONLY the complete updated HTML. No markdown fences. No prose. No explanation.
2. Keep all data, structure, and functionality intact unless the instruction says otherwise.
3. Apply the change precisely — do not restructure things that weren't mentioned.
4. If it's a color change, update all relevant color values throughout (backgrounds, text, borders, chart colors).
5. If it's a layout change, reorder or restructure only what was asked.

CURRENT HTML:
${html}`;

  try {
    const updated = await callClaude(systemPrompt, instruction, apiKey);
    res.json({ html: updated });
  } catch (err) {
    console.error("/edit error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT}`));
