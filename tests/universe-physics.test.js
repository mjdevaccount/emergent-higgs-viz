// Verification tests for 2024-universe/physics.js
// Against: Pilipović, Universe 2024, 10, 400
// Run: node tests/universe-physics.test.js

import {
  X_BIG_BANG, X_ACCEL_ZERO_CURVED, X_ACCEL_ZERO_FLAT,
  wSpeciesFlat, wSpeciesCurved,
  accelFlat, accelCurved,
  wFriedmannFlat, wFriedmannCurved,
  speciesFractions,
  phi4Potential, sombreroPotential, sombreroVEV,
} from "../src/papers/2024-universe/physics.js";

let passed = 0, failed = 0;

function assert(name, condition, detail) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`  FAIL: ${name}${detail ? " — " + detail : ""}`);
  }
}

function approx(a, b, tol = 0.01) {
  return Math.abs(a - b) < tol;
}

// ── Constants ────────────────────────────────────────────────────
console.log("Constants:");
assert("X_BIG_BANG = 4/3", approx(X_BIG_BANG, 1.3333, 0.001));
assert("X_ACCEL_ZERO_CURVED = 1/12", approx(X_ACCEL_ZERO_CURVED, 0.0833, 0.001));
assert("X_ACCEL_ZERO_FLAT = 1/6", approx(X_ACCEL_ZERO_FLAT, 0.1667, 0.001));

// ── Eq. 21: wSpeciesFlat asymptotic behavior ────────────────────
console.log("\nEq. 21 — w_S (flat):");
assert("wSpeciesFlat(0) → -1 (vacuum)", approx(wSpeciesFlat(0.001), -1, 0.01));
assert("wSpeciesFlat(∞) → -2/3", approx(wSpeciesFlat(1000), -2 / 3, 0.01),
  `got ${wSpeciesFlat(1000).toFixed(4)}`);
assert("wSpeciesFlat(1) = -3/4", approx(wSpeciesFlat(1), -3 / 4, 0.001));

// ── Eq. 43: wSpeciesCurved asymptotic behavior ──────────────────
console.log("\nEq. 43 — w_S (curved):");
assert("wSpeciesCurved(0) → -1 (vacuum)", approx(wSpeciesCurved(0.001), -1, 0.01));
assert("wSpeciesCurved(∞) → -1/3 (diffusion)", approx(wSpeciesCurved(1000), -1 / 3, 0.01),
  `got ${wSpeciesCurved(1000).toFixed(4)}`);
assert("wSpeciesCurved(1) = -3/7", approx(wSpeciesCurved(1), -3 / 7, 0.001));

// ── Eq. 27: accelFlat ───────────────────────────────────────────
console.log("\nEq. 27 — acceleration (flat):");
assert("accelFlat(0) → 0", approx(accelFlat(0.001), 0, 0.2));
assert("accelFlat(1/6) = 0 (zero crossing)", approx(accelFlat(1 / 6), 0, 0.001));
assert("accelFlat diverges near 4/3", Math.abs(accelFlat(X_BIG_BANG - 0.001)) > 1000);
assert("accelFlat(∞) → -36X", approx(accelFlat(1000) / (-36 * 1000), 1, 0.01));

// ── Eq. 44: accelCurved ─────────────────────────────────────────
console.log("\nEq. 44 — acceleration (curved):");
assert("accelCurved(0) → 0", approx(accelCurved(0.001), 0, 0.2));
assert("accelCurved(1/12) = 0 (zero crossing)", approx(accelCurved(1 / 12), 0, 0.001));
assert("accelCurved diverges near 4/3", Math.abs(accelCurved(X_BIG_BANG - 0.001)) > 1000);
assert("accelCurved(∞) → -72X", approx(accelCurved(1000) / (-72 * 1000), 1, 0.01));

