import { useRef, useEffect } from "react";
import {
  R_MIN, R_H, R_0, R_A,
  couplingGround, sombreroZ,
} from "../physics.js";

export default function CouplingPlot({ radialPos, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const pad = { top: 30, right: 25, bottom: 50, left: 55 };
    const w = width - pad.left - pad.right;
    const h = height - pad.top - pad.bottom;

    ctx.clearRect(0, 0, width, height);

    // Plot f±(r) vs r²/r₀² (paper's Figure 3 x-axis)
    const rMin = R_MIN + 0.001;
    const rMax = 4.0;
    const steps = 400;
    const pointsGround = [];

    for (let i = 0; i <= steps; i++) {
      const r = rMin + ((rMax - rMin) * i) / steps;
      const fg = couplingGround(r);
      if (!isNaN(fg)) pointsGround.push({ r, f: fg });
    }

    // Y range: f ranges from ~0.15 to ~0.4
    const viewMin = 0.0;
    const viewMax = 0.5;

    const toX = (r) => pad.left + ((r - rMin) / (rMax - rMin)) * w;
    const toY = (f) => pad.top + h - ((f - viewMin) / (viewMax - viewMin)) * h;

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

    // f = 1/5 reference line
    const y15 = toY(0.2);
    ctx.strokeStyle = "rgba(255,215,0,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.left, y15);
    ctx.lineTo(pad.left + w, y15);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,215,0,0.6)";
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("f = 1/5 (λ/5)", pad.left + 4, y15 - 4);

    // f = 1 reference line (SM value)
    const y1 = toY(1.0);
    ctx.strokeStyle = "rgba(180,200,220,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.left, y1);
    ctx.lineTo(pad.left + w, y1);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(180,200,220,0.4)";
    ctx.fillText("f = 1 (SM λ)", pad.left + 4, y1 - 4);

    // Key radii
    for (const { r, color, label } of [
      { r: R_H, color: "rgba(0,212,255,0.4)", label: "rₕ" },
      { r: R_0, color: "rgba(255,80,80,0.4)", label: "r₀" },
      { r: R_A, color: "rgba(255,200,50,0.3)", label: "rₐ" },
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

    // Helper to draw curve with y-clamping
    function drawCurve(points, color, lineWidth) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      let started = false;
      for (const p of points) {
        const x = toX(p.r);
        const yRaw = toY(p.f);
        const y = Math.max(pad.top, Math.min(pad.top + h, yRaw));
        if (yRaw < pad.top - 50 || yRaw > pad.top + h + 50) {
          started = false;
          continue;
        }
        if (!started) { ctx.moveTo(x, y); started = true; }
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Ground-state coupling curve
    ctx.shadowColor = "rgba(255,215,0,0.4)";
    ctx.shadowBlur = 8;
    drawCurve(pointsGround, "#ffd700", 2.2);
    ctx.shadowBlur = 0;

    // Current position marker
    const curF = couplingGround(radialPos);
    if (!isNaN(curF)) {
      const mx = toX(radialPos);
      const my = Math.max(pad.top, Math.min(pad.top + h, toY(curF)));
      ctx.shadowColor = "rgba(255,215,0,0.8)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#ffd700";
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Legend
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "right";
    const lx = pad.left + w - 6;
    ctx.fillStyle = "#ffd700";
    ctx.fillText("━━ f(r) ground state", lx, pad.top + 14);

    // Axes
    ctx.fillStyle = "rgba(180,200,220,0.6)";
    ctx.font = "12px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("r / r₀", pad.left + w / 2, pad.top + h + 42);

    ctx.save();
    ctx.translate(14, pad.top + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("f(r) = 1/(4Z)", 0, 0);
    ctx.restore();

    // Y ticks
    ctx.fillStyle = "rgba(180,200,220,0.4)";
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "right";
    for (let v = 0; v <= 0.5; v += 0.1) {
      ctx.fillText(v.toFixed(1), pad.left - 6, toY(v) + 4);
    }
  }, [radialPos, width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
