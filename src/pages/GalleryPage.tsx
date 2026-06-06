import { MagnetLines } from "../components/reactbits/MagnetLines";
import { SiteFooter } from "../components/SiteFooter";
import { works } from "../data/gallery";
import { handleInternalLink } from "../router";
import type { CSSProperties } from "react";

export function GalleryPage() {
  return (
    <main className="page gallery-page">
      <section className="showcase-hero gallery-hero">
        <div className="showcase-copy">
          <h1>Gallery</h1>
        </div>
        <div className="reactbits-showcase gallery-pattern" aria-hidden="true">
          <MagnetLines
            rows={9}
            columns={9}
            containerSize="min(520px, 82vw)"
            lineColor="#111111"
            lineWidth="4px"
            lineHeight="26px"
            baseAngle={-10}
          />
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
      <SiteFooter />
    </main>
  );
}
