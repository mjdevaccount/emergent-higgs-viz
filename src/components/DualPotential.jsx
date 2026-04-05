import { useRef, useEffect } from "react";
import {
  R_MIN, R_H, R_T, R_0, R_A,
  potentialPlus, potentialMinus, groundState,
} from "../physics.js";
import { TERMS, isRadiusHighlighted } from "../paper/highlight.js";
import { colors, rgba } from "../theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawRefLines,
  drawMarker, drawLegend, drawAxes, drawXTicks, drawYTicks,
} from "../canvas-utils.js";

export default function DualPotentialPlot({ radialPos, width, height, highlight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 35, right: 25, bottom: 55, left: 60 };
    const rMin = R_MIN + 0.001;
    const rMax = 4.0;
    const steps = 400;

    // Compute both curves
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
    const { toX, toY, w, h } = makeScales(pad, width, height, [rMin, rMax], [viewMin, viewMax]);

    // Grid
    drawGrid(ctx, pad, w, h, { hLines: 5, vLines: 6 });

    // Key radii
    const radii = [
      { value: R_MIN, label: "r_min", hlKey: "rmin", color: "rgba(180,180,180,0.3)", sublabel: `${R_MIN.toFixed(3)}r\u2080` },
      { value: R_H, label: "r\u2095", hlKey: TERMS.rh, color: rgba(colors.cyan, 0.5), sublabel: `${R_H.toFixed(3)}r\u2080` },
      { value: R_T, label: "r_T", hlKey: "rt", color: rgba(colors.green, 0.4), sublabel: `${R_T.toFixed(3)}r\u2080` },
      { value: R_0, label: "r\u2080", hlKey: TERMS.r0, color: "rgba(255,80,80,0.5)", sublabel: "Schwarzschild" },
      { value: R_A, label: "r\u2090", hlKey: TERMS.ra, color: rgba(colors.gold, 0.4), sublabel: `${R_A.toFixed(2)}r\u2080` },
    ];
    drawRefLines(ctx, radii, toX, pad, h, {
      highlightKey: highlight,
      isHighlighted: isRadiusHighlighted,
      domainMax: rMax,
    });

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
    ctx.shadowColor = rgba(colors.cyan, 0.5);
    ctx.shadowBlur = 10;
    ctx.strokeStyle = colors.cyan;
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
    ctx.shadowColor = rgba(colors.gold, 0.3);
    ctx.shadowBlur = 6;
    ctx.strokeStyle = rgba(colors.gold, 0.5);
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
        drawMarker(ctx, mx, my, { ring: true, radius: 4.5 });
      }
    }

    // Legend
    drawLegend(ctx, [
      { symbol: "\u2500\u2500", label: "U\u207b", color: colors.cyan },
      { symbol: "\u2500\u2500", label: "U\u207a", color: "rgba(255,120,120,0.8)" },
      { symbol: "\u2501\u2501", label: "ground state", color: rgba(colors.gold, 0.8) },
    ], pad.left + w - 10, pad.top + 14);

    // Axes & ticks
    drawAxes(ctx, pad, w, h, { xLabel: "r / r\u2080", yLabel: "U\u00b1(r) / m\u00b2\u03c6\u00b2" });
    drawXTicks(ctx, toX, pad, h);
    drawYTicks(ctx, toY, pad, {
      min: viewMin, max: viewMax,
      step: (viewMax - viewMin) / 5, decimals: 1,
    });
  }, [radialPos, width, height, highlight]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
