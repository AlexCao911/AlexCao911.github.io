import { lazy, Suspense } from "react";
import "./GalleryRiveShowcase.css";

const GalleryRiveCanvas = lazy(() => import("./GalleryRiveCanvas"));
const BLACK_CAT_RIVE_SRC = "/assets/rive/black-cat.riv";
const BLACK_CAT_RIVE_ARTBOARD = "WCT 01";
const BLACK_CAT_RIVE_STATE_MACHINE = "BLACK CATW";
const BLACK_CAT_RIVE_HOVER_INPUT = "Hover";

function isTestEnvironment() {
  return typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("jsdom");
}

export function GalleryRiveShowcase() {
  const shouldRenderRive = !isTestEnvironment();

  return (
    <div
      className="gallery-rive-showcase"
      data-rive-artboard={BLACK_CAT_RIVE_ARTBOARD}
      data-rive-hover-input={BLACK_CAT_RIVE_HOVER_INPUT}
      data-rive-src={BLACK_CAT_RIVE_SRC}
      data-rive-state-machine={BLACK_CAT_RIVE_STATE_MACHINE}
      data-rive-touch-interaction="true"
    >
      <div className="gallery-rive-panel">
        {shouldRenderRive ? (
          <Suspense fallback={<div className="gallery-rive-fallback" />}>
            <GalleryRiveCanvas
              artboard={BLACK_CAT_RIVE_ARTBOARD}
              hoverInput={BLACK_CAT_RIVE_HOVER_INPUT}
              src={BLACK_CAT_RIVE_SRC}
              stateMachine={BLACK_CAT_RIVE_STATE_MACHINE}
            />
          </Suspense>
        ) : (
          <div className="gallery-rive-fallback" />
        )}
      </div>
    </div>
  );
}
