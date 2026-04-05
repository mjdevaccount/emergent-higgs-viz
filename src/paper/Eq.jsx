import { useMemo, useEffect, useRef } from "react";
import katex from "katex";
import { useHighlight } from "./HighlightContext.jsx";
import { TERMS } from "./highlight.js";

export default function Eq({ tex, display = false, num }) {
  const ref = useRef(null);
  const { set, clear } = useHighlight();

  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return tex;
    }
  }, [tex, display]);

  // Post-render: scan for hoverable terms by text content.
  // KaTeX inserts zero-width spaces (U+200B) in vlist structures,
  // so we must strip them before comparing text content.
  useEffect(() => {
    if (!ref.current) return;
    const cleanups = [];
    const strip = (s) => s.replace(/[\s\u200B]/g, "");

    // Find all relevant KaTeX spans
    const allSpans = ref.current.querySelectorAll(
      ".katex-html .mord, .katex-html .mfrac"
    );

    let matchCount = 0;
    for (const el of allSpans) {
      const text = strip(el.textContent);

      // Match r₀ — a .mord containing .msupsub with text "r0"
      if (text === "r0" && el.querySelector(".msupsub")) {
        attachHover(el, TERMS.r0, set, clear, cleanups);
        matchCount++;
      }

      // Match r_h — subscript group with text "rh"
      if (text === "rh" && el.querySelector(".msupsub")) {
        attachHover(el, TERMS.rh, set, clear, cleanups);
        matchCount++;
      }

      // Match r_a — subscript group with text "ra"
      if (text === "ra" && el.querySelector(".msupsub")) {
        attachHover(el, TERMS.ra, set, clear, cleanups);
        matchCount++;
      }

      // Match fractions that look like 1/5
      // KaTeX duplicates .mord elements in vlist, so check total text instead
      if (el.classList.contains("mfrac")) {
        const digits = strip(el.textContent).split("").sort().join("");
        if (digits === "15") {
          attachHover(el, TERMS.lambda5, set, clear, cleanups);
          matchCount++;
        }
      }
    }

    if (matchCount > 0) {
      console.debug(`[Eq] Attached ${matchCount} hover term(s) in: ${tex.slice(0, 40).trim()}…`);
    }

    return () => cleanups.forEach(fn => fn());
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

function attachHover(el, term, set, clear, cleanups) {
  // DEBUG: permanent marker so we can SEE what got tagged
  el.style.borderBottom = "2px dashed rgba(255,215,0,0.6)";
  el.style.cursor = "pointer";
  el.style.transition = "all 0.15s ease";
  el.style.borderRadius = "3px";
  el.style.padding = "1px 3px";
  el.style.margin = "0 -3px";
  // Log the first match's position for debugging
  const rect = el.getBoundingClientRect();
  console.debug(`[Eq] Tagged "${term}" at`, rect.x.toFixed(0), rect.y.toFixed(0), `${rect.width.toFixed(0)}x${rect.height.toFixed(0)}`, el);
  const enter = () => {
    set(term);
    el.style.textShadow = "0 0 12px #ffd700, 0 0 24px rgba(255,215,0,0.5)";
    el.style.background = "rgba(255,215,0,0.2)";
    el.style.outline = "1px solid rgba(255,215,0,0.5)";
    el.style.color = "#ffd700";
  };
  const leave = () => {
    clear();
    el.style.textShadow = "none";
    el.style.background = "none";
    el.style.outline = "none";
    el.style.color = "";
  };
  el.addEventListener("mouseenter", enter);
  el.addEventListener("mouseleave", leave);
  cleanups.push(() => {
    el.removeEventListener("mouseenter", enter);
    el.removeEventListener("mouseleave", leave);
  });
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
