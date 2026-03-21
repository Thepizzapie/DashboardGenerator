import { useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { createAppTheme } from "./theme";
import AppRoutes from "./routes.jsx";

export default function App() {
  const [colorMode, setColorMode] = useState("dark");
  const theme = useMemo(() => createAppTheme(colorMode), [colorMode]);

  const themeProps = {
    colorMode,
    onColorModeToggle: () => setColorMode(m => m === "dark" ? "light" : "dark"),
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes themeProps={themeProps} />
    </ThemeProvider>
  );
}
