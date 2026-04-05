// Contract tests for 2023-hubble highlight system.
// Run: node tests/hubble-highlight.test.js

import {
  TERMS, ALL_TERMS, TERM_CONSUMERS,
  isHubbleTensionHighlighted, isDiffusionParamHighlighted, isDarkEnergyHighlighted,
} from "../src/papers/2023-hubble/highlight.js";

let passed = 0, failed = 0;

function assert(name, condition, detail) {
  if (condition) { passed++; }
  else { failed++; console.error(`  FAIL: ${name}${detail ? " — " + detail : ""}`); }
}

console.log("Term definitions:");
assert("3 terms defined", ALL_TERMS.size === 3);
assert("hubbleTension", TERMS.hubbleTension === "hubbleTension");
assert("diffusionParam", TERMS.diffusionParam === "diffusionParam");
assert("darkEnergy", TERMS.darkEnergy === "darkEnergy");

console.log("\nContract — every term has consumers:");
for (const term of ALL_TERMS) {
  assert(`${term} has consumers`, Array.isArray(TERM_CONSUMERS[term]) && TERM_CONSUMERS[term].length > 0);
}

console.log("\nMatching functions:");
assert("hubbleTension matches", isHubbleTensionHighlighted(TERMS.hubbleTension));
assert("hubbleTension rejects null", !isHubbleTensionHighlighted(null));
assert("diffusionParam matches", isDiffusionParamHighlighted(TERMS.diffusionParam));
assert("diffusionParam rejects other", !isDiffusionParamHighlighted(TERMS.darkEnergy));
assert("darkEnergy matches", isDarkEnergyHighlighted(TERMS.darkEnergy));
assert("darkEnergy rejects other", !isDarkEnergyHighlighted(TERMS.hubbleTension));

console.log(`\n${"═".repeat(40)}`);
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
