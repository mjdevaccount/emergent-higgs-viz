import { useMemo } from "react";
import katex from "katex";
import { styles } from "@/theme.js";

export default function Eq({ tex, display = false, num }) {
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

  if (display) {
    return (
      <div style={blockWrap}>
        <span dangerouslySetInnerHTML={{ __html: html }} />
        {num && <span style={styles.eqNum}>({num})</span>}
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
