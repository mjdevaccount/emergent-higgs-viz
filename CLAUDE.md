# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-paper interactive visualization companion for Dragana Pilipović's research. Currently features "Emergent Higgs Field and the Schwarzschild Black Hole" (Particles 2026, 9(2), 37). Planned to expand to cover her 2023–2024 papers on stochastic spacetime, Hubble tension, and the infinitely old universe.

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

```
index.html                          — Vite entry point
vite.config.js                      — Vite + React + @ alias (src/)
src/
  main.jsx                          — Root: paper ↔ journey routing
  theme.js                          — SHARED: colors, fonts, style objects
  canvas-utils.js                   — SHARED: setupCanvas, drawGrid, drawCurve, etc.
  shared/
    PaperShell.jsx                  — Reusable paper layout (header, nav, slider, TOC)
    StarField.jsx                   — Animated canvas star background
    Eq.jsx                          — KaTeX equation renderer
    HoverTerm.jsx                   — Hover-highlight for physics terms
    HighlightContext.jsx            — React context for cross-component highlights
  papers/
    2026-higgs/
      physics.js                    — Equations (Eq. 32, 48, 49, 51, 55–62, 95–96)
      meta.js                       — Paper metadata (title, doi, param config)
      highlight.js                  — Highlight term definitions
      index.jsx                     — Paper page compositor
      viz/                          — 8 visualization components
        DualPotential.jsx           — U±(r) dual potential plot
        CouplingPlot.jsx            — f±(r) quartic coupling
        SombreroViz.jsx             — Three.js 3D sombrero
        LambdaGauge.jsx             — Coupling readout
        VevBreakdown.jsx            — h² + v² = (246 GeV)² bar
        TransitionDiagram.jsx       — Symmetry breaking path
        EntropyMap.jsx              — α₁ entropy regions
        SpatialMap.jsx              — Radial EW potential map
      sections/                     — 10 prose sections with embedded viz
      journey/                      — Immersive scroll-driven 3D experience
docs/
  particles-09-00037.pdf            — Source paper
tests/
  physics.test.js                   — 44 equation verification tests
  highlight.test.js                 — 38 highlight contract tests
```

## Adding a New Paper

1. Create `src/papers/YEAR-shortname/` with `physics.js`, `meta.js`, `index.jsx`
2. Add `viz/` for visualization components (import from `@/theme.js` + `@/canvas-utils.js`)
3. Add `sections/` for prose (import `@/shared/Eq.jsx`, `@/shared/PaperShell.jsx`)
4. Wire into `src/main.jsx` routing
5. Journey mode is optional — only add if the paper has a compelling spatial narrative

## Key Conventions

- **Imports**: Use `@/` alias for shared modules (`@/theme.js`, `@/canvas-utils.js`, `@/shared/Eq.jsx`)
- **Physics**: Each paper has its own `physics.js`. Never hardcode constants in components.
- **Styles**: All colors, fonts, shared styles come from `theme.js`. Never hardcode `#00d4ff` etc.
- **Canvas plots**: Use `setupCanvas`, `makeScales`, `drawGrid`, `drawCurve` etc. from `canvas-utils.js`

## Key Physics (2026 Higgs paper)

All radii in units of r₀ (Schwarzschild radius):
- `R_MIN = √(3/8) ≈ 0.612` — minimum physical radius
- `R_H = √(5−√21) ≈ 0.646` — deep well minimum
- `R_T = √(7/8) ≈ 0.935` — transition point
- `R_A = √(5+√21) ≈ 3.096` — accretion disk
- Tunneling probability |ψₐ|²/|ψₛ|² ≈ 1.13%

## Dependencies

React 19, Three.js, KaTeX, Vite, Google Fonts (Cormorant Garamond, IBM Plex Mono).
