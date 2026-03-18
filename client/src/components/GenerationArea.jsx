import { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { useTheme, alpha } from "@mui/material/styles";
import MuiCanvas from "./MuiCanvas";
import EditPanel from "./EditPanel";
import { MOCK_SOURCES } from "./Toolbox";

// ── SVG Icons ──────────────────────────────────────────────────────────────────

const ExamplesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor" strokeWidth="0"/>
  </svg>
);
const PipelineIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

// ── Constants ──────────────────────────────────────────────────────────────────

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
  infographic: [
    "Make me a one-pager on the state of our sales pipeline — what's in it, where deals are stalling, and what we're likely to close",
    "I want to share our sprint performance with stakeholders — what shipped, what slipped, and our velocity trend",
    "Create a budget overview I can send to leadership — spending by team, who's on track, and where we're burning fast",
    "Make an infographic showing who we have, what they cost, and how salaries compare across departments",
    "I need a one-pager on our support queue — volume, avg resolution time, and which issues keep coming back",
    "Show the health of our inventory at a glance — what's running low, what's sitting idle, and what needs action",
    "Give me an exec summary of all active projects — on track, at risk, and over budget",
    "Make a team performance snapshot I can put in a weekly report — key numbers, highlights, and what's at risk",
    "Show our KPIs in a visual I can drop into a slide deck — actuals vs targets with trend arrows",
    "Create a company health dashboard infographic — people, projects, budget, and pipeline all on one page",
  ],
  diagram: [
    "Show me which employees are assigned to which projects and how much of the budget each project has burned",
    "Map out every open support ticket by priority and which team member owns it",
    "Show the full sales pipeline — every deal, what stage it's in, and the probability-weighted value",
    "Give me a bird's eye view of our sprint — which stories are done, in progress, and blocked, and who's on each",
    "Visualize the org structure with salaries and which departments are over headcount budget",
    "Show how our budget is flowing — allocated vs spent per department with a warning on anything over 80%",
    "Draw the dependency graph between all active projects — which ones are blocking others",
    "Show me each employee's workload: how many projects they're on, their role, and their current status",
    "Map out our inventory health — what's critically low, what's overstocked, and reorder urgency by item",
    "Show the entire project portfolio on a risk matrix — probability of delay vs business impact",
  ],
};

const MODE_LABEL = {
  html:        "HTML",
  mui:         "MUI",
  charts:      "Charts",
  infographic: "Infographic",
  diagram:     "Diagram",
};

const PIPELINE_STEPS = [
  { key: "planning",   label: "Planning"   },
  { key: "styling",    label: "Styling"    },
  { key: "generating", label: "Generating" },
  { key: "inspecting", label: "Inspecting" },
  { key: "critiquing", label: "Critiquing" },
  { key: "refining",   label: "Refining"   },
  { key: "done",       label: "Done"       },
];

// ── Sarcastic loading messages ────────────────────────────────────────────────

const SINGLE_MESSAGES = [
  "Asking Claude nicely…",
  "Converting vague English into pixels…",
  "Somewhere a GPU is getting very warm…",
  "Still faster than a junior dev on a Friday…",
  "Hallucinating responsibly…",
  "Teaching the model what a dashboard is, again…",
  "Negotiating with the API…",
  "It's thinking. Probably.",
  "Pretending this isn't just string manipulation…",
  "Cooking. Please do not open the oven.",
];

const PIPELINE_SARCASM = {
  planning:   ["Holding a meeting about the meeting…", "Drawing boxes on a whiteboard…", "Asking what success looks like…"],
  styling:    ["Debating whether the accent is too blue…", "Picking fonts nobody asked for…", "Making it pop…"],
  generating: ["Actually doing the work now…", "This is the long part. Go get coffee.", "The model is in flow state, do not disturb…"],
  inspecting: ["Checking if anything is clipping…", "Squinting at the SVG viewBox…", "Finding all the things that fall off screen…", "Pixel-peeping so you don't have to…"],
  critiquing: ["Finding problems with its own work…", "Having an existential crisis about the layout…", "Grading its own homework…"],
  refining:   ["Fixing the things it just broke…", "Second-guessing everything…", "One more pass, it said. One more pass."],
  done:       ["Done. Finally."],
};

// ── Mode-specific empty state content ─────────────────────────────────────────

