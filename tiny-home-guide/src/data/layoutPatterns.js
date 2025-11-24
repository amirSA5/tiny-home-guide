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
      minHeight: 2.9,
    },
    minArea: 12, // m^2
    requiresLoft: true,
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
  {
    id: "galley-kitchen-mobile",
    title: "Galley kitchen + wet bath core",
    description:
      "Keep plumbing on one wall with a galley kitchen and compact wet bath across; ideal for mobile tiny homes.",
    recommendedFor: {
      type: ["tiny_house", "van"],
      zones: ["kitchen", "dining", "work"],
      occupants: ["solo", "couple"],
      mobility: ["mobile"],
    },
    minArea: 9,
  },
  {
    id: "loft-over-entry",
    title: "Loft above entry with lounge below",
    description:
      "Place the loft bed above the entry or bath volume to free the main area for seating and dining.",
    recommendedFor: {
      type: ["tiny_house", "cabin", "studio"],
      zones: ["sleep", "dining", "storage"],
      occupants: ["solo", "couple"],
      minHeight: 3,
      mobility: ["mobile", "fixed"],
    },
    minArea: 10,
    requiresLoft: true,
  },
  {
    id: "u-kitchen-fixed",
    title: "U-shaped kitchen + pocket door",
    description:
      "For fixed cabins and studios, use a compact U-kitchen with a pocket door to the bath; keep dining/work opposite.",
    recommendedFor: {
      type: ["cabin", "studio"],
      zones: ["kitchen", "dining", "work"],
      occupants: ["couple", "family"],
      mobility: ["fixed"],
      minHeight: 2.5,
    },
    minArea: 14,
  },
  {
    id: "loft-over-desk-split",
    title: "Loft bed over workspace + sliding partition",
    description:
      "Use a loft bed over a desk and add a light sliding panel to separate work from sleep without losing light.",
    recommendedFor: {
      type: ["tiny_house", "cabin", "studio"],
      zones: ["sleep", "work"],
      occupants: ["solo", "couple"],
      minHeight: 3,
    },
    requiresLoft: true,
    minArea: 9,
  },
];
