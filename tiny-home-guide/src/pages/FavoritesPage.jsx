// src/pages/FavoritesPage.jsx
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { useSpace } from "../context/SpaceContext.jsx";
import { layoutPatterns } from "../data/layoutPatterns.js";
import { furnitureItems } from "../data/furnitureItems.js";

function FavoritesPage() {
  const { favorites, favoritesSyncStatus, favoritesSyncError } = useSpace();

  const syncMessage =
    favoritesSyncError ||
    (favoritesSyncStatus === "saving" && "Syncing favorites to server...") ||
    (favoritesSyncStatus === "loading" && "Loading your favorites...") ||
    null;

  if (!favorites || favorites.length === 0) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Favorites
        </Typography>
        <Typography gutterBottom>You don't have any favorites yet.</Typography>
        <Button variant="contained" component={RouterLink} to="/recommendations">
          Go to recommendations
        </Button>
      </Box>
    );
  }

  const layoutFavorites = favorites
    .filter((f) => f.type === "layout")
    .map((f) => layoutPatterns.find((lp) => lp.id === f.id))
    .filter(Boolean);

  const furnitureFavorites = favorites
    .filter((f) => f.type === "furniture")
    .map((f) => furnitureItems.find((item) => item.id === f.id))
    .filter(Boolean);

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Favorites
        </Typography>
        {syncMessage && (
          <Alert severity={favoritesSyncError ? "error" : "info"} sx={{ mb: 2 }}>
            {syncMessage}
          </Alert>
        )}
        <Typography>
          Here are the layout and furniture ideas you've saved.
        </Typography>
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Layout favorites
        </Typography>
        {layoutFavorites.length === 0 ? (
          <Typography color="text.secondary">No layout ideas saved yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {layoutFavorites.map((lp) => (
              <Card key={lp.id} variant="outlined">
                <CardContent>
                  <Typography fontWeight={600}>{lp.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lp.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      <Box>
        <Typography variant="h6" gutterBottom>
          Furniture favorites
        </Typography>
        {furnitureFavorites.length === 0 ? (
          <Typography color="text.secondary">No furniture ideas saved yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {furnitureFavorites.map((item) => (
              <Card key={item.id} variant="outlined">
                <CardContent>
                  <Typography fontWeight={600}>{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.bestLocation}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

export default FavoritesPage;
