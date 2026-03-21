import { Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/react";
import Box from "@mui/material/Box";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import GeneratorPage from "./pages/GeneratorPage.jsx";
import GalleryPage from "./pages/GalleryPage.jsx";
import DashboardEditPage from "./pages/DashboardEditPage.jsx";
import SharePage from "./pages/SharePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkSignInPage() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "background.default" }}>
      <SignIn routing="path" path="/login" afterSignInUrl="/app" />
    </Box>
  );
}

function ClerkSignUpPage() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", bgcolor: "background.default" }}>
      <SignUp routing="path" path="/signup" afterSignUpUrl="/app" />
    </Box>
  );
}

export default function AppRoutes({ themeProps }) {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/share/:slug" element={<SharePage />} />

      {/* Auth pages — only when Clerk is enabled */}
      {CLERK_ENABLED && <Route path="/login/*" element={<ClerkSignInPage />} />}
      {CLERK_ENABLED && <Route path="/signup/*" element={<ClerkSignUpPage />} />}

      {/* Protected app routes */}
      <Route path="/app" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />
      <Route path="/app/new" element={<ProtectedRoute><GeneratorPage {...themeProps} /></ProtectedRoute>} />
      <Route path="/app/dashboard/:id" element={<ProtectedRoute><DashboardEditPage {...themeProps} /></ProtectedRoute>} />
      <Route path="/app/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* If no Clerk, redirect login/signup to app */}
      {!CLERK_ENABLED && <Route path="/login" element={<Navigate to="/app" replace />} />}
      {!CLERK_ENABLED && <Route path="/signup" element={<Navigate to="/app" replace />} />}

      {/* Fallback — legacy direct access goes to generator */}
      <Route path="*" element={<Navigate to="/app/new" replace />} />
    </Routes>
  );
}
