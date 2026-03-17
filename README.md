# Dashboard Generator

Generate data dashboards from natural language prompts using Claude. Type a prompt, pick a rendering mode, and get a fully rendered UI backed by real mock data.

## Stack

- **Client** — React 18 + Vite + Material UI (dark theme, easy to retheme)
- **Server** — Express proxy that holds the API key and builds the system prompt
- **AI** — Claude (claude-sonnet-4-20250514) via Anthropic API

## Structure

```
DashboardGenerator/
├── client/          # Vite + React + MUI frontend
│   └── src/
│       ├── theme.js                    # MUI theme (edit here to retheme)
│       ├── App.jsx                     # Root layout
│       └── components/
│           ├── Sidebar.jsx             # Component + data source registry
│           ├── GenerationArea.jsx      # Prompt input, mode tabs, HTML canvas
│           └── MuiCanvas.jsx           # Sandboxed iframe for MUI output
├── server/
│   └── server.js    # Express proxy + mock data + system prompts
├── .env             # Your API key — create from .env.example
└── .env.example
```

## Setup

**1. Create your `.env`**
```bash
cp .env.example .env
# Set ANTHROPIC_API_KEY=sk-ant-...
```

**2. Install dependencies**
```bash
cd server && npm install
cd ../client && npm install
```

**3. Run (two terminals)**
```bash
# Terminal 1
cd server && node server.js      # → http://localhost:3001

# Terminal 2
cd client && npm run dev          # → http://localhost:5173
```

## Generation modes

### HTML Canvas
Claude returns raw HTML using a predefined CSS component library. Output is injected directly into the canvas via `dangerouslySetInnerHTML`.

| Class | Purpose |
|---|---|
| `.stats-grid` + `.stat-card` | KPI metric grid |
| `.stat-delta.positive / .negative` | Colored change indicator |
| `.card` | Bordered container |
| `.progress-bar` + `.progress-fill` | Progress indicator (width set inline) |
| `.badge-green / red / amber / blue` | Status pills |
| `table / thead / tbody` | Data tables |
| `.list-item` | Flex row, space-between |

### MUI Canvas
Claude returns a complete self-contained HTML page (React 18 + MUI v5 from CDN + Babel) rendered in a sandboxed `<iframe srcDoc>`. Uses the same dark theme as the app shell.

Available MUI components: `Box` `Stack` `Grid` `Card` `Typography` `Table*` `Chip` `LinearProgress` `Avatar` `List` `Paper` `Divider`

## Data sources

Eight mock data sources are injected into every request. Claude is instructed to derive computed values (ratios, percentages, aggregates) from the raw fields:

| Source | Key fields |
|---|---|
| `employees` | name, dept, role, status, salary |
| `projects` | name, owner, pct_complete, **budget, spent**, due_date |
| `kpi_metrics` | label, value, **current_val, target**, delta |
| `inventory` | item, qty, **capacity, reorder_point**, status |
| `sales_pipeline` | deal, stage, value, **probability**, close_date, rep |
| `support` | subject, priority, status, assignee, **hours_open** |
| `budget` | department, **allocated, spent** → derive % used |
| `sprint` | story, **points**, status → derive velocity |

## Example prompts

- Project status dashboard with budget burn rates
- KPI overview showing progress toward targets
- Sales pipeline by stage with weighted values
- Sprint board with velocity and completion rate
- Budget vs actual spend by department
- Support ticket queue with SLA breach indicators
- Executive summary — KPIs, active projects, headcount
