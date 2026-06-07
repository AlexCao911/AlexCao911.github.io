import { field, parseMarkdownDocument, type MarkdownBlock } from "./markdown";

export type Work = {
  slug: string;
  title: string;
  year: string;
  type: string;
  summary: string;
  detail: string;
  blocks: MarkdownBlock[];
  body: string[];
  accent: string;
  order: number;
};

const galleryModules = import.meta.glob<string>("../content/gallery/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
});

export const works: Work[] = Object.entries(galleryModules)
  .map(([path, raw]) => {
    const document = parseMarkdownDocument(raw);
    const fallbackSlug = path.split("/").pop()?.replace(/\.md$/, "") ?? "work";
    const summary = field(document.fields, "summary");

    return {
      slug: field(document.fields, "slug", fallbackSlug),
      title: field(document.fields, "title", fallbackSlug),
      year: field(document.fields, "year"),
      type: field(document.fields, "type"),
      summary,
      detail: document.body[0] ?? summary,
      blocks: document.blocks,
      body: document.body,
      accent: field(document.fields, "accent", "#111111"),
      order: Number(field(document.fields, "order", "999")),
    };
  })
  .sort((a, b) => a.order - b.order);
