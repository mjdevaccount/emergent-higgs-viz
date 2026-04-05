import { couplingGround, R_T, R_0, R_A } from "../physics.js";
import { colors, rgba, styles } from "../theme.js";

export default function LambdaGauge({ radialPos }) {
  const f = couplingGround(radialPos);
  const insideWell = radialPos < R_T;
  const atAccretion = Math.abs(radialPos - R_A) < 0.3;
  const isMinimum = insideWell || atAccretion;
  const accentColor = isMinimum ? colors.gold : colors.cyan;

  return (
    <div style={{ textAlign: "center", padding: "0 16px" }}>
      <div style={styles.metricLabel}>Quartic Coupling f(r)</div>
      <div
        style={{
          ...styles.metricValue,
          color: accentColor,
          transition: "color 0.5s ease",
        }}
      >
        {!isNaN(f) ? f.toFixed(3) : "\u2014"}
        <span style={{ fontSize: 16, marginLeft: 4, color: colors.textDim }}>\u00d7 \u03bb</span>
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 200,
          height: 3,
          background: rgba(colors.cyan, 0.1),
          borderRadius: 2,
          margin: "12px auto 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(f, 3) / 3 * 100}%`,
            height: "100%",
            background: isMinimum
              ? `linear-gradient(90deg, ${colors.gold}, #ffaa00)`
              : `linear-gradient(90deg, ${colors.cyan}, #0088ff)`,
            borderRadius: 2,
            transition: "width 0.3s ease, background 0.5s ease",
          }}
        />
      </div>
      <div
        style={{
          ...styles.metricSub,
          color: isMinimum ? rgba(colors.gold, 0.7) : colors.textFaint,
          marginTop: 6,
          transition: "color 0.5s ease",
          height: 14,
        }}
      >
        {insideWell ? "INSIDE SCHWARZSCHILD \u2014 \u03bb/5 REGIME"
          : atAccretion ? "ACCRETION DISK \u2014 \u03bb/5 REGIME"
          : radialPos > R_0 ? "SM EXTERIOR" : ""}
      </div>
    </div>
  );
}
