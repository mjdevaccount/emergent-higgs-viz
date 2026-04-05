import { useRef, useEffect, useState } from "react";
import { R_MIN } from "../physics.js";
import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { TERMS } from "../highlight.js";
import DualPotentialPlot from "../viz/DualPotential.jsx";
import { colors, styles } from "@/theme.js";

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
    <section style={styles.section} ref={ref}>
      <h2 style={styles.heading}>3. Emergent Higgs and the Schwarzschild Black Hole</h2>

      <p style={styles.prose}>
        A real scalar field <Eq tex="\phi" /> placed in stochastic spacetime
        with a zero VEV acquires a nonzero expectation value upon transition to
        spherical coordinates. Minimizing the expected potential in the radial
        direction yields two solutions — ground and excited states — that cross
        at the Schwarzschild radius.
      </p>

      <Eq display num="32" tex={`
        \\frac{U_\\pm(r)}{m^2 \\phi^2} = 2\\left\\{1 +
        \\frac{2}{r^2}\\left(\\frac{1}{4} \\mp \\sqrt{\\frac{r^2}{2r_0^2} - \\frac{3}{16}}\\right)^{\\!2} +
        \\frac{2}{r^4}\\left(\\frac{1}{4} \\pm \\sqrt{\\frac{r^2}{2r_0^2} - \\frac{3}{16}}\\right)^{\\!2}
        \\right\\}
      `} />

      <p style={styles.prose}>
        The ground state follows <Eq tex="U^-" /> inside{" "}
        <HoverTerm term={TERMS.r0}><Eq tex="r_0" /></HoverTerm> (deep
        well at <HoverTerm term={TERMS.rh}><Eq tex="r_h \approx 0.65\,r_0" /></HoverTerm>) and <Eq tex="U^+" /> outside
        (shallow well at <HoverTerm term={TERMS.ra}><Eq tex="r_a \approx 3.10\,r_0" /></HoverTerm>, the accretion disk).
        Drag the slider to explore:
      </p>

      {/* Interactive Figure 2 */}
      <div style={styles.figureBox}>
        {width > 0 && (
          <DualPotentialPlot
            radialPos={radialPos}
            width={Math.min(width - 16, 700)}
            height={360}
            highlight={active}
          />
        )}
        <Slider value={radialPos} onChange={onChangeR} />
        <div style={styles.figureCaption}>
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
      <div style={styles.sliderLabel}>
        <span>r = r_min</span>
        <span style={{ color: colors.gold }}>r / r₀ = {value.toFixed(3)}</span>
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

const sliderInput = { width: "100%", cursor: "pointer", marginTop: 4 };
