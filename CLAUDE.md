# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive React visualization of the paper "Emergent Higgs Field & the Schwarzschild Black Hole" (Pilipović, Particles 2026, 9(2), 37). Visualizes dual potential states, position-dependent quartic coupling, and the 3D sombrero potential near a Schwarzschild black hole using exact equations from the paper.

## Architecture

`emergent-higgs.jsx` re-exports from modular source files in `src/`:

- **`src/physics.js`** — All math. Exact Eq. 32 (dual potentials U±), Eq. 51 (coupling f±), Eq. 48/49 (sombrero Z±). Exports constants (R_MIN, R_H, R_T, R_0, R_A, VEV) and pure functions. No UI code.
- **`src/StarField.jsx`** — Animated canvas background with twinkling stars.
- **`src/DualPotential.jsx`** — 2D canvas plot of both U⁺ and U⁻ curves with ground-state highlight, 5 key radii marked, position tracker.
- **`src/CouplingPlot.jsx`** — 2D canvas plot of f±(r) quartic coupling coefficient with λ/5 and SM reference lines.
- **`src/SombreroViz.jsx`** — Three.js 3D sombrero using `sombreroHeight(phi1, phi2, r)` from physics.js. 80×80 BufferGeometry grid, vertex-colored, auto-rotating.
- **`src/LambdaGauge.jsx`** — Numeric readout of ground-state coupling f(r) with progress bar.
- **`src/App.jsx`** — Main layout component. Manages `radialPos` state (slider range R_MIN to 4.0), responsive (mobile breakpoint 768px), wires all panels together.

## Key Physics Constants (from paper)

All radii in units of r₀ (Schwarzschild radius):
- `R_MIN = √(3/8) ≈ 0.612` — minimum physical radius
- `R_H = √(5−√21) ≈ 0.646` — deep well minimum
- `R_T = √(7/8) ≈ 0.935` — transition point
- `R_A = √(5+√21) ≈ 3.096` — accretion disk

## Dependencies

- React (hooks), Three.js (`three`), Google Fonts (Cormorant Garamond, IBM Plex Mono)
- No build config in this repo — import into a React host (Vite, Next.js, etc.)

## Reference Material

`particles-09-00037.pdf` is the source paper (doi:10.3390/particles9020037).
