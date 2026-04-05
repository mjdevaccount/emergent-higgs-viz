import { useRef, useEffect } from "react";
import { colors, rgba, fonts, canvas as canvasFonts } from "@/theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawCurve,
  drawMarker, drawLegend, drawAxes, drawYTicks, drawHLine,
} from "@/canvas-utils.js";
import {
  SPARC_GALAXIES, newtonianVelocity, averageFlatVelocity,
} from "../physics.js";
import {
  isFlatVelocityHighlighted, isDarkMatterHighlighted,
} from "../highlight.js";

// Galaxy rotation velocity vs radius — the central result.
// Flat velocity persists at large R, defying Newtonian 1/sqrt(R) falloff.
export default function RotationCurvePlot({ param, width, height, highlight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 25, bottom: 50, left: 55 };
    const xMin = 0, xMax = 120;
    const yMin = 0, yMax = 450;
    const { toX, toY, w, h } = makeScales(pad, width, height, [xMin, xMax], [yMin, yMax]);

    drawGrid(ctx, pad, w, h, { hLines: 5, vLines: 6 });

    // Scatter: SPARC galaxy data points
    const opacities = [0.5, 0.4, 0.45, 0.55, 0.35, 0.5, 0.42];
    SPARC_GALAXIES.forEach((gal, gi) => {
      ctx.fillStyle = rgba(colors.cyan, opacities[gi % opacities.length]);
      for (const pt of gal.points) {
        ctx.beginPath();
        ctx.arc(toX(pt.R), toY(pt.V), 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Newtonian falloff curve: V = sqrt(GM/R) for M = 2e11
    const dmGlow = isDarkMatterHighlighted(highlight);
    const newtonPts = [];
    for (let i = 1; i <= 300; i++) {
      const R = (xMax * i) / 300;
      newtonPts.push({ r: R, v: newtonianVelocity(R, 2e11) });
    }
    if (dmGlow) { ctx.save(); ctx.shadowColor = colors.gold; ctx.shadowBlur = 12; }
    drawCurve(ctx, newtonPts, toX, toY, pad, h, {
      color: dmGlow ? rgba(colors.gold, 0.8) : rgba(colors.text, 0.4),
      lineWidth: dmGlow ? 2.5 : 1.5,
      dash: [6, 4],
    });
    if (dmGlow) ctx.restore();

    // Flat velocity horizontal line (the key result)
    const flatGlow = isFlatVelocityHighlighted(highlight);
    const vFlat = averageFlatVelocity();
    if (flatGlow) { ctx.save(); ctx.shadowColor = colors.gold; ctx.shadowBlur = 16; }
    drawHLine(ctx, pad, w, toY, vFlat, {
      color: colors.gold,
      label: `V_flat = ${vFlat.toFixed(0)} km/s`,
      dash: [],
      lineWidth: flatGlow ? 3 : undefined,
    });
    if (flatGlow) ctx.restore();

    // Position marker on flat velocity line
    if (param >= xMin && param <= xMax) {
      drawMarker(ctx, toX(param), toY(vFlat));
    }

    // Legend
    drawLegend(ctx, [
      { symbol: "\u25CF\u25CF", label: "SPARC data", color: rgba(colors.cyan, 0.5) },
      { symbol: "\u2505\u2505", label: "Newtonian \u221A(GM/R)", color: rgba(colors.text, 0.4) },
      { symbol: "\u2501\u2501", label: "V_flat (RWML)", color: colors.gold },
    ], pad.left + w - 6, pad.top + 14);

    drawAxes(ctx, pad, w, h, { xLabel: "R (kpc)", yLabel: "V (km/s)" });
    drawYTicks(ctx, toY, pad, { min: 0, max: 450, step: 100, decimals: 0 });
  }, [param, width, height, highlight]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
