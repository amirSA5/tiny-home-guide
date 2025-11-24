export const projectPlanner = {
  budget: {
    intro: "Estimate core costs and add a buffer. Use local pricing to refine.",
    categories: [
      { id: "trailer_shell", label: "Trailer / shell", checklist: ["Trailer or prefab shell purchase", "Inspection and registration", "Delivery"] },
      { id: "structure", label: "Structure", checklist: ["Framing + sheathing", "Roofing + flashing", "Windows + doors"] },
      { id: "systems", label: "Systems", checklist: ["Electrical rough + panel", "Plumbing rough + fixtures", "HVAC / ventilation", "Insulation"] },
      { id: "interior", label: "Interior", checklist: ["Walls, flooring, finishes", "Cabinetry + storage", "Appliances"] },
      { id: "permit_buffer", label: "Permits + buffer", checklist: ["Permits/fees", "Contingency 10-15%"] },
    ],
  },
  timeline: [
    { phase: "Design", tasks: ["Define layout + zones", "Weight/axle calculations", "Utility strategy (on/off-grid)"], duration: "2-4 weeks" },
    { phase: "Permits/Approvals", tasks: ["Check zoning / parking rules", "Utility hookups or off-grid plan", "Trailer registration/inspection"], duration: "2-6 weeks" },
    { phase: "Build", tasks: ["Structure + envelope", "Rough-in systems", "Insulation", "Interior fit-out"], duration: "8-16 weeks" },
    { phase: "Install/Commission", tasks: ["Hookups / tests", "Safety checks (smoke/CO, egress)", "Weight balance check"], duration: "1-2 weeks" },
  ],
  checklists: [
    {
      id: "before-trailer",
      title: "Before buying a trailer",
      items: [
        "Verify weight rating and axle count match your design.",
        "Check rust, frame integrity, brakes, lights, VIN.",
        "Confirm legal dimensions for towing in your region.",
        "Plan utility runs (underslung tanks vs interior).",
      ],
    },
    {
      id: "before-move-in",
      title: "Before moving in",
      items: [
        "Test smoke/CO alarms and GFCI outlets.",
        "Balance weight; secure all furniture to walls.",
        "Weatherproof checks: seals, flashing, vents.",
        "Confirm gray/black water handling and disposal plan.",
      ],
    },
    {
      id: "first-30-days",
      title: "First 30 days in a tiny home",
      items: [
        "Track condensation; adjust ventilation/dehumidifier.",
        "Dial storage: adjust shelves, hooks, bins based on daily use.",
        "Test off-grid systems (solar, batteries) under real load.",
        "Set a monthly donate/rotate habit to prevent clutter creep.",
      ],
    },
  ],
};
