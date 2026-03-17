import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useTheme, alpha } from "@mui/material/styles";

// ── Color presets ──────────────────────────────────────────────────────────────

const COLOR_PRESETS = [
  { name: "Blue",     grad: "linear-gradient(135deg,#2563eb,#0ea5e9)", instruction: "Set primary color to #2563eb (blue), accent to #0ea5e9 (sky). Keep all layout identical." },
  { name: "Violet",   grad: "linear-gradient(135deg,#7c3aed,#a78bfa)", instruction: "Set primary color to #7c3aed (violet), accent to #a78bfa. Keep all layout identical." },
  { name: "Emerald",  grad: "linear-gradient(135deg,#059669,#34d399)", instruction: "Set primary color to #059669 (emerald), accent to #34d399. Keep all layout identical." },
  { name: "Amber",    grad: "linear-gradient(135deg,#d97706,#fbbf24)", instruction: "Set primary color to #d97706 (amber), accent to #fbbf24. Keep all layout identical." },
  { name: "Rose",     grad: "linear-gradient(135deg,#e11d48,#fb7185)", instruction: "Set primary color to #e11d48 (rose), accent to #fb7185. Keep all layout identical." },
  { name: "Cyan",     grad: "linear-gradient(135deg,#0891b2,#22d3ee)", instruction: "Set primary color to #0891b2 (cyan), accent to #22d3ee. Keep all layout identical." },
  { name: "Slate",    grad: "linear-gradient(135deg,#475569,#94a3b8)", instruction: "Set primary color to #475569 (slate), accent to #94a3b8. Monochrome professional look." },
  { name: "Light",    grad: "linear-gradient(135deg,#f8fafc,#e2e8f0)", instruction: "Convert to a light color scheme: white background, light gray cards, dark text, blue accents." },
];

// ── Quick edits by category and mode ──────────────────────────────────────────

const QUICK_EDITS = {
  layout: [
    { label: "Make compact",         icon: "⬜", instruction: "Reduce all padding and spacing by 30%. Make cards and rows more compact." },
    { label: "Make spacious",        icon: "📐", instruction: "Increase all padding and spacing by 40%. Add more breathing room between sections." },
    { label: "KPIs at the top",      icon: "📌", instruction: "Move the KPI stat cards or summary metrics to the very top of the layout." },
    { label: "2-column layout",      icon: "⚡", instruction: "Reorganize the main content into 2 equal columns where possible." },
    { label: "Add summary section",  icon: "📋", instruction: "Add a summary section at the top with key totals and highlights." },
    { label: "Stack vertically",     icon: "↕",  instruction: "Convert any side-by-side columns into a single vertical stack." },
  ],
  style: [
    { label: "Add card shadows",     icon: "🌑", instruction: "Add drop shadows to all cards and containers for a more elevated look." },
    { label: "Flat / minimal",       icon: "▭",  instruction: "Remove all shadows and borders. Use a flat, minimal design with subtle background differences." },
    { label: "Stronger borders",     icon: "◻",  instruction: "Make all card and table borders more visible (higher opacity, slightly thicker)." },
    { label: "Larger text",          icon: "Aa", instruction: "Increase all font sizes by ~15%. Make headings and values more prominent." },
    { label: "Bold headings",        icon: "𝗕",  instruction: "Make all section headings and labels bolder and more prominent." },
    { label: "Rounded corners",      icon: "⬬",  instruction: "Increase border-radius on all cards, badges, and buttons to be more rounded." },
    { label: "Glass effect",         icon: "✨", instruction: "Add glassmorphism: semi-transparent card backgrounds with backdrop-filter blur." },
  ],
  data: [
    { label: "Add totals row",       icon: "Σ",  instruction: "Add a totals or summary row at the bottom of every table showing column sums where applicable." },
    { label: "Show percentages",     icon: "%",  instruction: "Add percentage labels to all progress bars and include % change next to numeric values." },
    { label: "Sort by value ↓",      icon: "↓",  instruction: "Sort all tables and lists by their primary numeric column in descending order." },
    { label: "Highlight top row",    icon: "★",  instruction: "Visually highlight the top/best performing row in each table (e.g. gold border or distinct background)." },
    { label: "Add filter control",   icon: "⊟",  instruction: "Add a filter dropdown or button group above each table to filter rows by status or category." },
    { label: "Show all columns",     icon: "⊞",  instruction: "Expand any abbreviated tables to show all available data columns." },
    { label: "Conditional colors",   icon: "🎨", instruction: "Add conditional color coding to numeric cells (red for bad, green for good) based on thresholds." },
  ],
};

