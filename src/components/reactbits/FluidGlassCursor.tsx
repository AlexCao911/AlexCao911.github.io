import { useEffect, useState } from "react";
import { LiquidGlassSurface } from "./LiquidGlassSurface";

interface FluidGlassCursorProps {
  size?: number;
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
      <LiquidGlassSurface
        className="fluid-glass-cursor-surface"
        width={`${size}px`}
        height={`${size}px`}
        borderRadius={`${size}px`}
      />
    </div>
  );
}
