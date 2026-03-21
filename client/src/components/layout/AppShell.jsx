import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import UsageBadge from "../UsageBadge.jsx";
import ClerkUserButton from "./ClerkUserButton.jsx";

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function AppShell({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>

      {/* Nav — glass morphism, matches FloatingHeader language */}
      <Box sx={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 2, py: 0,
        height: 68,
        borderBottom: "1px solid", borderColor: "divider",
        background: (theme) => theme.palette.mode === "dark"
          ? "rgba(15,17,23,0.88)"
          : "rgba(244,246,255,0.92)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        boxShadow: (theme) => theme.palette.mode === "dark"
          ? "0 1px 0 rgba(255,255,255,0.04) inset"
          : "0 1px 0 rgba(255,255,255,0.8) inset",
        position: "sticky", top: 0, zIndex: 100,
        flexShrink: 0,
      }}>
        {/* Left: Logo + nav */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
          {/* Logo image — same as FloatingHeader */}
          <Box
            onClick={() => navigate("/app")}
            sx={{ cursor: "pointer", display: "flex", alignItems: "center", flexShrink: 0 }}
          >
            <img src="/logo.png" alt="Dashy" style={{ height: 64, borderRadius: 8, display: "block" }} />
          </Box>

          {/* Divider */}
          <Box sx={{ width: "1px", alignSelf: "stretch", my: 1, mx: 1.5, bgcolor: "divider", flexShrink: 0 }} />

          {/* Nav links */}
          <Box sx={{ display: "flex", gap: 0.25 }}>
            {[
              { label: "Gallery", path: "/app" },
              { label: "New Dashboard", path: "/app/new" },
            ].map(item => (
              <Box
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  px: 1.75, py: 0.6, borderRadius: 2.5,
                  fontSize: 14, fontWeight: isActive(item.path) ? 700 : 500,
                  cursor: "pointer", userSelect: "none", transition: "all 0.18s",
                  color: isActive(item.path) ? "#fff" : "text.secondary",
                  background: isActive(item.path) ? "linear-gradient(135deg, #2563eb, #0ea5e9)" : "transparent",
                  boxShadow: isActive(item.path) ? "0 2px 8px rgba(37,99,235,0.35)" : "none",
                  "&:hover": !isActive(item.path) ? {
                    color: "text.primary",
                    bgcolor: "rgba(255,255,255,0.06)",
                  } : {},
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right: Usage + settings + user */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <UsageBadge />
          <Tooltip title="Settings" arrow>
            <Box
              onClick={() => navigate("/app/settings")}
              sx={{
                width: 36, height: 36, borderRadius: 2,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 18,
                color: "text.secondary",
                border: "1px solid", borderColor: "divider",
                "&:hover": { color: "text.primary", bgcolor: "rgba(255,255,255,0.05)" },
                transition: "all 0.15s",
              }}
            >
              ⚙
            </Box>
          </Tooltip>
          {CLERK_ENABLED && <ClerkUserButton />}
        </Box>
      </Box>

      {/* Page content */}
      <Box sx={{ flex: 1 }}>
        {children}
      </Box>
    </Box>
  );
}
