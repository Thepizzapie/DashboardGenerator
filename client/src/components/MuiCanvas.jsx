import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

export default function MuiCanvas({ html, isLoading, error }) {
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
      {isLoading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }} />}

      {error && !isLoading && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!html && !isLoading && !error && (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, color: "text.secondary" }}>
          <Typography sx={{ fontSize: 32, opacity: 0.3 }}>◈</Typography>
          <Typography variant="body2">Generated MUI component will appear here</Typography>
          <Typography variant="caption" color="text.secondary">
            Rendered in an isolated iframe via CDN
          </Typography>
        </Box>
      )}

      {html && !isLoading && (
        <iframe
          srcDoc={html}
          title="MUI Generated UI"
          sandbox="allow-scripts"
          style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        />
      )}
    </Box>
  );
}
