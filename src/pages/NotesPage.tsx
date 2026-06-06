import { Cubes } from "../components/reactbits/Cubes";
import { ScrambledText } from "../components/reactbits/ScrambledText";
import { notes } from "../data/notes";
import { handleInternalLink } from "../router";

export function NotesPage() {
  return (
    <main className="page notes-page">
      <section className="page-hero notes-hero">
        <Cubes
          gridSize={8}
          cubeSize={28}
          maxAngle={45}
          radius={3}
          cellGap={4}
          borderStyle="1px solid #111111"
          faceColor="#120F17"
          rippleColor="#ffffff"
        />
        <div>
          <p className="eyebrow">Writing log</p>
          <h1>Notes</h1>
          <p>Short essays on interfaces, motion, systems, and personal tools.</p>
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
        <ScrambledText className="scrambled-text">Notes archive / fragments / field recordings</ScrambledText>
      </footer>
    </main>
  );
}
