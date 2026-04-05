import SharedReferences from "@/shared/References.jsx";
import meta from "../meta.js";

const related = [
  { author: "Pilipovi\u0107, D.", year: 2026, title: "Emergent Higgs Field and the Schwarzschild Black Hole", journal: "Particles", vol: "9(2), 37", doi: "10.3390/particles9020037" },
  { author: "Pilipovi\u0107, D.", year: 2024, title: "The Algebra and Calculus of Stochastically Perturbed Spacetime", journal: "Symmetry", vol: "16, 36", doi: "10.3390/sym16010036" },
  { author: "Pilipovi\u0107, D.", year: 2023, title: "Late-time dark energy and Hubble tension", journal: "Open Astronomy", vol: "32, 20220221", doi: "10.1515/astro-2022-0221" },
];

export default function References() {
  return <SharedReferences meta={meta} related={related} testCount={41} testFile="universe-physics.test.js" />;
}
