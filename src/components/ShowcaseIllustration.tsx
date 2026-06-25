type ShowcaseIllustrationProps = {
  alt: string;
  name: "gallery-spot" | "notes-spot";
};

export function ShowcaseIllustration({ alt, name }: ShowcaseIllustrationProps) {
  const basePath = `/assets/illustrations/${name}`;

  return (
    <figure className="showcase-illustration">
      <img
        className="showcase-illustration__image"
        src={`${basePath}-720.jpg`}
        srcSet={`${basePath}-720.jpg 720w, ${basePath}-1280.jpg 1280w`}
        sizes="(max-width: 820px) 90vw, 543px"
        width="1280"
        height="720"
        loading="lazy"
        decoding="async"
        alt={alt}
      />
    </figure>
  );
}
