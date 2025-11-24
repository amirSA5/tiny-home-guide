import { designTips } from "../data/designTips.js";
import { furnitureItems } from "../data/furnitureItems.js";
import { layoutPatterns } from "../data/layoutPatterns.js";

function filterLayouts(profile) {
  const area = profile.length * profile.width;

  return layoutPatterns.filter((pattern) => {
    if (pattern.minArea && pattern.minArea > area) return false;

    if (
      pattern.recommendedFor?.type &&
      !pattern.recommendedFor.type.includes(profile.type)
    ) {
      return false;
    }

    if (
      pattern.recommendedFor?.occupants &&
      !pattern.recommendedFor.occupants.includes(profile.occupants)
    ) {
      return false;
    }

    if (pattern.recommendedFor?.zones) {
      const hasCommonZone = pattern.recommendedFor.zones.some((zone) =>
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

export function buildRecommendations(profile) {
  const area = profile.length * profile.width;
  const layouts = filterLayouts(profile);
  const furniture = filterFurniture(profile);

  return {
    profile,
    area,
    stats: {
      layoutCount: layouts.length,
      furnitureCount: furniture.length,
      designTipsCount: designTips.length,
    },
    layouts,
    furniture,
    designTips,
  };
}
