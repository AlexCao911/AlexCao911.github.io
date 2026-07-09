import { useState } from "react";

type LiteYouTubeEmbedProps = {
  src: string;
  title: string;
  poster?: string;
};

function getYouTubeVideoId(src: string) {
  try {
    const url = new URL(src);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (hostname.endsWith("youtube.com") || hostname.endsWith("youtube-nocookie.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return url.pathname.split("/").filter(Boolean)[1] ?? null;
      }

      return url.searchParams.get("v");
    }
  } catch {
    return null;
  }

  return null;
}

export function LiteYouTubeEmbed({ src, title, poster }: LiteYouTubeEmbedProps) {
  const [isActive, setIsActive] = useState(false);
  const videoId = getYouTubeVideoId(src);

  if (!videoId) {
    return (
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (isActive) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        loading="eager"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button className="lite-youtube" type="button" aria-label={`Play ${title}`} onClick={() => setIsActive(true)}>
      <img
        className="lite-youtube__poster"
        src={poster ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
      />
      <span className="lite-youtube__scrim" aria-hidden="true" />
      <span className="lite-youtube__play" aria-hidden="true">
        Play
      </span>
    </button>
  );
}
