// Physics from Pilipović, Universe 2024, 10, 400
// "An Infinitely Old Universe with Planck Fields Before and After the Big Bang"
// All equations referenced by number from the paper.

// ── Constants ────────────────────────────────────────────────────

export const X_BIG_BANG = 4 / 3;      // Singularity point
export const X_ACCEL_ZERO_CURVED = 1 / 12;  // -(1+q) = 0 (curved)
export const X_ACCEL_ZERO_FLAT = 1 / 6;     // -(1+q) = 0 (flat)

// ── Flat universe (k=0) — shows the tension ─────────────────────

// Eq. 21: Species equation of state (flat)
// w_S = -(1+2X)/(1+3X)
export function wSpeciesFlat(X) {
  return -(1 + 2 * X) / (1 + 3 * X);
}

// Eq. 27: Acceleration parameter (flat)
// -(1+q) = (-36X)(X - 1/6) / (X - 4/3)
export function accelFlat(X) {
  return (-36 * X) * (X - 1 / 6) / (X - X_BIG_BANG);
}

// Eq. 30: Friedmann equation of state (flat) — closed form from paper
// w = -[-2(-36X)(X-1/6) + (3 - 15/2 X + 9/2 X²)(X-4/3)]
//     / [3(1 - 3/2 X + 9/2 X²)(X - 4/3)]
export function wFriedmannFlat(X) {
  const xm43 = X - X_BIG_BANG;  // X - 4/3
  const denom = 3 * (1 - 1.5 * X + 4.5 * X * X) * xm43;
  if (Math.abs(denom) < 1e-12) return NaN;
  const accelTerm = -2 * (-36 * X) * (X - 1 / 6);
  const friedTerm = (3 - 7.5 * X + 4.5 * X * X) * xm43;
  return -(accelTerm + friedTerm) / denom;
}

// ── Curved universe (k>0) — tension resolved ────────────────────

// Eq. 43: Species equation of state (curved, k/a² = 15/2 HD)
// w_S = -(1+2X)/(1+6X)
export function wSpeciesCurved(X) {
  return -(1 + 2 * X) / (1 + 6 * X);
}

// Eq. 44: Acceleration parameter (curved)
// -(1+q) = (-72X)(X - 1/12) / (X - 4/3)
export function accelCurved(X) {
  return (-72 * X) * (X - 1 / 12) / (X - X_BIG_BANG);
}

// Friedmann equation of state (curved), from Eq. 41-42 + 44
// Same approach as Eq. 30 but with curved coefficients:
// Eq. 42: -8πGp/H² = 1-2q - 15/2 X + 9X²
// Eq. 41: 8πGρ/(3H²) = 1 - 3/2 X + 9X²
// w = p/ρ, substituting q from Eq. 44
export function wFriedmannCurved(X) {
  const xm43 = X - X_BIG_BANG;
  const denom = 3 * (1 - 1.5 * X + 9 * X * X) * xm43;
  if (Math.abs(denom) < 1e-12) return NaN;
  const accelTerm = -2 * (-72 * X) * (X - 1 / 12);
  const friedTerm = (3 - 7.5 * X + 9 * X * X) * xm43;
  return -(accelTerm + friedTerm) / denom;
}

// ── Species fractions (Table 2, curved universe) ─────────────────

// For X → 0 (far future, vacuum dominated): Eq. 52-54
//   Omega_V = 1 - 5X, Omega_D = 3X, Omega_M = 2X
// For X → ∞ (far past, diffusion dominated):
//   Omega_D → 1, others → 0
// We interpolate smoothly using the exact asymptotic forms.
export function speciesFractions(X) {
  if (X < 0.001) return { vacuum: 1, diffusion: 0, matter: 0 };

  // Use the small-X exact forms from Eq. 52-54
  // These are valid approximations for the post-Big-Bang era
  // For large X (pre-Big-Bang), diffusion dominates
  if (X < 0.2) {
    // Post-Big-Bang regime: exact from paper
    const vacuum = Math.max(0, 1 - 5 * X);
    const diffusion = 3 * X;
    const matter = 2 * X;
    const total = vacuum + diffusion + matter;
    return { vacuum: vacuum / total, diffusion: diffusion / total, matter: matter / total };
  }

  // Transition + pre-Big-Bang: smooth interpolation to diffusion-dominated
  // At X→∞, diffusion has w_D = -1/3, and dominates entirely
  const t = Math.min(1, (X - 0.2) / 2);  // transition over X = 0.2 to 2.2
  const postV = Math.max(0, 1 - 5 * 0.2);
  const postD = 3 * 0.2;
  const postM = 2 * 0.2;
  const vacuum = postV * (1 - t);
  const matter = postM * (1 - t);
  const diffusion = 1 - vacuum - matter;
  return { vacuum, diffusion, matter };
}

// ── Planck field potentials ──────────────────────────────────────

// Eq. 72: Pre-SSB phi⁴ potential
// V(phi) = lambda/4 * (phi²)²
// We normalize lambda = 1 for plotting shape
export function phi4Potential(phi) {
  return 0.25 * Math.pow(phi * phi, 2);
}

// Eq. 89: Post-SSB sombrero potential
// V(phi) = -mu² phi² + lambda/4 (phi²)²
// mu² depends on 1/r² (Eq. 90), we use mu² = 0.5 as representative
export function sombreroPotential(phi, muSq = 0.5) {
  return -muSq * phi * phi + 0.25 * Math.pow(phi * phi, 2);
}

// VEV from sombrero: phi_min² = mu²/lambda = mu² (since lambda=1)
export function sombreroVEV(muSq = 0.5) {
  return Math.sqrt(muSq);
}
