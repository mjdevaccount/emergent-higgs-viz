import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import { styles } from "@/theme.js";
import meta from "../meta.js";
import AccelerationPlot from "../viz/AccelerationPlot.jsx";

export default function Acceleration({ param, onChangeParam }) {
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
      <h2 style={styles.heading}>4. Acceleration and the Big Bang</h2>

      <p style={styles.prose}>
        The acceleration parameter <Eq tex="-(1+q)" /> in the curved universe
        has a singularity at <Eq tex="X = 4/3" /> -- this is the Big Bang.
        Time flows in the direction of decreasing <Eq tex="X" />: the arrow
        of time points from large <Eq tex="X" /> (diffusion-dominated past)
        toward small <Eq tex="X" /> (geometry-dominated future).
      </p>

      <Eq display num="44" tex={`
        -(1+q) = \\frac{-72\\,X\\,(X - \\frac{1}{12})}{X - \\frac{4}{3}}
      `} />

      <p style={styles.prose}>
        Before the Big Bang (<Eq tex="X > 4/3" />), the universe undergoes
        violent implosion; after (<Eq tex="X < 4/3" />), violent explosion.
        In both asymptotic limits -- far past and far future -- the universe
        approaches a static state. The Big Bang is not the beginning of time
        but a singularity in an infinitely old cosmos, separating a
        pre-Big-Bang era of diffusion dominance from the post-Big-Bang era
        of geometric expansion.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <AccelerationPlot param={param} width={Math.min(width - 16, 600)} height={300} />
        )}
        <Slider value={param} onChange={onChangeParam} meta={meta} />
        <div style={styles.figureCaption}>
          <strong>Acceleration divergence</strong> -- the singularity
          at <Eq tex="X = 4/3" /> marks the Big Bang. The universe is
          asymptotically static on both sides.
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
