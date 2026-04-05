import { useRef, useEffect, useState } from "react";
import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import { TERMS } from "../highlight.js";
import PlanckPotential from "../viz/PlanckPotential.jsx";

export default function PlanckFields() {
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
      <h2 style={styles.heading}>6. Planck Field Action and Symmetry Breaking</h2>

      <p style={styles.prose}>
        The Ricci scalar of the stochastically perturbed spacetime defines the
        action entirely -- no Lagrangian is assumed. The Planck
        fields <Eq tex="\hat{\varphi}_i" /> are constructed directly from the
        stochastic perturbations, with the diffusion parameter emerging
        as <Eq tex="D = (\varphi_{i,\alpha})^2" />. The resulting action
        yields a pure quartic potential:
      </p>

      <Eq display num="72" tex={`
        S = \\int d^4x\\,\\sqrt{-g}\\left(
          -\\tfrac{1}{2}(\\nabla\\hat{\\varphi})^2
          - \\tfrac{\\lambda}{4}(\\hat{\\varphi}^2)^2
        \\right)
      `} />

      <p style={styles.prose}>
        Transitioning to spherical field coordinates breaks the symmetry. One
        radial mode acquires a nonzero VEV and mass, producing the familiar
        <HoverTerm term={TERMS.sombrero}>sombrero potential</HoverTerm>. This is the cosmological origin of the mechanism
        explored in the companion 2026 paper on the emergent Higgs field:
      </p>

      <Eq display num="89" tex={`
        S = \\int d^4x\\,\\sqrt{-g}\\left(
          -\\tfrac{1}{2}(\\nabla\\hat{\\varphi})^2
          + \\mu^2\\hat{\\varphi}^2
          - \\tfrac{\\lambda}{4}(\\hat{\\varphi}^2)^2
        \\right)
      `} />

      <p style={styles.prose}>
        The mass <Eq tex="\mu^2" /> is set by the geometry (Eq. 90), and the
        transition from the quartic to the sombrero is spontaneous symmetry
        breaking driven by spacetime curvature itself.
      </p>

      <div style={styles.figureBox}>
        {width > 0 && (
          <PlanckPotential width={Math.min(width - 16, 600)} height={300} highlight={active} />
        )}
        <div style={styles.figureCaption}>
          <strong>Planck field potentials</strong> -- the
          pure <Eq tex="\varphi^4" /> potential (Eq. 72, dashed) and the
          <HoverTerm term={TERMS.sombrero}>sombrero</HoverTerm> after SSB (Eq. 89, solid). Symmetry breaking is driven by
          spacetime geometry, not an assumed Lagrangian.
        </div>
      </div>
    </section>
  );
}
