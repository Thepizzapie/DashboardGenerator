import { useState, useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "./theme";
import { ComponentsToolbox, DataToolbox } from "./components/Toolbox";
import GenerationArea from "./components/GenerationArea";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ── Icons ──────────────────────────────────────────────────────────────────────

const PipelineIcon = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);
const DesktopIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const TabletIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/>
  </svg>
);
const MobileIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/>
  </svg>
);
const ComponentsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/>
    <rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>
  </svg>
);
const DataIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
  </svg>
);
const SunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const VIEWPORTS = [
  { key: "desktop", label: "Desktop",      Icon: DesktopIcon },
  { key: "tablet",  label: "Tablet 768px", Icon: TabletIcon  },
  { key: "mobile",  label: "Mobile 390px", Icon: MobileIcon  },
];

const MODE_LABEL = {
  html:        "HTML",
  mui:         "MUI",
  charts:      "Charts",
  infographic: "Infographic",
  diagram:     "Diagram",
};

const MODE_HINT = {
  html:        "Raw HTML + CSS",
  mui:         "React + Material UI",
  charts:      "Recharts dashboards",
  infographic: "Editorial SVG · NYT / Bloomberg style",
  diagram:     "D3.js · Academic figure style",
};

// ── Header icon button ─────────────────────────────────────────────────────────

