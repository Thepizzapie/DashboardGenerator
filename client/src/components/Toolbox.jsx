import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTheme } from "@mui/material/styles";
import AddSourceDialog from "./AddSourceDialog";

// ── Icons (all SVG, no emoji) ─────────────────────────────────────────────────

const ChevronIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
);
const CloseIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const RefreshIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);
const DeleteIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const DragIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/>
    <circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/>
    <circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/>
  </svg>
);
const AddIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

// Source-specific icons
const UsersIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const FolderIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);
const BarChartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const PackageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const FunnelIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);
const DollarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// ── Component data ─────────────────────────────────────────────────────────────

const HTML_COMPONENTS = [
  { label: "Stat Card Grid",    name: ".stats-grid",      desc: "Big numbers, labels & trend arrows" },
  { label: "Card Container",    name: ".card",            desc: "Bordered glass surface for grouping content" },
  { label: "Progress Bar",      name: ".progress-bar",    desc: "Gradient fill track — set width%" },
  { label: "Status Badge",      name: ".badge",           desc: "Color-coded pill: green / red / amber / blue" },
  { label: "Data Table",        name: "table",            desc: "Sortable rows with hover highlights" },
  { label: "Alert Banner",      name: ".alert",           desc: "Info / success / warning / error strip" },
  { label: "Tabs",              name: ".tabs-bar",        desc: "JS-driven tab switching with active state" },
  { label: "Timeline",          name: ".timeline",        desc: "Vertical event list with dot markers" },
  { label: "Kanban Board",      name: ".kanban",          desc: "Drag-ready columns for status workflows" },
  { label: "Activity Feed",     name: ".activity-feed",   desc: "Avatar + text + timestamp stream" },
  { label: "Donut Chart",       name: ".donut",           desc: "CSS conic-gradient ring with fill" },
  { label: "Heatmap Grid",      name: ".heat-grid",       desc: "Color-intensity cells — 5 levels" },
  { label: "Sparkline",         name: ".sparkline",       desc: "Inline SVG mini-chart for trends" },
  { label: "Key / Value Grid",  name: ".kv-grid",         desc: "Two-column label/value pairs" },
  { label: "List Row",          name: ".list-item",       desc: "Flex row with left label and right value" },
];

const MUI_COMPONENTS = [
  { label: "State & Memo",       name: "useState / useMemo",        desc: "React hooks — tabs, filters, sorting" },
  { label: "Layout Primitives",  name: "Box / Stack / Grid / Paper", desc: "Flex, grid and surface containers" },
  { label: "Card",               name: "Card + CardContent",         desc: "Elevated content surface" },
  { label: "Typography",         name: "Typography",                 desc: "h4–h6, body1/2, caption, overline" },
  { label: "Data Table",         name: "Table + TableRow + TableCell",desc: "Sortable, filterable data table" },
  { label: "Chip / Badge",       name: "Chip / Badge",               desc: "Status pills and notification overlays" },
  { label: "Progress",           name: "LinearProgress / CircularProgress", desc: "Fill bars and ring gauges" },
  { label: "Avatar",             name: "Avatar + AvatarGroup",       desc: "Initials circles or stacked group" },
  { label: "Tabs",               name: "Tabs + Tab",                 desc: "Tab switching with useState" },
  { label: "Toggle Group",       name: "ToggleButtonGroup",          desc: "Exclusive selection — time range" },
  { label: "Accordion",          name: "Accordion",                  desc: "Collapsible sections" },
  { label: "Buttons",            name: "Button / ButtonGroup",       desc: "Contained, outlined, text variants" },
  { label: "Switch",             name: "Switch + FormControlLabel",  desc: "Boolean toggle with label" },
  { label: "Alert",              name: "Alert + AlertTitle",         desc: "Severity banners" },
  { label: "Tooltip",            name: "Tooltip",                    desc: "Hover hint on any element" },
  { label: "Rating",             name: "Rating",                     desc: "Read-only star rating display" },
  { label: "Stepper",            name: "Stepper + Step + StepLabel", desc: "Multi-step progress indicator" },
  { label: "Skeleton",           name: "Skeleton",                   desc: "Loading placeholder for any shape" },
];

