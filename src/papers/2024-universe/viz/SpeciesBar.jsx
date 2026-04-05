import { colors, rgba, fonts, styles } from "@/theme.js";
import { speciesFractions } from "../physics.js";

// Animated stacked bar showing vacuum / diffusion / matter fractions vs X.
export default function SpeciesBar({ param }) {
  const { vacuum, diffusion, matter } = speciesFractions(param);

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      {/* Stacked bar */}
      <div style={barOuter}>
        <div style={{ ...barFill, width: `${vacuum * 100}%`, background: cyanGrad }} />
        <div style={{ ...barFill, width: `${diffusion * 100}%`, background: goldGrad }} />
        <div style={{ ...barFill, width: `${matter * 100}%`, background: dimGrad }} />
      </div>

      {/* Labels */}
      <div style={labelRow}>
        <div>
          <span style={{ ...label, color: colors.cyan }}>{"\u25CF"} Vacuum</span>
          <span style={pct}>{(vacuum * 100).toFixed(1)}%</span>
        </div>
        <div>
          <span style={{ ...label, color: colors.gold }}>{"\u25CF"} Diffusion</span>
          <span style={pct}>{(diffusion * 100).toFixed(1)}%</span>
        </div>
        <div>
          <span style={{ ...label, color: colors.textDim }}>{"\u25CF"} Matter</span>
          <span style={pct}>{(matter * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Regime label */}
      <div style={regime}>
        {vacuum > 0.8 ? "VACUUM DOMINATED \u2014 far future"
          : diffusion > 0.8 ? "DIFFUSION DOMINATED \u2014 far past"
          : "MIXED ERA"}
      </div>
    </div>
  );
}

const barOuter = {
  display: "flex",
  width: "100%",
  height: 24,
  background: rgba(colors.cyan, 0.06),
  borderRadius: 4,
  overflow: "hidden",
  border: `1px solid ${colors.border}`,
};

const barFill = {
  height: "100%",
  transition: "width 0.2s ease",
};

const cyanGrad = `linear-gradient(90deg, #006688, ${colors.cyan})`;
const goldGrad = `linear-gradient(90deg, #886600, ${colors.gold})`;
const dimGrad = `linear-gradient(90deg, rgba(180,200,220,0.15), rgba(180,200,220,0.25))`;

const labelRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 8,
};

const label = {
  fontFamily: fonts.mono,
  fontSize: 10,
  letterSpacing: 1,
  marginRight: 6,
};

const pct = {
  fontFamily: fonts.mono,
  fontSize: 10,
  color: colors.textCaption,
};

const regime = {
  fontFamily: fonts.mono,
  fontSize: 9,
  letterSpacing: 2,
  color: colors.textFaint,
  textAlign: "center",
  marginTop: 12,
  textTransform: "uppercase",
};
