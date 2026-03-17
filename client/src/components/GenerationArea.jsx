import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTheme, alpha } from "@mui/material/styles";
import MuiCanvas from "./MuiCanvas";
import EditPanel from "./EditPanel";

// ── Viewport toggle ────────────────────────────────────────────────────────────

const VIEWPORTS = [
  { key: "desktop", label: "🖥", title: "Desktop" },
  { key: "tablet",  label: "⬜", title: "Tablet (768px)" },
  { key: "mobile",  label: "📱", title: "Mobile (390px)" },
];

function ViewportToggle({ viewport, onChange }) {
  return (
    <Stack direction="row" spacing={0.5}>
      {VIEWPORTS.map((v) => (
        <Tooltip key={v.key} title={v.title} arrow>
          <Box onClick={() => onChange(v.key)} sx={{
            width: 28, height: 28, borderRadius: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, cursor: "pointer", border: "1px solid",
            borderColor: viewport === v.key ? "rgba(37,99,235,0.6)" : "divider",
            bgcolor: viewport === v.key ? "rgba(37,99,235,0.12)" : "transparent",
            boxShadow: viewport === v.key ? "0 0 10px rgba(37,99,235,0.2)" : "none",
            "&:hover": { borderColor: "rgba(37,99,235,0.4)" },
            transition: "all 0.15s",
          }}>
            {v.label}
          </Box>
        </Tooltip>
      ))}
    </Stack>
  );
}

// ── Example prompts ────────────────────────────────────────────────────────────

const EXAMPLE_PROMPTS = {
  html: [
    "Project status dashboard with progress bars and timeline",
    "KPI overview with stat cards, deltas and sparklines",
    "Employee directory table with status badges, sortable by department",
    "Inventory view with stock levels, heatmap and reorder alerts",
    "Sales pipeline kanban board by stage",
    "Sprint board with velocity stats and activity feed",
    "Budget vs actual with donut charts per department",
    "Support ticket queue with priority badges, filterable by status",
    "Executive summary — KPIs, projects, and headcount with tabs",
    "Q1 revenue vs target with progress bars and alert banners",
  ],
  mui: [
    "Project dashboard with tab-switched views and progress tracking",
    "KPI overview with stat cards and filterable table",
    "Employee directory with department filter tabs and sortable table",
    "Inventory view with low-stock alerts and status toggles",
    "Sales pipeline with stage filter and weighted value breakdown",
    "Sprint board with velocity stats and accordion stories",
    "Budget vs actual with department stepper and circular progress",
    "Support tickets with priority filter toggle and accordion details",
    "Executive summary with tab-split sections for each team",
    "Multi-metric KPI dashboard with time-range toggle and ratings",
  ],
  charts: [
    "Revenue trend line chart with time-range toggle (7d/30d/90d)",
    "Budget vs actual composed bar+line chart by department",
    "Sales pipeline funnel chart with conversion rates",
    "Inventory fill rate radial bar chart",
    "Sprint velocity radar chart across team members",
    "KPI multi-metric radar vs target comparison",
    "Employee headcount treemap by department",
    "Support tickets scatter plot — priority vs hours open",
    "Full analytics dashboard: composed chart + pie + radar + treemap",
    "Department performance: stacked bar + line trend + donut breakdown",
  ],
};

const MODE_HINT = {
  html:   "Raw HTML + CSS component library",
  mui:    "React + Material UI · sandboxed iframe",
  charts: "React + MUI + Recharts · sandboxed iframe",
};

// ── Animated empty state ───────────────────────────────────────────────────────

