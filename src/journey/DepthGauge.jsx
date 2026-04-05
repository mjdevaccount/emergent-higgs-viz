import { R_H, R_T, R_0, R_A, R_MIN } from "../physics.js";
import { colors, rgba, fonts } from "../theme.js";

const TICKS = [
  { r: 4.0, label: "the cosmos", color: colors.textFaint },
  { r: R_A, label: "accretion disk", color: rgba(colors.gold, 0.5) },
  { r: R_0, label: "event horizon", color: "rgba(255,80,80,0.6)" },
  { r: R_T, label: "symmetry breaks", color: rgba(colors.green, 0.5) },
  { r: R_H, label: "the core", color: rgba(colors.gold, 0.7) },
];

const R_TOP = 4.0;
const R_BOT = R_MIN + 0.01;

export default function DepthGauge({ radialPos }) {
  const pct = (r) => ((R_TOP - r) / (R_TOP - R_BOT)) * 100;
  const dotPct = pct(radialPos);

  return (
    <div style={container}>
      {/* Track */}
      <div style={track} />

      {/* Ticks */}
      {TICKS.map(({ r, label, color }) => (
        <div key={label} style={{ ...tick, top: `${pct(r)}%` }}>
          <div style={{ ...tickLine, background: color }} />
          <div style={{ ...tickLabel, color }}>{label}</div>
        </div>
      ))}

      {/* Glowing dot */}
      <div
        style={{
          position: "absolute",
          right: -4,
          top: `calc(${dotPct}% - 5px)`,
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: radialPos <= R_0 ? colors.gold : colors.cyan,
          boxShadow: `0 0 12px ${radialPos <= R_0 ? rgba(colors.gold, 0.6) : rgba(colors.cyan, 0.6)}`,
          transition: "top 0.1s ease, background 0.3s ease",
        }}
      />
    </div>
  );
}

const container = {
  position: "fixed",
  right: 24,
  top: "10%",
  height: "80%",
  width: 2,
  zIndex: 900,
};

const track = {
  position: "absolute",
  left: 0,
  top: 0,
  width: 2,
  height: "100%",
  background: "rgba(180,200,220,0.08)",
  borderRadius: 1,
};

const tick = {
  position: "absolute",
  right: 0,
  display: "flex",
  flexDirection: "row-reverse",
  alignItems: "center",
};

const tickLine = {
  width: 12,
  height: 1,
  marginRight: -5,
};

const tickLabel = {
  fontFamily: fonts.mono,
  fontSize: 9,
  letterSpacing: 1,
  marginRight: 10,
  whiteSpace: "nowrap",
  textTransform: "uppercase",
  textAlign: "right",
};
