import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import meta from "../meta.js";
import { TERMS } from "../highlight.js";
import EquationOfStatePlot from "../viz/EquationOfStatePlot.jsx";

export default function Curvature({ param, onChangeParam }) {
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
      <h2 style={styles.heading}>3. Curvature Resolves the Tension</h2>

      <p style={styles.prose}>
        The flat-universe tension disappears when we allow positive spatial
        curvature. The required curvature is not arbitrary -- it is fixed as
        the interaction term between geometry and diffusion:
      </p>

      <Eq display num="40" tex={`
        \\frac{k}{a^2} = \\frac{15}{2}\\,D\\,H
      `} />

      <p style={styles.prose}>
        With this curvature the species equation of state becomes:
      </p>

      <Eq display num="43" tex={`
        w_S = -\\frac{1+2X}{1+6X}
      `} />

      <p style={styles.prose}>
        Now <Eq tex="w = w_S" /> asymptotically in both limits. The diffusive
        species carries an equation of state <HoverTerm term={TERMS.diffusion}><Eq tex="w_D = -1/3" /></HoverTerm>,
        interpolating between <HoverTerm term={TERMS.vacuum}>vacuum (<Eq tex="w = -1" />)</HoverTerm> at
        small <Eq tex="X" /> and the diffusion-dominated
        regime at large <Eq tex="X" />. The curvature is not imposed by
        hand -- it is the unique value that makes Friedmann and species
        evolution self-consistent.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <EquationOfStatePlot param={param} width={Math.min(width - 16, 600)} height={300} highlight={active} />
        )}
        <Slider value={param} onChange={onChangeParam} meta={meta} />
        <div style={styles.figureCaption}>
          <strong>Curved universe</strong> -- with <Eq tex="k/a^2 = \frac{15}{2}DH" />,
          the Friedmann EoS (gold) now agrees with the species EoS (cyan).
        </div>
      </div>
    </section>
  );
}

function Slider({ value, onChange, meta }) {
  return (
    <div style={{ maxWidth: 500, margin: "12px auto 0", padding: "0 8px" }}>
      <div style={styles.sliderLabel}>
        <span>X {"\u2192"} {"\u221E"}</span>
        <span style={{ color: "#ffd700" }}>{meta.paramLabel} = {value.toFixed(2)}</span>
        <span>X {"\u2192"} 0</span>
      </div>
      <input type="range" min={meta.paramMin} max={meta.paramMax} step={meta.paramStep}
        value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer", marginTop: 4 }} />
    </div>
  );
}
