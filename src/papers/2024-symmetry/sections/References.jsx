import SharedReferences from "@/shared/References.jsx";
import meta from "../meta.js";

const related = [
  { author: "Pilipovi\u0107, D.", year: 2026, title: "Emergent Higgs Field and the Schwarzschild Black Hole", journal: "Particles", vol: "9(2), 37", doi: "10.3390/particles9020037" },
  { author: "Pilipovi\u0107, D.", year: 2024, title: "An Infinitely Old Universe with Planck Fields Before and After the Big Bang", journal: "Universe", vol: "10, 400", doi: "10.3390/universe10100400" },
  { author: "Pilipovi\u0107, D.", year: 2023, title: "Late-time dark energy and Hubble tension", journal: "Open Astronomy", vol: "32, 20220221", doi: "10.1515/astro-2022-0221" },
  { author: "Lelli, F., McGaugh, S., Schombert, J.", year: 2016, title: "SPARC: Mass models for 175 disk galaxies", journal: "Astron. J.", vol: "152, 157", doi: "10.3847/0004-6256/152/6/157" },
];

export default function References() {
  return <SharedReferences meta={meta} related={related} testCount={86} testFile="symmetry-physics.test.js" />;
}
