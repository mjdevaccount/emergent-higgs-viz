import { useRef, useEffect, useState } from "react";
import Eq from "./Eq.jsx";
import SpatialMap from "../components/SpatialMap.jsx";

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

      <p style={prose}>
        The paper's core insight is that the electroweak potential can be
        simultaneously mapped in physical space and across the EW sector. At
        each radial distance from the black hole center, the sombrero potential
        has a different shape — wider and shallower at the minima
        (<Eq tex="\lambda/5" />), tighter at the barrier. The two degenerate
        VEV solutions (<Eq tex="\pm v" />) in the EW sector map to two distinct
        points in space: one inside the Schwarzschild sphere, one at the
        accretion disk.
      </p>

      <div style={figureBox}>
        {mapSize > 0 && <SpatialMap width={mapSize} height={mapSize} />}
        <div style={caption}>
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

const section = { maxWidth: 740, margin: "0 auto", padding: "40px 32px", borderTop: "1px solid rgba(0,212,255,0.12)" };
const heading = { fontSize: 22, fontWeight: 400, marginBottom: 16, color: "#00d4ff" };
const prose = { fontSize: 16, fontWeight: 300, lineHeight: 1.8, color: "rgba(200,210,220,0.75)", margin: "16px 0" };
const figureBox = { background: "rgba(8,12,24,0.5)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 8, padding: "16px", margin: "24px 0", display: "flex", flexDirection: "column", alignItems: "center" };
const caption = { fontSize: 13, fontStyle: "italic", color: "rgba(180,200,220,0.5)", textAlign: "center", marginTop: 12, lineHeight: 1.6, maxWidth: 500 };
