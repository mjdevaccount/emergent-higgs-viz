# Emergent Higgs Field & the Schwarzschild Black Hole

Interactive visualization of [Dragana Pilipovic's 2026 paper](https://doi.org/10.3390/particles9020037) exploring how the electroweak Higgs field emerges from stochastic spacetime perturbations inside a Schwarzschild black hole.

**The one-sentence version:** *This paper says the thing that gives everything mass is born inside black holes.*

## Two Ways to Experience It

The app has two modes, toggled via the button in the top-right corner.

### Journey Mode (default)

A scroll-driven descent into a black hole. You start at a distant galaxy and fall inward. Every visual element is powered by the same exact equations from the paper — but rendered as physical metaphors instead of graphs.

**Scroll down = fall in.** Your scroll position maps directly to radial distance `r/r₀` from the black hole center. The camera spirals inward over 2.5 rotations.

**Five distinct visual phases** — each section looks and feels completely different from the last:

| Phase | r range | What happens |
|---|---|---|
| **Cosmos** | r > 3.5r₀ | Bright stars, small distant black hole, calm blue/white palette. |
| **Accretion zone** | ~3.1r₀ | Stars dim. Accretion disk brightens dramatically. First gold flickers in the cyan. |
| **Approach** | 3r₀ → r₀ | Stars stretch into radial lines. Black hole grows from 5% to 80% of viewport. |
| **Crossing** | r₀ | Hard white flash. Stars vanish completely. Color palette inverts to gold-dominant. |
| **Interior** | r₀ → 0.65r₀ | Dark, foggy, claustrophobic. Gold particles are the only bright things. |

**Visual elements:**

- **Black hole** (full viewport): A Three.js scene with a black sphere (event horizon), glowing edge shader, and rotating accretion disk ring. The black hole starts as a dot and grows to fill the screen. The accretion disk color shifts from cyan (vacuum) to gold (Higgs) as you cross the horizon — the color IS the VEV story.

- **1500 particles**: Instanced mesh particles spiral inward. Most get trapped at the core. Every few seconds, one escapes outward glowing gold — that's your 1.13% tunneling probability rendered as a visual event.

- **Depth gauge** (right side): Vertical progress bar with tick marks at each key radius — "the cosmos", "accretion disk", "event horizon", "symmetry breaks", "the core". A glowing dot tracks your position. You can see what's coming before you get there.

- **VEV balance bar** (bottom center): Thin horizontal bar — cyan (vacuum field) on the left, gold (Higgs field) on the right. Tips past 50% when you cross the horizon. The whole λ/5 story told silently.

- **Chapter cards**: Full-viewport centered text that fades in between visual sections — *"Far from the black hole, physics works the way we expect."* ... *"You cross the event horizon. There is no going back."*

- **Core reveal**: Screen goes dark. Pause. Then *"Mass is born here."* fades in gold. The sombrero potential blooms underneath — the black hole's interior literally becomes the Mexican hat potential.

- **Post-credits**: At the very bottom, everything goes still and dark. A single gold particle slowly drifts upward and escapes. *"1.13% chance of escape."*

- **Sound** (off by default): Click the ♪ button to enable a Web Audio API drone that deepens as you descend. Subtle binaural beating effect.

### Technical Mode

The traditional scientific visualization with exact plots from the paper. All panels share a single radial position slider (`r/r₀`).

**Panels:**

- **Dual Potential U±(r)** — Equation 32. Both U⁺ and U⁻ curves plotted with the ground state highlighted in gold. U⁻ is the ground state inside `r₀`, U⁺ outside. They cross at the Schwarzschild radius. Five key radii are marked with dashed lines.

- **Quartic Coupling f±(r)** — Equation 51. The position-dependent quartic coupling coefficient relative to the Standard Model λ. Reference lines at `f = 1` (SM) and `f = 1/5` (potential minima). Shows how the coupling drops at the deep well and accretion disk.

- **3D Sombrero Potential** — Equations 48/49. A Three.js wireframe + solid surface of the electroweak sombrero hat potential. Shape morphs in real-time as the slider moves through r-space, driven by `Z±(r)`.

- **Lambda Gauge** — Numeric readout of the ground-state coupling `f(r)` with a progress bar. Highlights gold when near a potential minimum (λ/5 regime).

- **VEV Conservation** — Equations 55–62. Stacked bar showing h² (gold) + v² (cyan) = (246 GeV)² with numeric values. At `f = 1/5`: v ≈ 110 GeV, h ≈ 220 GeV. Contextual callout explains whether you're in the SM regime, transitional, or λ/5 regime.

- **Transition & Tunneling Diagram** — Sections 3.6, 3.9. Schematic of the symmetry breaking path at `r_T ≈ 0.935r₀`: natural drop to the deep well at `rₕ` or tunneling (dashed, 1.13%) to the accretion disk at `rₐ`. Shows statistical entanglement between ψₛ and ψₐ for VEV conservation.

- **Vacuum Entropy α₁** — Equations 95, 114. The Fokker–Planck parameter governing Higgs vacuum density evolution. Background shading shows entropy sign: green = positive entropy (inside Schwarzschild sphere), red = negative entropy (accretion region).

## Key Physics

All math lives in `src/physics.js`. Every constant is derived exactly from the paper — no approximations or hand-tuned curves.

| Symbol | Value | Meaning |
|---|---|---|
| `R_MIN` | √(3/8) ≈ 0.612 r₀ | Minimum physical radius |
| `R_H` | √(5−√21) ≈ 0.646 r₀ | Deep well minimum |
| `R_T` | √(7/8) ≈ 0.935 r₀ | EW symmetry breaking transition |
| `R_0` | 1.0 r₀ | Schwarzschild radius |
| `R_A` | √(5+√21) ≈ 3.096 r₀ | Accretion disk minimum |
| VEV | 246 GeV | Electroweak vacuum expectation value (conserved) |
| Tunneling | 1.13% | \|ψₐ\|²/\|ψₛ\|² escape probability |

**The central result:** At the potential minima (inside the black hole and at the accretion disk), the Standard Model quartic coupling λ is reduced to λ/5. This is not a free parameter — it follows directly from VEV conservation when Higgs perturbations dominate the scalar field (h² = 4v²).

## Project Structure

```
index.html                      Vite entry point
vite.config.js                  Vite + React plugin
package.json                    Dependencies and scripts

src/
  main.jsx                      React root, page toggle between modes
  App.jsx                       Technical mode layout and composition
  PageToggle.jsx                Journey / Technical mode switcher
  physics.js                    All equations from the paper, no UI code

  components/                   Technical mode panels
    DualPotential.jsx           U±(r) canvas plot
    CouplingPlot.jsx            f±(r) canvas plot
    SombreroViz.jsx             Three.js sombrero wireframe
    LambdaGauge.jsx             Coupling readout
    VevBreakdown.jsx            h² + v² stacked bar
    TransitionDiagram.jsx       Symmetry breaking schematic
    EntropyMap.jsx              α₁ parameter plot
    StarField.jsx               Animated star background

  journey/                      Journey mode experience
    JourneyShell.jsx            Scroll container, phases, chapter cards
    BlackHoleScene.jsx          Three.js black hole with all visual phases
    particles.js                Instanced particle system (spiral + tunneling)
    DepthGauge.jsx              Right-side vertical progress indicator
    VevBar.jsx                  Bottom-center balance bar (cyan/gold)
    SoundScape.jsx              Web Audio drone

docs/
  particles-09-00037.pdf        Source paper
  particles-09-00037.md         Paper converted to markdown
```

## Getting Started

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build     # Production build to dist/
npm run preview   # Preview the production build
```

Requires Node.js 18+.

## Dependencies

- **React 19** — UI framework
- **Three.js** — 3D black hole scene, sombrero, and sombrero wireframe
- **Vite** — Dev server and bundler
- **Web Audio API** — Sound (browser-native, no library)
- **Google Fonts** — Cormorant Garamond (serif), IBM Plex Mono (monospace)

## Reference

Pilipovic, D. (2026). *Emergent Higgs Field and the Schwarzschild Black Hole.* Particles, 9(2), 37. [doi:10.3390/particles9020037](https://doi.org/10.3390/particles9020037)
