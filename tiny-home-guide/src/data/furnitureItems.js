// src/data/furnitureItems.js
export const furnitureItems = [
  {
    id: "wall-mounted-desk",
    name: "Wall-mounted folding desk",
    category: "desk",
    style: "fold_down",
    bestLocation: "Along a free wall or under a window.",
    zones: ["work"],
    footprint: {
      foldedDepth: 10,
      openDepth: 60,
      width: 90,
    },
  },
  {
    id: "fold-down-table",
    name: "Fold-down dining / work table",
    category: "table",
    style: "fold_down",
    bestLocation: "Kitchen or living area wall.",
    zones: ["dining", "work"],
    footprint: {
      foldedDepth: 8,
      openDepth: 70,
      width: 100,
    },
  },
  {
    id: "storage-ottoman",
    name: "Storage ottoman / bench",
    category: "seating",
    style: "storage_inside",
    bestLocation: "Next to sofa or at foot of bed.",
    zones: ["dining", "storage"],
    footprint: {
      openDepth: 40,
      width: 90,
    },
  },
  {
    id: "stairs-with-drawers",
    name: "Stairs with built-in drawers",
    category: "storage",
    style: "modular",
    bestLocation: "Accessing a loft bed or mezzanine.",
    zones: ["sleep", "storage"],
    footprint: {
      openDepth: 90,
      width: 60,
    },
  },
  {
    id: "pet-corner-unit",
    name: "Compact pet corner unit",
    category: "storage",
    style: "modular",
    bestLocation: "In a corner near the entrance or window.",
    zones: ["pet"],
    footprint: {
      openDepth: 50,
      width: 50,
    },
  },
];
