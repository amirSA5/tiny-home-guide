// src/data/furnitureItems.js
export const furnitureItems = [
  {
    id: "wall-mounted-desk",
    name: "Wall-mounted folding desk",
    category: "desk",
    style: "fold_down",
    zones: ["work"],
    description:
      "Shallow wall-mounted desk that folds away to reclaim circulation space.",
    spaceSaving:
      "Folds flat when not in use, opening floor area for circulation or workouts.",
    bestLocation: "Along a free wall or under a window with good light.",
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
    zones: ["dining", "work"],
    description:
      "Wall-hinged table for two that can double as a laptop station.",
    spaceSaving: "Pivots down to a slim panel so the wall stays clear.",
    bestLocation: "Kitchen or living area wall with elbow room on both sides.",
    footprint: {
      foldedDepth: 8,
      openDepth: 70,
      width: 100,
    },
  },
  {
    id: "murphy-bed-horizontal",
    name: "Murphy bed (horizontal)",
    category: "sleep",
    style: "fold_down",
    zones: ["sleep", "work", "dining"],
    description:
      "Horizontal wall bed that opens sideways—better for low ceilings and narrow rooms.",
    spaceSaving:
      "Frees up the main floor for daytime activities and combines with a desk or sofa front.",
    bestLocation:
      "Main living wall; avoid blocking windows. Works well opposite a sofa.",
    footprint: {
      foldedDepth: 40,
      openDepth: 210,
      width: 190,
    },
  },
  {
    id: "storage-ottoman",
    name: "Storage ottoman / bench",
    category: "seating",
    style: "hidden_storage",
    zones: ["dining", "storage", "entry"],
    description:
      "Padded bench with a lift-up lid for linens, shoes, or pet gear.",
    spaceSaving: "Doubles as seating and storage; stacks in a hallway or under a window.",
    bestLocation: "Next to sofa, at bed foot, or in the entry.",
    footprint: {
      openDepth: 40,
      width: 90,
    },
  },
  {
    id: "stairs-with-drawers",
    name: "Stairs with built-in drawers",
    category: "storage",
    style: "hidden_storage",
    zones: ["sleep", "storage"],
    description:
      "Loft access with drawers in each tread and a pull-out closet on the side.",
    spaceSaving:
      "Turns vertical circulation into a dresser so you skip a separate wardrobe.",
    bestLocation: "Next to loft bed or mezzanine; leave 80–90cm clearance in front.",
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
    zones: ["pet", "entry"],
    description:
      "L-shaped pet nook with cubbies for food, toys, and leashes plus a cozy bed.",
    spaceSaving:
      "Consolidates pet storage into one vertical corner instead of multiple bins.",
    bestLocation: "Corner near entry or window; avoid blocking main walkway.",
    footprint: {
      openDepth: 50,
      width: 50,
    },
  },
  {
    id: "modular-shelves-grid",
    name: "Modular cube shelves",
    category: "storage",
    style: "modular",
    zones: ["work", "dining", "storage", "entry"],
    description:
      "Stackable cube shelving that can reconfigure as a room divider or media wall.",
    spaceSaving: "Adapts to different wall lengths and doubles as a light divider.",
    bestLocation: "Longest wall; anchor heavier cubes low and near corners.",
    footprint: {
      openDepth: 35,
      width: 120,
      height: 180,
    },
  },
  {
    id: "storage-bench-entry",
    name: "Entry storage bench",
    category: "seating",
    style: "hidden_storage",
    zones: ["entry", "storage"],
    description:
      "Slim bench with flip-top storage for shoes, umbrellas, and daily grab-and-go items.",
    spaceSaving: "Combines seating for shoe changes with concealed entry storage.",
    bestLocation: "Immediately inside the door; leave 90cm in front for clearance.",
    footprint: {
      openDepth: 38,
      width: 95,
    },
  },
];
