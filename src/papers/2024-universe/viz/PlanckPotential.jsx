import { useRef, useEffect } from "react";
import { colors, rgba } from "@/theme.js";
import {
  setupCanvas, makeScales, drawGrid, drawCurve,
  drawLegend, drawAxes, drawYTicks, drawHLine,
} from "@/canvas-utils.js";
import { phi4Potential, sombreroPotential, sombreroVEV } from "../physics.js";

// Shows phi⁴ potential (pre-SSB) and sombrero (post-SSB) side by side.
// The sombrero connects this paper to the 2026 Higgs paper.
export default function PlanckPotential({ width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const pad = { top: 30, right: 25, bottom: 50, left: 55 };
    const phiMin = -2, phiMax = 2;
    const vMin = -0.15, vMax = 0.6;
    const { toX, toY, w, h } = makeScales(pad, width, height, [phiMin, phiMax], [vMin, vMax]);

    drawGrid(ctx, pad, w, h, { hLines: 4 });
    drawHLine(ctx, pad, w, toY, 0, { color: "rgba(255,255,255,0.1)", label: "" });

    // Compute curves
    const steps = 300;
    const ptsPhi4 = [], ptsSombrero = [];
    const muSq = 0.5;
    for (let i = 0; i <= steps; i++) {
      const phi = phiMin + ((phiMax - phiMin) * i) / steps;
      ptsPhi4.push({ r: phi, v: phi4Potential(phi) });
      ptsSombrero.push({ r: phi, v: sombreroPotential(phi, muSq) });
    }

    // phi⁴ (pre-SSB)
    drawCurve(ctx, ptsPhi4, toX, toY, pad, h, {
      color: rgba(colors.text, 0.4), lineWidth: 1.5, dash: [5, 3],
    });

    // Sombrero (post-SSB)
    drawCurve(ctx, ptsSombrero, toX, toY, pad, h, {
      color: colors.gold, lineWidth: 2.2, glow: rgba(colors.gold, 0.4),
    });

    // Mark VEV positions
    const vev = sombreroVEV(muSq);
    const vevY = toY(sombreroPotential(vev, muSq));
    ctx.fillStyle = colors.gold;
    ctx.beginPath(); ctx.arc(toX(vev), vevY, 4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(toX(-vev), vevY, 4, 0, Math.PI * 2); ctx.fill();

    // VEV labels
    ctx.fillStyle = rgba(colors.gold, 0.7);
    ctx.font = "9px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("+v", toX(vev), vevY + 16);
    ctx.fillText("-v", toX(-vev), vevY + 16);

    drawLegend(ctx, [
      { symbol: "\u2505\u2505", label: "\u03c6\u2074 (pre-SSB)", color: rgba(colors.text, 0.5) },
      { symbol: "\u2501\u2501", label: "sombrero (post-SSB)", color: colors.gold },
    ], pad.left + w - 6, pad.top + 14);

    drawAxes(ctx, pad, w, h, { xLabel: "\u03c6 (Planck field)", yLabel: "V(\u03c6)" });
    drawYTicks(ctx, toY, pad, { min: -0.1, max: 0.5, step: 0.1 });
  }, [width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}
