// src/pages/SpaceProfilePage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Switch,
  Typography,
} from "@mui/material";
import { useSpace } from "../context/SpaceContext.jsx";
import { usePreferences } from "../context/PreferencesContext.jsx";

function SpaceProfilePage() {
  const navigate = useNavigate();
  const { setSpaceProfile, spaceProfile } = useSpace();
  const { preferences } = usePreferences();

  const [length, setLength] = useState(spaceProfile?.length || "");
  const [width, setWidth] = useState(spaceProfile?.width || "");
  const [height, setHeight] = useState(spaceProfile?.height || "");
  const [type, setType] = useState(spaceProfile?.type || "");
  const [occupants, setOccupants] = useState(spaceProfile?.occupants || "solo");
  const [zones, setZones] = useState(
    spaceProfile?.zones || ["sleep", "work", "kitchen"]
  );
  const [mobility, setMobility] = useState(spaceProfile?.mobility || "mobile");
  const [loft, setLoft] = useState(Boolean(spaceProfile?.loft));
  const [formError, setFormError] = useState("");

  const allZones = [
    { id: "sleep", label: "Sleep area" },
    { id: "work", label: "Work / desk" },
    { id: "dining", label: "Dining space" },
    { id: "kitchen", label: "Kitchen" },
    { id: "pet", label: "Pet corner" },
    { id: "storage", label: "Extra storage" },
  ];

  const handleZoneToggle = (zoneId) => {
    setZones((prev) =>
      prev.includes(zoneId)
        ? prev.filter((z) => z !== zoneId)
        : [...prev, zoneId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!length || !width || !height || !type) {
      setFormError("Please fill length, width, height, and type.");
      return;
    }
    setFormError("");

    const profile = {
      length: Number(length),
      width: Number(width),
      height: Number(height),
      type,
      occupants,
      zones,
      mobility,
      loft,
    };

    setSpaceProfile(profile);
    navigate("/recommendations");
  };

  useEffect(() => {
    if (!type && preferences?.spaceType) {
      setType(preferences.spaceType);
    }
    if (!spaceProfile?.occupants && preferences?.occupants) {
      setOccupants(preferences.occupants);
    }
  }, [preferences, spaceProfile, type]);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        justifyContent: "center",
        p: { xs: 2, sm: 3 },
        background:
          "radial-gradient(circle at 12% 20%, rgba(47,133,90,0.10), transparent 24%), radial-gradient(circle at 80% 0%, rgba(29,78,216,0.12), transparent 26%), linear-gradient(135deg, #f8fbff 0%, #f1f7f4 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4 },
          width: "100%",
          maxWidth: 820,
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 16px 44px rgba(0,0,0,0.08)",
        }}
      >
        <Stack spacing={1.5} sx={{ mb: 1 }}>
          <Typography variant="h5" gutterBottom>
            Space Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Describe your tiny home so we can suggest layouts and furniture tailored to you.
          </Typography>
        </Stack>
        {formError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <Stack component="form" spacing={3} onSubmit={handleSubmit}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Length (m)"
              type="number"
              inputProps={{ step: 0.1, min: 1 }}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Width (m)"
              type="number"
              inputProps={{ step: 0.1, min: 1 }}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Height (m)"
              type="number"
              inputProps={{ step: 0.05, min: 1 }}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
              fullWidth
            />
          </Stack>

          <FormControl fullWidth>
            <FormLabel>Type of space</FormLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              displayEmpty
              required
              sx={{ backgroundColor: "background.paper" }}
            >
              <MenuItem value="" disabled>
                Select type
              </MenuItem>
              <MenuItem value="tiny_house">Tiny house</MenuItem>
              <MenuItem value="cabin">Cabin</MenuItem>
              <MenuItem value="van">Van</MenuItem>
              <MenuItem value="studio">Studio</MenuItem>
            </Select>
          </FormControl>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <FormControl fullWidth>
              <FormLabel>Home type (mobility)</FormLabel>
              <Select
                value={mobility}
                onChange={(e) => setMobility(e.target.value)}
                displayEmpty
              >
                <MenuItem value="mobile">Mobile (wheels/van)</MenuItem>
                <MenuItem value="fixed">Fixed (cabin/studio)</MenuItem>
              </Select>
            </FormControl>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                p: 2,
                borderRadius: 3,
                border: "1px dashed",
                borderColor: "divider",
                minWidth: { xs: "100%", sm: 260 },
              }}
            >
              <Switch checked={loft} onChange={(e) => setLoft(e.target.checked)} />
              <Box>
                <Typography fontWeight={600}>Include a loft</Typography>
                <Typography variant="body2" color="text.secondary">
                  Loft-friendly layouts unlock more ideas.
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <FormControl component="fieldset">
            <FormLabel>Occupants</FormLabel>
            <RadioGroup
              row
              value={occupants}
              onChange={(e) => setOccupants(e.target.value)}
            >
              <FormControlLabel value="solo" control={<Radio />} label="Solo" />
              <FormControlLabel value="couple" control={<Radio />} label="Couple" />
              <FormControlLabel value="family" control={<Radio />} label="Family" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset">
            <FormLabel>What zones do you need?</FormLabel>
            <FormGroup>
              {allZones.map((z) => (
                <FormControlLabel
                  key={z.id}
                  control={
                    <Checkbox
                      checked={zones.includes(z.id)}
                      onChange={() => handleZoneToggle(z.id)}
                    />
                  }
                  label={z.label}
                />
              ))}
            </FormGroup>
          </FormControl>

          <Box>
            <Button type="submit" variant="contained" color="primary">
              Generate ideas {"->"}
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}

export default SpaceProfilePage;
