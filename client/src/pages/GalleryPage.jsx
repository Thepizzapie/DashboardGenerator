import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import AppShell from "../components/layout/AppShell.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import EmptyGalleryState from "../components/EmptyGalleryState.jsx";
import OnboardingModal from "../components/OnboardingModal.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function GalleryPage() {
  const navigate = useNavigate();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => { loadDashboards(); }, []);

  async function loadDashboards() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/dashboards`);
      if (res.ok) {
        const data = await res.json();
        setDashboards(data.dashboards || []);
        // Show onboarding for new users with no dashboards
        if ((data.dashboards || []).length === 0) {
          setShowOnboarding(true);
        }
      }
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    await fetch(`${API}/api/dashboards/${id}`, { method: "DELETE" });
    setDashboards(prev => prev.filter(d => d.id !== id));
  }

  return (
    <AppShell>
      {/* Page header with subtle gradient accent */}
      <Box sx={{
        borderBottom: "1px solid", borderColor: "divider",
        background: (theme) => theme.palette.mode === "dark"
          ? "linear-gradient(180deg, rgba(37,99,235,0.05) 0%, transparent 100%)"
          : "linear-gradient(180deg, rgba(37,99,235,0.03) 0%, transparent 100%)",
        px: 4, pt: 4, pb: 3,
      }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>My Dashboards</Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
              {loading ? "Loading..." : `${dashboards.length} dashboard${dashboards.length !== 1 ? "s" : ""}`}
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate("/app/new")} sx={{ px: 2.5, gap: 0.75 }}>
            + New Dashboard
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>

        {loading ? (
          <Grid container spacing={3}>
            {[1,2,3,4,5,6].map(i => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        ) : dashboards.length === 0 ? (
          <EmptyGalleryState onCreateClick={() => navigate("/app/new")} />
        ) : (
          <Grid container spacing={3}>
            {dashboards.map(dash => (
              <Grid item xs={12} sm={6} md={4} key={dash.id}>
                <DashboardCard
                  dashboard={dash}
                  onOpen={() => navigate(`/app/dashboard/${dash.id}`)}
                  onDelete={() => handleDelete(dash.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <OnboardingModal
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onStart={() => { setShowOnboarding(false); navigate("/app/new"); }}
      />
    </AppShell>
  );
}
