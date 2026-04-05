import { VEV, vevBreakdown, R_0, R_H, R_A } from "../physics.js";
import { isVevGlowing } from "../paper/highlight.js";

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
      boxShadow: isGlowing ? "0 0 24px rgba(255,215,0,0.15)" : "none",
      borderRadius: 8,
    }}>
      {/* Title */}
      <div style={title}>VEV Conservation — Eq. 55–62</div>

      {/* Total bar: h² + v² = 246² */}
      <div style={{ marginBottom: 6 }}>
        <div style={barOuter}>
          {/* v² portion (cyan) */}
          <div
            style={{
              width: `${vFrac * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #00d4ff, #0099cc)",
              borderRadius: hFrac > 0.01 ? "4px 0 0 4px" : 4,
              transition: "width 0.15s ease",
            }}
          />
          {/* h² portion (gold) */}
          <div
            style={{
              width: `${hFrac * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #cc8800, #ffd700)",
              borderRadius: vFrac > 0.01 ? "0 4px 4px 0" : 4,
              transition: "width 0.15s ease",
            }}
          />
        </div>
      </div>

      {/* Labels row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <span style={{ ...valueText, color: "#00d4ff" }}>
            v = {v.toFixed(1)}
          </span>
          <span style={unitText}> GeV</span>
          <div style={fracText}>{(vFrac * 100).toFixed(1)}% of φ²</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ ...valueText, color: "rgba(200,210,220,0.6)" }}>=</span>
          <div style={{ ...fracText, color: "rgba(200,210,220,0.5)" }}>
            φ_vev = {VEV} GeV
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ ...valueText, color: "#ffd700" }}>
            h = {h.toFixed(1)}
          </span>
          <span style={unitText}> GeV</span>
          <div style={fracText}>{(hFrac * 100).toFixed(1)}% of φ²</div>
        </div>
      </div>

      {/* Insight callout */}
      <div
        style={{
          ...callout,
          borderColor: nearMinimum
            ? "rgba(255,215,0,0.3)"
            : "rgba(0,212,255,0.15)",
        }}
      >
        {nearMinimum ? (
          <>
            <span style={{ color: "#ffd700" }}>λ/5 regime</span> — Higgs
            perturbations dominate: h² = 4v². The factor of 1/5 is simply VEV
            conservation when φ fluctuations, not v, carry the field strength.
          </>
        ) : isHiggsDominant ? (
          <>
            <span style={{ color: "#ffd700" }}>h &gt; v</span> — Transitional
            region where Higgs perturbations carry significant field energy.
          </>
        ) : (
          <>
            <span style={{ color: "#00d4ff" }}>SM regime</span> — The vacuum
            expectation value v dominates. Standard Model coupling applies.
          </>
        )}
      </div>
    </div>
  );
}

const title = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  letterSpacing: 3,
  color: "rgba(0,212,255,0.6)",
  textTransform: "uppercase",
  marginBottom: 12,
  textAlign: "center",
};

const barOuter = {
  display: "flex",
  width: "100%",
  height: 18,
  background: "rgba(0,212,255,0.06)",
  borderRadius: 4,
  overflow: "hidden",
  border: "1px solid rgba(0,212,255,0.1)",
};

const valueText = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 22,
  fontWeight: 300,
};

const unitText = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  color: "rgba(180,200,220,0.4)",
};

const fracText = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 9,
  color: "rgba(180,200,220,0.35)",
  marginTop: 2,
};

const callout = {
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontSize: 14,
  fontStyle: "italic",
  lineHeight: 1.5,
  color: "rgba(200,210,220,0.6)",
  borderLeft: "2px solid",
  paddingLeft: 12,
  transition: "border-color 0.5s ease",
};
