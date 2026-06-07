import { type MarkdownBlock } from "../data/markdown";
import "../content-media.css";

type ContentBlocksProps = {
  blocks: MarkdownBlock[];
};

export function ContentBlocks({ blocks }: ContentBlocksProps) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return <p key={`${block.type}-${index}`}>{block.text}</p>;
        }

        if (block.type === "image") {
          return (
            <figure className="content-media content-media-image" key={`${block.type}-${block.src}-${index}`}>
              <img src={block.src} alt={block.alt} loading="lazy" />
              {block.caption ? <figcaption>{block.caption}</figcaption> : null}
            </figure>
          );
        }

        if (block.type === "video") {
          return (
            <figure className="content-media content-media-video" key={`${block.type}-${block.src}-${index}`}>
              <video src={block.src} poster={block.poster} title={block.title} controls playsInline preload="metadata" />
              {block.caption ? <figcaption>{block.caption}</figcaption> : null}
            </figure>
          );
        }

        return (
          <figure className="content-media content-media-embed" key={`${block.type}-${block.src}-${index}`}>
            <iframe
              src={block.src}
              title={block.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            {block.caption ? <figcaption>{block.caption}</figcaption> : null}
          </figure>
        );
      })}
    </>
  );
}
