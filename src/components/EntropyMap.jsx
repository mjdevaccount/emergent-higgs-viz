import { useRef, useEffect } from "react";
import { R_MIN, R_H, R_0, R_A, alpha1Minus, alpha1Plus, alpha2Plus } from "../physics.js";
import { colors, rgba, canvas as canvasFonts } from "../theme.js";
import {
  setupCanvas, makeScales, drawRefLines, drawMarker,
  drawLegend, drawAxes, drawYTicks, drawCurve, drawHLine,
} from "../canvas-utils.js";

export default function EntropyMap({ radialPos, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 20, bottom: 45, left: 50 };
    const rMin = R_MIN + 0.001;
    const rMax = 4.0;
    const steps = 400;

    // Compute ground-state alpha1
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const r = rMin + ((rMax - rMin) * i) / steps;
      const a = r <= R_0 ? alpha1Minus(r) : alpha1Plus(r);
      if (!isNaN(a)) points.push({ r, v: a });
    }

    // Alpha2+ curve points
    const points2 = [];
    for (let i = 0; i <= steps; i++) {
      const r = rMin + ((rMax - rMin) * i) / steps;
      const a2 = alpha2Plus(r);
      if (!isNaN(a2)) points2.push({ r, v: a2 });
    }

    const { toX, toY, w, h } = makeScales(pad, width, height, [rMin, rMax], [-10, 30]);

    // Zero line
    drawHLine(ctx, pad, w, toY, 0, {
      color: "rgba(255,255,255,0.15)",
      label: "\u03b1\u2081 = 0 (entropy sign change)",
    });

    // Entropy region shading
    for (let i = 0; i < points.length - 1; i++) {
      const x1 = toX(points[i].r);
      const x2 = toX(points[i + 1].r);
      const isPositiveEntropy = points[i].v < 0;
      ctx.fillStyle = isPositiveEntropy
        ? "rgba(0,200,100,0.06)"
        : "rgba(255,80,80,0.04)";
      ctx.fillRect(x1, pad.top, x2 - x1, h);
    }

    // Region labels
    ctx.font = canvasFonts.monoSm;
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0,200,100,0.5)";
    ctx.fillText("S > 0", pad.left + w * 0.12, pad.top + 14);
    ctx.fillStyle = "rgba(255,100,100,0.4)";
    ctx.fillText("S < 0", pad.left + w * 0.55, pad.top + 14);

    // Key radii
    drawRefLines(ctx, [
      { value: R_H, color: rgba(colors.cyan, 0.35), label: "r\u2095" },
      { value: R_0, color: "rgba(255,80,80,0.35)", label: "r\u2080" },
      { value: R_A, color: "rgba(255,200,50,0.25)", label: "r\u2090" },
    ], toX, pad, h, { domainMax: rMax });

    // Alpha1 curve
    drawCurve(ctx, points, toX, toY, pad, h, {
      color: colors.cyan, lineWidth: 2,
      glow: rgba(colors.cyan, 0.4),
    });

    // Alpha2+ curve
    drawCurve(ctx, points2, toX, toY, pad, h, {
      color: rgba(colors.orange, 0.5), lineWidth: 1.5,
      dash: [4, 3],
    });

    // Legend
    drawLegend(ctx, [
      { symbol: "\u2501\u2501", label: "\u03b1\u2081\u207b (ground)", color: colors.cyan },
      { symbol: "\u2505\u2505", label: "\u03b1\u2082\u207a", color: rgba(colors.orange, 0.7) },
    ], pad.left + w - 4, pad.top + h - 20);

    // Position marker
    const r = radialPos;
    const curA = r <= R_0 ? alpha1Minus(r) : alpha1Plus(r);
    if (!isNaN(curA)) {
      const mx = toX(r);
      const my = Math.max(pad.top, Math.min(pad.top + h, toY(curA)));
      drawMarker(ctx, mx, my);
    }

    // Axes & ticks
    drawAxes(ctx, pad, w, h, { xLabel: "r / r\u2080", yLabel: "\u03b1\u2081 (ground state)" });
    drawYTicks(ctx, toY, pad, { min: -10, max: 30, step: 10, decimals: 0 });
  }, [radialPos, width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
