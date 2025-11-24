import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useAuth } from "../context/AuthContext.jsx";

function LoginPage() {
  const navigate = useNavigate();
  const { login, status, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    try {
      await login(email, password);
      navigate("/recommendations");
    } catch (err) {
      setLocalError(err?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, sm: 4 },
        background:
          "radial-gradient(circle at 12% 20%, rgba(47,133,90,0.12), transparent 24%), radial-gradient(circle at 80% 0%, rgba(29,78,216,0.18), transparent 26%), linear-gradient(135deg, #f8fbff 0%, #f1f7f4 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4 },
          maxWidth: 520,
          width: "100%",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 14px 40px rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack spacing={1.5} sx={{ mb: 1 }}>
          <Chip
            label="Welcome back"
            color="primary"
            variant="outlined"
            sx={{ alignSelf: "flex-start", fontWeight: 600 }}
          />
          <Typography variant="h5">Log in</Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to save favorites across devices and access admin tools.
          </Typography>
        </Stack>

        {(localError || error) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError || error}
          </Alert>
        )}

        <Stack component="form" onSubmit={handleSubmit} spacing={2.5}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={status === "loading"}
            endIcon={<LoginRoundedIcon />}
            sx={{ py: 1.1 }}
          >
            {status === "loading" ? "Signing in..." : "Log in"}
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Don't have an account?{" "}
          <Link component={RouterLink} to="/signup">
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default LoginPage;