function EmptyState() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const headlineGradient = isDark
    ? "linear-gradient(135deg, #e2e8f0 20%, #60a5fa 65%, #93c5fd 100%)"
    : "linear-gradient(135deg, #1e40af 20%, #2563eb 60%, #0ea5e9 100%)";

  const cardBg    = isDark ? "rgba(255,255,255,0.03)" : "rgba(37,99,235,0.04)";
  const cardBorder= isDark ? "rgba(255,255,255,0.07)" : "rgba(37,99,235,0.12)";
  const cardHover = isDark ? "rgba(37,99,235,0.25)"   : "rgba(37,99,235,0.25)";
  const subtext   = isDark ? alpha("#fff", 0.38)       : alpha(theme.palette.text.primary, 0.55);
  const hint      = isDark ? alpha("#fff", 0.18)       : alpha(theme.palette.text.primary, 0.35);

  return (
    <Box sx={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      px: 4, py: 6, gap: 5,
      position: "relative", overflow: "hidden",
    }}>

      {/* Floating blobs */}
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <Box sx={{
          position: "absolute", top: "10%", left: "15%",
          width: 320, height: 320, borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)",
          animation: "blob-float-1 9s ease-in-out infinite",
        }} />
        <Box sx={{
          position: "absolute", top: "30%", right: "10%",
          width: 260, height: 260, borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)",
          animation: "blob-float-2 11s ease-in-out infinite",
        }} />
        <Box sx={{
          position: "absolute", bottom: "10%", left: "40%",
          width: 200, height: 200, borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
          animation: "blob-float-3 13s ease-in-out infinite",
        }} />
      </Box>

      {/* Headline */}
      <Box sx={{ textAlign: "center", maxWidth: 580, position: "relative" }}>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: 26, md: 34 },
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.15,
            mb: 2,
            background: headlineGradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Build dashboards at the<br />speed of thought.
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: subtext, lineHeight: 1.85, maxWidth: 400, mx: "auto", fontSize: 14 }}
        >
          Describe what you want in plain English. Dashy generates a
          fully rendered UI backed by real data — in seconds.
        </Typography>
      </Box>

      {/* Stat cards */}
      <Stack direction="row" spacing={1.5} sx={{ width: "100%", maxWidth: 620, position: "relative" }}>
        {[
          { icon: "⚡", value: "3",  label: "Canvas modes",      detail: "HTML · MUI · Recharts" },
          { icon: "🗄️", value: "8",  label: "Built-in datasets", detail: "Ready to use, zero setup" },
          { icon: "🔌", value: "∞",  label: "Your own data",     detail: "API · CSV · JSON · DB · Webhook" },
        ].map((s) => (
          <Box key={s.label} sx={{
            flex: 1,
            background: cardBg,
            backdropFilter: "blur(12px)",
            border: "1px solid",
            borderColor: cardBorder,
            borderRadius: 3,
            p: 2.5,
            display: "flex", flexDirection: "column", gap: 0.5,
            transition: "border-color 0.2s, box-shadow 0.2s",
            "&:hover": {
              borderColor: cardHover,
              boxShadow: isDark
                ? "0 0 28px rgba(37,99,235,0.12)"
                : "0 4px 28px rgba(37,99,235,0.1)",
            },
          }}>
            <Typography sx={{ fontSize: 20, lineHeight: 1, mb: 0.5 }}>{s.icon}</Typography>
            <Typography sx={{
              fontSize: 30, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1,
              background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              {s.value}
            </Typography>
            <Typography variant="caption" sx={{
              fontWeight: 800, color: "text.primary", textTransform: "uppercase",
              letterSpacing: "0.06em", fontSize: 10,
            }}>
              {s.label}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.4, mt: 0.25, fontSize: 11 }}>
              {s.detail}
            </Typography>
          </Box>
        ))}
      </Stack>

      <Typography variant="caption" sx={{ color: hint, position: "relative", fontSize: 12 }}>
        Pick an example prompt below or type your own
      </Typography>
    </Box>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function GenerationArea({ mode, onModeChange, onGenerate, onApplyEdit, output, isLoading, isApplying, error, viewport, onViewportChange }) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  function handleChipClick(chip) { setPrompt(chip); textareaRef.current?.focus(); }
  function handleSubmit(e) { e.preventDefault(); if (!prompt.trim() || isLoading) return; onGenerate(prompt.trim()); }

  const examples = EXAMPLE_PROMPTS[mode] ?? EXAMPLE_PROMPTS.html;
  const showViewport = (mode === "mui" || mode === "charts") && output;

  const panelBg    = isDark ? "rgba(7,8,16,0.85)"  : "rgba(244,246,255,0.9)";
  const toolbarBg  = isDark ? "rgba(5,6,12,0.95)"  : "rgba(240,243,255,0.95)";
  const chipActive = isDark ? "rgba(37,99,235,0.14)" : "rgba(37,99,235,0.10)";
  const chipBorder = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.09)";
  const chipText   = isDark ? "rgba(255,255,255,0.38)" : alpha(theme.palette.text.primary, 0.55);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

      {/* ── Mode tabs ──────────────────────────────────────────────────────── */}
      <Box sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: panelBg,
        backdropFilter: "blur(16px)",
        px: 2,
        display: "flex", alignItems: "center", gap: 2,
      }}>
        <Tabs
          value={mode}
          onChange={(_, v) => onModeChange(v)}
          sx={{
            minHeight: 50,
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              minHeight: 34,
              my: "auto",
              px: 2,
              borderRadius: 5,
              fontSize: 12.5,
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: "0.01em",
              transition: "all 0.2s",
              "&:hover": {
                color: "text.primary",
                bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              },
              "&.Mui-selected": {
                color: "#fff",
                background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                boxShadow: "0 2px 16px rgba(37,99,235,0.35)",
              },
            },
          }}
        >
          <Tab value="html" label="HTML Canvas" />
          <Tab value="mui" label="MUI Canvas" />
          <Tab value="charts" label={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <span>Charts Canvas</span>
              <Box sx={{
                px: 0.75, py: 0.1, borderRadius: 3,
                background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                fontSize: 9, fontWeight: 800, color: "#fff",
                letterSpacing: "0.05em", lineHeight: "16px",
              }}>
                NEW
              </Box>
            </Stack>
          } />
        </Tabs>
        <Typography variant="caption" sx={{
          ml: "auto", color: "text.disabled",
          display: { xs: "none", md: "block" },
          fontSize: 11, letterSpacing: "0.01em",
        }}>
          {MODE_HINT[mode]}
        </Typography>
      </Box>

      {/* ── Prompt panel ───────────────────────────────────────────────────── */}
      <Box component="form" onSubmit={handleSubmit} sx={{
        bgcolor: panelBg,
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid",
        borderColor: "divider",
        p: 2, display: "flex", flexDirection: "column", gap: 1.5, flexShrink: 0,
      }}>
        {/* Example prompt chips */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
          {examples.map((chip) => {
            const isActive = prompt === chip;
            return (
              <Box
                key={chip}
                onClick={() => handleChipClick(chip)}
                sx={{
                  px: 1.25, py: 0.4, borderRadius: 10,
                  fontSize: 11.5, fontWeight: 500,
                  cursor: "pointer", border: "1px solid",
                  borderColor: isActive ? "rgba(37,99,235,0.55)" : chipBorder,
                  color: isActive ? "#60a5fa" : chipText,
                  bgcolor: isActive ? chipActive : "transparent",
                  boxShadow: isActive ? "0 0 12px rgba(37,99,235,0.12)" : "none",
                  transition: "all 0.15s",
                  "&:hover": {
                    borderColor: "rgba(37,99,235,0.35)",
                    color: "text.primary",
                    bgcolor: isDark ? "rgba(37,99,235,0.06)" : "rgba(37,99,235,0.06)",
                  },
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}
              >
                {chip}
              </Box>
            );
          })}
        </Box>

        {/* Input row */}
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
          <TextField
            inputRef={textareaRef}
            fullWidth multiline rows={2}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the dashboard you want to generate…"
            size="small"
            disabled={isLoading}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(e); }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={!prompt.trim() || isLoading}
            sx={{ height: 56, minWidth: 130, flexShrink: 0, fontSize: 13.5 }}
            startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}
          >
            {isLoading ? "Generating…" : "✦ Generate"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 10.5 }}>
            Ctrl / ⌘ + Enter to generate
          </Typography>
        </Box>
      </Box>

      {/* ── Canvas toolbar ─────────────────────────────────────────────────── */}
      <Box sx={{
        px: 2, py: 0.75, flexShrink: 0,
        bgcolor: toolbarBg,
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex", alignItems: "center",
      }}>
        <Typography variant="caption" sx={{
          fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.1em", color: "text.disabled", fontSize: 10,
        }}>
          Render Canvas
        </Typography>
        {(showViewport || (output && mode === "html")) && (
          <Box sx={{ ml: "auto" }}>
            <ViewportToggle viewport={viewport} onChange={onViewportChange} />
          </Box>
        )}
      </Box>

      {/* ── Canvas ─────────────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
        {(mode === "mui" || mode === "charts") ? (
          <MuiCanvas html={output} isLoading={isLoading} error={error} viewport={viewport} />
        ) : (
          <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {!output && !isLoading && !error && <EmptyState />}
            {isLoading && (
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
                <CircularProgress size={36} sx={{ color: "#2563eb" }} thickness={3.5} />
                <Typography variant="body2" sx={{ color: "text.secondary" }}>Generating your dashboard…</Typography>
              </Box>
            )}
            {error && !isLoading && <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>}
            {output && !isLoading && (
              viewport !== "desktop" ? (
                <Box sx={{
                  flex: 1, overflow: "auto", display: "flex",
                  alignItems: "flex-start", justifyContent: "center",
                  pt: 4, pb: 4,
                  bgcolor: isDark ? "#05060a" : "#e8ecf4",
                }}>
                  <Box sx={{
                    width: viewport === "mobile" ? 390 : 768,
                    flexShrink: 0,
                    borderRadius: viewport === "mobile" ? 5 : 3,
                    overflow: "hidden",
                    boxShadow: isDark
                      ? "0 0 0 8px #12131f, 0 0 0 10px #1e2030, 0 32px 80px rgba(0,0,0,0.7)"
                      : "0 0 0 8px #c8d0e8, 0 0 0 10px #b0bbd6, 0 32px 80px rgba(0,0,0,0.25)",
                  }}>
                    {viewport === "mobile" && (
                      <Box sx={{ bgcolor: isDark ? "#0a0b12" : "#d8dff0", height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Box sx={{ width: 72, height: 6, bgcolor: isDark ? "#1e2030" : "#b8c2dc", borderRadius: 3 }} />
                      </Box>
                    )}
                    <iframe
                      srcDoc={`<!DOCTYPE html><html><head><style>body{margin:0;padding:0;background:#0e1117;}</style></head><body style="padding:16px">${output}</body></html>`}
                      title="Preview"
                      sandbox="allow-scripts"
                      style={{ display: "block", border: "none", width: viewport === "mobile" ? 390 : 768, height: viewport === "mobile" ? 720 : 900 }}
                    />
                    {viewport === "mobile" && (
                      <Box sx={{ bgcolor: isDark ? "#0a0b12" : "#d8dff0", height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Box sx={{ width: 36, height: 4, bgcolor: isDark ? "#1e2030" : "#b8c2dc", borderRadius: 2 }} />
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ p: 3 }}>
                  <div className="canvas-output" dangerouslySetInnerHTML={{ __html: output }} />
                </Box>
              )
            )}
          </Box>
        )}
      </Box>

      {/* ── Edit panel ─────────────────────────────────────────────────────── */}
      <EditPanel output={output} mode={mode} onApplyEdit={onApplyEdit} isApplying={isApplying} />
    </Box>
  );
}