// ── Eq. 30: wFriedmannFlat — the tension ────────────────────────
console.log("\nEq. 30/31/32 — w Friedmann (flat):");
assert("wFriedmannFlat(0) → -1", approx(wFriedmannFlat(0.001), -1, 0.05));
assert("wFriedmannFlat(∞) → -1/3 (Eq. 32)", approx(wFriedmannFlat(1000), -1 / 3, 0.02),
  `got ${wFriedmannFlat(1000).toFixed(4)}`);
// Tension: wFriedmannFlat ≠ wSpeciesFlat at large X
assert("Tension at X=∞: w ≠ w_S (flat)",
  Math.abs(wFriedmannFlat(1000) - wSpeciesFlat(1000)) > 0.2,
  `w=${wFriedmannFlat(1000).toFixed(3)}, w_S=${wSpeciesFlat(1000).toFixed(3)}`);

// ── Friedmann curved — tension resolved ─────────────────────────
console.log("\nFriedmann (curved) — tension resolved:");
assert("wFriedmannCurved(0) → -1", approx(wFriedmannCurved(0.001), -1, 0.05));
assert("wFriedmannCurved(∞) → -1/3", approx(wFriedmannCurved(1000), -1 / 3, 0.02),
  `got ${wFriedmannCurved(1000).toFixed(4)}`);
// Resolved: wFriedmannCurved ≈ wSpeciesCurved at large X
assert("No tension at X=∞: w ≈ w_S (curved)",
  Math.abs(wFriedmannCurved(1000) - wSpeciesCurved(1000)) < 0.02,
  `w=${wFriedmannCurved(1000).toFixed(3)}, w_S=${wSpeciesCurved(1000).toFixed(3)}`);

// ── Table 2: Species fractions ──────────────────────────────────
console.log("\nTable 2 — species fractions:");
const s0 = speciesFractions(0.001);
assert("X→0: vacuum ≈ 1", s0.vacuum > 0.99);
assert("X→0: diffusion ≈ 0", s0.diffusion < 0.01);
assert("X→0: matter ≈ 0", s0.matter < 0.01);

const s01 = speciesFractions(0.1);
assert("X=0.1: vacuum = 0.5", approx(s01.vacuum, 0.5, 0.01));
assert("X=0.1: diffusion = 0.3", approx(s01.diffusion, 0.3, 0.01));
assert("X=0.1: matter = 0.2", approx(s01.matter, 0.2, 0.01));
assert("X=0.1: sum = 1", approx(s01.vacuum + s01.diffusion + s01.matter, 1, 0.001));

const sInf = speciesFractions(10);
assert("X→∞: diffusion dominates", sInf.diffusion > 0.9);
assert("X→∞: sum = 1", approx(sInf.vacuum + sInf.diffusion + sInf.matter, 1, 0.001));

// ── Eq. 72: phi⁴ potential ──────────────────────────────────────
console.log("\nEq. 72 — phi⁴ potential:");
assert("V(0) = 0", phi4Potential(0) === 0);
assert("V(1) = 0.25", approx(phi4Potential(1), 0.25, 0.001));
assert("V(-1) = V(1) (symmetric)", phi4Potential(-1) === phi4Potential(1));
assert("V(2) > V(1) (grows)", phi4Potential(2) > phi4Potential(1));

// ── Eq. 89: sombrero potential ──────────────────────────────────
console.log("\nEq. 89 — sombrero potential:");
const vev = sombreroVEV(0.5);
assert("VEV at mu²=0.5: phi = √0.5", approx(vev, Math.sqrt(0.5), 0.001));
assert("V(0) = 0 (local max)", sombreroPotential(0) === 0);
assert("V(vev) < 0 (minimum)", sombreroPotential(vev, 0.5) < 0);
assert("V(vev) is minimum", sombreroPotential(vev, 0.5) < sombreroPotential(vev * 0.5, 0.5));
assert("Symmetric: V(-phi) = V(phi)", sombreroPotential(-1, 0.5) === sombreroPotential(1, 0.5));

// ── Summary ─────────────────────────────────────────────────────
console.log(`\n${"═".repeat(40)}`);
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
