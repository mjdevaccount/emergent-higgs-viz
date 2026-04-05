import { useState, useRef, useEffect } from "react";
import { R_MIN } from "../physics.js";
import Eq from "./Eq.jsx";
import EntropyMap from "../components/EntropyMap.jsx";
import { colors, rgba, fonts, styles } from "../theme.js";

export default function Entropy({ radialPos, onChangeR }) {
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
      <h2 style={styles.heading}>4. Higgs Vacuum Entropy</h2>

      <p style={styles.prose}>
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

      <p style={styles.prose}>
        The entropy <Eq tex="S \propto -\alpha_1" /> (Eq. 114). The ground
        state <Eq tex="\alpha_1^-" /> changes sign
        at <Eq tex="r^2 = \tfrac{1}{2}r_0^2" />, giving positive entropy inside
        the Schwarzschild sphere and negative entropy in the accretion region.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <EntropyMap
            radialPos={radialPos}
            width={Math.min(width - 16, 700)}
            height={300}
          />
        )}
        <Slider value={radialPos} onChange={onChangeR} />
        <div style={styles.figureCaption}>
          <strong>Figure 6.</strong> Parameters <Eq tex="\alpha_1^-" /> (solid
          cyan) and <Eq tex="\alpha_2^+" /> (dashed orange) plotted
          across <Eq tex="r/r_0" />. Green region: positive entropy.
          Red: negative entropy.
        </div>
      </div>

      <p style={styles.prose}>
        The vacuum density, Green's function, and entropy follow from the
        partition function (Eq. 107–111). For high-energy Higgs fields
        inside the Schwarzschild sphere:
      </p>

      {/* Table 1 from paper */}
      <div style={{ overflowX: "auto", margin: "20px 0" }}>
        <table style={table}>
          <thead>
            <tr>
              <th style={styles.th}></th>
              <th style={styles.th}><Eq tex="\langle q^n \rangle" /></th>
              <th style={styles.th}><Eq tex="p_k" /></th>
              <th style={styles.th}><Eq tex="G_{pp}" /></th>
              <th style={styles.th}><Eq tex="S_k" /></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdLabel}>b ≫ a</td>
              <td style={styles.td}><Eq tex="b^n" /></td>
              <td style={styles.td}><Eq tex="e^b" /></td>
              <td style={styles.td}>0</td>
              <td style={styles.td}><Eq tex="-b\,e^b" /></td>
            </tr>
            <tr>
              <td style={tdLabel}>a ≫ b</td>
              <td style={styles.td}><Eq tex="(2a)^{n/2}" /> (even n)</td>
              <td style={styles.td}><Eq tex="e^a" /></td>
              <td style={styles.td}><Eq tex="e^{2a}(e^{2a}-1)" /></td>
              <td style={styles.td}><Eq tex="-2a\,e^a" /></td>
            </tr>
            <tr>
              <td style={tdLabel}>High-energy</td>
              <td style={styles.td}>—</td>
              <td style={styles.td}><Eq tex="1 + b" /></td>
              <td style={styles.td}><Eq tex="2a" /></td>
              <td style={styles.td}><Eq tex="-b" /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={styles.figureCaption}>
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
      <div style={styles.sliderLabel}>
        <span>r = r_min</span>
        <span style={{ color: colors.gold }}>r / r₀ = {value.toFixed(3)}</span>
        <span>r = 4r₀</span>
      </div>
      <input type="range" min={R_MIN + 0.001} max={4.0} step={0.001}
        value={value} onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", cursor: "pointer", marginTop: 4 }} />
    </div>
  );
}

const table = { width: "100%", borderCollapse: "collapse", margin: "0 auto", maxWidth: 600 };
const tdLabel = { ...styles.td, textAlign: "left", fontFamily: fonts.mono, fontSize: 11, color: rgba(colors.cyan, 0.6) };
