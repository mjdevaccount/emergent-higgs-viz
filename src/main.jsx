import React, { useState, useEffect, Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import papers from "./papers/registry.js";
import Timeline from "./shared/Timeline.jsx";

function Root() {
  const [selected, setSelected] = useState(null);  // paper object or null
  const [mode, setMode] = useState("paper");        // "paper" | "journey"
  const [PaperComponent, setPaperComponent] = useState(null);
  const [JourneyComponent, setJourneyComponent] = useState(null);

  // Lazy-load the selected paper's component
  useEffect(() => {
    if (!selected) {
      setPaperComponent(null);
      setJourneyComponent(null);
      return;
    }
    selected.load().then((mod) => setPaperComponent(() => mod.default));
    if (selected.loadJourney) {
      selected.loadJourney().then((mod) => setJourneyComponent(() => mod.default));
    }
  }, [selected]);

  // Timeline / landing page
  if (!selected || !PaperComponent) {
    return <Timeline papers={papers} onSelect={(p) => { setSelected(p); setMode("paper"); }} />;
  }

  // Journey mode
  if (mode === "journey" && JourneyComponent) {
    return <JourneyComponent onBack={() => setMode("paper")} />;
  }

  // Paper mode
  return (
    <PaperComponent
      onToggleJourney={selected.hasJourney ? () => setMode("journey") : undefined}
      onBack={() => setSelected(null)}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
