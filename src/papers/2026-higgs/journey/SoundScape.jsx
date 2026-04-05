import { useRef, useEffect, useCallback } from "react";
import { R_0 } from "../physics.js";
import { colors, rgba, fonts, styles as themeStyles } from "@/theme.js";

// Low-frequency drone that deepens as you descend toward the core.
// Muted by default — user must click to enable.
export default function SoundScape({ radialPos, enabled }) {
  const ctxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const init = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 80;

    // Second oscillator for beating effect
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 82;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    const gain2 = ctx.createGain();
    gain2.gain.value = 0;

    osc.connect(gain).connect(ctx.destination);
    osc2.connect(gain2).connect(ctx.destination);
    osc.start();
    osc2.start();

    oscRef.current = { osc, osc2 };
    gainRef.current = { gain, gain2 };
  }, []);

  useEffect(() => {
    if (!enabled || !gainRef.current) return;

    const { osc, osc2 } = oscRef.current;
    const { gain, gain2 } = gainRef.current;
    const t = ctxRef.current.currentTime;

    // Map r to frequency: far out = 80Hz (barely audible), core = 35Hz (deep rumble)
    const depth = Math.max(0, Math.min(1, (4.0 - radialPos) / 3.4));
    const freq = 80 - depth * 45;
    const vol = depth * 0.12;

    osc.frequency.setTargetAtTime(freq, t, 0.3);
    osc2.frequency.setTargetAtTime(freq + 2 + depth * 4, t, 0.3);
    gain.gain.setTargetAtTime(vol, t, 0.3);
    gain2.gain.setTargetAtTime(vol * 0.6, t, 0.3);
  }, [radialPos, enabled]);

  // Fade out when disabled
  useEffect(() => {
    if (!gainRef.current) return;
    const { gain, gain2 } = gainRef.current;
    const t = ctxRef.current.currentTime;
    if (!enabled) {
      gain.gain.setTargetAtTime(0, t, 0.2);
      gain2.gain.setTargetAtTime(0, t, 0.2);
    }
  }, [enabled]);

  return (
    <button
      onClick={() => {
        init();
        // Parent handles the toggle via its own state
      }}
      style={{
        ...themeStyles.pillButton(enabled),
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: "none", // Hidden — parent controls visibility
      }}
    >
      {enabled ? "♪ ON" : "♪ OFF"}
    </button>
  );
}
