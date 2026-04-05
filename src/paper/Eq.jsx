import { useMemo, useEffect, useRef } from "react";
import katex from "katex";
import { useHighlight } from "./HighlightContext.jsx";

// Render a LaTeX equation. display=true for block, false for inline.
// Terms wrapped in \htmlClass{hl-termname}{...} become hoverable
// and trigger highlight state for the corresponding visualization.
export default function Eq({ tex, display = false, num }) {
  const ref = useRef(null);
  const { set, clear } = useHighlight();

  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        trust: true,
        strict: false, // allow \htmlClass and HTML extensions
      });
    } catch {
      return tex;
    }
  }, [tex, display]);

  // Attach hover listeners to hl-* class elements
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll("[class*='hl-']");
    const handlers = [];
    for (const el of els) {
      const cls = [...el.classList].find((c) => c.startsWith("hl-"));
      if (!cls) continue;
      const term = cls.replace("hl-", "");
      el.style.cursor = "pointer";
      el.style.transition = "text-shadow 0.2s ease";
      const enter = () => {
        set(term);
        el.style.textShadow = "0 0 8px rgba(255,215,0,0.6)";
      };
      const leave = () => {
        clear();
        el.style.textShadow = "none";
      };
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      handlers.push(() => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    }
    return () => handlers.forEach((fn) => fn());
  }, [html, set, clear]);

  if (display) {
    return (
      <div style={blockWrap}>
        <span ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
        {num && <span style={eqNum}>({num})</span>}
      </div>
    );
  }
  return <span ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}

const blockWrap = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 24,
  margin: "20px 0",
  overflowX: "auto",
};

const eqNum = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 13,
  color: "rgba(180,200,220,0.4)",
  flexShrink: 0,
};
