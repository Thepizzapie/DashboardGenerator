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

const HTML_COMPONENTS = [
  { name: ".stats-grid + .stat-card", desc: "KPI grid — .stat-label / .stat-value / .stat-delta (.positive/.negative)" },
  { name: ".card", desc: "Bordered glass container" },
  { name: ".progress-bar + .progress-fill", desc: "Gradient track — set width% inline" },
  { name: ".badge", desc: "Pill — .badge-green / -red / -amber / -blue" },
  { name: "table / thead / tbody", desc: "Styled data table with hover rows" },
  { name: ".alert", desc: ".alert-info / -success / -warning / -error banners" },
  { name: ".tabs-bar + .tab-btn + .tab-panel", desc: "JS-driven tabs — toggle .active" },
  { name: ".timeline + .timeline-item", desc: "Vertical timeline — .timeline-dot (.green/.amber/.red)" },
  { name: ".kanban + .kanban-col + .kanban-card", desc: "Kanban board columns" },
  { name: ".activity-feed + .activity-item", desc: "Feed — .activity-avatar / .activity-body" },
  { name: ".donut-wrap + .donut", desc: "CSS conic-gradient ring chart + .donut-legend" },
  { name: ".heat-grid + .heat-cell", desc: "Heatmap — intensity .heat-0 to .heat-4" },
  { name: ".sparkline", desc: "Inline SVG polyline mini-chart container" },
  { name: ".kv-grid + .kv-key + .kv-value", desc: "Two-column key/value pairs" },
  { name: ".list-item + .muted", desc: "Flex row space-between / secondary text" },
  { name: ".section-title", desc: "Uppercase section label" },
];

const MUI_COMPONENTS = [
  { name: "useState / useMemo", desc: "React hooks for interactivity" },
  { name: "Box / Stack / Grid / Paper", desc: "Layout primitives with sx prop" },
  { name: "Card + CardContent + CardHeader", desc: "Surface card with optional header" },
  { name: "Typography", desc: "h4–h6, subtitle1/2, body1/2, caption, overline" },
  { name: "Table*", desc: "Container Head Body Row Cell" },
  { name: "Chip", desc: "color: success / error / warning / info / primary" },
  { name: "LinearProgress / CircularProgress", desc: 'variant="determinate" value={0–100}' },
  { name: "Avatar + AvatarGroup", desc: "Initials circle or stacked group" },
  { name: "Badge", desc: "Dot/count overlay on any element" },
  { name: "List + ListItem + ListItemAvatar", desc: "Structured list rows" },
  { name: "Tabs + Tab", desc: "useState tab switching → {tab===0 && ...}" },
  { name: "ToggleButton + ToggleButtonGroup", desc: "Exclusive selection (time range, chart type)" },
  { name: "Accordion + Summary + Details", desc: "Collapsible sections" },
  { name: "Button / ButtonGroup / IconButton", desc: "Actions — variant: contained/outlined/text" },
  { name: "Switch + FormControlLabel", desc: "Toggle boolean state" },
  { name: "Alert + AlertTitle", desc: "severity: success/info/warning/error" },
  { name: "Tooltip", desc: "Hover hint on any element" },
  { name: "Rating", desc: "Star rating (readOnly)" },
  { name: "Stepper + Step + StepLabel", desc: "Progress steps — activeStep={n}" },
  { name: "Skeleton", desc: "Loading placeholder — variant: text/rectangular/circular" },
];

const CHARTS_COMPONENTS = [
  { name: "useState / useMemo", desc: "Hooks for filters, tabs, time-range toggles" },
  { name: "BarChart / LineChart / AreaChart", desc: "Standard time-series and category charts" },
  { name: "ComposedChart", desc: "Mix Bar + Line + Area on same axes" },
  { name: "PieChart + Pie + Cell", desc: "Proportional slices — COLORS array" },
  { name: "RadarChart + Radar + PolarGrid", desc: "Spider chart for multi-metric comparison" },
  { name: "RadialBarChart + RadialBar", desc: "Circular progress bars / gauge" },
  { name: "ScatterChart + Scatter + ZAxis", desc: "Bubble chart — data: [{x,y,z}]" },
  { name: "Treemap", desc: "Proportional rectangles — data: [{name,size}]" },
  { name: "FunnelChart + Funnel + LabelList", desc: "Conversion funnel — data: [{name,value}]" },
  { name: "ResponsiveContainer", desc: "Always wraps charts — width=100% height={280}" },
  { name: "XAxis / YAxis / CartesianGrid", desc: "Axes + gridlines styling" },
  { name: "Tooltip + Legend", desc: "Interactive overlays with custom contentStyle" },
  { name: "ReferenceLine", desc: "Target/threshold — strokeDasharray for dashed" },
  { name: "Brush", desc: "Scroll/zoom handle for long datasets" },
  { name: "Tabs / ToggleButtonGroup", desc: "Switch chart types or time ranges" },
];

