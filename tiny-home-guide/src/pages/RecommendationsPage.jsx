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
  Chip,
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

function computeLayoutScore(pattern, profile) {
  const area = profile.length * profile.width;
  const rec = pattern.recommendedFor || {};
  const profileHeight = profile.height;
  const profileMobility = profile.mobility;

  let score = 0;

  if (rec.zones && rec.zones.length > 0) {
    const matched = rec.zones.filter((z) => profile.zones.includes(z)).length;
    const coverage = matched / rec.zones.length;
    score += Math.round(coverage * 40);
  } else {
    score += 10;
  }

  if (pattern.minArea) {
    const diff = Math.abs(area - pattern.minArea);
    const areaScore = Math.max(0, 20 - Math.min(diff, 20));
    score += areaScore;
  } else {
    score += 10;
  }

  if (rec.type?.includes(profile.type)) score += 10;
  if (rec.occupants?.includes(profile.occupants)) score += 10;
  if (matchesMobility(rec.mobility, profileMobility)) score += 10;

  if (meetsHeight(rec.minHeight, profileHeight)) score += 5;
  if (!pattern.requiresLoft || profile.loft) score += 5;

  return score;
}

function attachScores(patterns, profile) {
  return patterns
    .map((p) => ({ ...p, matchScore: computeLayoutScore(p, profile) }))
    .sort((a, b) => b.matchScore - a.matchScore);
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
            layouts: attachScores(filterLayouts(spaceProfile), spaceProfile),
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
            {layouts.map((lp, idx) => {
              const fav = isFavorite("layout", lp.id);
              return (
                <Card key={lp.id} variant="outlined">
                  <CardContent>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {idx === 0 ? "⭐ Best match · " : ""}
                        {lp.title}
                      </Typography>
                      {lp.matchScore !== undefined && (
                        <Typography variant="body2" color="text.secondary">
                          Match score: {lp.matchScore}/100
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                      {lp.description}
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1 }}>
                      {lp.requiredFeatures?.map((feat) => (
                        <Chip key={feat} label={feat} size="small" />
                      ))}
                      {lp.recommendedFor?.occupants?.length && (
                        <Chip
                          label={`Suitable: ${lp.recommendedFor.occupants.join(", ")}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Stack>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2}
                      sx={{ mb: 1 }}
                    >
                      {lp.pros?.length > 0 && (
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={700}>
                            Pros
                          </Typography>
                          <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                            {lp.pros.map((p) => (
                              <li key={p}>
                                <Typography variant="body2" color="text.secondary">
                                  {p}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      )}
                      {lp.cons?.length > 0 && (
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={700}>
                            Cons
                          </Typography>
                          <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                            {lp.cons.map((c) => (
                              <li key={c}>
                                <Typography variant="body2" color="text.secondary">
                                  {c}
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      )}
                    </Stack>
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
