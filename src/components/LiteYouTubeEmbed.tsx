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

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <a className="lite-youtube" href={youtubeUrl} aria-label={`Play ${title}`}>
      <img
        className="lite-youtube__poster"
        src={poster ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        loading="eager"
        decoding="async"
      />
      <span className="lite-youtube__play" aria-hidden="true">
        Play
      </span>
    </a>
  );
}
