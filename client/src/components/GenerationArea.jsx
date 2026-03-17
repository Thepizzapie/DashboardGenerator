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
import Divider from "@mui/material/Divider";
import MuiCanvas from "./MuiCanvas";

const EXAMPLE_PROMPTS = [
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
];

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

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

      {/* ── Top bar: mode tabs ─────────────────────────────────────────────── */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper", px: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Tabs value={mode} onChange={(_, v) => onModeChange(v)} sx={{ minHeight: 44 }}>
          <Tab value="html" label="HTML Canvas" sx={{ minHeight: 44, py: 0 }} />
          <Tab value="mui" label="MUI Canvas" sx={{ minHeight: 44, py: 0 }} />
        </Tabs>
        <Typography variant="caption" color="text.secondary" sx={{ ml: "auto" }}>
          {mode === "html" ? "Renders raw HTML with CSS component library" : "Renders full React + MUI page in sandboxed iframe"}
        </Typography>
      </Box>

      {/* ── Prompt panel ──────────────────────────────────────────────────── */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider", p: 2, display: "flex", flexDirection: "column", gap: 1.5, flexShrink: 0 }}
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {EXAMPLE_PROMPTS.map((chip) => (
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
            placeholder="Describe the UI you want to generate…"
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
            sx={{ height: 56, minWidth: 110, flexShrink: 0 }}
            startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}
          >
            {isLoading ? "Generating…" : "Generate"}
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Ctrl / ⌘ + Enter to generate · Mode: <strong>{mode === "mui" ? "MUI iframe" : "HTML canvas"}</strong>
        </Typography>
      </Box>

      {/* ── Canvas ────────────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box sx={{ px: 2, py: 0.75, bgcolor: "background.default", borderBottom: 1, borderColor: "divider", flexShrink: 0 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.secondary" }}>
            Render Canvas
          </Typography>
        </Box>

        {mode === "mui" ? (
          <MuiCanvas html={output} isLoading={isLoading} error={error} />
        ) : (
          <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
            {!output && !isLoading && !error && (
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, color: "text.secondary" }}>
                <Typography sx={{ fontSize: 32, opacity: 0.3 }}>✦</Typography>
                <Typography variant="body2">Generated UI will appear here</Typography>
                <Typography variant="caption" color="text.secondary">Pick an example prompt or write your own above</Typography>
              </Box>
            )}

            {isLoading && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 2, color: "text.secondary" }}>
                <CircularProgress size={32} />
                <Typography variant="body2">Generating your UI…</Typography>
              </Box>
            )}

            {error && !isLoading && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {output && !isLoading && (
              <div className="canvas-output" dangerouslySetInnerHTML={{ __html: output }} />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
