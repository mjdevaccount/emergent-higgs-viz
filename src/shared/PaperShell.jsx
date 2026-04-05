import { useState, useRef, useEffect } from "react";
import { colors, rgba, fonts, styles } from "@/theme.js";
import StarField from "@/shared/StarField.jsx";

/**
 * PaperShell — the reusable layout wrapper for any paper.
 *
 * Provides: dark gradient background, star field, sticky nav with
 * parameter slider + TOC, paper header, and scroll anchoring.
 *
 * Props:
 *   meta     — { title, author, journal, volume, date, doi, url, abstract, ... }
 *   toc      — [{ id, label }] for sticky nav links
 *   sections — React children (the actual paper content)
 *   param    — current slider value
 *   onParam  — slider change handler
 *   onToggleJourney — if set, shows a "Journey" button
 */
export default function PaperShell({ meta, toc, children, param, onParam, onToggleJourney, onBack }) {
  return (
    <div style={container}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />

      <StarField />

      {/* Sticky nav */}
      <div style={stickyNav}>
        {onBack && (
          <button onClick={onBack} style={backBtn}>&larr;</button>
        )}
        <span style={sliderValue}>{meta.paramLabel} = {param.toFixed(3)}</span>
        <input
          type="range"
          min={meta.paramMin}
          max={meta.paramMax}
          step={meta.paramStep}
          value={param}
          onChange={(e) => onParam(parseFloat(e.target.value))}
          style={sliderInput}
        />
        <div style={tocRow}>
          {toc.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              style={tocLink}
            >
              {label}
            </a>
          ))}
          {onToggleJourney && (
            <button onClick={onToggleJourney} style={journeyBtn}>
              Journey
            </button>
          )}
        </div>
      </div>

      {/* Paper header */}
      <header style={headerWrap}>
        <div style={tag}>Interactive Supplementary Material</div>
        <h1 style={title}>{meta.title}</h1>
        <div style={author}>{meta.author}</div>
        {meta.affiliation && <div style={affil}>{meta.affiliation}</div>}
        <div style={metaLine}>
          <a href={meta.url} style={styles.link} target="_blank" rel="noopener">
            {meta.journal} {meta.volume}
          </a>
          {" \u00b7 "}
          <span>Published {meta.date}</span>
        </div>
        {meta.doi && (
          <div style={badgeRow}>
            <a href={`https://doi.org/${meta.doi}`} target="_blank" rel="noopener" style={styles.badge}>
              <span style={styles.badgeLeft}>DOI</span>
              <span style={badgeAccent}>{meta.doi}</span>
            </a>
          </div>
        )}
        {meta.abstract && (
          <div style={abstractBox}>
            <div style={styles.sectionTitle}>Abstract</div>
            <p style={abstractText}>{meta.abstract}</p>
          </div>
        )}
      </header>

      {/* Paper sections */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
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
  paddingTop: 56,
  position: "relative",
  overflow: "hidden",
};

const backBtn = {
  fontFamily: fonts.mono,
  fontSize: 14,
  color: rgba(colors.cyan, 0.5),
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "2px 8px 2px 0",
  marginRight: 4,
};

const stickyNav = {
  position: "fixed",
  top: 0, left: 0, right: 0,
  zIndex: 800,
  background: "rgba(6,6,16,0.92)",
  backdropFilter: "blur(12px)",
  borderBottom: `1px solid ${colors.borderFaint}`,
  padding: "8px 24px",
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const sliderValue = {
  fontFamily: fonts.mono,
  fontSize: 11,
  color: colors.gold,
  minWidth: 100,
};

const sliderInput = {
  flex: 1,
  minWidth: 120,
  maxWidth: 300,
  cursor: "pointer",
};

const tocRow = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginLeft: "auto",
};

const tocLink = {
  fontFamily: fonts.mono,
  fontSize: 9,
  letterSpacing: 1,
  color: rgba(colors.cyan, 0.4),
  textDecoration: "none",
  textTransform: "uppercase",
  padding: "2px 6px",
  borderRadius: 3,
  transition: "color 0.2s",
};

const journeyBtn = {
  fontFamily: fonts.mono,
  fontSize: 9,
  letterSpacing: 1,
  color: rgba(colors.gold, 0.6),
  textTransform: "uppercase",
  padding: "2px 8px",
  borderRadius: 3,
  border: `1px solid ${rgba(colors.gold, 0.3)}`,
  background: "transparent",
  cursor: "pointer",
  transition: "all 0.2s",
};

const headerWrap = {
  textAlign: "center",
  padding: "60px 32px 40px",
  borderBottom: `1px solid ${colors.borderFaint}`,
  maxWidth: 740,
  margin: "0 auto",
  position: "relative",
  zIndex: 2,
};

const tag = {
  fontFamily: fonts.mono,
  fontSize: 10,
  letterSpacing: 4,
  color: rgba(colors.cyan, 0.4),
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
  fontFamily: fonts.mono,
  fontSize: 11,
  color: colors.textCaption,
  marginTop: 4,
};

const metaLine = {
  fontFamily: fonts.mono,
  fontSize: 11,
  color: colors.textCaption,
  marginTop: 12,
};

const badgeRow = {
  display: "flex",
  justifyContent: "center",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 16,
};

const badgeAccent = {
  padding: "3px 6px",
  background: rgba(colors.cyan, 0.15),
  color: colors.cyan,
};

const abstractBox = {
  textAlign: "left",
  marginTop: 32,
  padding: "20px 24px",
  background: rgba(colors.cyan, 0.03),
  border: `1px solid ${colors.borderFaint}`,
  borderRadius: 6,
};

const abstractText = {
  fontSize: 15,
  fontWeight: 300,
  lineHeight: 1.75,
  color: colors.textBody,
  margin: 0,
};
