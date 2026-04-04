import { useRef, useEffect } from "react";
import { R_H, R_T, R_0, R_A, TUNNEL_PROB, groundState, excitedState } from "./physics.js";

export default function TransitionDiagram({ width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const mono = "11px 'IBM Plex Mono', monospace";
    const serif = "italic 13px 'Cormorant Garamond', Georgia, serif";

    // Layout: three levels vertically
    const yTop = 40;     // maximally symmetric vacuum (excited)
    const yMid = 100;    // transition point rT
    const yBotL = 190;   // deep well rh
    const yBotR = 190;   // accretion ra

    const xLeft = cx - 100;
    const xRight = cx + 100;

    // ── Maximally symmetric vacuum ──
    ctx.fillStyle = "rgba(180,200,220,0.5)";
    ctx.font = mono;
    ctx.textAlign = "center";
    ctx.fillText("Maximally Symmetric Vacuum", cx, yTop - 12);
    ctx.fillText("(excited state, φ = 0)", cx, yTop + 4);

    // Horizontal bar
    ctx.strokeStyle = "rgba(180,200,220,0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 80, yTop + 14);
    ctx.lineTo(cx + 80, yTop + 14);
    ctx.stroke();

    // ── Arrow down to transition ──
    drawArrow(ctx, cx, yTop + 20, cx, yMid - 16, "rgba(0,255,140,0.6)");
    ctx.fillStyle = "rgba(0,255,140,0.7)";
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("natural", cx + 6, (yTop + yMid) / 2 + 2);
    ctx.fillText("transition", cx + 6, (yTop + yMid) / 2 + 14);

    // ── Transition point ──
    ctx.fillStyle = "rgba(0,255,140,0.8)";
    ctx.font = mono;
    ctx.textAlign = "center";
    ctx.fillText(`r_T = ${R_T.toFixed(3)}r₀`, cx, yMid - 4);

    // Dot
    ctx.shadowColor = "rgba(0,255,140,0.6)";
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#00ff8c";
    ctx.beginPath();
    ctx.arc(cx, yMid + 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // ── Arrow down-left to rh ──
    drawArrow(ctx, cx - 10, yMid + 20, xLeft, yBotL - 20, "#00d4ff");
    ctx.fillStyle = "rgba(0,212,255,0.7)";
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText("drop to", cx - 30, (yMid + yBotL) / 2 - 2);
    ctx.fillText("ground state", cx - 30, (yMid + yBotL) / 2 + 10);

    // ── Arrow down-right to ra (tunneling) ──
    ctx.setLineDash([4, 4]);
    drawArrow(ctx, cx + 10, yMid + 20, xRight, yBotR - 20, "rgba(255,200,50,0.6)");
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(255,215,0,0.7)";
    ctx.font = "10px 'IBM Plex Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("tunnel", cx + 30, (yMid + yBotR) / 2 - 2);
    ctx.fillText(`(${(TUNNEL_PROB * 100).toFixed(2)}%)`, cx + 30, (yMid + yBotR) / 2 + 10);

    // ── Deep well minimum ──
    ctx.fillStyle = "#00d4ff";
    ctx.font = serif;
    ctx.textAlign = "center";
    ctx.fillText("Deep Well", xLeft, yBotL);
    ctx.font = mono;
    ctx.fillStyle = "rgba(0,212,255,0.7)";
    ctx.fillText(`rₕ ≈ ${R_H.toFixed(3)}r₀`, xLeft, yBotL + 18);
    ctx.fillText("ψₛ (positive VEV)", xLeft, yBotL + 34);
    ctx.fillText("λ → λ/5", xLeft, yBotL + 48);

    // ── Accretion disk ──
    ctx.fillStyle = "#ffd700";
    ctx.font = serif;
    ctx.textAlign = "center";
    ctx.fillText("Accretion Disk", xRight, yBotR);
    ctx.font = mono;
    ctx.fillStyle = "rgba(255,215,0,0.7)";
    ctx.fillText(`rₐ ≈ ${R_A.toFixed(2)}r₀`, xRight, yBotR + 18);
    ctx.fillText("ψₐ (negative VEV)", xRight, yBotR + 34);
    ctx.fillText("λ → λ/5", xRight, yBotR + 48);

    // ── Entanglement line ──
    ctx.strokeStyle = "rgba(136,68,255,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(xLeft + 40, yBotL + 50);
    ctx.lineTo(xRight - 40, yBotR + 50);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(136,68,255,0.5)";
    ctx.font = "9px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("statistically entangled (VEV conservation)", cx, yBotL + 58);

  }, [width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} />;
}

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const headLen = 8;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  // Arrowhead
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
}
