import { useRef, useEffect } from "react";
import { R_MIN, R_H, R_0, R_A, alpha1Minus, alpha1Plus } from "./physics.js";

export default function EntropyMap({ radialPos, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const pad = { top: 30, right: 20, bottom: 45, left: 50 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    ctx.clearRect(0, 0, width, height);

    const rMin = R_MIN + 0.001;
    const rMax = 4.0;
    const steps = 400;

    // Compute α₁⁻ (ground state inside r₀)
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const r = rMin + ((rMax - rMin) * i) / steps;
      // Use ground-state α₁: α₁⁻ inside r₀, α₁⁺ outside
      const a = r <= R_0 ? alpha1Minus(r) : alpha1Plus(r);
      if (!isNaN(a)) points.push({ r, a });
    }

    const viewMin = -10;
    const viewMax = 30;

    const toX = (r) => pad.left + ((r - rMin) / (rMax - rMin)) * w;
    const toY = (a) => pad.top + h - ((a - viewMin) / (viewMax - viewMin)) * h;

    // Zero line (entropy sign boundary)
    const y0 = toY(0);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.left, y0);
    ctx.lineTo(pad.left + w, y0);
    ctx.stroke();
    ctx.setLineDash([]);

    // Entropy region shading
    // S ∝ -α₁ → positive entropy when α₁ < 0, negative when α₁ > 0
    for (let i = 0; i < points.length - 1; i++) {
      const x1 = toX(points[i].r);
      const x2 = toX(points[i + 1].r);
      const isPositiveEntropy = points[i].a < 0;
      ctx.fillStyle = isPositiveEntropy
        ? "rgba(0,200,100,0.06)"
        : "rgba(255,80,80,0.04)";
      ctx.fillRect(x1, pad.top, x2 - x1, h);
    }

    // Region labels
    ctx.font = "9px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0,200,100,0.5)";
    ctx.fillText("S > 0", pad.left + w * 0.12, pad.top + 14);
    ctx.fillStyle = "rgba(255,100,100,0.4)";
    ctx.fillText("S < 0", pad.left + w * 0.55, pad.top + 14);

    // α₁ zero label
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.textAlign = "left";
    ctx.fillText("α₁ = 0 (entropy sign change)", pad.left + 4, y0 - 4);

    // Key radii
    for (const { r, color, label } of [
      { r: R_H, color: "rgba(0,212,255,0.35)", label: "rₕ" },
      { r: R_0, color: "rgba(255,80,80,0.35)", label: "r₀" },
      { r: R_A, color: "rgba(255,200,50,0.25)", label: "rₐ" },
    ]) {
      if (r > rMax) continue;
      const x = toX(r);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + h);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.font = "italic 10px 'Cormorant Garamond', Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(label, x, pad.top + h + 14);
    }

    // α₁ curve
    ctx.shadowColor = "rgba(0,212,255,0.4)";
    ctx.shadowBlur = 8;
    ctx.strokeStyle = "#00d4ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    for (const p of points) {
      const x = toX(p.r);
      const yRaw = toY(p.a);
      const y = Math.max(pad.top, Math.min(pad.top + h, yRaw));
      if (yRaw < pad.top - 80 || yRaw > pad.top + h + 80) {
        started = false;
        continue;
      }
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Position marker
    const r = radialPos;
    const curA = r <= R_0 ? alpha1Minus(r) : alpha1Plus(r);
    if (!isNaN(curA)) {
      const mx = toX(r);
      const my = Math.max(pad.top, Math.min(pad.top + h, toY(curA)));
      ctx.shadowColor = "rgba(255,215,0,0.8)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Axes
    ctx.fillStyle = "rgba(180,200,220,0.5)";
    ctx.font = "11px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("r / r₀", pad.left + w / 2, pad.top + h + 38);

    ctx.save();
    ctx.translate(14, pad.top + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("α₁ (ground state)", 0, 0);
    ctx.restore();

    // Y ticks
    ctx.fillStyle = "rgba(180,200,220,0.3)";
    ctx.font = "9px 'IBM Plex Mono', monospace";
    ctx.textAlign = "right";
    for (let v = -10; v <= 30; v += 10) {
      ctx.fillText(v.toString(), pad.left - 5, toY(v) + 3);
    }
  }, [radialPos, width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
