import { useRef, useEffect } from "react";
import { R_H, R_T, R_0, R_A, TUNNEL_PROB } from "../physics.js";
import { colors, rgba, canvas as canvasFonts } from "../theme.js";
import { setupCanvas } from "../canvas-utils.js";

export default function TransitionDiagram({ width, height }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const result = setupCanvas(canvasRef, width, height);
    if (!result) return;
    const { ctx } = result;

    const cx = width / 2;

    // Layout: three levels vertically
    const yTop = 40;
    const yMid = 100;
    const yBotL = 190;
    const yBotR = 190;
    const xLeft = cx - 100;
    const xRight = cx + 100;

    // Maximally symmetric vacuum
    ctx.fillStyle = colors.textDim;
    ctx.font = canvasFonts.mono11;
    ctx.textAlign = "center";
    ctx.fillText("Maximally Symmetric Vacuum", cx, yTop - 12);
    ctx.fillText("(excited state, \u03c6 = 0)", cx, yTop + 4);

    // Horizontal bar
    ctx.strokeStyle = colors.textFaint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 80, yTop + 14);
    ctx.lineTo(cx + 80, yTop + 14);
    ctx.stroke();

    // Arrow down to transition
    drawArrow(ctx, cx, yTop + 20, cx, yMid - 16, rgba(colors.green, 0.6));
    ctx.fillStyle = rgba(colors.green, 0.7);
    ctx.font = canvasFonts.mono10;
    ctx.textAlign = "left";
    ctx.fillText("natural", cx + 6, (yTop + yMid) / 2 + 2);
    ctx.fillText("transition", cx + 6, (yTop + yMid) / 2 + 14);

    // Transition point
    ctx.fillStyle = rgba(colors.green, 0.8);
    ctx.font = canvasFonts.mono11;
    ctx.textAlign = "center";
    ctx.fillText(`r_T = ${R_T.toFixed(3)}r\u2080`, cx, yMid - 4);

    ctx.shadowColor = rgba(colors.green, 0.6);
    ctx.shadowBlur = 10;
    ctx.fillStyle = colors.green;
    ctx.beginPath();
    ctx.arc(cx, yMid + 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Arrow down-left to rh
    drawArrow(ctx, cx - 10, yMid + 20, xLeft, yBotL - 20, colors.cyan);
    ctx.fillStyle = rgba(colors.cyan, 0.7);
    ctx.font = canvasFonts.mono10;
    ctx.textAlign = "right";
    ctx.fillText("drop to", cx - 30, (yMid + yBotL) / 2 - 2);
    ctx.fillText("ground state", cx - 30, (yMid + yBotL) / 2 + 10);

    // Arrow down-right to ra (tunneling)
    ctx.setLineDash([4, 4]);
    drawArrow(ctx, cx + 10, yMid + 20, xRight, yBotR - 20, rgba(colors.gold, 0.6));
    ctx.setLineDash([]);
    ctx.fillStyle = rgba(colors.gold, 0.7);
    ctx.font = canvasFonts.mono10;
    ctx.textAlign = "left";
    ctx.fillText("tunnel", cx + 30, (yMid + yBotR) / 2 - 2);
    ctx.fillText(`(${(TUNNEL_PROB * 100).toFixed(2)}%)`, cx + 30, (yMid + yBotR) / 2 + 10);

    // Deep well minimum
    ctx.fillStyle = colors.cyan;
    ctx.font = canvasFonts.serifTitle;
    ctx.textAlign = "center";
    ctx.fillText("Deep Well", xLeft, yBotL);
    ctx.font = canvasFonts.mono11;
    ctx.fillStyle = rgba(colors.cyan, 0.7);
    ctx.fillText(`r\u2095 \u2248 ${R_H.toFixed(3)}r\u2080`, xLeft, yBotL + 18);
    ctx.fillText("\u03c8\u209b (positive VEV)", xLeft, yBotL + 34);
    ctx.fillText("\u03bb \u2192 \u03bb/5", xLeft, yBotL + 48);

    // Accretion disk
    ctx.fillStyle = colors.gold;
    ctx.font = canvasFonts.serifTitle;
    ctx.textAlign = "center";
    ctx.fillText("Accretion Disk", xRight, yBotR);
    ctx.font = canvasFonts.mono11;
    ctx.fillStyle = rgba(colors.gold, 0.7);
    ctx.fillText(`r\u2090 \u2248 ${R_A.toFixed(2)}r\u2080`, xRight, yBotR + 18);
    ctx.fillText("\u03c8\u2090 (negative VEV)", xRight, yBotR + 34);
    ctx.fillText("\u03bb \u2192 \u03bb/5", xRight, yBotR + 48);

    // Entanglement line
    ctx.strokeStyle = rgba(colors.purple, 0.3);
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath();
    ctx.moveTo(xLeft + 40, yBotL + 50);
    ctx.lineTo(xRight - 40, yBotR + 50);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = rgba(colors.purple, 0.5);
    ctx.font = canvasFonts.monoSm;
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
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLen * Math.cos(angle - 0.4), y2 - headLen * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - headLen * Math.cos(angle + 0.4), y2 - headLen * Math.sin(angle + 0.4));
  ctx.closePath();
  ctx.fill();
}
