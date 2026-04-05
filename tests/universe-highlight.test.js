// Contract tests for 2024-universe highlight system.
// Verifies term definitions, matching functions, and consumer map.
// Run: node tests/universe-highlight.test.js

import {
  TERMS, ALL_TERMS, TERM_CONSUMERS,
  isBigBangHighlighted, isVacuumHighlighted,
  isDiffusionHighlighted, isSombreroHighlighted,
} from "../src/papers/2024-universe/highlight.js";

let passed = 0, failed = 0;

function assert(name, condition, detail) {
  if (condition) { passed++; }
  else { failed++; console.error(`  FAIL: ${name}${detail ? " — " + detail : ""}`); }
}

// ── Term definitions ────────────────────────────────────────────
console.log("Term definitions:");
assert("TERMS has bigBang", TERMS.bigBang === "bigBang");
assert("TERMS has vacuum", TERMS.vacuum === "vacuum");
assert("TERMS has diffusion", TERMS.diffusion === "diffusion");
assert("TERMS has sombrero", TERMS.sombrero === "sombrero");
assert("ALL_TERMS has 4 entries", ALL_TERMS.size === 4);

// ── Contract: every term has consumers ──────────────────────────
console.log("\nContract — every term has consumers:");
for (const term of ALL_TERMS) {
  const consumers = TERM_CONSUMERS[term];
  assert(`${term} has consumers`, Array.isArray(consumers) && consumers.length > 0);
}

// ── Matching functions ──────────────────────────────────────────
console.log("\nisBigBangHighlighted:");
assert("matches bigBang", isBigBangHighlighted(TERMS.bigBang) === true);
assert("rejects vacuum", isBigBangHighlighted(TERMS.vacuum) === false);
assert("rejects null", isBigBangHighlighted(null) === false);

console.log("\nisVacuumHighlighted:");
assert("matches vacuum", isVacuumHighlighted(TERMS.vacuum) === true);
assert("rejects diffusion", isVacuumHighlighted(TERMS.diffusion) === false);

console.log("\nisDiffusionHighlighted:");
assert("matches diffusion", isDiffusionHighlighted(TERMS.diffusion) === true);
assert("rejects vacuum", isDiffusionHighlighted(TERMS.vacuum) === false);

console.log("\nisSombreroHighlighted:");
assert("matches sombrero", isSombreroHighlighted(TERMS.sombrero) === true);
assert("rejects bigBang", isSombreroHighlighted(TERMS.bigBang) === false);

// ── Consumer map completeness ───────────────────────────────────
console.log("\nConsumer map:");
assert("bigBang has 3 consumers", TERM_CONSUMERS[TERMS.bigBang].length === 3);
assert("vacuum has 3 consumers", TERM_CONSUMERS[TERMS.vacuum].length === 3);
assert("diffusion has 2 consumers", TERM_CONSUMERS[TERMS.diffusion].length === 2);
assert("sombrero has 1 consumer", TERM_CONSUMERS[TERMS.sombrero].length === 1);

// ── Summary ─────────────────────────────────────────────────────
console.log(`\n${"═".repeat(40)}`);
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