const MOCK_SOURCES = [
  { id: "employees",      desc: "name, dept, role, status, hire_date, salary" },
  { id: "projects",       desc: "name, owner, status, pct_complete, budget, spent, due_date" },
  { id: "kpi_metrics",    desc: "label, value, delta, target, current_val" },
  { id: "inventory",      desc: "item, sku, qty, capacity, unit, status, reorder_point" },
  { id: "sales_pipeline", desc: "deal, stage, value, probability, close_date, rep" },
  { id: "support",        desc: "id, subject, priority, status, created_at, assignee, hours_open" },
  { id: "budget",         desc: "department, allocated, spent, remaining (derive % used)" },
  { id: "sprint",         desc: "story, points, status, assignee, sprint (derive velocity)" },
];

function sourceStatus(s) {
  if (!s.last_fetched) return "#64748b";
  const age = (Date.now() - new Date(s.last_fetched).getTime()) / 1000;
  return age < s.cache_ttl ? "#22c55e" : "#f59e0b";
}

function StatusDot({ color }) {
  return <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />;
}

function Section({ title, label, labelColor, items, nameKey = "name", descKey = "desc", defaultExpanded = false }) {
  const [open, setOpen] = useState(defaultExpanded);
  return (
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
            {title}
          </Typography>
          <Chip label={label} size="small" color={labelColor} sx={{ height: 16, fontSize: 10, fontWeight: 700 }} />
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1.5, pt: 0, pb: 1.5 }}>
        {items.map((item) => (
          <Box key={item[nameKey]} sx={{ py: 0.5 }}>
            <Typography
              component="code"
              sx={{ fontSize: 11, color: "primary.light", fontFamily: '"JetBrains Mono","Fira Code","Consolas",monospace', display: "block" }}
            >
              {item[nameKey]}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {item[descKey]}
            </Typography>
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

        <AccordionDetails sx={{ px: 1.5, pt: 0, pb: 1.5 }}>
          {/* Mock sources */}
          {MOCK_SOURCES.map((s) => (
            <Box key={s.id} sx={{ py: 0.5 }}>
              <Stack direction="row" alignItems="center" spacing={0.75}>
                <StatusDot color="#22c55e" />
                <Typography component="code" sx={{ fontSize: 11, color: "primary.light", fontFamily: '"JetBrains Mono","Fira Code","Consolas",monospace' }}>
                  {s.id}
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: "text.secondary", pl: 1.75, display: "block" }}>
                {s.desc}
              </Typography>
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

export default function Sidebar({ mode, drawerWidth, userSources, onAddSource, onDeleteSource, onFetchSource, onUploadCsv }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          position: "relative",
          height: "100%",
          overflowY: "auto",
        },
      }}
    >
      {/* Section header */}
      <Box sx={{
        px: 2, py: 1.25,
        borderBottom: "1px solid",
        borderColor: "divider",
        background: isDark
          ? "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(14,165,233,0.04) 100%)"
          : "linear-gradient(135deg, rgba(37,99,235,0.05) 0%, rgba(14,165,233,0.03) 100%)",
      }}>
        <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
          Component Registry
        </Typography>
      </Box>

      <Section
        title="HTML Components"
        label="CSS"
        labelColor="primary"
        items={HTML_COMPONENTS}
        defaultExpanded={mode === "html"}
      />
      <Section
        title="MUI Components"
        label="MUI"
        labelColor="info"
        items={MUI_COMPONENTS}
        defaultExpanded={mode === "mui"}
      />
      <Section
        title="Recharts Charts"
        label="CHARTS"
        labelColor="warning"
        items={CHARTS_COMPONENTS}
        defaultExpanded={mode === "charts"}
      />
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
