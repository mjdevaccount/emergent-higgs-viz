# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-paper interactive visualization companion for Dragana Pilipović's research on stochastic spacetime. Currently features the 2026 Higgs paper, expanding to cover her full body of work (2023–2026).

## Commands

```bash
npm run dev      # Start dev server (Vite)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## Architecture

```
src/
  main.jsx                          — Root: paper selector + routing
  theme.js                          — SHARED: colors, fonts, style objects
  canvas-utils.js                   — SHARED: setupCanvas, drawGrid, drawCurve, etc.
  shared/
    PaperShell.jsx                  — Reusable paper layout (header, nav, slider, TOC)
    StarField.jsx                   — Animated canvas star background
    Eq.jsx                          — KaTeX equation renderer
    HoverTerm.jsx                   — Hover-highlight for physics terms
    HighlightContext.jsx            — React context for cross-component highlights
  papers/
    2026-higgs/                     — Each paper follows this template
      physics.js                    — Pure math functions (no UI)
      meta.js                       — Paper metadata + slider param config
      highlight.js                  — HoverTerm definitions (optional)
      index.jsx                     — Page compositor (PaperShell + sections)
      viz/                          — Canvas/Three.js visualization components
      sections/                     — Prose sections with embedded viz
      journey/                      — Immersive experience (optional)
tests/
  physics.test.js                   — Equation verification tests
  highlight.test.js                 — Highlight contract tests
```

## Conventions

- **Imports**: Use `@/` alias for shared modules (`@/theme.js`, `@/canvas-utils.js`, `@/shared/Eq.jsx`)
- **Physics**: Each paper has its own `physics.js`. Never hardcode constants in components.
- **Styles**: All colors, fonts, shared styles from `theme.js`. Never hardcode hex colors.
- **Canvas**: Use `setupCanvas`, `makeScales`, `drawGrid`, `drawCurve` from `canvas-utils.js`

## Dependencies

React 19, Three.js, KaTeX, Vite, Google Fonts (Cormorant Garamond, IBM Plex Mono).

---

## Adding a New Paper — Step-by-Step Pipeline

When the user provides a paper (PDF or discussion), follow these steps IN ORDER.
Each step is a separate focused task. Do NOT combine steps.

### Step 1: ANALYZE — Understand the paper
- Read the full paper
- Identify the core narrative arc (what problem → what approach → what result)
- List every numbered equation that produces a plottable output
- Note which figures from the paper could become interactive
- Identify the primary parameter the user would "sweep" (like r/r₀ for the Higgs paper, X=D/H for the Universe paper)
- Output: summary with equation inventory and parameter identification

### Step 2: PLAN — Design the interactive experience
- Map equations to visualization types:
  - 1D curves → canvas 2D plot (use canvas-utils)
  - 2D surfaces → Three.js or heatmap
  - State diagrams → canvas diagram
  - Data fits → scatter + curve overlay
  - Bar/gauge → React DOM component
- Group equations into logical sections (following paper structure)
- Define the TOC (table of contents entries)
- Define which terms get HoverTerm treatment (cross-referencing between prose and viz)
- Output: section plan with viz specs

### Step 3: PHYSICS — Implement equations
- Create `src/papers/YEAR-shortname/physics.js`
- Implement every equation identified in Step 1 as pure functions
- Export constants and functions only — no UI, no React
- Follow the existing pattern: reference equation numbers in comments
- Output: physics.js with all functions

### Step 4: TEST — Validate equations
- Create `tests/SHORTNAME-physics.test.js`
- Test boundary conditions, known values from the paper, asymptotic behavior
- Test symmetry properties where applicable
- Run tests, fix until all pass
- Output: passing test suite

### Step 5: META — Create paper metadata
- Create `src/papers/YEAR-shortname/meta.js`
- Include: id, year, title, shortTitle, author, journal, volume, date, doi, url, abstract
- Include: paramLabel, paramMin, paramMax, paramDefault, paramStep
- Include: hasJourney (usually false for new papers)
- Output: meta.js

### Step 6: VIZ — Build visualization components
- Create `src/papers/YEAR-shortname/viz/` directory
- One component per visualization, using:
  - `@/canvas-utils.js` for 2D plots (setupCanvas, makeScales, drawGrid, drawCurve, drawMarker, etc.)
  - `@/theme.js` for all colors and fonts
  - `../physics.js` for math functions
- Each component accepts at minimum: `{ param, width, height }` where param is the sweep parameter
- Keep components focused: ~70-120 lines each
- Output: viz components

### Step 7: SECTIONS — Write prose sections
- Create `src/papers/YEAR-shortname/sections/` directory
- Each section: prose + LaTeX equations + embedded viz component
- Use `@/shared/Eq.jsx` for equations
- Use `@/shared/HoverTerm.jsx` for interactive term highlighting (optional)
- Use `styles.section`, `styles.heading`, `styles.prose`, `styles.figureBox`, `styles.figureCaption` from theme
- Include local Slider component for per-section parameter control
- Output: section components

### Step 8: COMPOSE — Wire up the paper page
- Create `src/papers/YEAR-shortname/index.jsx`
- Import PaperShell, meta, and all sections
- Define TOC array
- Compose: `<PaperShell meta={meta} toc={TOC}> + anchored sections`
- Output: index.jsx

### Step 9: ROUTE — Add to site navigation
- Update `src/main.jsx` to include the new paper in the paper selector
- Ensure paper selector/timeline UI works
- Output: working navigation between papers

### Step 10: POLISH — Cross-references and hover effects
- Add `highlight.js` with term definitions if the paper has cross-referencing terms
- Wire HoverTerm into sections where terms reference specific viz elements
- Verify hover interactions work across sections
- Output: interactive cross-references

---

## Key Physics (2026 Higgs paper)

All radii in units of r₀ (Schwarzschild radius):
- `R_MIN = √(3/8) ≈ 0.612` — minimum physical radius
- `R_H = √(5−√21) ≈ 0.646` — deep well minimum
- `R_T = √(7/8) ≈ 0.935` — transition point
- `R_A = √(5+√21) ≈ 3.096` — accretion disk
- Tunneling probability |ψₐ|²/|ψₛ|² ≈ 1.13%
