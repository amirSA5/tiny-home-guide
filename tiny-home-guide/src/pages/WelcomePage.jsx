import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

function WelcomePage() {
  return (
    <Box display="flex" justifyContent="center">
      <Paper elevation={2} sx={{ p: 4, maxWidth: 720, width: "100%" }}>
        <Stack spacing={2}>
          <Typography variant="h4">Welcome</Typography>
          <Typography>
            This app helps you plan and optimize your tiny home with layout ideas,
            multifunctional furniture, and minimalism tips.
          </Typography>
          <Typography>Ready to start?</Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/space"
            >
              Create your space profile {"->"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              component={RouterLink}
              to="/recommendations"
            >
              View recommendations
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default WelcomePage;
