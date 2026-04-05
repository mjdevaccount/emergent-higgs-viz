import { useRef, useEffect } from "react";
import { colors, rgba } from "@/theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawCurve,
  drawMarker, drawLegend, drawAxes, drawYTicks, drawHLine,
} from "@/canvas-utils.js";
import { X_BIG_BANG, wSpeciesFlat, wFriedmannFlat } from "../physics.js";

// Shows the w vs w_S tension in a flat (k=0) universe.
// The two curves diverge at large X — motivating curvature.
export default function TensionPlot({ param, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 25, bottom: 50, left: 55 };
    const xMin = 0.01, xMax = 10;
    const { toX, toY, w, h } = makeScales(pad, width, height, [xMin, xMax], [-1.1, 0.1]);

    drawGrid(ctx, pad, w, h, { hLines: 6 });

    // Reference lines
    drawHLine(ctx, pad, w, toY, -1, { color: rgba(colors.cyan, 0.3), label: "w = -1 (vacuum)" });
    drawHLine(ctx, pad, w, toY, -2/3, { color: rgba(colors.gold, 0.25), label: "w = -2/3" });

    // Big Bang ref line
    const bbX = toX(X_BIG_BANG);
    ctx.strokeStyle = "rgba(255,80,80,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(bbX, pad.top); ctx.lineTo(bbX, pad.top + h); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,80,80,0.6)";
    ctx.font = "9px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Big Bang", bbX, pad.top + h + 14);
    ctx.fillText("X=4/3", bbX, pad.top + h + 26);

    // Compute curves — skip near singularity
    const steps = 500;
    const ptsWs = [], ptsW = [];
    for (let i = 0; i <= steps; i++) {
      const X = xMin + ((xMax - xMin) * i) / steps;
      if (Math.abs(X - X_BIG_BANG) < 0.05) continue;
      const ws = wSpeciesFlat(X);
      const wf = wFriedmannFlat(X);
      if (!isNaN(ws)) ptsWs.push({ r: X, v: ws });
      if (!isNaN(wf)) ptsW.push({ r: X, v: wf });
    }

    // w_S curve (species)
    drawCurve(ctx, ptsWs, toX, toY, pad, h, {
      color: colors.cyan, lineWidth: 2, glow: rgba(colors.cyan, 0.4),
    });

    // w curve (Friedmann)
    drawCurve(ctx, ptsW, toX, toY, pad, h, {
      color: colors.gold, lineWidth: 2, glow: rgba(colors.gold, 0.4),
    });

    // Position marker on w_S
    const curWs = wSpeciesFlat(param);
    if (!isNaN(curWs) && Math.abs(param - X_BIG_BANG) > 0.05) {
      drawMarker(ctx, toX(param), Math.max(pad.top, Math.min(pad.top + h, toY(curWs))));
    }

    drawLegend(ctx, [
      { symbol: "\u2501\u2501", label: "w\u209b (species)", color: colors.cyan },
      { symbol: "\u2501\u2501", label: "w (Friedmann)", color: colors.gold },
    ], pad.left + w - 6, pad.top + 14);

    drawAxes(ctx, pad, w, h, { xLabel: "X = D/H", yLabel: "equation of state" });
    drawYTicks(ctx, toY, pad, { min: -1, max: 0, step: 0.2 });
  }, [param, width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
