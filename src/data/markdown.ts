export type MarkdownTextBlock = {
  type: "paragraph";
  text: string;
};

export type MarkdownImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
};

export type MarkdownVideoBlock = {
  type: "video";
  src: string;
  poster?: string;
  caption?: string;
  title?: string;
};

export type MarkdownEmbedBlock = {
  type: "embed";
  src: string;
  title: string;
  caption?: string;
};

export type MarkdownBlock = MarkdownTextBlock | MarkdownImageBlock | MarkdownVideoBlock | MarkdownEmbedBlock;

export type MarkdownDocument = {
  fields: Record<string, string>;
  blocks: MarkdownBlock[];
  body: string[];
};

export function parseMarkdownDocument(raw: string): MarkdownDocument {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  const frontmatter = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!frontmatter) {
    const blocks = markdownToBlocks(normalized);

    return {
      fields: {},
      blocks,
      body: blocksToParagraphs(blocks),
    };
  }

  const blocks = markdownToBlocks(frontmatter[2]);

  return {
    fields: parseFrontmatter(frontmatter[1]),
    blocks,
    body: blocksToParagraphs(blocks),
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

function markdownToBlocks(source: string): MarkdownBlock[] {
  return source
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .flatMap((block) => {
      if (!block || block.startsWith("#")) return [];

      const mediaBlock = parseMediaBlock(block);
      if (mediaBlock) return [mediaBlock];

      const markdownImage = parseMarkdownImage(block);
      if (markdownImage) return [markdownImage];

      return [
        {
          type: "paragraph",
          text: block.replace(/\n/g, " ").trim(),
        },
      ];
    });
}

function parseMediaBlock(block: string): MarkdownBlock | null {
  const match = block.match(/^::(image|video|embed)\n([\s\S]*?)\n?::$/);
  if (!match) return null;

  const kind = match[1];
  const fields = parseFrontmatter(match[2]);
  const src = field(fields, "src");

  if (!src) return null;

  if (kind === "image") {
    return {
      type: "image",
      src,
      alt: field(fields, "alt", field(fields, "caption")),
      caption: optionalField(fields, "caption"),
    };
  }

  if (kind === "video") {
    return {
      type: "video",
      src,
      poster: optionalField(fields, "poster"),
      caption: optionalField(fields, "caption"),
      title: optionalField(fields, "title"),
    };
  }

  return {
    type: "embed",
    src,
    title: field(fields, "title", "Embedded media"),
    caption: optionalField(fields, "caption"),
  };
}

function parseMarkdownImage(block: string): MarkdownImageBlock | null {
  const image = block.match(/^!\[(.*?)]\((.*?)\)$/);
  if (!image) return null;

  return {
    type: "image",
    alt: image[1],
    src: image[2],
  };
}

function optionalField(fields: Record<string, string>, key: string) {
  const value = field(fields, key);
  return value || undefined;
}

function blocksToParagraphs(blocks: MarkdownBlock[]) {
  return blocks.flatMap((block) => (block.type === "paragraph" ? [block.text] : []));
}
