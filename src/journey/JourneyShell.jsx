import { useState, useRef, useEffect, useCallback } from "react";
import { R_MIN, R_H, R_T, R_0, R_A } from "../physics.js";
import BlackHoleScene from "./BlackHoleScene.jsx";
import SoundScape from "./SoundScape.jsx";

const R_TOP = 4.0;
const R_BOT = R_MIN + 0.01;
const SCROLL_HEIGHT = 8000;

function rFromScroll(scrollY, maxScroll) {
  const t = Math.min(1, Math.max(0, scrollY / maxScroll));
  return R_TOP - t * (R_TOP - R_BOT);
}

function getSection(r) {
  if (r > 3.5) return "galaxy";
  if (r > R_A - 0.2 && r < R_A + 0.4) return "accretion";
  if (r > R_0 + 0.05) return "descent";
  if (r > R_0 - 0.05) return "horizon";
  if (r > R_H + 0.05) return "inside";
  return "core";
}

const COPY = {
  galaxy: {
    top: "The Cosmos",
    sub: "Far from the black hole, the Standard Model reigns.",
  },
  accretion: {
    top: "The Accretion Disk",
    sub: "A shallow well in spacetime. Matter orbits. The coupling shifts.",
  },
  descent: {
    top: "Falling In",
    sub: "The potential barrier rises ahead. No turning back.",
  },
  horizon: {
    top: "The Event Horizon",
    sub: "Ground and excited states swap. Symmetry breaks.",
  },
  inside: {
    top: "Inside",
    sub: "The Higgs perturbation is growing. The vacuum field is shrinking.",
  },
  core: null, // Handled specially
};

export default function JourneyShell() {
  const [r, setR] = useState(R_TOP);
  const [soundOn, setSoundOn] = useState(false);
  const [darkBeat, setDarkBeat] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const scrollRef = useRef(null);
  const beatTriggered = useRef(false);

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

    // Dark beat at the core
    if (newR < R_H + 0.03 && !beatTriggered.current) {
      beatTriggered.current = true;
      setDarkBeat(true);
      setTimeout(() => {
        setShowPunchline(true);
      }, 1200);
      setTimeout(() => {
        setDarkBeat(false);
      }, 3500);
    }
  }, []);

  const section = getSection(r);
  const copy = COPY[section];
  const depth = Math.max(0, Math.min(1, (4.0 - r) / 3.4));

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
      <div style={{ height: SCROLL_HEIGHT }}>
        {/* Fixed viewport — pointer-events: none so scroll works */}
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 1, pointerEvents: "none" }}>

          {/* Three.js scene */}
          {dims.w > 0 && (
            <BlackHoleScene
              radialPos={r}
              width={dims.w}
              height={dims.h}
              darkBeat={darkBeat}
            />
          )}

          {/* Dark beat overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "#000",
              opacity: darkBeat ? 0.95 : 0,
              transition: darkBeat ? "opacity 0.8s ease" : "opacity 1.5s ease",
              pointerEvents: "none",
              zIndex: 20,
            }}
          />

          {/* ── Top-left: section text ── */}
          {copy && !darkBeat && (
            <div style={{ position: "absolute", top: 40, left: 32, zIndex: 10 }}>
              <div style={tagStyle}>Journey Into a Black Hole</div>
              <h1 style={titleStyle}>{copy.top}</h1>
              <p style={subStyle}>{copy.sub}</p>
            </div>
          )}

          {/* ── Punchline at core ── */}
          {showPunchline && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 30,
                textAlign: "center",
                animation: "fadeUp 2s ease forwards",
              }}
            >
              <h1
                style={{
                  fontSize: 52,
                  fontWeight: 300,
                  letterSpacing: 1,
                  color: "#ffd700",
                  textShadow: "0 0 60px rgba(255,215,0,0.4)",
                  margin: 0,
                }}
              >
                Mass is born here.
              </h1>
              <p
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: 12,
                  color: "rgba(255,215,0,0.4)",
                  marginTop: 16,
                  letterSpacing: 2,
                }}
              >
                THE HIGGS FIELD EMERGES FROM THE GEOMETRY OF SPACETIME
              </p>
            </div>
          )}

          {/* ── Bottom-left: r indicator ── */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 32,
              zIndex: 10,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11,
              opacity: darkBeat ? 0 : 1,
              transition: "opacity 0.5s ease",
            }}
          >
            <span style={{ color: "rgba(180,200,220,0.3)" }}>r / r₀ = </span>
            <span style={{ color: r <= R_0 ? "#ffd700" : "#00d4ff" }}>{r.toFixed(3)}</span>
          </div>

          {/* ── Scroll hint ── */}
          {r > 3.8 && (
            <div style={scrollHint}>
              ↓ SCROLL TO FALL IN ↓
            </div>
          )}
        </div>
      </div>

      {/* Sound toggle — outside fixed layer so it's clickable */}
      <button
        onClick={() => setSoundOn(!soundOn)}
        style={soundBtn(soundOn)}
      >
        {soundOn ? "♪ ON" : "♪ OFF"}
      </button>
      <SoundScape radialPos={r} enabled={soundOn} />

      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translate(-50%, -40%); }
          100% { opacity: 1; transform: translate(-50%, -50%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}

// ── Styles ──
const tagStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  letterSpacing: 4,
  color: "rgba(0,212,255,0.4)",
  textTransform: "uppercase",
  marginBottom: 8,
};

const titleStyle = {
  fontSize: 36,
  fontWeight: 300,
  lineHeight: 1.2,
  maxWidth: 400,
  margin: 0,
};

const subStyle = {
  fontSize: 16,
  fontWeight: 300,
  fontStyle: "italic",
  lineHeight: 1.6,
  color: "rgba(200,210,220,0.5)",
  maxWidth: 380,
  marginTop: 12,
};

const scrollHint = {
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
};

const soundBtn = (on) => ({
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
  background: on ? "rgba(0,212,255,0.1)" : "rgba(6,6,16,0.7)",
  color: on ? "#00d4ff" : "rgba(180,200,220,0.3)",
  cursor: "pointer",
  backdropFilter: "blur(8px)",
});
