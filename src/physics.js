// Exact physics from Pilipović, Particles 2026, 9(2), 37
// All equations referenced by number from the paper.

export const VEV = 246; // GeV

// Key radii in units of r₀
export const R_MIN = Math.sqrt(3 / 8);           // ≈ 0.612 — minimum physical radius
export const R_H = Math.sqrt(5 - Math.sqrt(21)); // ≈ 0.646 — deep well minimum
export const R_T = Math.sqrt(7 / 8);             // ≈ 0.935 — transition point
export const R_0 = 1.0;                          // Schwarzschild radius
export const R_A = Math.sqrt(5 + Math.sqrt(21)); // ≈ 3.096 — accretion disk

// Helper: √(r²/(2r₀²) - 3/16)
export function sqrtTerm(r) {
  const val = (r * r) / 2 - 3 / 16;
  return val >= 0 ? Math.sqrt(val) : NaN;
}

// Eq. 32: U±(r) / (m²φ²)
export function potentialPlus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  const r2 = r * r, r4 = r2 * r2;
  const a = 0.25 - s, b = 0.25 + s;
  return 2 * (1 + 2 * a * a / r2 + 2 * b * b / r4);
}

export function potentialMinus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  const r2 = r * r, r4 = r2 * r2;
  const a = 0.25 + s, b = 0.25 - s;
  return 2 * (1 + 2 * a * a / r2 + 2 * b * b / r4);
}

// Ground state: U- inside r₀, U+ outside
export function groundState(r) {
  return r <= R_0 ? potentialMinus(r) : potentialPlus(r);
}

// Excited state: U+ inside r₀, U- outside
export function excitedState(r) {
  return r <= R_0 ? potentialPlus(r) : potentialMinus(r);
}

// Eq. 51: quartic coupling coefficient f±(r) relative to SM λ
// f±(r) = (2/3)(1/4 ∓ √(...))² · (r²/r₀²) + (1/4 ± √(...))
export function couplingPlus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  return (2 / 3) * Math.pow(0.25 - s, 2) * r * r + (0.25 + s);
}

export function couplingMinus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  return (2 / 3) * Math.pow(0.25 + s, 2) * r * r + (0.25 - s);
}

// Ground state coupling: f- inside r₀, f+ outside
export function couplingGround(r) {
  return r <= R_0 ? couplingMinus(r) : couplingPlus(r);
}

// Eq. 48: sombrero potential shape at radius r
// U(r, z̃) ∝ -¾ Z±(r) z̃² + (1/16) z̃⁴
// Z±(r) from Eq. 49
export function sombreroZ(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return 1;
  const sign = r <= R_0 ? -1 : 1;
  return 1 + (1 / (r * r)) * (0.25 + sign * s);
}

// VEV conservation (Eq. 55–62)
// Potential minimum: φ²_vev = v²/f(r), with φ_vev = 246 GeV conserved.
// So v(r) = 246·√f, h(r) = 246·√(1−f) when f ≤ 1.
// At f = 1/5: v ≈ 110 GeV, h ≈ 220 GeV (Higgs perturbations dominate).
export function vevBreakdown(r) {
  const f = couplingGround(r);
  if (isNaN(f) || f <= 0) return { v: 0, h: VEV, f };
  if (f >= 1) return { v: VEV, h: 0, f };
  const v = VEV * Math.sqrt(f);
  const h = VEV * Math.sqrt(1 - f);
  return { v, h, f };
}

export function sombreroHeight(phi1, phi2, r) {
  const z = sombreroZ(r);
  const phiSq = phi1 * phi1 + phi2 * phi2;
  return (-0.75 * z * phiSq + (1 / 16) * phiSq * phiSq) * 0.3;
}

// Tunneling probability (§3.9): |ψa|²/|ψs|² ≈ 1.13%
export const TUNNEL_PROB = 0.0113;

// Eq. 95: α₁± — governs Higgs vacuum density evolution
// α₁�� ≈ (m²φ²/μ²v²){4 + (r₀²/r²)(3/2 ∓ 14√(r²/(2r₀²)−3/16))}
// We factor out the m²φ²/μ²v² prefactor (≈ 16/45) and plot the shape.
export function alpha1Minus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  const r2 = r * r;
  return 4 + (1 / r2) * (1.5 + 14 * s);
}

export function alpha1Plus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  const r2 = r * r;
  return 4 + (1 / r2) * (1.5 - 14 * s);
}

// Eq. 96: α₂± — second Fokker–Planck parameter
export function alpha2Plus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  const r2 = r * r;
  return (1 / r2) * (6 - (1 / r2) * (4 * s + 3));
}

export function alpha2Minus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  const r2 = r * r;
  return (1 / r2) * (6 - (1 / r2) * (4 * s - 3));
}
