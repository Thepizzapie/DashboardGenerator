import { useState } from "react";
import Drawer from "@mui/material/Drawer";
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
import { useTheme } from "@mui/material/styles";
import AddSourceDialog from "./AddSourceDialog";

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

// icon + friendly label + code name + what it's for
const HTML_COMPONENTS = [
  { icon: "📊", label: "Stat Card Grid",    name: ".stats-grid",      desc: "Big numbers, labels & trend arrows in a responsive grid" },
  { icon: "🗃",  label: "Card Container",   name: ".card",            desc: "Bordered glass surface for grouping any content" },
  { icon: "📈", label: "Progress Bar",      name: ".progress-bar",    desc: "Gradient fill track — set width% per row" },
  { icon: "🏷",  label: "Status Badge",     name: ".badge",           desc: "Color-coded pill: green / red / amber / blue" },
  { icon: "📋", label: "Data Table",        name: "table",            desc: "Sortable rows with hover highlights & styled headers" },
  { icon: "🚨", label: "Alert Banner",      name: ".alert",           desc: "Info / success / warning / error notification strip" },
  { icon: "📑", label: "Tabs",             name: ".tabs-bar",        desc: "JS-driven tab switching with active state" },
  { icon: "🕐", label: "Timeline",         name: ".timeline",        desc: "Vertical event list with color-coded dot markers" },
  { icon: "🗂",  label: "Kanban Board",     name: ".kanban",          desc: "Drag-ready columns for status-based workflows" },
  { icon: "💬", label: "Activity Feed",    name: ".activity-feed",   desc: "Avatar + text + timestamp event stream" },
  { icon: "🍩", label: "Donut Chart",      name: ".donut",           desc: "CSS conic-gradient ring with percentage fill" },
  { icon: "🔥", label: "Heatmap Grid",     name: ".heat-grid",       desc: "Color-intensity cells — 5 levels (heat-0 to heat-4)" },
  { icon: "📉", label: "Sparkline",        name: ".sparkline",       desc: "Inline SVG mini-chart for compact trend indicators" },
  { icon: "🗒",  label: "Key / Value Grid", name: ".kv-grid",         desc: "Two-column label/value pairs for metadata" },
  { icon: "📝", label: "List Row",         name: ".list-item",       desc: "Flex row with left label and right value" },
];

const MUI_COMPONENTS = [
  { icon: "⚡", label: "State & Memo",      name: "useState / useMemo",        desc: "React hooks — tabs, filters, sorting, search" },
  { icon: "📐", label: "Layout Primitives", name: "Box / Stack / Grid / Paper", desc: "Flex, grid and surface containers via sx prop" },
  { icon: "🗃",  label: "Card",              name: "Card + CardContent",         desc: "Elevated content surface with optional header" },
  { icon: "🔤", label: "Typography",        name: "Typography",                 desc: "h4–h6, body1/2, caption, overline variants" },
  { icon: "📋", label: "Data Table",        name: "Table + TableRow + TableCell",desc: "Sortable, filterable data table" },
  { icon: "🏷",  label: "Chip / Badge",      name: "Chip / Badge",               desc: "Status pills and notification count overlays" },
  { icon: "📊", label: "Progress",          name: "LinearProgress / CircularProgress", desc: "Determinate fill bars and ring gauges" },
  { icon: "👤", label: "Avatar",            name: "Avatar + AvatarGroup",       desc: "Initials circles or stacked group" },
  { icon: "📑", label: "Tabs",             name: "Tabs + Tab",                 desc: "Tab switching with useState — show/hide sections" },
  { icon: "🔀", label: "Toggle Group",     name: "ToggleButtonGroup",          desc: "Exclusive selection — time range, chart type" },
  { icon: "🗂",  label: "Accordion",        name: "Accordion",                  desc: "Collapsible sections with expand/collapse" },
  { icon: "🔘", label: "Buttons",          name: "Button / ButtonGroup",       desc: "Actions — contained, outlined, text variants" },
  { icon: "🔦", label: "Switch",           name: "Switch + FormControlLabel",  desc: "Boolean toggle with label" },
  { icon: "⚠️", label: "Alert",            name: "Alert + AlertTitle",         desc: "Severity banners: success / info / warning / error" },
  { icon: "💬", label: "Tooltip",          name: "Tooltip",                    desc: "Hover hint on any element" },
  { icon: "⭐", label: "Rating",           name: "Rating",                     desc: "Read-only star rating display" },
  { icon: "✅", label: "Stepper",          name: "Stepper + Step + StepLabel", desc: "Multi-step progress indicator" },
  { icon: "💀", label: "Skeleton",         name: "Skeleton",                   desc: "Loading placeholder for any shape" },
];

