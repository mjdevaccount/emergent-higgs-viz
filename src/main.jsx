import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import Paper from "./Paper.jsx";
import EmergentHiggs from "./App.jsx";
import JourneyShell from "./journey/JourneyShell.jsx";
import PageToggle from "./PageToggle.jsx";

function Root() {
  const [mode, setMode] = useState("paper");

  return (
    <>
      <PageToggle mode={mode} onToggle={setMode} />
      {mode === "paper" && <Paper />}
      {mode === "journey" && <JourneyShell />}
      {mode === "dashboard" && <EmergentHiggs />}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