const CHARTS_COMPONENTS = [
  { label: "Interactivity",      name: "useState / useMemo",          desc: "Filter, sort, tab-switch, time-range" },
  { label: "Bar Chart",          name: "BarChart",                    desc: "Vertical or horizontal bars" },
  { label: "Line Chart",         name: "LineChart",                   desc: "Trend lines — multi-series" },
  { label: "Area Chart",         name: "AreaChart",                   desc: "Filled area under line" },
  { label: "Composed Chart",     name: "ComposedChart",               desc: "Mix Bar + Line + Area on same axes" },
  { label: "Pie Chart",          name: "PieChart + Pie + Cell",       desc: "Proportional slices" },
  { label: "Radar Chart",        name: "RadarChart + Radar",          desc: "Spider chart for multi-metric" },
  { label: "Radial Bar",         name: "RadialBarChart + RadialBar",  desc: "Circular progress gauge" },
  { label: "Scatter / Bubble",   name: "ScatterChart + Scatter",      desc: "x/y/z bubble plot" },
  { label: "Treemap",            name: "Treemap",                     desc: "Proportional rectangles" },
  { label: "Funnel Chart",       name: "FunnelChart + Funnel",        desc: "Conversion funnel" },
  { label: "Axes & Grid",        name: "XAxis / YAxis / CartesianGrid", desc: "Labels, ticks, gridlines" },
  { label: "Tooltip & Legend",   name: "Tooltip + Legend",            desc: "Interactive overlays" },
  { label: "Reference Line",     name: "ReferenceLine",               desc: "Target / threshold line" },
  { label: "Brush / Zoom",       name: "Brush",                       desc: "Scroll and zoom handle" },
];

