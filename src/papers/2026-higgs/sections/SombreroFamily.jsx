import { useRef, useEffect, useState } from "react";
import { R_MIN } from "../physics.js";
import Eq from "@/shared/Eq.jsx";
import CouplingPlot from "../viz/CouplingPlot.jsx";
import { colors, styles } from "@/theme.js";

export default function SombreroFamily({ radialPos, onChangeR }) {
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
      <h2 style={styles.heading}>3.5. An Entire Family of Sombrero Potentials</h2>

      <p style={styles.prose}>
        The sombrero potential is not unique — any point in space has its own
        version, parameterized by <Eq tex="Z_\pm(r)" />:
      </p>

      <Eq display num="48" tex={`
        U(r, \\tilde{z}_\\pm) = \\text{const.} + \\frac{m^2 \\phi^2}{2r}
        \\left\\{ -\\frac{3}{4} Z_\\pm(r)\\,\\tilde{z}^2_\\pm + \\frac{1}{16}\\tilde{z}^4_\\pm \\right\\}
      `} />

      <Eq display num="49" tex={`
        Z_\\pm(r) = 1 + \\frac{r_0^2}{r^2}\\left(\\frac{1}{4} \\pm \\sqrt{\\frac{r^2}{2r_0^2} - \\frac{3}{16}}\\right)
      `} />

      <p style={styles.prose}>
        The quartic coupling relative to the SM, <Eq tex="f_\pm(r)" />, defines
        how the sombrero tightens or loosens at each point in space:
      </p>

      <Eq display num="51" tex={`
        f_\\pm(r) = \\frac{\\frac{2}{3}\\left(\\frac{1}{4} \\mp \\sqrt{\\frac{r^2}{2r_0^2} - \\frac{3}{16}}\\right)^{\\!2}}
        {\\frac{r^2}{r_0^2} + \\left(\\frac{1}{4} \\pm \\sqrt{\\frac{r^2}{2r_0^2} - \\frac{3}{16}}\\right)}
      `} />

      {/* Interactive Figure 3 */}
      <div style={styles.figureBox}>
        {width > 0 && (
          <CouplingPlot
            radialPos={radialPos}
            width={Math.min(width - 16, 700)}
            height={320}
          />
        )}
        <Slider value={radialPos} onChange={onChangeR} />
        <div style={styles.figureCaption}>
          <strong>Figure 3.</strong> Quartic coupling
          coefficient <Eq tex="f(r)" /> across <Eq tex="r/r_0" />.
          Drops to <Eq tex="1/5" /> at both potential minima.
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
      <input type="range" min={R_MIN + 0.001} max={4.0} step={0.001}
        value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer", marginTop: 4 }} />
    </div>
  );
}
