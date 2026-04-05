// Highlight term definitions for the 2023 Hubble paper.
// Producers: HoverTerm wrappers in section prose
// Consumers: viz components that glow when terms are hovered

export const TERMS = Object.freeze({
  hubbleTension: "hubbleTension",
  diffusionParam: "diffusionParam",
  darkEnergy: "darkEnergy",
});

export const ALL_TERMS = new Set(Object.values(TERMS));

/** Does the Hubble tension highlight glow? */
export function isHubbleTensionHighlighted(highlight) {
  return highlight === TERMS.hubbleTension;
}

/** Does the diffusion parameter highlight glow? */
export function isDiffusionParamHighlighted(highlight) {
  return highlight === TERMS.diffusionParam;
}

/** Does the dark energy highlight glow? */
export function isDarkEnergyHighlighted(highlight) {
  return highlight === TERMS.darkEnergy;
}

/** Map of which components respond to which terms. */
export const TERM_CONSUMERS = Object.freeze({
  [TERMS.hubbleTension]: ["LuminosityPlot"],
  [TERMS.diffusionParam]: ["DiffusionPlot"],
  [TERMS.darkEnergy]: ["EosPlot"],
});
