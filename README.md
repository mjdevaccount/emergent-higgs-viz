# Emergent Higgs Field & the Schwarzschild Black Hole

An interactive companion to [Pilipovic (2026)](https://www.mdpi.com/2571-712X/9/2/37) — the paper proposing that the Higgs field emerges from stochastic spacetime perturbations inside a Schwarzschild black hole. Three modes of engagement: a structured paper walkthrough with LaTeX equations and interactive figures, a cinematic scroll-driven descent into a black hole, and a technical dashboard for parameter exploration.

**Live:** [mjdevaccount.github.io/emergent-higgs-viz](https://mjdevaccount.github.io/emergent-higgs-viz/)

---

## Overview

This project implements every key equation from the paper as verified, interactive visualizations. A single physics engine (`src/physics.js`, 44 passing tests) powers all three presentation modes. Equations are rendered with KaTeX. 3D visualizations use Three.js. No approximations — all constants and functions are derived directly from the published mathematics.

### The central result

At the potential minima inside the Schwarzschild sphere and at the accretion disk, the Standard Model quartic coupling shifts from λ to λ/5. This is not a free parameter — it follows from VEV conservation when Higgs perturbations dominate the scalar field (h² = 4v², Eq. 59). The electroweak VEV φ = 246 GeV is preserved everywhere.

---

## Three Modes

### Paper Mode (default)

A readable, scrollable document that follows the paper's structure. Each section pairs the relevant LaTeX equations with an interactive figure. A shared radial position slider at the top controls all figures simultaneously — drag it and every visualization across every section responds.

**Sections:**

| Section | Content | Interactive Figure |
|---|---|---|
| §2 Framework | Stochastic spacetime, emergent Schwarzschild metric | Key radii table |
| §3.1–3.2 Symmetry Breaking | Scalar field expansion, Eq. 32 | U±(r) dual potential (Figure 2) |
| §3.3–3.4 Black Hole | Sombrero at r_h with λ/5, Eq. 38–40 | 3D sombrero potential |
| §3.5 Sombrero Family | Position-dependent coupling, Eq. 48–51 | f(r) coupling plot (Figure 3) |
| Spatial Map | EW potential mapped in physical space | Radial cross-section with sombrero profiles |
| §3.6–3.7 Transition | Symmetry breaking at r_T, Eq. 52 | Transition diagram (Figure 4) |
| §3.8 VEV Conservation | The λ/5 derivation, Eq. 55–63 | h² + v² = 246² breakdown |
| §4 Entropy | Fokker–Planck parameters, Eq. 95–96 | α₁⁻ / α₂⁺ plot + Table 1 |

**Features:**
- Sticky table of contents with smooth scroll navigation
- Global radial position slider synced across all sections
- KaTeX-rendered equations with paper equation numbers
- **Interactive equation highlighting**: hover over `r₀` or `λ/5` in any equation and the corresponding element pulses gold in the visualization (via KaTeX `\htmlClass` + shared React context)
- Copyable BibTeX citation block
- DOI, CC BY 4.0, and test-passing badges
- "Interactive Supplementary Material" designation
- Google Scholar indexing via Highwire Press meta tags and Schema.org `ScholarlyArticle` JSON-LD

### Journey Mode

A scroll-driven cinematic descent into a black hole. Every visual is powered by the same physics engine — the metaphors are the math.

**Five visual phases:**

| Phase | What you see |
|---|---|
| **Cosmos** (r > 3.5r₀) | Bright stars, small distant black hole, calm palette |
| **Accretion** (~3.1r₀) | Stars dim, disk brightens, first gold flickers |
| **Approach** (3r₀ → r₀) | Stars stretch radially, black hole fills viewport (5% → 80%) |
| **Crossing** (r₀) | Hard white flash, stars vanish, palette inverts to gold |
| **Interior** (r₀ → 0.65r₀) | Dark, foggy, claustrophobic, gold particles only |

**Elements:**
- Three.js black hole with edge glow shader, rotating accretion disk, and **gravitational lensing post-processing** — a screen-space Schwarzschild deflection shader that distorts background stars around the event horizon, darkens rays inside, and produces Einstein ring glow at the photon sphere (1.5 r_s)
- 1500 instanced particles spiraling inward; 1.13% escape as gold streaks (tunneling probability)
- Camera spirals in over 2.5 rotations, driven by scroll position
- Depth gauge (right) with labeled tick marks at each key radius
- VEV balance bar (bottom) — cyan/gold split that tips past 50% at the horizon
- Chapter-break text cards between phases
- Core reveal: darkness → *"Mass is born here."* → sombrero blooms
- Post-credits tunneling: single gold particle escapes upward
- Optional Web Audio drone (deepens with descent)

### Dashboard Mode

Traditional technical visualization. Seven interactive panels sharing a single slider for direct parameter exploration. Includes dual potential plot, coupling coefficient, 3D sombrero, lambda gauge with r-based regime labels, VEV conservation bar, transition/tunneling diagram, and entropy map with both α₁⁻ and α₂⁺.

---

## Physics Engine

All mathematics live in `src/physics.js`. Zero UI code. Every function maps to a specific paper equation.

### Implemented equations

| Function | Paper Reference | Description |
|---|---|---|
| `potentialPlus(r)` / `potentialMinus(r)` | Eq. 32 | Dual potential states U±(r) |
| `groundState(r)` / `excitedState(r)` | §3.2 | U⁻ inside r₀, U⁺ outside |
| `sombreroZ(r)` | Eq. 49 | Shape parameter Z±(r) for sombrero family |
| `sombreroHeight(φ₁, φ₂, r)` | Eq. 48 | Sombrero potential surface |
| `couplingGround(r)` | Eq. 51 | Quartic coupling f±(r) = (2/3)(1/4 ∓ s)² / (r² + (1/4 ± s)) |
| `vevBreakdown(r)` | Eq. 55–62 | h² + v² = 246² decomposition |
| `alpha1Minus(r)` / `alpha1Plus(r)` | Eq. 95 | Fokker–Planck parameter α₁± |
| `alpha2Plus(r)` / `alpha2Minus(r)` | Eq. 96 | Fokker–Planck parameter α₂± |

### Derived constants

| Constant | Derivation | Value |
|---|---|---|
| `R_MIN` | √(3/8) r₀ | 0.6124 r₀ — minimum physical radius |
| `R_H` | √(5 − √21) r₀ | 0.6461 r₀ — deep well minimum |
| `R_T` | √(7/8) r₀ | 0.9354 r₀ — EW symmetry breaking transition |
| `R_0` | r₀ | 1.0000 r₀ — Schwarzschild radius |
| `R_A` | √(5 + √21) r₀ | 3.0956 r₀ — accretion disk minimum |
| `TUNNEL_PROB` | §3.9 | 0.0113 — \|ψₐ\|²/\|ψₛ\|² tunneling probability |

### Verification

44 assertions in `tests/physics.test.js` covering:
- All five derived radii against closed-form values
- U±(r) crossing at r₀ (exact equality)
- U⁻(r_h) = U⁺(r_a) = 3.750 (minima symmetry)
- Ground/excited state assignment
- Z(r_h) = Z(r_a) = 5/4 (Eq. 34)
- f(r_h) = f(r_a) = 1/5 (the λ/5 result)
- VEV conservation: v² + h² = 246² at all test points
- α₁⁻ = 0 at r = 1/√2 (exact sign-change boundary)
- α₁⁺ always positive

```bash
npm test    # 44 passed, 0 failed
```

---

## Architecture

```
index.html                          Entry point (OG/Twitter meta, favicon)
vite.config.js                      Vite + React, base path for GitHub Pages
public/og-image.svg                 Social sharing preview card

src/
  main.jsx                          Root with three-mode toggle
  physics.js                        Physics engine (all equations, no UI)
  Paper.jsx                         Paper mode shell, shared state, TOC
  App.jsx                           Dashboard mode layout
  PageToggle.jsx                    Paper | Journey | Dashboard switcher

  paper/                            Paper mode sections (12 files)
    Eq.jsx                          KaTeX equation renderer + hover highlighting
    HighlightContext.jsx            Shared highlight state for equation↔viz links
    Header.jsx                      Title, author, abstract, badges
    Framework.jsx                   §2 — stochastic spacetime
    SymmetryBreaking.jsx            §3.1–3.2 + Figure 2
    BlackHole.jsx                   §3.3–3.4 + sombrero
    SombreroFamily.jsx              §3.5 + Figure 3
    SpatialMapSection.jsx           Radial spatial map (original)
    Transition.jsx                  §3.6–3.7 + Figure 4
    VevConservation.jsx             §3.8 — the central result
    Entropy.jsx                     §4 + Figure 6 + Table 1
    References.jsx                  Citations + BibTeX

  components/                       Shared visualization components (9 files)
    DualPotential.jsx               U±(r) 2D canvas plot
    CouplingPlot.jsx                f(r) 2D canvas plot
    SombreroViz.jsx                 Three.js 3D sombrero
    SpatialMap.jsx                  Radial cross-section with sombrero profiles
    LambdaGauge.jsx                 Coupling readout with regime labels
    VevBreakdown.jsx                h²/v² stacked bar
    TransitionDiagram.jsx           Symmetry breaking schematic
    EntropyMap.jsx                  α₁⁻ + α₂⁺ parameter plot
    StarField.jsx                   Animated star background

  journey/                          Journey mode (7 files)
    JourneyShell.jsx                Scroll container, phases, chapter cards
    BlackHoleScene.jsx              Three.js scene + post-processing pipeline
    LensingPass.js                  Schwarzschild gravitational lensing shader
    particles.js                    1500 instanced particles + tunneling
    DepthGauge.jsx                  Vertical progress indicator
    VevBar.jsx                      Horizontal balance bar
    SoundScape.jsx                  Web Audio API drone

tests/
  physics.test.js                   44 assertions against paper equations

docs/
  particles-09-00037.pdf            Source paper
  particles-09-00037.md             Markdown extraction
```

---

## Development

```bash
npm install
npm run dev         # Development server with HMR
npm run build       # Production build to dist/
npm run preview     # Preview production build
npm test            # Run physics verification tests
```

Requires Node.js 18+. Deployed to GitHub Pages via Actions on push to master.

### Stack

| Technology | Purpose |
|---|---|
| React 19 | Component architecture |
| Three.js + postprocessing | 3D sombrero, black hole scene, instanced particles, gravitational lensing |
| KaTeX | LaTeX equation rendering |
| Vite | Build tooling, HMR, production bundling |
| Web Audio API | Spatial audio (browser-native) |
| Canvas 2D | Scientific plots (potential, coupling, entropy) |
| GitHub Actions | CI/CD to GitHub Pages |

---

## Citation

```bibtex
@article{Pilipovic2026,
  author  = {Pilipovi\'{c}, Dragana},
  title   = {Emergent Higgs Field and the Schwarzschild Black Hole},
  journal = {Particles},
  volume  = {9},
  number  = {2},
  pages   = {37},
  year    = {2026},
  doi     = {10.3390/particles9020037}
}
```

---

## License

The source paper is published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This visualization is open source.
