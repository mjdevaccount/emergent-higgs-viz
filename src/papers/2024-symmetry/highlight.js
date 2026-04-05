// Highlight term definitions for the 2024 Symmetry paper.
// Producers: HoverTerm wrappers in section prose
// Consumers: viz components that glow when terms are hovered

export const TERMS = Object.freeze({
  flatVelocity: "flatVelocity",
  darkMatter:   "darkMatter",
  mlSpacetime:  "mlSpacetime",
  randomWalk:   "randomWalk",
});

export const ALL_TERMS = new Set(Object.values(TERMS));

export function isFlatVelocityHighlighted(highlight) {
  return highlight === TERMS.flatVelocity;
}

export function isDarkMatterHighlighted(highlight) {
  return highlight === TERMS.darkMatter;
}

export function isMLSpacetimeHighlighted(highlight) {
  return highlight === TERMS.mlSpacetime;
}

export function isRandomWalkHighlighted(highlight) {
  return highlight === TERMS.randomWalk;
}

export const TERM_CONSUMERS = Object.freeze({
  [TERMS.flatVelocity]: ["RotationCurvePlot", "VelocityMassPlot"],
  [TERMS.darkMatter]:   ["RotationCurvePlot"],
  [TERMS.mlSpacetime]:  ["PhaseSpaceSim"],
  [TERMS.randomWalk]:   ["PhaseSpaceSim"],
});
