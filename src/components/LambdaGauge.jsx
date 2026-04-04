import { couplingGround, R_T, R_0, R_A } from "../physics.js";

export default function LambdaGauge({ radialPos }) {
  const f = couplingGround(radialPos);
  // Determine regime by position, not coupling value
  const insideWell = radialPos < R_T;
  const atAccretion = Math.abs(radialPos - R_A) < 0.3;
  const isMinimum = insideWell || atAccretion;

  return (
    <div style={{ textAlign: "center", padding: "0 16px" }}>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: "rgba(180,200,220,0.5)",
          letterSpacing: 2,
          marginBottom: 8,
          textTransform: "uppercase",
        }}
      >
        Quartic Coupling f(r)
      </div>
      <div
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 36,
          fontWeight: 300,
          color: isMinimum ? "#ffd700" : "#00d4ff",
          transition: "color 0.5s ease",
          lineHeight: 1,
        }}
      >
        {!isNaN(f) ? f.toFixed(3) : "—"}
        <span
          style={{
            fontSize: 16,
            marginLeft: 4,
            color: "rgba(180,200,220,0.5)",
          }}
        >
          × λ
        </span>
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 200,
          height: 3,
          background: "rgba(0,212,255,0.1)",
          borderRadius: 2,
          margin: "12px auto 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(f, 3) / 3 * 100}%`,
            height: "100%",
            background: isMinimum
              ? "linear-gradient(90deg, #ffd700, #ffaa00)"
              : "linear-gradient(90deg, #00d4ff, #0088ff)",
            borderRadius: 2,
            transition: "width 0.3s ease, background 0.5s ease",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          color: isMinimum ? "rgba(255,215,0,0.7)" : "rgba(180,200,220,0.3)",
          marginTop: 6,
          transition: "color 0.5s ease",
          height: 14,
        }}
      >
        {insideWell ? "INSIDE SCHWARZSCHILD — λ/5 REGIME"
          : atAccretion ? "ACCRETION DISK — λ/5 REGIME"
          : radialPos > R_0 ? "SM EXTERIOR" : ""}
      </div>
    </div>
  );
}
