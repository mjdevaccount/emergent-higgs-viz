import { useRef, useEffect, useState } from "react";
import { R_MIN } from "../physics.js";
import Eq from "./Eq.jsx";
import HoverTerm from "./HoverTerm.jsx";
import { TERMS } from "./highlight.js";
import SombreroViz from "../components/SombreroViz.jsx";
import { colors, styles } from "../theme.js";

export default function BlackHole({ radialPos, onChangeR }) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const measure = () => ref.current && setWidth(ref.current.clientWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const somW = Math.min(width - 16, 400);

  return (
    <section style={styles.section} ref={ref}>
      <h2 style={styles.heading}>3.3–3.4. The Schwarzschild Black Hole & Accretion Disk</h2>

      <p style={styles.prose}>
        At the minimum of the steep well potential (<HoverTerm term={TERMS.rh}><Eq tex="r_h" /></HoverTerm>), a variable
        transformation <Eq tex="\tilde{z} = \sqrt{3/2} + \sigma_r / r_0" /> yields
        a sombrero hat potential identical to the Standard Model — except the
        quartic coupling is <HoverTerm term={TERMS.lambda5}><Eq tex="\lambda/5" /></HoverTerm>.
      </p>

      <Eq display num="38" tex={`
        U(r_h, \\tilde{z}) = \\text{const.} + \\frac{m^2 \\phi^2_{r_h}}{2}
        \\left\\{ -\\frac{15}{16}\\tilde{z}^2 + \\frac{1}{16}\\tilde{z}^4 \\right\\}
      `} />

      <p style={styles.prose}>
        Promoting back to EW isospin algebra in the unitarity gauge:
      </p>

      <Eq display num="40" tex={`
        U^{\\text{SU(2)}}_{-}(r_h) = \\text{const.} - \\mu^2 \\Phi^\\dagger_s \\Phi_s
        + \\frac{\\lambda}{5} (\\Phi^\\dagger_s \\Phi_s)^2
      `} />

      <p style={styles.prose}>
        The SM Higgs field corresponds to the radial Planck field in the
        spontaneously broken EW space: <Eq tex="h_s \equiv v \frac{2}{\sqrt{3}} \frac{\sigma_r}{r_0}" />.
        The Higgs is the bridge connecting the weak sector to the geometry.
        Drag the slider to see the sombrero deform between the deep well
        and the SM regime:
      </p>

      {/* Interactive sombrero */}
      <div style={styles.figureBox}>
        {somW > 0 && (
          <SombreroViz radialPos={radialPos} width={somW} height={320} />
        )}
        <Slider value={radialPos} onChange={onChangeR} />
        <div style={styles.figureCaption}>
          <strong>Sombrero potential</strong> — shape warps with radial position.
          At <HoverTerm term={TERMS.rh}><Eq tex="r_h" /></HoverTerm> the bowl is wide and shallow (<HoverTerm term={TERMS.lambda5}><Eq tex="\lambda/5" /></HoverTerm>).
        </div>
      </div>
    </section>
  );
}

function Slider({ value, onChange }) {
  return (
    <div style={{ maxWidth: 400, margin: "12px auto 0", padding: "0 8px" }}>
      <div style={styles.sliderLabel}>
        <span>r = r_h</span>
        <span style={{ color: colors.gold }}>r / r₀ = {value.toFixed(3)}</span>
        <span>r = 4r₀</span>
      </div>
      <input type="range" min={R_MIN + 0.001} max={4.0} step={0.001}
        value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer", marginTop: 4 }} />
    </div>
  );
}