// Mode-specific quick edits appended to relevant tabs
const MODE_QUICK_EDITS = {
  html: {
    layout: [
      { label: "Add tab sections",   icon: "📑", instruction: "Convert the main content sections into a tabbed interface using .tabs-bar and .tab-panel." },
    ],
    data: [
      { label: "Make table sortable",icon: "↕",  instruction: "Add click-to-sort functionality to table headers with ▲/▼ indicators using a <script>." },
    ],
  },
  mui: {
    layout: [
      { label: "Add tab sections",   icon: "📑", instruction: "Convert main content sections into MUI Tabs with useState tab switching." },
    ],
    data: [
      { label: "Add search bar",     icon: "🔍", instruction: "Add a TextField search input that filters the table rows in real time using useState." },
      { label: "Add time filter",    icon: "📅", instruction: "Add a ToggleButtonGroup for 7d / 30d / 90d time range that filters the displayed data." },
    ],
  },
  charts: {
    style: [
      { label: "Add data labels",    icon: "🏷", instruction: "Add value labels directly on bars and pie slices using Recharts label/LabelList props." },
      { label: "Horizontal bars",    icon: "⬛", instruction: "Convert all BarCharts to horizontal layout using layout='vertical' on the chart." },
      { label: "Add trend line",     icon: "📈", instruction: "Add a ReferenceLine or Line to bar charts to show the average or trend." },
    ],
    data: [
      { label: "Sort bars ↓",       icon: "↓",  instruction: "Sort all bar chart data arrays by value in descending order before rendering." },
      { label: "Add chart toggle",   icon: "🔀", instruction: "Add a ToggleButtonGroup to switch between BarChart and LineChart for the main data series." },
      { label: "Add time filter",    icon: "📅", instruction: "Add a ToggleButtonGroup for 7d / 30d / 90d time range that filters the chart data using useMemo." },
    ],
  },
};

// ── CSS to embed for HTML-mode standalone export ───────────────────────────────

