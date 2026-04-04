import { useRef, useEffect, useState } from "react";
import { R_MIN } from "../physics.js";
import Eq from "./Eq.jsx";
import SombreroViz from "../components/SombreroViz.jsx";

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
    <section style={section} ref={ref}>
      <h2 style={heading}>3.3–3.4. The Schwarzschild Black Hole & Accretion Disk</h2>

      <p style={prose}>
        At the minimum of the steep well potential (<Eq tex="r_h" />), a variable
        transformation <Eq tex="\tilde{z} = \sqrt{3/2} + \sigma_r / r_0" /> yields
        a sombrero hat potential identical to the Standard Model — except the
        quartic coupling is <Eq tex="\lambda/5" />.
      </p>

      <Eq display num="38" tex={`
        U(r_h, \\tilde{z}) = \\text{const.} + \\frac{m^2 \\phi^2_{r_h}}{2}
        \\left\\{ -\\frac{15}{16}\\tilde{z}^2 + \\frac{1}{16}\\tilde{z}^4 \\right\\}
      `} />

      <p style={prose}>
        Promoting back to EW isospin algebra in the unitarity gauge:
      </p>

      <Eq display num="40" tex={`
        U^{\\text{SU(2)}}_{-}(r_h) = \\text{const.} - \\mu^2 \\Phi^\\dagger_s \\Phi_s
        + \\frac{\\lambda}{5} (\\Phi^\\dagger_s \\Phi_s)^2
      `} />

      <p style={prose}>
        The SM Higgs field corresponds to the radial Planck field in the
        spontaneously broken EW space: <Eq tex="h_s \equiv v \frac{2}{\sqrt{3}} \frac{\sigma_r}{r_0}" />.
        The Higgs is the bridge connecting the weak sector to the geometry.
        Drag the slider to see the sombrero deform between the deep well
        and the SM regime:
      </p>

      {/* Interactive sombrero */}
      <div style={figureBox}>
        {somW > 0 && (
          <SombreroViz radialPos={radialPos} width={somW} height={320} />
        )}
        <Slider value={radialPos} onChange={onChangeR} />
        <div style={caption}>
          <strong>Sombrero potential</strong> — shape warps with radial position.
          At <Eq tex="r_h" /> the bowl is wide and shallow (<Eq tex="\lambda/5" />).
        </div>
      </div>
    </section>
  );
}

function Slider({ value, onChange }) {
  return (
    <div style={{ maxWidth: 400, margin: "12px auto 0", padding: "0 8px" }}>
      <div style={sliderLabel}>
        <span>r = r_h</span>
        <span style={{ color: "#ffd700" }}>r / r₀ = {value.toFixed(3)}</span>
        <span>r = 4r₀</span>
      </div>
      <input type="range" min={R_MIN + 0.001} max={4.0} step={0.001}
        value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer", marginTop: 4 }} />
    </div>
  );
}

const section = { maxWidth: 740, margin: "0 auto", padding: "40px 32px" };
const heading = { fontSize: 22, fontWeight: 400, marginBottom: 16, color: "#e0e8f0" };
const prose = { fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: "rgba(200,210,220,0.75)", margin: "16px 0" };
const figureBox = { background: "rgba(8,12,24,0.5)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 8, padding: "16px 8px", margin: "24px 0", display: "flex", flexDirection: "column", alignItems: "center" };
const caption = { fontSize: 13, fontStyle: "italic", color: "rgba(180,200,220,0.5)", textAlign: "center", marginTop: 12, lineHeight: 1.6, maxWidth: 500 };
const sliderLabel = { display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "rgba(180,200,220,0.4)" };
