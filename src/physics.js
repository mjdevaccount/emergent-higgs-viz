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

export function sombreroHeight(phi1, phi2, r) {
  const z = sombreroZ(r);
  const phiSq = phi1 * phi1 + phi2 * phi2;
  return (-0.75 * z * phiSq + (1 / 16) * phiSq * phiSq) * 0.3;
}
