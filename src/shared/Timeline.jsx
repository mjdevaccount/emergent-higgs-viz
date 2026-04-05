import { colors, rgba, fonts } from "@/theme.js";
import StarField from "@/shared/StarField.jsx";

/**
 * Timeline — landing page showing all papers in chronological order.
 * Each card is clickable to enter that paper's interactive experience.
 */
export default function Timeline({ papers, onSelect }) {
  return (
    <div style={container}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />
      <StarField />

      <div style={content}>
        {/* Site header */}
        <header style={header}>
          <div style={siteTag}>Interactive Paper Companion</div>
          <h1 style={siteTitle}>
            Stochastic Spacetime
            <span style={{ display: "block", color: colors.cyan, fontSize: "0.6em", fontWeight: 300, marginTop: 8 }}>
              The Research of Dragana Pilipovi&#263;
            </span>
          </h1>
          <p style={siteSubtitle}>
            From fundamental uncertainty at Planck scale to emergent gravity,
            dark energy, and the Higgs field — explore each paper interactively.
          </p>
        </header>

        {/* Timeline line */}
        <div style={timelineTrack}>
          <div style={trackLine} />

          {papers.map((paper, i) => {
            const implemented = !!paper.load;
            return (
              <div key={paper.id} style={cardWrap}>
                {/* Year dot */}
                <div style={yearDot(paper.color)}>
                  <span style={yearText}>{paper.year}</span>
                </div>

                {/* Card */}
                <button
                  onClick={() => implemented && onSelect(paper)}
                  style={card(paper.color, implemented)}
                  disabled={!implemented}
                >
                  <div style={cardJournal}>{paper.journal}</div>
                  <h2 style={cardTitle(paper.color)}>{paper.shortTitle || paper.title}</h2>
                  {paper.tagline && <p style={cardTagline}>{paper.tagline}</p>}
                  {implemented ? (
                    <div style={cardAction(paper.color)}>Explore &rarr;</div>
                  ) : (
                    <div style={cardComingSoon}>Coming soon</div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer style={footer}>
          <div>doi:10.3390/particles9020037 and related works</div>
          <div style={{ marginTop: 4 }}>
            Built with React, Three.js, and KaTeX
          </div>
        </footer>
      </div>
    </div>
  );
}

// ── Styles ──

const container = {
  minHeight: "100vh",
  background: colors.bgGradient,
  color: colors.text,
  fontFamily: fonts.serif,
  position: "relative",
  overflow: "hidden",
};

const content = {
  position: "relative",
  zIndex: 2,
  maxWidth: 700,
  margin: "0 auto",
  padding: "0 24px",
};

const header = {
  textAlign: "center",
  padding: "80px 0 60px",
};

const siteTag = {
  fontFamily: fonts.mono,
  fontSize: 10,
  letterSpacing: 4,
  color: rgba(colors.cyan, 0.4),
  textTransform: "uppercase",
  marginBottom: 20,
};

const siteTitle = {
  fontSize: 42,
  fontWeight: 300,
  lineHeight: 1.2,
  letterSpacing: -0.5,
  margin: 0,
};

const siteSubtitle = {
  fontSize: 17,
  fontWeight: 300,
  fontStyle: "italic",
  lineHeight: 1.7,
  color: colors.textBody,
  maxWidth: 500,
  margin: "24px auto 0",
};

const timelineTrack = {
  position: "relative",
  paddingLeft: 40,
  paddingBottom: 60,
};

const trackLine = {
  position: "absolute",
  left: 18,
  top: 0,
  bottom: 0,
  width: 2,
  background: `linear-gradient(180deg, ${rgba(colors.cyan, 0.3)}, ${rgba(colors.cyan, 0.05)})`,
  borderRadius: 1,
};

const cardWrap = {
  position: "relative",
  marginBottom: 40,
};

const yearDot = (color) => ({
  position: "absolute",
  left: -40,
  top: 16,
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: color,
  boxShadow: `0 0 12px ${rgba(color, 0.4)}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const yearText = {
  position: "absolute",
  left: -48,
  fontFamily: fonts.mono,
  fontSize: 11,
  color: colors.textDim,
  whiteSpace: "nowrap",
};

const card = (color, implemented) => ({
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "24px 28px",
  background: "rgba(8,12,24,0.6)",
  border: `1px solid ${implemented ? rgba(color, 0.2) : rgba(colors.text, 0.05)}`,
  borderRadius: 10,
  cursor: implemented ? "pointer" : "default",
  transition: "all 0.3s ease",
  fontFamily: "inherit",
  color: "inherit",
  opacity: implemented ? 1 : 0.5,
});

const cardJournal = {
  fontFamily: fonts.mono,
  fontSize: 10,
  letterSpacing: 2,
  color: colors.textCaption,
  textTransform: "uppercase",
  marginBottom: 8,
};

const cardTitle = (color) => ({
  fontSize: 24,
  fontWeight: 400,
  margin: "0 0 8px",
  color,
});

const cardTagline = {
  fontSize: 15,
  fontWeight: 300,
  fontStyle: "italic",
  color: colors.textBody,
  margin: "0 0 16px",
  lineHeight: 1.5,
};

const cardAction = (color) => ({
  fontFamily: fonts.mono,
  fontSize: 11,
  letterSpacing: 1,
  color: rgba(color, 0.7),
});

const cardComingSoon = {
  fontFamily: fonts.mono,
  fontSize: 10,
  letterSpacing: 2,
  color: colors.textFaint,
  textTransform: "uppercase",
};

const footer = {
  textAlign: "center",
  padding: "40px 0 60px",
  fontFamily: fonts.mono,
  fontSize: 10,
  color: colors.textFaint,
  borderTop: `1px solid ${colors.borderFaint}`,
};
