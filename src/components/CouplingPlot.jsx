import { useRef, useEffect } from "react";
import { R_MIN, R_H, R_0, R_A, couplingGround } from "../physics.js";
import { colors, rgba } from "../theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawRefLines,
  drawMarker, drawLegend, drawAxes, drawYTicks, drawCurve, drawHLine,
} from "../canvas-utils.js";

export default function CouplingPlot({ radialPos, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 25, bottom: 50, left: 55 };
    const rMin = R_MIN + 0.001;
    const rMax = 4.0;
    const steps = 400;

    const pointsGround = [];
    for (let i = 0; i <= steps; i++) {
      const r = rMin + ((rMax - rMin) * i) / steps;
      const fg = couplingGround(r);
      if (!isNaN(fg)) pointsGround.push({ r, v: fg });
    }

    const { toX, toY, w, h } = makeScales(pad, width, height, [rMin, rMax], [0.0, 0.5]);

    // Grid
    drawGrid(ctx, pad, w, h);

    // Reference horizontal lines
    drawHLine(ctx, pad, w, toY, 0.2, { color: rgba(colors.gold, 0.4), label: "f = 1/5 (\u03bb/5)" });
    drawHLine(ctx, pad, w, toY, 1.0, { color: "rgba(180,200,220,0.2)", label: "f = 1 (SM \u03bb)" });

    // Key radii
    drawRefLines(ctx, [
      { value: R_H, color: rgba(colors.cyan, 0.4), label: "r\u2095" },
      { value: R_0, color: "rgba(255,80,80,0.4)", label: "r\u2080" },
      { value: R_A, color: "rgba(255,200,50,0.3)", label: "r\u2090" },
    ], toX, pad, h, { domainMax: rMax });

    // Ground-state coupling curve
    drawCurve(ctx, pointsGround, toX, toY, pad, h, {
      color: colors.gold, lineWidth: 2.2,
      glow: rgba(colors.gold, 0.4),
    });

    // Current position marker
    const curF = couplingGround(radialPos);
    if (!isNaN(curF)) {
      const mx = toX(radialPos);
      const my = Math.max(pad.top, Math.min(pad.top + h, toY(curF)));
      drawMarker(ctx, mx, my);
    }

    // Legend
    drawLegend(ctx, [
      { symbol: "\u2501\u2501", label: "f(r) ground state", color: colors.gold },
    ], pad.left + w - 6, pad.top + 14);

    // Axes & ticks
    drawAxes(ctx, pad, w, h, { xLabel: "r / r\u2080", yLabel: "f\u00b1(r) \u2014 Eq. 51" });
    drawYTicks(ctx, toY, pad, { min: 0, max: 0.5, step: 0.1 });
  }, [radialPos, width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
