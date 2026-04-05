import Eq from "@/shared/Eq.jsx";
import HoverTerm from "@/shared/HoverTerm.jsx";
import { useHighlight } from "@/shared/HighlightContext.jsx";
import { styles } from "@/theme.js";
import { TERMS } from "../highlight.js";

export default function Problem() {
  const { active } = useHighlight();

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>1. The Hubble Tension</h2>

      <p style={styles.prose}>
        Two independent measurements of the Hubble constant give incompatible
        answers. The cosmic microwave background (CMB), observed by the Planck
        satellite and calibrated through the physics of recombination, yields{" "}
        <Eq tex="H_0 \approx 67.4" /> km/s/Mpc. Meanwhile, the local distance
        ladder built from Cepheid-calibrated Type Ia supernovae gives{" "}
        <Eq tex="H_0 \approx 73" /> km/s/Mpc. The discrepancy now exceeds{" "}
        <Eq tex="5\sigma" /> and is known as the{" "}
        <HoverTerm term={TERMS.hubbleTension}>Hubble tension</HoverTerm>.
      </p>

      <p style={styles.prose}>
        The standard <Eq tex="\Lambda" />CDM model applies the same
        Friedmann equations to both epochs but arrives at different expansion
        rates. Either one measurement is systematically biased, or new physics
        is needed. This paper proposes a concrete mechanism: spacetime itself
        carries a stochastic minimum-length uncertainty that manifests as a{" "}
        <HoverTerm term={TERMS.diffusionParam}>diffusion parameter D</HoverTerm>.
        This diffusion contributes to the observed redshift alongside the
        geometric Hubble flow.
      </p>

      <p style={styles.prose}>
        Once <Eq tex="D" /> is included, the CMB value of <Eq tex="H_0" />{" "}
        successfully reproduces local supernova distances. What was previously
        attributed entirely to{" "}
        <HoverTerm term={TERMS.darkEnergy}>dark energy</HoverTerm> is partly the
        signature of diffusive spacetime, and the tension dissolves without
        invoking a higher expansion rate.
      </p>
    </section>
  );
}
