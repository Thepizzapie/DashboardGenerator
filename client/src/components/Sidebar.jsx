import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";

const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
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

const DATA_SOURCES = [
  { id: "employees",      desc: "name, dept, role, status, hire_date, salary" },
  { id: "projects",       desc: "name, owner, status, pct_complete, budget, spent, due_date" },
  { id: "kpi_metrics",    desc: "label, value, delta, target, current_val" },
  { id: "inventory",      desc: "item, sku, qty, capacity, unit, status, reorder_point" },
  { id: "sales_pipeline", desc: "deal, stage, value, probability, close_date, rep" },
  { id: "support",        desc: "id, subject, priority, status, created_at, assignee, hours_open" },
  { id: "budget",         desc: "department, allocated, spent, remaining (derive % used)" },
  { id: "sprint",         desc: "story, points, status, assignee, sprint (derive velocity)" },
];

function Section({ title, label, labelColor, items, nameKey = "name", descKey = "desc", defaultExpanded = false }) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
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

export default function Sidebar({ mode, drawerWidth }) {
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
      <Box sx={{ px: 1.5, py: 1.5 }}>
        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "text.secondary" }}>
          Registry
        </Typography>
      </Box>
      <Divider />

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
        title="Data Sources"
        label="MOCK"
        labelColor="success"
        items={DATA_SOURCES}
        nameKey="id"
        defaultExpanded
      />
    </Drawer>
  );
}
