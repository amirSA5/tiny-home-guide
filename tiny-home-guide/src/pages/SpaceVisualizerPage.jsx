import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

const GRID_ROWS = 8;
const GRID_COLS = 12;

const paletteItems = [
  { id: "bed", label: "Bed", color: "#c084fc" },
  { id: "desk", label: "Desk", color: "#60a5fa" },
  { id: "table", label: "Table", color: "#34d399" },
  { id: "sofa", label: "Sofa", color: "#fbbf24" },
  { id: "storage", label: "Storage", color: "#f97316" },
  { id: "kitchen", label: "Kitchen", color: "#22d3ee" },
];

function cellKey(r, c) {
  return `${r}-${c}`;
}

function SpaceVisualizerPage() {
  const [placements, setPlacements] = useState(() => {
    try {
      const raw = localStorage.getItem("thg_visualizer");
      return raw ? JSON.parse(raw) : {};
    } catch (_err) {
      return {};
    }
  });
  const [snapToGrid, setSnapToGrid] = useState("grid");

  useEffect(() => {
    try {
      localStorage.setItem("thg_visualizer", JSON.stringify(placements));
    } catch (_err) {
      // ignore
    }
  }, [placements]);

  const occupiedCount = useMemo(() => Object.keys(placements).length, [placements]);

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (!itemId) return;
    const item = paletteItems.find((p) => p.id === itemId);
    if (!item) return;
    const key = cellKey(row, col);
    setPlacements((prev) => ({ ...prev, [key]: item }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleClearCell = (key) => {
    setPlacements((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleClearAll = () => setPlacements({});

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" gutterBottom>
          2D Space Visualizer
        </Typography>
        <Typography color="text.secondary">
          Drag and drop items into the grid to mock a top-down layout. Saved locally.
        </Typography>
      </Box>

      <Card variant="outlined">
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {paletteItems.map((item) => (
                <Chip
                  key={item.id}
                  label={item.label}
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", item.id)}
                  draggable
                  sx={{
                    backgroundColor: item.color,
                    color: "black",
                    cursor: "grab",
                  }}
                />
              ))}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <ToggleButtonGroup
                size="small"
                value={snapToGrid}
                exclusive
                onChange={(_e, val) => val && setSnapToGrid(val)}
              >
                <ToggleButton value="grid">Snap to grid</ToggleButton>
                <ToggleButton value="free" disabled>
                  Free (coming soon)
                </ToggleButton>
              </ToggleButtonGroup>
              <Button variant="outlined" color="secondary" onClick={handleClearAll}>
                Clear grid
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            sx={{ mb: 2 }}
          >
            <Typography fontWeight={600}>Top-down grid</Typography>
            <Typography color="text.secondary">
              {occupiedCount} cell{occupiedCount === 1 ? "" : "s"} filled · {GRID_ROWS} x {GRID_COLS}
            </Typography>
          </Stack>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 1,
              overflow: "auto",
            }}
          >
            <Grid container spacing={0.5} columns={GRID_COLS}>
              {Array.from({ length: GRID_ROWS }).map((_, row) =>
                Array.from({ length: GRID_COLS }).map((__, col) => {
                  const key = cellKey(row, col);
                  const placed = placements[key];
                  return (
                    <Grid item xs={1} key={key}>
                      <Box
                        onDrop={(e) => handleDrop(e, row, col)}
                        onDragOver={handleDragOver}
                        onClick={() => placed && handleClearCell(key)}
                        sx={{
                          height: 52,
                          border: "1px dashed",
                          borderColor: placed ? "primary.main" : "divider",
                          borderRadius: 1,
                          backgroundColor: placed ? placed.color : "transparent",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          cursor: placed ? "pointer" : "default",
                          color: placed ? "black" : "text.secondary",
                          userSelect: "none",
                        }}
                      >
                        {placed ? placed.label : `${row + 1}-${col + 1}`}
                      </Box>
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Divider />
      <Card variant="outlined">
        <CardContent>
          <Typography fontWeight={600} gutterBottom>
            Coming soon
          </Typography>
          <Typography color="text.secondary">
            3D preview, day/night lighting, and isometric views will build on your 2D plan.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default SpaceVisualizerPage;
