// ── Paper registry ───────────────────────────────────────────────
// Central list of all papers. main.jsx uses this to render the
// timeline and route to the correct paper component.
//
// To add a paper: import its meta.js here and add to the array.
// Papers are displayed in chronological order.

import higgs2026 from "./2026-higgs/meta.js";
import symmetry2024 from "./2024-symmetry/meta.js";
import universe2024 from "./2024-universe/meta.js";

const papers = [
  {
    ...symmetry2024,
    load: () => import("./2024-symmetry/index.jsx"),
    color: "#00ff8c",
    tagline: "Spacetime carries a fundamental uncertainty at Planck scale.",
  },
  {
    ...universe2024,
    load: () => import("./2024-universe/index.jsx"),
    color: "#00d4ff",
    tagline: "An asymptotically static universe, with a Big Bang in between.",
  },
  {
    ...higgs2026,
    load: () => import("./2026-higgs/index.jsx"),
    loadJourney: () => import("./2026-higgs/journey/JourneyShell.jsx"),
    color: "#ffd700",
    tagline: "Mass is born inside the black hole.",
  },
  // {
  //   id: "2023-hubble",
  //   year: 2023,
  //   shortTitle: "Hubble Tension",
  //   ...hubble2023,
  //   load: () => import("./2023-hubble/index.jsx"),
  //   color: "#ff6b6b",
  //   tagline: "Dark energy is the diffusive nature of spacetime.",
  // },
];

export default papers;
