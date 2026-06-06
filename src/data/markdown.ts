export type MarkdownDocument = {
  fields: Record<string, string>;
  body: string[];
};

export function parseMarkdownDocument(raw: string): MarkdownDocument {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  const frontmatter = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!frontmatter) {
    return {
      fields: {},
      body: markdownToParagraphs(normalized),
    };
  }

  return {
    fields: parseFrontmatter(frontmatter[1]),
    body: markdownToParagraphs(frontmatter[2]),
  };
}

export function field(fields: Record<string, string>, key: string, fallback = "") {
  return fields[key] ?? fallback;
}

function parseFrontmatter(source: string) {
  return source.split("\n").reduce<Record<string, string>>((fields, line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return fields;

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();

    if (key) {
      fields[key] = value.replace(/^["']|["']$/g, "");
    }

    return fields;
  }, {});
}

function markdownToParagraphs(source: string) {
  return source
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n/g, " ").trim())
    .filter((block) => block && !block.startsWith("#"));
}
