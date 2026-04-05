// Contract tests for 2024-symmetry highlight system.
// Run: node tests/symmetry-highlight.test.js

import {
  TERMS, ALL_TERMS, TERM_CONSUMERS,
  isFlatVelocityHighlighted, isDarkMatterHighlighted,
  isMLSpacetimeHighlighted, isRandomWalkHighlighted,
} from "../src/papers/2024-symmetry/highlight.js";

let passed = 0, failed = 0;

function assert(name, condition, detail) {
  if (condition) { passed++; }
  else { failed++; console.error(`  FAIL: ${name}${detail ? " — " + detail : ""}`); }
}

console.log("Term definitions:");
assert("4 terms defined", ALL_TERMS.size === 4);
assert("flatVelocity", TERMS.flatVelocity === "flatVelocity");
assert("darkMatter", TERMS.darkMatter === "darkMatter");
assert("mlSpacetime", TERMS.mlSpacetime === "mlSpacetime");
assert("randomWalk", TERMS.randomWalk === "randomWalk");

console.log("\nContract — every term has consumers:");
for (const term of ALL_TERMS) {
  const consumers = TERM_CONSUMERS[term];
  assert(`${term} has consumers`, Array.isArray(consumers) && consumers.length > 0);
}

console.log("\nMatching functions:");
assert("flatVelocity matches", isFlatVelocityHighlighted(TERMS.flatVelocity));
assert("flatVelocity rejects null", !isFlatVelocityHighlighted(null));
assert("darkMatter matches", isDarkMatterHighlighted(TERMS.darkMatter));
assert("darkMatter rejects other", !isDarkMatterHighlighted(TERMS.flatVelocity));
assert("mlSpacetime matches", isMLSpacetimeHighlighted(TERMS.mlSpacetime));
assert("randomWalk matches", isRandomWalkHighlighted(TERMS.randomWalk));
assert("randomWalk rejects other", !isRandomWalkHighlighted(TERMS.darkMatter));

console.log("\nConsumer counts:");
assert("flatVelocity has 2 consumers", TERM_CONSUMERS[TERMS.flatVelocity].length === 2);
assert("darkMatter has 1 consumer", TERM_CONSUMERS[TERMS.darkMatter].length === 1);
assert("mlSpacetime has 1 consumer", TERM_CONSUMERS[TERMS.mlSpacetime].length === 1);
assert("randomWalk has 1 consumer", TERM_CONSUMERS[TERMS.randomWalk].length === 1);

console.log(`\n${"═".repeat(40)}`);
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
