import { colors, rgba, fonts, styles } from "../theme.js";

export default function References() {
  return (
    <section style={section}>
      <h2 style={styles.heading}>References</h2>
      <p style={prose}>
        Full reference list available in the{" "}
        <a href="https://www.mdpi.com/2571-712X/9/2/37" style={styles.link} target="_blank" rel="noopener">
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
        <a href="https://github.com/mjdevaccount/emergent-higgs-viz" style={styles.link} target="_blank" rel="noopener">
          Source code on GitHub
        </a>
        {" · "}
        <span>All interactive figures powered by the same physics.js — </span>
        <a href="https://github.com/mjdevaccount/emergent-higgs-viz/blob/master/tests/physics.test.js" style={styles.link} target="_blank" rel="noopener">
          44 verified tests
        </a>
      </div>
    </section>
  );
}

const section = { ...styles.section, padding: "24px 32px 48px", borderTop: `1px solid ${colors.borderFaint}` };
const prose = { ...styles.prose, fontSize: 15, color: colors.textBody };
const refList = { fontSize: 14, lineHeight: 1.7, color: "rgba(200,210,220,0.55)", paddingLeft: 20 };
const refItem = { marginBottom: 8 };
const footer = { marginTop: 32, fontFamily: fonts.mono, fontSize: 11, color: colors.textFaint, textAlign: "center" };
const bibtexBox = { marginTop: 24, background: rgba(colors.cyan, 0.03), border: `1px solid ${colors.borderFaint}`, borderRadius: 6, padding: "12px 16px" };
const bibtexLabel = { fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: rgba(colors.cyan, 0.4), textTransform: "uppercase", marginBottom: 8 };
const bibtexPre = { fontFamily: fonts.mono, fontSize: 12, lineHeight: 1.6, color: "rgba(200,210,220,0.6)", margin: 0, whiteSpace: "pre-wrap", userSelect: "all" };