export const MOCK_SOURCES = [
  { id: "employees",      Icon: UsersIcon,   label: "Employees",       desc: "10 staff · name, dept, role, salary, status" },
  { id: "projects",       Icon: FolderIcon,  label: "Projects",        desc: "7 projects · status, budget, progress %" },
  { id: "kpi_metrics",    Icon: BarChartIcon,label: "KPI Metrics",     desc: "8 KPIs · value, delta, target" },
  { id: "inventory",      Icon: PackageIcon, label: "Inventory",       desc: "8 items · qty, capacity, reorder alerts" },
  { id: "sales_pipeline", Icon: FunnelIcon,  label: "Sales Pipeline",  desc: "7 deals · stage, value, probability" },
  { id: "support",        Icon: MessageIcon, label: "Support Tickets", desc: "7 tickets · priority, status, hours open" },
  { id: "budget",         Icon: DollarIcon,  label: "Budget",          desc: "7 depts · allocated, spent, remaining" },
  { id: "sprint",         Icon: ZapIcon,     label: "Sprint",          desc: "8 stories · points, status, velocity" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function sourceStatus(s) {
  if (!s.last_fetched) return "#64748b";
  const age = (Date.now() - new Date(s.last_fetched).getTime()) / 1000;
  return age < s.cache_ttl ? "#22c55e" : "#f59e0b";
}

function StatusDot({ color }) {
  return <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />;
}

// ── Component section ─────────────────────────────────────────────────────────

function ComponentSection({ title, label, labelColor, items, onPanelClose }) {
  const [open, setOpen] = useState(true);
  const colors = { primary: "#2563eb", info: "#0ea5e9", warning: "#f59e0b" };
  const accent = colors[labelColor] || "#2563eb";

  function handleDragStart(e, item) {
    e.dataTransfer.setData("application/dashy-component", JSON.stringify({ label: item.label }));
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <Accordion
      expanded={open} onChange={(_, v) => setOpen(v)}
      disableGutters elevation={0}
      sx={{ background: "transparent", "&:before": { display: "none" }, borderBottom: "1px solid", borderColor: "divider" }}
    >
      <AccordionSummary
        expandIcon={<ChevronIcon />}
        sx={{ px: 1.5, py: 0, minHeight: 36, "& .MuiAccordionSummary-content": { my: 0 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.secondary", fontSize: 12.5 }}>
            {title}
          </Typography>
          <Box sx={{ px: 0.75, py: 0.1, borderRadius: 2, border: `1px solid ${accent}40`, bgcolor: `${accent}15`, fontSize: 11, fontWeight: 800, color: accent, lineHeight: "14px" }}>
            {label}
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1.25, pt: 0.25, pb: 1.25, display: "flex", flexDirection: "column", gap: 0 }}>
        {items.map((item) => (
          <Box
            key={item.label}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            sx={{
              display: "flex", alignItems: "flex-start", gap: 1,
              py: 0.5, px: 0.75, borderRadius: 1.5, cursor: "grab",
              "&:hover": { bgcolor: "action.hover" }, transition: "background 0.12s",
              "&:active": { cursor: "grabbing" },
            }}
          >
            <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: accent, flexShrink: 0, mt: 0.85 }} />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: "text.primary", lineHeight: 1.3 }}>{item.label}</Typography>
              <Typography sx={{ fontSize: 12, color: "text.disabled", lineHeight: 1.4, mt: 0.1 }}>{item.desc}</Typography>
              {item.name && (
                <Typography sx={{ fontSize: 11, fontFamily: '"JetBrains Mono","Fira Code",monospace', color: `${accent}`, opacity: 0.75, mt: 0.2, lineHeight: 1 }}>
                  {item.name}
                </Typography>
              )}
            </Box>
            <Box sx={{ color: "text.disabled", opacity: 0.35, flexShrink: 0, mt: 0.25 }}>
              <DragIcon />
            </Box>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

// ── Data sources panel ────────────────────────────────────────────────────────

function DataSourcesPanel({ userSources, onAddSource, onDeleteSource, onFetchSource, onUploadCsv, selectedSources, onPanelClose }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  function handleDragStart(e, source) {
    e.dataTransfer.setData("application/dashy-source", JSON.stringify({ id: source.id, label: source.label }));
    e.dataTransfer.effectAllowed = "copy";
  }

  return (
    <>
      <Box sx={{ px: 1.5, pt: 1, pb: 0.5 }}>
        <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 12, lineHeight: 1.6, display: "block" }}>
          Drag sources into the prompt to focus generation on specific data.
        </Typography>
      </Box>

      <Box sx={{ px: 1.25, py: 0.75, display: "flex", flexDirection: "column", gap: 0.5, flex: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.secondary", fontSize: 12, display: "block", px: 0.5, mb: 0.25 }}>
          Mock Data
        </Typography>

        {MOCK_SOURCES.map((source) => {
          const isSelected = selectedSources.includes(source.id);
          return (
            <Box
              key={source.id}
              draggable
              onDragStart={(e) => handleDragStart(e, source)}
              sx={{
                display: "flex", alignItems: "center", gap: 1,
                py: 0.6, px: 0.75, borderRadius: 2,
                border: "1px solid",
                borderColor: isSelected ? "rgba(37,99,235,0.4)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                bgcolor: isSelected ? "rgba(37,99,235,0.08)" : isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                cursor: "grab",
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: "rgba(37,99,235,0.35)",
                  bgcolor: isDark ? "rgba(37,99,235,0.06)" : "rgba(37,99,235,0.04)",
                },
                "&:active": { cursor: "grabbing" },
              }}
            >
              <Box sx={{ color: isSelected ? "primary.light" : "text.disabled", flexShrink: 0, display: "flex" }}>
                <source.Icon />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: isSelected ? "primary.light" : "text.primary", lineHeight: 1 }}>
                    {source.label}
                  </Typography>
                  <StatusDot color="#22c55e" />
                </Stack>
                <Typography sx={{ fontSize: 12, color: "text.disabled", lineHeight: 1.3, mt: 0.15 }}>{source.desc}</Typography>
              </Box>
              <Box sx={{ color: "text.disabled", opacity: 0.4, flexShrink: 0 }}>
                <DragIcon />
              </Box>
            </Box>
          );
        })}

        {userSources.length > 0 && (
          <>
            <Divider sx={{ my: 0.5 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.secondary", fontSize: 12, display: "block", px: 0.5, mb: 0.25 }}>
              Your Sources
            </Typography>
            {userSources.map((s) => (
              <Box key={s.id} sx={{
                display: "flex", alignItems: "center", gap: 0.75, py: 0.35, px: 0.75,
                borderRadius: 1.5, "&:hover": { bgcolor: "action.hover" }, transition: "background 0.12s",
              }}>
                <StatusDot color={sourceStatus(s)} />
                <Typography component="code" sx={{ fontSize: 13, color: "primary.light", fontFamily: '"JetBrains Mono",monospace', flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 11, flexShrink: 0 }}>{s.type}</Typography>
                {["url","sheets","notion","airtable","db"].includes(s.type) && (
                  <IconButton size="small" onClick={() => onFetchSource(s.id)} sx={{ p: 0.25, color: "text.disabled" }}><RefreshIcon /></IconButton>
                )}
                <IconButton size="small" onClick={() => onDeleteSource(s.id)} sx={{ p: 0.25, color: "text.disabled" }}><DeleteIcon /></IconButton>
              </Box>
            ))}
          </>
        )}
      </Box>

      <Box sx={{ px: 1.25, pb: 1.25 }}>
        <Button
          size="small" variant="outlined" fullWidth
          startIcon={<AddIcon />}
          sx={{ fontSize: 14, borderRadius: 2, borderColor: "divider" }}
          onClick={() => setDialogOpen(true)}
        >
          Add Source
        </Button>
      </Box>

      <AddSourceDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={onAddSource} onSubmitCsv={onUploadCsv} />
    </>
  );
}

// ── Panel wrapper ─────────────────────────────────────────────────────────────

function Panel({ open, onClose, title, children }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <>
      {open && (
        <Box onClick={onClose} sx={{ position: "absolute", inset: 0, zIndex: 40 }} />
      )}
      <Box sx={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 272,
        zIndex: 50,
        display: "flex", flexDirection: "column",
        background: isDark ? "rgba(18,21,28,0.98)" : "rgba(248,250,255,0.98)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid", borderColor: "divider",
        boxShadow: isDark ? "8px 0 40px rgba(0,0,0,0.5)" : "8px 0 32px rgba(0,0,0,0.1)",
        transform: open ? "translateX(0)" : "translateX(-272px)",
        transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1)",
        overflowY: "auto",
      }}>
        <Box sx={{
          px: 1.75, py: 0.875,
          borderBottom: "1px solid", borderColor: "divider",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
          background: isDark
            ? "linear-gradient(135deg, rgba(37,99,235,0.07), rgba(14,165,233,0.03))"
            : "linear-gradient(135deg, rgba(37,99,235,0.04), rgba(14,165,233,0.02))",
        }}>
          <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: 12, color: "text.disabled" }}>
            {title}
          </Typography>
          <IconButton size="small" onClick={onClose} sx={{ color: "text.disabled", "&:hover": { color: "text.primary" }, p: 0.5 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        {children}
      </Box>
    </>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────────

export function ComponentsToolbox({ open, onClose, mode }) {
  return (
    <Panel open={open} onClose={onClose} title="Component Registry">
      {mode === "html"   && <ComponentSection title="HTML Components" label="CSS"    labelColor="primary" items={HTML_COMPONENTS}   onPanelClose={onClose} />}
      {mode === "mui"    && <ComponentSection title="MUI Components"  label="MUI"    labelColor="info"    items={MUI_COMPONENTS}    onPanelClose={onClose} />}
      {mode === "charts" && <ComponentSection title="Recharts Charts" label="CHARTS" labelColor="warning" items={CHARTS_COMPONENTS} onPanelClose={onClose} />}
      {(mode === "infographic" || mode === "diagram") && (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" sx={{ color: "text.disabled", fontSize: 15, lineHeight: 1.7 }}>
            {mode === "infographic"
              ? "Infographic mode generates raw editorial HTML — no component library needed. Use the Data panel to select your sources."
              : "Diagram mode uses D3.js and inline SVG. No component library. Use the Data panel to select your sources."}
          </Typography>
        </Box>
      )}
    </Panel>
  );
}

export function DataToolbox({ open, onClose, userSources, onAddSource, onDeleteSource, onFetchSource, onUploadCsv, selectedSources }) {
  return (
    <Panel open={open} onClose={onClose} title="Data Sources">
      <DataSourcesPanel
        userSources={userSources}
        onAddSource={onAddSource}
        onDeleteSource={onDeleteSource}
        onFetchSource={onFetchSource}
        onUploadCsv={onUploadCsv}
        onPanelClose={onClose}
        selectedSources={selectedSources}
      />
    </Panel>
  );
}

export default { ComponentsToolbox, DataToolbox };
