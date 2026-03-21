import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

import { MODE_COLOR } from "../constants/modeColors.js";

export default function SharePage() {
  const { slug } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/share/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Dashboard not found or link has been disabled");
        return res.json();
      })
      .then(data => setDashboard(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", bgcolor: "background.default" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", bgcolor: "background.default", gap: 2 }}>
        <Typography sx={{ fontSize: 48 }}>🔒</Typography>
        <Typography variant="h6">Dashboard not available</Typography>
        <Typography sx={{ color: "text.secondary", mb: 2 }}>{error}</Typography>
        <Button variant="contained" href="/">
          Create your own with Dashy
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "background.default" }}>
      {/* Top bar */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 3, py: 1.5,
        borderBottom: "1px solid", borderColor: "divider",
        bgcolor: "background.paper",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: 15 }}>{dashboard.title}</Typography>
          <Box sx={{
            px: 1.25, py: 0.25, borderRadius: 1, fontSize: 11, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.05em",
            bgcolor: `${MODE_COLOR[dashboard.mode]}22`,
            color: MODE_COLOR[dashboard.mode],
            border: `1px solid ${MODE_COLOR[dashboard.mode]}44`,
          }}>
            {dashboard.mode}
          </Box>
        </Box>
        <Button
          variant="outlined"
          size="small"
          href="/signup"
          sx={{ fontSize: 13 }}
        >
          Create your own →
        </Button>
      </Box>

      {/* Dashboard iframe */}
      <Box sx={{ flex: 1, position: "relative" }}>
        <iframe
          srcDoc={dashboard.html_content}
          style={{ width: "100%", height: "100%", border: "none" }}
          sandbox="allow-scripts"
          title={dashboard.title}
        />
      </Box>

      {/* Made with Dashy footer */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
        py: 1.5, borderTop: "1px solid", borderColor: "divider",
        bgcolor: "background.paper",
      }}>
        <Typography sx={{ fontSize: 12, color: "text.disabled" }}>Made with</Typography>
        <Typography
          component="a"
          href="/"
          sx={{ fontSize: 12, fontWeight: 700, color: "primary.light", textDecoration: "none", "&:hover": { color: "primary.main" } }}
        >
          Dashy
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.disabled" }}>· AI Dashboard Generator</Typography>
      </Box>
    </Box>
  );
}
