import { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Sidebar from "./components/Sidebar";
import GenerationArea from "./components/GenerationArea";

const DRAWER_WIDTH = 272;

export default function App() {
  const [mode, setMode] = useState("html"); // "html" | "mui"
  const [htmlOutput, setHtmlOutput] = useState("");
  const [muiOutput, setMuiOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate(prompt) {
    setIsLoading(true);
    setError(null);

    const endpoint = mode === "mui" ? "/generate-mui" : "/generate";

    try {
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const { html } = await res.json();
      if (mode === "mui") setMuiOutput(html);
      else setHtmlOutput(html);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const output = mode === "mui" ? muiOutput : htmlOutput;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      <AppBar position="static" elevation={0}>
        <Toolbar variant="dense" sx={{ minHeight: 48 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            ⚡ React App Generator
          </Typography>
          <Typography variant="caption" sx={{ ml: "auto", color: "text.secondary" }}>
            POC · Claude-powered UI from natural language
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar mode={mode} drawerWidth={DRAWER_WIDTH} />
        <GenerationArea
          mode={mode}
          onModeChange={setMode}
          onGenerate={handleGenerate}
          output={output}
          isLoading={isLoading}
          error={error}
        />
      </Box>
    </Box>
  );
}
