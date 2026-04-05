import { useRef, useEffect, useState } from "react";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import { TERMS } from "../highlight.js";
import VelocityMassPlot from "../viz/VelocityMassPlot.jsx";

export default function VelocityAnalysis() {
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
      <h2 style={styles.heading}>5. Velocity vs Mass</h2>

      <p style={styles.prose}>
        If the ML prediction is correct and rotational velocity is truly
        <HoverTerm term={TERMS.flatVelocity}>constant at large radius</HoverTerm>, then it should not depend on galaxy mass.
        This is a testable prediction. Using 175 galaxies from the SPARC
        database, the simple average of flat-region velocities can be compared
        against the Newtonian and MOND expectations.
      </p>

      <p style={styles.prose}>
        The result is suggestive: the constant-velocity prediction performs
        comparably to both Newtonian gravity and MOND in fitting the data.
        The p-value for a velocity-mass correlation is zero across all three
        models — none of them captures the full scatter. This is preliminary,
        but it demonstrates that ML spacetime provides a purely geometric
        alternative to dark matter, one that requires no new particles, no
        modified force law, and no free parameters beyond the diffusion
        constant.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <VelocityMassPlot width={Math.min(width - 16, 600)} height={340} highlight={active} />
        )}
        <div style={styles.figureCaption}>
          <strong>SPARC galaxy sample</strong> — flat rotational velocity vs
          baryonic mass. The constant-velocity prediction (horizontal line)
          competes with Newtonian and MOND fits.
        </div>
      </div>
    </section>
  );
}