const RENDERED_CSS = `
*{box-sizing:border-box}
body{font-family:"Plus Jakarta Sans",-apple-system,BlinkMacSystemFont,sans-serif;background:#08090f;color:#e2e8f0;margin:0;padding:24px}
.rendered{display:flex;flex-direction:column;gap:20px}
.rendered h2{font-size:18px;font-weight:800;color:#f1f5f9;letter-spacing:-0.03em;margin-bottom:4px}
.rendered h3{font-size:14px;font-weight:600;color:#e2e8f0;margin-bottom:8px}
.rendered .section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#475569;margin-bottom:12px}
.rendered .muted{color:#475569;font-size:12px}
.rendered .card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px 20px}
.rendered .stats-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px}
.rendered .stat-card{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:4px}
.rendered .stat-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#475569}
.rendered .stat-value{font-size:28px;font-weight:800;color:#f1f5f9;letter-spacing:-0.04em;line-height:1.1}
.rendered .stat-delta{font-size:12px;font-weight:600;color:#475569}
.rendered .stat-delta.positive{color:#10b981}
.rendered .stat-delta.negative{color:#ef4444}
.rendered .badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(255,255,255,.05);color:#94a3b8;border:1px solid rgba(255,255,255,.08)}
.rendered .badge-green{background:rgba(16,185,129,.12);color:#10b981;border-color:rgba(16,185,129,.25)}
.rendered .badge-red{background:rgba(239,68,68,.12);color:#ef4444;border-color:rgba(239,68,68,.25)}
.rendered .badge-amber{background:rgba(245,158,11,.12);color:#f59e0b;border-color:rgba(245,158,11,.25)}
.rendered .badge-blue{background:rgba(56,189,248,.12);color:#38bdf8;border-color:rgba(56,189,248,.25)}
.rendered .progress-bar{height:6px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
.rendered .progress-fill{height:100%;background:linear-gradient(90deg,#2563eb,#0ea5e9);border-radius:99px}
.rendered table{width:100%;border-collapse:collapse;font-size:13px}
.rendered thead{border-bottom:1px solid rgba(255,255,255,.07)}
.rendered th{text-align:left;padding:8px 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#475569}
.rendered td{padding:10px 12px;color:#e2e8f0;border-bottom:1px solid rgba(255,255,255,.04)}
.rendered tbody tr:last-child td{border-bottom:none}
.rendered tbody tr:hover td{background:rgba(255,255,255,.03)}
.rendered .list-item{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:13px}
.rendered .list-item:last-child{border-bottom:none}
.rendered .alert{padding:10px 14px;border-radius:8px;font-size:13px;font-weight:500;border:1px solid;display:flex;align-items:flex-start;gap:10px}
.rendered .alert-info{background:rgba(56,189,248,.08);color:#38bdf8;border-color:rgba(56,189,248,.2)}
.rendered .alert-success{background:rgba(16,185,129,.08);color:#10b981;border-color:rgba(16,185,129,.2)}
.rendered .alert-warning{background:rgba(245,158,11,.08);color:#f59e0b;border-color:rgba(245,158,11,.2)}
.rendered .alert-error{background:rgba(239,68,68,.08);color:#ef4444;border-color:rgba(239,68,68,.2)}
.rendered .tabs-bar{display:flex;gap:4px;border-bottom:1px solid rgba(255,255,255,.07);margin-bottom:16px}
.rendered .tab-btn{padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;border:none;border-radius:6px 6px 0 0;background:transparent;color:rgba(255,255,255,.38);border-bottom:2px solid transparent;transition:all .15s;font-family:inherit}
.rendered .tab-btn:hover{color:rgba(255,255,255,.7)}
.rendered .tab-btn.active{color:#60a5fa;border-bottom-color:#2563eb;background:rgba(37,99,235,.08)}
.rendered .tab-panel{display:none}
.rendered .tab-panel.active{display:block}
.rendered .timeline{display:flex;flex-direction:column;gap:0}
.rendered .timeline-item{display:flex;gap:12px;padding-bottom:16px}
.rendered .timeline-track{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:20px}
.rendered .timeline-dot{width:10px;height:10px;border-radius:50%;background:#2563eb;flex-shrink:0;margin-top:3px}
.rendered .timeline-dot.green{background:#10b981}
.rendered .timeline-dot.amber{background:#f59e0b}
.rendered .timeline-dot.red{background:#ef4444}
.rendered .timeline-line{flex:1;width:1px;background:rgba(255,255,255,.07);margin-top:4px}
.rendered .timeline-item:last-child .timeline-line{display:none}
.rendered .timeline-title{font-size:13px;font-weight:600;color:#e2e8f0}
.rendered .timeline-meta{font-size:11px;color:#475569;margin-top:2px}
.rendered .kanban{display:flex;gap:12px;overflow-x:auto;align-items:flex-start}
.rendered .kanban-col{min-width:200px;flex:1;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:12px}
.rendered .kanban-col-title{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#475569;margin-bottom:10px}
.rendered .kanban-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:10px 12px;margin-bottom:8px;font-size:12px;color:#e2e8f0;line-height:1.5}
.rendered .activity-feed{display:flex;flex-direction:column;gap:0}
.rendered .activity-item{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);align-items:flex-start}
.rendered .activity-item:last-child{border-bottom:none}
.rendered .activity-avatar{width:28px;height:28px;border-radius:50%;background:rgba(37,99,235,.25);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#60a5fa;flex-shrink:0}
.rendered .activity-text{font-size:12px;color:#cbd5e1;line-height:1.5}
.rendered .activity-time{font-size:10px;color:#475569;margin-top:2px}
.rendered .kv-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px 16px}
.rendered .kv-key{font-size:11px;color:#475569;padding:3px 0}
.rendered .kv-value{font-size:12px;color:#e2e8f0;font-weight:600;padding:3px 0;text-align:right}
`;