const CHARTS_COMPONENTS = [
  { icon: "⚡", label: "Interactivity",     name: "useState / useMemo",          desc: "Filter, sort, tab-switch, time-range slice" },
  { icon: "📊", label: "Bar Chart",         name: "BarChart",                    desc: "Vertical or horizontal bars (layout='vertical')" },
  { icon: "📈", label: "Line Chart",        name: "LineChart",                   desc: "Trend lines — multi-series with multiple <Line>" },
  { icon: "🌊", label: "Area Chart",        name: "AreaChart",                   desc: "Filled area under line — stacked with fillOpacity" },
  { icon: "🔀", label: "Composed Chart",    name: "ComposedChart",               desc: "Mix Bar + Line + Area on the same axes" },
  { icon: "🍩", label: "Pie Chart",         name: "PieChart + Pie + Cell",       desc: "Proportional slices with COLORS array" },
  { icon: "🕸",  label: "Radar Chart",      name: "RadarChart + Radar",          desc: "Spider chart for multi-metric comparison" },
  { icon: "🎯", label: "Radial Bar",        name: "RadialBarChart + RadialBar",  desc: "Circular progress gauge — semicircle or full" },
  { icon: "💭", label: "Scatter / Bubble",  name: "ScatterChart + Scatter",      desc: "x/y/z bubble plot — data: [{x,y,z}]" },
  { icon: "🟦", label: "Treemap",           name: "Treemap",                     desc: "Proportional rectangles — data: [{name,size}]" },
  { icon: "🔽", label: "Funnel Chart",      name: "FunnelChart + Funnel",        desc: "Conversion funnel — sorted [{name,value}]" },
  { icon: "📏", label: "Axes & Grid",       name: "XAxis / YAxis / CartesianGrid", desc: "Axis labels, ticks and background gridlines" },
  { icon: "💡", label: "Tooltip & Legend",  name: "Tooltip + Legend",            desc: "Interactive overlays with custom styling" },
  { icon: "🎯", label: "Reference Line",    name: "ReferenceLine",               desc: "Target or threshold — dashed strokeDasharray" },
  { icon: "🔭", label: "Brush / Zoom",      name: "Brush",                       desc: "Scroll and zoom handle for long datasets" },
];

const MOCK_SOURCES = [
  { id: "employees",      icon: "👥", label: "Employees",      desc: "10 staff · name, dept, role, salary, status" },
  { id: "projects",       icon: "📁", label: "Projects",       desc: "7 projects · status, budget, progress %" },
  { id: "kpi_metrics",    icon: "📊", label: "KPI Metrics",    desc: "8 KPIs · value, delta, target" },
  { id: "inventory",      icon: "📦", label: "Inventory",      desc: "8 items · qty, capacity, reorder alerts" },
  { id: "sales_pipeline", icon: "💼", label: "Sales Pipeline", desc: "7 deals · stage, value, probability" },
  { id: "support",        icon: "🎫", label: "Support Tickets",desc: "7 tickets · priority, status, hours open" },
  { id: "budget",         icon: "💰", label: "Budget",         desc: "7 depts · allocated, spent, remaining" },
  { id: "sprint",         icon: "🏃", label: "Sprint",         desc: "8 stories · points, status, velocity" },
];

function sourceStatus(s) {
  if (!s.last_fetched) return "#64748b";
  const age = (Date.now() - new Date(s.last_fetched).getTime()) / 1000;
  return age < s.cache_ttl ? "#22c55e" : "#f59e0b";
}

function StatusDot({ color }) {
  return <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />;
}

