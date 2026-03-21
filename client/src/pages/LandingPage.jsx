import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

const FEATURES = [
  { icon: "⚡", title: "Generate in seconds",    desc: "Describe your dashboard in plain English. No code, no formulas, no designer needed." },
  { icon: "📊", title: "5 output modes",          desc: "HTML dashboards, MUI components, Recharts visuals, editorial infographics, and D3 diagrams." },
  { icon: "🔗", title: "Share instantly",         desc: "One click to publish a public link. Send it to your team, your boss, or embed it anywhere." },
  { icon: "🗂️", title: "Your data, your sources", desc: "Connect CSVs, REST APIs, spreadsheets, or paste JSON. Your data stays private." },
];

// Mini dashboard mockup shown in the hero
function DashboardMockup() {
  return (
    <Box sx={{
      width: "100%", maxWidth: 720, mx: "auto",
      borderRadius: 3, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(37,99,235,0.15)",
      bgcolor: "#161b27",
      userSelect: "none",
    }}>
      {/* Mockup top bar */}
      <Box sx={{ px: 2, py: 1.25, borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 1, bgcolor: "#0f1117" }}>
        <Box sx={{ display: "flex", gap: 0.625 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c => <Box key={c} sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: c, opacity: 0.7 }} />)}
        </Box>
        <Box sx={{ flex: 1, height: 20, borderRadius: 1, bgcolor: "rgba(255,255,255,0.04)", mx: 1 }} />
      </Box>

      {/* Mockup content */}
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* KPI row */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5 }}>
          {[
            { label: "Monthly Revenue", val: "$2.84M", delta: "+5.2%", color: "#22c55e" },
            { label: "Active Users",    val: "142K",   delta: "+8.1%", color: "#22c55e" },
            { label: "Churn Rate",      val: "1.2%",   delta: "+0.2%", color: "#ef4444" },
            { label: "NPS Score",       val: "72",     delta: "+2.9%", color: "#22c55e" },
          ].map(k => (
            <Box key={k.label} sx={{ p: 1.5, borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Box sx={{ height: 6, width: "60%", borderRadius: 1, bgcolor: "rgba(255,255,255,0.15)", mb: 1 }} />
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#f0f4ff", lineHeight: 1.1 }}>{k.val}</Typography>
              <Typography sx={{ fontSize: 11, color: k.color, fontWeight: 700, mt: 0.25 }}>{k.delta}</Typography>
            </Box>
          ))}
        </Box>

        {/* Chart placeholder rows */}
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 1.5 }}>
          <Box sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", p: 1.5, height: 90, overflow: "hidden" }}>
            <Box sx={{ height: 6, width: "40%", borderRadius: 1, bgcolor: "rgba(255,255,255,0.12)", mb: 1.5 }} />
            {/* Fake bar chart */}
            <Box sx={{ display: "flex", alignItems: "flex-end", gap: 0.75, height: 52, px: 0.5 }}>
              {[45,62,38,78,55,88,71,65,82,90,74,96].map((h, i) => (
                <Box key={i} sx={{ flex: 1, height: `${h}%`, borderRadius: "2px 2px 0 0", bgcolor: i === 11 ? "#2563eb" : "rgba(37,99,235,0.35)" }} />
              ))}
            </Box>
          </Box>
          <Box sx={{ borderRadius: 2, bgcolor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", p: 1.5, height: 90, display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ height: 6, width: "55%", borderRadius: 1, bgcolor: "rgba(255,255,255,0.12)" }} />
            {[70,45,85].map((w, i) => (
              <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ height: 6, flex: 1, borderRadius: 1, bgcolor: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <Box sx={{ height: "100%", width: `${w}%`, borderRadius: 1, bgcolor: ["#2563eb","#7c3aed","#10b981"][i] }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 4, py: 0, height: 64,
        borderBottom: "1px solid", borderColor: "divider",
        background: (theme) => theme.palette.mode === "dark"
          ? "rgba(15,17,23,0.88)"
          : "rgba(244,246,255,0.92)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="Dashy" style={{ height: 52, borderRadius: 6, display: "block" }} />
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button variant="text" onClick={() => navigate("/login")} sx={{ color: "text.secondary", fontSize: 14 }}>
            Sign in
          </Button>
          <Button variant="contained" onClick={() => navigate("/signup")} sx={{ px: 2.5, fontSize: 14 }}>
            Get started free
          </Button>
        </Stack>
      </Box>

      {/* Hero */}
      <Box sx={{
        flex: 1,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", px: 3, pt: 8, pb: 6,
        background: (theme) => theme.palette.mode === "dark"
          ? "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(37,99,235,0.12) 0%, transparent 70%)"
          : "none",
      }}>
        <Chip
          label="Now in Public Beta"
          size="small"
          sx={{ mb: 3, bgcolor: "rgba(37,99,235,0.12)", color: "primary.light", border: "1px solid rgba(37,99,235,0.25)", fontWeight: 700, fontSize: 12 }}
        />

        <Typography variant="h1" sx={{
          fontSize: { xs: 34, md: 58 }, fontWeight: 800, lineHeight: 1.05,
          letterSpacing: "-2px", mb: 3, maxWidth: 700,
          background: "linear-gradient(160deg, #f0f4ff 50%, rgba(240,244,255,0.45))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Describe your dashboard.<br />We build it instantly.
        </Typography>

        <Typography sx={{ fontSize: 17, color: "text.secondary", mb: 5, lineHeight: 1.7, maxWidth: 520 }}>
          Dashy turns plain-English prompts into production-ready dashboards, charts, and infographics — powered by AI. No design skills required.
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
          <Button variant="contained" size="large" onClick={() => navigate("/signup")} sx={{ fontSize: 15, px: 4, py: 1.4 }}>
            Start building for free →
          </Button>
          <Button variant="text" size="large" onClick={() => navigate("/app/new")} sx={{ color: "text.secondary", fontSize: 14 }}>
            Try without signing up
          </Button>
        </Stack>

        <Typography sx={{ fontSize: 12, color: "text.disabled", mb: 6 }}>
          Free · No credit card · 20 generations/day
        </Typography>

        {/* Dashboard preview mockup */}
        <DashboardMockup />
      </Box>

      {/* Features */}
      <Box sx={{ px: 4, py: 8, maxWidth: 1000, mx: "auto", width: "100%" }}>
        <Typography variant="h6" sx={{ textAlign: "center", color: "text.secondary", fontWeight: 500, mb: 4, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Everything you need to visualize data
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 2 }}>
          {FEATURES.map((f) => (
            <Box key={f.title} sx={{
              p: 2.5, borderRadius: "12px",
              bgcolor: "background.paper",
              border: "1px solid", borderColor: "divider",
              transition: "all 0.2s",
              "&:hover": { borderColor: "rgba(37,99,235,0.3)", boxShadow: "0 4px 24px rgba(37,99,235,0.08)" },
            }}>
              <Typography sx={{ fontSize: 26, mb: 1.5, lineHeight: 1 }}>{f.icon}</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 14, mb: 0.75 }}>{f.title}</Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.6 }}>{f.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: "1px solid", borderColor: "divider", px: 4, py: 3, display: "flex", justifyContent: "center" }}>
        <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
          © 2026 Dashy · Built with Claude
        </Typography>
      </Box>
    </Box>
  );
}