// ── Export helpers ─────────────────────────────────────────────────────────────

const EXPORT_DATE = () => new Date().toISOString().slice(0, 10);

const HEADER_COMMENT = {
  html: () => `<!--
  ╔═══════════════════════════════════════════════════════════╗
  ║  Exported from Dashy — https://github.com/Thepizzapie/DashboardGenerator
  ║  Generated: ${EXPORT_DATE()}
  ╠═══════════════════════════════════════════════════════════╣
  ║  STACK — HTML Canvas mode
  ║
  ║  • No framework required — pure HTML + CSS + optional vanilla JS
  ║  • Font: Plus Jakarta Sans (Google Fonts, loaded via <link> in <head>)
  ║    CDN: https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800
  ║
  ║  COMPONENT CLASSES (all styles embedded in <style> block):
  ║  Layout:    .rendered  .card  .stats-grid  .stat-card  .kv-grid
  ║  Data:      table / thead / tbody / th / td
  ║  Badges:    .badge  .badge-green  .badge-red  .badge-amber  .badge-blue
  ║  Progress:  .progress-bar  .progress-fill
  ║  Alerts:    .alert  .alert-info  .alert-success  .alert-warning  .alert-error
  ║  Tabs:      .tabs-bar  .tab-btn  .tab-panel  (JS-driven, see <script> below)
  ║  Timeline:  .timeline  .timeline-item  .timeline-dot  .timeline-content
  ║  Kanban:    .kanban  .kanban-col  .kanban-card
  ║  Activity:  .activity-feed  .activity-item  .activity-avatar
  ║  Donut:     .donut-wrap  .donut  .donut-legend  (CSS conic-gradient)
  ║  Heatmap:   .heat-grid  .heat-cell  .heat-0 → .heat-4
  ║  Sparkline: .sparkline  (inline SVG container)
  ║
  ║  DEV NOTES:
  ║  • All data is hard-coded. Replace with your real API calls.
  ║  • Sortable tables use vanilla JS — wire up to your data layer.
  ║  • No build step required — open directly in a browser.
  ╚═══════════════════════════════════════════════════════════╝
-->`,

  mui: () => `<!--
  ╔═══════════════════════════════════════════════════════════╗
  ║  Exported from Dashy — https://github.com/Thepizzapie/DashboardGenerator
  ║  Generated: ${EXPORT_DATE()}
  ╠═══════════════════════════════════════════════════════════╣
  ║  STACK — MUI Canvas mode
  ║
  ║  All dependencies are loaded via CDN — no npm install needed.
  ║
  ║  • React 18            https://unpkg.com/react@18/umd/react.production.min.js
  ║  • ReactDOM 18         https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
  ║  • Material UI v5      https://unpkg.com/@mui/material@5/umd/material-ui.production.min.js
  ║  • Babel Standalone    https://unpkg.com/@babel/standalone/babel.min.js
  ║  • Font: Roboto        https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700
  ║
  ║  MUI COMPONENTS USED (destructured from MaterialUI global):
  ║  Layout:      Box, Stack, Grid, Paper, Divider
  ║  Content:     Card, CardContent, CardHeader, Typography
  ║  Data:        Table, TableHead, TableBody, TableRow, TableCell, TableContainer
  ║  Status:      Chip, Badge, LinearProgress, CircularProgress, Alert, AlertTitle
  ║  Navigation:  Tabs, Tab, Accordion, AccordionSummary, AccordionDetails
  ║  Actions:     Button, ButtonGroup, IconButton, Switch, ToggleButton, ToggleButtonGroup
  ║  Display:     Avatar, AvatarGroup, List, ListItem, ListItemText, Tooltip, Rating, Skeleton
  ║  Steps:       Stepper, Step, StepLabel
  ║
  ║  REACT HOOKS USED: useState, useMemo
  ║
  ║  DEV NOTES:
  ║  • To productionize: replace CDN scripts with npm packages and a bundler (Vite/CRA).
  ║  • All data is hard-coded as JS const arrays. Wire to your API in production.
  ║  • The dark theme is configured inline — swap palette.mode to 'light' to flip it.
  ╚═══════════════════════════════════════════════════════════╝
-->`,

  charts: () => `<!--
  ╔═══════════════════════════════════════════════════════════╗
  ║  Exported from Dashy — https://github.com/Thepizzapie/DashboardGenerator
  ║  Generated: ${EXPORT_DATE()}
  ╠═══════════════════════════════════════════════════════════╣
  ║  STACK — Charts Canvas mode
  ║
  ║  All dependencies are loaded via CDN — no npm install needed.
  ║
  ║  • React 18            https://unpkg.com/react@18/umd/react.production.min.js
  ║  • ReactDOM 18         https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
  ║  • prop-types 15       https://unpkg.com/prop-types@15/prop-types.min.js
  ║  • Material UI v5      https://unpkg.com/@mui/material@5/umd/material-ui.production.min.js
  ║  • Recharts 2.12.7     https://unpkg.com/recharts@2.12.7/umd/Recharts.js
  ║  • Babel Standalone    https://unpkg.com/@babel/standalone/babel.min.js
  ║  • Font: Roboto        https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700
  ║
  ║  RECHARTS COMPONENTS (destructured from Recharts global):
  ║  Charts:  BarChart, LineChart, AreaChart, ComposedChart, PieChart
  ║           RadarChart, RadialBarChart, ScatterChart, Treemap, FunnelChart
  ║  Parts:   Bar, Line, Area, Pie, Cell, Radar, RadialBar, Scatter, Funnel
  ║  Axes:    XAxis, YAxis, ZAxis, PolarGrid, PolarAngleAxis, PolarRadiusAxis
  ║  Extras:  CartesianGrid, Tooltip, Legend, ReferenceLine, Brush, LabelList
  ║  Wrapper: ResponsiveContainer (always required around every chart)
  ║
  ║  MUI COMPONENTS: Box, Stack, Grid, Card, CardContent, CardHeader,
  ║                  Typography, Chip, Tabs, Tab, ToggleButton, ToggleButtonGroup,
  ║                  Button, Alert, LinearProgress, Avatar, Divider, Paper
  ║
  ║  REACT HOOKS USED: useState, useMemo
  ║
  ║  DEV NOTES:
  ║  • To productionize: replace CDN scripts with npm packages and a bundler.
  ║    npm install react react-dom @mui/material @emotion/react @emotion/styled recharts
  ║  • prop-types MUST be loaded before recharts (peer dependency).
  ║  • All data is hard-coded as JS const arrays. Wire to your API in production.
  ║  • Treemap requires a custom content renderer — see TreemapCell in the script.
  ╚═══════════════════════════════════════════════════════════╝
-->`,
};

