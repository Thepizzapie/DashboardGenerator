import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

const COLOR_PRESETS = [
  { name: "Indigo",     primary: "#2563eb", accent: "#818cf8", bg: "#0f1117", paper: "#161b27" },
  { name: "Ocean",      primary: "#0ea5e9", accent: "#38bdf8", bg: "#0c1824", paper: "#0f2030" },
  { name: "Emerald",    primary: "#10b981", accent: "#34d399", bg: "#0a1a14", paper: "#0d2218" },
  { name: "Amber",      primary: "#f59e0b", accent: "#fbbf24", bg: "#1a1300", paper: "#231a00" },
  { name: "Rose",       primary: "#f43f5e", accent: "#fb7185", bg: "#1a0812", paper: "#240d1a" },
  { name: "Violet",     primary: "#8b5cf6", accent: "#60a5fa", bg: "#12101e", paper: "#1a1628" },
  { name: "Light",      primary: "#2563eb", accent: "#818cf8", bg: "#f8fafc", paper: "#ffffff" },
];

const QUICK_EDITS = [
  "Make it more compact",
  "Add a summary section at the top",
  "Move tables to the bottom",
  "Make all text larger",
  "Add percentage labels to progress bars",
  "Group items by status",
];

export default function EditPanel({ output, mode, onApplyEdit, isApplying }) {
  const [instruction, setInstruction] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);

  async function applyInstruction(text) {
    if (!text.trim()) return;
    setError("");
    try {
      await onApplyEdit(text.trim());
      setInstruction("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function applyColorPreset(preset) {
    const instruction = `Change the color scheme: primary/accent color to ${preset.primary}, background to ${preset.bg}, paper/card background to ${preset.paper}. Keep all data and layout identical, only update colors throughout.`;
    await applyInstruction(instruction);
  }

  if (!output) return null;

  return (
    <Box sx={{ borderTop: "1px solid", borderColor: "divider", bgcolor: "background.paper", flexShrink: 0 }}>
      {/* Toggle bar */}
      <Box
        onClick={() => setOpen(o => !o)}
        sx={{ px: 2, py: 1, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", "&:hover": { bgcolor: "rgba(255,255,255,0.02)" } }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.secondary" }}>
            Edit Dashboard
          </Typography>
          <Typography variant="caption" sx={{ color: "text.disabled" }}>
            · colors, layout, content
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 12, color: "text.disabled", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</Typography>
      </Box>

      <Collapse in={open}>
        <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>

          {error && <Alert severity="error" sx={{ py: 0.5, fontSize: 12 }}>{error}</Alert>}

          {/* Color presets */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", mb: 1 }}>
              Color scheme
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              {COLOR_PRESETS.map((preset) => (
                <Tooltip key={preset.name} title={preset.name} arrow placement="top">
                  <Box
                    onClick={() => !isApplying && applyColorPreset(preset)}
                    sx={{
                      width: 28, height: 28,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.bg} 50%)`,
                      border: "2px solid",
                      borderColor: "divider",
                      cursor: isApplying ? "not-allowed" : "pointer",
                      transition: "transform 0.1s, border-color 0.1s",
                      "&:hover": { transform: isApplying ? "none" : "scale(1.15)", borderColor: "text.secondary" },
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          </Box>

          {/* Quick edit chips */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", mb: 0.75 }}>
              Quick edits
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
              {QUICK_EDITS.map((q) => (
                <Box
                  key={q}
                  onClick={() => !isApplying && applyInstruction(q)}
                  sx={{
                    px: 1.25, py: 0.4,
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor: "divider",
                    cursor: isApplying ? "not-allowed" : "pointer",
                    fontSize: 11,
                    color: "text.secondary",
                    "&:hover": { borderColor: "text.disabled", color: "text.primary" },
                    transition: "all 0.1s",
                  }}
                >
                  {q}
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Custom instruction */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", mb: 0.75 }}>
              Custom instruction
            </Typography>
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                rows={2}
                size="small"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                placeholder='e.g. "Move the KPI cards to the top, make the table sortable by status, use green for positive deltas"'
                disabled={isApplying}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) applyInstruction(instruction);
                }}
                sx={{ "& .MuiOutlinedInput-root": { fontSize: 12 } }}
              />
              <Button
                variant="contained"
                size="small"
                disabled={!instruction.trim() || isApplying}
                onClick={() => applyInstruction(instruction)}
                sx={{ height: 56, minWidth: 80, flexShrink: 0, fontWeight: 600 }}
                startIcon={isApplying ? <CircularProgress size={12} color="inherit" /> : null}
              >
                {isApplying ? "Editing…" : "Apply"}
              </Button>
            </Stack>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
              Ctrl / ⌘ + Enter · Claude updates the HTML directly
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
