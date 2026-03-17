import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";

const VIEWPORT_WIDTHS = {
  desktop: null,   // 100%
  tablet:  768,
  mobile:  390,
};

export default function MuiCanvas({ html, isLoading, error, viewport = "desktop" }) {
  const constrainedWidth = VIEWPORT_WIDTHS[viewport];

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", bgcolor: constrainedWidth ? "#111" : "transparent" }}>
      {isLoading && <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }} />}

      {error && !isLoading && (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!html && !isLoading && !error && (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, color: "text.secondary" }}>
          <Typography sx={{ fontSize: 32, opacity: 0.3 }}>◈</Typography>
          <Typography variant="body2">Generated component will appear here</Typography>
          <Typography variant="caption" color="text.secondary">Rendered in an isolated iframe via CDN</Typography>
        </Box>
      )}

      {html && !isLoading && !constrainedWidth && (
        <iframe
          srcDoc={html}
          title="Generated UI"
          sandbox="allow-scripts"
          style={{ flex: 1, border: "none", width: "100%", height: "100%" }}
        />
      )}

      {/* Constrained viewport — tablet or mobile */}
      {html && !isLoading && constrainedWidth && (
        <Box sx={{ flex: 1, overflow: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", pt: 3, pb: 3 }}>
          <Box sx={{
            width: constrainedWidth,
            flexShrink: 0,
            borderRadius: viewport === "mobile" ? 4 : 2,
            overflow: "hidden",
            boxShadow: "0 0 0 8px #1e1e2e, 0 0 0 10px #333, 0 24px 64px rgba(0,0,0,0.6)",
            border: viewport === "mobile" ? "none" : "1px solid #333",
          }}>
            {/* Device notch for mobile */}
            {viewport === "mobile" && (
              <Box sx={{ bgcolor: "#0f0f0f", height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ width: 80, height: 8, bgcolor: "#333", borderRadius: 4 }} />
              </Box>
            )}
            <iframe
              srcDoc={html}
              title="Generated UI"
              sandbox="allow-scripts"
              style={{ display: "block", border: "none", width: constrainedWidth, height: viewport === "mobile" ? 720 : 900 }}
            />
            {viewport === "mobile" && (
              <Box sx={{ bgcolor: "#0f0f0f", height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box sx={{ width: 40, height: 4, bgcolor: "#444", borderRadius: 2 }} />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
