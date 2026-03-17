# Dashy

**Spin up a Claude-powered dashboard in minutes against your own data.**

Dashy is a free, open-source dashboard generator for teams that want to explore internal data visually — without BI tool licenses, vendor lock-in, or a full frontend build. Describe what you want in plain English and get a working dashboard back instantly.

> Built for developers who want to experiment fast. Companies are encouraged to use Dashy as a rapid internal prototyping tool before committing to a full solution.

![Dashy logo](client/public/logo.png)

---

## Why Dashy?

Most BI tools are expensive, slow to set up, and opinionated about your data model. Dashy is the opposite:

- **Bring your own data** — connect any JSON API, paste raw JSON, or upload a CSV
- **Bring your own API key** — you pay Anthropic directly, we hold nothing
- **Self-host in minutes** — one `npm install` each in `/server` and `/client`
- **MIT licensed** — fork it, extend it, ship it internally

---

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/your-org/dashy.git
cd dashy

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

## Connecting your data

Dashy supports three ways to bring in data:

### JSON API
Point Dashy at any endpoint that returns JSON. Optionally add auth headers (Bearer tokens, API keys, etc.). Data is cached locally in SQLite with a configurable TTL — hit the refresh button in the sidebar to pull fresh data on demand.

### CSV upload
Upload any `.csv` file (up to 5 MB). Dashy parses it server-side and makes the rows available to Claude as a named data source. Great for spreadsheet exports, database dumps, or ad-hoc data files.

### JSON paste
Paste a JSON array directly into the dialog. Useful for one-off exploration or when your data is already in your clipboard from another tool.

All sources persist in a local `server/dashy.sqlite3` file and survive server restarts. They are merged with the built-in mock data and injected into every generation prompt automatically. A user-added source with the same name as a mock source will override it.

---

## Generation modes

| Mode | Description | Best for |
|------|-------------|----------|
| **HTML Canvas** | Raw HTML using a predefined CSS library | Quick stats, tables, badges, progress bars |
| **MUI Canvas** | Full React + Material UI page in a sandboxed iframe | Rich layouts, chips, linear progress, avatars |
| **Charts Canvas** | React + MUI + Recharts dashboard in a sandboxed iframe | Bar, line, area, and pie charts from your data |

---

## Built-in mock data

Dashy ships with 8 realistic mock datasets so you can generate dashboards immediately with no setup:

| Source | Fields |
|--------|--------|
| `employees` | name, dept, role, status, hire_date, salary |
| `projects` | name, owner, status, pct_complete, budget, spent, due_date |
| `kpi_metrics` | label, value, delta, target, current_val |
| `inventory` | item, sku, qty, capacity, unit, status, reorder_point |
| `sales_pipeline` | deal, stage, value, probability, close_date, rep |
| `support` | id, subject, priority, status, assignee, hours_open |
| `budget` | department, allocated, spent |
| `sprint` | story, points, status, assignee, sprint |

---

## Example prompts

```
Revenue trend line chart by month
Budget vs actual bar chart by department
Employee headcount by department pie chart
KPI overview with stat cards and deltas
Sales pipeline by stage with deal values
Sprint board showing story points and velocity
Support ticket queue with priority and age
Inventory fill rate as a bar chart
```

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, MUI v5 |
| Backend | Node.js, Express |
| AI | Claude (claude-sonnet-4) via Anthropic API |
| Persistence | SQLite via better-sqlite3 |
| Charts | Recharts v2 (CDN, loaded inside generated output) |

---

## Project structure

```
dashy/
├── server/
│   ├── server.js            # Express server, Claude integration, generation routes
│   ├── db.js                # SQLite init + CRUD helpers
│   └── routes/
│       └── sources.js       # /api/sources, /api/upload-csv
├── client/
│   ├── index.html
│   ├── public/
│   │   └── logo.svg
│   └── src/
│       ├── App.jsx
│       ├── theme.js
│       └── components/
│           ├── GenerationArea.jsx   # Prompt input + canvas tabs
│           ├── Sidebar.jsx          # Component registry + data sources
│           ├── MuiCanvas.jsx        # Sandboxed iframe renderer
│           └── AddSourceDialog.jsx  # Dialog for adding data sources
├── .env.example
├── LICENSE                  # MIT
└── README.md
```

---

## API reference

The Express server exposes these endpoints on `localhost:3001`:

### Generation
| Method | Route | Body | Description |
|--------|-------|------|-------------|
| POST | `/generate` | `{ prompt }` | Generate HTML canvas output |
| POST | `/generate-mui` | `{ prompt }` | Generate MUI React output |
| POST | `/generate-charts` | `{ prompt }` | Generate Recharts dashboard |

### Data sources
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/sources` | List all user sources |
| POST | `/api/sources` | Create a URL or JSON source |
| DELETE | `/api/sources/:id` | Delete a source |
| POST | `/api/sources/:id/fetch` | Fetch/refresh a URL source |
| POST | `/api/upload-csv` | Upload and parse a CSV file |

---

## Contributing

Pull requests are welcome. Dashy is intentionally kept small — the goal is a tool developers can understand, fork, and adapt in an afternoon, not a platform.

Good first contributions:
- Additional generation modes (plain Recharts, Tailwind CSS, D3)
- Database connector — a proxy that runs a SQL query and returns results as a Dashy source
- Docker Compose setup for team self-hosting
- Auth layer (simple token or SSO) for shared deployments
- Export generated dashboards as standalone HTML files

---

## License

MIT — see [LICENSE](LICENSE). Free to use, modify, and self-host. No attribution required.
