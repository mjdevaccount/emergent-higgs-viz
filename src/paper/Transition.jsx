import { useRef, useEffect, useState } from "react";
import Eq from "./Eq.jsx";
import HoverTerm from "./HoverTerm.jsx";
import { TERMS } from "./highlight.js";
import TransitionDiagram from "../components/TransitionDiagram.jsx";
import { styles } from "../theme.js";

export default function Transition() {
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
      <h2 style={styles.heading}>3.6–3.7. Transition Point & Metastable Vacuum</h2>

      <p style={styles.prose}>
        The transition from the maximally symmetric vacuum to the broken EW
        sector occurs just inside the Schwarzschild radius, at:
      </p>

      <Eq display num="52" tex={`
        r_T^2 = \\frac{7}{8}\\,r_0^2 \\quad \\Rightarrow \\quad r_T \\approx 0.935\\,r_0
      `} />

      <p style={styles.prose}>
        After transition, two paths are possible: a natural drop to the deep
        well minimum at <HoverTerm term={TERMS.rh}><Eq tex="r_h" /></HoverTerm>, or quantum tunneling outward to the
        accretion disk at <HoverTerm term={TERMS.ra}><Eq tex="r_a" /></HoverTerm>. The two scalar
        fields <Eq tex="\psi_s" /> (positive VEV)
        and <Eq tex="\psi_a" /> (negative VEV) are statistically entangled to
        ensure VEV preservation, with a tunneling
        probability <Eq tex="|\psi_a|^2 / |\psi_s|^2 \approx 1.13\%" />.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <TransitionDiagram width={Math.min(width - 16, 500)} height={280} />
        )}
        <div style={styles.figureCaption}>
          <strong>Figure 4.</strong> Transition point with drop to the ground
          state at <HoverTerm term={TERMS.rh}><Eq tex="r_h" /></HoverTerm>, or tunneling to the accretion disk
          at <HoverTerm term={TERMS.ra}><Eq tex="r_a" /></HoverTerm>.
        </div>
      </div>
    </section>
  );
}