function Section({ title, label, labelColor, items, defaultExpanded = false }) {
  const [open, setOpen] = useState(defaultExpanded);
  return (
    <Accordion
      expanded={open}
      onChange={(_, val) => setOpen(val)}
      disableGutters elevation={0}
      sx={{ background: "transparent", "&:before": { display: "none" }, borderBottom: "1px solid", borderColor: "divider" }}
    >
      <AccordionSummary
        expandIcon={<ExpandIcon />}
        sx={{ px: 1.5, py: 0, minHeight: 40, "& .MuiAccordionSummary-content": { my: 0 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.secondary" }}>
            {title}
          </Typography>
          <Chip label={label} size="small" color={labelColor} sx={{ height: 16, fontSize: 10, fontWeight: 700 }} />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1.5, pt: 0.5, pb: 1.5, display: "flex", flexDirection: "column", gap: 0.5 }}>
        {items.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: "flex", alignItems: "flex-start", gap: 1,
              py: 0.6, px: 0.75,
              borderRadius: 1.5,
              "&:hover": { bgcolor: "action.hover" },
              transition: "background 0.12s",
            }}
          >
            <Typography sx={{ fontSize: 14, lineHeight: 1, mt: 0.15, flexShrink: 0 }}>{item.icon}</Typography>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.primary", lineHeight: 1.3 }}>
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: 10, color: "text.disabled", lineHeight: 1.4, mt: 0.2 }}>
                {item.desc}
              </Typography>
              {item.name && (
                <Typography sx={{ fontSize: 9.5, fontFamily: '"JetBrains Mono","Fira Code",monospace', color: "primary.light", opacity: 0.7, mt: 0.3, lineHeight: 1 }}>
                  {item.name}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
}

function DataSourcesSection({ userSources, onAddSource, onDeleteSource, onFetchSource, onUploadCsv }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(true);

  return (
    <>
      <Accordion
        expanded={open}
        onChange={(_, val) => setOpen(val)}
        disableGutters
        elevation={0}
        sx={{
          background: "transparent",
          "&:before": { display: "none" },
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandIcon />}
          sx={{ px: 1.5, py: 0, minHeight: 40, "& .MuiAccordionSummary-content": { my: 0 } }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.secondary" }}>
              Data Sources
            </Typography>
            <Chip label="MOCK" size="small" color="success" sx={{ height: 16, fontSize: 10, fontWeight: 700 }} />
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 1.5, pt: 0.5, pb: 1.5, display: "flex", flexDirection: "column", gap: 0.25 }}>
          {/* Mock sources — friendly cards */}
          {MOCK_SOURCES.map((s) => (
            <Box key={s.id} sx={{ display: "flex", alignItems: "flex-start", gap: 1, py: 0.6, px: 0.75, borderRadius: 1.5, "&:hover": { bgcolor: "action.hover" }, transition: "background 0.12s" }}>
              <Typography sx={{ fontSize: 15, lineHeight: 1, mt: 0.1, flexShrink: 0 }}>{s.icon}</Typography>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.primary" }}>{s.label}</Typography>
                  <StatusDot color="#22c55e" />
                </Stack>
                <Typography sx={{ fontSize: 10, color: "text.disabled", lineHeight: 1.4 }}>{s.desc}</Typography>
                <Typography sx={{ fontSize: 9, fontFamily: '"JetBrains Mono",monospace', color: "primary.light", opacity: 0.6, mt: 0.25 }}>{s.id}</Typography>
              </Box>
            </Box>
          ))}

          {/* User sources */}
          {userSources.length > 0 && (
            <>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary", display: "block", mb: 0.5 }}>
                Your Sources
              </Typography>
              {userSources.map((s) => (
                <Box key={s.id} sx={{ py: 0.25 }}>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <StatusDot color={sourceStatus(s)} />
                    <Typography component="code" sx={{ fontSize: 11, color: "primary.light", fontFamily: '"JetBrains Mono","Fira Code","Consolas",monospace', flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 9, flexShrink: 0 }}>{s.type}</Typography>
                    {["url","sheets","notion","airtable","db"].includes(s.type) && (
                      <IconButton size="small" onClick={() => onFetchSource(s.id)} sx={{ p: 0.25 }} title="Refresh">
                        <RefreshIcon />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => onDeleteSource(s.id)} sx={{ p: 0.25 }} title="Delete">
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                  {s.type === "webhook" && s.webhookUrl && (
                    <Box
                      onClick={() => navigator.clipboard.writeText(`http://localhost:3001${s.webhookUrl}`)}
                      sx={{ mt: 0.5, ml: 1.5, px: 1, py: 0.5, bgcolor: "background.default", borderRadius: 1, border: "1px solid", borderColor: "divider", cursor: "pointer", "&:hover": { borderColor: "primary.main" }, transition: "border-color 0.15s" }}
                      title="Click to copy webhook URL"
                    >
                      <Typography sx={{ fontSize: 9, fontFamily: '"JetBrains Mono", monospace', color: "text.disabled", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        POST {s.webhookUrl}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </>
          )}

          <Button
            size="small"
            variant="outlined"
            fullWidth
            sx={{ mt: 1.5, fontSize: 11 }}
            onClick={() => setDialogOpen(true)}
          >
            + Add Source
          </Button>
        </AccordionDetails>
      </Accordion>

      <AddSourceDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={onAddSource}
        onSubmitCsv={onUploadCsv}
      />
    </>
  );
}

export default function Sidebar({ open, mode, drawerWidth, userSources, onAddSource, onDeleteSource, onFetchSource, onUploadCsv }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        transition: "width 0.22s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          position: "relative",
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          transform: open ? "translateX(0)" : `translateX(-${drawerWidth}px)`,
          transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1)",
        },
      }}
    >
      {/* Section header */}
      <Box sx={{
        px: 2, py: 1,
        borderBottom: "1px solid", borderColor: "divider",
        background: isDark
          ? "linear-gradient(135deg, rgba(37,99,235,0.07) 0%, rgba(14,165,233,0.03) 100%)"
          : "linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(14,165,233,0.02) 100%)",
      }}>
        <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
          {mode === "infographic" || mode === "diagram" ? "Data Sources" : "Component Registry"}
        </Typography>
      </Box>

      {mode === "html"   && <Section title="HTML Components" label="CSS"    labelColor="primary" items={HTML_COMPONENTS}   defaultExpanded={true} />}
      {mode === "mui"    && <Section title="MUI Components"  label="MUI"    labelColor="info"    items={MUI_COMPONENTS}    defaultExpanded={true} />}
      {mode === "charts" && <Section title="Recharts Charts" label="CHARTS" labelColor="warning" items={CHARTS_COMPONENTS} defaultExpanded={true} />}

      <DataSourcesSection
        userSources={userSources}
        onAddSource={onAddSource}
        onDeleteSource={onDeleteSource}
        onFetchSource={onFetchSource}
        onUploadCsv={onUploadCsv}
      />
    </Drawer>
  );
}
