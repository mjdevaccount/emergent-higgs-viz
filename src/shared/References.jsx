import { colors, rgba, fonts, styles } from "@/theme.js";

/**
 * Shared References / Citation section for any paper.
 * Renders: link to published paper, related works list, BibTeX, footer.
 *
 * Props:
 *   meta       — paper metadata (title, author, journal, volume, year, doi, url)
 *   related    — [{ author, year, title, journal, vol, doi }] (optional)
 *   testCount  — number of passing tests (for footer)
 *   testFile   — test filename (for footer link)
 */
export default function References({ meta, related = [], testCount, testFile }) {
  const bibtexKey = `Pilipovic${meta.year}`;
  const bibtex = `@article{${bibtexKey},
  author  = {Pilipovi\\'{c}, Dragana},
  title   = {${meta.title}},
  journal = {${meta.journal}},
  volume  = {${meta.volume.split(",")[0].trim()}},
  year    = {${meta.year}},
  doi     = {${meta.doi}}
}`;

  return (
    <section style={section}>
      <h2 style={styles.heading}>References</h2>
      <p style={prose}>
        Full reference list available in the{" "}
        <a href={meta.url} style={styles.link} target="_blank" rel="noopener">
          published paper
        </a>.
        {related.length > 0 && " Key related work by the author:"}
      </p>

      {related.length > 0 && (
        <ol style={refList}>
          {related.map((r, i) => (
            <li key={i} style={refItem}>
              {r.author} ({r.year}). {r.title}. <em>{r.journal}</em>, {r.vol}.
              {r.doi && (
                <>
                  {" "}
                  <a href={`https://doi.org/${r.doi}`} style={styles.link} target="_blank" rel="noopener">
                    doi
                  </a>
                </>
              )}
            </li>
          ))}
        </ol>
      )}

      <div style={bibtexBox}>
        <div style={bibtexLabel}>BibTeX</div>
        <pre style={bibtexPre}>{bibtex}</pre>
      </div>

      <div style={footer}>
        <a href="https://github.com/mjdevaccount/emergent-higgs-viz" style={styles.link} target="_blank" rel="noopener">
          Source code on GitHub
        </a>
        {testCount && testFile && (
          <>
            {" \u00b7 "}
            <a href={`https://github.com/mjdevaccount/emergent-higgs-viz/blob/master/tests/${testFile}`} style={styles.link} target="_blank" rel="noopener">
              {testCount} verified tests
            </a>
          </>
        )}
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