function HeaderBtn({ onClick, active, children, tooltip, disabled }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Tooltip title={tooltip} arrow>
      <Box
        onClick={disabled ? undefined : onClick}
        sx={{
          display: "flex", alignItems: "center", gap: 1,
          px: 2, height: 46, borderRadius: 5, border: "1px solid",
          borderColor: active ? "rgba(37,99,235,0.5)" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          bgcolor: active ? "rgba(37,99,235,0.1)" : "transparent",
          color: active ? "primary.light" : "text.secondary",
          cursor: disabled ? "default" : "pointer",
          transition: "all 0.16s",
          "&:hover": disabled ? {} : { borderColor: "rgba(37,99,235,0.4)", color: "text.primary" },
          userSelect: "none",
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
}

// ── Floating header ────────────────────────────────────────────────────────────

function FloatingHeader({
  mode, onModeChange, isDark,
  toolboxType, onComponentsToggle, onDataToggle,
  pipelineMode, onPipelineModeChange,
  viewport, onViewportChange, output, isLoading,
  colorMode, onColorModeToggle,
}) {
  const forcedPipeline = mode === "infographic" || mode === "diagram";
  const pipelineActive = pipelineMode || forcedPipeline;
  const showViewport = !!output;

  return (
    <Box sx={{
      alignSelf: "center", mt: 1.5, mb: 1,
      borderRadius: "16px",
      background: isDark
        ? "rgba(22,25,32,0.85)"
        : "rgba(244,246,255,0.90)",
      backdropFilter: "blur(28px)",
      WebkitBackdropFilter: "blur(28px)",
      border: "1px solid",
      borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
      boxShadow: isDark
        ? "0 8px 40px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset"
        : "0 4px 24px rgba(0,0,0,0.09), 0 1px 0 rgba(255,255,255,0.9) inset",
      zIndex: 100, flexShrink: 0,
      px: 1.5, py: 0,
      display: "inline-flex", alignItems: "center", gap: 0,
    }}>

      {/* Logo */}
      <img src="/logo.png" alt="Dashy" style={{ height: 88, borderRadius: 10, display: "block", flexShrink: 0 }} />

      {/* Divider */}
      <Box sx={{ width: "1px", alignSelf: "stretch", my: 0.5, bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", mx: 2, flexShrink: 0 }} />

      {/* Mode tabs — grouped */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        {/* Dashboards group */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.disabled", mb: 0.25, lineHeight: 1 }}>
            Dashboards
          </Typography>
          <Box sx={{ display: "flex", gap: 0.25, p: 0.4, borderRadius: 3, height: 46, alignItems: "center", bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: "1px solid", borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
            {[["html","HTML"],["mui","MUI"],["charts","Charts"]].map(([key, label]) => (
              <Tooltip key={key} title={MODE_HINT[key]} arrow placement="bottom">
                <Box
                  onClick={() => onModeChange(key)}
                  sx={{
                    px: 1.75, py: 0.6, borderRadius: 2.5, fontSize: 22, fontWeight: 700,
                    cursor: "pointer", userSelect: "none", transition: "all 0.18s", lineHeight: 1.2,
                    color: mode === key ? "#fff" : "text.secondary",
                    background: mode === key ? "linear-gradient(135deg, #2563eb, #0ea5e9)" : "transparent",
                    boxShadow: mode === key ? "0 2px 8px rgba(37,99,235,0.35)" : "none",
                    "&:hover": mode !== key ? { color: "text.primary", bgcolor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" } : {},
                  }}
                >
                  {label}
                </Box>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Separator */}
        <Box sx={{ width: "1px", alignSelf: "stretch", my: 1, mx: 0.5, bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", flexShrink: 0 }} />

        {/* Infographic group */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.disabled", mb: 0.25, lineHeight: 1 }}>
            Infographic
          </Typography>
          <Box sx={{ display: "flex", p: 0.4, borderRadius: 3, height: 46, alignItems: "center", bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: "1px solid", borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
            <Tooltip title={MODE_HINT["infographic"]} arrow placement="bottom">
              <Box
                onClick={() => onModeChange("infographic")}
                sx={{
                  px: 1.75, py: 0.6, borderRadius: 2.5, fontSize: 22, fontWeight: 700,
                  cursor: "pointer", userSelect: "none", transition: "all 0.18s", lineHeight: 1.2,
                  color: mode === "infographic" ? "#fff" : "text.secondary",
                  background: mode === "infographic" ? "linear-gradient(135deg, #7c3aed, #ec4899)" : "transparent",
                  boxShadow: mode === "infographic" ? "0 2px 8px rgba(124,58,237,0.35)" : "none",
                  "&:hover": mode !== "infographic" ? { color: "text.primary", bgcolor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" } : {},
                }}
              >
                Infographic
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {/* Separator */}
        <Box sx={{ width: "1px", alignSelf: "stretch", my: 1, mx: 0.5, bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", flexShrink: 0 }} />

        {/* Diagram group */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.disabled", mb: 0.25, lineHeight: 1 }}>
            Diagram
          </Typography>
          <Box sx={{ display: "flex", p: 0.4, borderRadius: 3, height: 46, alignItems: "center", bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: "1px solid", borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
            <Tooltip title={MODE_HINT["diagram"]} arrow placement="bottom">
              <Box
                onClick={() => onModeChange("diagram")}
                sx={{
                  px: 1.75, py: 0.6, borderRadius: 2.5, fontSize: 22, fontWeight: 700,
                  cursor: "pointer", userSelect: "none", transition: "all 0.18s", lineHeight: 1.2,
                  color: mode === "diagram" ? "#fff" : "text.secondary",
                  background: mode === "diagram" ? "linear-gradient(135deg, #0ea5e9, #10b981)" : "transparent",
                  boxShadow: mode === "diagram" ? "0 2px 8px rgba(14,165,233,0.35)" : "none",
                  "&:hover": mode !== "diagram" ? { color: "text.primary", bgcolor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" } : {},
                }}
              >
                Diagram
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Divider between tabs and right side */}
      <Box sx={{ width: "1px", alignSelf: "stretch", my: 1, mx: 0.5, bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", flexShrink: 0 }} />

      {/* Right side */}
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0 }}>

        {/* Tools group */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.disabled", mb: 0.25, lineHeight: 1 }}>
            Tools
          </Typography>
          <Box sx={{ display: "flex", gap: 0.25, p: 0.4, height: 46, alignItems: "center", borderRadius: 3, bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", border: "1px solid", borderColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
            <Tooltip title="Component reference" arrow>
              <Box onClick={onComponentsToggle} sx={{
                display: "flex", alignItems: "center", gap: 1,
                px: 1.75, height: "100%", borderRadius: 2.5, cursor: "pointer", userSelect: "none", transition: "all 0.18s",
                color: toolboxType === "components" ? "#fff" : "text.secondary",
                background: toolboxType === "components" ? "linear-gradient(135deg, #2563eb, #0ea5e9)" : "transparent",
                boxShadow: toolboxType === "components" ? "0 2px 8px rgba(37,99,235,0.35)" : "none",
                "&:hover": toolboxType !== "components" ? { color: "text.primary", bgcolor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" } : {},
              }}>
                <ComponentsIcon />
                <Typography sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>Components</Typography>
              </Box>
            </Tooltip>
            <Tooltip title="Drag data sources into the prompt" arrow>
              <Box onClick={onDataToggle} sx={{
                display: "flex", alignItems: "center", gap: 1,
                px: 1.75, height: "100%", borderRadius: 2.5, cursor: "pointer", userSelect: "none", transition: "all 0.18s",
                color: toolboxType === "data" ? "#fff" : "text.secondary",
                background: toolboxType === "data" ? "linear-gradient(135deg, #2563eb, #0ea5e9)" : "transparent",
                boxShadow: toolboxType === "data" ? "0 2px 8px rgba(37,99,235,0.35)" : "none",
                "&:hover": toolboxType !== "data" ? { color: "text.primary", bgcolor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" } : {},
              }}>
                <DataIcon />
                <Typography sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>Data</Typography>
              </Box>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ width: "1px", alignSelf: "stretch", my: 0.75, bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />

        {/* Viewport icons — only when output exists */}
        {showViewport && (
          <>
            {VIEWPORTS.map((v) => (
              <Tooltip key={v.key} title={v.label} arrow>
                <Box onClick={() => onViewportChange(v.key)} sx={{
                  width: 46, height: 46, borderRadius: 2,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", border: "1px solid",
                  borderColor: viewport === v.key ? "rgba(37,99,235,0.5)" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                  bgcolor: viewport === v.key ? "rgba(37,99,235,0.1)" : "transparent",
                  color: viewport === v.key ? "primary.light" : "text.disabled",
                  "&:hover": { borderColor: "rgba(37,99,235,0.35)", color: "text.secondary" },
                  transition: "all 0.15s",
                }}>
                  <v.Icon />
                </Box>
              </Tooltip>
            ))}
            <Box sx={{ width: "1px", alignSelf: "stretch", my: 0.75, bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />
          </>
        )}

        {/* Pipeline group */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <Typography sx={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.disabled", mb: 0.25, lineHeight: 1 }}>
            Pipeline
          </Typography>
          <Tooltip title={forcedPipeline ? "Always-on: 6 agents" : pipelineActive ? "6-Agent Pipeline ON — click to disable" : "Enable 6-Agent Pipeline"} arrow>
            <Box
              onClick={() => !forcedPipeline && !isLoading && onPipelineModeChange(!pipelineMode)}
              sx={{
                display: "flex", alignItems: "center", gap: 1,
                px: 1.75, height: 46, borderRadius: 3, border: "1px solid",
                bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                borderColor: pipelineActive ? "rgba(37,99,235,0.5)" : isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
                color: pipelineActive ? "primary.light" : "text.secondary",
                cursor: forcedPipeline || isLoading ? "default" : "pointer",
                transition: "all 0.18s", userSelect: "none",
                "&:hover": !forcedPipeline && !isLoading ? { color: "text.primary", bgcolor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" } : {},
              }}
            >
              <PipelineIcon size={20} />
              <Typography sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
                {forcedPipeline ? "Always on" : "Pipeline"}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        <Box sx={{ width: "1px", alignSelf: "stretch", my: 0.75, bgcolor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }} />

        {/* Dark mode */}
        <Tooltip title={isDark ? "Light mode" : "Dark mode"} arrow>
          <Box onClick={onColorModeToggle} sx={{
            width: 48, height: 48, borderRadius: 2,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "text.secondary",
            border: "1px solid", borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            "&:hover": { bgcolor: "action.hover", color: "text.primary" }, transition: "all 0.15s",
          }}>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </Box>
        </Tooltip>

        {/* GitHub */}
        <Typography
          component="a"
          href="https://github.com/Thepizzapie/DashboardGenerator"
          target="_blank" rel="noopener noreferrer"
          sx={{ color: "text.disabled", textDecoration: "none", fontSize: 22, fontWeight: 600, "&:hover": { color: "text.secondary" }, pl: 0.25 }}
        >
          GitHub
        </Typography>
      </Stack>
    </Box>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  const [colorMode, setColorMode] = useState("dark");
  const theme = useMemo(() => createAppTheme(colorMode), [colorMode]);
  const isDark = colorMode === "dark";

  const [mode, setMode] = useState("html");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [muiOutput, setMuiOutput] = useState("");
  const [chartsOutput, setChartsOutput] = useState("");
  const [infographicOutput, setInfographicOutput] = useState("");
  const [diagramOutput, setDiagramOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState(null);
  const [userSources, setUserSources] = useState([]);
  const [viewport, setViewport] = useState("desktop");
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });
  const [pipelineMode, setPipelineMode] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(null);
  const [pipelineOutput, setPipelineOutput] = useState(null);
  const [toolboxType, setToolboxType] = useState(null); // null | "components" | "data"
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const showToast = useCallback((message, severity = "success") => {
    setToast({ open: true, message, severity });
  }, []);

  useEffect(() => { loadSources(); }, []);

  async function loadSources() {
    try {
      const res = await fetch(`${API}/api/sources`);
      if (res.ok) setUserSources(await res.json());
    } catch (_) {}
  }

  async function addSource(payload) {
    await fetch(`${API}/api/sources`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    await loadSources();
  }

  async function deleteSource(id) {
    await fetch(`${API}/api/sources/${id}`, { method: "DELETE" });
    await loadSources();
  }

  async function fetchSource(id) {
    await fetch(`${API}/api/sources/${id}/fetch`, { method: "POST" });
    await loadSources();
  }

  async function uploadCsv(file, name) {
    const form = new FormData();
    form.append("file", file); form.append("name", name);
    await fetch(`${API}/api/upload-csv`, { method: "POST", body: form });
    await loadSources();
  }

  function handleSourceDrop(sourceId) {
    setSelectedSources(prev => prev.includes(sourceId) ? prev : [...prev, sourceId]);
  }
  function handleSourceRemove(sourceId) {
    setSelectedSources(prev => prev.filter(id => id !== sourceId));
  }
  function handleComponentDrop(label) {
    setSelectedComponents(prev => prev.includes(label) ? prev : [...prev, label]);
  }
  function handleComponentRemove(label) {
    setSelectedComponents(prev => prev.filter(l => l !== label));
  }

  async function handleGenerate(prompt) {
    setIsLoading(true);
    setError(null);
    setPipelineOutput(null);

    // Build context from selected sources + components
    const parts = [];
    if (selectedSources.length > 0) parts.push(`Focus on these data sources: ${selectedSources.join(", ")}`);
    if (selectedComponents.length > 0) parts.push(`Include these UI components: ${selectedComponents.join(", ")}`);
    const fullPrompt = parts.length > 0 ? `${prompt}\n\n${parts.join("\n")}` : prompt;

    const forcePipeline = mode === "infographic" || mode === "diagram";
    if (pipelineMode || forcePipeline) {
      try {
        const res = await fetch(`${API}/generate-pipeline`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: fullPrompt, mode }),
        });
        if (!res.ok) throw new Error(`Server error ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        function processLine(line) {
          if (!line.startsWith("data: ")) return;
          let data;
          try { data = JSON.parse(line.slice(6)); } catch { return; } // skip malformed
          if (data.step) setPipelineStep(data.step);
          if (data.error) throw new Error(data.error);
          if (data.result) {
            const { html, planSpec, styleGuide, criticFeedback, refinements } = data.result;
            if (mode === "mui") setMuiOutput(html);
            else if (mode === "charts") setChartsOutput(html);
            else if (mode === "infographic") setInfographicOutput(html);
            else if (mode === "diagram") setDiagramOutput(html);
            else setHtmlOutput(html);
            setPipelineOutput({ planSpec, styleGuide, criticFeedback, refinements });
            setPipelineStep("done");
            showToast("Pipeline complete", "success");
          }
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop(); // hold back potentially incomplete last line
          for (const line of lines) processLine(line);
        }
        // flush any remaining buffer content
        if (buffer) processLine(buffer);
      } catch (err) {
        setError(err.message);
        setPipelineStep(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      setPipelineStep(null);
      const endpoint = mode === "mui" ? "/generate-mui"
        : mode === "charts" ? "/generate-charts"
        : mode === "infographic" ? "/generate-infographic"
        : mode === "diagram" ? "/generate-diagram"
        : "/generate";
      try {
        const res = await fetch(`${API}${endpoint}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: fullPrompt }),
        });
        if (!res.ok) { const err = await res.json(); throw new Error(err.error || `Server error ${res.status}`); }
        const { html } = await res.json();
        if (mode === "mui") setMuiOutput(html);
        else if (mode === "charts") setChartsOutput(html);
        else if (mode === "infographic") setInfographicOutput(html);
        else if (mode === "diagram") setDiagramOutput(html);
        else setHtmlOutput(html);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function handleApplyEdit(instruction) {
    const currentOutput = mode === "mui" ? muiOutput : mode === "charts" ? chartsOutput : mode === "infographic" ? infographicOutput : mode === "diagram" ? diagramOutput : htmlOutput;
    if (!currentOutput) return;
    setIsApplying(true);
    try {
      const res = await fetch(`${API}/edit`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ html: currentOutput, instruction }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || `Server error ${res.status}`); }
      const { html } = await res.json();
      if (mode === "mui") setMuiOutput(html);
      else if (mode === "charts") setChartsOutput(html);
      else if (mode === "infographic") setInfographicOutput(html);
      else if (mode === "diagram") setDiagramOutput(html);
      else setHtmlOutput(html);
    } finally {
      setIsApplying(false);
    }
  }

  const output = mode === "mui" ? muiOutput : mode === "charts" ? chartsOutput : mode === "infographic" ? infographicOutput : mode === "diagram" ? diagramOutput : htmlOutput;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", bgcolor: "background.default" }}>

        {/* ── Floating glass header ──────────────────────────────────────── */}
        <FloatingHeader
          mode={mode}
          onModeChange={setMode}
          isDark={isDark}
          toolboxType={toolboxType}
          onComponentsToggle={() => setToolboxType(t => t === "components" ? null : "components")}
          onDataToggle={() => setToolboxType(t => t === "data" ? null : "data")}
          pipelineMode={pipelineMode}
          onPipelineModeChange={setPipelineMode}
          viewport={viewport}
          onViewportChange={setViewport}
          output={output}
          isLoading={isLoading}
          colorMode={colorMode}
          onColorModeToggle={() => setColorMode(isDark ? "light" : "dark")}
        />

        {/* ── Main content ───────────────────────────────────────────────── */}
        <Box sx={{ flex: 1, overflow: "hidden", position: "relative", mx: 2, mb: 1.5, borderRadius: "12px", border: "1px solid", borderColor: "divider" }}>

          {/* Components toolbox overlay */}
          <ComponentsToolbox
            open={toolboxType === "components"}
            onClose={() => setToolboxType(null)}
            mode={mode}
          />

          {/* Data toolbox overlay */}
          <DataToolbox
            open={toolboxType === "data"}
            onClose={() => setToolboxType(null)}
            userSources={userSources}
            onAddSource={addSource}
            onDeleteSource={deleteSource}
            onFetchSource={fetchSource}
            onUploadCsv={uploadCsv}
            selectedSources={selectedSources}
          />

          {/* Generation area — shifts right when toolbox open */}
          <Box sx={{
            position: "absolute", inset: 0,
            ml: toolboxType ? "272px" : 0,
            transition: "margin-left 0.22s cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden", display: "flex", flexDirection: "column",
            zIndex: 45,
          }}>
          <GenerationArea
            mode={mode}
            onGenerate={handleGenerate}
            onApplyEdit={handleApplyEdit}
            output={output}
            isLoading={isLoading}
            isApplying={isApplying}
            error={error}
            viewport={viewport}
            showToast={showToast}
            pipelineStep={pipelineStep}
            pipelineOutput={pipelineOutput}
            selectedSources={selectedSources}
            onSourceDrop={handleSourceDrop}
            onSourceRemove={handleSourceRemove}
            selectedComponents={selectedComponents}
            onComponentDrop={handleComponentDrop}
            onComponentRemove={handleComponentRemove}
          />
          </Box>
        </Box>

        {/* ── Global toast ───────────────────────────────────────────────── */}
        <Snackbar
          open={toast.open}
          autoHideDuration={3500}
          onClose={() => setToast(t => ({ ...t, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{ mb: 1 }}
        >
          <Alert
            onClose={() => setToast(t => ({ ...t, open: false }))}
            severity={toast.severity}
            variant="filled"
            sx={{ borderRadius: 2.5, fontSize: 13, fontWeight: 600, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", minWidth: 240 }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
