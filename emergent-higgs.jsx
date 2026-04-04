import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import * as THREE from "three";

// ── Exact Physics from Paper (Eq. 32, 51) ──────────────────────
const VEV = 246; // GeV

// Key radii (all in units of r₀), derived exactly from the paper
const R_MIN = Math.sqrt(3 / 8);           // ≈ 0.6124 — minimum physical radius
const R_H = Math.sqrt(5 - Math.sqrt(21)); // ≈ 0.6502 — deep well minimum
const R_T = Math.sqrt(7 / 8);             // ≈ 0.9354 — transition point
const R_0 = 1.0;                          // Schwarzschild radius (r₀)
const R_A = Math.sqrt(5 + Math.sqrt(21)); // ≈ 3.0976 — accretion disk

// Helper: √(r²/(2r₀²) - 3/16), returns NaN below r_min
function sqrtTerm(rRatio) {
  const val = (rRatio * rRatio) / 2 - 3 / 16;
  return val >= 0 ? Math.sqrt(val) : NaN;
}

// Eq. 32: U±(r) / (m²φ²) — the two potential states
function potentialPlus(rRatio) {
  const s = sqrtTerm(rRatio);
  if (isNaN(s)) return NaN;
  const r2 = rRatio * rRatio;
  const r4 = r2 * r2;
  const termA = (0.25 - s); // (1/4 - √...)
  const termB = (0.25 + s); // (1/4 + √...)
  return 2 * (1 + 2 * termA * termA / r2 + 2 * termB * termB / r4);
}

function potentialMinus(rRatio) {
  const s = sqrtTerm(rRatio);
  if (isNaN(s)) return NaN;
  const r2 = rRatio * rRatio;
  const r4 = r2 * r2;
  const termA = (0.25 + s); // (1/4 + √...)
  const termB = (0.25 - s); // (1/4 - √...)
  return 2 * (1 + 2 * termA * termA / r2 + 2 * termB * termB / r4);
}

// Ground state: U- inside r₀, U+ outside r₀
function groundStatePotential(rRatio) {
  return rRatio <= R_0 ? potentialMinus(rRatio) : potentialPlus(rRatio);
}

// Excited state: U+ inside r₀, U- outside r₀
function excitedStatePotential(rRatio) {
  return rRatio <= R_0 ? potentialPlus(rRatio) : potentialMinus(rRatio);
}

