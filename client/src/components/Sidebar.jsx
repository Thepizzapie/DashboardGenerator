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
  { name: ".stats-grid", desc: "KPI stat card grid" },
  { name: ".stat-card", desc: "Metric card w/ label + value" },
  { name: ".stat-delta", desc: "Change indicator (.positive / .negative)" },
  { name: ".card", desc: "Bordered container" },
  { name: ".progress-bar", desc: "Track + .progress-fill (width%)" },
  { name: ".badge", desc: "Pill — green / red / amber / blue" },
  { name: "table", desc: "thead / tbody / th / td" },
  { name: ".list-item", desc: "Flex row, space-between" },
  { name: ".section-title", desc: "Uppercase section label" },
  { name: ".muted", desc: "Secondary text" },
  { name: "h2, h3", desc: "Typographic headings" },
];

const MUI_COMPONENTS = [
  { name: "Typography", desc: "variant: h4 h5 h6 body1 body2 caption" },
  { name: "Card + CardContent", desc: "Elevated surface container" },
  { name: "Grid", desc: "Responsive 12-col layout" },
  { name: "Stack", desc: "Flex container with spacing/direction" },
  { name: "Paper", desc: "elevation={1–8} surface" },
  { name: "Table*", desc: "Container Head Body Row Cell" },
  { name: "Chip", desc: "color: success / error / warning / info / primary" },
  { name: "LinearProgress", desc: 'variant="determinate" value={0–100}' },
  { name: "Avatar", desc: "sx={{ bgcolor }} for initials" },
  { name: "List + ListItem", desc: "ListItemText, ListItemAvatar" },
  { name: "Divider", desc: "Horizontal separator" },
  { name: "Box", desc: "Generic container with sx prop" },
];

const CHARTS_COMPONENTS = [
  { name: "BarChart", desc: "Vertical/horizontal bars" },
  { name: "LineChart", desc: "Trend lines over time" },
  { name: "AreaChart", desc: "Filled area under line" },
  { name: "PieChart + Pie + Cell", desc: "Proportional slices with colors" },
  { name: "ResponsiveContainer", desc: "Always wraps charts, width=100%" },
  { name: "XAxis / YAxis", desc: "Axes with tick config" },
  { name: "CartesianGrid", desc: "Background gridlines" },
  { name: "Tooltip + Legend", desc: "Interactive overlays" },
  { name: "ReferenceLine", desc: "Target/threshold line" },
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
              sx={{ fontSize: 11, color: "primary.light", fontFamily: '"SF Mono","Fira Code","Consolas",monospace', display: "block" }}
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
                <Typography component="code" sx={{ fontSize: 11, color: "primary.light", fontFamily: '"SF Mono","Fira Code","Consolas",monospace' }}>
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
                <Stack key={s.id} direction="row" alignItems="center" spacing={0.5} sx={{ py: 0.25 }}>
                  <StatusDot color={sourceStatus(s)} />
                  <Typography component="code" sx={{ fontSize: 11, color: "primary.light", fontFamily: '"SF Mono","Fira Code","Consolas",monospace', flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.name}
                  </Typography>
                  {s.type === "url" && (
                    <IconButton size="small" onClick={() => onFetchSource(s.id)} sx={{ p: 0.25 }} title="Refresh">
                      <RefreshIcon />
                    </IconButton>
                  )}
                  <IconButton size="small" onClick={() => onDeleteSource(s.id)} sx={{ p: 0.25 }} title="Delete">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
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
      {/* Logo header */}
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
        <img src="/logo.png" alt="Dashy" style={{ height: 52, borderRadius: 4 }} />
        <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
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
