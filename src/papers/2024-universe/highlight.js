// Highlight term definitions for the 2024 Universe paper.
// Producers: HoverTerm wrappers in section prose
// Consumers: viz components that glow when terms are hovered

export const TERMS = Object.freeze({
  bigBang:   "bigBang",
  vacuum:    "vacuum",
  diffusion: "diffusion",
  sombrero:  "sombrero",
});

export const ALL_TERMS = new Set(Object.values(TERMS));

/** Does the Big Bang reference line glow? */
export function isBigBangHighlighted(highlight) {
  return highlight === TERMS.bigBang;
}

/** Does the vacuum reference line / bar glow? */
export function isVacuumHighlighted(highlight) {
  return highlight === TERMS.vacuum;
}

/** Does the diffusion reference line / bar glow? */
export function isDiffusionHighlighted(highlight) {
  return highlight === TERMS.diffusion;
}

/** Does the sombrero curve glow? */
export function isSombreroHighlighted(highlight) {
  return highlight === TERMS.sombrero;
}

/** Map of which components respond to which terms. */
export const TERM_CONSUMERS = Object.freeze({
  [TERMS.bigBang]:   ["AccelerationPlot", "TensionPlot", "EquationOfStatePlot"],
  [TERMS.vacuum]:    ["TensionPlot", "EquationOfStatePlot", "SpeciesBar"],
  [TERMS.diffusion]: ["EquationOfStatePlot", "SpeciesBar"],
  [TERMS.sombrero]:  ["PlanckPotential"],
});
