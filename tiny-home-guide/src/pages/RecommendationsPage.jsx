// src/pages/RecommendationsPage.jsx
import { useEffect, useMemo, useState } from "react";
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
  TextField,
  Slider,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useSpace } from "../context/SpaceContext.jsx";
import { furnitureItems } from "../data/furnitureItems.js";
import { layoutPatterns } from "../data/layoutPatterns.js";
import { designTips } from "../data/designTips.js";
import { zoneArrangements } from "../data/zoneArrangements.js";
import { minimalismGuides } from "../data/minimalismGuides.js";
import { projectPlanner } from "../data/projectPlanner.js";
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

function matchesSearch(text, query) {
  if (!query) return true;
  return text?.toLowerCase().includes(query.toLowerCase());
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

const allowedTypes = ["tiny_house", "cabin", "van", "studio"];
const allowedOccupants = ["solo", "couple", "family"];
const allowedZones = ["sleep", "work", "dining", "kitchen", "entry", "pet", "storage"];
const allowedMobility = ["mobile", "fixed"];

function sanitizeProfile(profile) {
  if (!profile) return null;
  const toNum = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  };
  const cleanType = allowedTypes.includes(profile.type)
    ? profile.type
    : "tiny_house";
  const cleanOccupants = allowedOccupants.includes(profile.occupants)
    ? profile.occupants
    : "solo";
  const cleanZones =
    Array.isArray(profile.zones) && profile.zones.length > 0
      ? profile.zones.filter((z) => allowedZones.includes(z))
      : [];

  const clean = {
    ...profile,
    length: toNum(profile.length, 0),
    width: toNum(profile.width, 0),
    height: toNum(profile.height, 2.7),
    zones: cleanZones.length > 0 ? cleanZones : ["sleep", "work", "kitchen"],
    mobility: allowedMobility.includes(profile.mobility) ? profile.mobility : "mobile",
    type: cleanType,
    occupants: cleanOccupants,
  };
  return clean;
}

function isProfileValid(profile) {
  if (!profile) return false;
  if (!allowedTypes.includes(profile.type)) return false;
  if (!allowedOccupants.includes(profile.occupants)) return false;
  if (!Array.isArray(profile.zones) || profile.zones.length === 0) return false;
  if (profile.length <= 0 || profile.width <= 0 || profile.height <= 0) return false;
  return true;
}

