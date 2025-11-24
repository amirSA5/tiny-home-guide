import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import DirectionsBusFilledRoundedIcon from "@mui/icons-material/DirectionsBusFilledRounded";
import CottageRoundedIcon from "@mui/icons-material/CottageRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import NaturePeopleRoundedIcon from "@mui/icons-material/NaturePeopleRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import FamilyRestroomRoundedIcon from "@mui/icons-material/FamilyRestroomRounded";
import RocketLaunchRoundedIcon from "@mui/icons-material/RocketLaunchRounded";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";
import SelfImprovementRoundedIcon from "@mui/icons-material/SelfImprovementRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useNavigate } from "react-router-dom";
import { usePreferences } from "../context/PreferencesContext.jsx";
import { useSpace } from "../context/SpaceContext.jsx";

const userTypeOptions = [
  {
    value: "planning",
    label: "Planning a move",
    helper: "Laying out a future tiny home.",
    icon: <RocketLaunchRoundedIcon />,
  },
  {
    value: "already_living",
    label: "Already living tiny",
    helper: "Optimizing an existing setup.",
    icon: <SelfImprovementRoundedIcon />,
  },
  {
    value: "just_curious",
    label: "Just curious",
    helper: "Exploring ideas and trends.",
    icon: <ExploreRoundedIcon />,
  },
];

const spaceTypeOptions = [
  { value: "tiny_house", label: "Tiny house", icon: <CottageRoundedIcon /> },
  { value: "cabin", label: "Cabin", icon: <NaturePeopleRoundedIcon /> },
  { value: "van", label: "Van", icon: <DirectionsBusFilledRoundedIcon /> },
  { value: "studio", label: "Studio", icon: <MeetingRoomRoundedIcon /> },
];

const occupantOptions = [
  { value: "solo", label: "Solo", icon: <BedRoundedIcon /> },
  { value: "couple", label: "Couple", icon: <Groups2RoundedIcon /> },
  { value: "family", label: "Family", icon: <FamilyRestroomRoundedIcon /> },
];

const defaultPrefs = {
  userType: "planning",
  spaceType: "tiny_house",
  occupants: "solo",
  hasPets: false,
};

