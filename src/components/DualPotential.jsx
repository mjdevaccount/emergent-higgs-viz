import { useRef, useEffect } from "react";
import {
  R_MIN, R_H, R_T, R_0, R_A,
  potentialPlus, potentialMinus, groundState,
} from "../physics.js";

export default function DualPotentialPlot({ radialPos, width, height }) {
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

    // U+ curve
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

    // U- curve
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

    // Ground state highlight
    ctx.shadowColor = "rgba(255,215,0,0.3)";
    ctx.shadowBlur = 6;
    ctx.strokeStyle = "rgba(255,215,0,0.5)";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    started = false;
    for (let i = 0; i <= steps; i++) {
      const r = rMin + ((rMax - rMin) * i) / steps;
      const v = groundState(r);
      if (isNaN(v)) continue;
      const x = toX(r);
      const y = toY(v);
      if (y < pad.top || y > pad.top + h) { started = false; continue; }
      if (!started) { ctx.moveTo(x, y); started = true; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Position marker
    const curV = groundState(radialPos);
    if (!isNaN(curV)) {
      const mx = toX(radialPos);
      const my = toY(curV);
      if (my >= pad.top && my <= pad.top + h) {
        ctx.strokeStyle = "rgba(255,215,0,0.5)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mx, my, 10, 0, Math.PI * 2);
        ctx.stroke();

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

    // Axes
    ctx.fillStyle = "rgba(180,200,220,0.6)";
    ctx.font = "12px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("r / r₀", pad.left + w / 2, pad.top + h + 48);

    ctx.save();
    ctx.translate(14, pad.top + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("U±(r) / m²φ²", 0, 0);
    ctx.restore();

    // X tick labels
    ctx.fillStyle = "rgba(180,200,220,0.4)";
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    for (let r = 1; r <= 4; r++) {
      ctx.fillText(r.toString(), toX(r), pad.top + h + 42);
    }

    // Y tick labels
    ctx.textAlign = "right";
    for (let i = 0; i <= 5; i++) {
      const v = viewMin + ((viewMax - viewMin) * i) / 5;
      ctx.fillText(v.toFixed(1), pad.left - 6, toY(v) + 4);
    }
  }, [radialPos, width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
