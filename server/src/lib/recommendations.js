import { designTips } from "../data/designTips.js";
import { furnitureItems } from "../data/furnitureItems.js";
import { layoutPatterns } from "../data/layoutPatterns.js";
import { zoneArrangements } from "../data/zoneArrangements.js";
import { minimalismGuides } from "../data/minimalismGuides.js";
import { projectPlanner } from "../data/projectPlanner.js";

function matchesMobility(allowed, profileMobility) {
  if (!allowed || allowed.length === 0) return true;
  if (!profileMobility) return true;
  return allowed.includes(profileMobility);
}

function meetsHeight(minHeight, profileHeight) {
  if (!minHeight) return true;
  if (!profileHeight) return true;
  return profileHeight >= minHeight;
}

function computeLayoutScore(pattern, profile) {
  const area = profile.length * profile.width;
  const rec = pattern.recommendedFor || {};
  const profileHeight = profile.height;
  const profileMobility = profile.mobility;

  let score = 0;

  // Zone coverage (max 40)
  if (rec.zones && rec.zones.length > 0) {
    const matched = rec.zones.filter((z) => profile.zones.includes(z)).length;
    const coverage = matched / rec.zones.length;
    score += Math.round(coverage * 40);
  } else {
    score += 10;
  }

  // Area closeness (max 20)
  if (pattern.minArea) {
    const diff = Math.abs(area - pattern.minArea);
    const areaScore = Math.max(0, 20 - Math.min(diff, 20));
    score += areaScore;
  } else {
    score += 10;
  }

  // Type / occupants / mobility (max 30)
  if (rec.type?.includes(profile.type)) score += 10;
  if (rec.occupants?.includes(profile.occupants)) score += 10;
  if (matchesMobility(rec.mobility, profileMobility)) score += 10;

  // Height / loft fit (max 10)
  if (meetsHeight(rec.minHeight, profileHeight)) score += 5;
  if (!pattern.requiresLoft || profile.loft) score += 5;

  return score;
}

function attachScores(patterns, profile) {
  return patterns
    .map((p) => ({
      ...p,
      matchScore: computeLayoutScore(p, profile),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}

function filterLayouts(profile) {
  const area = profile.length * profile.width;
  const profileHeight = profile.height;
  const profileMobility = profile.mobility;

  return layoutPatterns.filter((pattern) => {
    const rec = pattern.recommendedFor || {};

    if (pattern.minArea && pattern.minArea > area) return false;
    if (rec.minHeight && !meetsHeight(rec.minHeight, profileHeight)) return false;
    if (pattern.requiresLoft && !profile.loft) return false;

    if (rec.type && !rec.type.includes(profile.type)) {
      return false;
    }

    if (rec.occupants && !rec.occupants.includes(profile.occupants)) {
      return false;
    }

    if (rec.mobility && !matchesMobility(rec.mobility, profileMobility)) {
      return false;
    }

    if (rec.zones) {
      const hasCommonZone = rec.zones.some((zone) =>
        profile.zones.includes(zone)
      );
      if (!hasCommonZone) return false;
    }

    return true;
  });
}

function filterFurniture(profile) {
  return furnitureItems.filter((item) => {
    if (!item.zones || item.zones.length === 0) return true;
    return item.zones.some((zone) => profile.zones.includes(zone));
  });
}

function filterZoneArrangements(profile) {
  const profileHeight = profile.height;
  const profileMobility = profile.mobility;

  return zoneArrangements.filter((arr) => {
    const criteria = arr.criteria || {};

    if (criteria.requiresLoft && !profile.loft) return false;
    if (criteria.minHeight && !meetsHeight(criteria.minHeight, profileHeight)) {
      return false;
    }
    if (criteria.mobility && !matchesMobility(criteria.mobility, profileMobility)) {
      return false;
    }
    if (criteria.zones) {
      const hasCommon = criteria.zones.some((zone) =>
        profile.zones.includes(zone)
      );
      if (!hasCommon) return false;
    }
    return true;
  });
}

export function buildRecommendations(profile) {
  const area = profile.length * profile.width;
  const layouts = attachScores(filterLayouts(profile), profile);
  const furniture = filterFurniture(profile);
  const arrangements = filterZoneArrangements(profile);

  return {
    profile,
    area,
    stats: {
      layoutCount: layouts.length,
      furnitureCount: furniture.length,
      designTipsCount: designTips.length,
      arrangementIdeasCount: arrangements.length,
      minimalismCount: minimalismGuides.length,
      plannerSections: 3,
    },
    layouts,
    furniture,
    designTips,
    arrangementIdeas: arrangements,
    minimalism: minimalismGuides,
    projectPlanner,
  };
}
