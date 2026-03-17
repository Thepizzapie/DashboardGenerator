import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import MuiCanvas from "./MuiCanvas";

const EXAMPLE_PROMPTS = {
  html: [
    "Project status dashboard with progress bars",
    "KPI overview with stat cards and deltas",
    "Employee directory table with status badges",
    "Inventory view with stock levels and reorder alerts",
    "Sales pipeline by stage with deal values",
    "Sprint board showing story points and velocity",
    "Budget vs actual spend by department",
    "Support ticket queue with priority and age",
    "Executive summary — KPIs, projects, and headcount",
    "Q1 revenue vs target with trend breakdown",
  ],
  mui: [
    "Project status dashboard with progress bars",
    "KPI overview with stat cards and deltas",
    "Employee directory table with status badges",
    "Inventory view with stock levels and reorder alerts",
    "Sales pipeline by stage with deal values",
    "Sprint board showing story points and velocity",
    "Budget vs actual spend by department",
    "Support ticket queue with priority and age",
    "Executive summary — KPIs, projects, and headcount",
    "Q1 revenue vs target with trend breakdown",
  ],
  charts: [
    "Revenue trend line chart by month",
    "Budget vs actual bar chart by department",
    "Sales pipeline value by stage",
    "Inventory fill rate as a bar chart",
    "Sprint velocity across last 5 sprints",
    "KPI progress toward targets as bar chart",
    "Employee headcount by department pie chart",
    "Support tickets by priority over time",
  ],
};

const MODE_HINT = {
  html: "Renders raw HTML with CSS component library",
  mui: "Renders full React + MUI page in sandboxed iframe",
  charts: "Renders React + MUI + Recharts dashboard in sandboxed iframe",
};

const VALUE_STATS = [
  {
    icon: "⚡",
    value: "3",
    label: "Canvas modes",
    detail: "HTML, MUI, and Recharts — pick the right renderer for your use case.",
  },
  {
    icon: "🗄️",
    value: "8",
    label: "Built-in data sources",
    detail: "Employees, projects, KPIs, budget, pipeline, sprint, inventory, support.",
  },
  {
    icon: "🔌",
    value: "∞",
    label: "Bring your own data",
    detail: "Plug in any JSON API, upload a CSV, or paste raw JSON — no schema required.",
  },
];

function EmptyState({ onChipClick }) {
  return (
    <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 4, py: 6, gap: 6 }}>

      {/* Headline */}
      <Box sx={{ textAlign: "center", maxWidth: 520 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: "-0.03em", mb: 1 }}>
          The dashboard tool you're looking for.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
          Describe a dashboard in plain English. Dashy generates a fully rendered UI backed by real data — instantly.
          Connect your own sources or use the built-in mock data to get started.
        </Typography>
      </Box>

      {/* Stat cards */}
      <Stack direction="row" spacing={2} sx={{ width: "100%", maxWidth: 640 }}>
        {VALUE_STATS.map((s) => (
          <Box
            key={s.value}
            sx={{
              flex: 1,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
            }}
          >
            <Typography sx={{ fontSize: 22, lineHeight: 1, mb: 0.5 }}>{s.icon}</Typography>
            <Typography sx={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: "primary.light" }}>
              {s.value}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, color: "text.primary", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {s.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, mt: 0.5 }}>
              {s.detail}
            </Typography>
          </Box>
        ))}
      </Stack>

      {/* Prompt hint */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="caption" color="text.disabled">
          Pick an example prompt above or type your own — then hit Generate.
        </Typography>
      </Box>
    </Box>
  );
}

export default function GenerationArea({ mode, onModeChange, onGenerate, output, isLoading, error }) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);

  function handleChipClick(chip) {
    setPrompt(chip);
    textareaRef.current?.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim());
  }

  const examples = EXAMPLE_PROMPTS[mode] ?? EXAMPLE_PROMPTS.html;

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

      {/* ── Mode tabs ─────────────────────────────────────────────────────── */}
      <Box sx={{
        borderBottom: 1, borderColor: "divider",
        bgcolor: "background.paper",
        px: 2,
        display: "flex", alignItems: "center", gap: 2,
      }}>
        <Tabs
          value={mode}
          onChange={(_, v) => onModeChange(v)}
          sx={{
            minHeight: 48,
            "& .MuiTab-root": { minHeight: 48, py: 0, fontSize: 13, fontWeight: 500 },
            "& .MuiTabs-indicator": { height: 2, borderRadius: "2px 2px 0 0" },
          }}
        >
          <Tab value="html" label="HTML Canvas" />
          <Tab value="mui" label="MUI Canvas" />
          <Tab
            value="charts"
            label={
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <span>Charts Canvas</span>
                <Chip label="NEW" size="small" color="primary" sx={{ height: 16, fontSize: 9, fontWeight: 800, pointerEvents: "none" }} />
              </Stack>
            }
          />
        </Tabs>
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto", display: { xs: "none", md: "block" } }}>
          {MODE_HINT[mode]}
        </Typography>
      </Box>

      {/* ── Prompt panel ──────────────────────────────────────────────────── */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1, borderColor: "divider",
          p: 2,
          display: "flex", flexDirection: "column", gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {examples.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              size="small"
              variant={prompt === chip ? "filled" : "outlined"}
              color={prompt === chip ? "primary" : "default"}
              onClick={() => handleChipClick(chip)}
              sx={{ cursor: "pointer", fontSize: 11 }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
          <TextField
            inputRef={textareaRef}
            fullWidth
            multiline
            rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the dashboard you want to generate…"
            size="small"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(e);
            }}
            sx={{ "& .MuiOutlinedInput-root": { fontSize: 13 } }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!prompt.trim() || isLoading}
            sx={{ height: 56, minWidth: 120, flexShrink: 0, fontWeight: 600 }}
            startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}
          >
            {isLoading ? "Generating…" : "Generate"}
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Ctrl / ⌘ + Enter to generate · Mode: <strong>{mode === "mui" ? "MUI iframe" : mode === "charts" ? "Charts iframe" : "HTML canvas"}</strong>
        </Typography>
      </Box>

      {/* ── Canvas ────────────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {(mode === "mui" || mode === "charts") ? (
          <MuiCanvas html={output} isLoading={isLoading} error={error} />
        ) : (
          <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {!output && !isLoading && !error && (
              <EmptyState onChipClick={(chip) => { setPrompt(chip); textareaRef.current?.focus(); }} />
            )}

            {isLoading && (
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, color: "text.secondary" }}>
                <CircularProgress size={32} />
                <Typography variant="body2">Generating your dashboard…</Typography>
              </Box>
            )}

            {error && !isLoading && (
              <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            {output && !isLoading && (
              <Box sx={{ p: 3 }}>
                <div className="canvas-output" dangerouslySetInnerHTML={{ __html: output }} />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
