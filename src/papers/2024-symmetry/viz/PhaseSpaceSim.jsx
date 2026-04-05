import { useRef, useEffect } from "react";
import { colors, rgba, canvas as canvasFonts } from "@/theme.js";
import { setupCanvas, drawAxes, drawGrid, makeScales } from "@/canvas-utils.js";
import { isMLSpacetimeHighlighted, isRandomWalkHighlighted } from "../highlight.js";

// Animated free particle in ML spacetime.
// Position undergoes random walk (spreads), momentum stays bounded.

function gaussRandom() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export default function PhaseSpaceSim({ width, height, highlight }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const frameRef = useRef(null);
  const highlightRef = useRef(highlight);
  highlightRef.current = highlight;

  function resetState() {
    stateRef.current = { x: 0, p: 10, points: [], frame: 0 };
  }

  useEffect(() => {
    resetState();
    const pad = { top: 30, right: 25, bottom: 50, left: 55 };
    const m = 1, sigma = 0.5, cxi = 1, dt = 0.1;
    const xRange = [-60, 60], pRange = [-20, 20];

    function tick() {
      const s = stateRef.current;
      if (!s) return;

      // Langevin step
      const xi = gaussRandom() * sigma * Math.sqrt(dt);
      const xiNew = gaussRandom() * sigma * Math.sqrt(dt);
      s.x = s.x + (s.p / m) * dt + xi;
      s.p = s.p + m * Math.sqrt(cxi) * (xiNew - xi);
      s.points.push({ x: s.x, p: s.p });
      if (s.points.length > 4000) s.points.shift();
      s.frame++;

      // Redraw
      const result = setupCanvas(canvasRef, width, height);
      if (!result) { frameRef.current = requestAnimationFrame(tick); return; }
      const { ctx } = result;
      const { toX, toY, w, h } = makeScales(pad, width, height, xRange, pRange);

      drawGrid(ctx, pad, w, h, { hLines: 4, vLines: 4 });

      // Highlight glow when ML spacetime or random walk is hovered
      const hl = highlightRef.current;
      const glowing = isMLSpacetimeHighlighted(hl) || isRandomWalkHighlighted(hl);

      // Draw accumulated points
      ctx.fillStyle = rgba(colors.cyan, glowing ? 0.25 : 0.15);
      for (const pt of s.points) {
        const px = toX(Math.max(xRange[0], Math.min(xRange[1], pt.x)));
        const py = toY(Math.max(pRange[0], Math.min(pRange[1], pt.p)));
        ctx.beginPath();
        ctx.arc(px, py, glowing ? 2 : 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Current point brighter
      if (glowing) { ctx.shadowColor = colors.cyan; ctx.shadowBlur = 10; }
      ctx.fillStyle = rgba(colors.cyan, glowing ? 1 : 0.8);
      ctx.beginPath();
      const cx = toX(Math.max(xRange[0], Math.min(xRange[1], s.x)));
      const cy = toY(Math.max(pRange[0], Math.min(pRange[1], s.p)));
      ctx.arc(cx, cy, glowing ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();
      if (glowing) { ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; }

      // Axes
      drawAxes(ctx, pad, w, h, { xLabel: "position", yLabel: "momentum" });

      // Frame counter + restart hint
      ctx.fillStyle = colors.textCaption;
      ctx.font = canvasFonts.monoSm;
      ctx.textAlign = "right";
      ctx.fillText(`n = ${s.frame}`, pad.left + w, pad.top - 6);
      ctx.textAlign = "left";
      ctx.fillText("click to restart", pad.left, pad.top - 6);

      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [width, height]);

  function handleClick() {
    resetState();
  }

  const glowing = isMLSpacetimeHighlighted(highlight) || isRandomWalkHighlighted(highlight);
  return (
    <canvas
      ref={canvasRef}
      style={{
        width, height, cursor: "pointer",
        boxShadow: glowing ? `0 0 12px ${rgba(colors.cyan, 0.4)}` : "none",
        transition: "box-shadow 0.2s ease",
      }}
      onClick={handleClick}
    />
  );
}
