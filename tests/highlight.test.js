// Tests for the highlight system: term definitions, matching logic, and
// producer↔consumer contract. Catches mismatched term strings, orphaned
// terms, and broken matching logic.
// Run: node tests/highlight.test.js

import {
  TERMS, ALL_TERMS, TERM_CONSUMERS,
  isRadiusHighlighted, isVevGlowing,
} from "../src/paper/highlight.js";

let passed = 0, failed = 0;

function assert(name, condition, detail) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${name}${detail ? " — " + detail : ""}`);
  }
}

// ═══ Term definitions ═══
console.log("Term definitions:");

assert("TERMS.r0 exists", TERMS.r0 === "r0");
assert("TERMS.rh exists", TERMS.rh === "rh");
assert("TERMS.ra exists", TERMS.ra === "ra");
assert("TERMS.lambda5 exists", TERMS.lambda5 === "lambda5");
assert("ALL_TERMS has correct size", ALL_TERMS.size === 4,
  `expected 4, got ${ALL_TERMS.size}`);
assert("TERMS is frozen", Object.isFrozen(TERMS));

// ═══ Contract: every term has consumers ═══
console.log("\nContract — every term has at least one consumer:");

for (const term of ALL_TERMS) {
  const consumers = TERM_CONSUMERS[term];
  assert(`${term} has consumers`, consumers && consumers.length > 0,
    `no consumers registered for "${term}"`);
}

// Contract: no consumer references a nonexistent term
console.log("\nContract — no consumer references unknown terms:");

for (const [term, consumers] of Object.entries(TERM_CONSUMERS)) {
  assert(`${term} is a valid term`, ALL_TERMS.has(term),
    `"${term}" in TERM_CONSUMERS but not in ALL_TERMS`);
}

// ═══ isRadiusHighlighted ═══
console.log("\nisRadiusHighlighted:");

// Exact match
assert("r0 highlights r0", isRadiusHighlighted("r0", "r0"));
assert("rh highlights rh", isRadiusHighlighted("rh", "rh"));
assert("ra highlights ra", isRadiusHighlighted("ra", "ra"));

// Non-matches
assert("r0 does NOT highlight rh", !isRadiusHighlighted("r0", "rh"));
assert("rh does NOT highlight r0", !isRadiusHighlighted("rh", "r0"));
assert("lambda5 does NOT highlight r0", !isRadiusHighlighted("lambda5", "r0"));
assert("null does NOT highlight anything", !isRadiusHighlighted(null, "r0"));

// Non-hoverable radii (rmin, rt don't have scanner terms)
assert("rmin never highlights", !isRadiusHighlighted("r0", "rmin"));
assert("rt never highlights", !isRadiusHighlighted("r0", "rt"));

// ═══ isVevGlowing ═══
console.log("\nisVevGlowing:");

// Should glow
assert("VEV glows for lambda5", isVevGlowing("lambda5"));
assert("VEV glows for r0", isVevGlowing("r0"));

// Should NOT glow
assert("VEV does NOT glow for rh", !isVevGlowing("rh"));
assert("VEV does NOT glow for ra", !isVevGlowing("ra"));
assert("VEV does NOT glow for null", !isVevGlowing(null));
assert("VEV does NOT glow for undefined", !isVevGlowing(undefined));
assert("VEV does NOT glow for empty string", !isVevGlowing(""));

// ═══ Integration: scanner terms match consumer expectations ═══
// The eq-hover tests verify the scanner emits these exact strings.
// This verifies the consumer functions accept those same strings.
console.log("\nIntegration — scanner output matches consumer input:");

const SCANNER_OUTPUTS = ["r0", "rh", "ra", "lambda5"];

for (const term of SCANNER_OUTPUTS) {
  assert(`scanner term "${term}" is in ALL_TERMS`, ALL_TERMS.has(term),
    `scanner emits "${term}" but it's not in the TERMS enum`);
}

// Verify scanner covers all terms (no term goes un-produced)
for (const term of ALL_TERMS) {
  assert(`term "${term}" is produced by scanner`, SCANNER_OUTPUTS.includes(term),
    `"${term}" defined in TERMS but scanner never produces it`);
}

// ═══ Summary ═══
console.log(`\n  ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
