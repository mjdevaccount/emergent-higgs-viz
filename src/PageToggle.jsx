import { colors, rgba, fonts } from "./theme.js";

export default function PageToggle({ mode, onToggle }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 1000,
        pointerEvents: "auto",
        display: "flex",
        gap: 0,
        borderRadius: 20,
        overflow: "hidden",
        border: `1px solid ${rgba(colors.cyan, 0.2)}`,
        backdropFilter: "blur(12px)",
        background: "rgba(6,6,16,0.7)",
      }}
    >
      {["paper", "journey", "dashboard"].map((m) => (
        <button
          key={m}
          onClick={() => onToggle(m)}
          style={mode === m ? activeBtn : inactiveBtn}
        >
          {m === "paper" ? "Paper" : m === "journey" ? "Journey" : "Dashboard"}
        </button>
      ))}
    </div>
  );
}

const base = {
  fontFamily: fonts.mono,
  fontSize: 11,
  letterSpacing: 1,
  padding: "8px 16px",
  border: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const activeBtn = {
  ...base,
  background: rgba(colors.cyan, 0.15),
  color: colors.cyan,
};

const inactiveBtn = {
  ...base,
  background: "transparent",
  color: colors.textCaption,
};
