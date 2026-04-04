import { useMemo } from "react";
import katex from "katex";

// Render a LaTeX equation. display=true for block, false for inline.
export default function Eq({ tex, display = false, num }) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, { displayMode: display, throwOnError: false });
    } catch {
      return tex;
    }
  }, [tex, display]);

  if (display) {
    return (
      <div style={blockWrap}>
        <span dangerouslySetInnerHTML={{ __html: html }} />
        {num && <span style={eqNum}>({num})</span>}
      </div>
    );
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
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
