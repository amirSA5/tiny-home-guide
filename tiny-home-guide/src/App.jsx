// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
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
import { SpaceProvider } from "./context/SpaceContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

const theme = createTheme({
  palette: {
    primary: { main: "#2f855a" },
    secondary: { main: "#1d4ed8" },
    background: { default: "#f7f9fb" },
  },
  shape: { borderRadius: 10 },
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
          <Button color="inherit" component={RouterLink} to="/space">
            Space Profile
          </Button>
          <Button color="inherit" component={RouterLink} to="/recommendations">
            Recommendations
          </Button>
          <Button color="inherit" component={RouterLink} to="/favorites">
            Favorites
          </Button>
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
          <Route path="/" element={<WelcomePage />} />
          <Route path="/space" element={<SpaceProfilePage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SpaceProvider>
          <Router>
            <AppShell />
          </Router>
        </SpaceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
