import Eq from "@/shared/Eq.jsx";
import { styles } from "@/theme.js";

export default function Algebra() {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>3. Poincar&eacute; Algebra</h2>

      <p style={styles.prose}>
        A natural concern with stochastic perturbations is whether they break
        the fundamental symmetries of spacetime. They do not. The metric is
        preserved under ML perturbation: the directional derivative of the
        perturbed coordinate equals that of the classical coordinate.
      </p>

      <Eq display num="27" tex={`
        \\partial_\\mu x^\\rho
        = \\tilde{\\partial}_\\mu \\tilde{x}^\\rho
        = g^\\rho_{\\;\\mu}
      `} />

      <p style={styles.prose}>
        More importantly, the canonical commutator between position and momentum
        is exactly conserved. The stochastic terms in <Eq tex="\tilde{x}" /> and
        in <Eq tex="\tilde{p}" /> cancel one another in the commutator, leaving
        the quantum-mechanical algebra unchanged:
      </p>

      <Eq display num="36" tex={`
        [\\tilde{x}^\\mu,\\,\\tilde{p}^\\nu]
        = [x^\\mu,\\,p^\\nu]
      `} />

      <p style={styles.prose}>
        Because both the metric and the commutator survive, the full Lie algebra
        of the Poincar&eacute; group holds in ML spacetime. Rotations, boosts,
        and translations retain their standard form. The fundamental symmetries
        of special relativity are not an approximation in ML spacetime — they
        are exact.
      </p>
    </section>
  );
}
