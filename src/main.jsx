import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Higgs2026 from "./papers/2026-higgs/index.jsx";
import JourneyShell from "./papers/2026-higgs/journey/JourneyShell.jsx";

function Root() {
  const [journey, setJourney] = useState(false);

  // For now, single paper — will become a paper selector/timeline later
  if (journey) {
    return <JourneyShell onBack={() => setJourney(false)} />;
  }

  return <Higgs2026 onToggleJourney={() => setJourney(true)} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
