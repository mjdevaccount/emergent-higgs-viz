import { createContext, useContext, useState, useCallback } from "react";

const HighlightContext = createContext({ active: null, set: () => {}, clear: () => {} });

export function HighlightProvider({ children }) {
  const [active, setActive] = useState(null);
  const set = useCallback((term) => setActive(term), []);
  const clear = useCallback(() => setActive(null), []);
  return (
    <HighlightContext.Provider value={{ active, set, clear }}>
      {children}
    </HighlightContext.Provider>
  );
}

export function useHighlight() {
  return useContext(HighlightContext);
}
