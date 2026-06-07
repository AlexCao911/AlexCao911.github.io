import { ContentBlocks } from "../components/ContentBlocks";
import { works } from "../data/gallery";
import { handleInternalLink } from "../router";

type GalleryDetailPageProps = {
  slug: string;
};

export function GalleryDetailPage({ slug }: GalleryDetailPageProps) {
  const work = works.find((item) => item.slug === slug);

  if (!work) {
    return (
      <main className="page detail-page">
        <p className="eyebrow">Not found</p>
        <h1>Work not found</h1>
      </main>
    );
  }

  return (
    <main className="page detail-page">
      <a className="back-link" href="/gallery" onClick={(event) => handleInternalLink(event, "/gallery")}>
        Back to Gallery
      </a>
      <p className="eyebrow">{work.type}</p>
      <h1>{work.title}</h1>
      <p className="detail-lede">{work.summary}</p>
      <ContentBlocks blocks={work.blocks} />
    </main>
  );
}
