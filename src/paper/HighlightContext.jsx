import { createContext, useContext, useState, useCallback } from "react";

const HighlightContext = createContext({ active: null, set: () => {}, clear: () => {} });

export function HighlightProvider({ children }) {
  const [active, setActive] = useState(null);
  const set = useCallback((term) => {
    console.debug("[Highlight] set:", term);
    setActive(term);
  }, []);
  const clear = useCallback(() => setActive(null), []);
  return (
    <HighlightContext.Provider value={{ active, set, clear }}>
      {children}
      {/* Debug indicator — remove once highlighting is confirmed working */}
      {active && (
        <div style={{
          position: "fixed",
          bottom: 12,
          left: 12,
          padding: "6px 12px",
          background: "rgba(255,215,0,0.15)",
          border: "1px solid rgba(255,215,0,0.4)",
          borderRadius: 6,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: "#ffd700",
          zIndex: 9999,
          pointerEvents: "none",
        }}>
          highlight: {active}
        </div>
      )}
    </HighlightContext.Provider>
  );
}

export function useHighlight() {
  return useContext(HighlightContext);
}
