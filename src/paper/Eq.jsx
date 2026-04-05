import { useMemo, useEffect, useRef } from "react";
import katex from "katex";
import { useHighlight } from "./HighlightContext.jsx";

// Hoverable term definitions: text content → highlight key.
// After KaTeX renders, we scan the DOM for these text patterns
// and attach hover handlers to the enclosing mrow/msub element.
const HOVER_TERMS = {
  "r0": ["r", "0"],        // r₀ renders as "r" + subscript "0"
  "rh": ["r", "h"],        // rₕ
  "ra": ["r", "a"],        // rₐ
  "lambda5": ["1", "5"],   // 1/5 renders as "1" over "5" in a frac
};

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

  // Post-render: scan for hoverable terms by text content
  useEffect(() => {
    if (!ref.current) return;
    const cleanups = [];

    // Find all msubsup and mfrac elements
    const allSpans = ref.current.querySelectorAll(".katex-html .mord, .katex-html .mfrac, .katex-html .msub");

    for (const el of allSpans) {
      const text = el.textContent.trim();

      // Match r₀ (rendered as "r0" in a subscript group)
      if (text === "r0" && el.classList.contains("msub") ||
          (el.querySelector(".msupsub") && el.textContent.replace(/\s/g, "") === "r0")) {
        attachHover(el, "r0", set, clear, cleanups);
      }

      // Match standalone fractions that look like 1/5
      if (el.classList.contains("mfrac")) {
        const nums = el.querySelectorAll(".mord");
        if (nums.length >= 2) {
          const numText = Array.from(nums).map(n => n.textContent.trim());
          if (numText.includes("1") && numText.includes("5") && numText.length <= 3) {
            attachHover(el, "lambda5", set, clear, cleanups);
          }
        }
      }
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
  el.style.cursor = "pointer";
  el.style.transition = "text-shadow 0.2s ease, color 0.2s ease";
  el.style.borderRadius = "2px";
  const enter = () => {
    set(term);
    el.style.textShadow = "0 0 8px rgba(255,215,0,0.8)";
    el.style.background = "rgba(255,215,0,0.1)";
  };
  const leave = () => {
    clear();
    el.style.textShadow = "none";
    el.style.background = "none";
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
