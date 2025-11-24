// src/data/layoutPatterns.js
export const layoutPatterns = [
  {
    id: "loft-bed-stairs-desk",
    title: "Loft bed + storage stairs + wall-mounted desk",
    description:
      "Raise the bed to create headroom underneath. Use stairs with drawers for storage and mount a compact desk on the wall.",
    recommendedFor: {
      type: ["tiny_house", "cabin", "studio"],
      zones: ["sleep", "work", "storage"],
      occupants: ["solo", "couple"],
    },
    minArea: 12, // m²
  },
  {
    id: "sofa-bed-fold-table",
    title: "Sofa-bed + fold-down dining table",
    description:
      "Use a quality sofa-bed as main seating and sleeping, with a fold-down table that only opens for meals or work.",
    recommendedFor: {
      type: ["tiny_house", "studio", "van", "cabin"],
      zones: ["sleep", "dining", "work"],
      occupants: ["solo", "couple"],
    },
    minArea: 8,
  },
  {
    id: "raised-platform-storage",
    title: "Raised platform bed with drawers",
    description:
      "Build a raised platform with pull-out drawers underneath for clothes, bedding and seasonal items.",
    recommendedFor: {
      type: ["tiny_house", "cabin", "studio"],
      zones: ["sleep", "storage"],
      occupants: ["solo", "couple", "family"],
    },
    minArea: 10,
  },
  {
    id: "bunk-bed-family-corner",
    title: "Compact bunk bed + family corner",
    description:
      "Use bunk beds or a loft + lower bed combo to sleep multiple people while keeping a small shared sitting area.",
    recommendedFor: {
      type: ["tiny_house", "cabin"],
      zones: ["sleep", "dining", "storage"],
      occupants: ["family"],
    },
    minArea: 13,
  },
];
