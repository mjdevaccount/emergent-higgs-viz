// ── Design tokens & shared styles ─────────────────────────────────
// Single source of truth for colors, typography, spacing.
// All components import from here — never hardcode these values.

// ── Colors ───────────────────────────────────────────────────────
export const colors = {
  // Accents
  cyan:       "#00d4ff",
  gold:       "#ffd700",
  red:        "rgba(255,80,80,1)",
  green:      "#00ff8c",
  purple:     "rgba(136,68,255,1)",
  orange:     "rgba(255,150,50,1)",

  // Backgrounds
  bg:         "#060610",
  bgPanel:    "rgba(8,12,24,0.7)",
  bgGradient: "radial-gradient(ellipse at 50% 20%, #0d1117 0%, #060610 50%, #020208 100%)",

  // Text
  text:       "#e0e8f0",
  textDim:    "rgba(180,200,220,0.5)",
  textFaint:  "rgba(180,200,220,0.3)",
  textCaption:"rgba(180,200,220,0.4)",
  textBody:   "rgba(200,210,220,0.65)",

  // Borders & grid
  border:     "rgba(0,212,255,0.1)",
  borderFaint:"rgba(0,212,255,0.08)",
  grid:       "rgba(0,212,255,0.06)",
};

// Semantic alpha helpers — use with any accent color
export function rgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── Typography ───────────────────────────────────────────────────
export const fonts = {
  serif: "'Cormorant Garamond', Georgia, serif",
  mono:  "'IBM Plex Mono', monospace",
};

// ── Canvas drawing constants ─────────────────────────────────────
export const canvas = {
  // Font strings for canvas ctx.font
  monoSm:    `9px ${fonts.mono}`,
  mono10:    `10px ${fonts.mono}`,
  mono11:    `11px ${fonts.mono}`,
  mono12:    `12px ${fonts.mono}`,
  serifLabel:`italic 10px ${fonts.serif}`,
  serifLabelLg: `italic 11px ${fonts.serif}`,
  serifTitle:`italic 13px ${fonts.serif}`,
};

// ── Shared React style objects ───────────────────────────────────
// Extracted from App.jsx — used by any paper's layout.

export const styles = {
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 3,
    color: rgba(colors.cyan, 0.6),
    textTransform: "uppercase",
    marginBottom: 12,
    textAlign: "center",
  },

  panelBox: {
    background: colors.bgPanel,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: 8,
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
  },

  caption: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 13,
    fontStyle: "italic",
    color: colors.textCaption,
  },

  metricLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },

  metricValue: {
    fontFamily: fonts.serif,
    fontSize: 36,
    fontWeight: 300,
    color: colors.text,
    lineHeight: 1,
  },

  metricSub: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textFaint,
    marginTop: 12,
  },

  // Reusable callout (left-bordered italic text)
  callout: {
    fontFamily: fonts.serif,
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 1.5,
    color: colors.textBody,
    borderLeft: "2px solid",
    paddingLeft: 12,
    transition: "border-color 0.5s ease",
  },

  // Value text used in breakdowns
  valueText: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: 300,
  },

  unitText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textCaption,
  },

  fracText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.textFaint,
    marginTop: 2,
  },
};
