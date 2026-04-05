import { useState } from "react";
import "katex/dist/katex.min.css";
import { HighlightProvider } from "@/shared/HighlightContext.jsx";
import PaperShell from "@/shared/PaperShell.jsx";
import meta from "./meta.js";

import Framework from "./sections/Framework.jsx";
import SymmetryBreaking from "./sections/SymmetryBreaking.jsx";
import BlackHole from "./sections/BlackHole.jsx";
import SombreroFamily from "./sections/SombreroFamily.jsx";
import SpatialMapSection from "./sections/SpatialMapSection.jsx";
import Transition from "./sections/Transition.jsx";
import VevConservation from "./sections/VevConservation.jsx";
import Entropy from "./sections/Entropy.jsx";
import References from "./sections/References.jsx";

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

const anchor = { scrollMarginTop: 60 };

export default function Higgs2026({ onToggleJourney }) {
  const [r, setR] = useState(meta.paramDefault);

  return (
    <HighlightProvider>
      <PaperShell
        meta={meta}
        toc={TOC}
        param={r}
        onParam={setR}
        onToggleJourney={onToggleJourney}
      >
        <div id="framework" style={anchor}><Framework /></div>
        <div id="symmetry" style={anchor}><SymmetryBreaking radialPos={r} onChangeR={setR} /></div>
        <div id="blackhole" style={anchor}><BlackHole radialPos={r} onChangeR={setR} /></div>
        <div id="sombrero" style={anchor}><SombreroFamily radialPos={r} onChangeR={setR} /></div>
        <div id="spatial" style={anchor}><SpatialMapSection /></div>
        <div id="transition" style={anchor}><Transition /></div>
        <div id="vev" style={anchor}><VevConservation radialPos={r} onChangeR={setR} /></div>
        <div id="entropy" style={anchor}><Entropy radialPos={r} onChangeR={setR} /></div>
        <References />
      </PaperShell>
    </HighlightProvider>
  );
}
