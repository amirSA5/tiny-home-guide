// src/pages/SpaceProfilePage.jsx
import { useState } from "react";
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
  Typography,
} from "@mui/material";
import { useSpace } from "../context/SpaceContext.jsx";

function SpaceProfilePage() {
  const navigate = useNavigate();
  const { setSpaceProfile, spaceProfile } = useSpace();

  const [length, setLength] = useState(spaceProfile?.length || "");
  const [width, setWidth] = useState(spaceProfile?.width || "");
  const [type, setType] = useState(spaceProfile?.type || "");
  const [occupants, setOccupants] = useState(spaceProfile?.occupants || "solo");
  const [zones, setZones] = useState(spaceProfile?.zones || ["sleep", "work"]);
  const [formError, setFormError] = useState("");

  const allZones = [
    { id: "sleep", label: "Sleep area" },
    { id: "work", label: "Work / desk" },
    { id: "dining", label: "Dining space" },
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
    if (!length || !width || !type) {
      setFormError("Please fill length, width, and type.");
      return;
    }
    setFormError("");

    const profile = {
      length: Number(length),
      width: Number(width),
      type,
      occupants,
      zones,
    };

    setSpaceProfile(profile);
    navigate("/recommendations");
  };

  return (
    <Box display="flex" justifyContent="center">
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 720 }}>
        <Typography variant="h5" gutterBottom>
          Space Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Describe your tiny home so we can suggest layouts and furniture.
        </Typography>
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
              inputProps={{ step: 0.1 }}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Width (m)"
              type="number"
              inputProps={{ step: 0.1 }}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
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
