import { useState, useRef, useEffect } from "react";
import { R_MIN, R_0, R_A, R_H, groundState, excitedState } from "./physics.js";
import { colors, rgba, fonts, styles } from "./theme.js";
import StarField from "./components/StarField.jsx";
import DualPotentialPlot from "./components/DualPotential.jsx";
import CouplingPlot from "./components/CouplingPlot.jsx";
import SombreroViz from "./components/SombreroViz.jsx";
import LambdaGauge from "./components/LambdaGauge.jsx";
import VevBreakdown from "./components/VevBreakdown.jsx";
import TransitionDiagram from "./components/TransitionDiagram.jsx";
import EntropyMap from "./components/EntropyMap.jsx";

export default function EmergentHiggs() {
  const [radialPos, setRadialPos] = useState(2.0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDims({ w: containerRef.current.clientWidth, h: window.innerHeight });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const isMobile = dims.w < 768;
  const panelW = isMobile ? dims.w - 32 : Math.min((dims.w - 80) / 2, 560);
  const panelH = isMobile ? 280 : 360;
  const wideW = isMobile ? dims.w - 32 : Math.min(dims.w - 80, 900);

  const groundV = groundState(radialPos);
  const excitedV = excitedState(radialPos);

  let regionLabel = "";
  if (radialPos < R_H + 0.01) regionLabel = "deep well minimum";
  else if (radialPos < R_0 - 0.05) regionLabel = "inside Schwarzschild sphere";
  else if (radialPos < R_0 + 0.05) regionLabel = "near Schwarzschild horizon";
  else if (radialPos < R_A - 0.3) regionLabel = "exterior region";
  else if (radialPos < R_A + 0.3) regionLabel = "accretion disk";
  else regionLabel = "far exterior";

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at 50% 20%, #0d1117 0%, #060610 50%, #020208 100%)",
        color: "#e0e8f0",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />

      <StarField />

      <div
        style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          width: 800,
          height: 800,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(0,50,120,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        {/* ── Header ── */}
        <header
          style={{
            textAlign: "center",
            padding: isMobile ? "40px 20px 20px" : "60px 40px 30px",
            borderBottom: "1px solid rgba(0,212,255,0.08)",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: 4,
              color: "rgba(0,212,255,0.5)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Interactive Visualization
          </div>
          <h1
            style={{
              fontSize: isMobile ? 28 : 44,
              fontWeight: 300,
              lineHeight: 1.15,
              margin: "0 auto",
              maxWidth: 700,
              letterSpacing: -0.5,
            }}
          >
            Emergent Higgs Field
            <br />
            <span style={{ color: "#00d4ff" }}>& the Schwarzschild Black Hole</span>
          </h1>
          <div
            style={{
              marginTop: 16,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color: "rgba(180,200,220,0.5)",
            }}
          >
            Dragana Pilipović &nbsp;·&nbsp; Particles 2026, 9(2), 37
            &nbsp;·&nbsp; doi:10.3390/particles9020037
          </div>
          <p
            style={{
              maxWidth: 640,
              margin: "20px auto 0",
              fontSize: isMobile ? 15 : 17,
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.6,
              color: "rgba(200,210,220,0.65)",
            }}
          >
            The electroweak potential mapped simultaneously in physical space
            and across the EW sector — dual ground/excited states, exact
            quartic coupling f(r), and the position-dependent sombrero potential.
          </p>
        </header>

        {/* ── Dual Potential Plot ── */}
        <section style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 32px" }}>
          <div style={styles.sectionTitle}>Dual Potential States U±(r) — Eq. 32</div>
          <div style={styles.panelBox}>
            {wideW > 0 && <DualPotentialPlot radialPos={radialPos} width={wideW} height={panelH + 40} />}
          </div>
          <div style={styles.caption}>
            U⁻ is ground state inside r₀ &nbsp;·&nbsp; U⁺ is ground state outside r₀ &nbsp;·&nbsp; Crossover at Schwarzschild radius
          </div>
        </section>

        {/* ── Coupling + Sombrero side by side ── */}
        <section
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: isMobile ? 16 : 32,
            padding: isMobile ? "24px 16px" : "20px 32px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div>
            <div style={styles.sectionTitle}>Quartic Coupling f±(r) — Eq. 51</div>
            <div style={styles.panelBox}>
              {panelW > 0 && <CouplingPlot radialPos={radialPos} width={panelW} height={panelH} />}
            </div>
            <div style={styles.caption}>Coupling drops toward λ/5 at potential minima</div>
          </div>
          <div>
            <div style={styles.sectionTitle}>Sombrero Potential — Eq. 48</div>
            <div style={styles.panelBox}>
              {panelW > 0 && <SombreroViz radialPos={radialPos} width={panelW} height={panelH} />}
            </div>
            <div style={styles.caption}>Shape morphs with radial position — VEV conserved</div>
          </div>
        </section>

        {/* ── Slider ── */}
        <div style={{ maxWidth: 700, margin: "0 auto", padding: isMobile ? "16px 20px 0" : "16px 32px 0" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "rgba(180,200,220,0.4)",
              marginBottom: 6,
            }}
          >
            <span>r = r_min</span>
            <span style={{ color: "rgba(255,215,0,0.7)", fontSize: 13 }}>
              r / r₀ = {radialPos.toFixed(3)}
            </span>
            <span>r = 4r₀</span>
          </div>
          <div style={{ position: "relative", height: 32 }}>
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 0,
                right: 0,
                height: 3,
                background: "rgba(0,212,255,0.12)",
                borderRadius: 2,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 0,
                width: `${((radialPos - R_MIN) / (4.0 - R_MIN)) * 100}%`,
                height: 3,
                background: "linear-gradient(90deg, #00d4ff, #ffd700)",
                borderRadius: 2,
                transition: "width 0.05s ease",
              }}
            />
            <input
              type="range"
              min={R_MIN + 0.001}
              max={4.0}
              step={0.001}
              value={radialPos}
              onChange={(e) => setRadialPos(parseFloat(e.target.value))}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 32,
                opacity: 0,
                cursor: "pointer",
                zIndex: 10,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 8,
                left: `calc(${((radialPos - R_MIN) / (4.0 - R_MIN)) * 100}% - 8px)`,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#ffd700",
                boxShadow: "0 0 16px rgba(255,215,0,0.5), 0 0 4px rgba(255,215,0,0.8)",
                pointerEvents: "none",
                transition: "left 0.05s ease",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "rgba(180,200,220,0.35)",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Drag to traverse radial distance from black hole center
          </div>
        </div>

        {/* ── Metrics Row ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: isMobile ? 24 : 64,
            padding: isMobile ? "32px 16px" : "48px 32px",
            flexWrap: "wrap",
          }}
        >
          <LambdaGauge radialPos={radialPos} />

          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div style={styles.metricLabel}>Ground State</div>
            <div style={{ ...styles.metricValue, color: colors.gold }}>
              {!isNaN(groundV) ? groundV.toFixed(3) : "—"}
            </div>
            <div style={styles.metricSub}>
              {radialPos <= R_0 ? "U⁻ (inside r₀)" : "U⁺ (outside r₀)"}
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div style={styles.metricLabel}>Region</div>
            <div
              style={{
                ...styles.metricValue,
                fontSize: 22,
                color: radialPos <= R_0 ? colors.cyan : radialPos < R_A + 0.3 ? colors.gold : colors.text,
                minWidth: 150,
              }}
            >
              {regionLabel}
            </div>
            <div style={styles.metricSub}>r / r₀ = {radialPos.toFixed(3)}</div>
          </div>

          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div style={styles.metricLabel}>Higgs VEV</div>
            <div style={styles.metricValue}>
              246
              <span style={{ fontSize: 16, marginLeft: 4, color: "rgba(180,200,220,0.5)" }}>GeV</span>
            </div>
            <div style={styles.metricSub}>CONSERVED ACROSS ALL r</div>
          </div>
        </div>

        {/* ── VEV Conservation ── */}
        <section
          style={{
            maxWidth: 500,
            margin: "0 auto",
            padding: isMobile ? "16px 16px 32px" : "16px 32px 48px",
          }}
        >
          <VevBreakdown radialPos={radialPos} />
        </section>

        {/* ── Transition + Entropy side by side ── */}
        <section
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: isMobile ? 16 : 32,
            padding: isMobile ? "24px 16px" : "20px 32px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div>
            <div style={styles.sectionTitle}>Transition & Tunneling — §3.6, §3.9</div>
            <div style={styles.panelBox}>
              {panelW > 0 && <TransitionDiagram width={panelW} height={panelH - 40} />}
            </div>
            <div style={styles.caption}>
              Natural drop to rₕ or tunneling to rₐ (1.13%)
            </div>
          </div>
          <div>
            <div style={styles.sectionTitle}>Vacuum Entropy α₁ — Eq. 95, 114</div>
            <div style={styles.panelBox}>
              {panelW > 0 && <EntropyMap radialPos={radialPos} width={panelW} height={panelH - 40} />}
            </div>
            <div style={styles.caption}>
              S &gt; 0 inside Schwarzschild sphere · S &lt; 0 in accretion region
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            padding: isMobile ? "24px 20px 40px" : "32px 40px 60px",
            textAlign: "center",
            borderTop: "1px solid rgba(0,212,255,0.08)",
          }}
        >
          <p
            style={{
              fontSize: isMobile ? 16 : 19,
              fontWeight: 300,
              lineHeight: 1.7,
              color: "rgba(200,210,220,0.75)",
              margin: 0,
            }}
          >
            The Schwarzschild metric emerges as a statistical structure from
            stochastic spacetime. Two potential states U⁻ and U⁺ cross at r₀,
            defining a position-dependent sombrero where the quartic coupling
            drops to λ/5 at the potential minima — a consequence of VEV
            conservation when Higgs perturbations dominate. The two scalar
            fields ψ<sub>s</sub> and ψ<sub>a</sub> are statistically entangled
            to preserve the electroweak VEV, with 1.13% tunneling probability
            from the deep well to the accretion disk.
          </p>
          <div
            style={{
              marginTop: 24,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              color: "rgba(180,200,220,0.3)",
            }}
          >
            doi:10.3390/particles9020037 &nbsp;·&nbsp; Published April 3, 2026
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles now imported from src/theme.js
