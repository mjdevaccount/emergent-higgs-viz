import { useState } from "react";
import { useHighlight } from "./HighlightContext.jsx";

/**
 * Wrap any inline content (typically <Eq />) to make it hoverable.
 * Uses plain React events — no DOM scanning, no KaTeX internals.
 *
 * Usage: <HoverTerm term="r0"><Eq tex="r_0" /></HoverTerm>
 */
export default function HoverTerm({ term, children }) {
  const { set, clear } = useHighlight();
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onMouseEnter={() => { set(term); setHovered(true); }}
      onMouseLeave={() => { clear(); setHovered(false); }}
      style={{
        cursor: "pointer",
        display: "inline",
        position: "relative",
        borderRadius: 3,
        transition: "all 0.15s ease",
        textShadow: hovered ? "0 0 12px #ffd700, 0 0 24px rgba(255,215,0,0.5)" : "none",
        background: hovered ? "rgba(255,215,0,0.15)" : "transparent",
        outline: hovered ? "1px solid rgba(255,215,0,0.4)" : "none",
        outlineOffset: 2,
      }}
    >
      {children}
    </span>
  );
}
