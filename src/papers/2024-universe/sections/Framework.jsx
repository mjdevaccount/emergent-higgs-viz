import Eq from "@/shared/Eq.jsx";
import { styles } from "@/theme.js";

export default function Framework() {
  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>1. RWML Framework</h2>

      <p style={styles.prose}>
        In the Robertson-Walker minimum length (RWML) theory, each point in
        spacetime carries a Planck-scale stochastic
        uncertainty <Eq tex="\delta\xi" />. Demanding that the proper time
        functional remain invariant under stochastic translation extends the
        Christoffel connection with new diffusive terms, introducing a
        diffusion parameter <Eq tex="D = c\sigma^2 / a^2" /> that acts
        alongside the Hubble parameter <Eq tex="H" />. Their ratio defines
        the single sweep parameter of this paper:
      </p>

      <Eq display num="20" tex={`
        X \\equiv \\frac{D}{H}
      `} />

      <p style={styles.prose}>
        The extended Friedmann equations acquire diffusive corrections at every
        order. For individual species with equation of state
        parameter <Eq tex="w_i" />, the energy density evolves as:
      </p>

      <Eq display num="16" tex={`
        \\frac{\\dot{\\rho}_i}{\\rho_i}
        = -3\\bigl\\{(1+w_i)H + 2(1+3w_i)D\\bigr\\}
      `} />

      <p style={styles.prose}>
        The key assumption is a torsionless universe with conserved total
        energy density (<Eq tex="\dot{\rho} = 0" />). Under this constraint
        the modified Friedmann equation for the energy density becomes:
      </p>

      <Eq display num="41" tex={`
        \\frac{8\\pi G\\,\\rho}{3H^2}
        = 1 - \\tfrac{3}{2}\\,X + 9\\,X^2
      `} />

      <p style={styles.prose}>
        Large <Eq tex="X" /> corresponds to the diffusion-dominated far past;
        small <Eq tex="X" /> to the geometry-dominated far future. The Big
        Bang sits at <Eq tex="X = 4/3" />, where the acceleration diverges.
        Everything that follows traces the consequences of sweeping this single
        parameter from infinity to zero.
      </p>
    </section>
  );
}
