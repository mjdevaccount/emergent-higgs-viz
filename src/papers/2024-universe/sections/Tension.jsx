import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import meta from "../meta.js";
import { TERMS } from "../highlight.js";
import TensionPlot from "../viz/TensionPlot.jsx";

export default function Tension({ param, onChangeParam }) {
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
      <h2 style={styles.heading}>2. Equation of State Tension</h2>

      <p style={styles.prose}>
        In a flat universe (<Eq tex="k=0" />), the equation of state inferred
        from the species evolution equation and the one inferred from the
        Friedmann equations diverge. The species equation gives:
      </p>

      <Eq display num="21" tex={`
        w_S = -\\frac{1+2X}{1+3X}
      `} />

      <p style={styles.prose}>
        At <Eq tex="X \\to 0" /> both approaches agree
        on <HoverTerm term={TERMS.vacuum}><Eq tex="w \\to -1" /> (vacuum)</HoverTerm>, but at <Eq tex="X \\to \\infty" /> the
        species equation yields <Eq tex="w_S \\to -2/3" /> while the Friedmann
        equation of state approaches <Eq tex="w \\to -1/3" />. This is
        a genuine tension -- two independent routes to the same quantity give
        different answers in the <HoverTerm term={TERMS.diffusion}>diffusion</HoverTerm>-dominated regime:
      </p>

      <Eq display num="31-32" tex={`
        w \\to -1 + 4X \\;\\;(X\\to 0),
        \\qquad
        w \\to -\\tfrac{1}{3} \\;\\;(X\\to\\infty)
      `} />

      <div style={styles.figureBox}>
        {width > 0 && (
          <TensionPlot param={param} width={Math.min(width - 16, 600)} height={300} highlight={active} />
        )}
        <Slider value={param} onChange={onChangeParam} meta={meta} />
        <div style={styles.figureCaption}>
          <strong>Flat-universe tension</strong> -- the species EoS (cyan) and
          Friedmann EoS (gold) diverge as <Eq tex="X" /> grows.
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
