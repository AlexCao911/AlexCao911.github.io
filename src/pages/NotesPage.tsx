import { Cubes } from "../components/reactbits/Cubes";
import { ScrambledText } from "../components/reactbits/ScrambledText";
import { notes } from "../data/notes";
import { handleInternalLink } from "../router";

export function NotesPage() {
  return (
    <main className="page notes-page">
      <section className="showcase-hero notes-hero">
        <div className="showcase-copy">
          <p className="eyebrow">Writing log</p>
          <h1>Notes</h1>
          <p>Short essays on interfaces, motion, systems, and personal tools.</p>
        </div>
        <div className="reactbits-showcase notes-pattern" aria-hidden="true">
          <Cubes />
        </div>
      </section>
      <section className="notes-list" aria-label="Notes">
        {notes.map((note) => (
          <article className="note-card" key={note.slug}>
            <time>{note.date}</time>
            <h2>{note.title}</h2>
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
      <footer className="page-footer">
        <ScrambledText className="scrambled-text">
          the people who are crazy enough to think they can change the world, are the ones who do
        </ScrambledText>
      </footer>
    </main>
  );
}
