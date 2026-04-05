// Tests that KaTeX DOM scanning finds hoverable terms.
// Catches bugs like U+200B zero-width spaces breaking text matching.
// Run: node tests/eq-hover.test.js

import katex from "katex";
import { parseHTML } from "linkedom";

let passed = 0, failed = 0;

function assert(name, condition, detail) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${name}${detail ? " — " + detail : ""}`);
  }
}

// ─── Reproduce the exact scanning logic from Eq.jsx ───

const strip = (s) => s.replace(/[\s\u200B]/g, "");

function scanTerms(html) {
  const { document } = parseHTML(`<div>${html}</div>`);
  const root = document.querySelector("div");
  const found = {};

  const allSpans = root.querySelectorAll(
    ".katex-html .mord, .katex-html .mfrac"
  );

  for (const el of allSpans) {
    const text = strip(el.textContent);

    if (text === "r0" && el.querySelector(".msupsub")) {
      found.r0 = (found.r0 || 0) + 1;
    }
    if (text === "rh" && el.querySelector(".msupsub")) {
      found.rh = (found.rh || 0) + 1;
    }
    if (text === "ra" && el.querySelector(".msupsub")) {
      found.ra = (found.ra || 0) + 1;
    }
    if (el.classList.contains("mfrac")) {
      const digits = strip(el.textContent).split("").sort().join("");
      if (digits === "15") {
        found.lambda5 = (found.lambda5 || 0) + 1;
      }
    }
  }

  return found;
}

function render(tex, displayMode = false) {
  return katex.renderToString(tex, {
    displayMode,
    throwOnError: false,
    strict: false,
  });
}

// ─── Tests ───

console.log("Equation hover term detection:");

// Inline subscript terms
{
  const found = scanTerms(render("r_0"));
  assert("r_0 inline detected", found.r0 === 1,
    `expected 1, got ${found.r0 || 0}`);
}

{
  const found = scanTerms(render("r_h"));
  assert("r_h inline detected", found.rh === 1,
    `expected 1, got ${found.rh || 0}`);
}

{
  const found = scanTerms(render("r_a"));
  assert("r_a inline detected", found.ra === 1,
    `expected 1, got ${found.ra || 0}`);
}

// r_0^2 should NOT match r0 (text is "r02")
{
  const found = scanTerms(render("r_0^2"));
  assert("r_0^2 does NOT match r0", !found.r0,
    `false positive: matched ${found.r0} times`);
}

// Fraction 1/5
{
  const found = scanTerms(render(String.raw`\frac{1}{5}`, true));
  assert("\\frac{1}{5} detected as lambda5", found.lambda5 >= 1,
    `expected >=1, got ${found.lambda5 || 0}`);
}

// Other fractions should NOT match lambda5
{
  const found = scanTerms(render(String.raw`\frac{1}{2}`, true));
  assert("\\frac{1}{2} does NOT match lambda5", !found.lambda5,
    `false positive`);
}

{
  const found = scanTerms(render(String.raw`\frac{3}{16}`, true));
  assert("\\frac{3}{16} does NOT match lambda5", !found.lambda5,
    `false positive`);
}

// Real equations from the paper
{
  const tex = String.raw`U^{\text{SU(2)}}_{-}(r < r_0) = \text{const.} - \frac{1}{2}\mu^2 \phi^2 + \frac{1}{5} \cdot \frac{1}{4} \frac{\mu^2}{v^2} \phi^4`;
  const found = scanTerms(render(tex, true));
  assert("Eq.57: finds r_0", found.r0 >= 1,
    `expected >=1, got ${found.r0 || 0}`);
  assert("Eq.57: finds 1/5", found.lambda5 >= 1,
    `expected >=1, got ${found.lambda5 || 0}`);
}

{
  const tex = String.raw`r_h \approx 0.65\,r_0`;
  const found = scanTerms(render(tex));
  assert("Prose 'r_h ≈ 0.65 r_0': finds r_h", found.rh >= 1,
    `expected >=1, got ${found.rh || 0}`);
  assert("Prose 'r_h ≈ 0.65 r_0': finds r_0", found.r0 >= 1,
    `expected >=1, got ${found.r0 || 0}`);
}

{
  const tex = String.raw`r_a \approx 3.10\,r_0`;
  const found = scanTerms(render(tex));
  assert("Prose 'r_a ≈ 3.10 r_0': finds r_a", found.ra >= 1,
    `expected >=1, got ${found.ra || 0}`);
}

// ─── Summary ───

console.log(`\n  ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
