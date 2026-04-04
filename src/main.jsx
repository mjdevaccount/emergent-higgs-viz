import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import EmergentHiggs from "./App.jsx";
import JourneyShell from "./journey/JourneyShell.jsx";
import PageToggle from "./PageToggle.jsx";

function Root() {
  const [mode, setMode] = useState("journey");

  return (
    <>
      <PageToggle mode={mode} onToggle={setMode} />
      {mode === "journey" ? <JourneyShell /> : <EmergentHiggs />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
