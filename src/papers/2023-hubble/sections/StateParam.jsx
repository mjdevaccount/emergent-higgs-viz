import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import { TERMS } from "../highlight.js";
import meta from "../meta.js";
import EosPlot from "../viz/EosPlot.jsx";

export default function StateParam({ param, onChangeParam }) {
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
      <h2 style={styles.heading}>3. Equation of State</h2>

      <p style={styles.prose}>
        The effective equation of state <Eq tex="w" /> interpolates between
        pure vacuum (<Eq tex="w = -1" />) and the diffusion-modified regime.
        As the diffusion parameter decreases toward zero, the universe
        approaches a{" "}
        <HoverTerm term={TERMS.darkEnergy}>dark energy</HoverTerm>-dominated
        state indistinguishable from the cosmological constant.
      </p>

      <Eq display num="15" tex={`
        w \\;\\xrightarrow{D \\to 0}\\; -1
      `} />

      <p style={styles.prose}>
        At the transition point <Eq tex="f_T \approx 0.80" /> the equation of
        state is <Eq tex="w \approx -0.73" />. Near <Eq tex="f \approx 1" />,
        the value settles to <Eq tex="w \approx -5/7 \approx -0.71" />,
        which mimics a <Eq tex="\Lambda" />CDM universe with matter
        fraction <Eq tex="\Omega_m \approx 0.3" />. The path from the
        transition to the vacuum limit traces the late-time evolution of
        the cosmos.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <EosPlot
            param={param}
            width={Math.min(width - 16, 600)}
            height={300}
            highlight={active}
          />
        )}
        <Slider value={param} onChange={onChangeParam} />
        <div style={styles.figureCaption}>
          <strong>Equation of state</strong> — w approaches -1 (vacuum) as
          diffusion vanishes. Reference lines at w = -1 and w = -5/7.
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
