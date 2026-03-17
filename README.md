# Dashy

**Spin up a Claude-powered dashboard in minutes against your own data.**

Dashy is a free, open-source dashboard generator for teams that want to explore internal data visually — without BI tool licenses, vendor lock-in, or a full frontend build. Describe what you want in plain English and get a fully interactive dashboard back instantly.

> Built for developers who want to experiment fast. Companies are encouraged to use Dashy as a rapid internal prototyping tool before committing to a full solution.

![Dashy logo](client/public/logo.png)

---

## Why Dashy?

Most BI tools are expensive, slow to set up, and opinionated about your data model. Dashy is the opposite:

- **Bring your own data** — connect any JSON API, Google Sheets, Notion, Airtable, PostgreSQL/MySQL, paste raw JSON, or upload a CSV
- **Bring your own API key** — you pay Anthropic directly, we hold nothing
- **Self-host in minutes** — one `npm install` each in `/server` and `/client`
- **Export and hand off** — download any generated dashboard as a standalone `.html` file with all dependencies documented
- **MIT licensed** — fork it, extend it, ship it internally

---

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/Thepizzapie/DashboardGenerator.git
cd DashboardGenerator

cd server && npm install
cd ../client && npm install
```

### 2. Add your Anthropic API key

```bash
cp .env.example .env
# Edit .env — set ANTHROPIC_API_KEY=sk-ant-...
```

Your key is used only by the local Express server to call Claude. It never leaves your machine.

### 3. Start

```bash
# Terminal 1 — server (port 3001)
cd server && npm run dev

# Terminal 2 — client (port 5173)
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Generation modes

| Mode | Description | Best for |
|------|-------------|----------|
| **HTML Canvas** | Raw HTML using a predefined CSS component library | Quick stats, tables, badges, timelines, kanban boards |
| **MUI Canvas** | Full React + Material UI page in a sandboxed iframe | Interactive dashboards with tabs, filters, sortable tables |
| **Charts Canvas** | React + MUI + Recharts in a sandboxed iframe | Bar, line, area, pie, radar, treemap, funnel charts |

All three modes support **interactive features** — Claude generates `useState` hooks for tab switching, status filters, sortable columns, search inputs, and time-range toggles automatically when you describe them.

---

## Available components

### HTML Canvas (16 components)
| Component | Use case |
|-----------|----------|
| Stat Card Grid | Big KPI numbers with labels, values, and trend arrows |
| Card Container | Bordered glass surface for grouping content |
| Progress Bar | Gradient fill track — width set per row |
| Status Badge | Color-coded pills: green / red / amber / blue |
| Data Table | Sortable rows with hover highlights |
| Alert Banner | Info / success / warning / error strips |
| Tabs | JS-driven tab switching with active state |
| Timeline | Vertical event list with color-coded dot markers |
| Kanban Board | Status-based column layout |
| Activity Feed | Avatar + text + timestamp stream |
| Donut Chart | CSS conic-gradient ring with percentage |
| Heatmap Grid | Color-intensity cells (5 levels) |
| Sparkline | Inline SVG mini trend chart |
| Key/Value Grid | Two-column label/value pairs |
| List Row | Flex row with left label and right value |

### MUI Canvas (18+ components + React hooks)
Tabs, ToggleButtonGroup, Accordion, Alert, Badge, Tooltip, Switch, Rating, Stepper, Skeleton, CircularProgress, AvatarGroup — plus `useState` / `useMemo` for full interactivity.

### Charts Canvas (15 chart types + MUI)
BarChart, LineChart, AreaChart, ComposedChart, PieChart, RadarChart, RadialBarChart, ScatterChart, Treemap, FunnelChart — plus Brush (zoom/scroll), ReferenceLine (targets), and interactive filters.

---

## Edit dashboard

After generating, the **Edit Dashboard** panel gives you:

- **Color themes** — one-click gradient swatches (Blue, Violet, Emerald, Amber, Rose, Cyan, Slate, Light)
- **Layout edits** — compact/spacious, KPIs at top, 2-column layout, add summary section
- **Style edits** — shadows, flat/minimal, glass effect, rounded corners, larger text
- **Data edits** — add totals row, show percentages, sort descending, add filter control, conditional colors
- **Custom instruction** — plain English to Claude: "Move the KPI cards to the top, make the table sortable by salary"

All edits are powered by Claude — it rewrites the HTML directly.

---

## Export for dev handoff

Click **Export HTML** to download a standalone `.html` file. Every exported file includes:

- A full comment block at the top listing the exact stack, CDN URLs, component inventory, and dev notes
- All CSS styles embedded (HTML mode) or CDN scripts listed (MUI/Charts mode)
- `npm install` instructions for productionizing CDN-based outputs

The file opens directly in a browser with no build step. Hand it to any developer as a working prototype.

---

## Connecting your data

Dashy supports 8 data source types:

