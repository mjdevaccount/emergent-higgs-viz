import { useState, useRef, useEffect, useCallback } from "react";
import { R_MIN, R_H, R_T, R_0, R_A } from "../physics.js";
import { colors, rgba, fonts, styles as themeStyles } from "../theme.js";
import BlackHoleScene from "./BlackHoleScene.jsx";
import DepthGauge from "./DepthGauge.jsx";
import VevBar from "./VevBar.jsx";
import SoundScape from "./SoundScape.jsx";

const R_TOP = 4.0;
const R_BOT = R_MIN + 0.01;
const SCROLL_HEIGHT = 10000; // more scroll = more control

function rFromScroll(scrollY, maxScroll) {
  const t = Math.min(1, Math.max(0, scrollY / maxScroll));
  return R_TOP - t * (R_TOP - R_BOT);
}

// Chapter cards: appear at specific scroll thresholds as full-viewport moments
const CHAPTERS = [
  { rBelow: 3.9, rAbove: 3.4, text: "Far from the black hole,\nphysics works the way we expect." },
  { rBelow: 3.2, rAbove: 2.7, text: "The accretion disk.\nThe first sign something is different here." },
  { rBelow: 1.1, rAbove: 0.95, text: "You cross the event horizon.\nThere is no going back." },
  { rBelow: 0.93, rAbove: 0.75, text: "Inside, the rules change.\nThe Higgs perturbation grows.\nThe vacuum shrinks." },
];

