import { useAuth } from "@clerk/react";
import { Navigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Safe wrapper: when Clerk is disabled, hooks aren't called
function ProtectedRouteInner({ children }) {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default function ProtectedRoute({ children }) {
  // If Clerk not configured, allow through (dev mode)
  if (!CLERK_ENABLED) return children;

  return <ProtectedRouteInner>{children}</ProtectedRouteInner>;
}

