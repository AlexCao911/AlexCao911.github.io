import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

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

type SurfaceElement = "div" | "button" | "a";

export interface LiquidGlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: SurfaceElement;
  borderRadius?: string;
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
  width?: string;
  height?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  children?: ReactNode;
}

function usePrefersDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

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
  if (typeof CSS.supports !== "function") return false;
  return CSS.supports("backdrop-filter", "blur(10px)") || CSS.supports("-webkit-backdrop-filter", "blur(10px)");
}

export const LiquidGlassSurface = forwardRef<HTMLElement, LiquidGlassSurfaceProps>(function LiquidGlassSurface(
  {
    as = "div",
    borderRadius,
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
    width,
    height,
    className,
    style,
    children,
    ...rest
  },
  forwardedRef
) {
  const uniqueId = useId().replace(/:/g, "-");
  const filterId = `liquid-glass-filter-${uniqueId}`;
  const redGradId = `liquid-red-grad-${uniqueId}`;
  const blueGradId = `liquid-blue-grad-${uniqueId}`;

  const containerRef = useRef<HTMLElement | null>(null);
  const feImageRef = useRef<SVGFEImageElement>(null);
  const redChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const greenChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const blueChannelRef = useRef<SVGFEDisplacementMapElement>(null);
  const gaussianBlurRef = useRef<SVGFEGaussianBlurElement>(null);
  const [svgSupported, setSvgSupported] = useState(false);
  const isDarkMode = usePrefersDark();

  const setRefs = (node: HTMLElement | null) => {
    containerRef.current = node;

    if (typeof forwardedRef === "function") {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const actualWidth = rect?.width || 48;
    const actualHeight = rect?.height || 48;
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

    const userAgent = navigator.userAgent;
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isIOSWebKit =
      /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const testElement = document.createElement("div");
    const webkitStyle = testElement.style as CSSStyleDeclaration & { WebkitBackdropFilter?: string };

    testElement.style.backdropFilter = `url(#${filterId})`;
    webkitStyle.WebkitBackdropFilter = `url(#${filterId})`;

    const supportsSvgBackdropFilter = testElement.style.backdropFilter !== "" || webkitStyle.WebkitBackdropFilter !== "";

    setSvgSupported(!isFirefox && !isIOSWebKit && supportsSvgBackdropFilter);
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

  const surfaceStyle: CSSProperties = { ...style };

  if (width) surfaceStyle.width = width;
  if (height) surfaceStyle.height = height;
  if (borderRadius) surfaceStyle.borderRadius = borderRadius;

  if (svgSupported) {
    surfaceStyle.background = isDarkMode
      ? `hsl(0 0% 0% / ${backgroundOpacity})`
      : `hsl(0 0% 100% / ${backgroundOpacity})`;
    surfaceStyle.backdropFilter = `url(#${filterId}) saturate(${saturation})`;
    surfaceStyle.WebkitBackdropFilter = `url(#${filterId}) saturate(${saturation})`;
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
    surfaceStyle.boxShadow =
      "inset 0 1px 0 rgba(255, 255, 255, 0.48), inset 0 -1px 0 rgba(17, 17, 17, 0.1), 0 10px 28px rgba(17, 17, 26, 0.1)";
  } else {
    surfaceStyle.background = "rgba(255, 255, 255, 0.26)";
    surfaceStyle.border = "1px solid rgba(255, 255, 255, 0.34)";
    surfaceStyle.boxShadow = "inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.25)";
  }

  const Component = as;

  return (
    <Component
      ref={setRefs as never}
      className={["liquid-glass-surface", className].filter(Boolean).join(" ")}
      style={surfaceStyle}
      {...(rest as Record<string, unknown>)}
    >
      {children}
      <svg className="liquid-glass-filter" xmlns="http://www.w3.org/2000/svg">
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
      <span className="liquid-glass-highlight" />
    </Component>
  );
});
