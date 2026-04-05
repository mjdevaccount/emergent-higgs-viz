import { R_MIN } from "../physics.js";
import Eq from "./Eq.jsx";
import HoverTerm from "./HoverTerm.jsx";
import { useHighlight } from "./HighlightContext.jsx";
import { TERMS } from "./highlight.js";
import VevBreakdown from "../components/VevBreakdown.jsx";
import { colors, rgba, fonts, styles } from "../theme.js";

export default function VevConservation({ radialPos, onChangeR }) {
  const { active } = useHighlight();

  return (
    <section style={section}>
      <h2 style={heading}>3.8. Conservation of VEV and Restoration of SM &lambda;</h2>
      <div style={centralTag}>Central Result</div>

      <p style={styles.prose}>
        This is the central result. Inside the Schwarzschild sphere, the
        potential minimum gives:
      </p>

      <Eq display num="57" tex={`
        U^{\\text{SU(2)}}_{-}(r < r_0) = \\text{const.} - \\frac{1}{2}\\mu^2 \\phi^2
        + \\frac{1}{5} \\cdot \\frac{1}{4} \\frac{\\mu^2}{v^2} \\phi^4
      `} />

      <p style={styles.prose}>
        Setting the derivative to zero
        gives <Eq tex="\phi_{\text{vev}} = \sqrt{5}\,v = 246" /> GeV.
        The observed VEV is preserved, but now the{" "}
        <HoverTerm term={TERMS.lambda5}>factor of 1/5</HoverTerm> means:
      </p>

      <Eq display num="59" tex={`
        \\phi^2_{\\text{vev}} = v^2 + h^2 = 5v^2
        \\quad \\Rightarrow \\quad h^2 = 4v^2 \\gg v^2
      `} />

      <p style={styles.prose}>
        <strong>Inside the black hole, the Higgs perturbation dominates.</strong> The{" "}
        <HoverTerm term={TERMS.lambda5}>factor of 1/5</HoverTerm> is a simple
        consequence of VEV conservation when
        perturbations in <Eq tex="h" /> carry the field strength rather
        than <Eq tex="v" />:
      </p>

      <Eq display num="62" tex={`
        v = \\frac{1}{\\sqrt{5}} \\cdot 246 \\approx 110 \\text{ GeV}
        \\qquad
        h_{\\text{vev}} = 2v \\approx 220 \\text{ GeV}
      `} />

      <p style={styles.prose}>
        A more general potential that preserves <Eq tex="\phi_{\text{vev}}" /> regardless
        of the mapping space restores the SM quartic coupling at{" "}
        <HoverTerm term={TERMS.r0}><Eq tex="r_0" /></HoverTerm>:
      </p>

      <Eq display num="63" tex={`
        U^{\\text{SU(2)}} = \\text{const.} - \\mu^2 \\Phi^\\dagger \\Phi
        + \\lambda (\\Phi^\\dagger \\Phi)^2,
        \\qquad \\lambda = \\frac{\\mu^2}{\\phi^2_{\\text{vev}}}
      `} />

      {/* Interactive VEV breakdown */}
      <div style={styles.figureBox}>
        <VevBreakdown radialPos={radialPos} highlight={active} />
        <Slider value={radialPos} onChange={onChangeR} />
      </div>
    </section>
  );
}

function Slider({ value, onChange }) {
  return (
    <div style={{ maxWidth: 400, margin: "12px auto 0", padding: "0 8px" }}>
      <div style={styles.sliderLabel}>
        <span>r = r_h</span>
        <span style={{ color: colors.gold }}>r / r₀ = {value.toFixed(3)}</span>
        <span>r = 4r₀</span>
      </div>
      <input type="range" min={R_MIN + 0.001} max={4.0} step={0.001}
        value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer", marginTop: 4 }} />
    </div>
  );
}

const section = {
  ...styles.section,
  borderTop: `2px solid ${rgba(colors.gold, 0.2)}`,
  borderBottom: `1px solid ${rgba(colors.gold, 0.1)}`,
  background: `linear-gradient(180deg, ${rgba(colors.gold, 0.03)} 0%, transparent 40%)`,
};
const heading = { ...styles.heading, marginBottom: 4, color: colors.gold };
const centralTag = {
  fontFamily: fonts.mono,
  fontSize: 9,
  letterSpacing: 3,
  color: rgba(colors.gold, 0.4),
  textTransform: "uppercase",
  marginBottom: 16,
};
