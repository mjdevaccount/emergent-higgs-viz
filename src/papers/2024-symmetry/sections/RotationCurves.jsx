import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import { TERMS } from "../highlight.js";
import meta from "../meta.js";
import RotationCurvePlot from "../viz/RotationCurvePlot.jsx";

export default function RotationCurves({ param, onChangeParam }) {
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
      <h2 style={styles.heading}>4. Galaxy Rotation Curves</h2>

      <p style={styles.prose}>
        Applying the RWML framework to the weak-gravity limit of a galaxy
        produces a striking result. The radial velocity satisfies{" "}
        <Eq tex="\dot{R} = HR" />, while the angular velocity decays
        as <Eq tex="\dot{\varphi} = \dot{\varphi}_0 / a" />. At large
        distances the dominant term in the radial equation becomes:
      </p>

      <Eq display num="50" tex={`
        \\ddot{R} \\approx 3D\\bigl(\\dot{R} - HR\\bigr)\\,R^2\\dot{\\varphi}^2
      `} />

      <p style={styles.prose}>
        The tangential velocity <Eq tex="V = R\dot{\varphi}" /> then evaluates
        to <Eq tex="V = R_0 \dot{\varphi}_0" /> — a <HoverTerm term={TERMS.flatVelocity}>constant, independent of
        radius</HoverTerm>. This matches the observed flat rotation curves of spiral
        galaxies without invoking <HoverTerm term={TERMS.darkMatter}>dark matter</HoverTerm>. The flattening is a geometric
        consequence of stochastic spacetime, not a gravitational pull from
        unseen mass.
      </p>

      <Eq display tex={`
        V = R_0\\,\\dot{\\varphi}_0 = \\text{const}
      `} />

      <div style={styles.figureBox}>
        {width > 0 && (
          <RotationCurvePlot param={param} width={Math.min(width - 16, 600)} height={300} highlight={active} />
        )}
        <Slider value={param} onChange={onChangeParam} meta={meta} />
        <div style={styles.figureCaption}>
          <strong>Rotation curve</strong> — velocity flattens at large radius,
          matching observations without dark matter.
        </div>
      </div>
    </section>
  );
}

function Slider({ value, onChange, meta }) {
  return (
    <div style={{ maxWidth: 500, margin: "12px auto 0", padding: "0 8px" }}>
      <div style={styles.sliderLabel}>
        <span>R = 1 kpc</span>
        <span style={{ color: "#ffd700" }}>{meta.paramLabel} = {value.toFixed(0)} kpc</span>
        <span>R = 120 kpc</span>
      </div>
      <input type="range" min={meta.paramMin} max={meta.paramMax} step={meta.paramStep}
        value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer", marginTop: 4 }} />
    </div>
  );
}
