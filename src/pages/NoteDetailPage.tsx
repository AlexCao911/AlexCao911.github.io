import { ContentBlocks } from "../components/ContentBlocks";
import { notes } from "../data/notes";
import { handleInternalLink } from "../router";

type NoteDetailPageProps = {
  slug: string;
};

export function NoteDetailPage({ slug }: NoteDetailPageProps) {
  const note = notes.find((item) => item.slug === slug);

  if (!note) {
    return (
      <main className="page detail-page">
        <p className="eyebrow">Not found</p>
        <h1>Note not found</h1>
      </main>
    );
  }

  return (
    <main className="page detail-page article-page">
      <a className="back-link" href="/notes" onClick={(event) => handleInternalLink(event, "/notes")}>
        Back to Notes
      </a>
      <time>{note.date}</time>
      <h1>{note.title}</h1>
      <p className="detail-lede">{note.excerpt}</p>
      <ContentBlocks blocks={note.blocks} />
    </main>
  );
}
