// src/pages/RecommendationsPage.jsx
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useSpace } from "../context/SpaceContext.jsx";
import { furnitureItems } from "../data/furnitureItems.js";
import { layoutPatterns } from "../data/layoutPatterns.js";
import { designTips } from "../data/designTips.js";
import { zoneArrangements } from "../data/zoneArrangements.js";
import { fetchRecommendations } from "../services/api.js";

function matchesMobility(allowed, profileMobility) {
  if (!allowed || allowed.length === 0) return true;
  if (!profileMobility) return true;
  return allowed.includes(profileMobility);
}

function meetsHeight(minHeight, profileHeight) {
  if (!minHeight) return true;
  if (!profileHeight) return true;
  return Number(profileHeight) >= minHeight;
}

function filterLayouts(spaceProfile) {
  if (!spaceProfile) return [];

  const area = spaceProfile.length * spaceProfile.width;
  const profileMobility = spaceProfile.mobility;
  const profileHeight = spaceProfile.height;

  return layoutPatterns.filter((lp) => {
    const rec = lp.recommendedFor || {};

    if (lp.minArea && lp.minArea > area) return false;
    if (rec.minHeight && !meetsHeight(rec.minHeight, profileHeight)) return false;
    if (lp.requiresLoft && !spaceProfile.loft) return false;

    if (rec.type && !rec.type.includes(spaceProfile.type)) {
      return false;
    }

    if (rec.occupants && !rec.occupants.includes(spaceProfile.occupants)) {
      return false;
    }

    if (rec.mobility && !matchesMobility(rec.mobility, profileMobility)) {
      return false;
    }

    if (rec.zones) {
      const hasCommonZone = rec.zones.some((z) =>
        spaceProfile.zones.includes(z)
      );
      if (!hasCommonZone) return false;
    }

    return true;
  });
}

function filterFurniture(spaceProfile) {
  if (!spaceProfile) return [];

  return furnitureItems.filter((item) => {
    if (!item.zones || item.zones.length === 0) return true;
    return item.zones.some((z) => spaceProfile.zones.includes(z));
  });
}

function filterArrangements(spaceProfile) {
  if (!spaceProfile) return [];

  const profileMobility = spaceProfile.mobility;
  const profileHeight = spaceProfile.height;

  return zoneArrangements.filter((idea) => {
    const criteria = idea.criteria || {};

    if (criteria.requiresLoft && !spaceProfile.loft) return false;
    if (criteria.minHeight && !meetsHeight(criteria.minHeight, profileHeight)) {
      return false;
    }
    if (criteria.mobility && !matchesMobility(criteria.mobility, profileMobility)) {
      return false;
    }
    if (criteria.zones) {
      const hasCommon = criteria.zones.some((z) =>
        spaceProfile.zones.includes(z)
      );
      if (!hasCommon) return false;
    }
    return true;
  });
}

function RecommendationsPage() {
  const { spaceProfile, toggleFavorite, isFavorite } = useSpace();
  const [recommendations, setRecommendations] = useState({
    layouts: [],
    furniture: [],
    designTips,
    arrangementIdeas: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    if (!spaceProfile) return;
    let cancelled = false;

    async function loadRecommendations() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRecommendations(spaceProfile);
        if (!cancelled) {
          setRecommendations({
            layouts: data.layouts || [],
            furniture: data.furniture || [],
            designTips: data.designTips || designTips,
            arrangementIdeas: data.arrangementIdeas || [],
          });
          setUsedFallback(false);
        }
      } catch (err) {
        if (!cancelled) {
          setRecommendations({
            layouts: filterLayouts(spaceProfile),
            furniture: filterFurniture(spaceProfile),
            designTips,
            arrangementIdeas: filterArrangements(spaceProfile),
          });
          setUsedFallback(true);
          setError(
            err?.message ||
              "Could not reach the server. Showing local suggestions instead."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();
    return () => {
      cancelled = true;
    };
  }, [spaceProfile]);

  if (!spaceProfile) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Recommendations
        </Typography>
        <Typography gutterBottom>
          We need some info about your tiny home before we can suggest layouts
          and furniture.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/space">
          Create your space profile {"->"}
        </Button>
      </Box>
    );
  }

  const layouts = recommendations.layouts || [];
  const furniture = recommendations.furniture || [];
  const tips = recommendations.designTips || [];
  const arrangements = recommendations.arrangementIdeas || [];
  const readableType = spaceProfile.type.replace("_", " ");

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Recommendations
        </Typography>
        <Typography>
          Ideas tailored to your {readableType} (~{spaceProfile.length}m x{" "}
          {spaceProfile.width}m, height ~{spaceProfile.height || "?"}m,{" "}
          {spaceProfile.mobility === "mobile" ? "mobile" : "fixed"}).
        </Typography>
      </Box>

      {loading && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={18} />
          <Typography>Loading fresh recommendations...</Typography>
        </Stack>
      )}
      {error && (
        <Alert severity="warning">
          {error} {usedFallback && "(offline fallback)"}
        </Alert>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Zone arrangement ideas
        </Typography>
        {arrangements.length === 0 ? (
          <Typography color="text.secondary">
            Add more zones or enable a loft to unlock tailored arrangement ideas.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {arrangements.map((idea) => (
              <Card key={idea.id} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {idea.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {idea.detail}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Layout ideas
        </Typography>
        {layouts.length === 0 ? (
          <Typography color="text.secondary">
            No specific layout patterns matched yet, but you can still explore furniture ideas
            below.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {layouts.map((lp) => {
              const fav = isFavorite("layout", lp.id);
              return (
                <Card key={lp.id} variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {lp.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                      {lp.description}
                    </Typography>
                    <Button
                      size="small"
                      variant={fav ? "contained" : "outlined"}
                      onClick={() => toggleFavorite("layout", lp.id)}
                    >
                      {fav ? "Remove from favorites" : "Save to favorites"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Multifunctional furniture
        </Typography>
        {furniture.length === 0 ? (
          <Typography color="text.secondary">No furniture suggestions yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {furniture.map((item) => {
              const fav = isFavorite("furniture", item.id);
              return (
                <Card key={item.id} variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.bestLocation}
                    </Typography>
                    {item.footprint && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Approx. footprint:{" "}
                        {item.footprint.width && `width ~${item.footprint.width}cm `}{" "}
                        {item.footprint.openDepth &&
                          `- depth in use ~${item.footprint.openDepth}cm `}{" "}
                        {item.footprint.foldedDepth &&
                          `- depth folded ~${item.footprint.foldedDepth}cm`}
                      </Typography>
                    )}
                    <Button
                      size="small"
                      variant={fav ? "contained" : "outlined"}
                      sx={{ mt: 1 }}
                      onClick={() => toggleFavorite("furniture", item.id)}
                    >
                      {fav ? "Remove from favorites" : "Save to favorites"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Design tips for tiny homes
        </Typography>
        <Stack spacing={1}>
          {tips.map((tip) => (
            <Card key={tip.id} variant="outlined">
              <CardContent>
                <Typography variant="body2">{tip.text}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      <Box>
        <Button variant="contained" component={RouterLink} to="/favorites">
          View your favorites {"->"}
        </Button>
      </Box>
    </Stack>
  );
}

export default RecommendationsPage;
