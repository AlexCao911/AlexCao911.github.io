import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

type Channel = "R" | "G" | "B";
type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity"
  | "plus-darker"
  | "plus-lighter";

interface FluidGlassCursorProps {
  size?: number;
}

interface GlassCursorSurfaceProps {
  size: number;
  borderWidth?: number;
  brightness?: number;
  opacity?: number;
  blur?: number;
  displace?: number;
  backgroundOpacity?: number;
  saturation?: number;
  distortionScale?: number;
  redOffset?: number;
  greenOffset?: number;
  blueOffset?: number;
  xChannel?: Channel;
  yChannel?: Channel;
  mixBlendMode?: BlendMode;
}

function usePrefersDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setIsDark(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return isDark;
}

function supportsBackdropFilter() {
  if (typeof CSS === "undefined") return false;
  return CSS.supports("backdrop-filter", "blur(10px)") || CSS.supports("-webkit-backdrop-filter", "blur(10px)");
}

export function FluidGlassCursor({ size = 48 }: FluidGlassCursorProps) {
  const isTest = import.meta.env.MODE === "test";
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (isTest || typeof window === "undefined") return;

    const media = window.matchMedia("(pointer: fine)");
    const sync = () => setEnabled(media.matches);
    sync();

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [isTest]);

  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    document.documentElement.classList.add("fluid-glass-cursor-active");
    return () => document.documentElement.classList.remove("fluid-glass-cursor-active");
  }, [enabled]);

  useEffect(() => {
    if (!enabled || isTest || typeof window === "undefined") return;

    const setCursorVars = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--fluid-cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--fluid-cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", setCursorVars, { passive: true });
    return () => window.removeEventListener("pointermove", setCursorVars);
  }, [enabled, isTest]);

  if (isTest) return <div className="fluid-glass-cursor" aria-hidden="true" />;
  if (!enabled) return null;

  return (
    <div className="fluid-glass-cursor" aria-hidden="true">
      <GlassCursorSurface size={size} />
    </div>
  );
}

function GlassCursorSurface({
  size,
  borderWidth = 0.12,
  brightness = 58,
  opacity = 0.9,
  blur = 9,
  displace = 0.45,
  backgroundOpacity = 0.055,
  saturation = 1.42,
  distortionScale = -120,
  redOffset = 0,
  greenOffset = 9,
  blueOffset = 18,
  xChannel = "R",
  yChannel = "G",
  mixBlendMode = "difference",
}: GlassCursorSurfaceProps) {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `cursor-glass-filter-${uniqueId}`;
  const redGradId = `cursor-red-grad-${uniqueId}`;
  const blueGradId = `cursor-blue-grad-${uniqueId}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const [svgSupported, setSvgSupported] = useState(false);
  const isDarkMode = usePrefersDark();

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || size;
    const actualHeight = rect?.height || size;
    const radius = Math.min(actualWidth, actualHeight) / 2;
    const edgeSize = Math.min(actualWidth, actualHeight) * (borderWidth * 0.5);

    const svgContent = `
      <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="red"/>
          </linearGradient>
          <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0000"/>
            <stop offset="100%" stop-color="blue"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"/>
        <circle cx="${actualWidth / 2}" cy="${actualHeight / 2}" r="${radius}" fill="url(#${redGradId})"/>
        <circle cx="${actualWidth / 2}" cy="${actualHeight / 2}" r="${radius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${mixBlendMode}"/>
        <circle cx="${actualWidth / 2}" cy="${actualHeight / 2}" r="${Math.max(0, radius - edgeSize)}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)"/>
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  };

  const updateDisplacementMap = () => {
    feImageRef.current?.setAttribute("href", generateDisplacementMap());
  };

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const isWebkit = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const testElement = document.createElement("div");
    testElement.style.backdropFilter = `url(#${filterId})`;

    setSvgSupported(!isWebkit && !isFirefox && testElement.style.backdropFilter !== "");
  }, [filterId]);

  useEffect(() => {
    updateDisplacementMap();

    [
      { ref: redChannelRef, offset: redOffset },
      { ref: greenChannelRef, offset: greenOffset },
      { ref: blueChannelRef, offset: blueOffset },
    ].forEach(({ ref, offset }) => {
      if (!ref.current) return;
      ref.current.setAttribute("scale", (distortionScale + offset).toString());
      ref.current.setAttribute("xChannelSelector", xChannel);
      ref.current.setAttribute("yChannelSelector", yChannel);
    });

    gaussianBlurRef.current?.setAttribute("stdDeviation", displace.toString());
  }, [
    size,
    borderWidth,
    brightness,
    opacity,
    blur,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
    mixBlendMode,
  ]);

  useEffect(() => {
    if (!containerRef.current || typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(() => {
      window.setTimeout(updateDisplacementMap, 0);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const surfaceStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: `${size}px`,
  };

  if (svgSupported) {
    surfaceStyle.background = isDarkMode
      ? `hsl(0 0% 0% / ${backgroundOpacity})`
      : `hsl(0 0% 100% / ${backgroundOpacity})`;
    surfaceStyle.backdropFilter = `url(#${filterId}) saturate(${saturation})`;
    surfaceStyle.boxShadow = isDarkMode
      ? `0 0 2px 1px color-mix(in oklch, white, transparent 66%) inset,
         0 0 10px 4px color-mix(in oklch, white, transparent 86%) inset,
         0 10px 28px rgba(17, 17, 26, 0.12)`
      : `0 0 2px 1px color-mix(in oklch, black, transparent 82%) inset,
         0 0 10px 4px color-mix(in oklch, black, transparent 92%) inset,
         0 10px 28px rgba(17, 17, 26, 0.1)`;
  } else if (supportsBackdropFilter()) {
    surfaceStyle.background = "rgba(255, 255, 255, 0.16)";
    surfaceStyle.backdropFilter = "blur(10px) saturate(1.6) brightness(1.08)";
    surfaceStyle.WebkitBackdropFilter = "blur(10px) saturate(1.6) brightness(1.08)";
    surfaceStyle.border = "1px solid rgba(255, 255, 255, 0.36)";
    surfaceStyle.boxShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.48), inset 0 -1px 0 rgba(17, 17, 17, 0.1), 0 10px 28px rgba(17, 17, 26, 0.1)";
  } else {
    surfaceStyle.background = "rgba(255, 255, 255, 0.26)";
    surfaceStyle.border = "1px solid rgba(255, 255, 255, 0.34)";
    surfaceStyle.boxShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.25)";
  }

  return (
    <div ref={containerRef} className="fluid-glass-cursor-surface" style={surfaceStyle}>
      <svg className="fluid-glass-cursor-filter" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="0%" y="0%" width="100%" height="100%">
            <feImage ref={feImageRef} x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

            <feDisplacementMap ref={redChannelRef} in="SourceGraphic" in2="map" result="dispRed" />
            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="red"
            />

            <feDisplacementMap ref={greenChannelRef} in="SourceGraphic" in2="map" result="dispGreen" />
            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
              result="green"
            />

            <feDisplacementMap ref={blueChannelRef} in="SourceGraphic" in2="map" result="dispBlue" />
            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
              result="blue"
            />

            <feBlend in="red" in2="green" mode="screen" result="rg" />
            <feBlend in="rg" in2="blue" mode="screen" result="output" />
            <feGaussianBlur ref={gaussianBlurRef} in="output" stdDeviation="0.45" />
          </filter>
        </defs>
      </svg>
      <span className="fluid-glass-cursor-highlight" />
    </div>
  );
}
