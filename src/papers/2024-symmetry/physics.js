// Physics from Pilipović, Symmetry 2024, 16, 36
// "The Algebra and Calculus of Stochastically Perturbed Spacetime
//  with Classical and Quantum Applications"
// Equations referenced by number from the paper.

// ── Constants ────────────────────────────────────────────────────

export const G_NEWTON = 4.302e-3; // pc (km/s)² / M_sun — gravitational constant in galactic units
export const KPC_TO_PC = 1000;    // 1 kpc = 1000 pc

// ── Galaxy rotation curves (Section 7) ──────────────────────────

// Newtonian rotation velocity: V = √(GM/R)
// M in solar masses, R in kpc, returns km/s
export function newtonianVelocity(R_kpc, M_solar) {
  const R_pc = R_kpc * KPC_TO_PC;
  if (R_pc <= 0) return 0;
  return Math.sqrt(G_NEWTON * M_solar / R_pc);
}

// Eq. 50-52 result: at large R, V = R₀ φ̇₀ = constant
// The paper shows this analytically. The flat velocity for a galaxy
// is an empirical constant independent of mass and radius.
export function flatVelocity(V_flat) {
  return V_flat; // Identity — the point is it's constant
}

// ── SPARC galaxy data (subset from Figures 7-10) ────────────────
// From Lelli, McGaugh, Schombert 2016 (SPARC database)
// Selected galaxies with R > 40 kpc observations

export const SPARC_GALAXIES = [
  { name: "NGC-2841", mass: 37.0, points: [
    { R: 4, V: 210 }, { R: 10, V: 280 }, { R: 20, V: 310 },
    { R: 40, V: 300 }, { R: 60, V: 290 }, { R: 80, V: 285 },
  ]},
  { name: "NGC-3198", mass: 10.5, points: [
    { R: 5, V: 100 }, { R: 10, V: 150 }, { R: 20, V: 155 },
    { R: 30, V: 150 }, { R: 40, V: 148 }, { R: 50, V: 150 },
  ]},
  { name: "NGC-5055", mass: 25.0, points: [
    { R: 5, V: 170 }, { R: 10, V: 200 }, { R: 20, V: 210 },
    { R: 30, V: 200 }, { R: 45, V: 195 }, { R: 55, V: 190 },
  ]},
  { name: "UGC-2885", mass: 42.0, points: [
    { R: 10, V: 200 }, { R: 20, V: 280 }, { R: 40, V: 300 },
    { R: 60, V: 300 }, { R: 80, V: 290 }, { R: 100, V: 300 },
  ]},
  { name: "NGC-5907", mass: 18.0, points: [
    { R: 5, V: 170 }, { R: 10, V: 215 }, { R: 20, V: 225 },
    { R: 30, V: 220 }, { R: 40, V: 215 }, { R: 50, V: 210 },
  ]},
  { name: "ESO563-G02", mass: 44.0, points: [
    { R: 10, V: 250 }, { R: 20, V: 310 }, { R: 40, V: 340 },
    { R: 60, V: 330 }, { R: 80, V: 325 },
  ]},
  { name: "UGC-2487", mass: 40.0, points: [
    { R: 5, V: 260 }, { R: 15, V: 340 }, { R: 30, V: 350 },
    { R: 45, V: 340 },
  ]},
];

// Average flat velocity across all galaxies (R > 40 kpc points)
export function averageFlatVelocity() {
  let sum = 0, count = 0;
  for (const g of SPARC_GALAXIES) {
    for (const p of g.points) {
      if (p.R >= 40) { sum += p.V; count++; }
    }
  }
  return count > 0 ? sum / count : 0;
}

// Per-galaxy average velocity at R > 40 kpc
export function galaxyFlatVelocities() {
  return SPARC_GALAXIES.map((g) => {
    const farPoints = g.points.filter((p) => p.R >= 40);
    const avgV = farPoints.length > 0
      ? farPoints.reduce((s, p) => s + p.V, 0) / farPoints.length
      : null;
    return { name: g.name, mass: g.mass, avgV };
  }).filter((g) => g.avgV !== null);
}

// MOND prediction: V⁴ = GMa₀ → V = (GMa₀)^(1/4)
// a₀ ≈ 1.2e-10 m/s² ≈ 3.7e-3 pc/Myr² in galactic units
// For plotting: approximate MOND velocity vs mass
export function mondVelocity(M_solar) {
  const a0 = 1.2e-10; // m/s²
  const G_si = 6.674e-11; // m³/(kg·s²)
  const M_kg = M_solar * 1.989e30;
  const v4 = G_si * M_kg * a0;
  return Math.pow(v4, 0.25) / 1000; // convert m/s to km/s
}

// ── Langevin simulation (Section 3, Eq. 6-7) ────────────────────

// Free particle Langevin step
// Returns { x, p } arrays for a trajectory
export function simulateFreeParticle(steps, { m = 1, sigma = 0.5, cxi = 1, dt = 0.1 } = {}) {
  const xs = [0], ps = [10]; // initial conditions
  for (let i = 1; i <= steps; i++) {
    const xi = gaussianRandom() * sigma * Math.sqrt(dt);
    const dxi = gaussianRandom() * sigma * Math.sqrt(dt);
    const x = xs[i - 1] + (ps[i - 1] / m) * dt + xi;
    const p = ps[i - 1] + m * Math.sqrt(cxi) * (xi - (i > 1 ? gaussianRandom() * sigma * Math.sqrt(dt) : 0));
    xs.push(x);
    ps.push(p);
  }
  return { xs, ps };
}

// Box-Muller transform for Gaussian random numbers
function gaussianRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
