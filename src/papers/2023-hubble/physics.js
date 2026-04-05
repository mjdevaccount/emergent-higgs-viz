// Physics from Pilipović, Open Astronomy 2023, 32, 20220221
// "Late-time dark energy and Hubble tension"
// Equations referenced by number from the paper.

// ── Constants ────────────────────────────────────────────────────

export const H0_CMB = 67.4;      // km/s/Mpc — CMB estimate
export const H0_LCDM = 73.2;     // km/s/Mpc — late-time ΛCDM estimate
export const Q0_LCDM = -0.55;    // Standard deceleration parameter

// Transition point: minimum f where energy density has a real minimum
export const F_TRANSITION = 0.7998;

// ── Eq. 12: Diffusion states D±(f) ──────────────────────────────
// D± = (H/12)(1 - δf/6 ± √(1 + 5δf + δf²/36))
// where δf = f - 1 (deviation from f=1)
// f ≡ -q (acceleration parameter)
// We normalize to X = D/H for plotting
export function diffusionPlus(f) {
  const df = f - 1;
  const disc = 1 + 5 * df + (df * df) / 36;
  if (disc < 0) return NaN;
  return (1 / 12) * (1 - df / 6 + Math.sqrt(disc));
}

export function diffusionMinus(f) {
  const df = f - 1;
  const disc = 1 + 5 * df + (df * df) / 36;
  if (disc < 0) return NaN;
  return (1 / 12) * (1 - df / 6 - Math.sqrt(disc));
}

// ── Eq. 14: δf(X) — acceleration deviation as function of X ────
// δf = (-36X)(X - 1/6) / (X - 4/3)
export function deltaF(X) {
  return (-36 * X) * (X - 1 / 6) / (X - 4 / 3);
}

// ── Eq. 15: Equation of state w(X) ──────────────────────────────
// w = -((1 + 2/3 δf - 5/2 X + 3/2 X²) / (1 - 3/2 X + 9/2 X²))
export function equationOfState(f) {
  // Convert f to X via D+
  const X = diffusionPlus(f);
  if (isNaN(X) || X < 0) return NaN;
  return equationOfStateFromX(X);
}

export function equationOfStateFromX(X) {
  const df = deltaF(X);
  const num = 1 + (2 / 3) * df - 2.5 * X + 1.5 * X * X;
  const denom = 1 - 1.5 * X + 4.5 * X * X;
  if (Math.abs(denom) < 1e-12) return NaN;
  return -num / denom;
}

// ── Eq. 21: Luminosity distance d_L(z) under RWML ───────────────
// Simplified for small z and small X:
// d_L ≈ (c/H₀)(e^(-X)/(1+6X)) √((1 - 3/2 X + 9/2 X²)/(Ω_de e^(3X) + Ω_m e^(-9X)))
//       × (z(1+z) - z² × correction_term)
// We use the first-order approximation for plotting

export function luminosityDistanceRWML(z, D_kms) {
  const c = 299792.458; // km/s
  const X = D_kms / H0_CMB;
  const wde = -1 + X;  // Eq. 24: δw_de ≈ X for small X
  const OmegaDe = -(wde) * (1 + wde);   // Eq. 23
  const OmegaM = 1 + wde * (1 + wde);   // Eq. 23

  const prefactor = (c / H0_CMB) * Math.exp(-X) / (1 + 6 * X);
  const friedmann = Math.sqrt(
    (1 - 1.5 * X + 4.5 * X * X) /
    (OmegaDe * Math.exp(3 * X) + OmegaM * Math.exp(-9 * X))
  );

  const correction = 0.75 * (wde * OmegaDe * Math.exp(3 * X) + OmegaM * Math.exp(-9 * X)) /
    (OmegaDe * Math.exp(3 * X) + OmegaM * Math.exp(-9 * X));

  const dL = prefactor * friedmann * (z * (1 + z) - z * z * correction);
  return dL;
}

// ΛCDM luminosity distance for comparison
export function luminosityDistanceLCDM(z, H0, q0) {
  const c = 299792.458;
  return (c / H0) * (z + 0.5 * (1 - q0) * z * z);
}

// ── SNe Ia data (representative subset from Figures 3-4) ────────
// From Riess et al. 2022, Tables 1-2

export const SNIA_DATA_NEAR = [
  // 19 SNe Ia galaxies with Cepheid distances (z_helio < 0.0177)
  { z: 0.0015, dL: 5.2 },  { z: 0.0024, dL: 8.1 },
  { z: 0.0035, dL: 11.5 }, { z: 0.0037, dL: 14.2 },
  { z: 0.0042, dL: 15.8 }, { z: 0.0050, dL: 18.5 },
  { z: 0.0055, dL: 20.1 }, { z: 0.0060, dL: 22.0 },
  { z: 0.0065, dL: 25.3 }, { z: 0.0070, dL: 28.4 },
  { z: 0.0080, dL: 30.2 }, { z: 0.0090, dL: 35.1 },
  { z: 0.0100, dL: 39.5 }, { z: 0.0110, dL: 42.8 },
  { z: 0.0120, dL: 47.2 }, { z: 0.0140, dL: 55.0 },
  { z: 0.0160, dL: 64.1 }, { z: 0.0177, dL: 78.5 },
];

export const SNIA_DATA_FAR = [
  // Representative subset of 57 SNe Ia Hubble Flow (z < 0.077)
  { z: 0.010, dL: 44 },  { z: 0.015, dL: 64 },
  { z: 0.018, dL: 72 },  { z: 0.020, dL: 85 },
  { z: 0.022, dL: 92 },  { z: 0.025, dL: 104 },
  { z: 0.028, dL: 118 }, { z: 0.030, dL: 128 },
  { z: 0.035, dL: 145 }, { z: 0.040, dL: 168 },
  { z: 0.050, dL: 218 }, { z: 0.060, dL: 248 },
  { z: 0.070, dL: 290 }, { z: 0.077, dL: 340 },
];
