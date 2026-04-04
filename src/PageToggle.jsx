export default function PageToggle({ mode, onToggle }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,
        display: "flex",
        gap: 0,
        borderRadius: 20,
        overflow: "hidden",
        border: "1px solid rgba(0,212,255,0.2)",
        backdropFilter: "blur(12px)",
        background: "rgba(6,6,16,0.7)",
      }}
    >
      <button
        onClick={() => onToggle("journey")}
        style={mode === "journey" ? activeBtn : inactiveBtn}
      >
        Journey
      </button>
      <button
        onClick={() => onToggle("technical")}
        style={mode === "technical" ? activeBtn : inactiveBtn}
      >
        Technical
      </button>
    </div>
  );
}

const base = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  letterSpacing: 1,
  padding: "8px 16px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const activeBtn = {
  ...base,
  background: "rgba(0,212,255,0.15)",
  color: "#00d4ff",
};

const inactiveBtn = {
  ...base,
  background: "transparent",
  color: "rgba(180,200,220,0.4)",
};
