import { field, parseMarkdownDocument, type MarkdownBlock } from "./markdown";

export type Note = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  blocks: MarkdownBlock[];
  body: string[];
  order: number;
};

const noteModules = import.meta.glob<string>("../content/notes/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

export const notes: Note[] = Object.entries(noteModules)
  .map(([path, raw]) => {
    const document = parseMarkdownDocument(raw);
    const fallbackSlug = path.split("/").pop()?.replace(/\.md$/, "") ?? "note";

    return {
      slug: field(document.fields, "slug", fallbackSlug),
      title: field(document.fields, "title", fallbackSlug),
      date: field(document.fields, "date"),
      excerpt: field(document.fields, "excerpt"),
      blocks: document.blocks,
      body: document.body,
      order: Number(field(document.fields, "order", "999")),
    };
  })
  .sort((a, b) => a.order - b.order);
