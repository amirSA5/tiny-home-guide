// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  LinearProgress,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import WelcomePage from "./pages/WelcomePage.jsx";
import SpaceProfilePage from "./pages/SpaceProfilePage.jsx";
import RecommendationsPage from "./pages/RecommendationsPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import SpaceVisualizerPage from "./pages/SpaceVisualizerPage.jsx";
import { SpaceProvider } from "./context/SpaceContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import {
  PreferencesProvider,
  usePreferences,
} from "./context/PreferencesContext.jsx";

const theme = createTheme({
  palette: {
    primary: { main: "#2f855a" },
    secondary: { main: "#1d4ed8" },
    background: { default: "#f7f9fb" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"DM Sans", "Inter", system-ui, -apple-system, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
  },
});

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <AppBar position="sticky" color="primary" enableColorOnDark>
      <Toolbar sx={{ gap: 1 }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
        >
          Tiny Home Living Guide
        </Typography>

        <Stack direction="row" spacing={1}>
          {user && (
            <>
              <Button color="inherit" component={RouterLink} to="/onboarding">
                Onboarding
              </Button>
              <Button color="inherit" component={RouterLink} to="/space">
                Space Profile
              </Button>
              <Button color="inherit" component={RouterLink} to="/recommendations">
                Recommendations
              </Button>
              <Button color="inherit" component={RouterLink} to="/favorites">
                Favorites
              </Button>
              <Button color="inherit" component={RouterLink} to="/visualizer">
                Visualizer
              </Button>
            </>
          )}
        </Stack>

        <Stack direction="row" spacing={1} sx={{ marginLeft: 2 }}>
          {user ? (
            <>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.85)" }}>
                {user.email} ({user.role})
              </Typography>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Log in
              </Button>
              <Button
                color="secondary"
                variant="contained"
                component={RouterLink}
                to="/signup"
              >
                Sign up
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function AppShell() {
  return (
    <Box>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/space" element={<SpaceProfilePage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/visualizer" element={<SpaceVisualizerPage />} />
          </Route>
        </Routes>
      </Container>
    </Box>
  );
}

function ProtectedRoute() {
  const location = useLocation();
  const { user, status } = useAuth();
  const {
    preferences,
    status: prefStatus,
    error: prefError,
  } = usePreferences();

  const loadingAuth = status === "loading";
  const loadingPrefs = user && (prefStatus === "loading" || prefStatus === "saving" || prefStatus === "idle");

  if (loadingAuth || loadingPrefs) {
    return (
      <Box sx={{ pt: 6 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, textAlign: "center" }} color="text.secondary">
          Preparing your workspace...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (prefStatus === "ready" && !preferences && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (prefStatus === "error" && !preferences) {
    return (
      <Box sx={{ pt: 6 }}>
        <Typography color="error" align="center">
          {prefError || "Could not load your preferences."}
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ mt: 1 }}>
          You can retry from the onboarding page.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button variant="contained" component={RouterLink} to="/onboarding">
            Go to onboarding
          </Button>
        </Box>
      </Box>
    );
  }

  return <Outlet />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PreferencesProvider>
          <SpaceProvider>
            <Router>
              <AppShell />
            </Router>
          </SpaceProvider>
        </PreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
