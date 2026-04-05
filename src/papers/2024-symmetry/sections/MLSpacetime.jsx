import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { styles } from "@/theme.js";
import { TERMS } from "../highlight.js";

export default function MLSpacetime() {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>1. ML Spacetime</h2>

      <p style={styles.prose}>
        In <HoverTerm term={TERMS.mlSpacetime}>minimum-length (ML) spacetime</HoverTerm>, every point carries an intrinsic
        uncertainty. The physical coordinate is not the classical
        value <Eq tex="x" /> but a stochastically perturbed
        version <Eq tex="\tilde{x} = x + \delta\xi_x" />, where the
        perturbation <Eq tex="\delta\xi" /> is drawn from a Gaussian with
        standard deviation <Eq tex="\sigma\sqrt{\delta t}" />:
      </p>

      <Eq display num="1" tex={`
        \\delta\\xi^\\mu_x \\sim \\mathcal{N}(0,\\,\\sigma_\\xi\\sqrt{\\delta t}),
        \\qquad \\langle \\delta\\xi^\\mu_x \\rangle = 0
      `} />

      <Eq display num="3" tex={`
        \\tilde{x} = x + \\delta\\xi_x
      `} />

      <p style={styles.prose}>
        Two-point correlation functions set the magnitude of these perturbations,
        ensuring they respect the minimum length scale. The diffusion
        parameter <Eq tex="D = c\sigma^2" /> emerges naturally and plays a role
        analogous to the Hubble parameter <Eq tex="H" /> for governing how
        spacetime uncertainty evolves. Where <Eq tex="H" /> measures the
        expansion rate of geometry, <Eq tex="D" /> measures the rate at which
        stochastic fluctuations spread through spacetime.
      </p>

      <p style={styles.prose}>
        This construction introduces no new particles or fields. The only
        addition is a minimum length scale enforced through <HoverTerm term={TERMS.randomWalk}>stochastic
        perturbations</HoverTerm> of the coordinates themselves. Everything that follows
        derives from this single, simple premise.
      </p>
    </section>
  );
}
