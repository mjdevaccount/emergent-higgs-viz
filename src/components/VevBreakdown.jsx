import { VEV, vevBreakdown } from "../physics.js";
import { isVevGlowing } from "../paper/highlight.js";
import { colors, rgba, styles } from "../theme.js";

export default function VevBreakdown({ radialPos, highlight }) {
  const { v, h, f } = vevBreakdown(radialPos);
  const vFrac = (v * v) / (VEV * VEV);
  const hFrac = (h * h) / (VEV * VEV);
  const isHiggsDominant = hFrac > 0.5;
  const nearMinimum = f < 0.3;
  const isGlowing = isVevGlowing(highlight);

  return (
    <div style={{
      padding: "0 16px",
      maxWidth: 420,
      margin: "0 auto",
      transition: "box-shadow 0.3s ease",
      boxShadow: isGlowing ? `0 0 24px ${rgba(colors.gold, 0.15)}` : "none",
      borderRadius: 8,
    }}>
      <div style={styles.sectionTitle}>VEV Conservation &mdash; Eq. 55&ndash;62</div>

      {/* Total bar: h\u00b2 + v\u00b2 = 246\u00b2 */}
      <div style={{ marginBottom: 6 }}>
        <div style={barOuter}>
          <div
            style={{
              width: `${vFrac * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${colors.cyan}, #0099cc)`,
              borderRadius: hFrac > 0.01 ? "4px 0 0 4px" : 4,
              transition: "width 0.15s ease",
            }}
          />
          <div
            style={{
              width: `${hFrac * 100}%`,
              height: "100%",
              background: `linear-gradient(90deg, #cc8800, ${colors.gold})`,
              borderRadius: vFrac > 0.01 ? "0 4px 4px 0" : 4,
              transition: "width 0.15s ease",
            }}
          />
        </div>
      </div>

      {/* Labels row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <span style={{ ...styles.valueText, color: colors.cyan }}>
            v = {v.toFixed(1)}
          </span>
          <span style={styles.unitText}> GeV</span>
          <div style={styles.fracText}>{(vFrac * 100).toFixed(1)}% of \u03c6\u00b2</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ ...styles.valueText, color: "rgba(200,210,220,0.6)" }}>=</span>
          <div style={{ ...styles.fracText, color: colors.textDim }}>
            \u03c6_vev = {VEV} GeV
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ ...styles.valueText, color: colors.gold }}>
            h = {h.toFixed(1)}
          </span>
          <span style={styles.unitText}> GeV</span>
          <div style={styles.fracText}>{(hFrac * 100).toFixed(1)}% of \u03c6\u00b2</div>
        </div>
      </div>

      {/* Insight callout */}
      <div
        style={{
          ...styles.callout,
          borderColor: nearMinimum
            ? rgba(colors.gold, 0.3)
            : rgba(colors.cyan, 0.15),
        }}
      >
        {nearMinimum ? (
          <>
            <span style={{ color: colors.gold }}>\u03bb/5 regime</span> &mdash; Higgs
            perturbations dominate: h&sup2; = 4v&sup2;. The factor of 1/5 is simply VEV
            conservation when \u03c6 fluctuations, not v, carry the field strength.
          </>
        ) : isHiggsDominant ? (
          <>
            <span style={{ color: colors.gold }}>h &gt; v</span> &mdash; Transitional
            region where Higgs perturbations carry significant field energy.
          </>
        ) : (
          <>
            <span style={{ color: colors.cyan }}>SM regime</span> &mdash; The vacuum
            expectation value v dominates. Standard Model coupling applies.
          </>
        )}
      </div>
    </div>
  );
}

const barOuter = {
  display: "flex",
  width: "100%",
  height: 18,
  background: rgba(colors.cyan, 0.06),
  borderRadius: 4,
  overflow: "hidden",
  border: `1px solid ${colors.border}`,
};
