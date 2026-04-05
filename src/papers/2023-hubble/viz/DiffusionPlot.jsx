import { useRef, useEffect } from "react";
import { colors, rgba, canvas as canvasFonts } from "@/theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawCurve,
  drawMarker, drawLegend, drawAxes, drawYTicks, drawHLine,
} from "@/canvas-utils.js";
import { diffusionPlus, diffusionMinus, F_TRANSITION } from "../physics.js";
import { isDiffusionParamHighlighted } from "../highlight.js";

export default function DiffusionPlot({ param, width, height, highlight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 25, bottom: 50, left: 55 };
    const { toX, toY, w, h } = makeScales(pad, width, height, [0.5, 1.1], [-0.5, 2.5]);

    drawGrid(ctx, pad, w, h, { hLines: 6, vLines: 6 });

    // Transition reference line
    const txX = toX(F_TRANSITION);
    ctx.strokeStyle = rgba(colors.red, 0.5);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(txX, pad.top);
    ctx.lineTo(txX, pad.top + h);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = rgba(colors.red, 0.6);
    ctx.font = canvasFonts.monoSm;
    ctx.textAlign = "center";
    ctx.fillText("transition", txX, pad.top + h + 14);

    // Zero reference line
    drawHLine(ctx, pad, w, toY, 0, { color: rgba(colors.text, 0.15), label: "", dash: [2, 4] });

    // Compute curves
    const glowDiff = isDiffusionParamHighlighted(highlight);
    const ptsDp = [], ptsDm = [];
    for (let i = 0; i <= 200; i++) {
      const f = 0.5 + (0.6 * i) / 200;
      const dp = diffusionPlus(f);
      const dm = diffusionMinus(f);
      if (!isNaN(dp)) ptsDp.push({ r: f, v: dp });
      if (!isNaN(dm)) ptsDm.push({ r: f, v: dm });
    }

    // D+ curve (gold, solid)
    drawCurve(ctx, ptsDp, toX, toY, pad, h, {
      color: colors.gold, lineWidth: 2,
      glow: glowDiff ? rgba(colors.gold, 0.6) : rgba(colors.gold, 0.3),
    });

    // D- curve (cyan, dashed)
    drawCurve(ctx, ptsDm, toX, toY, pad, h, {
      color: colors.cyan, lineWidth: 2, dash: [6, 4],
      glow: glowDiff ? rgba(colors.cyan, 0.6) : rgba(colors.cyan, 0.3),
    });

    // Position marker on D+
    const curDp = diffusionPlus(param);
    if (!isNaN(curDp)) {
      const py = Math.max(pad.top, Math.min(pad.top + h, toY(curDp)));
      drawMarker(ctx, toX(param), py);
    }

    drawLegend(ctx, [
      { symbol: "\u2501\u2501", label: "D+ state", color: colors.gold },
      { symbol: "\u2504\u2504", label: "D- state", color: colors.cyan },
    ], pad.left + w - 6, pad.top + 14);

    drawAxes(ctx, pad, w, h, { xLabel: "f = -q (acceleration)", yLabel: "X = D/H" });
    drawYTicks(ctx, toY, pad, { min: -0.5, max: 2.5, step: 0.5 });
  }, [param, width, height, highlight]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
