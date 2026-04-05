export default function References() {
  return (
    <section style={section}>
      <h2 style={heading}>References</h2>
      <p style={prose}>
        Full reference list available in the{" "}
        <a href="https://www.mdpi.com/2571-712X/9/2/37" style={link} target="_blank" rel="noopener">
          published paper
        </a>.
        Key prior work by the author:
      </p>
      <ol style={refList}>
        <li style={refItem}>
          Pilipovic&#769;, D. (2024). The Algebra and Calculus of Stochastically
          Perturbed Spacetime. <em>Symmetry</em>, 16, 36.
        </li>
        <li style={refItem}>
          Pilipovic&#769;, D. (2023). Late-time dark energy and Hubble
          tension. <em>Open Astronomy</em>, 32, 20220221.
        </li>
        <li style={refItem}>
          Pilipovic&#769;, D. (2024). An Infinitely Old Universe with Planck
          Fields Before and After the Big Bang. <em>Universe</em>, 10, 400.
        </li>
      </ol>

      {/* BibTeX */}
      <div style={bibtexBox}>
        <div style={bibtexLabel}>BibTeX</div>
        <pre style={bibtexPre}>{`@article{Pilipovic2026,
  author  = {Pilipovi\\'{c}, Dragana},
  title   = {Emergent Higgs Field and the Schwarzschild Black Hole},
  journal = {Particles},
  volume  = {9},
  number  = {2},
  pages   = {37},
  year    = {2026},
  doi     = {10.3390/particles9020037}
}`}</pre>
      </div>

      <div style={footer}>
        <a href="https://github.com/mjdevaccount/emergent-higgs-viz" style={link} target="_blank" rel="noopener">
          Source code on GitHub
        </a>
        {" · "}
        <span>All interactive figures powered by the same physics.js — </span>
        <a href="https://github.com/mjdevaccount/emergent-higgs-viz/blob/master/tests/physics.test.js" style={link} target="_blank" rel="noopener">
          44 verified tests
        </a>
      </div>
    </section>
  );
}

const section = { maxWidth: 740, margin: "0 auto", padding: "24px 32px 48px", borderTop: "1px solid rgba(0,212,255,0.08)" };
const heading = { fontSize: 22, fontWeight: 400, marginBottom: 16, color: "#e0e8f0" };
const prose = { fontSize: 15, fontWeight: 300, lineHeight: 1.8, color: "rgba(200,210,220,0.65)", margin: "16px 0" };
const link = { color: "#00d4ff", textDecoration: "none" };
const refList = { fontSize: 14, lineHeight: 1.7, color: "rgba(200,210,220,0.55)", paddingLeft: 20 };
const refItem = { marginBottom: 8 };
const footer = { marginTop: 32, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "rgba(180,200,220,0.35)", textAlign: "center" };
const bibtexBox = { marginTop: 24, background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.08)", borderRadius: 6, padding: "12px 16px" };
const bibtexLabel = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: 2, color: "rgba(0,212,255,0.4)", textTransform: "uppercase", marginBottom: 8 };
const bibtexPre = { fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, lineHeight: 1.6, color: "rgba(200,210,220,0.6)", margin: 0, whiteSpace: "pre-wrap", userSelect: "all" };
