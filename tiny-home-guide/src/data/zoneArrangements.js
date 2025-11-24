export const zoneArrangements = [
  {
    id: "loft-over-desk",
    title: "Loft bed above workspace",
    detail:
      "Place a lofted bed above a desk to give the main floor to living and dining. Keep 1.9m clearance below and add a task light on the underside.",
    criteria: {
      zones: ["sleep", "work"],
      requiresLoft: true,
      minHeight: 2.8,
    },
  },
  {
    id: "galley-kitchen-wet-wall",
    title: "Galley kitchen along a wet wall",
    detail:
      "Align sink, cooktop, and bath on one side to consolidate plumbing. Opposite wall can host fold-down dining or a sofa-bed.",
    criteria: {
      zones: ["kitchen", "dining"],
      mobility: ["mobile", "fixed"],
    },
  },
  {
    id: "pet-nook-under-stairs",
    title: "Pet nook under stairs",
    detail:
      "Use the void under loft stairs for a pet bed and storage cubbies; add a sliding gate if you need to contain the space.",
    criteria: {
      zones: ["pet", "storage"],
      requiresLoft: true,
    },
  },
  {
    id: "split-sleep-lounge",
    title: "Split sleep and lounge with a sliding partition",
    detail:
      "Use a light sliding panel between bed and lounge to block clutter without closing off light. Works well in fixed cabins/studios.",
    criteria: {
      zones: ["sleep", "dining"],
      mobility: ["fixed"],
    },
  },
  {
    id: "loft-over-kitchen",
    title: "Loft above kitchen block",
    detail:
      "Stack the loft over the galley kitchen and bath volume to leave the rest of the floor open. Add a skylight for headroom.",
    criteria: {
      zones: ["sleep", "kitchen"],
      requiresLoft: true,
      minHeight: 2.9,
    },
  },
];
