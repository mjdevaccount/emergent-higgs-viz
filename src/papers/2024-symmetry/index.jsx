import { useState } from "react";
import "katex/dist/katex.min.css";
import PaperShell from "@/shared/PaperShell.jsx";
import { HighlightProvider } from "@/shared/HighlightContext.jsx";
import meta from "./meta.js";

import MLSpacetime from "./sections/MLSpacetime.jsx";
import ClassicalRegime from "./sections/ClassicalRegime.jsx";
import Algebra from "./sections/Algebra.jsx";
import RotationCurves from "./sections/RotationCurves.jsx";
import VelocityAnalysis from "./sections/VelocityAnalysis.jsx";

const TOC = [
  { id: "spacetime", label: "ML Spacetime" },
  { id: "classical", label: "Classical" },
  { id: "algebra", label: "Algebra" },
  { id: "rotation", label: "Rotation Curves" },
  { id: "velocity", label: "Velocity" },
];

const anchor = { scrollMarginTop: 60 };

export default function Symmetry2024({ onBack }) {
  const [R, setR] = useState(meta.paramDefault);

  return (
    <PaperShell meta={meta} toc={TOC} param={R} onParam={setR} onBack={onBack}>
      <HighlightProvider>
        <div id="spacetime" style={anchor}><MLSpacetime /></div>
        <div id="classical" style={anchor}><ClassicalRegime /></div>
        <div id="algebra" style={anchor}><Algebra /></div>
        <div id="rotation" style={anchor}><RotationCurves param={R} onChangeParam={setR} /></div>
        <div id="velocity" style={anchor}><VelocityAnalysis /></div>
      </HighlightProvider>
    </PaperShell>
  );
}