function buildExportHtml(html, mode) {
  const comment = HEADER_COMMENT[mode]?.() ?? HEADER_COMMENT.html();

  if (mode === "mui" || mode === "charts") {
    // Full standalone doc — inject comment right after <!DOCTYPE html>
    return html.replace(/^(<!DOCTYPE html>)/i, `$1\n${comment}`);
  }

  // HTML mode: wrap in full doc with embedded CSS + comment
  return `<!DOCTYPE html>
${comment}
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard — exported from Dashy</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>${RENDERED_CSS}</style>
</head>
<body>
${html}
</body>
</html>`;
}

function downloadHtml(html, mode) {
  const full = buildExportHtml(html, mode);
  const blob = new Blob([full], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "dashy-dashboard.html";
  a.click();
  URL.revokeObjectURL(url);
}

// ── EditPanel component ────────────────────────────────────────────────────────

export default function EditPanel({ output, mode, onApplyEdit, isApplying, onToast }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [instruction, setInstruction] = useState("");
  const [open, setOpen] = useState(true);
  const [editTab, setEditTab] = useState(0); // 0=Layout 1=Style 2=Data 3=Custom

  if (!output) return null;

  const TABS = ["Layout", "Style", "Data", "Custom"];

  // Merge base + mode-specific quick edits
  const modeEdits = MODE_QUICK_EDITS[mode] ?? {};
  const layoutEdits  = [...QUICK_EDITS.layout,  ...(modeEdits.layout  ?? [])];
  const styleEdits   = [...QUICK_EDITS.style,   ...(modeEdits.style   ?? [])];
  const dataEdits    = [...QUICK_EDITS.data,     ...(modeEdits.data    ?? [])];
  const TAB_EDITS    = [layoutEdits, styleEdits, dataEdits];

  async function apply(text) {
    if (!text.trim() || isApplying) return;
    try {
      await onApplyEdit(text.trim());
      onToast("Edit applied", "success");
      setInstruction("");
    } catch (err) {
      onToast(err.message || "Edit failed", "error");
    }
  }

  async function applyPreset(preset) {
    try {
      await onApplyEdit(preset.instruction);
      onToast(`${preset.name} theme applied`, "success");
    } catch (err) {
      onToast("Failed to apply theme", "error");
    }
  }

  function handleExport() {
    downloadHtml(output, mode);
    onToast("dashy-dashboard.html downloaded", "success");
  }

  async function handleCopy() {
    const full = buildExportHtml(output, mode);
    try {
      await navigator.clipboard.writeText(full);
      onToast("HTML copied to clipboard", "success");
    } catch {
      onToast("Clipboard access denied", "error");
    }
  }

  const panelBg   = isDark ? "rgba(7,8,16,0.97)" : "rgba(248,250,255,0.98)";
  const chipBg    = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const chipHover = isDark ? "rgba(37,99,235,0.14)"   : "rgba(37,99,235,0.10)";

  return (
    <Box sx={{ borderTop: "1px solid", borderColor: "divider", bgcolor: panelBg, flexShrink: 0 }}>

      {/* ── Toggle / header bar ──────────────────────────────────────────── */}
      <Box sx={{
        px: 2, py: 0.85,
        display: "flex", alignItems: "center", gap: 1.5,
        cursor: "pointer",
        "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" },
      }}>
        {/* Title — clicking expands/collapses */}
        <Box onClick={() => setOpen(o => !o)} sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "text.secondary", fontSize: 10.5 }}>
            Edit Dashboard
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.disabled", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", lineHeight: 1 }}>▾</Typography>
        </Box>

        {/* Export actions — always visible */}
        <Stack direction="row" spacing={0.75} onClick={e => e.stopPropagation()}>
          <Tooltip title="Copy full HTML to clipboard" arrow placement="top">
            <Box onClick={handleCopy} sx={{
              px: 1.25, py: 0.35, borderRadius: 1.5, fontSize: 11, fontWeight: 700,
              cursor: "pointer", border: "1px solid", borderColor: "divider",
              color: "text.secondary", display: "flex", alignItems: "center", gap: 0.6,
              "&:hover": { borderColor: "rgba(37,99,235,0.4)", color: "primary.light" },
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 12 }}>📋</span> Copy HTML
            </Box>
          </Tooltip>
          <Tooltip title="Download as .html file — hand off to a dev" arrow placement="top">
            <Box onClick={handleExport} sx={{
              px: 1.25, py: 0.35, borderRadius: 1.5, fontSize: 11, fontWeight: 700,
              cursor: "pointer", border: "1px solid",
              borderColor: "rgba(37,99,235,0.4)",
              color: "#60a5fa",
              background: "rgba(37,99,235,0.08)",
              display: "flex", alignItems: "center", gap: 0.6,
              "&:hover": { background: "rgba(37,99,235,0.16)", borderColor: "rgba(37,99,235,0.7)" },
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 12 }}>↓</span> Export HTML
            </Box>
          </Tooltip>
        </Stack>
      </Box>

      {/* ── Collapsible body ─────────────────────────────────────────────── */}
      <Collapse in={open}>
        <Box sx={{ px: 2, pb: 2, display: "flex", flexDirection: "column", gap: 1.75 }}>

          {/* ── Color presets ───────────────────────────────────────────── */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.disabled", fontSize: 9.5, display: "block", mb: 0.85 }}>
              Color theme
            </Typography>
            <Stack direction="row" spacing={0.6} sx={{ flexWrap: "wrap", gap: "6px !important" }}>
              {COLOR_PRESETS.map((p) => (
                <Tooltip key={p.name} title={`Apply ${p.name} theme`} arrow placement="top">
                  <Box
                    onClick={() => !isApplying && applyPreset(p)}
                    sx={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 0.4,
                      cursor: isApplying ? "not-allowed" : "pointer",
                      opacity: isApplying ? 0.5 : 1,
                      "&:hover .swatch": { transform: "scale(1.08)", boxShadow: "0 0 12px rgba(37,99,235,0.3)" },
                    }}
                  >
                    <Box className="swatch" sx={{
                      width: 44, height: 22, borderRadius: 1.5,
                      background: p.grad,
                      border: "1px solid",
                      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      transition: "all 0.15s",
                    }} />
                    <Typography sx={{ fontSize: 9, color: "text.disabled", letterSpacing: "0.02em" }}>
                      {p.name}
                    </Typography>
                  </Box>
                </Tooltip>
              ))}
            </Stack>
          </Box>

          {/* ── Quick edits with category tabs ───────────────────────────── */}
          <Box>
            <Tabs
              value={editTab}
              onChange={(_, v) => setEditTab(v)}
              sx={{
                minHeight: 28, mb: 1,
                "& .MuiTabs-indicator": {
                  height: 2, borderRadius: 1,
                  background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
                },
                "& .MuiTab-root": {
                  minHeight: 28, fontSize: 11, fontWeight: 700, px: 1.5, py: 0,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  color: "text.disabled",
                  "&.Mui-selected": { color: "primary.light" },
                },
              }}
            >
              {TABS.map(t => <Tab key={t} label={t} />)}
            </Tabs>

            {editTab < 3 ? (
              /* Quick edit chips */
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
                {TAB_EDITS[editTab].map((edit) => (
                  <Tooltip key={edit.label} title={edit.instruction} arrow placement="top">
                    <Box
                      onClick={() => !isApplying && apply(edit.instruction)}
                      sx={{
                        px: 1.25, py: 0.4,
                        borderRadius: 10,
                        fontSize: 11.5, fontWeight: 500,
                        display: "flex", alignItems: "center", gap: 0.5,
                        cursor: isApplying ? "not-allowed" : "pointer",
                        border: "1px solid", borderColor: "divider",
                        color: "text.secondary",
                        bgcolor: chipBg,
                        opacity: isApplying ? 0.5 : 1,
                        transition: "all 0.15s",
                        "&:hover": {
                          borderColor: "rgba(37,99,235,0.4)",
                          color: "text.primary",
                          bgcolor: chipHover,
                        },
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                      }}
                    >
                      <span style={{ fontSize: 12, lineHeight: 1 }}>{edit.icon}</span>
                      {edit.label}
                    </Box>
                  </Tooltip>
                ))}
              </Box>
            ) : (
              /* Custom instruction */
              <Box>
                <TextField
                  fullWidth multiline rows={2} size="small"
                  value={instruction}
                  onChange={e => setInstruction(e.target.value)}
                  placeholder='e.g. "Move KPI cards to the top, make the table sortable by salary, use green for positive deltas"'
                  disabled={isApplying}
                  onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) apply(instruction); }}
                  sx={{ mb: 1 }}
                />
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 10.5 }}>
                    Ctrl / ⌘ + Enter · Claude rewrites the dashboard HTML
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!instruction.trim() || isApplying}
                    onClick={() => apply(instruction)}
                    startIcon={isApplying ? <CircularProgress size={12} color="inherit" /> : null}
                    sx={{ minWidth: 90, height: 32, fontSize: 12 }}
                  >
                    {isApplying ? "Applying…" : "Apply"}
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>

          {/* Applying overlay hint */}
          {isApplying && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CircularProgress size={12} sx={{ color: "primary.main" }} />
              <Typography variant="caption" sx={{ color: "text.secondary", fontSize: 11 }}>
                Claude is rewriting your dashboard…
              </Typography>
            </Stack>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
