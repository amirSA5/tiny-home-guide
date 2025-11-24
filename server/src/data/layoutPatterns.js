export const layoutPatterns = [
  {
    id: "loft-bed-stairs-desk",
    title: "Loft bed + storage stairs + wall-mounted desk",
    description:
      "Raise the bed to create headroom underneath. Use stairs with drawers for storage and mount a compact desk on the wall.",
    requiredFeatures: ["loft", "storage stairs", "wall-mounted desk"],
    pros: [
      "Frees main floor for living",
      "Stairs double as storage",
      "Great for remote work setups",
    ],
    cons: ["Needs generous ceiling height", "Loft heat can be higher in summer"],
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
    requiredFeatures: ["sofa-bed", "fold-down table", "sturdy wall backing"],
    pros: [
      "Maximizes flexibility in a small footprint",
      "Fast to transition between modes",
      "Great for mobile layouts",
    ],
    cons: ["Daily bed setup required", "Fewer hidden storage options"],
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
    requiredFeatures: ["platform bed", "deep drawers", "ventilated base"],
    pros: [
      "Adds significant hidden storage",
      "Keeps floor clear",
      "Easy to build in fixed cabins/studios",
    ],
    cons: ["Heavier build for mobile homes", "Harder to reconfigure later"],
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
    requiredFeatures: ["bunk or loft + lower bed", "guard rails", "ladder"],
    pros: [
      "Sleeps multiple people",
      "Keeps a small lounge area intact",
      "Works in modest footprints",
    ],
    cons: ["Ladder safety for kids", "Limited standing height near bunks"],
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
    requiredFeatures: ["galley kitchen", "shared wet wall", "compact wet bath"],
    pros: [
      "Simplifies plumbing runs",
      "Great for mobile builds",
      "Keeps floor open for circulation",
    ],
    cons: ["Limited counter depth near wet bath", "Can feel tight without windows"],
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
    requiredFeatures: ["loft", "compact stairs or ladder", "skylight preferred"],
    pros: [
      "Preserves main floor for daytime use",
      "Works well with tall windows",
      "Keeps circulation clear",
    ],
    cons: ["Requires tall ceiling", "Ladder can dominate entry if not tucked"],
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
    requiredFeatures: ["U-shaped kitchen", "pocket door", "ventilation"],
    pros: [
      "Max counter space in small area",
      "Pocket door saves swing clearance",
      "Great for cooks",
    ],
    cons: ["Best in fixed builds (heavier)", "Less open sightline"],
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
    requiredFeatures: ["loft", "desk under loft", "sliding panel"],
    pros: [
      "Creates visual separation for work",
      "Maximizes vertical volume",
      "Great for remote workers",
    ],
    cons: ["Loft heat and headroom considerations", "Panel adds weight in mobile builds"],
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