// ── Background Stars ─────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.0008 + 0.0002,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let raf;
    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const a = s.alpha * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,210,255,${a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Dual Potential Plot U±(r) — Eq. 32 ─────────────────────────
function DualPotentialPlot({ radialPos, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const pad = { top: 35, right: 25, bottom: 55, left: 60 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    ctx.clearRect(0, 0, width, height);

    // Compute both curves
    const rMin = R_MIN + 0.001;
    const rMax = 4.0;
    const steps = 400;
    const pointsPlus = [];
    const pointsMinus = [];
    let vMin = Infinity, vMax = -Infinity;

    for (let i = 0; i <= steps; i++) {
      const r = rMin + ((rMax - rMin) * i) / steps;
      const vp = potentialPlus(r);
      const vm = potentialMinus(r);
      if (!isNaN(vp) && !isNaN(vm)) {
        pointsPlus.push({ r, v: vp });
        pointsMinus.push({ r, v: vm });
        const lo = Math.min(vp, vm);
        const hi = Math.max(vp, vm);
        if (lo < vMin) vMin = lo;
        if (hi > vMax) vMax = hi;
      }
    }

    // Clamp view range to show the interesting structure
    const viewMin = Math.max(vMin - 0.5, 0);
    const viewMax = Math.min(vMax + 1, 25);

    const toX = (r) => pad.left + ((r - rMin) / (rMax - rMin)) * w;
    const toY = (v) => pad.top + h - ((v - viewMin) / (viewMax - viewMin)) * h;

    // Grid
    ctx.strokeStyle = "rgba(0,212,255,0.06)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 5; i++) {
      const y = pad.top + (h * i) / 5;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + w, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 6; i++) {
      const x = pad.left + (w * i) / 6;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + h);
      ctx.stroke();
    }

    // Key radii vertical lines
    const radii = [
      { r: R_MIN, label: "r_min", color: "rgba(180,180,180,0.3)", sublabel: `${R_MIN.toFixed(3)}r₀` },
      { r: R_H, label: "rₕ", color: "rgba(0,212,255,0.5)", sublabel: `${R_H.toFixed(3)}r₀` },
      { r: R_T, label: "r_T", color: "rgba(0,255,140,0.4)", sublabel: `${R_T.toFixed(3)}r₀` },
      { r: R_0, label: "r₀", color: "rgba(255,80,80,0.5)", sublabel: "Schwarzschild" },
      { r: R_A, label: "rₐ", color: "rgba(255,200,50,0.4)", sublabel: `${R_A.toFixed(2)}r₀` },
    ];

    for (const { r, label, color, sublabel } of radii) {
      if (r < rMin || r > rMax) continue;
      const x = toX(r);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + h);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = color.replace(/[\d.]+\)$/, "0.9)");
      ctx.font = "italic 11px 'Cormorant Garamond', Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x, pad.top + h + 16);
      ctx.font = "9px 'IBM Plex Mono', monospace";
      ctx.fillStyle = color;
      ctx.fillText(sublabel, x, pad.top + h + 28);
    }

    // Draw U+ curve (excited inside r₀, ground outside)
    ctx.shadowColor = "rgba(255,100,100,0.4)";
    ctx.shadowBlur = 8;
    ctx.strokeStyle = "rgba(255,120,120,0.6)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    let started = false;
    for (const p of pointsPlus) {
      const x = toX(p.r);
      const y = toY(p.v);
      if (y < pad.top || y > pad.top + h) { started = false; continue; }
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw U- curve (ground inside r₀, excited outside)
    ctx.shadowColor = "rgba(0,212,255,0.5)";
    ctx.shadowBlur = 10;
    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    started = false;
    for (const p of pointsMinus) {
      const x = toX(p.r);
      const y = toY(p.v);
      if (y < pad.top || y > pad.top + h) { started = false; continue; }
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Ground state highlight (thicker overlay): U- for r<r₀, U+ for r>r₀
    ctx.shadowColor = "rgba(255,215,0,0.3)";
    ctx.shadowBlur = 6;
    ctx.strokeStyle = "rgba(255,215,0,0.5)";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    started = false;
    for (let i = 0; i <= steps; i++) {
      const r = rMin + ((rMax - rMin) * i) / steps;
      const v = groundStatePotential(r);
      if (isNaN(v)) continue;
      const x = toX(r);
      const y = toY(v);
      if (y < pad.top || y > pad.top + h) { started = false; continue; }
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current position marker on ground state
    const curV = groundStatePotential(radialPos);
    if (!isNaN(curV)) {
      const mx = toX(radialPos);
      const my = toY(curV);
      if (my >= pad.top && my <= pad.top + h) {
        // Pulse ring
        ctx.strokeStyle = "rgba(255,215,0,0.5)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mx, my, 10, 0, Math.PI * 2);
        ctx.stroke();

        // Dot
        ctx.shadowColor = "rgba(255,215,0,0.8)";
        ctx.shadowBlur = 15;
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(mx, my, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Legend
    ctx.font = "11px 'IBM Plex Mono', monospace";
    const legendY = pad.top + 14;
    const legendX = pad.left + w - 10;
    ctx.textAlign = "right";

    ctx.fillStyle = "#00d4ff";
    ctx.fillText("── U⁻", legendX, legendY);
    ctx.fillStyle = "rgba(255,120,120,0.8)";
    ctx.fillText("── U⁺", legendX, legendY + 16);
    ctx.fillStyle = "rgba(255,215,0,0.8)";
    ctx.fillText("━━ ground state", legendX, legendY + 32);

    // Axis labels
    ctx.fillStyle = "rgba(180,200,220,0.6)";
    ctx.font = "12px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("r / r₀", pad.left + w / 2, pad.top + h + 48);

    ctx.save();
    ctx.translate(14, pad.top + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("U±(r) / m²φ²", 0, 0);
    ctx.restore();

    // Tick labels on x-axis
    ctx.fillStyle = "rgba(180,200,220,0.4)";
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    for (let r = 1; r <= 4; r++) {
      ctx.fillText(r.toString(), toX(r), pad.top + h + 42);
    }

    // Tick labels on y-axis
    ctx.textAlign = "right";
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const v = viewMin + ((viewMax - viewMin) * i) / ySteps;
      const y = toY(v);
      ctx.fillText(v.toFixed(1), pad.left - 6, y + 4);
    }
  }, [radialPos, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
    />
  );
}

// ── Main Component ──────────────────────────────────────────────
export default function EmergentHiggs() {
  const [radialPos, setRadialPos] = useState(2.0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.clientWidth,
          h: window.innerHeight,
        });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const isMobile = dims.w < 768;
  const plotW = isMobile ? dims.w - 32 : Math.min(dims.w - 80, 900);
  const plotH = isMobile ? 300 : 420;

  const groundV = groundStatePotential(radialPos);
  const excitedV = excitedStatePotential(radialPos);

  // Determine which region the slider is in
  let regionLabel = "";
  if (radialPos < R_H + 0.01) regionLabel = "deep well minimum";
  else if (radialPos < R_T) regionLabel = "inside Schwarzschild sphere";
  else if (radialPos < R_0 + 0.03) regionLabel = "near Schwarzschild horizon";
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

      {/* Subtle radial glow */}
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

      {/* Content */}
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
            Interactive Visualization — Full Paper Implementation
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
            <span style={{ color: "#00d4ff" }}>
              & the Schwarzschild Black Hole
            </span>
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
            near a Schwarzschild black hole and across the EW sector — with
            dual ground/excited states, exact quartic coupling, and the λ/5
            result derived from VEV conservation.
          </p>
        </header>

        {/* ── Dual Potential Plot ── */}
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: isMobile ? "24px 16px" : "40px 32px",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: 3,
              color: "rgba(0,212,255,0.6)",
              textTransform: "uppercase",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Dual Potential States U±(r) — Equation 32
          </div>
          <div
            style={{
              background: "rgba(8,12,24,0.7)",
              border: "1px solid rgba(0,212,255,0.1)",
              borderRadius: 8,
              padding: 8,
              backdropFilter: "blur(10px)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {plotW > 0 && (
              <DualPotentialPlot
                radialPos={radialPos}
                width={plotW}
                height={plotH}
              />
            )}
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 13,
              fontStyle: "italic",
              color: "rgba(180,200,220,0.4)",
            }}
          >
            U⁻ is ground state inside r₀ &nbsp;·&nbsp; U⁺ is ground state outside r₀ &nbsp;·&nbsp; They cross at the Schwarzschild radius
          </div>
        </div>

        {/* ── Slider ── */}
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            padding: isMobile ? "16px 20px 0" : "16px 32px 0",
          }}
        >
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
          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "rgba(180,200,220,0.5)",
                letterSpacing: 2,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Ground State U
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 36,
                fontWeight: 300,
                color: "#ffd700",
                lineHeight: 1,
              }}
            >
              {!isNaN(groundV) ? groundV.toFixed(3) : "—"}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "rgba(255,215,0,0.5)",
                marginTop: 12,
              }}
            >
              {radialPos <= R_0 ? "U⁻ (INSIDE r₀)" : "U⁺ (OUTSIDE r₀)"}
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "rgba(180,200,220,0.5)",
                letterSpacing: 2,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Excited State U
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 36,
                fontWeight: 300,
                color: "rgba(180,200,220,0.6)",
                lineHeight: 1,
              }}
            >
              {!isNaN(excitedV) ? excitedV.toFixed(3) : "—"}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "rgba(180,200,220,0.3)",
                marginTop: 12,
              }}
            >
              {radialPos <= R_0 ? "U⁺ (INSIDE r₀)" : "U⁻ (OUTSIDE r₀)"}
            </div>
          </div>

          <div style={{ textAlign: "center", padding: "0 16px" }}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                color: "rgba(180,200,220,0.5)",
                letterSpacing: 2,
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Region
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 24,
                fontWeight: 300,
                color: radialPos <= R_0 ? "#00d4ff" : radialPos < R_A + 0.3 ? "#ffd700" : "#e0e8f0",
                lineHeight: 1.2,
                transition: "color 0.5s ease",
                minWidth: 160,
              }}
            >
              {regionLabel}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10,
                color: "rgba(180,200,220,0.3)",
                marginTop: 12,
              }}
            >
              r / r₀ = {radialPos.toFixed(3)}
            </div>
          </div>
        </div>

        {/* ── Key Insight ── */}
        <div
          style={{
            maxWidth: 680,
            margin: "0 auto",
            padding: isMobile ? "24px 20px 40px" : "32px 40px 60px",
            textAlign: "center",
            borderTop: "1px solid rgba(0,212,255,0.08)",
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10,
              letterSpacing: 3,
              color: "rgba(255,215,0,0.5)",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Step 1 of 4 — Exact Dual Potential from Eq. 32
          </div>
          <p
            style={{
              fontSize: isMobile ? 16 : 19,
              fontWeight: 300,
              lineHeight: 1.7,
              color: "rgba(200,210,220,0.75)",
              margin: 0,
            }}
          >
            Two potential states U⁻ and U⁺ emerge from minimizing the
            expected scalar field potential in spherical coordinates. They cross
            at the Schwarzschild radius r₀. The ground state follows U⁻ inside
            the black hole (deep well at r<sub>h</sub> ≈ 0.65r₀) and U⁺ outside
            (shallow well at r<sub>a</sub> ≈ 3.10r₀ — the accretion disk).
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
