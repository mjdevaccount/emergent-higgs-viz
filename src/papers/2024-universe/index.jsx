import { useState } from "react";
import "katex/dist/katex.min.css";
import { HighlightProvider } from "@/shared/HighlightContext.jsx";
import PaperShell from "@/shared/PaperShell.jsx";
import meta from "./meta.js";

import Framework from "./sections/Framework.jsx";
import Tension from "./sections/Tension.jsx";
import Curvature from "./sections/Curvature.jsx";
import Acceleration from "./sections/Acceleration.jsx";
import Species from "./sections/Species.jsx";
import PlanckFields from "./sections/PlanckFields.jsx";
import References from "./sections/References.jsx";

const TOC = [
  { id: "framework", label: "Framework" },
  { id: "tension", label: "Tension" },
  { id: "curvature", label: "Curvature" },
  { id: "acceleration", label: "Acceleration" },
  { id: "species", label: "Species" },
  { id: "planck", label: "Planck Fields" },
];

const anchor = { scrollMarginTop: 60 };

export default function Universe2024({ onBack }) {
  const [X, setX] = useState(meta.paramDefault);

  return (
    <HighlightProvider>
      <PaperShell meta={meta} toc={TOC} param={X} onParam={setX} onBack={onBack}>
        <div id="framework" style={anchor}><Framework /></div>
        <div id="tension" style={anchor}><Tension param={X} onChangeParam={setX} /></div>
        <div id="curvature" style={anchor}><Curvature param={X} onChangeParam={setX} /></div>
        <div id="acceleration" style={anchor}><Acceleration param={X} onChangeParam={setX} /></div>
        <div id="species" style={anchor}><Species param={X} onChangeParam={setX} /></div>
        <div id="planck" style={anchor}><PlanckFields /></div>
        <References />
      </PaperShell>
    </HighlightProvider>
  );
}
