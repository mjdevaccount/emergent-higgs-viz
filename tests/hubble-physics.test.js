// Verification tests for 2023-hubble/physics.js
// Against: Pilipović, Open Astronomy 2023, 32, 20220221
// Run: node tests/hubble-physics.test.js

import {
  H0_CMB, F_TRANSITION,
  diffusionPlus, diffusionMinus, deltaF,
  equationOfState, equationOfStateFromX,
  luminosityDistanceRWML, luminosityDistanceLCDM,
  SNIA_DATA_NEAR, SNIA_DATA_FAR,
} from "../src/papers/2023-hubble/physics.js";

let passed = 0, failed = 0;

function assert(name, condition, detail) {
  if (condition) { passed++; }
  else { failed++; console.error(`  FAIL: ${name}${detail ? " — " + detail : ""}`); }
}

function approx(a, b, tol = 0.01) {
  return Math.abs(a - b) < tol;
}

// ── Constants ────────────────────────────────────────────────────
console.log("Constants:");
assert("H0_CMB = 67.4", H0_CMB === 67.4);
assert("F_TRANSITION ≈ 0.7998", approx(F_TRANSITION, 0.7998, 0.001));

// ── Eq. 12: Diffusion states D± ─────────────────────────────────
console.log("\nEq. 12 — D± (as X = D/H):");

// At f=1: δf=0, D+ = (1/12)(1 + 1) = 1/6, D- = (1/12)(1 - 1) = 0
assert("D+(f=1) ≈ 1/6", approx(diffusionPlus(1), 1 / 6, 0.01),
  `got ${diffusionPlus(1).toFixed(4)}`);
assert("D-(f=1) ≈ 0", approx(diffusionMinus(1), 0, 0.01),
  `got ${diffusionMinus(1).toFixed(4)}`);

// D+ should be positive for f > F_TRANSITION
assert("D+(0.8) > 0", diffusionPlus(0.8) > 0);
assert("D+(0.9) > 0", diffusionPlus(0.9) > 0);
assert("D+(1.0) > 0", diffusionPlus(1.0) > 0);

// D+ > D- for all valid f
assert("D+ > D- at f=0.9", diffusionPlus(0.9) > diffusionMinus(0.9));

// ── Eq. 14: δf(X) ──────────────────────────────────────────────
console.log("\nEq. 14 — δf(X):");
assert("δf(0) = 0", approx(deltaF(0.001), 0, 0.2));
assert("δf(1/6) = 0", approx(deltaF(1 / 6), 0, 0.001));
assert("δf diverges near X=4/3", Math.abs(deltaF(4 / 3 - 0.001)) > 1000);

// ── Eq. 15: Equation of state w ──────────────────────────────────
console.log("\nEq. 15 — w(f):");
// At f≈1: w → -5/7 ≈ -0.714 (Eq. A73 — D+≈H/6 regime)
const w1 = equationOfState(0.99);
assert("w(f≈1) ≈ -5/7", approx(w1, -5 / 7, 0.05),
  `got ${w1.toFixed(3)}`);

// From Figure 2: at transition point f≈0.8, w≈-0.73
const wTrans = equationOfState(F_TRANSITION);
assert("w(f_transition) in range [-0.8, -0.65]",
  !isNaN(wTrans) && wTrans > -0.8 && wTrans < -0.65,
  `got ${isNaN(wTrans) ? "NaN" : wTrans.toFixed(3)}`);

// ── Luminosity distance ──────────────────────────────────────────
console.log("\nLuminosity distance:");

// ΛCDM: at small z, d_L ≈ cz/H₀
const dL_lcdm = luminosityDistanceLCDM(0.01, 73.2, 0.55);
assert("ΛCDM d_L(z=0.01) > 0", dL_lcdm > 0);
assert("ΛCDM d_L(z=0.01) ≈ 40 Mpc", approx(dL_lcdm, 41, 5),
  `got ${dL_lcdm.toFixed(1)}`);

// RWML: should give similar values with D≈1
const dL_rwml = luminosityDistanceRWML(0.01, 1.0);
assert("RWML d_L(z=0.01, D=1) > 0", dL_rwml > 0);
assert("RWML d_L reasonable range", dL_rwml > 20 && dL_rwml < 80,
  `got ${dL_rwml.toFixed(1)}`);

// Both models should increase with z
assert("ΛCDM d_L increases with z",
  luminosityDistanceLCDM(0.05, 73.2, 0.55) > luminosityDistanceLCDM(0.01, 73.2, 0.55));
assert("RWML d_L increases with z",
  luminosityDistanceRWML(0.05, 1.0) > luminosityDistanceRWML(0.01, 1.0));

// ── SNe Ia data integrity ────────────────────────────────────────
console.log("\nSNe Ia data:");
assert("Near data has 18 points", SNIA_DATA_NEAR.length === 18);
assert("Far data has 14 points", SNIA_DATA_FAR.length === 14);

for (const p of SNIA_DATA_NEAR) {
  assert(`Near z=${p.z} valid`, p.z > 0 && p.dL > 0);
}
for (const p of SNIA_DATA_FAR) {
  assert(`Far z=${p.z} valid`, p.z > 0 && p.dL > 0);
}

// Data should be monotonically increasing in dL with z
for (let i = 1; i < SNIA_DATA_NEAR.length; i++) {
  assert(`Near data sorted by z [${i}]`, SNIA_DATA_NEAR[i].z > SNIA_DATA_NEAR[i - 1].z);
}

// ── Summary ─────────────────────────────────────────────────────
console.log(`\n${"═".repeat(40)}`);
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
