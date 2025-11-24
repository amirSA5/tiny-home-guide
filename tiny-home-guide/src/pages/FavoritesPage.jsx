// src/pages/FavoritesPage.jsx
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useSpace, DEFAULT_BOARDS } from "../context/SpaceContext.jsx";
import { layoutPatterns } from "../data/layoutPatterns.js";
import { furnitureItems } from "../data/furnitureItems.js";
import { designTips } from "../data/designTips.js";
import { minimalismGuides } from "../data/minimalismGuides.js";

function FavoritesPage() {
  const {
    favorites,
    favoritesSyncStatus,
    favoritesSyncError,
    setFavoriteBoard,
  } = useSpace();
  const [boardFilter, setBoardFilter] = useState("all");

  const syncMessage =
    favoritesSyncError ||
    (favoritesSyncStatus === "saving" && "Syncing favorites to server...") ||
    (favoritesSyncStatus === "loading" && "Loading your favorites...") ||
    null;

  const boards = useMemo(() => {
    const extraBoards = new Set(
      favorites?.map((f) => f.board).filter(Boolean) || []
    );
    return ["all", ...DEFAULT_BOARDS, ...extraBoards];
  }, [favorites]);

  const enrichFavorite = (fav) => {
    if (fav.type === "layout") {
      const item = layoutPatterns.find((lp) => lp.id === fav.id);
      return item
        ? { title: item.title, description: item.description, typeLabel: "Layout" }
        : null;
    }
    if (fav.type === "furniture") {
      const item = furnitureItems.find((it) => it.id === fav.id);
      return item
        ? { title: item.name, description: item.bestLocation, typeLabel: "Furniture" }
        : null;
    }
    if (fav.type === "tip") {
      const item =
        designTips.find((t) => t.id === fav.id) ||
        minimalismGuides.find((g) => g.id === fav.id);
      if (item) {
        return {
          title: item.title || item.id,
          description: item.summary || item.bullets?.[0] || "",
          typeLabel: "Tip / Guide",
        };
      }
    }
    return null;
  };

  const grouped = useMemo(() => {
    const map = new Map();
    favorites?.forEach((fav) => {
      const detail = enrichFavorite(fav);
      if (!detail) return;
      const boardName = fav.board || "General";
      if (!map.has(boardName)) map.set(boardName, []);
      map.get(boardName).push({ ...fav, ...detail });
    });
    return map;
  }, [favorites]);

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

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Idea boards
        </Typography>
        {syncMessage && (
          <Alert severity={favoritesSyncError ? "error" : "info"} sx={{ mb: 2 }}>
            {syncMessage}
          </Alert>
        )}
        <Typography color="text.secondary">
          Save layouts, furniture, and tips into boards (like Pinterest, but for tiny homes).
        </Typography>
      </Box>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        alignItems={{ xs: "flex-start", sm: "center" }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by board</InputLabel>
          <Select
            value={boardFilter}
            label="Filter by board"
            onChange={(e) => setBoardFilter(e.target.value)}
          >
            {boards.map((b) => (
              <MenuItem key={b} value={b}>
                {b === "all" ? "All boards" : b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={() => setBoardFilter("all")}>
          Reset filter
        </Button>
      </Stack>

      <Divider />

      {[...grouped.keys()]
        .filter((board) => boardFilter === "all" || boardFilter === board)
        .map((board) => {
          const items = grouped.get(board) || [];
          return (
            <Box key={board}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="h6">{board}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {items.length} saved
                </Typography>
              </Stack>
              {items.length === 0 ? (
                <Typography color="text.secondary">No items yet.</Typography>
              ) : (
                <Stack spacing={2}>
                  {items.map((item) => (
                    <Card key={`${item.type}-${item.id}`} variant="outlined">
                      <CardContent>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={1}
                          alignItems={{ xs: "flex-start", sm: "center" }}
                          justifyContent="space-between"
                        >
                          <Stack spacing={0.5}>
                            <Typography fontWeight={600}>{item.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                              <Chip label={item.typeLabel} size="small" />
                              {item.board && (
                                <Chip
                                  label={`Board: ${item.board}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </Stack>
                          <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Move to board</InputLabel>
                            <Select
                              label="Move to board"
                              value={item.board || "General"}
                              onChange={(e) =>
                                setFavoriteBoard(item.type, item.id, e.target.value)
                              }
                            >
                              {DEFAULT_BOARDS.map((b) => (
                                <MenuItem key={b} value={b}>
                                  {b}
                                </MenuItem>
                              ))}
                              <MenuItem value="">Unsorted</MenuItem>
                            </Select>
                          </FormControl>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          );
        })}
    </Stack>
  );
}

export default FavoritesPage;