function SelectionCard({ active, title, helper, icon, onClick }) {
  return (
    <Paper
      onClick={onClick}
      elevation={active ? 6 : 1}
      sx={{
        p: 2,
        cursor: "pointer",
        borderRadius: 3,
        border: "1px solid",
        borderColor: active ? "primary.main" : "divider",
        background: active ? "linear-gradient(135deg, #e9f7f1 0%, #f5fbf8 100%)" : "white",
        height: "100%",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack spacing={1}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              display: "grid",
              placeItems: "center",
              backgroundColor: active ? "primary.main" : "grey.100",
              color: active ? "common.white" : "text.primary",
            }}
          >
            {icon}
          </Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        {helper && (
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

function OnboardingPage() {
  const navigate = useNavigate();
  const { preferences, status, error, savePreferences } = usePreferences();
  const { setSpaceProfile, spaceProfile } = useSpace();
  const [form, setForm] = useState(defaultPrefs);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (preferences) {
      setForm({
        userType: preferences.userType || defaultPrefs.userType,
        spaceType: preferences.spaceType || defaultPrefs.spaceType,
        occupants: preferences.occupants || defaultPrefs.occupants,
        hasPets:
          typeof preferences.hasPets === "boolean"
            ? preferences.hasPets
            : defaultPrefs.hasPets,
      });
    }
  }, [preferences]);

  const isSaving = status === "saving";
  const isLoading = status === "loading" && !preferences;

  const spaceCopy = useMemo(() => {
    const map = {
      tiny_house: "Tiny house",
      cabin: "Cabin retreat",
      van: "Adventure van",
      studio: "Studio loft",
    };
    return map[form.spaceType] || "space";
  }, [form.spaceType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveMessage("");
    try {
      const saved = await savePreferences(form);
      setSaveMessage("Saved! Your recommendations will use this profile.");
      // prime space profile defaults without overwriting dimensions
      setSpaceProfile({
        ...(spaceProfile || {}),
        type: saved.spaceType,
        occupants: saved.occupants,
      });
      setTimeout(() => navigate("/space"), 250);
    } catch (err) {
      setSaveMessage("");
      // error handled via context
    }
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 1, sm: 2, md: 3 },
        background:
          "radial-gradient(circle at 0% 20%, rgba(47,133,90,0.10), transparent 24%), radial-gradient(circle at 90% 0%, rgba(29,78,216,0.12), transparent 26%), linear-gradient(135deg, #f8fbff 0%, #f1f7f4 100%)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 1100,
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 18px 50px rgba(0,0,0,0.08)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Chip
              label="Step 1 · Onboarding"
              color="primary"
              variant="outlined"
              sx={{ alignSelf: "flex-start", fontWeight: 700 }}
            />
            <Typography variant="h4">
              Tailor your tiny home journey
            </Typography>
            <Typography color="text.secondary">
              Choose how you live and what you’re planning so we can personalize recommendations for your {spaceCopy.toLowerCase()}.
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          )}
          {saveMessage && (
            <Alert severity="success" sx={{ mb: 1 }}>
              {saveMessage}
            </Alert>
          )}

          <Stack spacing={2}>
            <Typography fontWeight={700}>Your situation</Typography>
            <ToggleButtonGroup
              fullWidth
              value={form.userType}
              exclusive
              onChange={(_e, value) => {
                if (value) setForm((prev) => ({ ...prev, userType: value }));
              }}
              sx={{
                flexWrap: "wrap",
                gap: 1,
                "& .MuiToggleButton-root": {
                  flex: { xs: "1 1 100%", sm: "1 1 calc(33% - 8px)" },
                  borderRadius: 2,
                  borderColor: "divider",
                  textTransform: "none",
                  justifyContent: "flex-start",
                  p: 1.5,
                },
              }}
            >
              {userTypeOptions.map((opt) => (
                <ToggleButton key={opt.value} value={opt.value}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    {opt.icon}
                    <Stack alignItems="flex-start">
                      <Typography fontWeight={700}>{opt.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {opt.helper}
                      </Typography>
                    </Stack>
                  </Stack>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Typography fontWeight={700}>Space type</Typography>
                <Grid container spacing={1.5}>
                  {spaceTypeOptions.map((opt) => (
                    <Grid item xs={12} sm={6} key={opt.value}>
                      <SelectionCard
                        active={form.spaceType === opt.value}
                        title={opt.label}
                        icon={opt.icon}
                        helper="Works well for compact living"
                        onClick={() =>
                          setForm((prev) => ({ ...prev, spaceType: opt.value }))
                        }
                      />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={1.5}>
                <Typography fontWeight={700}>Who’s living here?</Typography>
                <Grid container spacing={1.5}>
                  {occupantOptions.map((opt) => (
                    <Grid item xs={12} sm={4} key={opt.value}>
                      <SelectionCard
                        active={form.occupants === opt.value}
                        title={opt.label}
                        icon={opt.icon}
                        helper={
                          opt.value === "solo"
                            ? "Space-efficient by design"
                            : opt.value === "couple"
                            ? "Two people sharing essentials"
                            : "Room for everyone"
                        }
                        onClick={() =>
                          setForm((prev) => ({ ...prev, occupants: opt.value }))
                        }
                      />
                    </Grid>
                  ))}
                </Grid>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: "1px dashed",
                    borderColor: "divider",
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PetsRoundedIcon color="secondary" />
                    <Typography fontWeight={600}>
                      Pets welcome?
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography color="text.secondary">No pets</Typography>
                    <Switch
                      checked={form.hasPets}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, hasPets: e.target.checked }))
                      }
                      inputProps={{ "aria-label": "Has pets" }}
                    />
                    <Typography color="text.secondary">Yes, pets</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<CheckCircleRoundedIcon />}
              disabled={isSaving || isLoading}
              sx={{ flex: 1, py: 1.3 }}
            >
              {isSaving ? "Saving..." : "Save & continue"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              startIcon={<FavoriteBorderRoundedIcon />}
              onClick={() => navigate("/recommendations")}
              disabled={isLoading}
              sx={{ flex: 1, py: 1.3 }}
            >
              Skip to recommendations
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default OnboardingPage;
