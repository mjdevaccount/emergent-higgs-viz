# CLAUDE.md

Multi-paper interactive visualization companion for Dragana Pilipović's research on stochastic spacetime.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # Production build
node tests/*.test.js # Run all test suites
```

## Architecture

```
src/
  main.jsx              — Root: timeline → paper → journey routing
  theme.js              — Colors, fonts, shared style objects
  canvas-utils.js       — Canvas drawing utilities (setupCanvas, drawCurve, etc.)
  shared/               — PaperShell, StarField, Eq, HoverTerm, HighlightContext
  papers/
    YEAR-shortname/     — Each paper follows this template:
      physics.js        — Pure math (no UI)
      meta.js           — Metadata + slider config
      highlight.js      — HoverTerm definitions
      index.jsx         — PaperShell + sections compositor
      viz/              — Canvas/Three.js visualization components
      sections/         — Prose with embedded viz
      journey/          — Immersive experience (optional)
```

## Adding a Paper

Use `/add-paper YEAR-shortname` — see `.claude/skills/add-paper/SKILL.md` for the full 10-step pipeline.

## Conventions

- `@/` Vite alias resolves to `src/`
- Colors/fonts from `theme.js` — never hardcode hex
- Canvas plots use `canvas-utils.js` utilities
- Physics files are pure — no React, no theme
- Each paper's tests: `node tests/SHORTNAME-physics.test.js`
- See `.claude/rules/` for path-specific coding rules

## Current Papers

| Year | Paper | Tests | Status |
|------|-------|-------|--------|
| 2026 | Emergent Higgs (particles9020037) | 44 + 38 | Complete |
| 2024 | Infinitely Old Universe (universe10100400) | 41 + 22 | Complete |
| 2024 | Stochastic Spacetime (sym16010036) | — | Planned |
| 2023 | Hubble Tension (astro-2022-0221) | — | Planned |
