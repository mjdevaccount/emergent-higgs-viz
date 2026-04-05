import { useRef, useEffect } from "react";
import { colors, rgba, canvas as canvasFonts } from "@/theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawCurve,
  drawMarker, drawLegend, drawAxes, drawYTicks, drawHLine,
} from "@/canvas-utils.js";
import { X_BIG_BANG, accelCurved, accelFlat } from "../physics.js";

// Acceleration -(1+q) vs X showing the Big Bang singularity at X=4/3.
export default function AccelerationPlot({ param, width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 25, bottom: 50, left: 60 };
    const xMin = 0.01, xMax = 5;
    const yClamp = 500;
    const { toX, toY, w, h } = makeScales(pad, width, height, [xMin, xMax], [-yClamp, yClamp]);

    drawGrid(ctx, pad, w, h, { hLines: 5 });
    drawHLine(ctx, pad, w, toY, 0, { color: "rgba(255,255,255,0.15)", label: "" });

    // Big Bang vertical
    const bbX = toX(X_BIG_BANG);
    ctx.strokeStyle = "rgba(255,80,80,0.5)";
    ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
    ctx.beginPath(); ctx.moveTo(bbX, pad.top); ctx.lineTo(bbX, pad.top + h); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,80,80,0.7)";
    ctx.font = canvasFonts.mono10;
    ctx.textAlign = "center";
    ctx.fillText("BIG BANG", bbX, pad.top + 14);
    ctx.fillText("X = 4/3", bbX, pad.top + 26);

    // Time arrow annotations
    ctx.fillStyle = colors.textCaption;
    ctx.font = canvasFonts.monoSm;
    ctx.textAlign = "right";
    ctx.fillText("\u2190 TIME", pad.left + w - 4, pad.top + 14);
    ctx.textAlign = "left";
    ctx.fillText("TIME \u2192", pad.left + 4, pad.top + 14);

    // Curved acceleration
    const steps = 600;
    const ptsCurved = [], ptsFlat = [];
    for (let i = 0; i <= steps; i++) {
      const X = xMin + ((xMax - xMin) * i) / steps;
      if (Math.abs(X - X_BIG_BANG) < 0.03) continue;
      const ac = accelCurved(X);
      const af = accelFlat(X);
      if (!isNaN(ac)) ptsCurved.push({ r: X, v: Math.max(-yClamp, Math.min(yClamp, ac)) });
      if (!isNaN(af)) ptsFlat.push({ r: X, v: Math.max(-yClamp, Math.min(yClamp, af)) });
    }

    drawCurve(ctx, ptsFlat, toX, toY, pad, h, {
      color: rgba(colors.text, 0.3), lineWidth: 1.2, dash: [4, 3],
    });
    drawCurve(ctx, ptsCurved, toX, toY, pad, h, {
      color: colors.cyan, lineWidth: 2.2, glow: rgba(colors.cyan, 0.4),
    });

    // Position marker
    const curA = accelCurved(param);
    if (!isNaN(curA) && Math.abs(param - X_BIG_BANG) > 0.03) {
      const clamped = Math.max(-yClamp, Math.min(yClamp, curA));
      drawMarker(ctx, toX(param), toY(clamped));
    }

    drawLegend(ctx, [
      { symbol: "\u2501\u2501", label: "-(1+q) curved", color: colors.cyan },
      { symbol: "\u2505\u2505", label: "-(1+q) flat", color: rgba(colors.text, 0.4) },
    ], pad.left + w - 6, pad.top + h - 24);

    drawAxes(ctx, pad, w, h, { xLabel: "X = D/H", yLabel: "-(1+q) \u2014 acceleration" });
    drawYTicks(ctx, toY, pad, { min: -yClamp, max: yClamp, step: 250, decimals: 0 });
  }, [param, width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