const MODE_EMPTY = {
  html: {
    headline: "Build dashboards at the speed of thought.",
    desc: "Describe what you want in plain English. Dashy generates a fully rendered HTML dashboard backed by real data — in seconds.",
    steps: [
      "Open the Data panel and drag sources into the prompt",
      "Describe your dashboard in plain English",
      "Press Generate (or Ctrl+Enter)",
      "Refine with the Edit panel below",
    ],
    Illustration: () => (
      <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Browser chrome */}
        <rect x="1" y="1" width="218" height="148" rx="10" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
        <rect x="1" y="1" width="218" height="26" rx="10" fill="currentColor" fillOpacity="0.06"/>
        <circle cx="18" cy="14" r="4" fill="currentColor" fillOpacity="0.18"/>
        <circle cx="32" cy="14" r="4" fill="currentColor" fillOpacity="0.18"/>
        <circle cx="46" cy="14" r="4" fill="currentColor" fillOpacity="0.18"/>
        <rect x="64" y="8" width="100" height="12" rx="6" fill="currentColor" fillOpacity="0.07"/>
        {/* 3 stat cards */}
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x={12 + i * 70} y="36" width="62" height="38" rx="5" fill="currentColor" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"/>
            <rect x={20 + i * 70} y="44" width="28" height="7" rx="2" fill="currentColor" fillOpacity="0.22"/>
            <rect x={20 + i * 70} y="56" width="18" height="4" rx="1.5" fill="currentColor" fillOpacity="0.1"/>
            <rect x={20 + i * 70} y="63" width="36" height="3" rx="1" fill="currentColor" fillOpacity="0.06"/>
          </g>
        ))}
        {/* Table header */}
        <rect x="12" y="84" width="196" height="12" rx="3" fill="currentColor" fillOpacity="0.08"/>
        {/* Table rows */}
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x="12" y={102 + i * 13} width="196" height="10" rx="2" fill="currentColor" fillOpacity={i % 2 === 0 ? 0.04 : 0}/>
            <rect x="18" y={104 + i * 13} width="44" height="5" rx="1.5" fill="currentColor" fillOpacity="0.1"/>
            <rect x="80" y={104 + i * 13} width="30" height="5" rx="1.5" fill="currentColor" fillOpacity="0.07"/>
            <rect x="140" y={104 + i * 13} width="22" height="5" rx="1.5" fill="currentColor" fillOpacity="0.07"/>
            <rect x="178" y={103 + i * 13} width="20" height="7" rx="3" fill="currentColor" fillOpacity="0.12"/>
          </g>
        ))}
      </svg>
    ),
  },
  mui: {
    headline: "Material UI dashboards, generated instantly.",
    desc: "Describe what you need. Dashy generates a fully interactive React + MUI component tree with real data, tabs, and controls.",
    steps: [
      "Select data sources from the Data panel",
      "Describe your MUI dashboard or view",
      "Press Generate (or Ctrl+Enter)",
      "Use Edit panel to adjust layout or theme",
    ],
    Illustration: () => (
      <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tab bar */}
        {["Overview","Team","Budget"].map((_, i) => (
          <rect key={i} x={12 + i * 52} y="8" width="46" height="18" rx="5"
            fill="currentColor" fillOpacity={i === 0 ? 0.18 : 0.05}
            stroke="currentColor" strokeOpacity={i === 0 ? 0.25 : 0.08} strokeWidth="1"/>
        ))}
        <rect x="12" y="34" width="1" height="110" rx="1" fill="currentColor" fillOpacity="0"/>
        {/* Left card */}
        <rect x="12" y="34" width="98" height="108" rx="7" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"/>
        <circle cx="38" cy="56" r="14" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1"/>
        <rect x="58" y="50" width="40" height="7" rx="2" fill="currentColor" fillOpacity="0.18"/>
        <rect x="58" y="62" width="26" height="4" rx="1.5" fill="currentColor" fillOpacity="0.1"/>
        <rect x="20" y="82" width="82" height="3" rx="1" fill="currentColor" fillOpacity="0.08"/>
        <rect x="20" y="90" width="60" height="3" rx="1" fill="currentColor" fillOpacity="0.06"/>
        {/* Progress bars */}
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x="20" y={104 + i * 14} width="82" height="5" rx="2.5" fill="currentColor" fillOpacity="0.06"/>
            <rect x="20" y={104 + i * 14} width={[55,38,70][i]} height="5" rx="2.5" fill="currentColor" fillOpacity="0.22"/>
          </g>
        ))}
        {/* Right top card */}
        <rect x="118" y="34" width="90" height="52" rx="7" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"/>
        <rect x="128" y="44" width="36" height="8" rx="2" fill="currentColor" fillOpacity="0.2"/>
        <rect x="128" y="57" width="24" height="4" rx="1.5" fill="currentColor" fillOpacity="0.1"/>
        <rect x="128" y="65" width="64" height="4" rx="1.5" fill="currentColor" fillOpacity="0.07"/>
        {/* Right bottom card */}
        <rect x="118" y="94" width="90" height="48" rx="7" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1"/>
        {[0,1,2].map(i => (
          <rect key={i} x="128" y={104 + i * 12} width={[64,50,56][i]} height="5" rx="1.5" fill="currentColor" fillOpacity="0.09"/>
        ))}
        <rect x="170" y="128" width="28" height="8" rx="4" fill="currentColor" fillOpacity="0.18"/>
      </svg>
    ),
  },
  charts: {
    headline: "Interactive Recharts dashboards, on demand.",
    desc: "Describe what you want to measure. Dashy generates a fully interactive chart dashboard with filters, tooltips, and real data.",
    steps: [
      "Drag data sources from the Data panel",
      "Describe the charts and metrics you need",
      "Press Generate (or Ctrl+Enter)",
      "Switch chart types via the Edit panel",
    ],
    Illustration: () => (
      <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Y axis */}
        <line x1="28" y1="10" x2="28" y2="120" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
        {/* X axis */}
        <line x1="28" y1="120" x2="210" y2="120" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
        {/* Gridlines */}
        {[30,60,90].map(y => (
          <line key={y} x1="28" y1={y} x2="210" y2={y} stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" strokeDasharray="4 3"/>
        ))}
        {/* Bars */}
        {[
          { x: 36,  h: 64, o: 0.13 },
          { x: 62,  h: 42, o: 0.10 },
          { x: 88,  h: 80, o: 0.14 },
          { x: 114, h: 30, o: 0.09 },
          { x: 140, h: 95, o: 0.16 },
          { x: 166, h: 55, o: 0.12 },
          { x: 192, h: 70, o: 0.13 },
        ].map((b, i) => (
          <rect key={i} x={b.x} y={120 - b.h} width="18" height={b.h} rx="3"
            fill="currentColor" fillOpacity={b.o} stroke="currentColor" strokeOpacity="0.18" strokeWidth="1"/>
        ))}
        {/* Line overlay */}
        <polyline
          points="45,76 71,92 97,54 123,102 149,34 175,74 201,58"
          fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" strokeLinejoin="round"
        />
        {[45,71,97,123,149,175,201].map((x, i) => {
          const ys = [76,92,54,102,34,74,58];
          return (
            <circle key={i} cx={x} cy={ys[i]} r="3.5"
              fill="currentColor" fillOpacity="0.5"
              stroke="currentColor" strokeOpacity="0.3" strokeWidth="1"/>
          );
        })}
        {/* Legend */}
        <rect x="36" y="134" width="10" height="6" rx="1.5" fill="currentColor" fillOpacity="0.15"/>
        <rect x="50" y="136" width="30" height="3" rx="1" fill="currentColor" fillOpacity="0.1"/>
        <circle cx="96" cy="137" r="3" fill="currentColor" fillOpacity="0.35"/>
        <rect x="102" y="136" width="28" height="3" rx="1" fill="currentColor" fillOpacity="0.1"/>
      </svg>
    ),
  },
  infographic: {
    headline: "Tell a story with your data.",
    desc: "Describe what you want to visualize. Dashy generates an editorial-quality infographic in the style of NYT, Bloomberg, or Reuters.",
    steps: [
      "Add data sources from the Data panel for accuracy",
      "Write a story prompt — what should the reader learn?",
      "Press Generate — the 6-agent pipeline runs automatically",
      "Export as HTML or screenshot",
    ],
    Illustration: () => (
      <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer frame */}
        <rect x="1" y="1" width="218" height="148" rx="8" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1"/>
        {/* Top rule */}
        <rect x="12" y="12" width="196" height="2" rx="1" fill="currentColor" fillOpacity="0.2"/>
        {/* Big headline */}
        <rect x="12" y="20" width="140" height="10" rx="2" fill="currentColor" fillOpacity="0.22"/>
        <rect x="12" y="34" width="100" height="6" rx="2" fill="currentColor" fillOpacity="0.12"/>
        {/* Deck / subhead */}
        <rect x="12" y="46" width="120" height="4" rx="1.5" fill="currentColor" fillOpacity="0.07"/>
        <rect x="12" y="54" width="108" height="4" rx="1.5" fill="currentColor" fillOpacity="0.07"/>
        {/* Divider rule */}
        <line x1="12" y1="64" x2="208" y2="64" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1"/>
        {/* Left column — bar chart */}
        <rect x="12" y="72" width="96" height="68" rx="4" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1"/>
        {[0,1,2,3,4].map(i => (
          <g key={i}>
            <rect x="18" y={78 + i * 12} width={[68,52,80,44,72][i]} height="7" rx="2" fill="currentColor" fillOpacity="0.12"/>
          </g>
        ))}
        {/* Pull quote box */}
        <rect x="116" y="72" width="92" height="34" rx="4" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1"/>
        <rect x="124" y="80" width="2" height="18" rx="1" fill="currentColor" fillOpacity="0.3"/>
        <rect x="130" y="80" width="68" height="4" rx="1" fill="currentColor" fillOpacity="0.12"/>
        <rect x="130" y="88" width="56" height="4" rx="1" fill="currentColor" fillOpacity="0.1"/>
        <rect x="130" y="96" width="62" height="4" rx="1" fill="currentColor" fillOpacity="0.08"/>
        {/* Right column — text */}
        {[0,1,2].map(i => (
          <rect key={i} x="116" y={114 + i * 10} width={[90,72,82][i]} height="4" rx="1" fill="currentColor" fillOpacity="0.07"/>
        ))}
        {/* Bottom rule */}
        <rect x="12" y="144" width="196" height="1" rx="0.5" fill="currentColor" fillOpacity="0.12"/>
      </svg>
    ),
  },
  diagram: {
    headline: "Turn complexity into clarity.",
    desc: "Describe the system or dataset. Dashy generates a publication-quality D3.js figure with real data from your sources.",
    steps: [
      "Select data sources from the Data panel",
      "Describe the network, flow, or figure you want",
      "Press Generate — the 6-agent pipeline runs automatically",
      "Export as HTML for embedding",
    ],
    Illustration: () => (
      <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Edges */}
        <line x1="55" y1="75" x2="100" y2="40" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5"/>
        <line x1="55" y1="75" x2="100" y2="110" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5"/>
        <line x1="100" y1="40" x2="155" y2="30" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
        <line x1="100" y1="40" x2="155" y2="75" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
        <line x1="100" y1="110" x2="155" y2="75" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
        <line x1="100" y1="110" x2="155" y2="120" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5"/>
        <line x1="155" y1="30" x2="155" y2="75" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 3"/>
        <line x1="155" y1="75" x2="155" y2="120" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="4 3"/>
        {/* Nodes */}
        <circle cx="55" cy="75" r="20" fill="currentColor" fillOpacity="0.09" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5"/>
        <circle cx="55" cy="75" r="8" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="100" cy="40" r="14" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5"/>
        <circle cx="100" cy="110" r="14" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5"/>
        <circle cx="155" cy="30" r="11" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5"/>
        <circle cx="155" cy="75" r="13" fill="currentColor" fillOpacity="0.09" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5"/>
        <circle cx="155" cy="120" r="11" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5"/>
        {/* Node labels */}
        <rect x="40" y="72" width="30" height="5" rx="1.5" fill="currentColor" fillOpacity="0.18"/>
        <rect x="86" y="37" width="28" height="5" rx="1.5" fill="currentColor" fillOpacity="0.14"/>
        <rect x="86" y="107" width="28" height="5" rx="1.5" fill="currentColor" fillOpacity="0.14"/>
      </svg>
    ),
  },
};

