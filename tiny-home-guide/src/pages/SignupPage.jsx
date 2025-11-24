import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  Link,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { useAuth } from "../context/AuthContext.jsx";

function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, status, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [inviteCode, setInviteCode] = useState("");
  const [localError, setLocalError] = useState("");
  const redirectTo = location.state?.from || "/onboarding";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    try {
      await signup({
        email,
        password,
        role,
        adminInviteCode: role === "admin" ? inviteCode : undefined,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setLocalError(err?.message || "Signup failed");
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
          maxWidth: 560,
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
            label="Join the tiny home community"
            color="secondary"
            variant="outlined"
            sx={{ alignSelf: "flex-start", fontWeight: 600 }}
            icon={<CheckCircleOutlineRoundedIcon />}
          />
        <Typography variant="h5" gutterBottom>
          Create an account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Save your space plans and favorites. Admins need an invite code.
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

          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Role"
              onChange={(e) => setRole(e.target.value)}
            >
              <MenuItem value="user">
                <ListItemIcon>
                  <CheckCircleOutlineRoundedIcon fontSize="small" />
                </ListItemIcon>
                User
              </MenuItem>
              <MenuItem value="admin">
                <ListItemIcon>
                  <AdminPanelSettingsOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Admin
              </MenuItem>
            </Select>
          </FormControl>

          {role === "admin" && (
            <TextField
              label="Admin invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AdminPanelSettingsOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={status === "loading"}
            endIcon={<PersonAddAlt1RoundedIcon />}
            sx={{ py: 1.1 }}
          >
            {status === "loading" ? "Creating account..." : "Sign up"}
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login">
            Log in
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default SignupPage;
