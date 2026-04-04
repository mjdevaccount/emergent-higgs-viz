export default function Header() {
  return (
    <header style={container}>
      <div style={tag}>Interactive Supplementary Material</div>
      <h1 style={title}>
        Emergent Higgs Field and the Schwarzschild Black Hole
      </h1>
      <div style={author}>Dragana Pilipovic&#769;</div>
      <div style={affil}>
        Independent Researcher, New York, NY 10016, USA
      </div>
      <div style={meta}>
        <a href="https://www.mdpi.com/2571-712X/9/2/37" style={link} target="_blank" rel="noopener">
          Particles 2026, 9(2), 37
        </a>
        {" · "}
        <span>Published 3 April 2026</span>
      </div>

      {/* Badges */}
      <div style={badges}>
        <a href="https://doi.org/10.3390/particles9020037" target="_blank" rel="noopener" style={badge}>
          <span style={badgeLeft}>DOI</span>
          <span style={badgeDoi}>10.3390/particles9020037</span>
        </a>
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener" style={badge}>
          <span style={badgeLeft}>license</span>
          <span style={badgeCc}>CC BY 4.0</span>
        </a>
        <a href="https://github.com/mjdevaccount/emergent-higgs-viz/blob/master/tests/physics.test.js" target="_blank" rel="noopener" style={badge}>
          <span style={badgeLeft}>tests</span>
          <span style={badgePass}>44 passing</span>
        </a>
      </div>
      <div style={abstractBox}>
        <div style={abstractLabel}>Abstract</div>
        <p style={abstractText}>
          The derivations presented in this paper suggest an intimate relationship
          between geometry and the electroweak sector at the Planck scale. A
          Lorentz-invariant maximally symmetric stochastically perturbed spacetime
          transformed to spherical coordinates reveals an emergent Schwarzschild
          metric, entirely a statistical structure of stochastic spacetime. Similarly,
          the transition from a maximally symmetric universe with a complex SU(2)
          scalar doublet reveals the spontaneously broken electroweak sector. At the
          minimum points of the potential in space, inside the Schwarzschild sphere
          and at the accretion disk, the quartic coupling corresponding to the
          Standard Model is instead derived as <em>&lambda;/5</em>. The factor of 1/5
          is a simple consequence of the conservation of the EW VEV. An emergent
          Higgs field inside the Schwarzschild black hole is found to directly relate
          to the stochastic spacetime fields normalized by the Schwarzschild radius.
        </p>
      </div>
    </header>
  );
}

const container = {
  textAlign: "center",
  padding: "60px 32px 40px",
  borderBottom: "1px solid rgba(0,212,255,0.08)",
  maxWidth: 740,
  margin: "0 auto",
};

const tag = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  letterSpacing: 4,
  color: "rgba(0,212,255,0.4)",
  textTransform: "uppercase",
  marginBottom: 20,
};

const title = {
  fontSize: 34,
  fontWeight: 400,
  lineHeight: 1.25,
  letterSpacing: -0.3,
  margin: "0 0 16px",
};

const author = {
  fontSize: 20,
  fontWeight: 300,
  color: "rgba(200,210,220,0.8)",
};

const affil = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  color: "rgba(180,200,220,0.4)",
  marginTop: 4,
};

const meta = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 11,
  color: "rgba(180,200,220,0.4)",
  marginTop: 12,
};

const link = {
  color: "#00d4ff",
  textDecoration: "none",
};

const badges = {
  display: "flex",
  justifyContent: "center",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 16,
};

const badge = {
  display: "inline-flex",
  fontSize: 11,
  fontFamily: "'IBM Plex Mono', monospace",
  textDecoration: "none",
  borderRadius: 3,
  overflow: "hidden",
};

const badgeLeft = {
  padding: "3px 6px",
  background: "rgba(180,200,220,0.1)",
  color: "rgba(180,200,220,0.6)",
};

const badgeDoi = {
  padding: "3px 6px",
  background: "rgba(0,212,255,0.15)",
  color: "#00d4ff",
};

const badgeCc = {
  padding: "3px 6px",
  background: "rgba(0,180,80,0.15)",
  color: "#00cc66",
};

const badgePass = {
  padding: "3px 6px",
  background: "rgba(0,180,80,0.15)",
  color: "#00cc66",
};

const abstractBox = {
  textAlign: "left",
  marginTop: 32,
  padding: "20px 24px",
  background: "rgba(0,212,255,0.03)",
  border: "1px solid rgba(0,212,255,0.08)",
  borderRadius: 6,
};

const abstractLabel = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: 10,
  letterSpacing: 3,
  color: "rgba(0,212,255,0.5)",
  textTransform: "uppercase",
  marginBottom: 10,
};

const abstractText = {
  fontSize: 15,
  fontWeight: 300,
  lineHeight: 1.75,
  color: "rgba(200,210,220,0.65)",
  margin: 0,
};
