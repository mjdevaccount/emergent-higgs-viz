// Tests that KaTeX renders valid HTML (no parse errors) for all
// equations used in the paper sections.
// Run: node tests/eq-hover.test.js

import katex from "katex";

let passed = 0, failed = 0;

function assert(name, condition, detail) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${name}${detail ? " — " + detail : ""}`);
  }
}

function render(tex, displayMode = false) {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: false,
  });
}

function assertRenders(label, tex, displayMode = false) {
  const html = render(tex, displayMode);
  const hasError = html.includes("katex-error");
  assert(`${label} renders without error`, !hasError,
    hasError ? `KaTeX error in: ${tex.slice(0, 60)}` : undefined);
  return html;
}

// ─── Tests: all equations used in paper sections ───

console.log("KaTeX equation rendering:");

// Inline terms (used with HoverTerm wrappers)
assertRenders("r_0 inline", "r_0");
assertRenders("r_h inline", "r_h");
assertRenders("r_a inline", "r_a");
assertRenders("lambda/5 inline", "\\lambda/5");
assertRenders("phi inline", "\\phi");
assertRenders("U^- inline", "U^-");
assertRenders("U^+ inline", "U^+");

// Display equations from SymmetryBreaking (Eq. 32)
assertRenders("Eq.32 display", String.raw`\frac{U_\pm(r)}{m^2 \phi^2} = 2\left\{1 +
  \frac{2}{r^2}\left(\frac{1}{4} \mp \sqrt{\frac{r^2}{2r_0^2} - \frac{3}{16}}\right)^{\!2} +
  \frac{2}{r^4}\left(\frac{1}{4} \pm \sqrt{\frac{r^2}{2r_0^2} - \frac{3}{16}}\right)^{\!2}
  \right\}`, true);

// VevConservation (Eq. 57)
assertRenders("Eq.57 display", String.raw`U^{\text{SU(2)}}_{-}(r < r_0) = \text{const.} - \frac{1}{2}\mu^2 \phi^2
  + \frac{1}{5} \cdot \frac{1}{4} \frac{\mu^2}{v^2} \phi^4`, true);

// BlackHole (Eq. 38)
assertRenders("Eq.38 display", String.raw`U(r_h, \tilde{z}) = \text{const.} + \frac{m^2 \phi^2_{r_h}}{2}
  \left\{ -\frac{15}{16}\tilde{z}^2 + \frac{1}{16}\tilde{z}^4 \right\}`, true);

// BlackHole (Eq. 40)
assertRenders("Eq.40 display", String.raw`U^{\text{SU(2)}}_{-}(r_h) = \text{const.} - \mu^2 \Phi^\dagger_s \Phi_s
  + \frac{\lambda}{5} (\Phi^\dagger_s \Phi_s)^2`, true);

// VevConservation (Eq. 59)
assertRenders("Eq.59 display", String.raw`\phi^2_{\text{vev}} = v^2 + h^2 = 5v^2
  \quad \Rightarrow \quad h^2 = 4v^2 \gg v^2`, true);

// ─── Summary ───

console.log(`\n  ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
