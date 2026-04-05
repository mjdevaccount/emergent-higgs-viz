import { useState } from "react";
import "katex/dist/katex.min.css";
import { HighlightProvider } from "@/shared/HighlightContext.jsx";
import PaperShell from "@/shared/PaperShell.jsx";
import meta from "./meta.js";
import Problem from "./sections/Problem.jsx";
import Diffusion from "./sections/Diffusion.jsx";
import StateParam from "./sections/StateParam.jsx";
import Redshift from "./sections/Redshift.jsx";

const TOC = [
  { id: "problem", label: "Tension" },
  { id: "diffusion", label: "Diffusion" },
  { id: "eos", label: "Equation of State" },
  { id: "redshift", label: "Redshift" },
];
const anchor = { scrollMarginTop: 60 };

export default function Hubble2023({ onBack }) {
  const [f, setF] = useState(meta.paramDefault);
  return (
    <HighlightProvider>
      <PaperShell meta={meta} toc={TOC} param={f} onParam={setF} onBack={onBack}>
        <div id="problem" style={anchor}><Problem /></div>
        <div id="diffusion" style={anchor}><Diffusion param={f} onChangeParam={setF} /></div>
        <div id="eos" style={anchor}><StateParam param={f} onChangeParam={setF} /></div>
        <div id="redshift" style={anchor}><Redshift /></div>
      </PaperShell>
    </HighlightProvider>
  );
}
