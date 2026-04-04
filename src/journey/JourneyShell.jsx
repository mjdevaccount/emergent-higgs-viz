import { useState, useRef, useEffect, useCallback } from "react";
import { R_MIN, R_H, R_T, R_0, R_A } from "../physics.js";
import TerrainViz from "./TerrainViz.jsx";
import SombreroBowl from "./SombreroBowl.jsx";
import VevHud from "./VevHud.jsx";
import SoundScape from "./SoundScape.jsx";

// Scroll position maps to r/r₀: top = 4.0 (galaxy), bottom = R_MIN (core)
const R_TOP = 4.0;
const R_BOT = R_MIN + 0.01;
const SCROLL_HEIGHT = 6000; // px of scrollable content

function rFromScroll(scrollY, maxScroll) {
  const t = Math.min(1, Math.max(0, scrollY / maxScroll));
  return R_TOP - t * (R_TOP - R_BOT);
}

function getSection(r) {
  if (r > 3.5) return "galaxy";
  if (r > R_A - 0.2 && r < R_A + 0.4) return "accretion";
  if (r > R_0 + 0.05) return "exterior";
  if (r > R_0 - 0.05) return "horizon";
  if (r > R_H + 0.05) return "inside";
  return "core";
}

const SECTIONS = {
  galaxy: {
    title: "The Cosmos",
    subtitle: "r ≈ 4 r₀ — far from the black hole",
    text: "Out here, the Standard Model reigns. The vacuum expectation value v carries nearly all the field energy. The Higgs perturbation is negligible. This is the universe as we know it.",
  },
  accretion: {
    title: "The Accretion Disk",
    subtitle: "r ≈ 3.1 r₀ — the shallow moat",
    text: "A second minimum in the potential. Matter orbits here, and the quartic coupling drops to λ/5. The negative-VEV scalar field ψₐ lives in this shallow well.",
  },
  exterior: {
    title: "The Descent",
    subtitle: "Falling toward the event horizon",
    text: "The potential rises as you approach the Schwarzschild radius. The sombrero bowl tightens. The coupling strengthens. You're climbing the barrier ridge.",
  },
  horizon: {
    title: "The Event Horizon",
    subtitle: "r = r₀ — the point of no return",
    text: "The two potential states U⁻ and U⁺ cross here. Ground and excited states swap. The symmetry breaking transition happens just inside, at r = 0.935 r₀.",
  },
  inside: {
    title: "Inside the Black Hole",
    subtitle: "r < r₀ — the broken symmetry",
    text: "The VEV balance is shifting. The Higgs perturbation h is growing while v shrinks. Watch the vessels — the liquid is transferring.",
  },
  core: {
    title: "The Core",
    subtitle: "r ≈ 0.65 r₀ — where the Higgs field is born",
    text: "The deep well minimum. Here, h ≈ 220 GeV dominates over v ≈ 110 GeV. The quartic coupling is λ/5. The Higgs field isn't just a particle — it's the geometry of spacetime fluctuations normalized by the Schwarzschild radius.",
  },
};

export default function JourneyShell() {
  const [r, setR] = useState(R_TOP);
  const [soundOn, setSoundOn] = useState(false);
  const [showTunnel, setShowTunnel] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const scrollRef = useRef(null);

  useEffect(() => {
    const measure = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    const newR = rFromScroll(el.scrollTop, maxScroll);
    setR(newR);

    // Trigger tunneling beat at the core
    if (newR < R_H + 0.02 && !showTunnel) {
      setShowTunnel(true);
    }
  }, [showTunnel]);

  const section = getSection(r);
  const info = SECTIONS[section];

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#020208",
        color: "#e0e8f0",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />

      {/* Scroll spacer */}
      <div style={{ height: SCROLL_HEIGHT, position: "relative" }}>

        {/* Fixed viewport layer */}
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 1 }}>

          {/* Hero terrain */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
            {dims.w > 0 && <TerrainViz radialPos={r} width={dims.w} height={dims.h} />}
          </div>

          {/* Fog overlay — deepens past horizon */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: r < R_0
                ? `radial-gradient(ellipse at 50% 60%, rgba(0,20,40,${0.3 + (R_0 - r) * 0.4}) 0%, rgba(2,2,8,${0.5 + (R_0 - r) * 0.3}) 100%)`
                : "transparent",
              pointerEvents: "none",
              transition: "background 0.5s ease",
            }}
          />

          {/* Headline */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", padding: "40px 32px", zIndex: 10 }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                letterSpacing: 4,
                color: "rgba(0,212,255,0.4)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Journey Into a Black Hole
            </div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 300,
                lineHeight: 1.2,
                maxWidth: 500,
                transition: "opacity 0.5s ease",
              }}
            >
              {info.title}
            </h1>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "rgba(180,200,220,0.5)",
                marginTop: 8,
              }}
            >
              {info.subtitle}
            </div>
          </div>

          {/* Narrative text */}
          <div
            style={{
              position: "absolute",
              bottom: 80,
              left: 32,
              maxWidth: 420,
              zIndex: 10,
            }}
          >
            <p
              style={{
                fontSize: 17,
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.7,
                color: "rgba(200,210,220,0.6)",
                transition: "opacity 0.5s ease",
              }}
            >
              {info.text}
            </p>

            {/* Tunneling dramatic beat */}
            {showTunnel && section === "core" && (
              <div
                style={{
                  marginTop: 20,
                  padding: "16px 20px",
                  background: "rgba(255,215,0,0.05)",
                  border: "1px solid rgba(255,215,0,0.2)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10,
                    letterSpacing: 2,
                    color: "rgba(255,215,0,0.6)",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Tunneling Event
                </div>
                <p style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.6, color: "rgba(255,215,0,0.8)", margin: 0 }}>
                  You're trapped. The deep well holds almost everything. But every so often — with 1.13% probability — a particle ghosts through the barrier and escapes to the accretion disk. 99 fall back. 1 escapes.
                </p>
              </div>
            )}
          </div>

          {/* r indicator */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              right: 32,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12,
              color: "rgba(180,200,220,0.3)",
              zIndex: 10,
            }}
          >
            r / r₀ = {r.toFixed(3)}
          </div>

          {/* Sombrero bowl — bottom right */}
          <div
            style={{
              position: "absolute",
              bottom: 60,
              right: 20,
              zIndex: 10,
              opacity: 0.9,
            }}
          >
            <SombreroBowl radialPos={r} width={180} height={160} />
          </div>

          {/* Scroll hint at top */}
          {r > 3.8 && (
            <div
              style={{
                position: "absolute",
                bottom: 30,
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "rgba(180,200,220,0.3)",
                letterSpacing: 2,
                textTransform: "uppercase",
                animation: "pulse 2s ease-in-out infinite",
                zIndex: 10,
              }}
            >
              ↓ SCROLL TO DESCEND ↓
            </div>
          )}
        </div>
      </div>

      {/* VEV HUD — always visible */}
      <VevHud radialPos={r} />

      {/* Sound toggle */}
      <button
        onClick={() => setSoundOn(!soundOn)}
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          letterSpacing: 1,
          padding: "6px 12px",
          border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: 12,
          background: soundOn ? "rgba(0,212,255,0.1)" : "rgba(6,6,16,0.7)",
          color: soundOn ? "#00d4ff" : "rgba(180,200,220,0.3)",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
        }}
      >
        {soundOn ? "♪ ON" : "♪ OFF"}
      </button>
      <SoundScape radialPos={r} enabled={soundOn} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
