import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import { TERMS } from "../highlight.js";
import PhaseSpaceSim from "../viz/PhaseSpaceSim.jsx";

export default function ClassicalRegime() {
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
      <h2 style={styles.heading}>2. Classical Regime</h2>

      <p style={styles.prose}>
        When <HoverTerm term={TERMS.mlSpacetime}>ML uncertainty</HoverTerm> is applied to classical particles, the Langevin
        equations reveal an asymmetry between position and momentum. Position
        follows a <HoverTerm term={TERMS.randomWalk}>random walk</HoverTerm> whose uncertainty grows
        as <Eq tex="\sqrt{t}" />, just as one would expect from a diffusion
        process. But momentum behaves very differently:
      </p>

      <Eq display num="6" tex={`
        \\delta\\tilde{x}
        = \\frac{1}{m}\\,\\tilde{p}\\;\\delta t + \\delta\\xi
      `} />

      <Eq display num="14" tex={`
        \\tilde{p} = p_0 + m\\sqrt{c_\\xi}\\;\\delta\\xi
        \\qquad \\text{(bounded uncertainty)}
      `} />

      <p style={styles.prose}>
        Momentum uncertainty stays bounded rather than growing without limit.
        This is the key insight: diffusion affects position and momentum in
        fundamentally different ways. The phase-space simulation below
        illustrates this contrast. Watch how the position cloud spreads
        continuously while the momentum cloud remains confined.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <PhaseSpaceSim width={Math.min(width - 16, 600)} height={300} highlight={active} />
        )}
        <div style={styles.figureCaption}>
          <strong>Phase-space evolution</strong> — position uncertainty diffuses
          outward while momentum uncertainty remains bounded.
        </div>
      </div>
    </section>
  );
}
