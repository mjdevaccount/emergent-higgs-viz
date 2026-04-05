import { VEV, vevBreakdown } from "../physics.js";
import { colors, fonts } from "../theme.js";

// Thin horizontal bar: cyan (vacuum) left, gold (Higgs) right.
// Tips past 50% inside the horizon. Dead simple.
export default function VevBar({ radialPos }) {
  const { v, h } = vevBreakdown(radialPos);
  const vPct = (v / VEV) * 100;

  return (
    <div style={container}>
      <span style={{ ...endLabel, color: colors.cyan }}>vacuum field</span>
      <div style={barOuter}>
        <div style={{ ...barFill, width: `${vPct}%`, background: cyanGrad }} />
        <div style={{ ...barFill, width: `${100 - vPct}%`, background: goldGrad }} />
      </div>
      <span style={{ ...endLabel, color: colors.gold, textAlign: "right" }}>Higgs field</span>
    </div>
  );
}

const container = {
  position: "fixed",
  bottom: 16,
  left: "50%",
  transform: "translateX(-50%)",
  width: "min(400px, 60vw)",
  display: "flex",
  alignItems: "center",
  gap: 8,
  zIndex: 900,
};

const endLabel = {
  fontFamily: fonts.mono,
  fontSize: 8,
  letterSpacing: 1,
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  minWidth: 70,
};

const barOuter = {
  flex: 1,
  height: 4,
  display: "flex",
  borderRadius: 2,
  overflow: "hidden",
  background: "rgba(180,200,220,0.06)",
};

const barFill = {
  height: "100%",
  transition: "width 0.3s ease",
};

const cyanGrad = `linear-gradient(90deg, #006688, ${colors.cyan})`;
const goldGrad = `linear-gradient(90deg, ${colors.gold}, #886600)`;
