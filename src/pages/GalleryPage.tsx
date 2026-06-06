import { MagnetLines } from "../components/reactbits/MagnetLines";
import { ScrambledText } from "../components/reactbits/ScrambledText";
import { works } from "../data/gallery";
import { handleInternalLink } from "../router";
import type { CSSProperties } from "react";

export function GalleryPage() {
  return (
    <main className="page gallery-page">
      <section className="page-hero gallery-hero">
        <MagnetLines
          rows={9}
          columns={9}
          containerSize="min(420px, 76vw)"
          lineColor="#111111"
          lineWidth="4px"
          lineHeight="26px"
          baseAngle={-10}
        />
        <div>
          <p className="eyebrow">Selected work</p>
          <h1>Gallery</h1>
          <p>Frames for prototypes, systems, and interface studies.</p>
        </div>
      </section>
      <section className="work-grid" aria-label="Selected works">
        {works.map((work) => (
          <article
            className="work-card"
            key={work.slug}
            style={{ "--accent": work.accent } as CSSProperties}
          >
            <div className="work-card__meta">
              <span>{work.year}</span>
              <span>{work.type}</span>
            </div>
            <h2>{work.title}</h2>
            <p>{work.summary}</p>
            <a
              href={`/gallery/${work.slug}`}
              aria-label={`Open work ${work.title}`}
              onClick={(event) => handleInternalLink(event, `/gallery/${work.slug}`)}
            >
              Open work
            </a>
          </article>
        ))}
      </section>
      <footer className="page-footer">
        <ScrambledText className="scrambled-text">Gallery index / experiments / prototypes</ScrambledText>
      </footer>
    </main>
  );
}
