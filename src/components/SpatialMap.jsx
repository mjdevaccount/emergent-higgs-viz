import { useRef, useEffect } from "react";
import { R_MIN, R_H, R_T, R_0, R_A, sombreroHeight } from "../physics.js";
import { colors, rgba, canvas as canvasFonts } from "../theme.js";
import { setupCanvas } from "../canvas-utils.js";

// Top-down radial map: concentric rings at key radii with tiny
// sombrero profiles drawn at each. "The whole paper in one image."
export default function SpatialMap({ width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const cx = width / 2;
    const cy = height / 2;
    const maxR = Math.min(cx, cy) - 40; // max pixel radius

    // Map r/r₀ to pixel radius. Log-ish scale to show inner detail.
    // r_min → 15%, r₀ → 55%, r_a → 90%
    function rToPixel(r) {
      const t = (r - R_MIN) / (R_A + 0.5 - R_MIN);
      return 20 + t * (maxR - 20);
    }

    // ── Region fills ──
    // Deep well: r_min → r₀ (cyan tint)
    const innerR = rToPixel(R_MIN);
    const horizonR = rToPixel(R_0);
    const accR = rToPixel(R_A);

    // Interior fill
    const grad1 = ctx.createRadialGradient(cx, cy, innerR * 0.3, cx, cy, horizonR);
    grad1.addColorStop(0, "rgba(0,100,150,0.12)");
    grad1.addColorStop(0.7, "rgba(0,60,100,0.06)");
    grad1.addColorStop(1, "rgba(0,30,60,0.02)");
    ctx.fillStyle = grad1;
    ctx.beginPath();
    ctx.arc(cx, cy, horizonR, 0, Math.PI * 2);
    ctx.fill();

    // Accretion ring glow
    ctx.strokeStyle = "rgba(255,200,50,0.08)";
    ctx.lineWidth = rToPixel(R_A + 0.3) - rToPixel(R_A - 0.3);
    ctx.beginPath();
    ctx.arc(cx, cy, accR, 0, Math.PI * 2);
    ctx.stroke();

    // ── Concentric rings at key radii ──
    const rings = [
      { r: R_MIN, label: "r_min", color: "rgba(180,180,180,0.2)", dash: [2, 4] },
      { r: R_H, label: "rₕ  deep well", color: rgba(colors.cyan, 0.4), dash: [] },
      { r: R_T, label: "r_T  transition", color: rgba(colors.green, 0.3), dash: [4, 4] },
      { r: R_0, label: "r₀  event horizon", color: "rgba(255,80,80,0.5)", dash: [] },
      { r: R_A, label: "rₐ  accretion disk", color: rgba(colors.gold, 0.4), dash: [] },
    ];

    for (const { r, label, color, dash } of rings) {
      const pr = rToPixel(r);
      ctx.strokeStyle = color;
      ctx.lineWidth = r === R_0 ? 2 : 1;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label
      ctx.fillStyle = color;
      ctx.font = canvasFonts.mono10;
      ctx.textAlign = "left";
      ctx.fillText(label, cx + pr * Math.cos(-0.3) + 6, cy + pr * Math.sin(-0.3) - 4);
    }

    // ── Mini sombrero profiles at key radii ──
    const sombreroRadii = [
      { r: R_H, color: colors.cyan, labelY: -1 },
      { r: R_0, color: "#ff6666", labelY: -1 },
      { r: R_A, color: colors.gold, labelY: 1 },
    ];

    for (const { r, color } of sombreroRadii) {
      const pr = rToPixel(r);
      // Draw at the right side of the ring
      const ox = cx + pr;
      const oy = cy;
      drawMiniSombrero(ctx, ox - 30, oy - 18, 60, 36, r, color);
    }

    // ── Center label ──
    ctx.fillStyle = rgba(colors.cyan, 0.6);
    ctx.font = canvasFonts.serifTitle;
    ctx.textAlign = "center";
    ctx.fillText("singularity", cx, cy + 4);

    // ── Title ──
    ctx.fillStyle = colors.textDim;
    ctx.font = canvasFonts.mono11;
    ctx.textAlign = "center";
    ctx.fillText("EW POTENTIAL MAPPED IN PHYSICAL SPACE", cx, 18);

    // ── λ/5 annotations ──
    ctx.font = canvasFonts.serifLabelLg;
    ctx.fillStyle = rgba(colors.cyan, 0.7);
    const rhPx = rToPixel(R_H);
    ctx.fillText("λ/5", cx - rhPx - 8, cy + 14);
    ctx.fillStyle = rgba(colors.gold, 0.7);
    const raPx = rToPixel(R_A);
    ctx.fillText("λ/5", cx + raPx + 8, cy + 14);

  }, [width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}

function drawMiniSombrero(ctx, x, y, w, h, r, color) {
  const steps = 40;
  const phiRange = 1.8;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const phi = ((i / steps) * 2 - 1) * phiRange;
    const val = sombreroHeight(phi, 0, r);
    const px = x + (i / steps) * w;
    const py = y + h / 2 - val * h * 1.5;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}
