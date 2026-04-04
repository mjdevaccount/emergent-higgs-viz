import { useState, useRef, useEffect } from "react";
import { R_MIN } from "../physics.js";
import Eq from "./Eq.jsx";
import EntropyMap from "../components/EntropyMap.jsx";

export default function Entropy() {
  const [radialPos, setRadialPos] = useState(1.0);
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const measure = () => ref.current && setWidth(ref.current.clientWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section style={section} ref={ref}>
      <h2 style={heading}>4. Higgs Vacuum Entropy</h2>

      <p style={prose}>
        Treating the Higgs vacuum as an over-damped system in equilibrium, the
        Smoluchowski equation yields a Langevin equation for the vacuum density.
        Two dimensionless parameters govern its evolution:
      </p>

      <Eq display num="95" tex={`
        \\alpha_1^\\pm \\approx \\frac{m^2 \\phi^2}{\\mu^2 v^2}
        \\left\\{ 4 + \\frac{r_0^2}{r^2}\\left(\\frac{3}{2} \\mp 14\\sqrt{\\frac{r^2}{2r_0^2} - \\frac{3}{16}}\\right) \\right\\}
      `} />

      <Eq display num="96" tex={`
        \\alpha_2^\\pm \\approx \\frac{m^2 \\phi^2}{\\mu^2 v^2} \\cdot \\frac{r_0^2}{r^2}
        \\left\\{ 6 - \\frac{1}{r^2} \\mp 4\\sqrt{\\frac{r^2}{2r_0^2} - \\frac{3}{16}} \\right\\}
      `} />

      <p style={prose}>
        The entropy <Eq tex="S \propto -\alpha_1" /> (Eq. 114). The ground
        state <Eq tex="\alpha_1^-" /> changes sign
        at <Eq tex="r^2 = \tfrac{1}{2}r_0^2" />, giving positive entropy inside
        the Schwarzschild sphere and negative entropy in the accretion region.
      </p>

      <div style={figureBox}>
        {width > 0 && (
          <EntropyMap
            radialPos={radialPos}
            width={Math.min(width - 16, 700)}
            height={300}
          />
        )}
        <Slider value={radialPos} onChange={setRadialPos} />
        <div style={caption}>
          <strong>Figure 6.</strong> Parameters <Eq tex="\alpha_1^-" /> (solid
          cyan) and <Eq tex="\alpha_2^+" /> (dashed orange) plotted
          across <Eq tex="r/r_0" />. Green region: positive entropy.
          Red: negative entropy.
        </div>
      </div>

      <p style={prose}>
        The vacuum density, Green's function, and entropy follow from the
        partition function (Eq. 107–111). For high-energy Higgs fields
        inside the Schwarzschild sphere:
      </p>

      {/* Table 1 from paper */}
      <div style={{ overflowX: "auto", margin: "20px 0" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}></th>
              <th style={th}><Eq tex="\langle q^n \rangle" /></th>
              <th style={th}><Eq tex="p_k" /></th>
              <th style={th}><Eq tex="G_{pp}" /></th>
              <th style={th}><Eq tex="S_k" /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdLabel}>b ≫ a</td>
              <td style={td}><Eq tex="b^n" /></td>
              <td style={td}><Eq tex="e^b" /></td>
              <td style={td}>0</td>
              <td style={td}><Eq tex="-b\,e^b" /></td>
            </tr>
            <tr>
              <td style={tdLabel}>a ≫ b</td>
              <td style={td}><Eq tex="(2a)^{n/2}" /> (even n)</td>
              <td style={td}><Eq tex="e^a" /></td>
              <td style={td}><Eq tex="e^{2a}(e^{2a}-1)" /></td>
              <td style={td}><Eq tex="-2a\,e^a" /></td>
            </tr>
            <tr>
              <td style={tdLabel}>High-energy</td>
              <td style={td}>—</td>
              <td style={td}><Eq tex="1 + b" /></td>
              <td style={td}><Eq tex="2a" /></td>
              <td style={td}><Eq tex="-b" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={caption}>
        <strong>Table 1.</strong> Higgs vacuum density and entropy for the two
        vacuum states, where <Eq tex="a" /> and <Eq tex="b" /> are dimensionless
        parameters from the partition function (Eq. 105–106).
      </div>
    </section>
  );
}

function Slider({ value, onChange }) {
  return (
    <div style={{ maxWidth: 500, margin: "12px auto 0", padding: "0 8px" }}>
      <div style={sliderLabel}>
        <span>r = r_min</span>
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
const table = { width: "100%", borderCollapse: "collapse", margin: "0 auto", maxWidth: 600 };
const th = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "rgba(0,212,255,0.5)", textAlign: "center", padding: "10px 8px", borderBottom: "1px solid rgba(0,212,255,0.15)" };
const td = { fontSize: 13, textAlign: "center", padding: "10px 8px", borderBottom: "1px solid rgba(0,212,255,0.05)", color: "rgba(200,210,220,0.7)" };
const tdLabel = { ...td, textAlign: "left", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "rgba(0,212,255,0.6)" };
