# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Interactive React visualization of the paper "Emergent Higgs Field & the Schwarzschild Black Hole" (Pilipović, Particles 2026, 9(2), 37). A single JSX component (`emergent-higgs.jsx`) renders a dual-panel scientific visualization showing how the electroweak sombrero potential deforms near a Schwarzschild black hole.

## Architecture

`emergent-higgs.jsx` exports one default component (`EmergentHiggs`) composed of:

- **Physics helpers** (top of file): `spatialPotential(r)` computes V(r) near a Schwarzschild BH (Gaussian wells/barriers). `effectiveLambda(r)` derives the position-dependent quartic coupling. `sombreroHeight(phi1, phi2, lambda)` evaluates the Mexican-hat potential. Key constants: `LAMBDA_SM = 0.13`, `VEV = 246 GeV`.
- **StarField**: Animated canvas background with twinkling stars.
- **SpatialPlot**: 2D canvas plot of V(r) with markers for r_s and accretion disk, plus a gold dot tracking the user's slider position.
- **SombreroViz**: Three.js 3D sombrero potential that morphs geometry and vertex colors in real-time as `radialPos` changes. Uses `THREE.BufferGeometry` with an 80×80 grid.
- **LambdaGauge**: Displays current λ ratio with a progress bar; highlights when at potential minimum (λ/5).
- **EmergentHiggs** (main): Manages `radialPos` state via a slider (range 0.05–4.0 r_s), responsive layout (mobile breakpoint at 768px).

## Dependencies

- React (useState, useRef, useEffect, useCallback, useMemo)
- Three.js (`three`)
- Google Fonts: Cormorant Garamond, IBM Plex Mono (loaded via `<link>` in JSX)

This file is meant to be used inside a React app (e.g., Next.js, Vite+React). There is no build configuration in this repo — the JSX must be imported by a host project.

## Reference Material

`particles-09-00037.pdf` is the source paper (doi:10.3390/particles9020037). Consult it for the physics behind the spatial potential shape, the λ→λ/5 result, and VEV conservation.
