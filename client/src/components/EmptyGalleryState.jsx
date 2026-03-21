import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function EmptyGalleryState({ onCreateClick }) {
  return (
    <Box sx={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      py: 12, px: 4, textAlign: "center",
    }}>
      {/* Decorative grid of colored blocks */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 64px)", gap: 1.5, mb: 4, opacity: 0.6 }}>
        {["#2563eb", "#7c3aed", "#10b981", "#ec4899", "#0ea5e9", "#f59e0b", "#ef4444", "#22c55e", "#6366f1"].map((color, i) => (
          <Box key={i} sx={{ width: 64, height: 44, borderRadius: 2, bgcolor: `${color}22`, border: `1px solid ${color}44` }} />
        ))}
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5 }}>
        No dashboards yet
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 4, maxWidth: 400, lineHeight: 1.7 }}>
        Describe what you want to visualize in plain English and Dashy will generate a production-ready dashboard in seconds.
      </Typography>

      <Button variant="contained" size="large" onClick={onCreateClick} sx={{ fontSize: 15, px: 4, py: 1.5 }}>
        Generate your first dashboard →
      </Button>
    </Box>
  );
}
