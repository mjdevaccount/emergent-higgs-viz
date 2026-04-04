# Emergent Higgs Field & the Schwarzschild Black Hole

Interactive visualization of [Dragana Pilipovic's 2026 paper](https://doi.org/10.3390/particles9020037) exploring how the electroweak Higgs field emerges from stochastic spacetime perturbations inside a Schwarzschild black hole.

**The one-sentence version:** *This paper says the thing that gives everything mass is born inside black holes.*

## Two Ways to Experience It

The app has two modes, toggled via the button in the top-right corner.

### Journey Mode (default)

A scroll-driven descent into a black hole. You start at a distant galaxy and fall inward. Every visual element is powered by the same exact equations from the paper — but rendered as physical metaphors instead of graphs.

**Scroll down = fall in.** Your scroll position maps directly to radial distance `r/r₀` from the black hole center.

| Scroll position | Where you are | What you see |
|---|---|---|
| Top of page | Galaxy (`r ≈ 4r₀`) | Calm starfield. Standard Model reigns. |
| ~25% | Accretion disk (`r ≈ 3.1r₀`) | Shallow moat in the terrain. First λ/5 point. |
| ~50% | Exterior descent | Terrain rises toward the barrier ridge. |
| ~65% | Event horizon (`r = r₀`) | The ridge. Ground/excited states swap. |
| ~80% | Inside the black hole | VEV vessels start tipping. Fog deepens. |
| Bottom | The core (`r ≈ 0.65r₀`) | Deep pit. Higgs field is born. Tunneling beat triggers. |

**Visual elements:**

- **Terrain landscape** (full viewport): A Three.js cross-section of the potential `U(r)` rendered as physical terrain. The deep well is a literal pit, the Schwarzschild radius is a ridge, the accretion disk is a shallow moat. A glowing particle sits on the surface and tracks your position. Lighting, fog, and camera angle shift as you descend.

- **VEV vessels** (bottom-left HUD): Two connected vessels labeled `v` and `h`. Outside the black hole, the `v` vessel (cyan) is full — the vacuum expectation value carries nearly all field energy. As you cross the horizon, liquid flows from `v` to `h` (gold) until h ≈ 220 GeV and v ≈ 110 GeV. The total φ = 246 GeV never changes. This is the λ/5 story told without equations — pure conservation you can see.

- **Sombrero bowl** (bottom-right): A ceramic-looking bowl with a ball bearing in the rim. This is the electroweak "Mexican hat" potential. It warps in real-time as you scroll — wider and shallower at the potential minima (λ/5 regime), tighter and deeper at the barrier.

- **Narrative text** (bottom-left): Section-specific descriptions explaining what's happening at each stage of the descent, tied to the corresponding paper sections.

- **Tunneling beat**: When you reach the core, a dramatic callout appears: *"You're trapped. Except..."* — explaining the 1.13% probability of a particle tunneling through the barrier to escape to the accretion disk.

- **Sound** (off by default): Click the ♪ button in the bottom-right to enable a low-frequency Web Audio drone that deepens as you descend. Subtle binaural beating effect.

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
    JourneyShell.jsx            Scroll container, r mapping, narrative
    TerrainViz.jsx              Three.js terrain landscape (hero)
    SombreroBowl.jsx            Ceramic bowl + marble
    VevHud.jsx                  Persistent VEV balance overlay
    SoundScape.jsx              Web Audio drone

docs/
  particles-09-00037.pdf        Source paper
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
- **Three.js** — 3D terrain, sombrero, and bowl rendering
- **Vite** — Dev server and bundler
- **Web Audio API** — Sound (browser-native, no library)
- **Google Fonts** — Cormorant Garamond (serif), IBM Plex Mono (monospace)

## Reference

Pilipovic, D. (2026). *Emergent Higgs Field and the Schwarzschild Black Hole.* Particles, 9(2), 37. [doi:10.3390/particles9020037](https://doi.org/10.3390/particles9020037)
