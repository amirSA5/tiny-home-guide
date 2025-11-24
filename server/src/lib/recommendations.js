import { designTips } from "../data/designTips.js";
import { furnitureItems } from "../data/furnitureItems.js";
import { layoutPatterns } from "../data/layoutPatterns.js";
import { zoneArrangements } from "../data/zoneArrangements.js";

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
  const layouts = filterLayouts(profile);
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
    },
    layouts,
    furniture,
    designTips,
    arrangementIdeas: arrangements,
  };
}
