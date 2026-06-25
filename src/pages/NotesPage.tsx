import { Cubes } from "../components/reactbits/Cubes";
import { SiteFooter } from "../components/SiteFooter";
import { notes } from "../data/notes";
import { handleInternalLink } from "../router";

export function NotesPage() {
  return (
    <main className="page notes-page">
      <section className="showcase-hero notes-hero">
        <div className="showcase-copy">
          <h1 className="display-title">Notes</h1>
        </div>
        <div className="showcase-stage">
          <div className="reactbits-showcase notes-pattern" aria-hidden="true">
            <Cubes gridRows={6} gridColumns={10} />
          </div>
          <figure className="showcase-illustration">
            <img
              className="showcase-illustration__image"
              src="/assets/illustrations/notes-spot.png"
              alt="Hand-drawn notes and research illustration"
            />
          </figure>
        </div>
      </section>
      <section className="notes-list" aria-label="Notes">
        {notes.map((note) => (
          <article className="note-card" key={note.slug}>
            <time>{note.date}</time>
            <h2 className="card-title">{note.title}</h2>
            <p>{note.excerpt}</p>
            <a
              href={`/notes/${note.slug}`}
              aria-label={`Read note ${note.title}`}
              onClick={(event) => handleInternalLink(event, `/notes/${note.slug}`)}
            >
              Read note
            </a>
          </article>
        ))}
      </section>
      <SiteFooter />
    </main>
  );
}
