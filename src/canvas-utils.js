// ── Shared canvas drawing utilities ──────────────────────────────
// Eliminates ~50 lines of boilerplate per canvas component.
// Every 2D plot imports from here instead of reimplementing.

import { colors, rgba, canvas as canvasFonts } from "./theme.js";

// ── Setup ────────────────────────────────────────────────────────

/**
 * Prepare a canvas for HiDPI rendering.
 * Returns { ctx, dpr } — canvas is cleared and scaled.
 */
export function setupCanvas(canvasRef, width, height) {
  const canvas = canvasRef.current;
  if (!canvas) return null;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  return { ctx, dpr };
}

// ── Coordinate transforms ────────────────────────────────────────

/**
 * Build toX / toY linear mapping functions.
 *   domain: { min, max } in data coordinates
 *   range:  { min, max } in pixel coordinates (top-left origin)
 *   flipY:  if true (default), higher data values map to lower pixel Y
 */
export function makeScales(pad, width, height, domainX, domainY) {
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const toX = (v) => pad.left + ((v - domainX[0]) / (domainX[1] - domainX[0])) * w;
  const toY = (v) => pad.top + h - ((v - domainY[0]) / (domainY[1] - domainY[0])) * h;
  return { toX, toY, w, h };
}

// ── Grid ─────────────────────────────────────────────────────────

/**
 * Draw horizontal and/or vertical grid lines.
 */
export function drawGrid(ctx, pad, w, h, { hLines = 5, vLines = 0 } = {}) {
  ctx.strokeStyle = colors.grid;
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= hLines; i++) {
    const y = pad.top + (h * i) / hLines;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + w, y);
    ctx.stroke();
  }
  if (vLines > 0) {
    for (let i = 0; i <= vLines; i++) {
      const x = pad.left + (w * i) / vLines;
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, pad.top + h);
      ctx.stroke();
    }
  }
}

// ── Reference lines (vertical) ──────────────────────────────────

/**
 * Draw vertical reference lines at specific data values.
 * `refs` is an array of { value, label, sublabel?, color, hlKey? }.
 * If `highlightKey` matches a ref's hlKey, that line glows gold.
 */
export function drawRefLines(ctx, refs, toX, pad, h, {
  highlightKey = null,
  isHighlighted = () => false,
  domainMax = Infinity,
} = {}) {
  for (const ref of refs) {
    if (ref.value > domainMax) continue;
    const x = toX(ref.value);
    const isHl = highlightKey ? isHighlighted(highlightKey, ref.hlKey) : false;

    ctx.strokeStyle = isHl ? colors.gold : ref.color;
    ctx.lineWidth = isHl ? 3 : 1;
    if (isHl) { ctx.shadowColor = rgba(colors.gold, 0.6); ctx.shadowBlur = 12; }
    ctx.setLineDash(isHl ? [] : [3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, pad.top + h);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = isHl ? colors.gold : ref.color;
    ctx.font = ref.labelFont || canvasFonts.serifLabel;
    ctx.textAlign = "center";
    ctx.fillText(ref.label, x, pad.top + h + 14);

    // Sublabel (optional)
    if (ref.sublabel) {
      ctx.font = canvasFonts.monoSm;
      ctx.fillStyle = isHl ? rgba(colors.gold, 0.7) : ref.color;
      ctx.fillText(ref.sublabel, x, pad.top + h + 26);
    }
  }
}

// ── Position marker ──────────────────────────────────────────────

/**
 * Draw a glowing circle at (x, y) — the "you are here" indicator.
 * `ring`: if true, draw an outer ring (used in DualPotential).
 */
export function drawMarker(ctx, x, y, { ring = false, radius = 4, color = colors.gold } = {}) {
  if (ring) {
    ctx.strokeStyle = rgba(color, 0.5);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.shadowColor = rgba(color, 0.8);
  ctx.shadowBlur = 12;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

// ── Legend ────────────────────────────────────────────────────────

/**
 * Draw a legend in the corner of the plot.
 * `items`: [{ symbol, label, color }]
 * symbol is typically "──" or "━━" or "┅┅"
 */
export function drawLegend(ctx, items, x, y, { align = "right", lineHeight = 16 } = {}) {
  ctx.font = canvasFonts.mono10;
  ctx.textAlign = align;
  items.forEach((item, i) => {
    ctx.fillStyle = item.color;
    ctx.fillText(`${item.symbol} ${item.label}`, x, y + i * lineHeight);
  });
}

// ── Axes ─────────────────────────────────────────────────────────

/**
 * Draw X and Y axis labels.
 */
export function drawAxes(ctx, pad, w, h, { xLabel, yLabel } = {}) {
  ctx.fillStyle = rgba(colors.text, 0.6);
  ctx.font = canvasFonts.mono12;

  if (xLabel) {
    ctx.textAlign = "center";
    ctx.fillText(xLabel, pad.left + w / 2, pad.top + h + 42);
  }

  if (yLabel) {
    ctx.save();
    ctx.translate(14, pad.top + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();
  }
}

/**
 * Draw X tick labels at integer values.
 */
export function drawXTicks(ctx, toX, pad, h, { start = 1, end = 4, step = 1 } = {}) {
  ctx.fillStyle = colors.textCaption;
  ctx.font = canvasFonts.mono10;
  ctx.textAlign = "center";
  for (let v = start; v <= end; v += step) {
    ctx.fillText(v.toString(), toX(v), pad.top + h + 42);
  }
}

/**
 * Draw Y tick labels.
 */
export function drawYTicks(ctx, toY, pad, { min, max, step, decimals = 1 } = {}) {
  ctx.fillStyle = colors.textCaption;
  ctx.font = canvasFonts.mono10;
  ctx.textAlign = "right";
  for (let v = min; v <= max + step * 0.01; v += step) {
    ctx.fillText(decimals >= 0 ? v.toFixed(decimals) : v.toString(), pad.left - 6, toY(v) + 4);
  }
}

// ── Curve drawing ────────────────────────────────────────────────

/**
 * Draw a data curve with automatic out-of-bounds clamping.
 * `points`: [{ x, y }] in data coordinates.
 * Uses toX/toY to convert. Breaks the path when points go too far out of view.
 */
export function drawCurve(ctx, points, toX, toY, pad, h, {
  color, lineWidth = 2, glow = null, dash = null,
  xKey = "r", yKey = "v",
} = {}) {
  if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 8; }
  if (dash) ctx.setLineDash(dash);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  let started = false;
  for (const p of points) {
    const x = toX(p[xKey]);
    const yRaw = toY(p[yKey]);
    const y = Math.max(pad.top, Math.min(pad.top + h, yRaw));
    if (yRaw < pad.top - 80 || yRaw > pad.top + h + 80) {
      started = false;
      continue;
    }
    if (!started) { ctx.moveTo(x, y); started = true; }
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  if (glow) ctx.shadowBlur = 0;
  if (dash) ctx.setLineDash([]);
}

// ── Horizontal reference line ────────────────────────────────────

/**
 * Draw a horizontal dashed line with a label.
 */
export function drawHLine(ctx, pad, w, toY, value, {
  color = rgba(colors.gold, 0.4),
  label = "",
  dash = [6, 4],
} = {}) {
  const y = toY(value);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(pad.left, y);
  ctx.lineTo(pad.left + w, y);
  ctx.stroke();
  ctx.setLineDash([]);
  if (label) {
    ctx.fillStyle = color;
    ctx.font = canvasFonts.mono10;
    ctx.textAlign = "left";
    ctx.fillText(label, pad.left + 4, y - 4);
  }
}
