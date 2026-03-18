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
7. CRITICAL — JSX tag matching: Every opening tag must have a matching closing tag in the correct order. The most common mistake is writing </Card> before </CardContent>. Always close innermost components first: </CardContent></Card>, </ListItemText></ListItem>, </AccordionDetails></Accordion>. Count your open tags before finishing.

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
- Treemap — proportional rectangles; data needs {name, size} shape; ALWAYS use a safe custom content renderer (see rule 9 below)
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
9. Treemap ALWAYS requires this safe custom content renderer (copy exactly — do NOT use the default renderer as it crashes on undefined nodes):
   const TreemapCell = ({ x, y, width, height, name, value, index }) => {
     if (!name || width < 2 || height < 2) return null;
     return (
       <g>
         <rect x={x} y={y} width={width} height={height} fill={COLORS[index % COLORS.length]} stroke="#0f1117" strokeWidth={2} rx={4} />
         {width > 55 && height > 28 && (
           <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={700}>{name}</text>
         )}
         {width > 55 && height > 40 && (
           <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={10}>{value}</text>
         )}
       </g>
     );
   };
   // Usage: <Treemap data={data} dataKey="size" content={<TreemapCell />} />

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
7. CRITICAL — JSX tag matching: Every opening tag must have a matching closing tag in the correct order. Close innermost first: </CardContent></Card>, </ResponsiveContainer> before </CardContent>. Count open tags. The most common mistake is </Card> before </CardContent>.

## DATA CONTEXT:
${dataContext}`;
}

function buildInfographicSystemPrompt(dataContext) {
  return `You are a data journalist and visual designer. Your work appears in The Pudding, Reuters Graphics, FT Visual Journalism, and Bloomberg Businessweek. You create editorial data stories — not dashboards, not product UIs, not reports.

Output a COMPLETE, self-contained HTML document (<!DOCTYPE html> through </html>). No markdown. No prose. No code fences.

## WHAT THIS IS NOT
This is NOT a dashboard. Kill every dashboard instinct:
- No cards. No rounded boxes with box-shadow. No chip/badge elements.
- No symmetrical grid of equal-sized panels.
- No MUI, Bootstrap, Tailwind, or any component library.
- No buttons, tabs, toggles, or any interactive elements.
- No "KPI card" layout (icon + number + label in a box).
- No generic titles: "Dashboard", "Overview", "Summary", "Report".

## WHAT THIS IS
A magazine data spread. A scrollable editorial page. A visual essay built from data.

Internalize these aesthetics:
- **The Pudding**: full-bleed colored sections, prose woven around visuals, data as narrative
- **Reuters Graphics**: clean annotated SVG, callout lines pointing to specific data points, sparse but precise
- **Bloomberg Businessweek**: bold typographic hierarchy, unexpected color choices, the NUMBER is the hero
- **NYT The Upshot**: explanatory annotations directly on the chart — no separate legend needed

## DESIGN RULES

**Typography as layout:**
- The main insight number must be 100–160px, in a display/serif font, taking up space deliberately
- Section headers are 28–40px, weighted, with intentional letter-spacing
- Body copy is 15–17px, line-height 1.7, max 65 characters per line — real prose, not bullet labels
- Use ONE display font (Playfair Display, Fraunces, or DM Serif Display) + ONE sans (Inter or DM Sans) via a single Google Fonts <link>

