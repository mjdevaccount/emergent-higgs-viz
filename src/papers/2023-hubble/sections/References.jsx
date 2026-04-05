import SharedReferences from "@/shared/References.jsx";
import meta from "../meta.js";

const related = [
  { author: "Pilipovi\u0107, D.", year: 2026, title: "Emergent Higgs Field and the Schwarzschild Black Hole", journal: "Particles", vol: "9(2), 37", doi: "10.3390/particles9020037" },
  { author: "Pilipovi\u0107, D.", year: 2024, title: "An Infinitely Old Universe with Planck Fields Before and After the Big Bang", journal: "Universe", vol: "10, 400", doi: "10.3390/universe10100400" },
  { author: "Pilipovi\u0107, D.", year: 2024, title: "The Algebra and Calculus of Stochastically Perturbed Spacetime", journal: "Symmetry", vol: "16, 36", doi: "10.3390/sym16010036" },
  { author: "Riess, A. et al.", year: 2022, title: "A Comprehensive Measurement of the Local Value of the Hubble Constant", journal: "ApJ", vol: "934, 1\u201352", doi: "10.3847/1538-4357/ac8f24" },
];

export default function References() {
  return <SharedReferences meta={meta} related={related} testCount={70} testFile="hubble-physics.test.js" />;
}
