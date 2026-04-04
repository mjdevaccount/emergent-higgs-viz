import { useRef, useEffect, useState } from "react";
import { R_MIN } from "../physics.js";
import Eq from "./Eq.jsx";
import { useHighlight } from "./HighlightContext.jsx";
import DualPotentialPlot from "../components/DualPotential.jsx";

export default function SymmetryBreaking({ radialPos, onChangeR }) {
  const { active } = useHighlight();
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const measure = () => ref.current && setWidth(ref.current.clientWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section style={section} ref={ref}>
      <h2 style={heading}>3. Emergent Higgs and the Schwarzschild Black Hole</h2>

      <p style={prose}>
        A real scalar field <Eq tex="\phi" /> placed in stochastic spacetime
        with a zero VEV acquires a nonzero expectation value upon transition to
        spherical coordinates. Minimizing the expected potential in the radial
        direction yields two solutions — ground and excited states — that cross
        at the Schwarzschild radius.
      </p>

      <Eq display num="32" tex={`
        \\frac{U_\\pm(r)}{m^2 \\phi^2} = 2\\left\\{1 +
        \\frac{2}{\\htmlClass{hl-r0}{r}^2}\\left(\\frac{1}{4} \\mp \\sqrt{\\frac{r^2}{2\\htmlClass{hl-r0}{r_0}^2} - \\frac{3}{16}}\\right)^{\\!2} +
        \\frac{2}{r^4}\\left(\\frac{1}{4} \\pm \\sqrt{\\frac{r^2}{2r_0^2} - \\frac{3}{16}}\\right)^{\\!2}
        \\right\\}
      `} />

      <p style={prose}>
        The ground state follows <Eq tex="U^-" /> inside <Eq tex="r_0" /> (deep
        well at <Eq tex="r_h \approx 0.65\,r_0" />) and <Eq tex="U^+" /> outside
        (shallow well at <Eq tex="r_a \approx 3.10\,r_0" />, the accretion disk).
        Drag the slider to explore:
      </p>

      {/* Interactive Figure 2 */}
      <div style={figureBox}>
        {width > 0 && (
          <DualPotentialPlot
            radialPos={radialPos}
            width={Math.min(width - 16, 700)}
            height={360}
            highlight={active}
          />
        )}
        <Slider value={radialPos} onChange={onChangeR} />
        <div style={caption}>
          <strong>Figure 2.</strong> Potential post-transition corresponding to
          the ground and excited state with minimums
          at <Eq tex="r = \sqrt{5 \pm \sqrt{21}}\,r_0" />.
        </div>
      </div>
    </section>
  );
}

function Slider({ value, onChange }) {
  return (
    <div style={{ maxWidth: 500, margin: "12px auto 0", padding: "0 8px" }}>
      <div style={sliderLabel}>
        <span>r = r_min</span>
        <span style={{ color: "#ffd700" }}>r / r₀ = {value.toFixed(3)}</span>
        <span>r = 4r₀</span>
      </div>
      <input
        type="range"
        min={R_MIN + 0.001}
        max={4.0}
        step={0.001}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={sliderInput}
      />
    </div>
  );
}

const section = { maxWidth: 740, margin: "0 auto", padding: "40px 32px" };
const heading = { fontSize: 22, fontWeight: 400, marginBottom: 16, color: "#e0e8f0" };
const prose = { fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: "rgba(200,210,220,0.75)", margin: "16px 0" };
const figureBox = { background: "rgba(8,12,24,0.5)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 8, padding: "16px 8px", margin: "24px 0", display: "flex", flexDirection: "column", alignItems: "center" };
const caption = { fontSize: 13, fontStyle: "italic", color: "rgba(180,200,220,0.5)", textAlign: "center", marginTop: 12, lineHeight: 1.6, maxWidth: 500 };
const sliderLabel = { display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "rgba(180,200,220,0.4)" };
const sliderInput = { width: "100%", cursor: "pointer", marginTop: 4 };
