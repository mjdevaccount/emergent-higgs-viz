import { useState } from "react";
import "katex/dist/katex.min.css";
import { R_MIN } from "./physics.js";
import Header from "./paper/Header.jsx";
import Framework from "./paper/Framework.jsx";
import SymmetryBreaking from "./paper/SymmetryBreaking.jsx";
import BlackHole from "./paper/BlackHole.jsx";
import SombreroFamily from "./paper/SombreroFamily.jsx";
import SpatialMapSection from "./paper/SpatialMapSection.jsx";
import Transition from "./paper/Transition.jsx";
import VevConservation from "./paper/VevConservation.jsx";
import Entropy from "./paper/Entropy.jsx";
import References from "./paper/References.jsx";

const TOC = [
  { id: "framework", label: "Framework" },
  { id: "symmetry", label: "Symmetry Breaking" },
  { id: "blackhole", label: "Black Hole" },
  { id: "sombrero", label: "Sombrero Family" },
  { id: "spatial", label: "Spatial Map" },
  { id: "transition", label: "Transition" },
  { id: "vev", label: "VEV Conservation" },
  { id: "entropy", label: "Entropy" },
];

export default function Paper() {
  const [r, setR] = useState(2.0);

  return (
    <div style={container}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />

      {/* Sticky shared slider */}
      <div style={stickySlider}>
        <span style={sliderLabel}>r / r₀ = {r.toFixed(3)}</span>
        <input
          type="range"
          min={R_MIN + 0.001}
          max={4.0}
          step={0.001}
          value={r}
          onChange={(e) => setR(parseFloat(e.target.value))}
          style={sliderInput}
        />
        <div style={tocRow}>
          {TOC.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              style={tocLink}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <Header />
      <div id="framework"><Framework /></div>
      <div id="symmetry"><SymmetryBreaking radialPos={r} onChangeR={setR} /></div>
      <div id="blackhole"><BlackHole radialPos={r} onChangeR={setR} /></div>
      <div id="sombrero"><SombreroFamily radialPos={r} onChangeR={setR} /></div>
      <div id="spatial"><SpatialMapSection /></div>
      <div id="transition"><Transition /></div>
      <div id="vev"><VevConservation radialPos={r} onChangeR={setR} /></div>
      <div id="entropy"><Entropy radialPos={r} onChangeR={setR} /></div>
      <References />
    </div>
  );
}

const container = {
  minHeight: "100vh",
  background: "radial-gradient(ellipse at 50% 0%, #0d1117 0%, #060610 50%, #020208 100%)",
  color: "#e0e8f0",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  paddingTop: 56,
};

const stickySlider = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 800,
  background: "rgba(6,6,16,0.92)",
  backdropFilter: "blur(12px)",
  borderBottom: "1px solid rgba(0,212,255,0.08)",
  padding: "8px 24px",
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const sliderLabel = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  color: "#ffd700",
  minWidth: 100,
};

const sliderInput = {
  flex: 1,
  minWidth: 120,
  maxWidth: 300,
  cursor: "pointer",
};

const tocRow = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginLeft: "auto",
};

const tocLink = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 9,
  letterSpacing: 1,
  color: "rgba(0,212,255,0.4)",
  textDecoration: "none",
  textTransform: "uppercase",
  padding: "2px 6px",
  borderRadius: 3,
  transition: "color 0.2s",
};
