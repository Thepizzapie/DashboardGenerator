import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#6366f1" },
    success: { main: "#22c55e" },
    warning: { main: "#f59e0b" },
    error:   { main: "#ef4444" },
    info:    { main: "#3b82f6" },
    background: {
      default: "#0f1117",
      paper:   "#161b27",
    },
    divider: "#2a3147",
    text: {
      primary:   "#e2e8f0",
      secondary: "#64748b",
    },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h6: { fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#161b27",
          borderBottom: "1px solid #2a3147",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#161b27",
          borderRight: "1px solid #2a3147",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, fontSize: 13 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontSize: 11 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
  },
});

export default theme;
