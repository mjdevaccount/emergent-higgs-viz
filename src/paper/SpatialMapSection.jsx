import { useRef, useEffect, useState } from "react";
import Eq from "./Eq.jsx";
import SpatialMap from "../components/SpatialMap.jsx";
import { colors, rgba, styles } from "../theme.js";

export default function SpatialMapSection() {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const measure = () => ref.current && setWidth(ref.current.clientWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const mapSize = Math.min(width - 16, 560);

  return (
    <section style={section} ref={ref}>
      <h2 style={heading}>The Central Thesis: EW Physics Mapped in Space</h2>

      <p style={styles.prose}>
        The paper's core insight is that the electroweak potential can be
        simultaneously mapped in physical space and across the EW sector. At
        each radial distance from the black hole center, the sombrero potential
        has a different shape — wider and shallower at the minima
        (<Eq tex="\lambda/5" />), tighter at the barrier. The two degenerate
        VEV solutions (<Eq tex="\pm v" />) in the EW sector map to two distinct
        points in space: one inside the Schwarzschild sphere, one at the
        accretion disk.
      </p>

      <div style={styles.figureBox}>
        {mapSize > 0 && <SpatialMap width={mapSize} height={mapSize} />}
        <div style={styles.figureCaption}>
          Radial map of the EW potential in physical space. Concentric rings
          mark the five key radii. Mini sombrero profiles at each ring show
          how the potential shape varies with position. The coupling drops
          to <Eq tex="\lambda/5" /> at both the deep well
          (<Eq tex="r_h" />) and accretion disk (<Eq tex="r_a" />).
        </div>
      </div>
    </section>
  );
}

const section = { ...styles.section, borderTop: `1px solid ${rgba(colors.cyan, 0.12)}` };
const heading = { ...styles.heading, color: colors.cyan };