// ── Sub-components ─────────────────────────────────────────────────────────────

function SarcasticLoader({ pipelineStep }) {
  const [idx, setIdx] = useState(0);
  const pool = pipelineStep ? (PIPELINE_SARCASM[pipelineStep] ?? SINGLE_MESSAGES) : SINGLE_MESSAGES;
  useEffect(() => {
    setIdx(0);
    const t = setInterval(() => setIdx(i => (i + 1) % pool.length), 3200);
    return () => clearInterval(t);
  }, [pipelineStep, pool.length]);
  return (
    <Typography key={pool[idx]} variant="body2" sx={{
      color: "text.secondary", fontStyle: "italic", fontSize: 16,
      animation: "fadeQuip 0.4s ease",
      "@keyframes fadeQuip": { from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "none" } },
    }}>
      {pool[idx]}
    </Typography>
  );
}

function PipelineProgress({ pipelineStep }) {
  const activeIndex = PIPELINE_STEPS.findIndex(s => s.key === pipelineStep);
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, px: 4 }}>
      <Stepper activeStep={activeIndex} alternativeLabel sx={{ width: "100%", maxWidth: 560 }}>
        {PIPELINE_STEPS.slice(0, -1).map((s) => (
          <Step key={s.key}><StepLabel>{s.label}</StepLabel></Step>
        ))}
      </Stepper>
      {pipelineStep === "done"
        ? <Typography variant="body2" sx={{ color: "text.secondary" }}>Complete</Typography>
        : <SarcasticLoader pipelineStep={pipelineStep} />
      }
    </Box>
  );
}