| Type | How it works |
|------|-------------|
| **URL / JSON API** | Fetches any endpoint that returns JSON. Add auth headers (Bearer, API key, etc.). Cached in SQLite with TTL. |
| **CSV upload** | Upload `.csv` up to 5 MB — parsed server-side. |
| **JSON paste** | Paste a JSON array directly into the dialog. |
| **Webhook** | Dashy generates a `POST /api/webhook/:token` URL. Push data to it from any system. |
| **Google Sheets** | Sheets API v4 — provide Sheet ID + API key or service account. |
| **Notion** | Notion API — provide database ID + integration token. |
| **Airtable** | Airtable REST API — provide base ID, table name + API key. |
| **PostgreSQL / MySQL** | Run a SQL query — provide connection string + query. |

All sources persist in `server/dashy.sqlite3` and survive server restarts. A user source with the same name as a mock source overrides it.

---

## Built-in mock data

8 realistic datasets available immediately with no setup:

| Source | Rows | Fields |
|--------|------|--------|
| `employees` | 10 | name, dept, role, status, hire_date, salary |
| `projects` | 7 | name, owner, status, pct_complete, budget, spent, due_date |
| `kpi_metrics` | 8 | label, value, delta, target, current_val |
| `inventory` | 8 | item, sku, qty, capacity, unit, status, reorder_point |
| `sales_pipeline` | 7 | deal, stage, value, probability, close_date, rep |
| `support` | 7 | id, subject, priority, status, assignee, hours_open |
| `budget` | 7 | department, allocated, spent |
| `sprint` | 8 | story, points, status, assignee, sprint |

---

## Example prompts

```
Revenue trend line chart with time-range toggle (7d/30d/90d)
Budget vs actual composed bar+line chart by department
Employee directory table filterable by department
Sales pipeline funnel chart with conversion rates
KPI overview with stat cards, sparklines and tab sections
Sprint velocity radar chart across team members
Support ticket queue sortable by priority and hours open
Full analytics dashboard: composed chart + pie + radar + treemap
```

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, MUI v5, Plus Jakarta Sans |
| Backend | Node.js, Express |
| AI | Claude (`claude-sonnet-4-20250514`) via Anthropic API |
| Persistence | SQLite via better-sqlite3 |
| Charts | Recharts 2.12.7 (UMD CDN inside generated iframes) |
| External connectors | Google Sheets API, Notion API, Airtable REST, pg, mysql2 |

---

## Project structure

```
DashboardGenerator/
├── server/
│   ├── server.js            # Express server, Claude prompts, generation routes
│   ├── db.js                # SQLite init + CRUD helpers (with migration support)
│   ├── connectors.js        # External data source connectors (Sheets, Notion, etc.)
│   └── routes/
│       └── sources.js       # /api/sources, /api/upload-csv, /api/webhook/:token
├── client/
│   ├── index.html           # Google Fonts: Plus Jakarta Sans + JetBrains Mono
│   ├── public/logo.png
│   └── src/
│       ├── App.jsx          # Root: theme, layout, global Snackbar toast
│       ├── theme.js         # createAppTheme(mode) — dark/light MUI theme
│       ├── App.css          # HTML canvas component styles + blob animations
│       └── components/
│           ├── GenerationArea.jsx   # Prompt input, mode tabs, canvas
│           ├── Sidebar.jsx          # Component registry + data sources panel
│           ├── EditPanel.jsx        # Edit tabs, color presets, export
│           ├── MuiCanvas.jsx        # Sandboxed iframe renderer + viewport frames
│           └── AddSourceDialog.jsx  # 8-type data source dialog with live preview
├── .env.example
├── LICENSE                  # MIT
└── README.md
```

---

## API reference

| Method | Route | Body | Description |
|--------|-------|------|-------------|
| POST | `/generate` | `{ prompt }` | Generate HTML canvas output |
| POST | `/generate-mui` | `{ prompt }` | Generate MUI React output |
| POST | `/generate-charts` | `{ prompt }` | Generate Recharts dashboard |
| POST | `/edit` | `{ html, instruction }` | Claude rewrites existing dashboard HTML |
| GET | `/api/sources` | — | List all user data sources |
| POST | `/api/sources` | source config | Create URL, JSON, webhook, DB, Sheets, Notion, or Airtable source |
| POST | `/api/sources/preview` | source config | Fetch without saving — returns first 10 rows |
| DELETE | `/api/sources/:id` | — | Delete a source |
| POST | `/api/sources/:id/fetch` | — | Refresh a live source (respects TTL) |
| POST | `/api/upload-csv` | `FormData { file, name }` | Upload and parse a CSV |
| POST | `/api/webhook/:token` | JSON array | Push data to a webhook source |

---

## Contributing

Pull requests are welcome. Dashy is intentionally kept small — the goal is a tool developers can understand, fork, and adapt in an afternoon.

Good first contributions:
- Additional generation modes (plain Tailwind CSS, shadcn/ui, D3)
- Docker Compose setup for team self-hosting
- Auth layer (simple token or SSO) for shared deployments
- Streaming generation (SSE) so the iframe updates as Claude writes

---

## License

MIT — see [LICENSE](LICENSE). Free to use, modify, and self-host. No attribution required.
