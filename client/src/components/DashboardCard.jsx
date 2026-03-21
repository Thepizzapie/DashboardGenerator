import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import { MODE_COLOR, MODE_EMOJI } from "../constants/modeColors.js";

function formatDate(ts) {
  // ts is Unix timestamp (seconds)
  const d = new Date(ts * 1000);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function DashboardCard({ dashboard, onOpen, onDelete }) {
  const [menuAnchor, setMenuAnchor] = useState(null);

  const color = MODE_COLOR[dashboard.mode] || "#2563eb";

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
        cursor: "pointer",
        transition: "all 0.18s",
        "&:hover": {
          borderColor: `${color}66`,
          boxShadow: `0 4px 24px ${color}22`,
          transform: "translateY(-2px)",
        },
      }}
    >
      {/* Color stripe + preview area */}
      <Box
        onClick={onOpen}
        sx={{
          height: 120,
          bgcolor: `${color}11`,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Mode color bar at top */}
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, bgcolor: color }} />
        <Typography sx={{ fontSize: 40 }}>{MODE_EMOJI[dashboard.mode] || "📋"}</Typography>
        {dashboard.is_public && (
          <Box sx={{
            position: "absolute", top: 10, right: 10,
            px: 1, py: 0.25, borderRadius: 1, bgcolor: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.3)",
          }}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#22c55e" }}>PUBLIC</Typography>
          </Box>
        )}
      </Box>

      {/* Card body */}
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 1 }}>
          <Typography
            onClick={onOpen}
            sx={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {dashboard.title}
          </Typography>
          <IconButton
            size="small"
            onClick={e => { e.stopPropagation(); setMenuAnchor(e.currentTarget); }}
            sx={{ flexShrink: 0, mt: -0.5 }}
          >
            <Typography sx={{ fontSize: 16, lineHeight: 1 }}>⋮</Typography>
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Chip
            label={dashboard.mode.toUpperCase()}
            size="small"
            sx={{
              height: 20, fontSize: 10, fontWeight: 700,
              bgcolor: `${color}18`, color, border: `1px solid ${color}33`,
            }}
          />
          <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
            {formatDate(dashboard.updated_at || dashboard.created_at)}
          </Typography>
        </Box>
      </Box>

      {/* Context menu */}
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(null)}
        onClick={e => e.stopPropagation()}
      >
        <MenuItem onClick={() => { onOpen(); setMenuAnchor(null); }}>Open</MenuItem>
        <MenuItem onClick={() => { onDelete(); setMenuAnchor(null); }} sx={{ color: "error.main" }}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}
