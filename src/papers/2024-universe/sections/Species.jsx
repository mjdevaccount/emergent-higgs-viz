import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import { styles } from "@/theme.js";
import meta from "../meta.js";
import SpeciesBar from "../viz/SpeciesBar.jsx";

export default function Species({ param, onChangeParam }) {
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
      <h2 style={styles.heading}>5. Species Evolution</h2>

      <p style={styles.prose}>
        The conserved energy density decomposes into four species: vacuum
        (<Eq tex="w = -1" />), diffusion (<Eq tex="w = -1/3" />), matter
        (<Eq tex="w = 0" />), and radiation (<Eq tex="w = 1/3" />). In the
        far future (<Eq tex="X \to 0" />), vacuum dominates with small
        admixtures of matter and diffusion. In the far past
        (<Eq tex="X \to \infty" />), diffusion takes over entirely.
      </p>

      <Eq display num="52-54" tex={`
        \\Omega = \\underbrace{(1 - 5X)}_{\\Omega_V}
        + \\underbrace{3X}_{\\Omega_D}
        + \\underbrace{2X}_{\\Omega_M} = 1
      `} />

      <p style={styles.prose}>
        Energy is conserved across all species:
        {" "}<Eq tex="\sum \dot{\Omega}_i = 0" />. As <Eq tex="X" /> decreases
        from infinity, the universe transitions smoothly from pure diffusion
        through the Big Bang singularity and into a vacuum-dominated future.
        The bar below shows the fractional composition at the
        current <Eq tex="X" /> value.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <SpeciesBar param={param} width={Math.min(width - 16, 600)} height={80} />
        )}
        <Slider value={param} onChange={onChangeParam} meta={meta} />
        <div style={styles.figureCaption}>
          <strong>Species fractions</strong> -- vacuum (blue), diffusion (gold),
          matter (green). Sweep <Eq tex="X" /> to watch the composition evolve.
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
