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

  // ── Paper prose section styles ─────────────────────────────────
  // Used by all paper/ section components (Framework, BlackHole, etc.)

  section: { maxWidth: 740, margin: "0 auto", padding: "24px 32px" },

  heading: { fontSize: 22, fontWeight: 400, marginBottom: 16, color: colors.text },

  prose: {
    fontSize: 16, fontWeight: 300, lineHeight: 1.8,
    color: "rgba(200,210,220,0.75)", margin: "16px 0",
  },

  figureBox: {
    background: "rgba(8,12,24,0.5)",
    border: `1px solid ${colors.borderFaint}`,
    borderRadius: 8, padding: "16px 8px", margin: "24px 0",
    display: "flex", flexDirection: "column", alignItems: "center",
  },

  figureCaption: {
    fontSize: 13, fontStyle: "italic", color: colors.textDim,
    textAlign: "center", marginTop: 12, lineHeight: 1.6, maxWidth: 500,
  },

  sliderLabel: {
    display: "flex", justifyContent: "space-between",
    fontFamily: fonts.mono, fontSize: 10, color: colors.textCaption,
  },

  link: { color: colors.cyan, textDecoration: "none" },

  // Table styles for paper sections
  table: { width: "100%", borderCollapse: "collapse", margin: "20px 0" },

  th: {
    fontFamily: fonts.mono, fontSize: 11,
    color: rgba(colors.cyan, 0.5), textAlign: "center",
    padding: "10px 8px", borderBottom: `1px solid ${rgba(colors.cyan, 0.15)}`,
  },

  td: {
    fontSize: 13, textAlign: "center", padding: "10px 8px",
    borderBottom: `1px solid ${rgba(colors.cyan, 0.05)}`,
    color: "rgba(200,210,220,0.7)",
  },

  // Equation block
  eqNum: {
    fontFamily: fonts.mono, fontSize: 13,
    color: colors.textCaption, flexShrink: 0,
  },

  // Badge styles (Header)
  badge: {
    display: "inline-flex", fontSize: 11,
    fontFamily: fonts.mono, textDecoration: "none",
    borderRadius: 3, overflow: "hidden",
  },

  badgeLeft: {
    padding: "3px 6px",
    background: "rgba(180,200,220,0.1)",
    color: "rgba(180,200,220,0.6)",
  },

  // Floating pill button (PageToggle, SoundScape)
  pillButton: (active) => ({
    fontFamily: fonts.mono,
    fontSize: 10, letterSpacing: 1,
    padding: "6px 12px",
    border: `1px solid ${rgba(colors.cyan, 0.2)}`,
    borderRadius: 12, cursor: "pointer",
    backdropFilter: "blur(8px)",
    background: active ? rgba(colors.cyan, 0.1) : "rgba(6,6,16,0.7)",
    color: active ? colors.cyan : colors.textFaint,
  }),
};
