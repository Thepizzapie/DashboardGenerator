import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import GeneratorPage from "./GeneratorPage.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function DashboardEditPage({ colorMode, onColorModeToggle }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/dashboards/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Dashboard not found");
        return res.json();
      })
      .then(data => setDashboard(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", bgcolor: "background.default" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", gap: 2, bgcolor: "background.default" }}>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => navigate("/app")}>Back to Gallery</Button>
      </Box>
    );
  }

  return (
    <GeneratorPage
      colorMode={colorMode}
      onColorModeToggle={onColorModeToggle}
      initialDashboard={dashboard}
    />
  );
}
