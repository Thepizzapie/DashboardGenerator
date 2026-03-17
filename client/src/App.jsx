import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Sidebar from "./components/Sidebar";
import GenerationArea from "./components/GenerationArea";

const DRAWER_WIDTH = 280;
const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function App() {
  const [mode, setMode] = useState("html");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [muiOutput, setMuiOutput] = useState("");
  const [chartsOutput, setChartsOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userSources, setUserSources] = useState([]);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => { loadSources(); }, []);

  async function loadSources() {
    try {
      const res = await fetch(`${API}/api/sources`);
      if (res.ok) setUserSources(await res.json());
    } catch (_) {}
  }

  async function addSource(payload) {
    await fetch(`${API}/api/sources`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
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
    form.append("file", file);
    form.append("name", name);
    await fetch(`${API}/api/upload-csv`, { method: "POST", body: form });
    await loadSources();
  }

  async function handleGenerate(prompt) {
    setIsLoading(true);
    setError(null);

    const endpoint = mode === "mui" ? "/generate-mui" : mode === "charts" ? "/generate-charts" : "/generate";

    try {
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const { html } = await res.json();
      if (mode === "mui") setMuiOutput(html);
      else if (mode === "charts") setChartsOutput(html);
      else setHtmlOutput(html);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const output = mode === "mui" ? muiOutput : mode === "charts" ? chartsOutput : htmlOutput;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>

      {/* ── Announcement banner ───────────────────────────────────────────── */}
      {!bannerDismissed && (
        <Box sx={{
          bgcolor: "rgba(99,102,241,0.12)",
          borderBottom: "1px solid rgba(99,102,241,0.25)",
          px: 2, py: 0.6,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5,
          flexShrink: 0,
        }}>
          <Chip label="NEW" size="small" color="primary" sx={{ height: 17, fontSize: 9, fontWeight: 800, letterSpacing: "0.04em" }} />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Charts Canvas — generate Recharts dashboards from plain English. Connect your own data.
          </Typography>
          <Box
            component="span"
            onClick={() => setBannerDismissed(true)}
            sx={{ ml: "auto", cursor: "pointer", color: "text.disabled", fontSize: 14, lineHeight: 1, userSelect: "none", "&:hover": { color: "text.secondary" } }}
          >
            ✕
          </Box>
        </Box>
      )}

      {/* ── AppBar ────────────────────────────────────────────────────────── */}
      <AppBar position="static" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider", flexShrink: 0 }}>
        <Toolbar variant="dense" sx={{ minHeight: 52, gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <img
              src="/logo.png"
              alt="Dashy"
              style={{ height: 60, borderRadius: 6, display: "block" }}
            />
            <Box sx={{ width: "1px", height: 20, bgcolor: "divider" }} />
            <Typography variant="caption" sx={{ color: "text.disabled", letterSpacing: "0.01em" }}>
              Dashboard generator
            </Typography>
          </Box>
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              component="a"
              href="https://github.com/your-org/dashy"
              target="_blank"
              rel="noopener noreferrer"
              variant="caption"
              sx={{ color: "text.secondary", textDecoration: "none", "&:hover": { color: "text.primary" } }}
            >
              GitHub
            </Typography>
            <Chip
              label="MIT · Free & open source"
              size="small"
              variant="outlined"
              sx={{ height: 22, fontSize: 10, color: "text.secondary", borderColor: "divider" }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* ── Main layout ───────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          mode={mode}
          drawerWidth={DRAWER_WIDTH}
          userSources={userSources}
          onAddSource={addSource}
          onDeleteSource={deleteSource}
          onFetchSource={fetchSource}
          onUploadCsv={uploadCsv}
        />
        <GenerationArea
          mode={mode}
          onModeChange={setMode}
          onGenerate={handleGenerate}
          output={output}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </Box>
  );
}
