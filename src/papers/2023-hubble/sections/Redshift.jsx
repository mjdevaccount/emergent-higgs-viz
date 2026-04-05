import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import { TERMS } from "../highlight.js";
import meta from "../meta.js";
import LuminosityPlot from "../viz/LuminosityPlot.jsx";

export default function Redshift() {
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
      <h2 style={styles.heading}>4. Redshift and Luminosity Distance</h2>

      <p style={styles.prose}>
        In the RWML framework, the observed redshift receives contributions from
        both the Hubble expansion and the diffusive nature of spacetime.
        Photons travelling through a stochastic geometry accumulate an additional
        shift proportional to <Eq tex="D/H" />:
      </p>

      <Eq display num="18" tex={`
        1 + z = \\frac{a_2}{a_1}\\,
        \\exp\\!\\left(\\frac{D_1}{H_1} - \\frac{D_2}{H_2}\\right)
      `} />

      <p style={styles.prose}>
        When the luminosity distance is reformulated to include diffusion, the
        RWML model with <Eq tex="H_0 = 67.4" /> km/s/Mpc
        and <Eq tex="D \approx 1" /> km/s/Mpc reproduces the same supernova
        data that <Eq tex="\Lambda" />CDM fits only
        with <Eq tex="H_0 = 73.2" /> km/s/Mpc. This resolves
        the <HoverTerm term={TERMS.hubbleTension}>Hubble tension</HoverTerm>:
        there is no need for a higher expansion rate once the diffusive
        contribution to redshift is accounted for.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <LuminosityPlot
            width={Math.min(width - 16, 600)}
            height={340}
            highlight={active}
          />
        )}
        <div style={styles.figureCaption}>
          <strong>Luminosity distance vs. redshift</strong> — SNe Ia data (cyan dots)
          fitted by both RWML (gold, H=67.4) and LCDM (dashed, H=73.2).
        </div>
      </div>
    </section>
  );
}
