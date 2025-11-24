import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

function WelcomePage() {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, sm: 3 },
        background:
          "radial-gradient(circle at 15% 20%, rgba(47,133,90,0.14), transparent 26%), radial-gradient(circle at 90% 0%, rgba(29,78,216,0.12), transparent 26%), linear-gradient(135deg, #f8fbff 0%, #f1f7f4 100%)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          maxWidth: 1080,
          width: "100%",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 22px 60px rgba(0,0,0,0.1)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack spacing={2} flex={1}>
            <Chip
              icon={<AutoAwesomeRoundedIcon />}
              label="Tiny Home Living Guide"
              color="primary"
              variant="outlined"
              sx={{ alignSelf: "flex-start", fontWeight: 700 }}
            />
            <Typography variant="h4">
              Design, optimize, and love your tiny home.
            </Typography>
            <Typography color="text.secondary">
              Plan layouts, discover multifunctional furniture, and keep your favorite ideas synced across devices. Built for planners, dwellers, and the tiny-curious.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "center" }}
            >
              <Button
                variant="contained"
                size="large"
                color="primary"
                component={RouterLink}
                to="/space"
              >
                Create your space profile
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="secondary"
                component={RouterLink}
                to="/onboarding"
              >
                Finish onboarding
              </Button>
            </Stack>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              color="text.secondary"
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <ExploreRoundedIcon color="primary" />
                <Typography variant="body2">Curated layouts</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <FavoriteRoundedIcon color="secondary" />
                <Typography variant="body2">Save favorites</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Box
            flex={1}
            sx={{
              width: "100%",
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(47,133,90,0.15), rgba(29,78,216,0.15)), url('https://images.unsplash.com/photo-1505692069463-5e3405e3e7ee?auto=format&fit=crop&w=1200&q=80') center/cover",
              minHeight: { xs: 220, sm: 260, md: 320 },
              boxShadow: "inset 0 0 0 2000px rgba(0,0,0,0.1)",
              position: "relative",
              overflow: "hidden",
            }}
          />
        </Stack>
      </Paper>
    </Box>
  );
}

export default WelcomePage;
