import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function UsageBadge() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/usage/me`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setUsage(data); })
      .catch(() => {});
  }, []);

  if (!usage) return null;

  const pct = (usage.today / usage.limit_day) * 100;
  const color = pct >= 90 ? "#ef4444" : pct >= 60 ? "#f59e0b" : "#22c55e";

  return (
    <Tooltip title={`${usage.today}/${usage.limit_day} generations today · ${usage.this_hour}/${usage.limit_hour} this hour`} arrow>
      <Box sx={{
        display: "flex", alignItems: "center", gap: 1,
        px: 1.5, py: 0.5,
        borderRadius: 2, border: "1px solid", borderColor: "divider",
        cursor: "default",
        "&:hover": { bgcolor: "action.hover" },
      }}>
        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>
          {usage.today}/{usage.limit_day} today
        </Typography>
      </Box>
    </Tooltip>
  );
}