function RecommendationsPage() {
  const { spaceProfile, toggleFavorite, isFavorite } = useSpace();
  const [recommendations, setRecommendations] = useState({
    layouts: [],
    furniture: [],
    designTips,
    arrangementIdeas: [],
    minimalism: [],
    projectPlanner,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedFallback, setUsedFallback] = useState(false);
  const [zoneFilter, setZoneFilter] = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [areaRange, setAreaRange] = useState(() => {
    const area = spaceProfile ? spaceProfile.length * spaceProfile.width : 12;
    const min = Math.max(5, Math.floor(area - 5));
    const max = Math.ceil(area + 10);
    return [min, max];
  });
  const [zoneMulti, setZoneMulti] = useState([]);
  const zoneOptions = ["sleep", "work", "dining", "kitchen", "entry", "pet", "storage"];
  const styleOptions = useMemo(() => {
    const set = new Set();
    layoutPatterns.forEach((lp) => lp.styleTags?.forEach((t) => set.add(t)));
    furnitureItems.forEach((it) => it.styleTags?.forEach((t) => set.add(t)));
    return ["all", ...Array.from(set)];
  }, []);

  useEffect(() => {
    const area = spaceProfile ? spaceProfile.length * spaceProfile.width : 12;
    const min = Math.max(5, Math.floor(area - 5));
    const max = Math.ceil(area + 10);
    setAreaRange([min, max]);
  }, [spaceProfile]);

  useEffect(() => {
    if (!spaceProfile) return;
    let cancelled = false;

    async function loadRecommendations() {
      setLoading(true);
      setError(null);
      const cleanProfile = sanitizeProfile(spaceProfile);
       if (!isProfileValid(cleanProfile)) {
        setError("Please complete your space profile (length, width, height, type, zones).");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchRecommendations(cleanProfile);
        if (!cancelled) {
          setRecommendations({
            layouts: data.layouts || [],
            furniture: data.furniture || [],
            designTips: data.designTips || designTips,
            arrangementIdeas: data.arrangementIdeas || [],
            minimalism: data.minimalism || minimalismGuides,
            projectPlanner: data.projectPlanner || projectPlanner,
          });
          setUsedFallback(false);
        }
      } catch (err) {
        if (!cancelled) {
          setRecommendations({
            layouts: attachScores(filterLayouts(cleanProfile), cleanProfile),
            furniture: filterFurniture(cleanProfile),
            designTips,
            arrangementIdeas: filterArrangements(cleanProfile),
            minimalism: minimalismGuides,
            projectPlanner,
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
  const minimalism = recommendations.minimalism || [];
  const planner = recommendations.projectPlanner || projectPlanner;
  const readableType = spaceProfile.type.replace("_", " ");
  const profileArea = spaceProfile.length * spaceProfile.width;

  const furnitureFiltered = furniture.filter((item) => {
    if (zoneFilter !== "all" && !(item.zones || []).includes(zoneFilter)) {
      return false;
    }
    if (
      styleFilter !== "all" &&
      !(
        item.style === styleFilter ||
        (item.styleTags || []).includes(styleFilter)
      )
    ) {
      return false;
    }
    if (
      searchQuery &&
      !matchesSearch(
        `${item.name} ${item.description || ""} ${item.spaceSaving || ""}`,
        searchQuery
      )
    ) {
      return false;
    }
    if (
      zoneMulti.length > 0 &&
      !zoneMulti.every((z) => (item.zones || []).includes(z))
    ) {
      return false;
    }
    return true;
  });

  const layoutsFiltered = layouts.filter((lp) => {
    if (
      searchQuery &&
      !matchesSearch(`${lp.title} ${lp.description || ""}`, searchQuery)
    ) {
      return false;
    }
    if (zoneMulti.length > 0) {
      const zones = lp.recommendedFor?.zones || [];
      if (!zoneMulti.every((z) => zones.includes(z))) {
        return false;
      }
    }
    if (
      styleFilter !== "all" &&
      !(lp.styleTags || []).includes(styleFilter)
    ) {
      return false;
    }
    if (areaRange?.length === 2 && lp.minArea) {
      if (lp.minArea < areaRange[0] || lp.minArea > areaRange[1]) return false;
    }
    return true;
  });

  const tipsFiltered = tips.filter((tip) =>
    matchesSearch(`${tip.title} ${tip.bullets?.join(" ")}`, searchQuery)
  );

  const minimalismFiltered = minimalism.filter((guide) =>
    matchesSearch(
      `${guide.title} ${guide.summary || ""} ${guide.steps?.join(" ")} ${
        guide.items?.join(" ") || ""
      }`,
      searchQuery
    )
  );

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

      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Search layouts, furniture, tips"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Zones (multi)</InputLabel>
                <Select
                  multiple
                  label="Zones (multi)"
                  value={zoneMulti}
                  onChange={(e) => setZoneMulti(e.target.value)}
                  renderValue={(selected) => (selected.length ? selected.join(", ") : "Any")}
                >
                  {zoneOptions.map((z) => (
                    <MenuItem key={z} value={z}>
                      <Checkbox checked={zoneMulti.indexOf(z) > -1} />
                      <ListItemText primary={z} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Style tag</InputLabel>
                <Select
                  label="Style tag"
                  value={styleFilter}
                  onChange={(e) => setStyleFilter(e.target.value)}
                >
                  {styleOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s === "all" ? "All styles" : s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Box>
              <Typography variant="body2" gutterBottom>
                Area range filter (m²) — your space ~{Math.round(profileArea)}m²
              </Typography>
              <Slider
                value={areaRange}
                min={5}
                max={50}
                step={1}
                valueLabelDisplay="auto"
                onChange={(_e, val) => setAreaRange(val)}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

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
          Tiny home project planner
        </Typography>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography fontWeight={600} gutterBottom>
              Budget scaffold
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Use these buckets as a starting point; plug in your local costs and add 10–15% buffer.
            </Typography>
            <Stack spacing={1}>
              {planner.budget.categories.map((cat) => (
                <Card key={cat.id} variant="outlined" sx={{ backgroundColor: "grey.50" }}>
                  <CardContent>
                    <Typography fontWeight={600}>{cat.label}</Typography>
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {cat.checklist.map((item) => (
                        <li key={item}>
                          <Typography variant="body2" color="text.secondary">
                            {item}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Typography fontWeight={600} gutterBottom>
              Timeline (typical ranges)
            </Typography>
            <Stack spacing={1}>
              {planner.timeline.map((phase) => (
                <Card key={phase.phase} variant="outlined">
                  <CardContent>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                      <Typography fontWeight={600}>{phase.phase}</Typography>
                      <Chip label={phase.duration} size="small" />
                    </Stack>
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {phase.tasks.map((t) => (
                        <li key={t}>
                          <Typography variant="body2" color="text.secondary">
                            {t}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography fontWeight={600} gutterBottom>
              Checklists
            </Typography>
            <Stack spacing={1.5}>
              {planner.checklists.map((cl) => (
                <Card key={cl.id} variant="outlined">
                  <CardContent>
                    <Typography fontWeight={600}>{cl.title}</Typography>
                    <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                      {cl.items.map((it) => (
                        <li key={it}>
                          <Typography variant="body2" color="text.secondary">
                            {it}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Minimalism & decluttering coach
        </Typography>
        <Stack spacing={2}>
          {minimalism.map((guide) => {
            const fav = isFavorite("tip", guide.id);
            return (
              <Card key={guide.id} variant="outlined">
                <CardContent>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    justifyContent="space-between"
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      {guide.title}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        size="small"
                        label={
                          guide.type === "flow"
                            ? "Step-by-step"
                            : guide.type === "rule"
                            ? "Rule"
                            : guide.type === "challenge"
                            ? "Challenge"
                            : "Checklist"
                        }
                      />
                      <Button
                        size="small"
                        variant={fav ? "contained" : "outlined"}
                        onClick={() => toggleFavorite("tip", guide.id)}
                      >
                        {fav ? "Saved" : "Save"}
                      </Button>
                    </Stack>
                  </Stack>
                  {guide.summary && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {guide.summary}
                    </Typography>
                  )}
                  {guide.steps && (
                    <ol style={{ margin: "8px 0 0 16px", padding: 0 }}>
                      {guide.steps.map((s) => (
                        <li key={s}>
                          <Typography variant="body2" color="text.secondary">
                            {s}
                          </Typography>
                        </li>
                      ))}
                    </ol>
                  )}
                  {guide.items && (
                    <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
                      {guide.items.map((s) => (
                        <li key={s}>
                          <Typography variant="body2" color="text.secondary">
                            {s}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Box>

      <Divider />

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
        {layoutsFiltered.length === 0 ? (
          <Typography color="text.secondary">
            No specific layout patterns matched yet, but you can still explore furniture ideas
            below.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {layoutsFiltered.map((lp, idx) => {
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Filter by zone</InputLabel>
            <Select
              label="Filter by zone"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <MenuItem value="all">All zones</MenuItem>
              <MenuItem value="sleep">Sleep</MenuItem>
              <MenuItem value="work">Work</MenuItem>
              <MenuItem value="dining">Dining</MenuItem>
              <MenuItem value="kitchen">Kitchen</MenuItem>
              <MenuItem value="entry">Entry</MenuItem>
              <MenuItem value="pet">Pet</MenuItem>
              <MenuItem value="storage">Storage</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel>Furniture type</InputLabel>
            <Select
              label="Furniture type"
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
            >
              <MenuItem value="all">All types</MenuItem>
              <MenuItem value="fold_down">Folding</MenuItem>
              <MenuItem value="modular">Modular</MenuItem>
              <MenuItem value="hidden_storage">Hidden storage</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="text"
            onClick={() => {
              setZoneFilter("all");
              setStyleFilter("all");
            }}
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          >
            Reset filters
          </Button>
        </Stack>
        {furniture.length === 0 ? (
          <Typography color="text.secondary">No furniture suggestions yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {furnitureFiltered.map((item) => {
              const fav = isFavorite("furniture", item.id);
              return (
                <Card key={item.id} variant="outlined">
                  <CardContent>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      justifyContent="space-between"
                    >
                      <Typography variant="subtitle1" fontWeight={600}>
                        {item.name}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {item.style && (
                          <Chip
                            label={
                              item.style === "fold_down"
                                ? "Folding"
                                : item.style === "modular"
                                ? "Modular"
                                : item.style === "hidden_storage"
                                ? "Hidden storage"
                                : item.style
                            }
                            size="small"
                          />
                        )}
                        {(item.zones || []).map((z) => (
                          <Chip key={z} label={z} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    </Stack>

                    {item.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {item.description}
                      </Typography>
                    )}
                    {item.spaceSaving && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        How it saves space: {item.spaceSaving}
                      </Typography>
                    )}
                    {item.bestLocation && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Placement: {item.bestLocation}
                      </Typography>
                    )}
                    {item.footprint && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Footprint: {item.footprint.width ? `width ~${item.footprint.width}cm` : ""}
                        {item.footprint.openDepth
                          ? ` · depth in use ~${item.footprint.openDepth}cm`
                          : ""}
                        {item.footprint.foldedDepth
                          ? ` · folded depth ~${item.footprint.foldedDepth}cm`
                          : ""}
                        {item.footprint.height ? ` · height ~${item.footprint.height}cm` : ""}
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
            {furnitureFiltered.length === 0 && (
              <Typography color="text.secondary">
                No matches for these filters. Try resetting them.
              </Typography>
            )}
          </Stack>
        )}
      </Box>

      <Divider />

      <Box>
        <Typography variant="h6" gutterBottom>
          Design tips for tiny homes
        </Typography>
        <Stack spacing={2}>
          {["space_feeling", "safety", "comfort", "organization"].map(
            (cat) => {
              const catTips = tips.filter((t) => t.category === cat);
              if (catTips.length === 0) return null;
              const labelMap = {
                space_feeling: "Space feeling",
                safety: "Safety",
                comfort: "Comfort",
                organization: "Organization",
              };
              return (
                <Box key={cat}>
                  <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                    {labelMap[cat] || cat}
                  </Typography>
                  <Stack spacing={1}>
                    {catTips.map((tip) => {
                      const fav = isFavorite("tip", tip.id);
                      return (
                        <Card key={tip.id} variant="outlined">
                          <CardContent>
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={1}
                              alignItems={{ xs: "flex-start", sm: "center" }}
                              justifyContent="space-between"
                            >
                              <Typography fontWeight={600} gutterBottom>
                                {tip.title}
                              </Typography>
                              <Button
                                size="small"
                                variant={fav ? "contained" : "outlined"}
                                onClick={() => toggleFavorite("tip", tip.id)}
                              >
                                {fav ? "Saved" : "Save tip"}
                              </Button>
                            </Stack>
                            <ul style={{ margin: 0, paddingLeft: 16 }}>
                              {tip.bullets?.map((b) => (
                                <li key={b}>
                                  <Typography variant="body2" color="text.secondary">
                                    {b}
                                  </Typography>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Stack>
                </Box>
              );
            }
          )}
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
