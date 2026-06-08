import { lazy, Suspense } from "react";
import "./GalleryRiveShowcase.css";

const GalleryRiveCanvas = lazy(() => import("./GalleryRiveCanvas"));
const BLACK_CAT_RIVE_SRC = "/assets/rive/black-cat.riv";

function isTestEnvironment() {
  return typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("jsdom");
}

export function GalleryRiveShowcase() {
  const shouldRenderRive = !isTestEnvironment();

  return (
    <div className="gallery-rive-showcase" data-rive-src={BLACK_CAT_RIVE_SRC}>
      <div className="gallery-rive-panel">
        {shouldRenderRive ? (
          <Suspense fallback={<div className="gallery-rive-fallback" />}>
            <GalleryRiveCanvas src={BLACK_CAT_RIVE_SRC} />
          </Suspense>
        ) : (
          <div className="gallery-rive-fallback" />
        )}
      </div>
    </div>
  );
}
