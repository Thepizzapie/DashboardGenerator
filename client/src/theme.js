import { createTheme } from "@mui/material/styles";

const FONT = '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
const MONO = '"JetBrains Mono", "Fira Code", monospace';

export function createAppTheme(mode = "dark") {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: { main: "#2563eb", light: "#60a5fa", dark: "#1d4ed8" },
      success: { main: "#10b981" },
      warning: { main: "#f59e0b" },
      error:   { main: "#ef4444" },
      info:    { main: "#38bdf8" },
      background: isDark
        ? { default: "#1a1d23", paper: "#21262d" }
        : { default: "#f4f6ff", paper: "#ffffff" },
      divider: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
      text: isDark
        ? { primary: "#f0f4ff", secondary: "#8b98b4", disabled: "#4a5568" }
        : { primary: "#0f172a", secondary: "#64748b", disabled: "#cbd5e1" },
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: FONT,
      h4: { fontWeight: 800, letterSpacing: "-0.04em" },
      h5: { fontWeight: 800, letterSpacing: "-0.04em" },
      h6: { fontWeight: 700, letterSpacing: "-0.03em" },
      subtitle1: { fontWeight: 700 },
      body1: { fontSize: 14 },
      body2: { fontSize: 13 },
      caption: { fontSize: 11, fontFamily: FONT },
      button: { fontWeight: 700, textTransform: "none", fontFamily: FONT },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: isDark
              ? "rgba(26,29,35,0.92)"
              : "rgba(244,246,255,0.85)",
            backdropFilter: "blur(24px)",
            boxShadow: "none",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: isDark ? "#1a1d23" : "#f8faff",
            borderRight: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,0,0,0.07)",
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 700, fontFamily: FONT },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { fontSize: 11, fontWeight: 700, fontFamily: FONT },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 700, borderRadius: 10, fontFamily: FONT },
          containedPrimary: {
            background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
            boxShadow: "0 4px 24px rgba(37,99,235,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
            "&:hover": {
              background: "linear-gradient(135deg, #1d4ed8 0%, #0284c7 100%)",
              boxShadow: "0 6px 32px rgba(37,99,235,0.55), inset 0 1px 0 rgba(255,255,255,0.15)",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s cubic-bezier(0.16,1,0.3,1)",
          },
          outlined: {
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
            "&:hover": {
              borderColor: "#2563eb",
              bgcolor: "rgba(37,99,235,0.06)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              fontFamily: FONT,
              fontSize: 14,
              background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.7)",
              "& fieldset": {
                borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(37,99,235,0.4)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#2563eb",
                borderWidth: 1.5,
                boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",
              },
            },
            "& .MuiInputLabel-root": { fontFamily: FONT },
            "& .MuiFormHelperText-root": { fontFamily: FONT },
          },
        },
      },
      MuiAccordion: {
        styleOverrides: {
          root: { background: "transparent", "&:before": { display: "none" }, boxShadow: "none" },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            background: isDark ? "#21262d" : "#ffffff",
            backdropFilter: "blur(24px)",
            border: isDark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.08)",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: isDark ? "#1e2235" : "#1e293b",
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 500,
            borderRadius: 6,
            padding: "5px 10px",
          },
          arrow: { color: isDark ? "#1e2235" : "#1e293b" },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { fontFamily: FONT },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: { fontFamily: FONT, fontSize: 13 },
        },
      },
    },
  });
}

export default createAppTheme("dark");
