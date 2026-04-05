import { useRef, useEffect } from "react";
import { colors, rgba, canvas as canvasFonts } from "@/theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawCurve,
  drawMarker, drawLegend, drawAxes, drawYTicks,
} from "@/canvas-utils.js";
import {
  SNIA_DATA_FAR, luminosityDistanceLCDM, luminosityDistanceRWML,
  H0_LCDM, Q0_LCDM,
} from "../physics.js";
import { isHubbleTensionHighlighted } from "../highlight.js";

export default function LuminosityPlot({ width, height, highlight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 25, bottom: 50, left: 60 };
    const { toX, toY, w, h } = makeScales(pad, width, height, [0, 0.08], [0, 400]);

    drawGrid(ctx, pad, w, h, { hLines: 8, vLines: 8 });

    const tensionHl = isHubbleTensionHighlighted(highlight);

    // Scatter: SNe Ia data points
    for (const pt of SNIA_DATA_FAR) {
      const px = toX(pt.z);
      const py = toY(pt.dL);
      ctx.fillStyle = rgba(colors.cyan, 0.7);
      ctx.shadowColor = rgba(colors.cyan, 0.4);
      ctx.shadowBlur = 4;
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // LCDM model curve (dashed, white/gray)
    const ptsLcdm = [];
    for (let i = 0; i <= 200; i++) {
      const z = (0.08 * i) / 200;
      const dL = luminosityDistanceLCDM(z, H0_LCDM, Q0_LCDM);
      if (!isNaN(dL)) ptsLcdm.push({ r: z, v: dL });
    }
    drawCurve(ctx, ptsLcdm, toX, toY, pad, h, {
      color: rgba(colors.text, 0.5), lineWidth: 2, dash: [6, 4],
      glow: tensionHl ? rgba(colors.text, 0.6) : null,
    });

    // RWML model curve (solid gold)
    const ptsRwml = [];
    for (let i = 0; i <= 200; i++) {
      const z = (0.08 * i) / 200;
      const dL = luminosityDistanceRWML(z, 1.0);
      if (!isNaN(dL)) ptsRwml.push({ r: z, v: dL });
    }
    drawCurve(ctx, ptsRwml, toX, toY, pad, h, {
      color: colors.gold, lineWidth: 2,
      glow: tensionHl ? rgba(colors.gold, 0.6) : rgba(colors.gold, 0.3),
    });

    drawLegend(ctx, [
      { symbol: "\u2022\u2022", label: "SNe Ia data", color: colors.cyan },
      { symbol: "\u2504\u2504", label: "\u039BCDM (H=73.2)", color: rgba(colors.text, 0.5) },
      { symbol: "\u2501\u2501", label: "RWML (H=67.4, D=1.0)", color: colors.gold },
    ], pad.left + w - 6, pad.top + 14);

    drawAxes(ctx, pad, w, h, { xLabel: "redshift z", yLabel: "luminosity distance (Mpc)" });
    drawYTicks(ctx, toY, pad, { min: 0, max: 400, step: 100, decimals: 0 });

    // X-axis ticks
    ctx.fillStyle = colors.textCaption;
    ctx.font = canvasFonts.mono10;
    ctx.textAlign = "center";
    for (let v = 0; v <= 0.08; v += 0.02) {
      ctx.fillText(v.toFixed(2), toX(v), pad.top + h + 42);
    }
  }, [width, height, highlight]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
