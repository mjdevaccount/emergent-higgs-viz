import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import { TERMS } from "../highlight.js";
import meta from "../meta.js";
import DiffusionPlot from "../viz/DiffusionPlot.jsx";

export default function Diffusion({ param, onChangeParam }) {
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
      <h2 style={styles.heading}>2. Diffusion States</h2>

      <p style={styles.prose}>
        The stochastic extension of the Friedmann equations produces two
        branches for the{" "}
        <HoverTerm term={TERMS.diffusionParam}>diffusion parameter</HoverTerm>{" "}
        as a function of the acceleration parameter <Eq tex="f = -q" />.
        The <Eq tex="D_+" /> branch dominates in the late-time,
        vacuum-approaching universe while <Eq tex="D_-" /> characterises
        earlier, matter-dominated epochs.
      </p>

      <Eq display num="12" tex={`
        D_{\\pm} = \\frac{H}{12}\\left(1 - \\frac{\\delta f}{6}
        \\pm \\sqrt{1 + 5\\,\\delta f + \\frac{(\\delta f)^2}{36}}\\right)
      `} />

      <Eq display num="13" tex={`
        f \\equiv -q, \\qquad \\delta f \\equiv f - 1, \\qquad X \\equiv D/H
      `} />

      <p style={styles.prose}>
        A transition point exists at <Eq tex="f_T \approx 0.7998" /> — the
        minimum acceleration for which the energy density has a real, stable
        minimum. Below this threshold the discriminant turns negative and no
        physical diffusion state exists. As <Eq tex="f \to 1" /> (pure vacuum
        domination), both branches converge toward <Eq tex="D \to H/6" />.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <DiffusionPlot
            param={param}
            width={Math.min(width - 16, 600)}
            height={300}
            highlight={active}
          />
        )}
        <Slider value={param} onChange={onChangeParam} />
        <div style={styles.figureCaption}>
          <strong>Diffusion states</strong> — D+ (gold) and D- (cyan) as functions
          of the acceleration parameter <Eq tex="f = -q" />.
        </div>
      </div>
    </section>
  );
}

function Slider({ value, onChange }) {
  return (
    <div style={{ maxWidth: 500, margin: "12px auto 0", padding: "0 8px" }}>
      <div style={styles.sliderLabel}>
        <span>f = 0.5</span>
        <span style={{ color: "#ffd700" }}>{meta.paramLabel} = {value.toFixed(3)}</span>
        <span>f = 1.1</span>
      </div>
      <input type="range" min={meta.paramMin} max={meta.paramMax} step={meta.paramStep}
        value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer", marginTop: 4 }} />
    </div>
  );
}
