import { VEV, vevBreakdown } from "../physics.js";

// Persistent HUD overlay showing h² vs v² balance.
// Two connected vessels — liquid transfers as you descend.
export default function VevHud({ radialPos }) {
  const { v, h, f } = vevBreakdown(radialPos);
  const vFrac = v / VEV;
  const hFrac = h / VEV;

  return (
    <div style={container}>
      <div style={label}>VEV BALANCE</div>

      {/* Two vessels side by side */}
      <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
        {/* v vessel */}
        <div style={vesselOuter}>
          <div style={{ ...vesselFill, height: `${vFrac * 100}%`, background: cyanGrad }} />
          <div style={vesselLabel}>v</div>
        </div>

        {/* Connection pipe */}
        <div style={pipe}>
          <div style={{ ...pipeFlow, width: hFrac > 0.1 ? "100%" : "0%" }} />
        </div>

        {/* h vessel */}
        <div style={vesselOuter}>
          <div style={{ ...vesselFill, height: `${hFrac * 100}%`, background: goldGrad }} />
          <div style={vesselLabel}>h</div>
        </div>
      </div>

      {/* Values */}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ ...valText, color: "#00d4ff" }}>{v.toFixed(0)}</span>
        <span style={{ ...valText, color: "#ffd700" }}>{h.toFixed(0)}</span>
      </div>

      <div style={totalLine}>
        φ = {VEV} GeV
      </div>
    </div>
  );
}

const container = {
  position: "fixed",
  bottom: 20,
  left: 20,
  zIndex: 900,
  width: 110,
  padding: "10px 12px",
  background: "rgba(6,6,16,0.8)",
  border: "1px solid rgba(0,212,255,0.12)",
  borderRadius: 8,
  backdropFilter: "blur(12px)",
};

const label = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 8,
  letterSpacing: 2,
  color: "rgba(180,200,220,0.4)",
  textAlign: "center",
  marginBottom: 6,
};

const vesselOuter = {
  position: "relative",
  width: 28,
  height: 60,
  border: "1px solid rgba(180,200,220,0.15)",
  borderRadius: "0 0 4px 4px",
  borderTop: "none",
  overflow: "hidden",
  display: "flex",
  alignItems: "flex-end",
};

const vesselFill = {
  width: "100%",
  transition: "height 0.4s ease",
  borderRadius: "0 0 3px 3px",
};

const vesselLabel = {
  position: "absolute",
  top: 2,
  left: 0,
  right: 0,
  textAlign: "center",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  fontStyle: "italic",
  fontSize: 12,
  color: "rgba(200,210,220,0.5)",
};

const pipe = {
  width: 20,
  height: 3,
  background: "rgba(180,200,220,0.1)",
  borderRadius: 2,
  overflow: "hidden",
  alignSelf: "center",
};

const pipeFlow = {
  height: "100%",
  background: "linear-gradient(90deg, #00d4ff, #ffd700)",
  transition: "width 0.4s ease",
  borderRadius: 2,
};

const cyanGrad = "linear-gradient(0deg, #00d4ff, #006688)";
const goldGrad = "linear-gradient(0deg, #ffd700, #886600)";

const valText = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
};

const totalLine = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 8,
  color: "rgba(180,200,220,0.3)",
  textAlign: "center",
  marginTop: 4,
};
