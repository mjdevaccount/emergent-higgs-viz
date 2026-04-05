// Verification tests for 2024-symmetry/physics.js
// Against: Pilipović, Symmetry 2024, 16, 36
// Run: node tests/symmetry-physics.test.js

import {
  newtonianVelocity, averageFlatVelocity, galaxyFlatVelocities,
  mondVelocity, SPARC_GALAXIES, simulateFreeParticle,
} from "../src/papers/2024-symmetry/physics.js";

let passed = 0, failed = 0;

function assert(name, condition, detail) {
  if (condition) { passed++; }
  else { failed++; console.error(`  FAIL: ${name}${detail ? " — " + detail : ""}`); }
}

function approx(a, b, tol = 0.01) {
  return Math.abs(a - b) < tol;
}

// ── Newtonian velocity ──────────────────────────────────────────
console.log("Newtonian velocity:");
assert("V(R=0) = 0", newtonianVelocity(0, 1e10) === 0);
assert("V increases with mass", newtonianVelocity(10, 1e11) > newtonianVelocity(10, 1e10));
assert("V decreases with radius", newtonianVelocity(20, 1e11) < newtonianVelocity(10, 1e11));

// V = √(GM/R) sanity check: M=1e11 M_sun at R=10 kpc ≈ 207 km/s
const vTest = newtonianVelocity(10, 1e11);
assert("V(10kpc, 1e11 Msun) ≈ 207 km/s", approx(vTest, 207, 10),
  `got ${vTest.toFixed(1)}`);

// ── SPARC data integrity ────────────────────────────────────────
console.log("\nSPARC data:");
assert("7 galaxies loaded", SPARC_GALAXIES.length === 7);

for (const g of SPARC_GALAXIES) {
  assert(`${g.name} has points`, g.points.length > 0);
  assert(`${g.name} has mass`, g.mass > 0);
  for (const p of g.points) {
    assert(`${g.name} R=${p.R} valid`, p.R > 0 && p.V > 0);
  }
}

// ── Average flat velocity ───────────────────────────────────────
console.log("\nFlat velocity (Section 7 result):");
const avgV = averageFlatVelocity();
assert("Average flat V > 0", avgV > 0);
assert("Average flat V in reasonable range (200-350 km/s)",
  avgV > 200 && avgV < 350, `got ${avgV.toFixed(1)}`);

// ── Per-galaxy flat velocities ──────────────────────────────────
const galVels = galaxyFlatVelocities();
assert("Got flat velocities for multiple galaxies", galVels.length >= 5);
for (const g of galVels) {
  assert(`${g.name} avgV > 100 km/s`, g.avgV > 100);
  assert(`${g.name} avgV < 400 km/s`, g.avgV < 400);
}

// Key paper result: flat velocity is NOT correlated with mass
// Simple check: high-mass and low-mass galaxies have similar velocities
const sorted = [...galVels].sort((a, b) => a.mass - b.mass);
const lowMassV = sorted[0].avgV;
const highMassV = sorted[sorted.length - 1].avgV;
assert("Flat V not strongly mass-dependent (ratio < 3x)",
  highMassV / lowMassV < 3,
  `low=${lowMassV.toFixed(0)}, high=${highMassV.toFixed(0)}`);

// ── MOND velocity ───────────────────────────────────────────────
console.log("\nMOND:");
assert("MOND V > 0 for M > 0", mondVelocity(1e11) > 0);
assert("MOND V increases with mass", mondVelocity(1e12) > mondVelocity(1e11));
// V = (GMa₀)^(1/4) for M=1e11 — MOND gives ~200 km/s
const mondV = mondVelocity(1e11);
assert("MOND V(1e11) in range 150-250 km/s", mondV > 150 && mondV < 250,
  `got ${mondV.toFixed(1)}`);

// ── Langevin simulation (Eq. 6-7, 13-14) ────────────────────────
console.log("\nLangevin simulation:");
const sim = simulateFreeParticle(500);
assert("Simulation produces 501 position points", sim.xs.length === 501);
assert("Simulation produces 501 momentum points", sim.ps.length === 501);
assert("Position starts at 0", sim.xs[0] === 0);
assert("Momentum starts at 10", sim.ps[0] === 10);

// Key property: position spreads (random walk), momentum stays bounded
const xSpread = Math.max(...sim.xs) - Math.min(...sim.xs);
const pSpread = Math.max(...sim.ps) - Math.min(...sim.ps);
assert("Position spread > 0 (random walk)", xSpread > 0);
assert("Momentum spread bounded (< 100x initial)",
  pSpread < 1000, `spread=${pSpread.toFixed(1)}`);

// Run multiple sims to check statistical properties
const spreads = [];
for (let trial = 0; trial < 10; trial++) {
  const s = simulateFreeParticle(200);
  const xs = Math.max(...s.xs) - Math.min(...s.xs);
  spreads.push(xs);
}
assert("Position spread varies across runs (stochastic)",
  new Set(spreads.map(s => s.toFixed(2))).size > 1);

// ── Summary ─────────────────────────────────────────────────────
console.log(`\n${"═".repeat(40)}`);
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
