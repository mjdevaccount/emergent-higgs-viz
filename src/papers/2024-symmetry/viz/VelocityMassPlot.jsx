import { useRef, useEffect } from "react";
import { colors, rgba, fonts, canvas as canvasFonts } from "@/theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawCurve,
  drawLegend, drawAxes, drawYTicks, drawHLine,
} from "@/canvas-utils.js";
import {
  galaxyFlatVelocities, averageFlatVelocity, mondVelocity,
} from "../physics.js";
import { isFlatVelocityHighlighted } from "../highlight.js";

// Flat velocity vs stellar mass — shows V_flat is NOT correlated with mass.
// This contradicts MOND and supports the RWML prediction.
export default function VelocityMassPlot({ width, height, highlight }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 25, bottom: 50, left: 55 };
    const xMin = 5, xMax = 50;
    const yMin = 0, yMax = 400;
    const { toX, toY, w, h } = makeScales(pad, width, height, [xMin, xMax], [yMin, yMax]);

    drawGrid(ctx, pad, w, h, { hLines: 5, vLines: 4 });

    // Average flat velocity horizontal line
    const flatGlow = isFlatVelocityHighlighted(highlight);
    const vFlat = averageFlatVelocity();
    if (flatGlow) { ctx.save(); ctx.shadowColor = colors.gold; ctx.shadowBlur = 16; }
    drawHLine(ctx, pad, w, toY, vFlat, {
      color: colors.gold,
      label: `average = ${vFlat.toFixed(0)} km/s`,
      dash: [],
      lineWidth: flatGlow ? 3 : undefined,
    });
    if (flatGlow) ctx.restore();

    // MOND prediction curve
    const mondPts = [];
    for (let i = 0; i <= 200; i++) {
      const mass = xMin + ((xMax - xMin) * i) / 200;
      mondPts.push({ r: mass, v: mondVelocity(mass * 1e10) });
    }
    drawCurve(ctx, mondPts, toX, toY, pad, h, {
      color: rgba(colors.purple, 0.7), lineWidth: 1.5, dash: [6, 4],
    });

    // Scatter: per-galaxy flat velocity
    const galaxies = galaxyFlatVelocities();
    ctx.fillStyle = rgba(colors.cyan, 0.7);
    for (const g of galaxies) {
      ctx.beginPath();
      ctx.arc(toX(g.mass), toY(g.avgV), 4, 0, Math.PI * 2);
      ctx.fill();
      // Label
      ctx.fillStyle = colors.textCaption;
      ctx.font = canvasFonts.monoSm;
      ctx.textAlign = "center";
      ctx.fillText(g.name, toX(g.mass), toY(g.avgV) - 8);
      ctx.fillStyle = rgba(colors.cyan, 0.7);
    }

    // Legend
    drawLegend(ctx, [
      { symbol: "\u25CF\u25CF", label: "galaxy average (R>40kpc)", color: rgba(colors.cyan, 0.7) },
      { symbol: "\u2501\u2501", label: "simple average", color: colors.gold },
      { symbol: "\u2505\u2505", label: "MOND fit", color: rgba(colors.purple, 0.7) },
    ], pad.left + w - 6, pad.top + 14);

    drawAxes(ctx, pad, w, h, {
      xLabel: "Stellar Mass (\u00d710\u00b9\u2070 M\u2609)",
      yLabel: "V (km/s)",
    });
    drawYTicks(ctx, toY, pad, { min: 0, max: 400, step: 100, decimals: 0 });
  }, [width, height, highlight]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
