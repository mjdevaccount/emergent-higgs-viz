# Stochastic Spacetime — Interactive Research Companion

A multi-paper interactive visualization platform covering Dragana Pilipovi&#263;'s four-year research program on stochastic spacetime: from the Hubble tension (2023) through the mathematical foundations (2024) to an infinitely old universe (2024) and emergent Higgs fields inside black holes (2026).

**Live:** [mjdevaccount.github.io/emergent-higgs-viz](https://mjdevaccount.github.io/emergent-higgs-viz/)

---

## The Problem

Physics papers are static. The equations live on a page, but the reader never gets to *touch* them — to drag a parameter and watch a potential deform, to see how species fractions evolve as the universe ages, or to fall through an event horizon and watch the Higgs field emerge from geometry.

This project makes four interconnected research papers interactive. Each visualization is driven by the actual published equations, validated against the papers with 346 automated tests. No approximations, no hand-waving — the math is the code.

## What I Built

A **self-extending visualization platform** with an AI-assisted pipeline that takes a physics paper and produces a fully interactive, code-split, test-validated experience — complete with hover cross-references between prose and visualizations.

### Four papers, one narrative

| Year | Paper | Key Result | Interactive Elements |
|------|-------|-----------|---------------------|
| **2023** | [Late-time dark energy and Hubble tension](https://doi.org/10.1515/astro-2022-0221) | Spacetime diffusion resolves the H&#8320; discrepancy without changing the Hubble parameter | D&#177; diffusion states, w(f) equation of state, luminosity distance fits against real SNe Ia data |
| **2024** | [Stochastic spacetime algebra](https://doi.org/10.3390/sym16010036) | ML spacetime preserves Poincar&#233; symmetry; galaxy rotation curves flatten without dark matter | Animated Langevin phase space, SPARC galaxy rotation curves (7 galaxies), velocity vs. stellar mass analysis |
| **2024** | [Infinitely old universe](https://doi.org/10.3390/universe10100400) | Asymptotically static eras before and after the Big Bang, connected by a singularity at X=4/3 | Flat vs. curved EoS tension/resolution, acceleration with Big Bang singularity, species fraction evolution, Planck field potentials |
| **2026** | [Emergent Higgs field](https://doi.org/10.3390/particles9020037) | The Higgs mechanism emerges from stochastic spacetime inside a Schwarzschild black hole, with &#955;/5 coupling | 8 interactive visualizations + immersive 3D black hole descent with gravitational lensing, particle tunneling, and spatial audio |

The narrative arc: *uncertainty in spacetime* &#8594; *cosmological consequences* &#8594; *the Higgs field emerges from geometry*.

---

## Architecture

### Multi-paper platform

```
src/
  theme.js              Shared design system (colors, fonts, 25+ style objects)
  canvas-utils.js       Shared canvas drawing (15 reusable functions)
  shared/               PaperShell, StarField, Eq, HoverTerm, HighlightContext
  papers/
    2023-hubble/        physics.js, meta.js, 3 viz, 4 sections, highlights
    2024-symmetry/      physics.js, meta.js, 3 viz, 5 sections, highlights
    2024-universe/      physics.js, meta.js, 5 viz, 6 sections, highlights
    2026-higgs/         physics.js, meta.js, 8 viz, 10 sections, highlights, journey
```

Each paper is **self-contained**: its own physics module, metadata, visualizations, prose sections, and highlight definitions. Papers share only the design system and layout primitives.

### Key engineering decisions

| Decision | Why |
|----------|-----|
| **Lazy-loaded code splitting** | Each paper is a separate chunk (14-39 KB). Timeline loads in 194 KB. Three.js (515 KB) only loads if you enter the Journey. |
| **Pure physics modules** | Every `physics.js` is framework-free — pure math functions with equation-number comments. No React, no theme, no UI. Testable in isolation. |
| **346 automated tests** | 9 test suites verify boundary conditions, asymptotic limits, conservation laws, symmetry properties, and highlight contracts. Tests caught real bugs (discriminant formula, Friedmann w substitution). |
| **Hover cross-references** | HoverTerm in prose &#8594; glowing element in visualization. Implemented via React context + per-paper highlight contracts with consumer maps. |
| **Canvas utility extraction** | `setupCanvas`, `drawGrid`, `drawCurve`, `drawMarker` etc. reduce each plot from ~170 to ~80 lines. |
| **Vite `@/` alias** | Clean imports across the tree: `@/theme.js`, `@/shared/Eq.jsx`, `@/canvas-utils.js`. |

### The 2026 Higgs paper: Journey mode

The flagship paper includes a cinematic scroll-driven descent into a black hole:

- **Three.js black hole** with edge glow shader and rotating accretion disk
- **Gravitational lensing** — screen-space Schwarzschild deflection post-processing
- **1,500 instanced particles** spiraling inward; 1.13% escape as gold streaks (tunneling probability from the paper)
- **Depth gauge** and **VEV balance bar** — HUD elements driven by the physics engine
- **Core reveal**: darkness &#8594; *"Mass is born here."* &#8594; the sombrero potential blooms
- **Spatial audio** drone that deepens with descent (Web Audio API)

---

## Development

```bash
npm install
npm run dev              # Vite dev server with HMR
npm run build            # Production build (code-split, lazy-loaded)
npm run preview          # Preview production build
node tests/*.test.js     # Run all 346 tests across 9 suites
```

### Adding a new paper

The project includes a documented 10-step pipeline (`.claude/skills/add-paper/SKILL.md`):

1. **ANALYZE** — Read paper, inventory plottable equations, identify sweep parameter
2. **PLAN** — Map equations to viz types, define TOC and sections
3. **PHYSICS** — Implement equations as pure functions
4. **TEST** — Write and run coded test suite (boundary conditions, asymptotics, symmetry)
5. **META** — Create paper metadata (title, DOI, slider config)
6. **VIZ** — Build canvas/Three.js components using shared utilities
7. **SECTIONS** — Write prose with embedded LaTeX and visualizations
8. **COMPOSE** — Wire sections into PaperShell layout
9. **ROUTE** — Add to registry with lazy loading
10. **POLISH** — Add hover cross-references with contract tests

Each step is a natural commit boundary. The pipeline is validated — papers 2-4 were built using it.

### Agentic workflow tooling

| Tool | Purpose |
|------|---------|
| **`/add-paper` skill** | Executable 10-step pipeline for adding papers |
| **PostToolUse hook** | Auto-runs physics tests after writing to `physics.js` |
| **PostCompact hook** | Re-injects project state after context compression |
| **Path-scoped rules** | Import/style conventions load only when editing paper files |
| **34-line CLAUDE.md** | Lean project context (~500 tokens saved per prompt vs inline instructions) |

### Stack

| Technology | Purpose |
|---|---|
| React 19 | Component architecture |
| Three.js | 3D sombrero, black hole scene, instanced particles, gravitational lensing |
| KaTeX | LaTeX equation rendering |
| Vite | Build tooling, code splitting, HMR |
| Canvas 2D | Scientific plots (19 visualization components) |
| Web Audio API | Spatial audio (Journey mode) |

---

## Test coverage

```
tests/physics.test.js           44 passed   (2026 Higgs equations)
tests/highlight.test.js         38 passed   (2026 Higgs hover contracts)
tests/eq-hover.test.js          12 passed   (equation hover integration)
tests/universe-physics.test.js  41 passed   (2024 Universe equations)
tests/universe-highlight.test.js 22 passed  (2024 Universe hover contracts)
tests/symmetry-physics.test.js  86 passed   (2024 Symmetry equations + SPARC data)
tests/symmetry-highlight.test.js 20 passed  (2024 Symmetry hover contracts)
tests/hubble-physics.test.js    70 passed   (2023 Hubble equations + SNe Ia data)
tests/hubble-highlight.test.js  13 passed   (2023 Hubble hover contracts)
─────────────────────────────────────────────
                               346 passed, 0 failed
```

Tests verify against the published papers: known values at critical points, asymptotic convergence at large parameter values (X=1000+), conservation laws (&#8721;&#937;&#7522; = 1), symmetry properties (V(-&#966;) = V(&#966;)), and highlight system contracts (every term has consumers, every consumer responds correctly).

---

## Citations

```bibtex
@article{Pilipovic2023,
  author  = {Pilipovi\'{c}, Dragana},
  title   = {Late-time dark energy and Hubble tension},
  journal = {Open Astronomy},
  volume  = {32},
  pages   = {20220221},
  year    = {2023},
  doi     = {10.1515/astro-2022-0221}
}

@article{Pilipovic2024a,
  author  = {Pilipovi\'{c}, Dragana},
  title   = {The Algebra and Calculus of Stochastically Perturbed Spacetime},
  journal = {Symmetry},
  volume  = {16},
  pages   = {36},
  year    = {2024},
  doi     = {10.3390/sym16010036}
}

@article{Pilipovic2024b,
  author  = {Pilipovi\'{c}, Dragana},
  title   = {An Infinitely Old Universe with Planck Fields},
  journal = {Universe},
  volume  = {10},
  pages   = {400},
  year    = {2024},
  doi     = {10.3390/universe10100400}
}

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

The source papers are published under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). This visualization platform is open source.