export default function JourneyShell() {
  const [r, setR] = useState(R_TOP);
  const [soundOn, setSoundOn] = useState(false);
  const [darkBeat, setDarkBeat] = useState(false);
  const [showPunchline, setShowPunchline] = useState(false);
  const [showPostCredits, setShowPostCredits] = useState(false);
  const [escapeParticle, setEscapeParticle] = useState(false);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const scrollRef = useRef(null);
  const beatDone = useRef(false);
  const postDone = useRef(false);

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

    // Core beat — trigger on enter, clear on leave
    if (newR < R_H + 0.03 && !beatDone.current) {
      beatDone.current = true;
      setDarkBeat(true);
      setTimeout(() => setShowPunchline(true), 1200);
      setTimeout(() => setDarkBeat(false), 3500);
    }
    // Hide punchline when scrolling back out
    if (newR > R_H + 0.15 && beatDone.current) {
      beatDone.current = false;
      setShowPunchline(false);
      setDarkBeat(false);
    }

    // Post-credits: triggered at very bottom, clears on scroll back
    const scrollPct = el.scrollTop / maxScroll;
    if (scrollPct > 0.97 && !postDone.current) {
      postDone.current = true;
      setShowPostCredits(true);
      setTimeout(() => setEscapeParticle(true), 2000);
    }
    if (scrollPct < 0.93 && postDone.current) {
      postDone.current = false;
      setShowPostCredits(false);
      setEscapeParticle(false);
    }
  }, []);

  // Active chapter card
  const activeChapter = CHAPTERS.find(c => r < c.rBelow && r > c.rAbove);

  // Flash at crossing
  const atCrossing = r < 1.02 && r > 0.98;

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      style={{
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "#020208",
        color: colors.text,
        fontFamily: fonts.serif,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />

      {/* Scroll spacer */}
      <div style={{ height: SCROLL_HEIGHT }}>

        {/* Fixed viewport */}
        <div style={viewport}>

          {/* Three.js scene */}
          {dims.w > 0 && (
            <BlackHoleScene
              radialPos={r}
              width={dims.w}
              height={dims.h}
              darkBeat={darkBeat}
            />
          )}

          {/* Horizon crossing flash */}
          <div
            style={{
              ...overlay,
              background: "#fff",
              opacity: atCrossing ? 0.7 : 0,
              transition: atCrossing ? "opacity 0.05s" : "opacity 0.4s ease",
              zIndex: 15,
            }}
          />

          {/* Dark beat overlay */}
          <div
            style={{
              ...overlay,
              background: "#000",
              opacity: darkBeat ? 0.95 : 0,
              transition: darkBeat ? "opacity 0.8s ease" : "opacity 1.5s ease",
              zIndex: 20,
            }}
          />

          {/* Chapter card */}
          {activeChapter && !darkBeat && (
            <div style={chapterCard}>
              {activeChapter.text.split("\n").map((line, i) => (
                <div key={i} style={{ marginBottom: 8 }}>{line}</div>
              ))}
            </div>
          )}

          {/* Punchline */}
          {showPunchline && (
            <div style={punchlineWrap}>
              <h1 style={punchlineText}>Mass is born here.</h1>
              <p style={punchlineSub}>
                THE HIGGS FIELD EMERGES FROM THE GEOMETRY OF SPACETIME
              </p>
            </div>
          )}

          {/* Post-credits tunneling */}
          {showPostCredits && (
            <div style={{ ...overlay, background: "rgba(0,0,0,0.85)", zIndex: 25 }}>
              {escapeParticle && (
                <div style={escapeWrap}>
                  <div style={escapeGlow} />
                  <p style={escapeText}>1.13% chance of escape.</p>
                </div>
              )}
            </div>
          )}

          {/* Scroll hint */}
          {r > 3.8 && (
            <div style={scrollHint}>↓ SCROLL TO FALL IN ↓</div>
          )}
        </div>
      </div>

      {/* HUD elements — outside fixed layer for clickability */}
      <DepthGauge radialPos={r} />
      <VevBar radialPos={r} />

      {/* Sound */}
      <button onClick={() => setSoundOn(!soundOn)} style={soundBtn(soundOn)}>
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
        @keyframes riseUp {
          0% { bottom: 30%; opacity: 0; }
          30% { opacity: 1; }
          100% { bottom: 85%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// ── Styles ──
const viewport = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  zIndex: 1,
  pointerEvents: "none",
};

const overlay = {
  position: "absolute",
  top: 0, left: 0,
  width: "100%", height: "100%",
  pointerEvents: "none",
};

const chapterCard = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 10,
  textAlign: "center",
  fontSize: 28,
  fontWeight: 300,
  fontStyle: "italic",
  lineHeight: 1.6,
  color: "rgba(200,210,220,0.7)",
  maxWidth: 600,
  animation: "fadeUp 0.8s ease forwards",
};

const punchlineWrap = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: 30,
  textAlign: "center",
  animation: "fadeUp 2s ease forwards",
};

const punchlineText = {
  fontSize: 52,
  fontWeight: 300,
  letterSpacing: 1,
  color: colors.gold,
  textShadow: `0 0 60px ${rgba(colors.gold, 0.4)}`,
  margin: 0,
};

const punchlineSub = {
  fontFamily: fonts.mono,
  fontSize: 12,
  color: rgba(colors.gold, 0.4),
  marginTop: 16,
  letterSpacing: 2,
};

const escapeWrap = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  textAlign: "center",
  animation: "riseUp 6s ease forwards",
  bottom: "30%",
};

const escapeGlow = {
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: colors.gold,
  boxShadow: `0 0 20px ${rgba(colors.gold, 0.8)}, 0 0 60px ${rgba(colors.gold, 0.3)}`,
  margin: "0 auto 16px",
};

const escapeText = {
  fontFamily: fonts.mono,
  fontSize: 12,
  color: rgba(colors.gold, 0.5),
  letterSpacing: 2,
};

const scrollHint = {
  position: "absolute",
  bottom: 50,
  left: "50%",
  transform: "translateX(-50%)",
  fontFamily: fonts.mono,
  fontSize: 10,
  color: colors.textFaint,
  letterSpacing: 2,
  textTransform: "uppercase",
  animation: "pulse 2s ease-in-out infinite",
  zIndex: 10,
};

const soundBtn = (on) => ({
  position: "fixed",
  bottom: 40,
  right: 16,
  zIndex: 1000,
  ...themeStyles.pillButton(on),
});
