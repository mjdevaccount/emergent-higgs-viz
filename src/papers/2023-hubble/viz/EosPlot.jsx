import { useRef, useEffect } from "react";
import { colors, rgba, canvas as canvasFonts } from "@/theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawCurve,
  drawMarker, drawLegend, drawAxes, drawYTicks, drawHLine,
} from "@/canvas-utils.js";
import { equationOfState, F_TRANSITION } from "../physics.js";
import { isDarkEnergyHighlighted } from "../highlight.js";

export default function EosPlot({ param, width, height, highlight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 25, bottom: 50, left: 55 };
    const { toX, toY, w, h } = makeScales(pad, width, height, [0.5, 1.1], [-1.05, -0.55]);

    drawGrid(ctx, pad, w, h, { hLines: 5, vLines: 6 });

    // w = -1 reference — glow when dark energy highlighted
    const deHl = isDarkEnergyHighlighted(highlight);
    drawHLine(ctx, pad, w, toY, -1, {
      color: deHl ? colors.cyan : rgba(colors.cyan, 0.35),
      label: "w = -1 (vacuum)",
      dash: deHl ? [] : [6, 4],
    });

    // w = -5/7 reference
    drawHLine(ctx, pad, w, toY, -5 / 7, {
      color: rgba(colors.text, 0.2),
      label: "w = -5/7",
      dash: [4, 4],
    });

    // Transition reference line
    const txX = toX(F_TRANSITION);
    ctx.strokeStyle = rgba(colors.red, 0.4);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(txX, pad.top);
    ctx.lineTo(txX, pad.top + h);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = rgba(colors.red, 0.5);
    ctx.font = canvasFonts.monoSm;
    ctx.textAlign = "center";
    ctx.fillText("f_T", txX, pad.top + h + 14);

    // Compute w(f) curve
    const pts = [];
    for (let i = 0; i <= 200; i++) {
      const f = 0.5 + (0.6 * i) / 200;
      const w = equationOfState(f);
      if (!isNaN(w)) pts.push({ r: f, v: w });
    }

    drawCurve(ctx, pts, toX, toY, pad, h, {
      color: colors.gold, lineWidth: 2, glow: rgba(colors.gold, 0.3),
    });

    // Position marker
    const curW = equationOfState(param);
    if (!isNaN(curW)) {
      const py = Math.max(pad.top, Math.min(pad.top + h, toY(curW)));
      drawMarker(ctx, toX(param), py);
    }

    drawLegend(ctx, [
      { symbol: "\u2501\u2501", label: "w (equation of state)", color: colors.gold },
    ], pad.left + w - 6, pad.top + 14);

    drawAxes(ctx, pad, w, h, { xLabel: "f = -q", yLabel: "w" });
    drawYTicks(ctx, toY, pad, { min: -1.0, max: -0.6, step: 0.1 });
  }, [param, width, height, highlight]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
