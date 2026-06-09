import { lazy, Suspense, useEffect, useState } from "react";
import { LiquidGlassSurface } from "./reactbits/LiquidGlassSurface";
import "./GalleryRiveShowcase.css";

let galleryRiveCanvasPromise: Promise<{ default: typeof import("./GalleryRiveCanvas").default }> | null = null;
let blackCatRiveBufferPromise: Promise<ArrayBuffer> | null = null;

const BLACK_CAT_RIVE_SRC = "/assets/rive/black-cat.riv";
const BLACK_CAT_RIVE_POSTER_SRC = "/assets/rive/black-cat-poster.png";
const BLACK_CAT_RIVE_ARTBOARD = "WCT 01";
const BLACK_CAT_RIVE_STATE_MACHINE = "BLACK CATW";
const BLACK_CAT_RIVE_HOVER_INPUT = "Hover";
const PRELOAD_LINK_ID = "black-cat-rive-preload";

function loadGalleryRiveCanvas() {
  galleryRiveCanvasPromise ??= import("./GalleryRiveCanvas");
  return galleryRiveCanvasPromise;
}

const GalleryRiveCanvas = lazy(loadGalleryRiveCanvas);

function ensureRivePreloadLink() {
  if (typeof document === "undefined" || document.getElementById(PRELOAD_LINK_ID)) return;

  const link = document.createElement("link");
  link.id = PRELOAD_LINK_ID;
  link.rel = "preload";
  link.as = "fetch";
  link.href = BLACK_CAT_RIVE_SRC;
  link.crossOrigin = "anonymous";
  link.setAttribute("fetchpriority", "high");
  document.head.appendChild(link);
}

function loadBlackCatRiveBuffer() {
  blackCatRiveBufferPromise ??= fetch(BLACK_CAT_RIVE_SRC, { cache: "force-cache" }).then((response) => {
    if (!response.ok) {
      throw new Error(`Unable to load black cat Rive asset: ${response.status}`);
    }

    return response.arrayBuffer();
  });

  return blackCatRiveBufferPromise;
}

function isTestEnvironment() {
  return typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("jsdom");
}

function GalleryRiveFallback() {
  return (
    <div className="gallery-rive-fallback">
      <img
        aria-hidden="true"
        className="gallery-rive-poster"
        decoding="async"
        fetchPriority="high"
        src={BLACK_CAT_RIVE_POSTER_SRC}
        alt=""
      />
    </div>
  );
}

export function GalleryRiveShowcase() {
  const shouldRenderRive = !isTestEnvironment();
  const [riveBuffer, setRiveBuffer] = useState<ArrayBuffer | null>(null);
  const [useSrcFallback, setUseSrcFallback] = useState(false);

  useEffect(() => {
    if (!shouldRenderRive) return;

    let isMounted = true;

    ensureRivePreloadLink();

    void loadGalleryRiveCanvas();
    void loadBlackCatRiveBuffer()
      .then((buffer) => {
        if (isMounted) {
          setRiveBuffer(buffer);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUseSrcFallback(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [shouldRenderRive]);

  const canRenderCanvas = shouldRenderRive && (riveBuffer || useSrcFallback);
  const loadMode = shouldRenderRive ? (riveBuffer ? "buffer" : useSrcFallback ? "src-fallback" : "loading") : "test-fallback";

  return (
    <div
      className="gallery-rive-showcase"
      data-rive-artboard={BLACK_CAT_RIVE_ARTBOARD}
      data-rive-glass-frame="true"
      data-rive-hover-input={BLACK_CAT_RIVE_HOVER_INPUT}
      data-rive-load-mode={loadMode}
      data-rive-load-strategy="poster-buffer"
      data-rive-poster={BLACK_CAT_RIVE_POSTER_SRC}
      data-rive-runtime="lite"
      data-rive-src={BLACK_CAT_RIVE_SRC}
      data-rive-state-machine={BLACK_CAT_RIVE_STATE_MACHINE}
      data-rive-touch-interaction="true"
    >
      <LiquidGlassSurface className="gallery-rive-panel" borderRadius="8px">
        <div className="gallery-rive-viewport">
          {canRenderCanvas ? (
            <Suspense fallback={<GalleryRiveFallback />}>
              <GalleryRiveCanvas
                artboard={BLACK_CAT_RIVE_ARTBOARD}
                buffer={riveBuffer ?? undefined}
                hoverInput={BLACK_CAT_RIVE_HOVER_INPUT}
                src={useSrcFallback ? BLACK_CAT_RIVE_SRC : undefined}
                stateMachine={BLACK_CAT_RIVE_STATE_MACHINE}
              />
            </Suspense>
          ) : (
            <GalleryRiveFallback />
          )}
        </div>
      </LiquidGlassSurface>
    </div>
  );
}
