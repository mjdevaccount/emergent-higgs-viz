// Shared highlight term definitions and matching logic.
// Producers (Eq.jsx scanner) emit these terms.
// Consumers (DualPotential, VevBreakdown) match against them.
// Tests verify both sides agree.

/** Every highlight term the system knows about. */
export const TERMS = Object.freeze({
  r0: "r0",
  rh: "rh",
  ra: "ra",
  lambda5: "lambda5",
});

/** All valid term values as a Set, for contract validation. */
export const ALL_TERMS = new Set(Object.values(TERMS));

/**
 * DualPotential: does this radius line glow for the given highlight?
 * Each radius has an hlKey matching a TERMS value.
 */
export function isRadiusHighlighted(highlight, hlKey) {
  return highlight === hlKey;
}

/**
 * VevBreakdown: does the component glow for the given highlight?
 */
export function isVevGlowing(highlight) {
  return highlight === TERMS.lambda5 || highlight === TERMS.r0;
}

/**
 * Map of which components respond to which terms.
 * Used by contract tests to ensure no term is orphaned.
 */
export const TERM_CONSUMERS = Object.freeze({
  [TERMS.r0]: ["DualPotential", "VevBreakdown"],
  [TERMS.rh]: ["DualPotential"],
  [TERMS.ra]: ["DualPotential"],
  [TERMS.lambda5]: ["VevBreakdown"],
});
