# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive React visualization of "Emergent Higgs Field and the Schwarzschild Black Hole" (Pilipović, Particles 2026, 9(2), 37). Uses exact equations from the paper to render dual potential states, position-dependent quartic coupling, sombrero potential, VEV conservation, transition dynamics, and vacuum entropy.

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

```
index.html                  — Vite entry point
vite.config.js              — Vite + React plugin
src/
  main.jsx                  — React root mount
  App.jsx                   — Main layout, slider state, composes all panels
  physics.js                — All math (Eq. 32, 48, 49, 51, 55–62, 95–96), no UI
  components/
    StarField.jsx           — Animated canvas star background
    DualPotential.jsx       — U±(r) dual potential plot (Eq. 32)
    CouplingPlot.jsx        — f±(r) quartic coupling plot (Eq. 51)
    SombreroViz.jsx         — Three.js 3D sombrero (Eq. 48/49)
    LambdaGauge.jsx         — Ground-state coupling readout
    VevBreakdown.jsx        — h² + v² = (246 GeV)² bar (Eq. 55–62)
    TransitionDiagram.jsx   — Symmetry breaking path at r_T (§3.6, §3.9)
    EntropyMap.jsx          — α₁ parameter / entropy regions (Eq. 95, 114)
docs/
  particles-09-00037.pdf    — Source paper (doi:10.3390/particles9020037)
```

## Key Physics (from paper)

All radii in units of r₀ (Schwarzschild radius):
- `R_MIN = √(3/8) ≈ 0.612` — minimum physical radius
- `R_H = √(5−√21) ≈ 0.646` — deep well minimum
- `R_T = √(7/8) ≈ 0.935` — transition point
- `R_A = √(5+√21) ≈ 3.096` — accretion disk
- Tunneling probability |ψₐ|²/|ψₛ|² ≈ 1.13%

All physics lives in `src/physics.js`. Components import from there — never hardcode constants.

## Dependencies

React 19, Three.js, Vite, Google Fonts (Cormorant Garamond, IBM Plex Mono loaded via `<link>` in App.jsx).