function EmptyState({ mode }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const content = MODE_EMPTY[mode] ?? MODE_EMPTY.html;
  const { Illustration } = content;

  return (
    <Box sx={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      px: 4, gap: 0, position: "relative", overflow: "hidden",
    }}>
      {/* Background blobs */}
      <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {[
          { top: "8%",   left: "15%",  w: 280, color: "rgba(37,99,235,0.08)",  anim: "8s"  },
          { top: "40%",  right: "10%", w: 220, color: "rgba(14,165,233,0.06)", anim: "11s" },
          { bottom: "10%", left: "45%", w: 180, color: "rgba(236,72,153,0.04)", anim: "14s" },
        ].map((b, i) => (
          <Box key={i} sx={{
            position: "absolute", ...b,
            width: b.w, height: b.w, borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            animation: `emptyBlob${i} ${b.anim} ease-in-out infinite`,
            [`@keyframes emptyBlob${i}`]: {
              "0%,100%": { transform: "translate(0,0) scale(1)" },
              "50%": { transform: `translate(${i%2===0?12:-8}px,${i===1?-10:8}px) scale(1.04)` },
            },
          }} />
        ))}
      </Box>

      {/* Illustration */}
      <Box sx={{
        color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)",
        mb: 3, position: "relative",
        filter: "drop-shadow(0 4px 24px rgba(37,99,235,0.15))",
      }}>
        <Illustration />
      </Box>

      {/* Headline + description */}
      <Box sx={{ textAlign: "center", maxWidth: 480, position: "relative", mb: 3.5 }}>
        <Typography sx={{
          fontSize: { xs: 27, md: 34 }, fontWeight: 900,
          letterSpacing: "-0.04em", lineHeight: 1.2, mb: 1.25,
          background: isDark
            ? "linear-gradient(135deg, #e2e8f0 20%, #60a5fa 65%, #93c5fd 100%)"
            : "linear-gradient(135deg, #1e40af 20%, #2563eb 60%, #0ea5e9 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          {content.headline}
        </Typography>
        <Typography sx={{
          color: isDark ? alpha("#fff", 0.38) : alpha(theme.palette.text.primary, 0.52),
          lineHeight: 1.75, fontSize: 17,
        }}>
          {content.desc}
        </Typography>
      </Box>

      {/* How-to steps */}
      <Box sx={{
        display: "flex", flexDirection: "column", gap: 0.75,
        maxWidth: 340, width: "100%", position: "relative",
      }}>
        {content.steps.map((step, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
            <Box sx={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              border: "1.5px solid",
              borderColor: isDark ? "rgba(37,99,235,0.35)" : "rgba(37,99,235,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              mt: "1px",
            }}>
              <Typography sx={{ fontSize: 12.5, fontWeight: 800, color: isDark ? "rgba(96,165,250,0.8)" : "rgba(37,99,235,0.7)", lineHeight: 1 }}>
                {i + 1}
              </Typography>
            </Box>
            <Typography sx={{
              fontSize: 15.5, lineHeight: 1.55,
              color: isDark ? alpha("#fff", 0.32) : alpha(theme.palette.text.primary, 0.45),
            }}>
              {step}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function GenerationArea({
  mode, onGenerate, onApplyEdit,
  output, isLoading, isApplying, error,
  viewport, showToast,
  pipelineStep, pipelineOutput,
  selectedSources = [], onSourceDrop, onSourceRemove,
  selectedComponents = [], onComponentDrop, onComponentRemove,
}) {
  const [prompt, setPrompt] = useState("");
  const [examplesAnchor, setExamplesAnchor] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const textareaRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const prevLoadingRef = useRef(false);
  useEffect(() => {
    if (prevLoadingRef.current && !isLoading && output && !error && !pipelineStep) {
      showToast?.("Dashboard generated", "success");
    }
    prevLoadingRef.current = isLoading;
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim());
  }

  function handleDragOver(e) {
    const hasSource = e.dataTransfer.types.includes("application/dashy-source");
    const hasComp   = e.dataTransfer.types.includes("application/dashy-component");
    if (hasSource || hasComp) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
      setIsDraggingOver(true);
    }
  }

  function handleDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDraggingOver(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDraggingOver(false);
    // Data source → add as context chip
    const sourceRaw = e.dataTransfer.getData("application/dashy-source");
    if (sourceRaw) {
      try {
        const data = JSON.parse(sourceRaw);
        if (data?.id) onSourceDrop?.(data.id);
      } catch (_) {}
      return;
    }
    // Component → add as context chip
    const compRaw = e.dataTransfer.getData("application/dashy-component");
    if (compRaw) {
      try {
        const data = JSON.parse(compRaw);
        if (data?.label) onComponentDrop?.(data.label);
      } catch (_) {}
    }
  }

  const examples = EXAMPLE_PROMPTS[mode] ?? EXAMPLE_PROMPTS.html;
  const promptBg  = isDark ? "rgba(21,24,30,0.98)"  : "rgba(248,250,255,0.98)";
  const chipBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const chipText   = isDark ? "rgba(255,255,255,0.45)" : alpha(theme.palette.text.primary, 0.6);

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

      {/* ── Prompt row ─────────────────────────────────────────────────────── */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          bgcolor: isDraggingOver
            ? isDark ? "rgba(37,99,235,0.1)" : "rgba(37,99,235,0.05)"
            : promptBg,
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid",
          borderColor: isDraggingOver ? "rgba(37,99,235,0.4)" : "divider",
          px: 1.5, pt: 1.25, pb: selectedSources.length > 0 ? 0.75 : 1.25,
          display: "flex", flexDirection: "column", gap: 0.75, flexShrink: 0,
          transition: "border-color 0.15s, background 0.15s",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
          {/* Examples popover button */}
          <Tooltip title="Example prompts" arrow>
            <IconButton
              size="small"
              onClick={(e) => setExamplesAnchor(e.currentTarget)}
              sx={{
                width: 34, height: 34, borderRadius: 2, border: "1px solid",
                borderColor: examplesAnchor ? "rgba(37,99,235,0.5)" : "divider",
                bgcolor: examplesAnchor ? "rgba(37,99,235,0.08)" : "transparent",
                color: examplesAnchor ? "primary.light" : "text.disabled",
                flexShrink: 0, mb: "1px",
                "&:hover": { borderColor: "rgba(37,99,235,0.35)", color: "text.secondary" },
              }}
            >
              <ExamplesIcon />
            </IconButton>
          </Tooltip>

          <Popover
            open={Boolean(examplesAnchor)}
            anchorEl={examplesAnchor}
            onClose={() => setExamplesAnchor(null)}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            slotProps={{ paper: {
              sx: {
                mt: -1, p: 1.5, maxWidth: 480, width: "90vw",
                background: isDark ? "#1e2330" : "#fff",
                border: "1px solid", borderColor: "divider",
                borderRadius: 3, boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
              }
            }}}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12.5, color: "text.disabled", display: "block", mb: 1 }}>
              {MODE_LABEL[mode]} examples
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.6 }}>
              {examples.map((chip) => (
                <Box
                  key={chip}
                  onClick={() => { setPrompt(chip); setExamplesAnchor(null); textareaRef.current?.focus(); }}
                  sx={{
                    px: 1.25, py: 0.45, borderRadius: 10,
                    fontSize: 14.5, fontWeight: 500, cursor: "pointer",
                    border: "1px solid", borderColor: chipBorder,
                    color: chipText, transition: "all 0.13s",
                    "&:hover": {
                      borderColor: "rgba(37,99,235,0.4)",
                      color: "text.primary",
                      bgcolor: "rgba(37,99,235,0.06)",
                    },
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                  }}
                >
                  {chip}
                </Box>
              ))}
            </Box>
          </Popover>

          {/* Prompt textarea */}
          <TextField
            inputRef={textareaRef}
            fullWidth multiline
            minRows={1} maxRows={5}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              isDraggingOver
                ? "Drop to add to prompt…"
                : `Describe the ${MODE_LABEL[mode].toLowerCase()} you want… (Ctrl+Enter to generate)`
            }
            size="small"
            disabled={isLoading}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(e); }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
          />

          {/* Generate button */}
          <Button
            type="submit"
            variant="contained"
            disabled={!prompt.trim() || isLoading}
            sx={{ height: 36, minWidth: 110, flexShrink: 0, fontSize: 16, borderRadius: 2.5, mb: "1px" }}
            startIcon={isLoading ? <CircularProgress size={12} color="inherit" /> : <PipelineIcon size={12} />}
          >
            {isLoading ? "Working…" : "Generate"}
          </Button>
        </Box>

        {/* Context chips — sources (blue) + components (purple) */}
        {(selectedSources.length > 0 || selectedComponents.length > 0) && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, pb: 0.5, pl: "42px", alignItems: "center" }}>
            {selectedSources.map(id => {
              const source = MOCK_SOURCES.find(s => s.id === id);
              if (!source) return null;
              return (
                <Chip
                  key={`src-${id}`}
                  label={source.label}
                  size="small"
                  onDelete={() => onSourceRemove?.(id)}
                  icon={<Box sx={{ display: "flex", color: "inherit", opacity: 0.7, ml: "4px !important" }}><source.Icon /></Box>}
                  sx={{
                    height: 26, fontSize: 14, fontWeight: 600,
                    bgcolor: isDark ? "rgba(37,99,235,0.15)" : "rgba(37,99,235,0.08)",
                    color: isDark ? "rgba(147,197,253,0.9)" : "rgba(29,78,216,0.85)",
                    border: "1px solid rgba(37,99,235,0.25)",
                    "& .MuiChip-deleteIcon": { fontSize: 16, color: "inherit", opacity: 0.55, "&:hover": { opacity: 1 } },
                    "& .MuiChip-icon": { color: "inherit" },
                  }}
                />
              );
            })}
            {selectedComponents.map(label => (
              <Chip
                key={`comp-${label}`}
                label={label}
                size="small"
                onDelete={() => onComponentRemove?.(label)}
                sx={{
                  height: 26, fontSize: 14, fontWeight: 600,
                  bgcolor: isDark ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.08)",
                  color: isDark ? "rgba(196,181,253,0.9)" : "rgba(109,40,217,0.85)",
                  border: "1px solid rgba(124,58,237,0.25)",
                  "& .MuiChip-deleteIcon": { fontSize: 16, color: "inherit", opacity: 0.55, "&:hover": { opacity: 1 } },
                }}
              />
            ))}
            <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 12.5, ml: 0.25 }}>
              will be sent as context
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Canvas ─────────────────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 }}>
        {(mode === "mui" || mode === "charts" || mode === "infographic" || mode === "diagram") ? (
          <>
            {!output && !isLoading && !error && <EmptyState mode={mode} />}
            {isLoading && pipelineStep && (
              <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
                <PipelineProgress pipelineStep={pipelineStep} />
              </Box>
            )}
            {/* First-time loading (no prior output): show centered bar + quip */}
            {isLoading && !pipelineStep && !output && (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, py: 10, px: 4 }}>
                <Box sx={{ width: "100%", maxWidth: 420 }}>
                  <LinearProgress
                    variant="indeterminate"
                    sx={{
                      height: 5, borderRadius: 3,
                      bgcolor: "rgba(37,99,235,0.12)",
                      "& .MuiLinearProgress-bar": { borderRadius: 3, bgcolor: "#2563eb" },
                    }}
                  />
                </Box>
                <SarcasticLoader pipelineStep={null} />
              </Box>
            )}
            {/* Re-generation (prior output exists): MuiCanvas shows old content + its own top progress bar */}
            {(output || error) && (
              <MuiCanvas html={output} isLoading={isLoading} error={error} viewport={viewport} />
            )}
          </>
        ) : (
          <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {!output && !isLoading && !error && <EmptyState mode={mode} />}
            {isLoading && (
              pipelineStep
                ? <PipelineProgress pipelineStep={pipelineStep} />
                : <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, px: 4 }}>
                    <Box sx={{ width: "100%", maxWidth: 420 }}>
                      <LinearProgress
                        variant="indeterminate"
                        sx={{
                          height: 5, borderRadius: 3,
                          bgcolor: "rgba(37,99,235,0.12)",
                          "& .MuiLinearProgress-bar": { borderRadius: 3, bgcolor: "#2563eb" },
                        }}
                      />
                    </Box>
                    <SarcasticLoader pipelineStep={null} />
                  </Box>
            )}
            {error && !isLoading && <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>}
            {output && !isLoading && (
              viewport !== "desktop" ? (
                <Box sx={{
                  flex: 1, overflow: "auto", display: "flex",
                  alignItems: "flex-start", justifyContent: "center",
                  pt: 4, pb: 4,
                  bgcolor: isDark ? "#0a0e16" : "#e8ecf4",
                }}>
                  <Box sx={{
                    width: viewport === "mobile" ? 390 : 768, flexShrink: 0,
                    borderRadius: viewport === "mobile" ? 5 : 3, overflow: "hidden",
                    boxShadow: isDark
                      ? "0 0 0 8px #1a1f2e, 0 0 0 10px #242a3a, 0 32px 80px rgba(0,0,0,0.6)"
                      : "0 0 0 8px #c8d0e8, 0 0 0 10px #b0bbd6, 0 32px 80px rgba(0,0,0,0.25)",
                  }}>
                    {viewport === "mobile" && (
                      <Box sx={{ bgcolor: isDark ? "#141920" : "#d8dff0", height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Box sx={{ width: 72, height: 6, bgcolor: isDark ? "#2a3245" : "#b8c2dc", borderRadius: 3 }} />
                      </Box>
                    )}
                    <iframe
                      srcDoc={`<!DOCTYPE html><html><head><style>body{margin:0;padding:0;background:#0e1117;}</style></head><body style="padding:16px">${output}</body></html>`}
                      title="Preview"
                      sandbox="allow-scripts"
                      style={{ display: "block", border: "none", width: viewport === "mobile" ? 390 : 768, height: viewport === "mobile" ? 720 : 900 }}
                    />
                    {viewport === "mobile" && (
                      <Box sx={{ bgcolor: isDark ? "#141920" : "#d8dff0", height: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Box sx={{ width: 36, height: 4, bgcolor: isDark ? "#2a3245" : "#b8c2dc", borderRadius: 2 }} />
                      </Box>
                    )}
                  </Box>
                </Box>
              ) : (
                <iframe
                  srcDoc={output}
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                  style={{ display: "block", border: "none", width: "100%", flex: 1, minHeight: "calc(100vh - 200px)" }}
                />
              )
            )}
          </Box>
        )}
      </Box>

      {/* ── Critic feedback accordion ──────────────────────────────────────── */}
      {pipelineOutput?.criticFeedback && !isLoading && (
        <Accordion disableGutters elevation={0}
          sx={{ borderTop: "1px solid", borderColor: "divider", bgcolor: "transparent", "&:before": { display: "none" } }}>
          <AccordionSummary sx={{ px: 2, py: 0, minHeight: 34, "& .MuiAccordionSummary-content": { my: 0 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: 12, color: "text.disabled" }}>
                Agent Report
              </Typography>
              <Box sx={{
                px: 0.75, py: 0.1, borderRadius: 3, fontSize: 12.5, fontWeight: 800, lineHeight: "16px",
                background: pipelineOutput.criticFeedback.score >= 8 ? "rgba(16,185,129,0.15)" : pipelineOutput.criticFeedback.score >= 6 ? "rgba(245,158,11,0.15)" : "rgba(239,68,68,0.15)",
                color: pipelineOutput.criticFeedback.score >= 8 ? "#10b981" : pipelineOutput.criticFeedback.score >= 6 ? "#f59e0b" : "#ef4444",
              }}>
                {pipelineOutput.criticFeedback.score}/10
              </Box>
              <Typography variant="caption" sx={{ color: "text.disabled", fontSize: 12.5 }}>
                {pipelineOutput.refinements > 0
                  ? `${pipelineOutput.refinements} refinement${pipelineOutput.refinements > 1 ? "s" : ""} applied`
                  : "No refinements needed"}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pt: 0.5, pb: 1.5 }}>
            {pipelineOutput.criticFeedback.issues?.length > 0 && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: 11, color: "text.disabled", display: "block", mb: 0.5 }}>Issues Found</Typography>
                {pipelineOutput.criticFeedback.issues.map((issue, i) => (
                  <Typography key={i} variant="caption" sx={{ display: "block", color: "text.secondary", fontSize: 14, lineHeight: 1.6, pl: 1, borderLeft: "2px solid", borderColor: "warning.main", mb: 0.4 }}>{issue}</Typography>
                ))}
              </Box>
            )}
            {pipelineOutput.criticFeedback.suggestions?.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", fontSize: 11, color: "text.disabled", display: "block", mb: 0.5 }}>Improvements Applied</Typography>
                {pipelineOutput.criticFeedback.suggestions.map((s, i) => (
                  <Typography key={i} variant="caption" sx={{ display: "block", color: "text.secondary", fontSize: 14, lineHeight: 1.6, pl: 1, borderLeft: "2px solid", borderColor: "success.main", mb: 0.4 }}>{s}</Typography>
                ))}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      )}

      {/* ── Edit panel ─────────────────────────────────────────────────────── */}
      <EditPanel output={output} mode={mode} onApplyEdit={onApplyEdit} isApplying={isApplying} onToast={showToast} />
    </Box>
  );
}
