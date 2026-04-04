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

// Quartic coupling f(r) derived from Eq. 48-50 via Z±(r).
// f = 1/(4Z) gives exactly 1/5 at both potential minima (rh, ra)
// and approaches 1/4 at large r (SM limit).
// The paper's λ/5 result (Eq. 40) corresponds to f(rh) = f(ra) = 1/5.
export function couplingGround(r) {
  const Z = sombreroZ(r);
  return 1 / (4 * Z);
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
// f ranges from 1/5 (at minima) to ~1/4 (SM limit, f_SM = 0.25).
// fNorm = f/f_SM. At minima fNorm=0.8, SM fNorm=1.
// Paper Eq. 58–62: at minima v=110 GeV, h=220 GeV, v²+h²=246².
export function vevBreakdown(r) {
  const f = couplingGround(r);
  if (isNaN(f) || f <= 0) return { v: 0, h: VEV, f };
  const fNorm = f / 0.25;
  const departure = 1 - fNorm; // 0 at SM, 0.2 at minima
  const vSq = VEV * VEV * Math.max(0, 1 - 4 * departure);
  const hSq = VEV * VEV * 4 * departure;
  return { v: Math.sqrt(vSq), h: Math.sqrt(hSq), f, fNorm };
}

export function sombreroHeight(phi1, phi2, r) {
  const z = sombreroZ(r);
  const phiSq = phi1 * phi1 + phi2 * phi2;
  return (-0.75 * z * phiSq + (1 / 16) * phiSq * phiSq) * 0.3;
}

// Tunneling probability (§3.9): |ψa|²/|ψs|² ≈ 1.13%
export const TUNNEL_PROB = 0.0113;

// Eq. 95: α₁± — governs Higgs vacuum density evolution
// α₁± ≈ (m²φ²/μ²v²){4 + (r₀²/r²)(3/2 ∓ 14√(r²/(2r₀²)−3/16))}
// We factor out the m²φ²/μ²v² prefactor and plot the shape.
// Sign convention: α₁⁻ uses minus on 14√ (goes negative at r²=½r₀²).
export function alpha1Minus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  const r2 = r * r;
  return 4 + (1 / r2) * (1.5 - 14 * s);
}

export function alpha1Plus(r) {
  const s = sqrtTerm(r);
  if (isNaN(s)) return NaN;
  const r2 = r * r;
  return 4 + (1 / r2) * (1.5 + 14 * s);
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
