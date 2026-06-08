import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";

type GalleryRiveCanvasProps = {
  src: string;
};

export default function GalleryRiveCanvas({ src }: GalleryRiveCanvasProps) {
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  return <RiveComponent className="gallery-rive-canvas" />;
}