**Color as structure:**
- Use full-bleed background color sections to divide the page — NOT borders or card containers
- Choose a bold accent (e.g. #e63946, #f4a261, #2a9d8f, #e76f51, #457b9d) used sparingly but decisively
- Background: dark (#111, #0f0f0f, #1a1a2e) OR warm off-white (#faf9f7, #f2ede4) — not plain white
- Accent color highlights ONE thing per section: the most important bar, the key number, the critical line

**Layout — be asymmetric:**
- Hero section: 100% width, full-bleed color, no max-width constraint, enormous number
- Body sections: max-width 900px centered, but ASYMMETRIC internally — try 38/62 or 30/70 text/chart splits
- Pull quotes: 32–42px, italic, accent-colored, breaking out of the column grid
- Alternate rhythm: wide text + narrow chart, then narrow text + wide chart

**SVG — hand-craft everything:**
- Draw every <rect>, <path>, <line>, <text> with explicit coordinates in a defined viewBox
- Bars: accent color for the highest/most-important value, muted #555 or #aaa for the rest
- Lines: stroke-width 3–4, gradient fill area beneath, <circle> dots only at annotated points
- Callout lines: draw a <line> from a specific data point to a nearby <text> annotation ("43% spike — biggest month of the year")
- No chart borders. No full grid lines. Only a baseline or 2-3 horizontal guides max.
- Annotations live ON the chart, never in a separate legend box

**Forbidden patterns in SVG:**
- No <foreignObject>. No HTML inside SVG.
- No chart.js-style legend boxes in the corner.
- No axis tick marks on every value — annotate the notable ones only.

## NARRATIVE STRUCTURE (adapt to the data)
1. Full-bleed hero: 6–8 word bold label, enormous primary metric (100–160px), 1-sentence lede
2. Context prose: 2–3 sentences explaining what this means, asymmetric layout with a small accent chart
3. Main visualization: the central chart, large, heavily annotated, with an adjacent pull quote
4. Supporting insights: 2–3 additional data points, each as a short prose paragraph + small inline SVG
5. Closing: ONE bold sentence in 48–64px display type, full-bleed colored section — the takeaway

## DATA FIDELITY (non-negotiable)
- All names, values, and dates must come VERBATIM from the DATA CONTEXT below — never invent entities
- Compute derived values (averages, totals, percentages) from the raw DATA CONTEXT numbers
- No placeholder text: no "TBD", "N/A", "XXX", "Employee A", "Department X"
- Non-ASCII characters in SVG text will render garbled — use plain ASCII only (no →, ∝, •, –, °, etc.)

## TECHNICAL
- All data as computed JS const arrays — no placeholder values, no "TBD", no "XXX"
- CSS custom properties: --accent, --accent2, --bg, --bg2, --text, --muted
- CSS @keyframes fadeInUp: translateY(24px)→0 + opacity 0→1, staggered via animation-delay on sections
- SVG bars: animate height from 0 using a CSS @keyframes on rect elements
- No external scripts. Vanilla HTML + CSS + inline SVG only.

## DATA CONTEXT:
${dataContext}`;
}

function buildDiagramSystemPrompt(dataContext) {
  return `You are an academic data visualization specialist. Generate publication-quality figures in the style of research papers and technical documentation, using D3.js v7 for data-driven charts and inline SVG for diagrams.

Output a COMPLETE, self-contained HTML document (<!DOCTYPE html> through </html>). No markdown. No code fences.

## AVAILABLE LIBRARIES
Load via CDN — include these script tags in <head>:
- D3 v7: <script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>

## FIGURE TYPES (choose based on the request)
1. **STATISTICAL PLOTS** — bar, grouped bar, line, scatter, area: use D3 scales + axes + data binding
2. **FLOW / PIPELINE DIAGRAMS** — process steps, system architecture: hand-crafted SVG with arrow markers and colored group regions
3. **NETWORK DIAGRAMS** — relationships, dependencies: D3 force simulation
4. **HIERARCHY** — org charts, trees, treemaps: d3.hierarchy + d3.tree or d3.treemap
5. **MULTI-PANEL FIGURES** — 2–4 related charts in a grid labeled (a)(b)(c)(d)

## ACADEMIC AESTHETIC (non-negotiable)
- Background: #ffffff or #f8fafc — NEVER dark backgrounds
- Figure title: serif font (Crimson Text or Lora, Google Fonts), 18–22px, center-aligned above the SVG
- Axis/label font: Inter or Source Sans 3, 11–13px
- No box-shadows. No card borders. No rounded containers.
- Color palette for group regions: rgba(219,234,254,0.4) blue, rgba(220,252,231,0.4) green, rgba(254,249,195,0.4) yellow, rgba(252,231,243,0.4) pink, rgba(243,232,255,0.4) purple — with a 1.5px solid border in the same hue
- Data mark colors: #2563eb, #059669, #d97706, #dc2626, #7c3aed, #0891b2
- Axis lines: #94a3b8, stroke-width 1px
- Grid lines: #e2e8f0, stroke-width 0.5px, opacity 0.6
- Text: #1e293b primary, #64748b secondary/axis labels

## D3 CHART PATTERNS (use the standard margin convention)
\`\`\`js
const margin = {top: 40, right: 30, bottom: 50, left: 60};
const width = 560 - margin.left - margin.right;
const height = 340 - margin.top - margin.bottom;

const svg = d3.select("#chart1")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", \`translate(\${margin.left},\${margin.top})\`);

// Scales
const x = d3.scaleBand().domain(data.map(d => d.label)).range([0, width]).padding(0.3);
const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value) * 1.1]).range([height, 0]);

// Axes
svg.append("g").attr("transform", \`translate(0,\${height})\`).call(d3.axisBottom(x).tickSize(0)).select(".domain").attr("stroke", "#94a3b8");
svg.append("g").call(d3.axisLeft(y).ticks(5).tickSize(-width)).call(g => g.select(".domain").remove()).call(g => g.selectAll(".tick line").attr("stroke", "#e2e8f0").attr("stroke-dasharray", "2,2"));

// Bars with transition
svg.selectAll("rect").data(data).enter().append("rect")
  .attr("x", d => x(d.label)).attr("width", x.bandwidth())
  .attr("y", height).attr("height", 0).attr("fill", "#2563eb").attr("rx", 2)
  .transition().duration(600).attr("y", d => y(d.value)).attr("height", d => height - y(d.value));

// Value labels
svg.selectAll(".label").data(data).enter().append("text")
  .attr("x", d => x(d.label) + x.bandwidth()/2).attr("y", d => y(d.value) - 6)
  .attr("text-anchor", "middle").attr("font-size", 11).attr("fill", "#1e293b").text(d => d.value);
\`\`\`

## SVG FLOWCHART RULES (for process/architecture diagrams)
- Always define arrowhead marker AND copy the full icon library <defs> block (below) into every SVG.
- Nodes: <rect rx="6" fill="white" stroke="#94a3b8" stroke-width="1.5"/> + centered <text>. For multi-line node labels use multiple <tspan> elements.
- To add an icon to a node: place <use href="#icon-X" x="nx+6" y="ny+10" width="16" height="16" color="#2563eb"/> inside the node group, then offset the label text right by 22px.
- Group regions: <rect rx="8" fill="rgba(219,234,254,0.35)" stroke="#93c5fd" stroke-width="1.5"/> drawn BEFORE nodes.
- Connections: <path d="M x1,y1 C cx1,cy1 cx2,cy2 x2,y2" fill="none" stroke="#64748b" stroke-width="1.5" marker-end="url(#arrow)"/>
- Plan your x,y coordinates on a grid before writing SVG. Typical node: 140x44px. Gap between nodes: 60-80px.
- NO emoji, NO unicode symbols, NO bullet characters inside <text> or legend labels. Plain ASCII only. This includes: arrows (use "->"), proportional (use "prop."), ellipsis (use "..."), en/em dash (use "-"), degree symbol (use "deg"), any character outside standard ASCII 32-126. These render as garbled characters in PDF and some browsers.

## SVG ICON LIBRARY
Copy this ENTIRE <defs> block verbatim into every SVG diagram you create (merge with your arrow marker defs):

<defs>
  <marker id="arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#64748b"/></marker>
  <marker id="arrow-blue" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#2563eb"/></marker>
  <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#059669"/></marker>

  <!-- Infrastructure -->
  <symbol id="icon-server" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="14" width="20" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="6.5" r="1" fill="currentColor"/><circle cx="6" cy="17.5" r="1" fill="currentColor"/><line x1="10" y1="6.5" x2="16" y2="6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="10" y1="17.5" x2="16" y2="17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>

  <symbol id="icon-database" viewBox="0 0 24 24"><ellipse cx="12" cy="6" rx="8" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" fill="none" stroke="currentColor" stroke-width="1.5"/></symbol>

  <symbol id="icon-cloud" viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>

  <symbol id="icon-router" viewBox="0 0 24 24"><rect x="2" y="11" width="20" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="6" y1="11" x2="4" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="11" x2="12" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="18" y1="11" x2="20" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="15" r="1" fill="currentColor"/><circle cx="11" cy="15" r="1" fill="currentColor"/></symbol>

  <symbol id="icon-cpu" viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="9" y1="4" x2="9" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="4" x2="12" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="15" y1="4" x2="15" y2="7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="9" y1="17" x2="9" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="15" y1="17" x2="15" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4" y1="9" x2="7" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4" y1="12" x2="7" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="4" y1="15" x2="7" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="17" y1="9" x2="20" y2="9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="17" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="17" y1="15" x2="20" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>

  <symbol id="icon-container" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><polyline points="3.27,6.96 12,12.01 20.73,6.96" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" stroke-width="1.5"/></symbol>

  <symbol id="icon-storage" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" fill="none" stroke="currentColor" stroke-width="1.5"/></symbol>

  <symbol id="icon-layers" viewBox="0 0 24 24"><polygon points="12,2 2,7 12,12 22,7 12,2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><polyline points="2,17 12,22 22,17" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="2,12 12,17 22,12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>

  <!-- Apps & Interfaces -->
  <symbol id="icon-browser" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="2" y1="9" x2="22" y2="9" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="6" r="1" fill="currentColor"/><circle cx="9.5" cy="6" r="1" fill="currentColor"/></symbol>

  <symbol id="icon-mobile" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="12" y1="18" x2="12.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>

  <symbol id="icon-monitor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="1.5"/></symbol>

  <symbol id="icon-api" viewBox="0 0 24 24"><polyline points="16,18 22,12 16,6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="8,6 2,12 8,18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>

  <!-- Security -->
  <symbol id="icon-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke="currentColor" stroke-width="1.5"/></symbol>

  <symbol id="icon-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>

  <symbol id="icon-key" viewBox="0 0 24 24"><circle cx="7.5" cy="15.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M21 2l-9.6 9.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M15.5 7.5l3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>

  <!-- People -->
  <symbol id="icon-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>

  <symbol id="icon-users" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M2 20c0-3.5 3.13-6 7-6s7 2.5 7 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="17" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M15.5 14.3c.5-.2 1-.3 1.5-.3 3.5 0 6 2 6 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>

  <!-- Data & Process -->
  <symbol id="icon-file" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>

  <symbol id="icon-queue" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>

  <symbol id="icon-filter" viewBox="0 0 24 24"><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>

  <symbol id="icon-transform" viewBox="0 0 24 24"><polyline points="17,1 21,5 17,9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 11V9a4 4 0 0 1 4-4h14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><polyline points="7,23 3,19 7,15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 13v2a4 4 0 0 1-4 4H3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>

  <symbol id="icon-sync" viewBox="0 0 24 24"><polyline points="23,4 23,10 17,10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="1,20 1,14 7,14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>

  <symbol id="icon-gear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" fill="none" stroke="currentColor" stroke-width="1.5"/></symbol>

  <symbol id="icon-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>

  <!-- Analytics & Monitoring -->
  <symbol id="icon-chart" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><line x1="2" y1="20" x2="22" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></symbol>

  <symbol id="icon-email" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" stroke-width="1.5"/></symbol>

  <symbol id="icon-lightning" viewBox="0 0 24 24"><polyline points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>

  <!-- Status -->
  <symbol id="icon-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><polyline points="9,12 11,14 15,10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>

  <symbol id="icon-warning" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><circle cx="12" cy="17" r="0.75" fill="currentColor"/></symbol>

  <symbol id="icon-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><polyline points="12,7 12,12 15,15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></symbol>

  <symbol id="icon-inbox" viewBox="0 0 24 24"><polyline points="22,12 16,12 14,15 10,15 8,12 2,12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></symbol>
</defs>

Available icon IDs (choose the best fit per node):
- Infrastructure: icon-server, icon-database, icon-cloud, icon-router, icon-cpu, icon-container, icon-storage, icon-layers
- Apps: icon-browser, icon-mobile, icon-monitor, icon-api
- Security: icon-lock, icon-shield, icon-key
- People: icon-user, icon-users
- Data/Process: icon-file, icon-queue, icon-filter, icon-transform, icon-sync, icon-gear, icon-link
- Analytics: icon-chart, icon-email, icon-lightning
- Status: icon-check, icon-warning, icon-clock, icon-inbox

Usage: <use href="#icon-server" x="NODE_X+6" y="NODE_Y+12" width="18" height="18" color="#2563eb"/>
The color attribute sets currentColor — use your accent color or #64748b for neutral.

## DOCUMENT STRUCTURE
\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"></script>
  <style>
    body { font-family: 'Inter', sans-serif; background: #ffffff; margin: 0; padding: 40px; color: #1e293b; }
    .figure-wrap { max-width: 900px; margin: 0 auto; height: auto; }
    .figure-title { font-family: 'Crimson Text', serif; font-size: 20px; font-weight: 600; text-align: center; margin-bottom: 8px; color: #0f172a; }
    .figure-caption { font-family: 'Crimson Text', serif; font-style: italic; font-size: 13px; color: #64748b; text-align: center; margin-top: 12px; }
    .panel-grid { display: grid; gap: 32px; }
    .panel-label { font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px; }
    /* CRITICAL: Never set fixed heights on chart containers — let SVG height drive layout */
    #chart1, #chartA, #chartB, #chartC, #chartD, [id^="chart"] { height: auto; min-height: unset; }
    @media print { body { padding: 20px; } .figure-wrap { max-width: 100%; } }
  </style>
</head>
<body>
  <div class="figure-wrap">
    <div class="figure-title">Figure Title Here</div>
    <div id="chart1"></div>
    <div class="figure-caption">Figure 1: Description of what is shown.</div>
  </div>
  <script>
    const data = [ /* hard-coded from DATA CONTEXT */ ];
    /* D3 code here */
  </script>
</body>
</html>
\`\`\`

## MULTI-PANEL: use CSS grid
\`\`\`html
<div class="panel-grid" style="grid-template-columns: repeat(2, 1fr);">
  <div><div class="panel-label">(a) Title</div><div id="chartA"></div></div>
  <div><div class="panel-label">(b) Title</div><div id="chartB"></div></div>
</div>
\`\`\`

## D3 FORCE SIMULATION — WHITESPACE FIX (MANDATORY)
When using d3.forceSimulation for network/node-link diagrams, you MUST fit the SVG to the actual node bounds after simulation ends. Use this pattern — do NOT set a fixed large SVG height:

\`\`\`js
simulation.on("end", () => {
  // 1. Compute actual bounding box of all nodes
  const xs = nodes.map(n => n.x), ys = nodes.map(n => n.y);
  const x0 = Math.min(...xs) - 60, y0 = Math.min(...ys) - 60;
  const x1 = Math.max(...xs) + 60, y1 = Math.max(...ys) + 60;
  const bw = x1 - x0, bh = y1 - y0;

  // 2. Set viewBox to content bounds — eliminates blank space
  svg.attr("viewBox", \`\${x0} \${y0} \${bw} \${bh}\`)
     .attr("width", "100%")
     .attr("height", bh)
     .attr("preserveAspectRatio", "xMidYMid meet");

  // 3. Draw all nodes/links inside this callback so positions are final
});
\`\`\`

Always run ALL node/link/label drawing code INSIDE the simulation "end" callback, not before it.
Constrain force simulation to the visible area using:
\`\`\`js
.force("x", d3.forceX(centerX).strength(0.12))
.force("y", d3.forceY(centerY).strength(0.12))
.force("collide", d3.forceCollide(70).strength(1).iterations(3))
.force("charge", d3.forceManyBody().strength(-300))
\`\`\`
- forceCollide radius 70 + strength 1 + 3 iterations = hard separation, no overlapping labels
- forceManyBody strength -300 = strong repulsion keeps nodes readable
- Center gravity 0.12 = tight enough cluster, no runaway nodes
This prevents nodes from drifting far apart and overlapping within clusters.

## RULES
1. Output ONLY the complete HTML document. No markdown. No prose.
2. All data embedded as JS const arrays — copy EXACT names, values, and dates from DATA CONTEXT. NEVER invent names, project titles, salaries, or percentages not present in the data.
3. Use D3 for all data-driven charts. Use hand-crafted SVG only for flowcharts/architecture.
4. Every chart must have: axis labels with units, a title, and direct data labels or a legend.
5. @media print styles must be included so the page prints/exports to PDF correctly.
6. NEVER use dark backgrounds. NEVER add interactive buttons or tabs.
7. DATA FIDELITY: Employee names, project names, budgets, salaries, dates, and percentages must be taken verbatim from the DATA CONTEXT below. If a value is not in the data, compute it from values that are (e.g. burn rate = spent/budget). Never substitute with generic names like "Project Alpha" or "Alice Chen".

## DATA CONTEXT:
${dataContext}`;
}

// ── Pipeline agent prompts ─────────────────────────────────────────────────────

function buildPlannerPrompt() {
  return `You are a dashboard planning agent. Given a user request and available data, output a JSON specification for the dashboard.

Output ONLY valid JSON — no markdown, no prose, no code fences.

Schema:
{
  "title": string,
  "summary": string,
  "layout": "single-col" | "two-col" | "grid",
  "components": [
    { "type": string, "purpose": string, "dataKeys": [string], "priority": number }
  ],
  "kpiCount": number,
  "chartCount": number,
  "tableCount": number,
  "dataSourcesUsed": [string],
  "highlights": [string]
}

Rules:
- 3–8 components total. Priority 1 = most important.
- Choose component types from: kpi-card, bar-chart, line-chart, pie-chart, table, stat-card, progress-bar, radar-chart, treemap.
- dataSourcesUsed should list the mock data arrays that are relevant.
- highlights = 3–5 key insights the dashboard should surface.
- Output ONLY the JSON object.`;
}

function buildStylistPrompt() {
  return `You are a dashboard styling agent. Given a plan spec, output a JSON style guide.

Output ONLY valid JSON — no markdown, no prose, no code fences.

Schema:
{
  "colorScheme": "dark" | "light",
  "primaryAccent": string (hex),
  "secondaryAccent": string (hex),
  "successColor": string (hex),
  "warningColor": string (hex),
  "errorColor": string (hex),
  "cardStyle": "glass" | "flat" | "elevated" | "outlined",
  "density": "compact" | "normal" | "spacious",
  "typography": {
    "scale": "small" | "medium" | "large",
    "headingWeight": number,
    "monoAccents": boolean
  },
  "chartPalette": [6 hex color strings],
  "rationale": string
}

Rules:
- Choose colors that work well together and suit the dashboard's purpose.
- chartPalette must have exactly 6 distinct, visually harmonious hex colors.
- Output ONLY the JSON object.`;
}

function buildCriticPrompt(mode = "html") {
  const isEditorial = mode === "infographic" || mode === "diagram";

  if (isEditorial) {
    const typeName = mode === "infographic" ? "infographic" : "diagram";
    return `You are a visual design critic reviewing a generated ${typeName}. Evaluate it against the original user request and output a JSON critique.

Output ONLY valid JSON — no markdown, no prose, no code fences.

Schema:
{
  "score": number (1-10),
  "issues": [string],
  "suggestions": [string],
  "missingKPIs": [],
  "dataAccuracy": "accurate" | "minor-issues" | "major-issues",
  "layoutAssessment": "good" | "cluttered" | "sparse"
}

Check for:
1. Does the ${typeName} directly address the user's topic/request?
2. Are all data values concrete and specific — no "N/A", "TBD", "XX%", or placeholder text?
3. Are computed values (totals, percentages, averages) arithmetically correct?
4. Is the visual hierarchy clear — main story obvious at a glance?
5. Does it use the correct output format — ${mode === "infographic" ? "full editorial HTML with prose sections, not dashboard cards" : "SVG/D3 figure with proper node labels and connectors, not HTML cards"}?
6. Are there any visual encoding issues (wrong chart type, missing labels, unreadable contrast)?

Penalty rules (lower score significantly for these):
- Any MUI/HTML card components in output: -3 points
- Placeholder/fake data values: -2 points per instance
- Wrong format (dashboard instead of ${typeName}): -4 points
- Missing key visual elements the prompt asked for: -2 points each

Scoring: 9-10 = excellent, 7-8 = good, 5-6 = needs improvement, 1-4 = poor.
Output ONLY the JSON object.`;
  }

  return `You are a dashboard quality critic. Review the generated dashboard HTML against the original user request and output a JSON critique.

Output ONLY valid JSON — no markdown, no prose, no code fences.

Schema:
{
  "score": number (1-10),
  "issues": [string],
  "suggestions": [string],
  "missingKPIs": [string],
  "dataAccuracy": "accurate" | "minor-issues" | "major-issues",
  "layoutAssessment": "good" | "cluttered" | "sparse"
}

Check for:
1. Does the dashboard address everything in the user's prompt?
2. Are real data values used (not placeholder text like "XXX" or "TBD")?
3. Are computed/aggregate values correct — verify totals, percentages, averages against the raw data?
4. Are KPI cards present when the prompt implies metrics?
5. Is the layout balanced — not too cluttered or sparse?
6. Are all values non-placeholder and meaningful?

Data accuracy rules (lower score for any violations):
- Wrong computed total/percentage vs source data: -2 per error
- Fabricated values not derivable from available data: -2 per instance
- Any "N/A", "TBD", "XX", "??", or empty value cells: -1 each

Scoring: 9-10 = excellent, 7-8 = good, 5-6 = needs improvement, 1-4 = poor.
Output ONLY the JSON object.`;
}

function buildEditorialPlannerPrompt(mode, dataContext) {
  const typeName = mode === "infographic" ? "data-driven editorial infographic" : "technical diagram / academic figure";
  const styleDesc = mode === "infographic"
    ? "The Pudding / Reuters Graphics / Bloomberg BW editorial style — full-bleed sections, narrative prose, inline SVG charts, NO cards or dashboards"
    : "D3.js academic figure style — SVG flowcharts, node-link diagrams, methodology figures, white background, serif typography, NO cards or HTML components";

  return `You are an editorial content strategist. Given a user request and available data, output a JSON specification for a ${typeName}.

Output ONLY valid JSON — no markdown, no prose, no code fences.

Schema:
{
  "title": string,
  "subtitle": string,
  "narrative": string (the story arc, 1-2 sentences),
  "sections": [
    { "heading": string, "purpose": string, "visualType": string, "keyFacts": [string] }
  ],
  "dataSourcesUsed": [string],
  "visualMetaphors": [string],
  "typography": "serif" | "sans",
  "colorMood": string
}

Rules:
- 2–5 sections. Each section has a clear editorial purpose.
- visualType must be one of: annotated-chart, timeline, flow-diagram, comparison-table, stat-callout, network-graph, bar-chart, scatter-plot, treemap
- keyFacts: 2–4 specific facts pulled VERBATIM from the DATA CONTEXT below — use exact names, numbers, and dates. Do NOT invent any names, values, or entities not present in the data.
- dataSourcesUsed: list the exact array names from DATA CONTEXT that are relevant (e.g. "employees", "projects", "kpi_metrics")
- This will be rendered as: ${styleDesc}
- Do NOT suggest dashboard cards, KPI tiles, or component grids
- Output ONLY the JSON object.

## DATA CONTEXT (use exact names and values from this):
${dataContext}`;
}

function buildLayoutInspectorPrompt(mode) {
  const isEditorial = mode === "infographic" || mode === "diagram";
  return `You are a frontend layout inspector. Your job is to statically analyze HTML/CSS/SVG source code and identify elements that will visually clip, overflow, or not render correctly in a browser iframe.

Output ONLY valid JSON — no markdown, no prose, no code fences.

Schema:
{
  "severity": "none" | "minor" | "major",
  "clippingIssues": [string],
  "overflowIssues": [string],
  "sizingIssues": [string],
  "fixes": [string]
}

Scan specifically for these patterns:

CLIPPING — elements likely to get cut off:
- SVG elements that lack \`overflow="visible"\` when labels/text extend near the edges
- SVG \`<text>\` nodes near the top/bottom of the viewBox without padding
- Funnel, pyramid, or trapezoid shapes where bottom labels fall outside the SVG height
- D3 or inline SVG charts where the SVG height is too small for axis labels
- \`clip-path\` applied to a container that cuts off child elements
- Recharts containers where \`height\` is a fixed small value (< 200px)
- Any chart legend that overlaps or overflows the chart area

OVERFLOW — containers hiding content:
- \`overflow: hidden\` on a flex/grid container that holds a chart or diagram
- \`overflow: hidden\` on a card/div that contains an SVG with labels
- Parent container with a fixed \`max-height\` smaller than chart content
- \`white-space: nowrap\` on labels that may get cut

SIZING — wrong dimensions:
- SVG \`width\` or \`height\` attributes set to 0 or very small values
- Recharts \`<ResponsiveContainer>\` with \`height="100%"\` inside a flex parent with no fixed height
- Absolute-positioned elements with no containing block
- Elements wider than their container causing horizontal scroll inside the canvas
- Container div with a fixed \`height\` or \`min-height\` larger than its SVG content — causes whitespace gap below charts
- D3 SVG whose \`height\` attribute is set before simulation ends (should be set inside the "end" callback after computing node bounding box)

For each issue found, write a concrete, specific fix in the "fixes" array (e.g. "Add overflow='visible' to the funnel SVG on line ~N" or "Change the KPI row container from overflow:hidden to overflow:visible").

If no issues are found, set severity to "none" and leave all arrays empty.

${isEditorial ? "This is an editorial infographic/diagram — pay special attention to SVG viewBox bounds and text label overflow." : "This is a dashboard — pay special attention to Recharts ResponsiveContainer heights and card overflow:hidden."}

Output ONLY the JSON object.`;
}

// ── Multi-agent pipeline ───────────────────────────────────────────────────────

async function runPipeline(prompt, mode, dataContext, apiKey) {
  const MAX_REFINE_LOOPS = 2;
  const isEditorial = mode === "infographic" || mode === "diagram";

  let planSpec, styleGuide;

  if (isEditorial) {
    // Editorial modes: use a narrative planner instead of dashboard planner; skip Stylist
    const planRaw = await callClaude(
      buildEditorialPlannerPrompt(mode, dataContext),
      `User request: ${prompt}`,
      apiKey, 2000
    );
    try { planSpec = JSON.parse(planRaw); }
    catch { planSpec = { title: prompt, sections: [], dataSourcesUsed: [], visualMetaphors: [] }; }
    styleGuide = null; // not used for editorial modes
  } else {
    // Dashboard modes: Planner + Stylist
    const planRaw = await callClaude(
      buildPlannerPrompt(),
      `User request: ${prompt}\n\nDATA CONTEXT:\n${dataContext}`,
      apiKey, 2000
    );
    try { planSpec = JSON.parse(planRaw); }
    catch { planSpec = { title: "Dashboard", components: [], layout: "grid", dataSourcesUsed: [], highlights: [] }; }

    const styleRaw = await callClaude(
      buildStylistPrompt(),
      `PLAN SPEC:\n${JSON.stringify(planSpec, null, 2)}`,
      apiKey, 1000
    );
    try { styleGuide = JSON.parse(styleRaw); }
    catch {
      styleGuide = {
        colorScheme: "dark", primaryAccent: "#2563eb", cardStyle: "flat",
        density: "normal", chartPalette: ["#2563eb","#10b981","#f59e0b","#ec4899","#8b5cf6","#38bdf8"],
      };
    }
  }

  // Step 3: Visualizer
  const sysPrompt = mode === "mui" ? buildMuiSystemPrompt(dataContext)
    : mode === "charts" ? buildChartsSystemPrompt(dataContext)
    : mode === "infographic" ? buildInfographicSystemPrompt(dataContext)
    : mode === "diagram" ? buildDiagramSystemPrompt(dataContext)
    : buildHtmlSystemPrompt(dataContext);

  let visualizerPrompt;
  if (isEditorial) {
    // For editorial modes: inject narrative direction, NOT dashboard component specs
    const s = planSpec;
    visualizerPrompt = `[EDITORIAL BRIEF — follow this narrative direction closely]
Title: ${s.title}${s.subtitle ? `\nSubtitle: ${s.subtitle}` : ""}
Narrative: ${s.narrative || ""}
Sections: ${(s.sections || []).map(sec => `${sec.heading} (${sec.purpose}, visual: ${sec.visualType}, facts: ${(sec.keyFacts || []).join("; ")})`).join(" | ")}
Data sources to draw from: ${(s.dataSourcesUsed || []).join(", ")}
Visual metaphors: ${(s.visualMetaphors || []).join(", ")}
Typography: ${s.typography || "serif"}, mood: ${s.colorMood || "editorial"}
[END EDITORIAL BRIEF]

IMPORTANT: Output a ${mode === "infographic" ? "full editorial infographic — NOT a dashboard" : "technical diagram/academic figure — NOT a dashboard"}. No MUI components. No card grids. Follow the section structure above.

USER REQUEST:\n${prompt}`;
  } else {
    // Dashboard modes: inject component/style spec
    visualizerPrompt = `[PIPELINE CONTEXT — follow this specification closely]
Title: ${planSpec.title}
Layout: ${planSpec.layout}
Components: ${(planSpec.components || []).map(c => `${c.type} (${c.purpose})`).join(", ")}
Data sources: ${(planSpec.dataSourcesUsed || []).join(", ")}
Key insights: ${(planSpec.highlights || []).join("; ")}
Style: ${styleGuide.colorScheme} scheme, accent ${styleGuide.primaryAccent}, ${styleGuide.cardStyle} cards, ${styleGuide.density} density
Chart palette: ${(styleGuide.chartPalette || []).join(", ")}
[END PIPELINE CONTEXT]

USER REQUEST:\n${prompt}`;
  }

  let html = await callClaude(sysPrompt, visualizerPrompt, apiKey, 16000);

  // Step 3.5: Layout Inspector — scan for clipping/overflow/sizing issues
  const layoutRaw = await callClaude(
    buildLayoutInspectorPrompt(mode),
    `HTML TO INSPECT:\n${html}`,
    apiKey, 1500
  );
  let layoutReport;
  try { layoutReport = JSON.parse(layoutRaw); }
  catch { layoutReport = { severity: "none", clippingIssues: [], overflowIssues: [], sizingIssues: [], fixes: [] }; }

  // If layout issues found, do a targeted fix pass before the Critic
  if (layoutReport.severity !== "none" && layoutReport.fixes && layoutReport.fixes.length > 0) {
    const allLayoutIssues = [
      ...(layoutReport.clippingIssues || []),
      ...(layoutReport.overflowIssues || []),
      ...(layoutReport.sizingIssues || []),
    ];
    const layoutFixPrompt = `You previously generated this ${isEditorial ? mode : "dashboard"}. A layout inspector found display issues that will cause elements to clip or overflow in the browser. Fix ALL of them exactly as specified.

LAYOUT ISSUES DETECTED:
${allLayoutIssues.map((v, i) => `${i+1}. ${v}`).join("\n")}

SPECIFIC FIXES TO APPLY:
${layoutReport.fixes.map((v, i) => `${i+1}. ${v}`).join("\n")}

RULES:
- Apply every fix listed above
- Do NOT change colors, data, or layout structure — only fix the clipping/overflow/sizing
- Add overflow="visible" to SVGs that clip labels
- Ensure all chart containers have explicit heights
- Remove overflow:hidden from any container that wraps a chart
- Return the complete corrected HTML

CURRENT HTML:\n${html}`;
    html = await callClaude(sysPrompt, layoutFixPrompt, apiKey, 16000);
  }

  // Step 4: Critic
  const criticRaw = await callClaude(
    buildCriticPrompt(mode),
    `ORIGINAL USER REQUEST:\n${prompt}\n\nGENERATED HTML:\n${html}`,
    apiKey, 2000
  );
  let criticFeedback;
  try { criticFeedback = JSON.parse(criticRaw); }
  catch { criticFeedback = { score: 7, issues: [], suggestions: [] }; }

  // Merge layout issues into critic feedback so UI can show them
  if (layoutReport.severity !== "none") {
    const layoutIssuesSummary = [
      ...(layoutReport.clippingIssues || []).map(i => `[Layout] ${i}`),
      ...(layoutReport.overflowIssues || []).map(i => `[Layout] ${i}`),
      ...(layoutReport.sizingIssues || []).map(i => `[Layout] ${i}`),
    ];
    criticFeedback.issues = [...(criticFeedback.issues || []), ...layoutIssuesSummary];
    criticFeedback.suggestions = [
      ...(criticFeedback.suggestions || []),
      ...(layoutReport.fixes || []).map(f => `[Layout fix] ${f}`),
    ];
  }

  // Step 5: Refiner loop
  let refinements = 0;
  const outputTypeName = isEditorial ? (mode === "infographic" ? "infographic" : "diagram") : "dashboard";
  while (
    refinements < MAX_REFINE_LOOPS &&
    (criticFeedback.score < 7 || (criticFeedback.issues && criticFeedback.issues.length > 0))
  ) {
    const refinePrompt = `You previously generated this ${outputTypeName}. Fix these issues:\n\nCRITIC SCORE: ${criticFeedback.score}/10\nISSUES:\n${(criticFeedback.issues || []).map((v, i) => `${i+1}. ${v}`).join("\n")}\nSUGGESTIONS:\n${(criticFeedback.suggestions || []).map((v, i) => `${i+1}. ${v}`).join("\n")}\n\nApply all fixes. Return complete improved HTML. No other changes.\n\nCURRENT HTML:\n${html}`;
    html = await callClaude(sysPrompt, refinePrompt, apiKey, 16000);
    refinements++;

    if (refinements < MAX_REFINE_LOOPS) {
      const recriticRaw = await callClaude(
        buildCriticPrompt(mode),
        `ORIGINAL USER REQUEST:\n${prompt}\n\nGENERATED HTML:\n${html}`,
        apiKey, 2000
      );
      try { criticFeedback = JSON.parse(recriticRaw); }
      catch { break; }
      if (criticFeedback.score >= 7 && (!criticFeedback.issues || criticFeedback.issues.length === 0)) break;
    }
  }

  return { html, planSpec, styleGuide, criticFeedback, layoutReport, refinements };
}

// ── Shared Claude call ────────────────────────────────────────────────────────

async function callClaude(systemPrompt, userPrompt, apiKey, maxTokens = 16000) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
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

app.post("/generate-infographic", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });
  try {
    const dataContext = buildDataContext();
    const html = await callClaude(buildInfographicSystemPrompt(dataContext), prompt, apiKey);
    res.json({ html });
  } catch (err) {
    console.error("/generate-infographic error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

app.post("/generate-diagram", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });
  try {
    const dataContext = buildDataContext();
    const html = await callClaude(buildDiagramSystemPrompt(dataContext), prompt, apiKey);
    res.json({ html });
  } catch (err) {
    console.error("/generate-diagram error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

// ── POST /generate-pipeline ────────────────────────────────────────────────────

app.post("/generate-pipeline", async (req, res) => {
  const { prompt, mode = "html" } = req.body;
  if (!prompt) return res.status(400).json({ error: "prompt is required" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });
  try {
    const dataContext = buildDataContext();
    const result = await runPipeline(prompt, mode, dataContext, apiKey);
    res.json(result);
  } catch (err) {
    console.error("/generate-pipeline error:", err.message);
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
    const updated = await callClaude(systemPrompt, instruction, apiKey, 16000);
    res.json({ html: updated });
  } catch (err) {
    console.error("/edit error:", err.message);
    res.status(502).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT}`));
