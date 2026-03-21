import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import AppShell from "../components/layout/AppShell.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({ default_theme: "dark", default_mode: "mui", default_viewport: "desktop" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/preferences`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setPrefs(data); })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    await fetch(`${API}/api/preferences`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <AppShell>
      <Box sx={{ p: 4, maxWidth: 600 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Button variant="text" onClick={() => navigate("/app")} sx={{ color: "text.secondary", textTransform: "none", minWidth: 0, pl: 0 }}>
            ← Back
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Settings</Typography>
        </Box>

        {saved && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Preferences saved!</Alert>}

        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontWeight: 700, mb: 3 }}>Default Preferences</Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Default theme</InputLabel>
              <Select value={prefs.default_theme} label="Default theme" onChange={e => setPrefs(p => ({ ...p, default_theme: e.target.value }))}>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="light">Light</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Default mode</InputLabel>
              <Select value={prefs.default_mode} label="Default mode" onChange={e => setPrefs(p => ({ ...p, default_mode: e.target.value }))}>
                <MenuItem value="html">HTML</MenuItem>
                <MenuItem value="mui">MUI</MenuItem>
                <MenuItem value="charts">Charts</MenuItem>
                <MenuItem value="infographic">Infographic</MenuItem>
                <MenuItem value="diagram">Diagram</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Default viewport</InputLabel>
              <Select value={prefs.default_viewport} label="Default viewport" onChange={e => setPrefs(p => ({ ...p, default_viewport: e.target.value }))}>
                <MenuItem value="desktop">Desktop</MenuItem>
                <MenuItem value="tablet">Tablet</MenuItem>
                <MenuItem value="mobile">Mobile</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button variant="contained" onClick={handleSave} disabled={loading}>
            Save preferences
          </Button>
        </Paper>
      </Box>
    </AppShell>
  );
}
